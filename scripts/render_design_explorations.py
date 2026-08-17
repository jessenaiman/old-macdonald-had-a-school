from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import random

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "design-explorations-v2"
ASSETS = ROOT / "public"
SOURCE_IMAGES = ROOT / "assets" / "source-images" / "public"
FONTS = Path(r"C:\Users\jesse\.agents\skills\canvas-design\canvas-fonts")
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1600, 1000
NAVY = "#102943"
GREEN = "#496b59"
GOLD = "#efa91d"
KRAFT = "#b47a42"
PAPER = "#fff9e9"
BLUE_RULE = "#a9c7da"
RED_RULE = "#db8a75"
MUTED = "#74685a"


def font(name, size):
    return ImageFont.truetype(str(FONTS / name), size)


DISPLAY = lambda s: font("BricolageGrotesque-Bold.ttf", s)
BODY = lambda s: font("BricolageGrotesque-Regular.ttf", s)
MONO = lambda s: font("DMMono-Regular.ttf", s)


def tiled(path, size):
    tile = Image.open(path).convert("RGB")
    canvas = Image.new("RGB", size)
    for y in range(0, size[1], tile.height):
        for x in range(0, size[0], tile.width):
            canvas.paste(tile, (x, y))
    return canvas


def source_asset(relative):
    archived = SOURCE_IMAGES / relative
    return archived if archived.exists() else ASSETS / relative


def text(draw, xy, value, fnt, fill=NAVY, anchor=None):
    draw.text(xy, value, font=fnt, fill=fill, anchor=anchor)


def wrapped(draw, xy, value, fnt, fill, width, spacing=6):
    words, lines, line = value.split(), [], ""
    for word in words:
        candidate = (line + " " + word).strip()
        if draw.textbbox((0, 0), candidate, font=fnt)[2] <= width:
            line = candidate
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    draw.multiline_text(xy, "\n".join(lines), font=fnt, fill=fill, spacing=spacing)
    return len(lines)


def shadow_box(im, box, radius=18, fill=PAPER, shadow=(65, 39, 18, 55), offset=(8, 10)):
    x0, y0, x1, y1 = box
    layer = Image.new("RGBA", im.size)
    ld = ImageDraw.Draw(layer)
    ld.rounded_rectangle((x0 + offset[0], y0 + offset[1], x1 + offset[0], y1 + offset[1]), radius, fill=shadow)
    layer = layer.filter(ImageFilter.GaussianBlur(5))
    im.alpha_composite(layer)
    ImageDraw.Draw(im).rounded_rectangle(box, radius, fill=fill)


def dashed_round(draw, box, radius, fill, dash="#fff4d6", width=3):
    draw.rounded_rectangle(box, radius, fill=fill)
    x0, y0, x1, y1 = box
    inset = 8
    for x in range(x0 + inset + radius, x1 - inset - radius, 14):
        draw.line((x, y0 + inset, min(x + 7, x1 - inset - radius), y0 + inset), fill=dash, width=width)
        draw.line((x, y1 - inset, min(x + 7, x1 - inset - radius), y1 - inset), fill=dash, width=width)
    for y in range(y0 + inset + radius, y1 - inset - radius, 14):
        draw.line((x0 + inset, y, x0 + inset, min(y + 7, y1 - inset - radius)), fill=dash, width=width)
        draw.line((x1 - inset, y, x1 - inset, min(y + 7, y1 - inset - radius)), fill=dash, width=width)


def torn_polygon(box, seed=3, step=22, jitter=7):
    random.seed(seed)
    x0, y0, x1, y1 = box
    pts = []
    for x in range(x0, x1 + 1, step):
        pts.append((min(x, x1), y0 + random.randint(-jitter, jitter)))
    for y in range(y0, y1 + 1, step):
        pts.append((x1 + random.randint(-jitter, jitter), min(y, y1)))
    for x in range(x1, x0 - 1, -step):
        pts.append((max(x, x0), y1 + random.randint(-jitter, jitter)))
    for y in range(y1, y0 - 1, -step):
        pts.append((x0 + random.randint(-jitter, jitter), max(y, y0)))
    return pts


def paper_sheet(im, box, seed=3, lines=True):
    pts = torn_polygon(box, seed)
    shadow = Image.new("RGBA", im.size)
    sd = ImageDraw.Draw(shadow)
    sd.polygon([(x + 8, y + 12) for x, y in pts], fill=(62, 38, 20, 55))
    shadow = shadow.filter(ImageFilter.GaussianBlur(7))
    im.alpha_composite(shadow)
    draw = ImageDraw.Draw(im)
    draw.polygon(pts, fill=PAPER)
    if lines:
        x0, y0, x1, y1 = box
        for y in range(y0 + 90, y1 - 20, 36):
            draw.line((x0 + 25, y, x1 - 25, y), fill=BLUE_RULE, width=2)
        draw.line((x0 + 105, y0 + 25, x0 + 105, y1 - 25), fill=RED_RULE, width=2)
    return pts


def checkbox(draw, x, y, label, checked=False, width=310):
    draw.rounded_rectangle((x, y, x + 26, y + 26), 5, outline=GREEN, width=3, fill="#fffdf4")
    if checked:
        draw.line((x + 6, y + 13, x + 11, y + 20), fill=GREEN, width=4)
        draw.line((x + 11, y + 20, x + 22, y + 6), fill=GREEN, width=4)
    wrapped(draw, (x + 40, y - 1), label, BODY(21), NAVY, width - 40, 3)


def felt_button(im, draw, box, label, patch_name):
    x0, y0, x1, y1 = box
    patch_path = source_asset(Path("design-assets/blank-felt-patches-v1/individual-patches") / patch_name)
    patch = Image.open(patch_path).convert("RGBA")
    alpha_box = patch.getchannel("A").getbbox()
    patch = patch.crop(alpha_box).resize((x1 - x0, y1 - y0), Image.Resampling.LANCZOS)
    im.alpha_composite(patch, (x0, y0))
    text(draw, ((x0 + x1) // 2, (y0 + y1) // 2 - 1), label, DISPLAY(17), "white", "mm")


def tape(draw, xy, angle=0):
    x, y = xy
    poly = [(x, y), (x + 76, y + 6), (x + 72, y + 34), (x - 4, y + 27)]
    draw.polygon(poly, fill="#efd070")
    draw.line(poly + [poly[0]], fill="#d4b654", width=2)


def base_canvas(title, subtitle):
    kraft_path = source_asset("design-assets/web-material-library-v1/cardboard/cardboard-warm-kraft-tile.png")
    base = tiled(kraft_path, (W, H)).convert("RGBA")
    overlay = Image.new("RGBA", base.size, (112, 66, 28, 28))
    base.alpha_composite(overlay)
    draw = ImageDraw.Draw(base)
    text(draw, (70, 46), title, DISPLAY(28), "#fff7e5")
    text(draw, (70, 84), subtitle.upper(), MONO(13), "#f2ce70")
    draw.line((70, 116, 1530, 116), fill="#f2ce70", width=2)
    return base, draw


def render_concept_a():
    im, draw = base_canvas("Full-bleed lesson sheet", "Concept A · maximum writing room")
    paper_sheet(im, (45, 150, 1555, 955), 14)
    draw = ImageDraw.Draw(im)
    text(draw, (95, 179), "TEACHER CHECKLIST", MONO(13), GREEN)
    text(draw, (95, 210), "Before the lesson", DISPLAY(31), NAVY)
    checklist = ["Choose one learning goal", "Gather two flexible materials", "Plan the invitation", "Name one support", "Leave space to notice"]
    for i, item in enumerate(checklist):
        checkbox(draw, 95, 273 + i * 72, item, checked=i < 2)
    felt_button(im, draw, (95, 655, 355, 750), "BUILD THIS LESSON", "02-miss-puddles-rectangle.png")
    text(draw, (95, 765), "AFTER", MONO(12), GREEN)
    checkbox(draw, 95, 795, "What surprised me?", False)
    checkbox(draw, 95, 857, "What should we revisit?", False)

    draw.line((430, 175, 430, 920), fill="#d8b6a4", width=2)
    text(draw, (475, 179), "LESSON NOTES", MONO(13), GREEN)
    text(draw, (475, 210), "Thinking space", DISPLAY(38), NAVY)
    text(draw, (475, 260), "Write, sketch, circle, revise.", BODY(19), MUTED)
    for y in (340, 448, 556, 664, 772, 880):
        draw.ellipse((490, y - 4, 498, y + 4), fill="#d3b29c")

    draw.rounded_rectangle((1185, 185, 1505, 910), 18, fill="#f4e4b8", outline="#d6b875", width=2)
    tape(draw, (1304, 169))
    text(draw, (1220, 220), "RESOURCE STRIP", MONO(12), "#886324")
    text(draw, (1220, 252), "Keep close", DISPLAY(30), NAVY)
    resources = [("OPEN", "Invitation prompt"), ("PRINT", "Response mat"), ("SUPPORT", "Ways to adapt")]
    fasteners = ["03-paperclip-double-loop.png", "05-masking-tape.png", "01-push-pin-rounded.png"]
    for i, (eyebrow, label) in enumerate(resources):
        y = 320 + i * 170
        draw.rounded_rectangle((1214, y, 1476, y + 138), 6, fill="#fffdf5", outline="#ddcfb3", width=2)
        icon = Image.open(source_asset(Path("design-assets/classroom-fasteners-v1/individual-icons") / fasteners[i])).convert("RGBA")
        icon.thumbnail((60, 60))
        im.alpha_composite(icon, (1432, y - 22))
        text(draw, (1236, y + 28), eyebrow, MONO(10), GREEN)
        wrapped(draw, (1236, y + 55), label, DISPLAY(22), NAVY, 195, 3)
    text(draw, (1175, 938), "Paper reaches the page edge · 86% of the lower area is writable", MONO(11), "#fff2d8", "ra")
    im.convert("RGB").save(OUT / "bottom-layout-concept-a.png", quality=95)


def render_concept_b():
    im, draw = base_canvas("Workshop ledger", "Concept B · structured planning plus free notes")
    paper_sheet(im, (55, 155, 1545, 952), 41)
    draw = ImageDraw.Draw(im)
    # punched notebook margin
    for y in range(205, 925, 68):
        draw.ellipse((68, y, 91, y + 23), fill="#b88755", outline="#8e6136", width=2)
    text(draw, (125, 184), "TODAY'S WORKSHOP", MONO(13), GREEN)
    text(draw, (125, 217), "Plan → teach → notice", DISPLAY(38), NAVY)
    felt_button(im, draw, (1238, 175, 1498, 270), "BUILD THIS LESSON", "08-miss-maisy-rectangle.png")
    draw.line((115, 278, 1500, 278), fill="#d9c3a5", width=2)

    # compact checklist band
    draw.rounded_rectangle((125, 307, 1475, 430), 13, fill="#eef2e8", outline="#a9b9a8", width=2)
    text(draw, (155, 329), "READY CHECK", MONO(11), GREEN)
    labels = ["Goal", "Materials", "Invitation", "Support", "Observation"]
    for i, label in enumerate(labels):
        x = 155 + i * 255
        checkbox(draw, x, 367, label, checked=i < 2, width=210)

    # wide note field and detachable tabs
    text(draw, (130, 466), "RUNNING NOTES", MONO(12), GREEN)
    text(draw, (130, 498), "What I see and hear", DISPLAY(33), NAVY)
    draw.line((1135, 455, 1135, 915), fill="#d8b6a4", width=2)
    for y in range(570, 900, 58):
        draw.line((130, y, 1085, y), fill="#91b9d0", width=2)
    draw.line((206, 548, 206, 906), fill="#dd8f7c", width=2)
    for y, prompt in [(584, "What worked"), (690, "Who needed another way in"), (796, "Tomorrow's first move")]:
        text(draw, (232, y), prompt, BODY(17), "#8a8174")

    text(draw, (1175, 466), "PULL-TABS", MONO(12), GREEN)
    tabs = [("PROMPT", "Open with a choice", "#e9bd55"), ("PRINT", "Response mat", "#d98a68"), ("EXTEND", "Try another way", "#78a690")]
    for i, (ey, label, color) in enumerate(tabs):
        y = 510 + i * 132
        draw.rounded_rectangle((1165, y, 1490, y + 105), 7, fill="#fffdf4", outline="#d9cbb0", width=2)
        draw.rounded_rectangle((1450, y + 16, 1522, y + 87), 8, fill=color)
        text(draw, (1190, y + 22), ey, MONO(10), GREEN)
        wrapped(draw, (1190, y + 49), label, DISPLAY(20), NAVY, 230, 2)
    text(draw, (1470, 935), "Checklist stays compact; notes own the page", MONO(11), "#fff2d8", "ra")
    im.convert("RGB").save(OUT / "bottom-layout-concept-b.png", quality=95)


def draw_activity(draw, center, kind, fg, stroke=5):
    x, y = center
    if kind == "story":
        draw.polygon([(x-29,y-18),(x-3,y-10),(x-3,y+25),(x-30,y+16)], fill=fg)
        draw.polygon([(x+3,y-10),(x+29,y-18),(x+30,y+16),(x+3,y+25)], fill=fg)
        draw.line((x,y-9,x,y+25), fill="#fff9e9", width=3)
    elif kind == "count":
        for i, c in enumerate(("#efaa24","#cf5c67","#4f8f83")):
            draw.rounded_rectangle((x-29+i*20,y-8-i*9,x-11+i*20,y+18-i*9),4,fill=c)
    elif kind == "make":
        draw.ellipse((x-28,y+2,x-5,y+25),outline=fg,width=stroke);draw.ellipse((x+3,y+2,x+26,y+25),outline=fg,width=stroke)
        draw.line((x-8,y+5,x+20,y-25),fill=fg,width=stroke);draw.line((x+7,y+5,x-20,y-25),fill=fg,width=stroke)
    elif kind == "move":
        draw.line((x-28,y+12,x+12,y+12),fill=fg,width=stroke+3);draw.line((x+12,y+12,x+28,y-6),fill=fg,width=stroke+3)
        draw.line((x+15,y-5,x+28,y-6,x+24,y+8),fill=fg,width=stroke)
    elif kind == "explore":
        draw.ellipse((x-24,y-24,x+13,y+13),outline=fg,width=stroke);draw.line((x+8,y+9,x+29,y+30),fill=fg,width=stroke+2)
        draw.ellipse((x-10,y-10,x+2,y+2),fill="#80a96c")
    elif kind == "music":
        draw.line((x,y-25,x,y+15),fill=fg,width=stroke);draw.line((x,y-25,x+27,y-31),fill=fg,width=stroke);draw.line((x+27,y-31,x+27,y+8),fill=fg,width=stroke)
        draw.ellipse((x-15,y+7,x+2,y+23),fill=fg);draw.ellipse((x+12,y,x+29,y+16),fill=fg)


def icon_token(draw, center, kind, option):
    x, y = center
    if option == "sticker":
        draw.ellipse((x-42,y-42,x+42,y+42),fill="#fffdf5")
        draw.ellipse((x-35,y-35,x+35,y+35),fill="#f1b93f")
        draw_activity(draw,(x,y),kind,NAVY,5)
    elif option == "enamel":
        draw.ellipse((x-41,y-38,x+43,y+46),fill="#2c3540")
        draw.ellipse((x-36,y-35,x+36,y+37),fill="#76a391",outline="#d4b15c",width=5)
        draw.arc((x-29,y-28,x+29,y+30),195,330,fill="#cfe2d9",width=4)
        draw_activity(draw,(x,y),kind,"#fff6dc",4)
    else:
        pts=[(x,y-42),(x+36,y-22),(x+36,y+23),(x,y+43),(x-36,y+23),(x-36,y-22)]
        draw.polygon(pts,fill="#ead69d",outline="#a3783e",width=3)
        draw_activity(draw,(x,y),kind,"#385c50",4)
        draw.rectangle((x-18,y-48,x+18,y-38),fill="#f1cf72")


def render_icons():
    im, draw = base_canvas("Small activity markers", "Three non-fabric directions · shown on felt at intended UI scale")
    options = [
        ("A", "MATTE STICKER GLYPHS", "Recommended", "sticker", "Best recognition at 32–48 px. Friendly, flat, and easy to recolor."),
        ("B", "SOFT ENAMEL PINS", "Premium", "enamel", "A tactile object that genuinely pins to felt; slightly more visual weight."),
        ("C", "PRINTED PAPER TOKENS", "Most crafty", "paper", "Low-detail ink symbols with a tiny tape edge; warmest print behavior."),
    ]
    felt_path = source_asset("design-assets/web-material-library-v1/felt/felt-08-miss-maisy-tile.png")
    felt = tiled(felt_path, (1450, 230)).resize((1450,230))
    kinds = ["story","count","make","move","explore","music"]
    labels = ["STORY","COUNT","MAKE","MOVE","EXPLORE","MUSIC"]
    for row,(letter,title,badge,kind,desc) in enumerate(options):
        y = 155 + row*270
        shadow_box(im,(65,y,1535,y+230),20,fill="#f8ecd3")
        draw = ImageDraw.Draw(im)
        text(draw,(95,y+28),letter,DISPLAY(52),GOLD)
        text(draw,(155,y+31),title,DISPLAY(20),NAVY)
        draw.rounded_rectangle((155,y+69,260,y+96),14,fill=GREEN if row==0 else "#d9c08b")
        text(draw,(207,y+82),badge.upper(),MONO(9),"white" if row==0 else NAVY,"mm")
        wrapped(draw,(95,y+126),desc,BODY(16),MUTED,300,4)
        # felt swatch
        crop = felt.crop((0,0,1085,180)).convert("RGBA")
        mask = Image.new("L",crop.size)
        ImageDraw.Draw(mask).rounded_rectangle((0,0,crop.width,crop.height),18,fill=255)
        crop.putalpha(mask)
        im.alpha_composite(crop,(420,y+25))
        draw = ImageDraw.Draw(im)
        for i,(activity,label) in enumerate(zip(kinds,labels)):
            cx=500+i*160
            icon_token(draw,(cx,y+102),activity,kind)
            text(draw,(cx,y+166),label,MONO(9),"#fff8e8","mm")
        text(draw,(1476,y+202),"48 px preview",MONO(9),"#fff4dc","ra")
    text(draw,(70,966),"Design rule: one silhouette · two colors maximum · no fabric texture inside the icon",MONO(12),"#fff5de")
    im.convert("RGB").save(OUT / "activity-icon-style-options.png",quality=95)


if __name__ == "__main__":
    render_concept_a()
    render_concept_b()
    render_icons()
    print("Rendered:")
    for path in sorted(OUT.glob("*.png")):
        print(path)
