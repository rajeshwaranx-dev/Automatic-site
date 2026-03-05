"""
AskMovies Telegram Bot — Auto-parses your real channel post format
==================================================================
Reads posts exactly like:

    AskMovies
    🎬 Title: Vladimir
    📅 Year : 2026
    🎞 Quality: WEB-DL
    🎧 Audio: Tamil + Telugu + Hindi

    🔺Telegram File 🔻
    🌶 Vladimir (2026) ...mkv

    📦Get all files in one link: https://Askmovies.lcubots.news/?start=fs_MjI0MDk=

    Note 🚫: If the link is not working...

    ❤️Join » @Askmovies4
    🌐Search » @Askmovieslink1

No changes needed to how you post! Bot handles everything automatically.
"""

import os
import re
import json
import base64
import logging
import requests
from telegram import Update
from telegram.ext import ApplicationBuilder, MessageHandler, filters, ContextTypes

# ── Secrets (set these in Render.com environment variables) ───
BOT_TOKEN      = os.environ["BOT_TOKEN"]        # From @BotFather
GITHUB_TOKEN   = os.environ["GITHUB_TOKEN"]     # GitHub Personal Access Token
GITHUB_REPO    = os.environ["GITHUB_REPO"]      # e.g. yourname/askmovies-site
GITHUB_BRANCH  = os.environ.get("GITHUB_BRANCH", "main")
JSON_FILE_PATH = os.environ.get("JSON_FILE_PATH", "movies.json")
CHANNEL_ID     = os.environ["CHANNEL_ID"]       # e.g. -1001234567890

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

GITHUB_API     = f"https://api.github.com/repos/{GITHUB_REPO}/contents/{JSON_FILE_PATH}"
GITHUB_IMG_API = f"https://api.github.com/repos/{GITHUB_REPO}/contents/posters"
HEADERS        = {"Authorization": f"token {GITHUB_TOKEN}", "Accept": "application/vnd.github+json"}


# ── GitHub: read movies.json ──────────────────────────────────
def get_movies_from_github():
    r = requests.get(GITHUB_API, headers=HEADERS, params={"ref": GITHUB_BRANCH})
    r.raise_for_status()
    data = r.json()
    content = base64.b64decode(data["content"]).decode("utf-8")
    return json.loads(content), data["sha"]


# ── GitHub: write movies.json ─────────────────────────────────
def save_movies_to_github(movies, sha, title):
    content = json.dumps(movies, indent=2, ensure_ascii=False)
    encoded = base64.b64encode(content.encode("utf-8")).decode("utf-8")
    payload = {
        "message": f"Add movie: {title}",
        "content": encoded,
        "sha": sha,
        "branch": GITHUB_BRANCH
    }
    r = requests.put(GITHUB_API, headers=HEADERS, json=payload)
    r.raise_for_status()
    log.info("✅ movies.json updated on GitHub")


# ── GitHub: upload poster image → returns raw URL ────────────
def upload_poster_to_github(image_bytes: bytes, filename: str) -> str:
    encoded = base64.b64encode(image_bytes).decode("utf-8")
    url = f"{GITHUB_IMG_API}/{filename}"

    # Check if file already exists (need sha to overwrite)
    sha = None
    check = requests.get(url, headers=HEADERS, params={"ref": GITHUB_BRANCH})
    if check.status_code == 200:
        sha = check.json().get("sha")

    payload = {
        "message": f"Add poster: {filename}",
        "content": encoded,
        "branch": GITHUB_BRANCH
    }
    if sha:
        payload["sha"] = sha

    r = requests.put(url, headers=HEADERS, json=payload)
    r.raise_for_status()

    raw_url = f"https://raw.githubusercontent.com/{GITHUB_REPO}/{GITHUB_BRANCH}/posters/{filename}"
    log.info(f"🖼  Poster uploaded: {raw_url}")
    return raw_url


# ── Strip emojis from a string ────────────────────────────────
def strip_emojis(text: str) -> str:
    emoji_pattern = re.compile(
        "["
        u"\U0001F300-\U0001F9FF"
        u"\U00002700-\U000027BF"
        u"\U0001F1E0-\U0001F1FF"
        u"\U00002500-\U00002BEF"
        u"\U0001F004-\U0001F0CF"
        "]+", flags=re.UNICODE
    )
    return emoji_pattern.sub("", text).strip()


# ── Map audio/language string to site categories ──────────────
def parse_categories(audio_str: str, quality: str) -> list:
    categories = []
    audio_lower = audio_str.lower()

    if "tamil"   in audio_lower: categories.append("Tamil")
    if "english" in audio_lower: categories.append("English")
    if "telugu"  in audio_lower: categories.append("Telugu")
    if "hindi"   in audio_lower: categories.append("Hindi")

    q = quality.upper().replace("-", "").replace(" ", "")
    if q in ("HD", "WEBDL", "WEBRIP", "BLURAY", "BDRIP"):
        categories.append("HD")
    elif q in ("PREDVD", "HDCAM", "CAM", "DVDSCR"):
        categories.append("PreDvd")

    return categories if categories else ["Tamil"]


# ── Parse caption in your exact channel format ────────────────
def parse_caption(text: str) -> dict | None:
    """
    Parses captions like:
        AskMovies
        🎬 Title: Vladimir
        📅 Year : 2026
        🎞 Quality: WEB-DL
        🎧 Audio: Tamil + Telugu + Hindi
        ...
        📦Get all files in one link: https://...
    """
    fields = {}

    for line in text.splitlines():
        line_clean = strip_emojis(line)

        # Parse Title / Year / Quality / Audio fields
        m = re.match(r'^(Title|Year|Quality|Audio)\s*[:\-]\s*(.+)', line_clean, re.IGNORECASE)
        if m:
            key = m.group(1).lower()
            val = m.group(2).strip()
            fields[key] = val
            continue

        # Extract the file-store download link
        url_match = re.search(r'https?://\S+', line)
        if url_match and ("get all files" in line.lower() or "one link" in line.lower()):
            fields["link"] = url_match.group(0).strip()

    log.info(f"Parsed fields: {fields}")

    for req in ["title", "year", "quality"]:
        if req not in fields:
            log.warning(f"Missing required field: {req}")
            return None

    try:
        year = int(re.search(r'\d{4}', fields["year"]).group())
    except Exception:
        log.warning("Could not parse year")
        return None

    audio   = fields.get("audio", "")
    quality = fields["quality"]
    cats    = parse_categories(audio, quality)

    # Normalize quality badge label
    q = quality.upper().replace("-", "").replace(" ", "")
    if q in ("WEBDL", "WEBRIP", "BLURAY", "BDRIP"):
        quality_label = "HD"
    elif q in ("PREDVD", "HDCAM", "CAM", "DVDSCR"):
        quality_label = "PreDvd"
    else:
        quality_label = quality  # keep as-is (e.g. "HD", "WEB-DL")

    return {
        "title":        fields["title"],
        "year":         year,
        "quality":      quality_label,
        "category":     cats,
        "telegramLink": fields.get("link", "https://t.me/askmovies"),
        "image":        None  # filled later from photo
    }


# ── Main Telegram handler ─────────────────────────────────────
async def handle_channel_post(update: Update, context: ContextTypes.DEFAULT_TYPE):
    msg = update.channel_post or update.message
    if not msg:
        return

    # Only your channel
    if str(msg.chat.id) != str(CHANNEL_ID):
        return

    caption = msg.caption or msg.text or ""
    if not caption.strip():
        return

    log.info(f"📩 New channel post:\n{caption[:400]}")

    movie = parse_caption(caption)
    if not movie:
        log.info("⚠️  Caption format not recognised — skipping.")
        return

    # ── Download poster from Telegram & upload to GitHub ─────
    if msg.photo:
        try:
            photo   = msg.photo[-1]                          # highest resolution
            tg_file = await context.bot.get_file(photo.file_id)
            img_res = requests.get(tg_file.file_path)
            img_res.raise_for_status()

            safe_name  = re.sub(r'[^a-zA-Z0-9_-]', '_', movie["title"])
            filename   = f"{safe_name}_{movie['year']}.jpg"
            poster_url = upload_poster_to_github(img_res.content, filename)
            movie["image"] = poster_url
        except Exception as e:
            log.error(f"Could not upload poster image: {e}")
            movie["image"] = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400"
    else:
        # No photo — use placeholder
        movie["image"] = "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400"

    # ── Push updated movies.json to GitHub ───────────────────
    try:
        movies, sha = get_movies_from_github()
    except Exception as e:
        log.error(f"❌ Could not fetch movies.json from GitHub: {e}")
        return

    movie["id"] = (max(m.get("id", 0) for m in movies) + 1) if movies else 1
    movies.insert(0, movie)  # newest appears first on site

    try:
        save_movies_to_github(movies, sha, movie["title"])
        log.info(f"🎬 Added '{movie['title']}' ({movie['year']}) | {movie['category']} | {movie['telegramLink']}")
    except Exception as e:
        log.error(f"❌ GitHub update failed: {e}")


# -- Health check server (required by Koyeb) ------------------
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler

class HealthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")
    def log_message(self, format, *args):
        pass

def run_health_server():
    port = int(os.environ.get("PORT", 8000))
    server = HTTPServer(("0.0.0.0", port), HealthHandler)
    log.info(f"Health check server on port {port}")
    server.serve_forever()

# -- Run -------------------------------------------------------
if __name__ == "__main__":
    t = threading.Thread(target=run_health_server, daemon=True)
    t.start()
    log.info("AskMovies bot starting")
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(MessageHandler(filters.ALL, handle_channel_post))
    app.run_polling(allowed_updates=["channel_post", "message"])
        
