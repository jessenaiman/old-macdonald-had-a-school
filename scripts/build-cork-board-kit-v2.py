"""Build the governed muted cork production kit from its approved source tile.

The source texture stays untouched. Production derivatives are deterministic:
the repeat tile is made seamless with mirrored quadrants, and each responsive
board uses the same texture inside a shared rounded edge treatment.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
KIT = ROOT / "public" / "design-assets" / "cork-board-kit-v2"
SOURCE = KIT / "muted-natural-cork-tile-v01.png"


def seamless_tile(source: Image.Image, size: int = 1024) -> Image.Image:
    quadrant_size = size // 2
    left = (source.width - quadrant_size) // 2
    top = (source.height - quadrant_size) // 2
    quadrant = source.crop((left, top, left + quadrant_size, top + quadrant_size))
    tile = Image.new("RGB", (size, size))
    tile.paste(quadrant, (0, 0))
    tile.paste(quadrant.transpose(Image.Transpose.FLIP_LEFT_RIGHT), (quadrant_size, 0))
    tile.paste(quadrant.transpose(Image.Transpose.FLIP_TOP_BOTTOM), (0, quadrant_size))
    tile.paste(
        quadrant.transpose(Image.Transpose.FLIP_LEFT_RIGHT).transpose(Image.Transpose.FLIP_TOP_BOTTOM),
        (quadrant_size, quadrant_size),
    )
    return tile


def tiled_texture(tile: Image.Image, size: tuple[int, int]) -> Image.Image:
    canvas = Image.new("RGB", size)
    for y in range(0, size[1], tile.height):
        for x in range(0, size[0], tile.width):
            canvas.paste(tile, (x, y))
    return canvas


def board(tile: Image.Image, size: tuple[int, int]) -> Image.Image:
    width, height = size
    radius = max(24, round(min(size) * 0.035))
    bottom_lift = max(5, round(min(size) * 0.008))
    bounds = (2, 2, width - 3, height - bottom_lift - 1)

    image = Image.new("RGBA", size, (0, 0, 0, 0))
    shadow = Image.new("RGBA", size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        (3, bottom_lift, width - 2, height - 1),
        radius=radius,
        fill=(54, 35, 22, 88),
    )
    image.alpha_composite(shadow)

    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle(bounds, radius=radius, fill=255)
    field = tiled_texture(tile, size).convert("RGBA")
    field.putalpha(mask)
    image.alpha_composite(field)

    edge = ImageDraw.Draw(image)
    edge.rounded_rectangle(bounds, radius=radius, outline=(255, 249, 231, 225), width=3)
    edge.rounded_rectangle(
        (6, 6, width - 7, height - bottom_lift - 5),
        radius=max(18, radius - 6),
        outline=(105, 73, 47, 150),
        width=3,
    )
    edge.rounded_rectangle(
        (10, 10, width - 11, height - bottom_lift - 9),
        radius=max(15, radius - 10),
        outline=(238, 213, 178, 118),
        width=2,
    )
    return image


def flattened_source(image: Image.Image) -> Image.Image:
    background = Image.new("RGB", image.size, (246, 241, 230))
    background.paste(image, mask=image.getchannel("A"))
    return background


def contact_sheet(tile: Image.Image, assets: dict[str, Image.Image]) -> Image.Image:
    sheet = Image.new("RGB", (2048, 2048), (246, 241, 230))
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default(size=30)
    title_font = ImageFont.load_default(size=48)
    draw.text((64, 44), "Muted natural cork board kit v2", fill=(50, 49, 45), font=title_font)

    placements = {
        "Seamless repeat tile": ((64, 130, 928, 994), tile),
        "Medium landscape board": ((992, 130, 1984, 858), assets["medium-board.png"]),
        "Tall mobile board": ((64, 1060, 710, 1940), assets["vertical-board.png"]),
        "Wide planning strip": ((774, 1130, 1984, 1590), assets["wide-planning-strip.png"]),
    }
    for label, (box, asset) in placements.items():
        x1, y1, x2, y2 = box
        fitted = asset.copy()
        fitted.thumbnail((x2 - x1, y2 - y1), Image.Resampling.LANCZOS)
        x = x1 + (x2 - x1 - fitted.width) // 2
        y = y1 + (y2 - y1 - fitted.height) // 2
        if fitted.mode == "RGBA":
            sheet.paste(fitted, (x, y), fitted)
        else:
            sheet.paste(fitted, (x, y))
        draw.text((x1, y2 + 18), label, fill=(50, 49, 45), font=font)
    draw.text(
        (774, 1660),
        "Production uses the individual derivatives, never this review sheet.",
        fill=(92, 80, 66),
        font=font,
    )
    return sheet


def main() -> None:
    source = Image.open(SOURCE).convert("RGB")
    tile = seamless_tile(source)
    tile.save(KIT / "seamless-cork-tile-source.png", optimize=True)
    tile.convert("RGBA").save(KIT / "seamless-cork-tile.png", optimize=True)

    sizes = {
        "medium-board.png": (1324, 972),
        "vertical-board.png": (981, 1337),
        "wide-planning-strip.png": (1824, 693),
    }
    assets: dict[str, Image.Image] = {}
    for name, size in sizes.items():
        rendered = board(tile, size)
        assets[name] = rendered
        rendered.save(KIT / name, optimize=True)
        flattened_source(rendered).save(KIT / name.replace(".png", "-source.png"), optimize=True)

    review = contact_sheet(tile, assets)
    review.save(KIT / "cork-board-contact-sheet-2048.png", optimize=True)
    review.resize((1254, 1254), Image.Resampling.LANCZOS).save(
        KIT / "cork-board-contact-sheet-source.png", optimize=True
    )


if __name__ == "__main__":
    main()
