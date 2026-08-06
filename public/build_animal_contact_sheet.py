from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
PUBLIC = Path(__file__).resolve().parent
ASSETS = ROOT / "approved-assets"
TEXTURES = ROOT / "old-macdonald-had-a-school" / "texture-assets"
FONTS = Path(r"C:\Users\jesse\.agents\skills\canvas-design\canvas-fonts")
OUT = PUBLIC / "animal-cast-contact-sheet.png"

W, H = 3200, 2200
INK = "#2F2921"
MUTED = "#736657"
CREAM = "#F5EBD7"
CARD = "#FFF9EC"
DENIM = "#1F4E5F"
TOMATO = "#B5272C"

STAFF = [
    ("Miss Puddles", "Duck · Daycare teacher", "#E8A227", ASSETS / "staff/miss-puddles/full-art/miss-puddles--full-art.png"),
    ("Mr Rusty", "Horse · Music & dance", "#2C6C9B", ASSETS / "staff/mr-rusty/full-art/mr-rusty--full-art.png"),
    ("Mr Sam", "Pig · Math & building", "#1F6B6B", ASSETS / "staff/mr-sam/full-art/mr-sam--full-art.png"),
    ("Mr Maisy", "Cow · Physical education", "#B5272C", ASSETS / "staff/mr-maisy/full-art/mr-maisy--full-art.png"),
    ("Mr Puddles", "Duck · Art & photography", "#4F5FA0", ASSETS / "staff/mr-puddles/full-art/mr-puddles--full-art.png"),
    ("Miss Maisy", "Cow · Secretary & gardening", "#55705A", ASSETS / "staff/miss-maisy/full-art/miss-maisy--full-art.png"),
]

STUDENTS = [
    ("Hopper", "Rabbit", "#D9713C", ASSETS / "students/hopper/full-art/hopper--full-art.png"),
    ("Whiskers", "Cat", "#7B4FA8", ASSETS / "students/whiskers/full-art/whiskers--full-art.png"),
    ("Scout", "Dog", "#4A7A3A", ASSETS / "students/scout/full-art/scout--full-art.png"),
    ("Penny", "Chick", "#C9962E", ASSETS / "students/penny/full-art/penny--full-art.png"),
    ("Maisy", "Cow", "#1F4E5F", ASSETS / "students/maisy/full-art/maisy--full-art.png"),
    ("Puddles", "Duck", "#4FA0C9", ASSETS / "students/puddles/full-art/puddles--full-art.png"),
    ("Sam", "Pig", "#7A9A3D", ASSETS / "students/sam/full-art/sam--full-art.png"),
    ("Rusty", "Horse", "#8B5030", ASSETS / "students/rusty/full-art/rusty--full-art.png"),
]


def font(name, size):
    return ImageFont.truetype(str(FONTS / name), size)


DISPLAY = font("BricolageGrotesque-Bold.ttf", 102)
SECTION = font("BricolageGrotesque-Bold.ttf", 42)
NAME_STAFF = font("BricolageGrotesque-Bold.ttf", 34)
NAME_STUDENT = font("BricolageGrotesque-Bold.ttf", 30)
META = font("InstrumentSans-Regular.ttf", 22)
SMALL = font("DMMono-Regular.ttf", 18)


def cover_texture(path, size):
    tex = Image.open(path).convert("RGB")
    tw, th = tex.size
    canvas = Image.new("RGB", size)
    for y in range(0, size[1], th):
        for x in range(0, size[0], tw):
            canvas.paste(tex, (x, y))
    return canvas


def rounded_shadow(size, radius=30, blur=18, offset=(0, 12)):
    layer = Image.new("RGBA", size, (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x0, y0 = 20 + offset[0], 20 + offset[1]
    x1, y1 = size[0] - 20 + offset[0], size[1] - 20 + offset[1]
    d.rounded_rectangle((x0, y0, x1, y1), radius=radius, fill=(61, 42, 24, 55))
    return layer.filter(ImageFilter.GaussianBlur(blur))


def trim_alpha(im):
    im = im.convert("RGBA")
    bbox = im.getchannel("A").getbbox()
    return im.crop(bbox) if bbox else im


def place_character(base, path, box):
    im = trim_alpha(Image.open(path))
    max_w, max_h = box[2] - box[0], box[3] - box[1]
    im.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
    x = box[0] + (max_w - im.width) // 2
    y = box[1] + max_h - im.height
    base.alpha_composite(im, (x, y))


def draw_card(base, x, y, w, h, person, name_font):
    name, meta, color, path = person
    shadow = rounded_shadow((w + 60, h + 70), radius=32)
    base.alpha_composite(shadow, (x - 30, y - 25))
    d = ImageDraw.Draw(base)
    d.rounded_rectangle((x, y, x + w, y + h), radius=30, fill=CARD, outline=(76, 61, 44, 45), width=3)
    d.rounded_rectangle((x, y, x + w, y + 20), radius=10, fill=color)
    d.ellipse((x + 22, y + 26, x + 48, y + 52), fill=color)
    image_box = (x + 24, y + 56, x + w - 24, y + h - 112)
    place_character(base, path, image_box)
    line_y = y + h - 96
    d.line((x + 24, line_y, x + w - 24, line_y), fill=(77, 61, 43, 38), width=2)
    d.text((x + 24, y + h - 82), name, font=name_font, fill=INK)
    meta_y = y + h - 39
    d.text((x + 24, meta_y), meta, font=META, fill=MUTED)


def section_label(draw, y, label, count, color):
    label_text = label.upper()
    label_width = draw.textbbox((0, 0), label_text, font=SECTION)[2]
    pill_right = 100 + label_width + 52
    draw.rounded_rectangle((100, y, pill_right, y + 56), radius=28, fill=color)
    draw.text((126, y + 8), label_text, font=SECTION, fill="#FFF8EA")
    draw.text((pill_right + 28, y + 15), f"{count:02d} CHARACTERS", font=SMALL, fill=MUTED)


def main():
    missing = [p for *_, p in STAFF + STUDENTS if not p.exists()]
    if missing:
        raise FileNotFoundError("Missing assets:\n" + "\n".join(map(str, missing)))

    paper = cover_texture(TEXTURES / "kraft-light-tile.png", (W, H)).convert("RGBA")
    warm = Image.new("RGBA", (W, H), (244, 229, 202, 122))
    base = Image.alpha_composite(paper, warm)
    draw = ImageDraw.Draw(base)

    draw.text((100, 72), "OLD MACDONALD'S FARM SCHOOL", font=DISPLAY, fill=INK)
    draw.text((105, 190), "ANIMAL CAST CONTACT SHEET  /  CANONICAL STAFF + STUDENTS", font=SMALL, fill=MUTED)
    draw.line((100, 242, W - 100, 242), fill=(76, 61, 44, 65), width=3)

    section_label(draw, 286, "Staff animals", len(STAFF), DENIM)
    staff_gap = 26
    staff_w = (W - 200 - staff_gap * 5) // 6
    staff_y, staff_h = 365, 720
    for i, person in enumerate(STAFF):
        x = 100 + i * (staff_w + staff_gap)
        draw_card(base, x, staff_y, staff_w, staff_h, person, NAME_STAFF)

    section_label(draw, 1150, "Students", len(STUDENTS), TOMATO)
    student_gap = 22
    student_w = (W - 200 - student_gap * 7) // 8
    student_y, student_h = 1229, 760
    for i, person in enumerate(STUDENTS):
        x = 100 + i * (student_w + student_gap)
        draw_card(base, x, student_y, student_w, student_h, person, NAME_STUDENT)

    footer_y = 2075
    draw.line((100, footer_y, W - 100, footer_y), fill=(76, 61, 44, 55), width=2)
    draw.text((100, footer_y + 34), "ROSTER / CAST_AND_ROLES.MD", font=SMALL, fill=MUTED)
    footer = "14 ANIMAL CHARACTERS  ·  6 STAFF  ·  8 STUDENTS"
    tw = draw.textbbox((0, 0), footer, font=SMALL)[2]
    draw.text((W - 100 - tw, footer_y + 34), footer, font=SMALL, fill=MUTED)

    base.convert("RGB").save(OUT, quality=95, dpi=(150, 150))
    print(OUT)


if __name__ == "__main__":
    main()
