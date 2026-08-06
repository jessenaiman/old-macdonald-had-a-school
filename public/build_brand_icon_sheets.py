from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

PUBLIC = Path(__file__).resolve().parent
ROOT = PUBLIC.parents[1]
OUT = PUBLIC / "brand-kit-icon-sheets"
INDIVIDUAL = OUT / "individual-icons"
FACE = PUBLIC / "icons" / "early-years" / "face-patches"
TEXTURES = ROOT / "old-macdonald-had-a-school" / "texture-assets"
FONTS = PUBLIC / "brand-kit-demo-assets"

INK = "#30291F"
MUTED = "#746855"
CREAM = "#FFF8E9"
DENIM = "#1F4E5F"
TOMATO = "#B5272C"
MUSTARD = "#D99A22"
SAGE = "#55705A"

CAST = [
    ("Old MacDonald", "Headmaster", "#8B5E34", "old-macdonald-yellow.png"),
    ("Miss Hayley", "Grade 1/2 & drama", "#C9527A", "miss-hayley-purple.png"),
    ("Miss Puddles", "Daycare", "#E8A227", "miss-puddles-purple.png"),
    ("Mr Rusty", "Music & dance", "#2C6C9B", "mr-rusty-blue.png"),
    ("Mr Sam", "Math & building", "#1F6B6B", "mr-sam-blue.png"),
    ("Mr Maisy", "Physical education", "#B5272C", "mr-maisy-orange.png"),
    ("Mr Puddles", "Art & photography", "#4F5FA0", "mr-puddles-green.png"),
    ("Miss Maisy", "Gardening & health", "#55705A", "miss-maisy-purple.png"),
    ("Hopper", "Student · Rabbit", "#D9713C", "hopper-red.png"),
    ("Whiskers", "Student · Cat", "#7B4FA8", "whiskers-orange.png"),
    ("Scout", "Student · Dog", "#4A7A3A", "scout-green.png"),
    ("Penny", "Student · Chick", "#C9962E", "penny-orange.png"),
    ("Maisy", "Student · Cow", "#1F4E5F", "maisy-yellow.png"),
    ("Puddles", "Student · Duck", "#4FA0C9", "puddles-blue.png"),
    ("Sam", "Student · Pig", "#7A9A3D", "sam-red.png"),
    ("Rusty", "Student · Horse", "#8B5030", "rusty-blue.png"),
]

GRADES = [
    ("Daycare", "Ages 2–3", "#E8A227"),
    ("Kindergarten", "Early years", "#2C6C9B"),
    ("Grade 1", "Primary", "#C9527A"),
    ("Grade 2", "Primary", "#1F6B6B"),
]

SUBJECTS = [
    ("Community & leadership", "Gather · welcome · lead", "#8B5E34"),
    ("Early learning", "Play · share · explore", "#E8A227"),
    ("Music & dance", "Beat · sing · move", "#2C6C9B"),
    ("Drama & storytelling", "Imagine · speak · perform", "#C9527A"),
    ("Math & building", "Count · measure · make", "#1F6B6B"),
    ("Physical education", "Move · balance · play", "#B5272C"),
    ("Art & photography", "Observe · compose · create", "#4F5FA0"),
    ("Gardening & health", "Grow · prepare · care", "#55705A"),
]


def font(name, size):
    return ImageFont.truetype(str(FONTS / name), size)


TITLE = font("BricolageGrotesque-Bold.ttf", 88)
HEAD = font("BricolageGrotesque-Bold.ttf", 34)
BODY = font("InstrumentSans-Regular.ttf", 22)
SMALL = font("InstrumentSans-Bold.ttf", 17)
MONO = font("InstrumentSans-Regular.ttf", 16)


def texture_canvas(size):
    tile = Image.open(TEXTURES / "kraft-light-tile.png").convert("RGB")
    canvas = Image.new("RGB", size)
    for y in range(0, size[1], tile.height):
        for x in range(0, size[0], tile.width):
            canvas.paste(tile, (x, y))
    wash = Image.new("RGBA", size, (246, 232, 205, 120))
    return Image.alpha_composite(canvas.convert("RGBA"), wash)


def trim(im):
    im = im.convert("RGBA")
    box = im.getchannel("A").getbbox()
    return im.crop(box) if box else im


THREAD = {
    "h": trim(Image.open(TEXTURES / "stitch-horizontal.png")),
    "v": trim(Image.open(TEXTURES / "stitch-vertical.png")),
    "tl": trim(Image.open(TEXTURES / "stitch-corner-top-left.png")),
    "tr": trim(Image.open(TEXTURES / "stitch-corner-top-right.png")),
    "br": trim(Image.open(TEXTURES / "stitch-corner-bottom-right.png")),
    "bl": trim(Image.open(TEXTURES / "stitch-corner-bottom-left.png")),
}


def stitch_frame(base, rect):
    x0, y0, x1, y1 = rect
    seg_w, seg_h, corner = 110, 20, 38
    h = THREAD["h"].resize((seg_w, seg_h), Image.Resampling.LANCZOS)
    v = THREAD["v"].resize((seg_h, seg_w), Image.Resampling.LANCZOS)
    for x in range(x0 + corner, x1 - corner, seg_w):
        base.alpha_composite(h, (x, y0 - seg_h // 2))
        base.alpha_composite(h.rotate(180), (x, y1 - seg_h // 2))
    for y in range(y0 + corner, y1 - corner, seg_w):
        base.alpha_composite(v, (x0 - seg_h // 2, y))
        base.alpha_composite(v.rotate(180), (x1 - seg_h // 2, y))
    for key, pos in [("tl", (x0 - 5, y0 - 5)), ("tr", (x1 - corner + 5, y0 - 5)), ("br", (x1 - corner + 5, y1 - corner + 5)), ("bl", (x0 - 5, y1 - corner + 5))]:
        base.alpha_composite(THREAD[key].resize((corner, corner), Image.Resampling.LANCZOS), pos)


def card(base, rect, image, name, detail, color):
    x0, y0, x1, y1 = rect
    shadow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((x0 + 8, y0 + 13, x1 + 8, y1 + 13), radius=24, fill=(55, 39, 23, 48))
    base.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(10)))
    d = ImageDraw.Draw(base)
    d.rounded_rectangle(rect, radius=24, fill=CREAM, outline=(73, 57, 39, 45), width=3)
    d.rounded_rectangle((x0, y0, x1, y0 + 16), radius=8, fill=color)
    stitch_frame(base, (x0 + 18, y0 + 22, x1 - 18, y1 - 86))
    icon = trim(image)
    box_w, box_h = x1 - x0 - 76, y1 - y0 - 150
    icon.thumbnail((box_w, box_h), Image.Resampling.LANCZOS)
    ix = x0 + (x1 - x0 - icon.width) // 2
    iy = y0 + 38 + (box_h - icon.height) // 2
    base.alpha_composite(icon, (ix, iy))
    d.text((x0 + 24, y1 - 72), name, font=HEAD, fill=INK)
    d.text((x0 + 24, y1 - 34), detail, font=BODY, fill=MUTED)


def header(base, title, kicker, count):
    d = ImageDraw.Draw(base)
    d.rounded_rectangle((72, 60, 340, 102), radius=21, fill=DENIM)
    d.text((96, 70), kicker.upper(), font=SMALL, fill="#FFF8E9")
    d.text((72, 126), title, font=TITLE, fill=INK)
    d.text((72, 230), f"{count:02d} PRODUCTION ASSETS  ·  FELT APPLIQUÉ SYSTEM", font=MONO, fill=MUTED)
    d.line((72, 270, base.width - 72, 270), fill=(65, 50, 34, 70), width=3)


def keep_largest_alpha_component(im, threshold=20):
    im = im.convert("RGBA")
    alpha = im.getchannel("A")
    pixels = alpha.load()
    width, height = im.size
    seen = bytearray(width * height)
    largest = []
    for y in range(height):
        for x in range(width):
            idx = y * width + x
            if seen[idx] or pixels[x, y] <= threshold:
                continue
            component = []
            stack = [(x, y)]
            seen[idx] = 1
            while stack:
                cx, cy = stack.pop()
                component.append((cx, cy))
                for nx, ny in ((cx - 1, cy), (cx + 1, cy), (cx, cy - 1), (cx, cy + 1)):
                    if 0 <= nx < width and 0 <= ny < height:
                        ni = ny * width + nx
                        if not seen[ni] and pixels[nx, ny] > threshold:
                            seen[ni] = 1
                            stack.append((nx, ny))
            if len(component) > len(largest):
                largest = component
    clean_alpha = Image.new("L", im.size, 0)
    clean_pixels = clean_alpha.load()
    for x, y in largest:
        clean_pixels[x, y] = pixels[x, y]
    im.putalpha(clean_alpha)
    return trim(im)


def crop_atlas(atlas_path, cols, rows, names, clean_components=False):
    atlas = Image.open(atlas_path).convert("RGBA")
    cw, ch = atlas.width // cols, atlas.height // rows
    results = []
    for i, name in enumerate(names):
        col, row = i % cols, i // cols
        icon = trim(atlas.crop((col * cw, row * ch, (col + 1) * cw, (row + 1) * ch)))
        if clean_components:
            icon = keep_largest_alpha_component(icon)
        icon.save(INDIVIDUAL / f"{name}.png")
        results.append(icon)
    return results


def build_cast_sheet():
    size = (2800, 2500)
    base = texture_canvas(size)
    header(base, "Cast icon library", "People & characters", len(CAST))
    cols, gap, margin, top = 4, 24, 72, 315
    cw = (size[0] - margin * 2 - gap * (cols - 1)) // cols
    ch = 500
    for i, (name, detail, color, filename) in enumerate(CAST):
        row, col = divmod(i, cols)
        x, y = margin + col * (cw + gap), top + row * (ch + gap)
        card(base, (x, y, x + cw, y + ch), Image.open(FACE / filename), name, detail, color)
    base.convert("RGB").save(OUT / "cast-icon-sheet.png", quality=95, dpi=(150, 150))


def build_grade_sheet(icons):
    size = (2200, 1800)
    base = texture_canvas(size)
    header(base, "Curriculum grade icons", "Learning stages", len(GRADES))
    margin, gap, top = 130, 36, 330
    cw = (size[0] - margin * 2 - gap) // 2
    ch = 665
    for i, ((name, detail, color), icon) in enumerate(zip(GRADES, icons)):
        row, col = divmod(i, 2)
        x, y = margin + col * (cw + gap), top + row * (ch + gap)
        card(base, (x, y, x + cw, y + ch), icon, name, detail, color)
    base.convert("RGB").save(OUT / "curriculum-grade-icon-sheet.png", quality=95, dpi=(150, 150))


def build_subject_sheet(icons):
    size = (2800, 1700)
    base = texture_canvas(size)
    header(base, "Curriculum subject icons", "Learning areas", len(SUBJECTS))
    cols, gap, margin, top = 4, 24, 72, 320
    cw = (size[0] - margin * 2 - gap * (cols - 1)) // cols
    ch = 620
    for i, ((name, detail, color), icon) in enumerate(zip(SUBJECTS, icons)):
        row, col = divmod(i, cols)
        x, y = margin + col * (cw + gap), top + row * (ch + gap)
        card(base, (x, y, x + cw, y + ch), icon, name, detail, color)
    base.convert("RGB").save(OUT / "curriculum-subject-icon-sheet.png", quality=95, dpi=(150, 150))


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    INDIVIDUAL.mkdir(parents=True, exist_ok=True)
    grade_icons = crop_atlas(OUT / "grade-icons-atlas.png", 2, 2, ["grade-daycare", "grade-kindergarten", "grade-1", "grade-2"])
    subject_icons = crop_atlas(OUT / "subject-icons-atlas.png", 4, 2, ["subject-community-leadership", "subject-early-learning", "subject-music-dance", "subject-drama-storytelling", "subject-math-building", "subject-physical-education", "subject-art-photography", "subject-gardening-health"], clean_components=True)
    build_cast_sheet()
    build_grade_sheet(grade_icons)
    build_subject_sheet(subject_icons)
    print(OUT)


if __name__ == "__main__":
    main()
