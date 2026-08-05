from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


SCALE = 4
W, H = 1023, 273
ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).with_name("early-years-grouped-prototype.png")


def q(v):
    return round(v * SCALE)


def font(path, size):
    return ImageFont.truetype(path, q(size))


F_BOLD = r"C:\Windows\Fonts\comicbd.ttf"
F_REGULAR = r"C:\Windows\Fonts\comic.ttf"
F_ITALIC = r"C:\Windows\Fonts\comici.ttf"
F_SERIF_ITALIC = r"C:\Windows\Fonts\georgiaz.ttf"
F_SCRIPT = r"C:\Windows\Fonts\LHANDW.TTF"
F_ARROW = r"C:\Windows\Fonts\seguisym.ttf"


def rr(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(tuple(q(v) for v in box), radius=q(radius), fill=fill, outline=outline, width=q(width))


def text(draw, xy, value, use_font, fill, anchor="la", spacing=0):
    x, y = q(xy[0]), q(xy[1])
    if not spacing:
        draw.text((x, y), value, font=use_font, fill=fill, anchor=anchor)
        return
    cursor = x
    for char in value:
        draw.text((cursor, y), char, font=use_font, fill=fill, anchor="la")
        cursor += int(draw.textlength(char, font=use_font)) + q(spacing)


def dashed_round_rect(draw, box, radius, color, width=2, dash=6, gap=4):
    x0, y0, x1, y1 = [q(v) for v in box]
    r = q(radius)
    step = q(dash + gap)
    d = q(dash)
    w = q(width)
    for start, end, y in ((x0 + r, x1 - r, y0), (x0 + r, x1 - r, y1)):
        for x in range(start, end, step):
            draw.line((x, y, min(x + d, end), y), fill=color, width=w)
    for start, end, x in ((y0 + r, y1 - r, x0), (y0 + r, y1 - r, x1)):
        for y in range(start, end, step):
            draw.line((x, y, x, min(y + d, end)), fill=color, width=w)
    # The corners are intentionally continuous thread; the straight runs remain visibly stitched.
    for start in (180, 270, 0, 90):
        draw.arc((x0, y0, x0 + 2 * r, y0 + 2 * r) if start == 180 else
                 (x1 - 2 * r, y0, x1, y0 + 2 * r) if start == 270 else
                 (x1 - 2 * r, y1 - 2 * r, x1, y1) if start == 0 else
                 (x0, y1 - 2 * r, x0 + 2 * r, y1),
                 start=start, end=start + 90, fill=color, width=w)


def circle_icon(base, center, icon_path):
    x, y = q(center[0]), q(center[1])
    r = q(33)
    dr = ImageDraw.Draw(base)
    dr.ellipse((x - r, y - r + q(3), x + r, y + r + q(3)), fill=(4, 12, 22, 112))
    dr.ellipse((x - r, y - r, x + r, y + r), fill="#14395e", outline="#e7dcae", width=q(3))
    dr.ellipse((x - r + q(5), y - r + q(5), x + r - q(5), y + r - q(5)), outline="#6da2ba", width=q(2))
    icon = Image.open(icon_path).convert("RGBA")
    icon.thumbnail((q(58), q(58)), Image.Resampling.LANCZOS)
    base.alpha_composite(icon, (x - icon.width // 2, y - icon.height // 2 + q(3)))


def card(base, x, color, asset, age, title, secondary, lead, count, button_color):
    draw = ImageDraw.Draw(base)
    y, w, h = 86, 325, 164
    rr(draw, (x + 2, y + 6, x + w + 2, y + h + 6), 19, (0, 0, 0, 118))
    rr(draw, (x, y, x + w, y + h), 19, color, outline="#ffffff55", width=3)
    dashed_round_rect(draw, (x + 9, y + 8, x + w - 9, y + h - 8), 10, "#f7f0df", 2, 6, 4)
    circle_icon(base, (x + 49, y + 82), asset)
    text(draw, (x + 99, y + 25), age, font(F_BOLD, 10), "#ffffffae")
    text(draw, (x + 99, y + 40), title, font(F_BOLD, 26), "#ffffff")
    text(draw, (x + 99, y + 69), secondary, font(F_SCRIPT, 16), "#ffffffef")
    text(draw, (x + 99, y + 92), lead, font(F_BOLD, 10), "#ffffffd1")
    count_width = 96 if count.startswith("9") else 91
    rr(draw, (x + 99, y + 116, x + 99 + count_width, y + 147), 7, button_color, outline="#ffffff58", width=1)
    count_label = count.replace(" →", "")
    count_font = font(F_BOLD, 11)
    arrow_font = font(F_ARROW, 12)
    label_width = draw.textlength(count_label, font=count_font)
    arrow_width = draw.textlength("→", font=arrow_font)
    group_width = label_width + q(4) + arrow_width
    group_x = q(x + 99 + count_width / 2) - group_width / 2
    text(draw, (group_x / SCALE, y + 131.5), count_label, count_font, "#ffffff", anchor="lm")
    text(draw, ((group_x + label_width + q(4)) / SCALE, y + 131.5), "→", arrow_font, "#ffffff", anchor="lm")


canvas = Image.new("RGBA", (q(W), q(H)), "#0b1d31")
draw = ImageDraw.Draw(canvas)

# Header
draw.rectangle((0, 0, q(W), q(63)), fill="#0c2035")
draw.rectangle((0, q(61), q(W), q(63)), fill="#d9a51f")
brand = Image.open(ROOT / "public" / "brand-emblem.png").convert("RGBA")
brand.thumbnail((q(44), q(44)), Image.Resampling.LANCZOS)
canvas.alpha_composite(brand, (q(11), q(8)))
draw.ellipse((q(10), q(7), q(56), q(53)), outline="#f8e6b2", width=q(1))
text(draw, (67, 16), "Old MacDonald Had a School", font(F_SERIF_ITALIC, 17), "#f3e7ca")
text(draw, (92, 35), "TEACHER LESSON RESOURCES", font(F_BOLD, 9), "#e0ab1e", spacing=.55)

rr(draw, (572, 16, 624, 45), 12, "#203445", outline="#a87f19", width=1)
text(draw, (598, 30.5), "Home", font(F_BOLD, 11), "#d9a51f", anchor="mm")
for x, label in ((644, "Daycare"), (713, "Preschool"), (790, "Grade 1"), (859, "Grade 2")):
    text(draw, (x, 30.5), label, font(F_BOLD, 11), "#ffffffa7", anchor="lm")
draw.rectangle((q(921), q(20), q(922), q(41)), fill="#ffffff3f")
text(draw, (941, 30.5), "Cast Guide", font(F_BOLD, 11), "#ffffff73", anchor="lm")

# Selector field
draw.rectangle((0, q(63), q(W), q(H)), fill="#091a2b")
card(canvas, 11, "#7345c8", ROOT / "public" / "icons" / "canva-sheet-02" / "miss-puddles.png", "0–4 YRS", "Early Years", "Daycare & Preschool", "Led by Miss Puddles", "9 lessons →", "#3c216e")
card(canvas, 349, "#c73136", ROOT / "public" / "icons" / "canva-sheet-02" / "mr-rusty.png", "5–6 YRS", "Grade 1", "Reading and rhythm", "Led by Mr Rusty & Miss Hayley", "4 lessons →", "#81242a")
card(canvas, 687, "#2c61ac", ROOT / "public" / "icons" / "canva-sheet-02" / "mr-sam.png", "6–7 YRS", "Grade 2", "Thinking and making", "Led by Miss Hayley & Mr Sam", "4 lessons →", "#123e7d")

canvas.convert("RGB").resize((W, H), Image.Resampling.LANCZOS).save(OUT, quality=95)
print(OUT)
