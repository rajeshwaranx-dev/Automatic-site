import os, re, json, base64, logging, requests
from telegram import Update
from telegram.ext import ApplicationBuilder, MessageHandler, filters, ContextTypes

BOT_TOKEN      = os.environ["BOT_TOKEN"]
GITHUB_TOKEN   = os.environ["GITHUB_TOKEN"]
GITHUB_REPO    = os.environ["GITHUB_REPO"]
GITHUB_BRANCH  = os.environ.get("GITHUB_BRANCH", "main")
JSON_FILE_PATH = os.environ.get("JSON_FILE_PATH", "movies.json")
CHANNEL_ID     = os.environ["CHANNEL_ID"]
WEBHOOK_URL    = os.environ["WEBHOOK_URL"]   # e.g. https://your-app.koyeb.app

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

GITHUB_API     = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{JSON_FILE_PATH}"
GITHUB_IMG_API = f"https://api.github.com/repos/{GITHUB_REPO}/contents/posters"
HEADERS        = {"Authorization": f"token {GITHUB_TOKEN}", "Accept": "application/vnd.github+json"}

def get_movies_from_github():
    r = requests.get(GITHUB_API, headers=HEADERS, params={"ref": GITHUB_BRANCH})
    r.raise_for_status()
    data = r.json()
    return json.loads(base64.b64decode(data["content"]).decode()), data["sha"]

def save_movies_to_github(movies, sha, title):
    payload = {
        "message": f"Add movie: {title}",
        "content": base64.b64encode(json.dumps(movies, indent=2, ensure_ascii=False).encode()).decode(),
        "sha": sha, "branch": GITHUB_BRANCH
    }
    requests.put(GITHUB_API, headers=HEADERS, json=payload).raise_for_status()
    log.info("✅ movies.json updated on GitHub")

def upload_poster_to_github(image_bytes, filename):
    url = f"{GITHUB_IMG_API}/{filename}"
    sha = None
    check = requests.get(url, headers=HEADERS, params={"ref": GITHUB_BRANCH})
    if check.status_code == 200:
        sha = check.json().get("sha")
    payload = {"message": f"Add poster: {filename}",
               "content": base64.b64encode(image_bytes).decode(),
               "branch": GITHUB_BRANCH}
    if sha:
        payload["sha"] = sha
    requests.put(url, headers=HEADERS, json=payload).raise_for_status()
    raw_url = f"https://raw.githubusercontent.com/{GITHUB_REPO}/{GITHUB_BRANCH}/posters/{filename}"
    log.info(f"🖼  Poster uploaded: {raw_url}")
    return raw_url

def strip_emojis(text):
    return re.compile("["u"\U0001F300-\U0001F9FF"u"\U00002700-\U000027BF"
                      u"\U0001F1E0-\U0001F1FF"u"\U00002500-\U00002BEF"
                      u"\U0001F004-\U0001F0CF"+"]+", flags=re.UNICODE).sub("", text).strip()

def parse_categories(audio_str, quality):
    cats, a = [], audio_str.lower()
    if "tamil"   in a: cats.append("Tamil")
    if "english" in a: cats.append("English")
    if "telugu"  in a: cats.append("Telugu")
    if "hindi"   in a: cats.append("Hindi")
    q = quality.upper().replace("-","").replace(" ","")
    if q in ("HD","WEBDL","WEBRIP","BLURAY","BDRIP","HDRIP"): cats.append("HD")
    elif q in ("PREDVD","HDCAM","CAM","DVDSCR"): cats.append("PreDvd")
    return cats or ["Tamil"]

def parse_caption(text):
    fields = {}
    for line in text.splitlines():
        m = re.match(r'^(Title|Year|Quality|Audio)\s*[:\-]\s*(.+)', strip_emojis(line), re.IGNORECASE)
        if m:
            fields[m.group(1).lower()] = m.group(2).strip()
            continue
        um = re.search(r'https?://\S+', line)
        if um and ("get all files" in line.lower() or "one link" in line.lower()):
            fields["link"] = um.group(0).strip()
    log.info(f"Parsed fields: {fields}")
    for req in ["title","year","quality"]:
        if req not in fields:
            log.warning(f"Missing: {req}"); return None
    try: year = int(re.search(r'\d{4}', fields["year"]).group())
    except: return None
    audio, quality = fields.get("audio",""), fields["quality"]
    cats = parse_categories(audio, quality)
    q = quality.upper().replace("-","").replace(" ","")
    if q in ("WEBDL","WEBRIP","BLURAY","BDRIP","HDRIP"): qlabel = "HD"
    elif q in ("PREDVD","HDCAM","CAM","DVDSCR"): qlabel = "PreDvd"
    else: qlabel = quality
    return {"title": fields["title"], "year": year, "quality": qlabel,
            "category": cats, "telegramLink": fields.get("link","https://t.me/askmovies"), "image": None}

async def handle_channel_post(update: Update, context: ContextTypes.DEFAULT_TYPE):
    msg = update.channel_post or update.message
    if not msg or str(msg.chat.id) != str(CHANNEL_ID): return
    caption = msg.caption or msg.text or ""
    if not caption.strip(): return
    log.info(f"📩 New post:\n{caption[:300]}")
    movie = parse_caption(caption)
    if not movie:
        log.info("⚠️ Skipping — format not recognised"); return

    if msg.photo:
        try:
            tg_file = await context.bot.get_file(msg.photo[-1].file_id)
            log.info(f"Downloading poster: {tg_file.file_path}")
            img = requests.get(tg_file.file_path, timeout=30)
            img.raise_for_status()
            filename = f"{re.sub(r'[^a-zA-Z0-9_-]','_',movie['title'])}_{movie['year']}.jpg"
            movie["image"] = upload_poster_to_github(img.content, filename)
        except Exception as e:
            log.error(f"Poster upload failed: {e}")
            movie["image"] = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400"
    else:
        movie["image"] = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400"

    try:
        movies, sha = get_movies_from_github()
    except Exception as e:
        log.error(f"❌ Cannot fetch movies.json: {e}"); return

    movie["id"] = (max(m.get("id",0) for m in movies) + 1) if movies else 1
    movies.insert(0, movie)
    try:
        save_movies_to_github(movies, sha, movie["title"])
        log.info(f"🎬 Added '{movie['title']}' ({movie['year']})")
    except Exception as e:
        log.error(f"❌ GitHub update failed: {e}")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    webhook_path = f"/webhook/{BOT_TOKEN}"
    full_webhook_url = f"{WEBHOOK_URL.rstrip('/')}{webhook_path}"

    log.info(f"🤖 AskMovies bot starting (webhook mode) on port {port}")
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(MessageHandler(filters.ALL, handle_channel_post))
    app.run_webhook(
        listen="0.0.0.0",
        port=port,
        url_path=webhook_path,
        webhook_url=full_webhook_url
    )
    
