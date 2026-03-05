import os, re, json, base64, logging, requests
from telegram import Update, MessageEntity
from telegram.ext import ApplicationBuilder, MessageHandler, filters, ContextTypes

BOT_TOKEN      = os.environ["BOT_TOKEN"]
GITHUB_TOKEN   = os.environ["GITHUB_TOKEN"]
GITHUB_REPO    = os.environ["GITHUB_REPO"]
GITHUB_BRANCH  = os.environ.get("GITHUB_BRANCH", "main")
JSON_FILE_PATH = os.environ.get("JSON_FILE_PATH", "movies.json")
CHANNEL_ID     = os.environ["CHANNEL_ID"]
WEBHOOK_URL    = os.environ["WEBHOOK_URL"]

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
    return re.compile(
        "[" u"\U0001F300-\U0001F9FF" u"\U00002700-\U000027BF"
        u"\U0001F1E0-\U0001F1FF" u"\U00002500-\U00002BEF"
        u"\U0001F004-\U0001F0CF" "]+", flags=re.UNICODE
    ).sub("", text).strip()

def parse_categories(audio_str, quality):
    cats, a = [], audio_str.lower()
    if "tamil"    in a: cats.append("Tamil")
    if "english"  in a: cats.append("English")
    if "telugu"   in a: cats.append("Telugu")
    if "hindi"    in a: cats.append("Hindi")
    if "malayalam"in a: cats.append("Malayalam")
    q = quality.upper().replace("-","").replace(" ","")
    if q in ("HD","WEBDL","WEBRIP","BLURAY","BDRIP","HDRIP"): cats.append("HD")
    elif q in ("PREDVD","HDCAM","CAM","DVDSCR"): cats.append("PreDvd")
    return cats or ["Tamil"]

def extract_links_from_entities(msg):
    """Extract all hyperlinks from Telegram message entities (clickable text links)."""
    links = []
    entities = msg.caption_entities or msg.entities or []
    for ent in entities:
        if ent.type == MessageEntity.TEXT_LINK and ent.url:
            links.append(ent.url)
    return links

def parse_caption(text, extra_links=None):
    """
    Supports both formats:

    Movie format:
        🎬 Title: Dubai
        📅 Year : 2025
        🎞 Quality: WEB-DL
        🎧 Audio: Tamil + Malayalam
        📦Get all files in one link: https://...

    Web series format:
        🎬 Title: Beast Games
        🌀 Season: 2
        🎞 Quality: WEB-DL
        📅 year : 2025
        🎧 Audio: TAMIL + TELUGU + HINDI
        📦 Get all files for: [hyperlinks]
    """
    fields = {}

    for line in text.splitlines():
        clean = strip_emojis(line)

        # Parse key: value fields (Title, Year, Quality, Audio, Season)
        m = re.match(r'^(Title|Year|Quality|Audio|Season)\s*[:\-]\s*(.+)', clean, re.IGNORECASE)
        if m:
            fields[m.group(1).lower()] = m.group(2).strip()
            continue

        # Plain URL in text (movie format)
        um = re.search(r'https?://\S+', line)
        if um and ("get all files" in line.lower() or "one link" in line.lower()):
            fields["link"] = um.group(0).strip()

    # Web series: use hyperlinks from entities if no plain URL found
    if "link" not in fields and extra_links:
        # prefer the first file-store link
        for lnk in extra_links:
            if "lcubots" in lnk or "t.me" in lnk or "start=fs_" in lnk:
                fields["link"] = lnk
                break
        if "link" not in fields and extra_links:
            fields["link"] = extra_links[0]

    log.info(f"Parsed fields: {fields}")

    for req in ["title", "year", "quality"]:
        if req not in fields:
            log.warning(f"Missing: {req}")
            return None

    try:
        year = int(re.search(r'\d{4}', fields["year"]).group())
    except:
        log.warning("Could not parse year")
        return None

    audio   = fields.get("audio", "")
    quality = fields["quality"]
    cats    = parse_categories(audio, quality)

    # Normalize quality label
    q = quality.upper().replace("-","").replace(" ","")
    if q in ("WEBDL","WEBRIP","BLURAY","BDRIP","HDRIP"): qlabel = "HD"
    elif q in ("PREDVD","HDCAM","CAM","DVDSCR"):          qlabel = "PreDvd"
    else:                                                  qlabel = quality

    # Build display title — append season if present
    title = fields["title"]
    if "season" in fields:
        season_num = re.search(r'\d+', fields["season"])
        if season_num:
            title = f"{title} S{season_num.group().zfill(2)}"

    return {
        "title":        title,
        "year":         year,
        "quality":      qlabel,
        "category":     cats,
        "telegramLink": fields.get("link", "https://t.me/askmovies"),
        "image":        None
    }

async def handle_channel_post(update: Update, context: ContextTypes.DEFAULT_TYPE):
    msg = update.channel_post or update.message
    if not msg or str(msg.chat.id) != str(CHANNEL_ID):
        return

    caption = msg.caption or msg.text or ""
    if not caption.strip():
        return

    log.info(f"📩 New post:\n{caption[:400]}")

    # Extract hyperlinks from entities (for web series format)
    extra_links = extract_links_from_entities(msg)
    if extra_links:
        log.info(f"🔗 Found entity links: {extra_links}")

    movie = parse_caption(caption, extra_links)
    if not movie:
        log.info("⚠️ Skipping — format not recognised")
        return

    # Download poster & upload to GitHub
    if msg.photo:
        try:
            tg_file = await context.bot.get_file(msg.photo[-1].file_id)
            log.info(f"Downloading poster: {tg_file.file_path}")
            img = requests.get(tg_file.file_path, timeout=30)
            img.raise_for_status()
            filename = f"{re.sub(r'[^a-zA-Z0-9_-]','_', movie['title'])}_{movie['year']}.jpg"
            movie["image"] = upload_poster_to_github(img.content, filename)
        except Exception as e:
            log.error(f"Poster upload failed: {e}")
            movie["image"] = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400"
    else:
        movie["image"] = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400"

    # Update movies.json on GitHub — retry up to 3 times on conflict
    for attempt in range(3):
        try:
            movies, sha = get_movies_from_github()
        except Exception as e:
            log.error(f"❌ Cannot fetch movies.json: {e}")
            return

        movie["id"] = (max(m.get("id", 0) for m in movies) + 1) if movies else 1
        # Remove duplicate if same title+year already exists
        movies = [m for m in movies if not (m.get("title") == movie["title"] and m.get("year") == movie["year"])]
        movies.insert(0, movie)

        try:
            save_movies_to_github(movies, sha, movie["title"])
            log.info(f"🎬 Added '{movie['title']}' ({movie['year']}) | {movie['category']}")
            break  # success
        except Exception as e:
            if "409" in str(e) and attempt < 2:
                log.warning(f"⚠️ SHA conflict, retrying ({attempt+1}/3)...")
                import time; time.sleep(2)
            else:
                log.error(f"❌ GitHub update failed: {e}")
                break

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    webhook_path = f"/webhook/{BOT_TOKEN}"
    full_webhook_url = f"{WEBHOOK_URL.rstrip('/')}{webhook_path}"

    log.info(f"🤖 AskMovies bot starting (webhook) on port {port}")
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(MessageHandler(filters.ALL, handle_channel_post))
    app.run_webhook(
        listen="0.0.0.0",
        port=port,
        url_path=webhook_path,
        webhook_url=full_webhook_url
                                                        )
    
