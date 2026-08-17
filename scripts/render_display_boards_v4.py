from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import math
import random
import render_bottom_and_icons_v3 as v3

ROOT=Path(__file__).resolve().parents[1]
PUBLIC=ROOT/"public"
SOURCE_IMAGES=ROOT/"assets"/"source-images"/"public"
OUT=PUBLIC/"design-explorations-v4"
INDIVIDUAL=OUT/"individual-felt-icons"
FONTS=Path(r"C:\Users\jesse\.agents\skills\canvas-design\canvas-fonts")
OUT.mkdir(parents=True,exist_ok=True);INDIVIDUAL.mkdir(parents=True,exist_ok=True)

NAVY="#102943"; GREEN="#4e705b"; GOLD="#e9a921"; CREAM="#fffaf0"; MUTED="#71675b"
DISPLAY=lambda s:ImageFont.truetype(str(FONTS/"BricolageGrotesque-Bold.ttf"),s)
BODY=lambda s:ImageFont.truetype(str(FONTS/"BricolageGrotesque-Regular.ttf"),s)
MONO=lambda s:ImageFont.truetype(str(FONTS/"DMMono-Regular.ttf"),s)


def text(d,xy,value,font,fill=NAVY,anchor=None): d.text(xy,value,font=font,fill=fill,anchor=anchor)


def tile(path,size):
    src=Image.open(path).convert("RGB");out=Image.new("RGB",size)
    for y in range(0,size[1],src.height):
        for x in range(0,size[0],src.width): out.paste(src,(x,y))
    return out


def source_asset(relative):
    archived=SOURCE_IMAGES/relative
    return archived if archived.exists() else PUBLIC/relative


def cork_surface(size):
    random.seed(44);im=tile(source_asset("design-assets/web-material-library-v1/cardboard/cardboard-warm-kraft-tile.png"),size).convert("RGBA")
    d=ImageDraw.Draw(im,"RGBA")
    for _ in range(3500):
        x=random.randrange(size[0]);y=random.randrange(size[1]);r=random.choice((1,1,1,2,3));c=random.choice(((76,42,18,35),(239,202,139,35),(110,65,31,28)))
        d.ellipse((x-r,y-r,x+r,y+r),fill=c)
    return im


def whiteboard_surface(size):
    im=Image.new("RGBA",size,"#f7f7f1");d=ImageDraw.Draw(im,"RGBA")
    for y in range(size[1]):
        a=int(18*(1-y/size[1]));d.line((0,y,size[0],y),fill=(190,210,214,a))
    d.line((18,22,size[0]-18,22),fill=(255,255,255,180),width=3)
    return im


def presentation_surface(size):
    im=tile(source_asset("design-assets/web-material-library-v1/construction-paper/construction-paper-05-mr-sam-tile.png"),size).convert("RGBA")
    im.alpha_composite(Image.new("RGBA",size,(8,35,53,45)))
    return im


def shadow(im,box,radius=8,alpha=52,offset=(7,9)):
    x0,y0,x1,y1=box;layer=Image.new("RGBA",im.size);ld=ImageDraw.Draw(layer)
    ld.rounded_rectangle((x0+offset[0],y0+offset[1],x1+offset[0],y1+offset[1]),radius,fill=(35,24,15,alpha))
    im.alpha_composite(layer.filter(ImageFilter.GaussianBlur(5)))


def fastener(im,name,xy,maxsize):
    icon=Image.open(source_asset(Path("design-assets/classroom-fasteners-v1/individual-icons")/name)).convert("RGBA");icon.thumbnail(maxsize,Image.Resampling.LANCZOS);im.alpha_composite(icon,xy)


def note(im,box,eyebrow,title,attachment,board_kind,index):
    x0,y0,x1,y1=box;shadow(im,box,6,54)
    d=ImageDraw.Draw(im)
    d.rounded_rectangle(box,5,fill="#fffef9",outline="#ded4c1",width=2)
    # small colored tab links the three notes without shrinking them
    tab=["#e6b348","#d98769","#76a38e"][index]
    d.rounded_rectangle((x0+22,y0+28,x0+85,y0+37),4,fill=tab)
    text(d,(x0+25,y0+60),eyebrow,MONO(10),"#c56f22")
    text(d,(x0+25,y0+91),title,DISPLAY(25),NAVY)
    text(d,(x0+25,y0+139),"OPEN RESOURCE  >",MONO(9),NAVY)
    d.line((x0+25,y0+178,x1-25,y0+178),fill="#dfd4be",width=2)
    text(d,(x0+25,y0+202),"TEACHER NOTES",MONO(9),GREEN)
    for y in range(y0+246,y1-27,42): d.line((x0+25,y,x1-25,y),fill="#a8c8da",width=2)
    # Board-specific attachment behavior
    if board_kind=="cork":
        file=["03-paperclip-double-loop.png","05-masking-tape.png","01-push-pin-rounded.png"][index]
        pos=[(x0+35,y0-24),(x0+126,y0-22),(x1-55,y0-27)][index]
        fastener(im,file,pos,(80,70))
    elif board_kind=="whiteboard":
        colors=["#e9675d","#efb72c","#4c9a8d"]
        d.ellipse((x0+20,y0-15,x0+55,y0+20),fill=colors[index],outline="#ffffff",width=3)
        d.ellipse((x0+28,y0-8,x0+40,y0+4),fill="#ffffff")
    else:
        colors=["#e6b348","#d98769","#76a38e"];c=colors[index]
        d.polygon([(x0,y0),(x0+50,y0),(x0,y0+50)],fill=c);d.polygon([(x1,y1),(x1-50,y1),(x1,y1-50)],fill=c)


def board_mockup(kind,title,subtitle):
    w,h=1400,800
    base=tile(source_asset("design-assets/web-material-library-v1/cardboard/cardboard-warm-kraft-tile.png"),(w,h)).convert("RGBA")
    base.alpha_composite(Image.new("RGBA",(w,h),(76,44,20,30)));d=ImageDraw.Draw(base)
    text(d,(48,31),title,DISPLAY(27),"#fff8e8");text(d,(48,70),subtitle.upper(),MONO(11),"#f2ce70");d.line((48,103,1352,103),fill="#edca71",width=2)
    boardbox=(35,125,1365,765);shadow(base,boardbox,14,70,(8,11))
    surface={"cork":cork_surface,"whiteboard":whiteboard_surface,"presentation":presentation_surface}[kind]((1290,600))
    mask=Image.new("L",surface.size);ImageDraw.Draw(mask).rounded_rectangle((0,0,1289,599),11,fill=255);surface.putalpha(mask);base.alpha_composite(surface,(55,145))
    d=ImageDraw.Draw(base)
    frame={"cork":"#885b31","whiteboard":"#b9c1c2","presentation":"#183b50"}[kind]
    d.rounded_rectangle(boardbox,14,outline=frame,width=20)
    # header sits above the notes, not inside their writing areas
    headerfill=(255,250,236,235) if kind!="presentation" else (255,250,236,245)
    d.rounded_rectangle((82,166,1318,244),10,fill=headerfill)
    text(d,(110,184),"GATHER WHAT HELPS",MONO(10),GREEN)
    text(d,(110,207),"Resources for this goal",DISPLAY(29),NAVY)
    text(d,(1288,207),"GOAL · TAKING TURNS IN A SHARED SONG",MONO(10),GREEN,"ra")
    notes=[(95,276,475,716,"LESSON OPENER","Invitation prompt"),(510,276,890,716,"PRINTABLE","Planning & response mat"),(925,276,1305,716,"TEACHER SUPPORT","Ways to adapt today")]
    for i,n in enumerate(notes): note(base,n[:4],n[4],n[5],None,kind,i)
    base.convert("RGB").save(OUT/f"resource-board-{kind}.png",quality=96)


FELTS=[
    "felt-02-miss-puddles-tile.png","felt-08-miss-maisy-tile.png","felt-10-whiskers-tile.png",
    "felt-09-hopper-tile.png","felt-03-mr-rusty-tile.png","felt-04-miss-hayley-tile.png"
]


def irregular_mask(size,seed,inset=8):
    random.seed(seed);cx=cy=size/2;pts=[]
    for i in range(32):
        a=math.pi*2*i/32;r=size/2-inset+random.uniform(-4,4)
        pts.append((cx+math.cos(a)*r,cy+math.sin(a)*r))
    mask=Image.new("L",(size,size));ImageDraw.Draw(mask).polygon(pts,fill=255)
    return mask


def felt_icon(kind,index,size=156):
    canvas=Image.new("RGBA",(size,size),(0,0,0,0))
    # soft hand-cut drop shadow
    mask=irregular_mask(size,index+100,12)
    sh=Image.new("RGBA",(size,size),(28,23,17,0));sh.putalpha(mask.filter(ImageFilter.GaussianBlur(5)));canvas.alpha_composite(sh,(3,5))
    felt_name="felt-12-penny-tile.png" if kind=="count" else FELTS[index%len(FELTS)]
    felt=tile(source_asset(Path("design-assets/web-material-library-v1/felt")/felt_name),(size,size)).convert("RGBA")
    felt.putalpha(mask);canvas.alpha_composite(felt)
    # simplified appliqué glyph; its colors remain bold, then receive fiber grain
    glyph_layer=Image.new("RGBA",(size,size),(0,0,0,0));gd=ImageDraw.Draw(glyph_layer)
    v3.glyph(gd,(size//2,size//2),kind,(size/128)*.78)
    alpha=glyph_layer.getchannel("A")
    grain=tile(source_asset("design-assets/web-material-library-v1/felt/felt-12-penny-tile.png"),(size,size)).convert("RGBA")
    grain=ImageEnhance.Contrast(grain).enhance(1.25);grain.putalpha(alpha.point(lambda a:int(a*.24)))
    canvas.alpha_composite(glyph_layer);canvas.alpha_composite(grain)
    return canvas


def icon_assets():
    cell=256;sheet=Image.new("RGBA",(1536,1024),(0,0,0,0))
    for i,(kind,label) in enumerate(zip(v3.KINDS,v3.LABELS)):
        icon=felt_icon(kind,i,156);x=(i%6)*cell+50;y=(i//6)*cell+50;sheet.alpha_composite(icon,(x,y))
        icon.save(INDIVIDUAL/f"{i+1:02d}-{label.lower().replace(' ','-')}.png")
    sheet.save(OUT/"small-felt-activity-icons-transparent.png")

    preview=tile(source_asset("design-assets/web-material-library-v1/cardboard/cardboard-warm-kraft-tile.png"),(1600,1050)).convert("RGBA")
    preview.alpha_composite(Image.new("RGBA",preview.size,(86,49,20,28)));d=ImageDraw.Draw(preview)
    text(d,(60,39),"Small felt activity appliqués",DISPLAY(30),"#fff8e8");text(d,(60,81),"24 HAND-CUT, TEXTURED SYMBOLS · NO MICRO-STITCHING",MONO(11),"#f2ce70")
    d.rounded_rectangle((60,126,1540,1000),24,fill="#f4ead2")
    for i,(kind,label) in enumerate(zip(v3.KINDS,v3.LABELS)):
        col=i%6;row=i//6;cx=180+col*235;cy=230+row*195
        icon=felt_icon(kind,i,124);preview.alpha_composite(icon,(cx-62,cy-62));text(d,(cx,cy+81),label.upper(),MONO(10),NAVY,"mm")
    preview.convert("RGB").save(OUT/"small-felt-activity-icons-preview.png",quality=96)


if __name__=="__main__":
    board_mockup("cork","Cork bulletin board","Warmest and most naturally unified")
    board_mockup("whiteboard","Magnetic whiteboard","Cleanest contrast and strongest print clarity")
    board_mockup("presentation","Presentation board","Most structured and curriculum-forward")
    icon_assets()
    for p in sorted(OUT.glob("*.png")): print(p)
