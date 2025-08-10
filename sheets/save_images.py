# pip install playwright requests
# python -m playwright install

import os, re, time, requests
from urllib.parse import urljoin, urlsplit, urlunsplit
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

URL = "https://eldenringnightreign.wiki.fextralife.com/Magic+Spells"
OUT_DIR = "magic_images"
ALLOW_SUBSTR = "/file/Elden-Ring-Nightreign/"
PREFER_SUFFIX = re.compile(r"(?:^|/)[^/]+(?:200px|175px)\.(?:png|jpg|jpeg|webp)$", re.I)

def absolutize(base, url):
    if not url: return None
    u = urljoin(base, url)
    p = urlsplit(u)
    return urlunsplit((p.scheme, p.netloc, p.path, p.query, ""))

def expand_everything(page):
    # Open <details> blocks
    page.evaluate("""() => { document.querySelectorAll('details').forEach(d => d.open = true); }""")
    # Click common expanders/toggles
    texts = ["show more", "load more", "expand", "view all"]
    selectors = [
        "[aria-expanded='false']",
        ".mw-collapsible-toggle", ".collapse-toggle", ".collapsible-toggle",
        ".accordion-button", ".accordion-toggle", ".toggle", ".expander"
    ]
    # Click by text
    for t in texts:
        for el in page.locator(f"text={t}").all():
            try: el.click(timeout=500)
            except: pass
    # Click by selector
    for sel in selectors:
        for el in page.locator(sel).all():
            try: el.click(timeout=500)
            except: pass

def slow_scroll(page, rounds=12, pause_ms=500):
    last_h = 0
    for _ in range(rounds):
        h = page.evaluate("""() => {
            window.scrollBy(0, document.documentElement.clientHeight * 0.9);
            return document.body.scrollHeight;
        }""")
        if h == last_h: break
        last_h = h
        page.wait_for_timeout(pause_ms)
    # small scroll up to catch lazy observers
    for _ in range(3):
        page.evaluate("window.scrollBy(0, -200)")
        page.wait_for_timeout(200)

def collect_image_urls_sync():
    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        ctx = browser.new_context()
        page = ctx.new_page()
        page.goto(URL, wait_until="domcontentloaded")
        page.wait_for_timeout(1200)

        # expand sections and scroll in waves
        for _ in range(3):
            expand_everything(page)
            slow_scroll(page, rounds=14, pause_ms=450)

        html = page.content()
        browser.close()

    # Parse the final DOM with BS4 (to also catch <noscript> and background-image)
    soup = BeautifulSoup(html, "html.parser")
    found = set()

    def add(u):
        u = absolutize(URL, u)
        if not u: return
        if ALLOW_SUBSTR not in u: return
        found.add(u)

    # img tags (src/lazy/srcset)
    for img in soup.find_all("img"):
        for attr in ("data-src","data-original","data-lazy","data-lazy-src","data-echo","data-image","src"):
            if img.get(attr): add(img[attr])
        for attr in ("data-srcset","srcset"):
            if img.get(attr):
                parts = [p.strip() for p in img[attr].split(",") if p.strip()]
                if parts:
                    add(parts[-1].split()[0])  # largest

    # <picture><source srcset>
    for src in soup.find_all("source"):
        for attr in ("srcset","data-srcset"):
            if src.get(attr):
                parts = [p.strip() for p in src[attr].split(",") if p.strip()]
                if parts:
                    add(parts[-1].split()[0])

    # <noscript><img>
    for ns in soup.find_all("noscript"):
        nsoup = BeautifulSoup(ns.get_text(" ", strip=True), "html.parser")
        for img in nsoup.find_all("img"):
            if img.get("src"): add(img["src"])

    # inline CSS background-image
    for el in soup.find_all(style=True):
        m = re.search(r'background-image\s*:\s*url\((["\']?)(.+?)\1\)', el["style"], flags=re.I)
        if m: add(m.group(2))

    # prefer 200/175px when duplicates share basename
    by_name = {}
    for u in found:
        name = os.path.basename(urlsplit(u).path).lower()
        by_name.setdefault(name, []).append(u)

    chosen = []
    for group in by_name.values():
        pref = [g for g in group if PREFER_SUFFIX.search(g)]
        chosen.append(pref[0] if pref else group[0])

    return sorted(set(chosen))

def safe_filename(url):
    base = os.path.basename(urlsplit(url).path) or "image"
    base = base.split("?")[0]
    return re.sub(r"[^A-Za-z0-9._-]+", "_", base)

def download_all(img_urls):
    os.makedirs(OUT_DIR, exist_ok=True)
    s = requests.Session(); s.headers.update({"User-Agent":"Mozilla/5.0"})
    for i, u in enumerate(img_urls, 1):
        fn = os.path.join(OUT_DIR, safe_filename(u))
        root, ext = os.path.splitext(fn); k = 1
        while os.path.exists(fn):
            fn = f"{root}_{k}{ext}"; k += 1
        try:
            r = s.get(u, stream=True, timeout=60); r.raise_for_status()
            with open(fn, "wb") as f:
                for chunk in r.iter_content(8192):
                    f.write(chunk)
            print(f"[{i}/{len(img_urls)}] {fn}")
        except Exception as e:
            print(f"[{i}/{len(img_urls)}] FAIL {u} -> {e}")

imgs = collect_image_urls_sync()
print(f"Found {len(imgs)} weapon images on the hub page.")
download_all(imgs)

