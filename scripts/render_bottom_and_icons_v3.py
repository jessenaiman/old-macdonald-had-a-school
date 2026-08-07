from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT = PUBLIC / "design-explorations-v3"
FONTS = Path(r"C:\Users\jesse\.agents\skills\canvas-design\canvas-fonts")
OUT.mkdir(parents=True, exist_ok=True)

NAVY = "#102943"
GREEN = "#4d6d5b"
GOLD = "#efab24"
CORAL = "#d96862"
TEAL = "#4d978c"
PAPER = "#fffaf0"
MUTED = "#756b60"
BLUE_RULE = "#a7cbe0"
RED_RULE = "#df9582"


def f(name, size):
    return ImageFont.truetype(str(FONTS / name), size)


DISPLAY = lambda s: f("BricolageGrotesque-Bold.ttf", s)
BODY = lambda s: f("BricolageGrotesque-Regular.ttf", s)
MONO = lambda s: f("DMMono-Regular.ttf", s)


def tiled(path, size):
    tile = Image.open(path).convert("RGB")
    out = Image.new("RGB", size)
    for y in range(0, size[1], tile.height):
        for x in range(0, size[0], tile.width):
            out.paste(tile, (x, y))
    return out


def text(draw, xy, value, font, fill=NAVY, anchor=None):
    draw.text(xy, value, font=font, fill=fill, anchor=anchor)


def wrap(draw, xy, value, font, fill, width, spacing=4):
    words, lines, line = value.split(), [], ""
    for word in words:
        trial = (line + " " + word).strip()
        if draw.textbbox((0, 0), trial, font=font)[2] <= width:
            line = trial
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    draw.multiline_text(xy, "\n".join(lines), font=font, fill=fill, spacing=spacing)


def shadow(im, box, radius=5, offset=(7, 8), alpha=45):
    x0, y0, x1, y1 = box
    layer = Image.new("RGBA", im.size)
    ImageDraw.Draw(layer).rounded_rectangle((x0+offset[0],y0+offset[1],x1+offset[0],y1+offset[1]),radius,fill=(55,35,18,alpha))
    im.alpha_composite(layer.filter(ImageFilter.GaussianBlur(4)))


def paste_patch(im, box, asset, label):
    x0,y0,x1,y1=box
    patch=Image.open(PUBLIC/"design-assets/blank-felt-patches-v1/individual-patches"/asset).convert("RGBA")
    patch=patch.crop(patch.getchannel("A").getbbox()).resize((x1-x0,y1-y0),Image.Resampling.LANCZOS)
    im.alpha_composite(patch,(x0,y0))
    text(ImageDraw.Draw(im),((x0+x1)//2,(y0+y1)//2-2),label,DISPLAY(17),"white","mm")


def fastener(im, name, box):
    asset=Image.open(PUBLIC/"design-assets/classroom-fasteners-v1/individual-icons"/name).convert("RGBA")
    asset.thumbnail((box[2]-box[0],box[3]-box[1]),Image.Resampling.LANCZOS)
    im.alpha_composite(asset,(box[0],box[1]))


def base_bottom(title, subtitle):
    w,h=1400,700
    kraft=tiled(PUBLIC/"design-assets/web-material-library-v1/cardboard/cardboard-warm-kraft-tile.png",(w,h)).convert("RGBA")
    kraft.alpha_composite(Image.new("RGBA",(w,h),(95,54,22,24)))
    d=ImageDraw.Draw(kraft)
    text(d,(55,38),title,DISPLAY(27),"#fff8e9")
    text(d,(55,76),subtitle.upper(),MONO(11),"#f3d078")
    d.line((55,108,1345,108),fill="#edcc78",width=2)
    # ruled paper begins exactly where the old yellow card began
    shadow(kraft,(38,135,1362,660),8,offset=(8,10),alpha=55)
    d.rounded_rectangle((38,135,1362,660),8,fill=PAPER,outline="#e2d1b2",width=2)
    for y in range(208,642,34):
        d.line((58,y,1342,y),fill=BLUE_RULE,width=2)
    d.line((118,155,118,642),fill=RED_RULE,width=2)
    return kraft,d


def goal_block(d):
    text(d,(82,175),"TODAY'S LESSON-PLANNING GOAL",MONO(10),GREEN)
    wrap(d,(82,210),"Taking turns in a shared song",DISPLAY(34),NAVY,390,4)
    wrap(d,(82,350),"Keep the goal visible while you choose materials, supports, and the invitation to learn.",BODY(15),MUTED,360,5)


def note_card(im,d,box,eyebrow,title,kind,style="clean"):
    x0,y0,x1,y1=box
    shadow(im,box,4,offset=(5,7),alpha=38)
    if style=="torn":
        pts=[(x0,y0+4),(x0+25,y0),(x0+58,y0+5),(x0+95,y0-2),(x1,y0+3),(x1-3,y1),(x0+90,y1-4),(x0+40,y1+2),(x0,y1-3)]
        d.polygon(pts,fill="#fffefa")
    else:
        d.rounded_rectangle(box,3,fill="#fffefa",outline="#e1d6c2",width=1)
    text(d,(x0+18,y0+45),eyebrow,MONO(9),"#c97324")
    wrap(d,(x0+18,y0+72),title,DISPLAY(20),NAVY,x1-x0-34,2)
    text(d,(x0+18,y1-23),"Open resource →",MONO(8),NAVY)
    if kind=="clip": fastener(im,"03-paperclip-double-loop.png",(x0+45,y0-22,x0+95,y0+36))
    if kind=="tape": fastener(im,"05-masking-tape.png",(x0+70,y0-20,x0+150,y0+30))
    if kind=="pin": fastener(im,"01-push-pin-rounded.png",(x1-50,y0-24,x1-8,y0+24))


def render_bottom_a():
    im,d=base_bottom("Pinned notes on ruled paper","Variant 1 · closest to the approved layout")
    goal_block(d)
    paste_patch(im,(82,505,330,594),"02-miss-puddles-rectangle.png","EDIT THE GOAL")
    text(d,(590,175),"GATHER WHAT HELPS",MONO(10),GREEN)
    text(d,(590,205),"Resources for this goal",DISPLAY(32),NAVY)
    cards=[(590,260,800,510,"LESSON OPENER","Invitation prompt","clip"),(825,260,1035,510,"PRINTABLE","Planning & response mat","tape"),(1060,260,1270,510,"TEACHER SUPPORT","Ways to adapt today","pin")]
    for c in cards: note_card(im,d,c[:4],*c[4:])
    text(d,(590,565),"Lines remain visible around the notes for handwriting.",BODY(14),MUTED)
    im.convert("RGB").save(OUT/"bottom-lined-option-1-pinned-notes.png",quality=96)


def render_bottom_b():
    im,d=base_bottom("Torn white lesson slips","Variant 2 · softer and more handmade")
    goal_block(d)
    paste_patch(im,(82,505,330,594),"02-miss-puddles-rectangle.png","EDIT THE GOAL")
    text(d,(590,175),"GATHER WHAT HELPS",MONO(10),GREEN)
    text(d,(590,205),"Resources for this goal",DISPLAY(32),NAVY)
    cards=[(575,270,815,465,"LESSON OPENER","Invitation prompt","clip"),(805,285,1045,480,"PRINTABLE","Planning & response mat","tape"),(1038,262,1278,457,"TEACHER SUPPORT","Ways to adapt today","pin")]
    for c in cards: note_card(im,d,c[:4],*c[4:],style="torn")
    text(d,(600,535),"The staggered slips feel placed by hand without changing the two-column structure.",BODY(14),MUTED)
    im.convert("RGB").save(OUT/"bottom-lined-option-2-torn-slips.png",quality=96)


def render_bottom_c():
    im,d=base_bottom("Compact notes, open writing lines","Variant 3 · maximum teacher annotation space")
    goal_block(d)
    paste_patch(im,(82,505,330,594),"02-miss-puddles-rectangle.png","EDIT THE GOAL")
    text(d,(590,175),"GATHER WHAT HELPS",MONO(10),GREEN)
    text(d,(590,205),"Resources for this goal",DISPLAY(32),NAVY)
    cards=[(590,255,800,405,"LESSON OPENER","Invitation prompt","clip"),(825,255,1035,405,"PRINTABLE","Response mat","tape"),(1060,255,1270,405,"SUPPORT","Ways to adapt","pin")]
    for c in cards: note_card(im,d,c[:4],*c[4:])
    text(d,(590,458),"NOTES TO CARRY FORWARD",MONO(10),GREEN)
    text(d,(610,510),"________________________________________________________",BODY(16),"#8c9aa0")
    text(d,(610,560),"________________________________________________________",BODY(16),"#8c9aa0")
    im.convert("RGB").save(OUT/"bottom-lined-option-3-open-notes.png",quality=96)


KINDS=["story","count","make","move","explore","music","read","write","numbers","shapes","build","paint","garden","cook","science","weather","animals","community","feelings","talk","listen","play","outdoors","reflect"]
LABELS=["Story","Count","Make","Move","Explore","Music","Read","Write","Numbers","Shapes","Build","Paint","Garden","Cook","Science","Weather","Animals","Community","Feelings","Talk","Listen","Play","Outdoors","Reflect"]


def glyph(d,c,kind,s=1.0):
    x,y=c; u=lambda n:int(n*s); lw=max(3,u(5))
    if kind == "story":
        d.polygon([(x-u(28),y-u(18)),(x-u(3),y-u(10)),(x-u(3),y+u(24)),(x-u(29),y+u(16))],fill=NAVY)
        d.polygon([(x+u(3),y-u(10)),(x+u(28),y-u(18)),(x+u(29),y+u(16)),(x+u(3),y+u(24))],fill=NAVY)
        d.line((x,y-u(9),x,y+u(24)),fill=PAPER,width=max(2,u(3)))
    elif kind == "read":
        d.polygon([(x-u(28),y-u(18)),(x-u(3),y-u(10)),(x-u(3),y+u(24)),(x-u(29),y+u(16))],fill=NAVY)
        d.polygon([(x+u(3),y-u(10)),(x+u(28),y-u(18)),(x+u(29),y+u(16)),(x+u(3),y+u(24))],fill=NAVY)
        d.line((x,y-u(9),x,y+u(24)),fill=PAPER,width=max(2,u(3)))
        d.ellipse((x-u(18),y-u(7),x-u(5),y+u(6)),outline=CORAL,width=max(2,u(3)));d.ellipse((x+u(5),y-u(7),x+u(18),y+u(6)),outline=CORAL,width=max(2,u(3)));d.line((x-u(5),y,x+u(5),y),fill=CORAL,width=max(2,u(3)))
    elif kind == "count":
        # Redesigned count palette: no yellow block against yellow field.
        colors=(NAVY,CORAL,TEAL)
        for i,col in enumerate(colors): d.rounded_rectangle((x-u(30)+u(i*20),y-u(5)-u(i*10),x-u(12)+u(i*20),y+u(20)-u(i*10)),u(4),fill=col)
    elif kind == "numbers":
        text(d,(x,y),"123",DISPLAY(max(16,u(28))),NAVY,"mm")
    elif kind=="make":
        d.ellipse((x-u(28),y,x-u(5),y+u(23)),outline=NAVY,width=lw);d.ellipse((x+u(3),y,x+u(26),y+u(23)),outline=NAVY,width=lw)
        d.line((x-u(8),y+u(5),x+u(21),y-u(27)),fill=NAVY,width=lw);d.line((x+u(7),y+u(5),x-u(20),y-u(27)),fill=NAVY,width=lw)
    elif kind == "move":
        d.line((x-u(30),y+u(10),x+u(12),y+u(10)),fill=NAVY,width=lw+2);d.line((x+u(10),y+u(10),x+u(28),y-u(8)),fill=NAVY,width=lw+2);d.polygon([(x+u(16),y-u(10)),(x+u(30),y-u(9)),(x+u(25),y+u(5))],fill=NAVY)
    elif kind == "outdoors":
        d.ellipse((x-u(29),y-u(29),x-u(9),y-u(9)),fill=CORAL)
        d.polygon([(x-u(8),y+u(23)),(x+u(9),y-u(18)),(x+u(26),y+u(23))],fill=NAVY)
        d.polygon([(x-u(25),y+u(23)),(x-u(12),y-u(7)),(x+u(1),y+u(23))],fill=TEAL)
    elif kind == "explore":
        d.ellipse((x-u(24),y-u(24),x+u(12),y+u(12)),outline=NAVY,width=lw);d.line((x+u(8),y+u(8),x+u(29),y+u(29)),fill=NAVY,width=lw)
        d.ellipse((x-u(10),y-u(10),x+u(2),y+u(2)),fill=TEAL)
    elif kind == "science":
        d.line((x-u(9),y-u(29),x+u(9),y-u(29)),fill=NAVY,width=lw);d.line((x-u(6),y-u(27),x-u(6),y-u(5)),fill=NAVY,width=lw);d.line((x+u(6),y-u(27),x+u(6),y-u(5)),fill=NAVY,width=lw)
        d.polygon([(x-u(6),y-u(5)),(x-u(27),y+u(28)),(x+u(27),y+u(28)),(x+u(6),y-u(5))],fill=NAVY)
        d.polygon([(x-u(17),y+u(12)),(x+u(18),y+u(12)),(x+u(25),y+u(25)),(x-u(25),y+u(25))],fill=TEAL)
    elif kind=="music":
        d.line((x-u(4),y-u(25),x-u(4),y+u(14)),fill=NAVY,width=lw);d.line((x-u(4),y-u(25),x+u(25),y-u(31)),fill=NAVY,width=lw);d.line((x+u(25),y-u(31),x+u(25),y+u(7)),fill=NAVY,width=lw)
        d.ellipse((x-u(18),y+u(6),x-u(2),y+u(22)),fill=NAVY);d.ellipse((x+u(11),y-u(1),x+u(27),y+u(15)),fill=NAVY)
    elif kind=="write":
        d.polygon([(x-u(24),y+u(20)),(x+u(17),y-u(21)),(x+u(29),y-u(9)),(x-u(13),y+u(30))],fill=NAVY);d.polygon([(x-u(24),y+u(20)),(x-u(30),y+u(31)),(x-u(13),y+u(30))],fill=CORAL)
    elif kind=="shapes":
        d.ellipse((x-u(31),y-u(9),x-u(5),y+u(17)),fill=CORAL);d.rectangle((x+u(3),y-u(26),x+u(29),y),fill=NAVY);d.polygon([(x+u(2),y+u(25)),(x+u(29),y+u(25)),(x+u(16),y+u(2))],fill=TEAL)
    elif kind=="build":
        d.rectangle((x-u(29),y+u(3),x-u(3),y+u(27)),fill=NAVY);d.rectangle((x+u(3),y+u(3),x+u(29),y+u(27)),fill=TEAL);d.rectangle((x-u(13),y-u(25),x+u(13),y-u(1)),fill=CORAL)
    elif kind=="paint":
        d.ellipse((x-u(30),y-u(23),x+u(20),y+u(25)),fill=NAVY);d.ellipse((x+u(2),y+u(7),x+u(17),y+u(22)),fill=GOLD);d.line((x+u(8),y-u(5),x+u(30),y-u(29)),fill=TEAL,width=lw+2)
    elif kind=="garden":
        d.line((x,y+u(27),x,y-u(5)),fill=NAVY,width=lw);d.ellipse((x-u(26),y-u(17),x,y+u(3)),fill=TEAL);d.ellipse((x,y-u(28),x+u(27),y-u(3)),fill=TEAL)
    elif kind=="cook":
        d.ellipse((x-u(28),y-u(6),x+u(28),y+u(25)),outline=NAVY,width=lw);d.line((x-u(21),y-u(8),x+u(20),y-u(8)),fill=NAVY,width=lw);d.line((x+u(4),y-u(6),x+u(26),y-u(29)),fill=CORAL,width=lw)
    elif kind=="weather":
        d.ellipse((x-u(29),y-u(11),x-u(3),y+u(15)),fill=TEAL);d.ellipse((x-u(10),y-u(23),x+u(21),y+u(14)),fill=TEAL);d.rectangle((x-u(27),y,x+u(29),y+u(16)),fill=TEAL)
        for dx in (-18,0,18): d.line((x+u(dx),y+u(23),x+u(dx-5),y+u(32)),fill=NAVY,width=max(2,u(3)))
    elif kind=="animals":
        d.ellipse((x-u(27),y-u(17),x+u(27),y+u(27)),fill=NAVY);d.polygon([(x-u(24),y-u(12)),(x-u(33),y-u(31)),(x-u(8),y-u(21))],fill=NAVY);d.polygon([(x+u(24),y-u(12)),(x+u(33),y-u(31)),(x+u(8),y-u(21))],fill=NAVY)
        d.ellipse((x-u(11),y+u(2),x-u(3),y+u(10)),fill=PAPER);d.ellipse((x+u(3),y+u(2),x+u(11),y+u(10)),fill=PAPER)
    elif kind=="community":
        for dx,col in ((-19,NAVY),(0,TEAL),(19,CORAL)):
            d.ellipse((x+u(dx-8),y-u(26),x+u(dx+8),y-u(10)),fill=col);d.rounded_rectangle((x+u(dx-11),y-u(6),x+u(dx+11),y+u(27)),u(5),fill=col)
    elif kind=="feelings":
        d.ellipse((x-u(28),y-u(28),x+u(28),y+u(28)),outline=NAVY,width=lw);d.ellipse((x-u(12),y-u(9),x-u(5),y-u(2)),fill=NAVY);d.ellipse((x+u(5),y-u(9),x+u(12),y-u(2)),fill=NAVY);d.arc((x-u(14),y-u(2),x+u(14),y+u(18)),0,180,fill=CORAL,width=lw)
    elif kind in ("talk","listen"):
        if kind=="talk":
            d.rounded_rectangle((x-u(30),y-u(24),x+u(28),y+u(15)),u(10),fill=NAVY);d.polygon([(x-u(9),y+u(12)),(x-u(18),y+u(29)),(x+u(4),y+u(14))],fill=NAVY)
            for dx in (-12,0,12): d.ellipse((x+u(dx-3),y-u(7),x+u(dx+3),y-u(1)),fill=PAPER)
        else:
            d.arc((x-u(23),y-u(29),x+u(21),y+u(23)),260,100,fill=NAVY,width=lw);d.arc((x-u(10),y-u(12),x+u(9),y+u(9)),260,110,fill=TEAL,width=lw)
    elif kind=="play":
        d.polygon([(x-u(21),y-u(27)),(x+u(29),y),(x-u(21),y+u(27))],fill=NAVY)
    elif kind=="reflect":
        d.ellipse((x-u(24),y-u(27),x+u(24),y+u(19)),outline=NAVY,width=lw);d.line((x-u(10),y+u(25),x+u(10),y+u(25)),fill=NAVY,width=lw);d.line((x,y+u(18),x,y+u(27)),fill=NAVY,width=lw)


def sticker(size,kind):
    im=Image.new("RGBA",(size,size),(0,0,0,0));d=ImageDraw.Draw(im);c=size//2
    d.ellipse((8,8,size-8,size-8),fill="#fffef7")
    d.ellipse((18,18,size-18,size-18),fill="#f2b735")
    glyph(d,(c,c),kind,(size/128)*0.82)
    return im


def render_icon_sheet():
    cell=256;cols=6;rows=4
    sheet=Image.new("RGBA",(cell*cols,cell*rows),(0,0,0,0))
    for i,kind in enumerate(KINDS):
        token=sticker(150,kind)
        x=(i%cols)*cell+(cell-150)//2;y=(i//cols)*cell+(cell-150)//2
        sheet.alpha_composite(token,(x,y))
    sheet.save(OUT/"small-activity-icons-transparent.png")

    w,h=1600,1040
    kraft=tiled(PUBLIC/"design-assets/web-material-library-v1/cardboard/cardboard-warm-kraft-tile.png",(w,h)).convert("RGBA")
    d=ImageDraw.Draw(kraft)
    text(d,(60,40),"Matte sticker activity markers",DISPLAY(30),"#fff9e9")
    text(d,(60,82),"24 LOW-DETAIL ICONS · TRANSPARENT MASTER SHEET INCLUDED",MONO(11),"#f3ce70")
    felt=tiled(PUBLIC/"design-assets/web-material-library-v1/felt/felt-08-miss-maisy-tile.png",(1480,860)).convert("RGBA")
    mask=Image.new("L",felt.size);ImageDraw.Draw(mask).rounded_rectangle((0,0,1479,859),24,fill=255);felt.putalpha(mask);kraft.alpha_composite(felt,(60,130))
    d=ImageDraw.Draw(kraft)
    for i,(kind,label) in enumerate(zip(KINDS,LABELS)):
        col=i%6;row=i//6;cx=180+col*235;cy=235+row*190
        token=sticker(112,kind);kraft.alpha_composite(token,(cx-56,cy-56))
        text(d,(cx,cy+75),label.upper(),MONO(10),"#fff9e9","mm")
    text(d,(1540,1015),"Designed for 32–48 px UI use",MONO(10),"#fff4de","ra")
    kraft.convert("RGB").save(OUT/"small-activity-icons-preview.png",quality=96)


if __name__=="__main__":
    render_bottom_a();render_bottom_b();render_bottom_c();render_icon_sheet()
    for p in sorted(OUT.glob("*.png")): print(p)
