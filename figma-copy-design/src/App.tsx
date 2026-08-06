import { useState } from 'react'
import logoDark    from '@/imports/logo_-_dark_blue.png'
import logoColor   from '@/imports/logo_-_alternate.png'
import barnHero    from '@/imports/oldmac-school.png'
import recipeTrail  from '@/imports/ChatGPT_Image_Jul_30__2026__04_53_23_PM__5_.png'
import imgOldMac    from '@/imports/old-mac.png'
import imgMissPuddles from '@/imports/miss-puddles.png'
import imgMrRusty   from '@/imports/mr-rusty.png'
import imgMissHayley from '@/imports/miss-hayley.png'
import imgMrSam     from '@/imports/mr-sam.png'
import imgMrMaisy   from '@/imports/mr-maisy.png'
import imgMrPuddles from '@/imports/mr-puddles.png'
import imgMissMaisy from '@/imports/miss-maisy.png'

// ── Page state ────────────────────────────────────────────────────────────────
type Page = 'home' | 'daycare' | 'preschool' | 'grade1' | 'grade2' | 'lesson' | 'daycare-lesson' | 'cast'

// ── Font helpers ──────────────────────────────────────────────────────────────
const boogaloo = (size: string, color = 'inherit'): React.CSSProperties =>
  ({ fontFamily:"'Boogaloo', cursive", fontSize: size, color, lineHeight: 1.1 })

const lilita = (size: string, color = 'inherit'): React.CSSProperties =>
  ({ fontFamily:"'Lilita One', cursive", fontSize: size, color, lineHeight: 1.2 })

const caveat = (size: string, color = 'inherit'): React.CSSProperties =>
  ({ fontFamily:"'Caveat', cursive", fontSize: size, color, lineHeight: 1.3 })

const nunito = (size: string, color = 'inherit', weight = 800): React.CSSProperties =>
  ({ fontFamily:"'Nunito', sans-serif", fontSize: size, color, fontWeight: weight })

const playfairItalic = (size: string, color = 'inherit'): React.CSSProperties =>
  ({ fontFamily:"'Playfair Display', serif", fontSize: size, color, fontStyle:'italic', fontWeight: 700 })

// ── Primitives ────────────────────────────────────────────────────────────────

function Pin({ color }: { color: string }) {
  return <div className="pin" style={{ backgroundColor: color }} />
}

function FeltBtn({ children, bg, shadow, onClick, full = true }: {
  children: React.ReactNode; bg: string; shadow: string; onClick?: () => void; full?: boolean
}) {
  return (
    <button onClick={onClick}
      className={`relative ${full ? 'w-full' : ''} rounded-2xl py-2 px-5 text-white transition-all active:translate-y-0.5 hover:brightness-110`}
      style={{ backgroundColor: bg, boxShadow:`0 3px 0 ${shadow}`, fontFamily:"'Fredoka One', cursive", fontSize:'14px' }}>
      <div className="absolute inset-1.5 rounded-xl pointer-events-none" style={{ border:'1.5px dashed rgba(255,255,255,.4)' }} />
      <span className="relative z-10">{children}</span>
    </button>
  )
}

function SageChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded-full"
      style={{ backgroundColor:'var(--sage-tint)', color:'var(--sage-mid)', border:'1px solid var(--sage-border)',
        ...nunito('10px', 'var(--sage-mid)'), letterSpacing:'0.03em' }}>
      {children}
    </span>
  )
}

function GoldChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded-full"
      style={{ backgroundColor:'rgba(192,148,30,.13)', color:'var(--gold-dark)', border:'1px solid rgba(192,148,30,.4)',
        ...nunito('10px', 'var(--gold-dark)'), letterSpacing:'0.03em' }}>
      {children}
    </span>
  )
}

// Circular character badge — used throughout as branding
function CharBadge({ emoji, color, label, size = 44 }: { emoji: string; color: string; label?: string; size?: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="rounded-full flex items-center justify-center flex-shrink-0"
        style={{ width: size, height: size, backgroundColor: color,
          boxShadow:'0 4px 0 rgba(0,0,0,.3), inset 0 1px 0 rgba(255,255,255,.25)',
          border:'2.5px solid rgba(255,255,255,.45)', fontSize: size * 0.42 }}>
        {emoji}
      </div>
      {label && <span style={{ ...nunito('9px', 'rgba(255,255,255,.7)'), textAlign:'center', lineHeight:1.1 }}>{label}</span>}
    </div>
  )
}

// Circular felt badge — colored background with woven texture, 3-D stitching (groove + thread)
function StaffAvatar({ src, name, size = 72, bg = '#1A3A5C' }: {
  src: string; name: string; size?: number; bg?: string
}) {
  const g1 = Math.max(4, Math.round(size * 0.06))   // groove inset
  const t1 = g1 + 2                                  // thread inset (inside groove)
  const depth = Math.round(size * 0.055)
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0, position: 'relative',
      backgroundColor: bg,
      backgroundImage:
        'repeating-linear-gradient(90deg,transparent 0px,transparent 1px,rgba(255,255,255,.05) 1px,rgba(255,255,255,.05) 2px),' +
        'repeating-linear-gradient(0deg,transparent 0px,transparent 1px,rgba(255,255,255,.04) 1px,rgba(255,255,255,.04) 2px)',
      boxShadow: `0 ${depth}px 0 rgba(0,0,0,.42), 0 ${depth*2}px ${depth*5}px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.22)`,
    }}>
      {/* Image clipped to circle */}
      <div style={{ position:'absolute', inset:0, borderRadius:'50%', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <img src={src} alt={name} draggable={false}
          style={{ width:'90%', height:'90%', objectFit:'contain', objectPosition:'center bottom', userSelect:'none' }} />
      </div>
      {/* Groove channel pressed into felt */}
      <div style={{ position:'absolute', inset:g1, borderRadius:'50%', pointerEvents:'none',
        boxShadow:'inset 0 2px 6px rgba(0,0,0,.45), inset 0 0 0 1px rgba(0,0,0,.18)' }} />
      {/* Thread sitting in groove */}
      <div style={{ position:'absolute', inset:t1, borderRadius:'50%', pointerEvents:'none',
        border:'2.5px dashed rgba(255,255,255,.80)',
        filter:'drop-shadow(0 1.5px 2px rgba(0,0,0,.55)) drop-shadow(0 -0.5px 0 rgba(255,255,255,.22))' }} />
    </div>
  )
}

// Staff name → portrait image and card colour
const STAFF_AVATAR: Record<string, string> = {
  'Old MacDonald': imgOldMac,
  'Miss Puddles':  imgMissPuddles,
  'Mr Rusty':      imgMrRusty,
  'Miss Hayley':   imgMissHayley,
  'Mr Sam':        imgMrSam,
  'Mr Maisy':      imgMrMaisy,
  'Mr Puddles':    imgMrPuddles,
  'Miss Maisy':    imgMissMaisy,
}

// ── Data ──────────────────────────────────────────────────────────────────────

const CLUSTERS = [
  { id:'language', label:'Language & Communication', icon:'📖', color:'#2D5F8A', light:'rgba(45,95,138,.12)' },
  { id:'math',     label:'Math & Inquiry',           icon:'🔢', color:'#7A4E2D', light:'rgba(122,78,45,.10)' },
  { id:'music',    label:'Music, Movement & Community', icon:'🎵', color:'#8B2635', light:'rgba(139,38,53,.10)' },
  { id:'routines', label:'Routines & Regulation',    icon:'🌿', color:'#4A7A3A', light:'rgba(74,122,58,.10)' },
]

const GRADE_CONFIG = [
  { id:'daycare',   label:'Daycare',   age:'0–2 yrs', staff:'Miss Puddles',              staffEmoji:'🦆',   color:'#7744CC', shadow:'#4A22AA', textColor:'#F2EAFF', tagline:'Lap and floor learning', avatar: imgMissPuddles,  avatarName:'Miss Puddles'  },
  { id:'preschool', label:'Preschool', age:'3–4 yrs', staff:'Miss Puddles & Miss Maisy', staffEmoji:'🦆🐄', color:'#E07820', shadow:'#A84E08', textColor:'#FFF5EA', tagline:'Story and sensation',     avatar: imgMissMaisy,    avatarName:'Miss Maisy'    },
  { id:'grade1',    label:'Grade 1',   age:'5–6 yrs', staff:'Mr Rusty & Miss Hayley',    staffEmoji:'🐴👩', color:'#CC3333', shadow:'#881818', textColor:'#FFF0F0', tagline:'Reading and rhythm',       avatar: imgMrRusty,      avatarName:'Mr Rusty'      },
  { id:'grade2',    label:'Grade 2',   age:'6–7 yrs', staff:'Miss Hayley & Mr Sam',      staffEmoji:'👩🐷', color:'#2255AA', shadow:'#113388', textColor:'#EFF4FF', tagline:'Thinking and making',      avatar: imgMrSam,        avatarName:'Mr Sam'        },
]

type LessonData = {
  id: string; grade: string; cluster: string
  title: string; subtitle?: string; desc: string
  staff: string; staffEmoji: string; staffColor: string
  preview?: string; tags: string[]; available: boolean
}

const ALL_LESSONS: LessonData[] = [
  // ── Daycare
  { id:'barnyard-sounds', grade:'daycare',  cluster:'music',    title:'Barnyard Animal Sounds & Action Imitation', desc:'Choose a song, listen for the animal, name it together, copy its sound and add its movement.', staff:'Miss Puddles', staffEmoji:'🦆', staffColor:'#7744CC', tags:['Song','Movement','Toddler','Preschool'], available:true },
  { id:'circle-songs',   grade:'daycare',   cluster:'music',    title:'Circle Time Songs',             desc:'Fingerplay, lap songs and steady-beat games for infants and toddlers.',            staff:'Miss Puddles', staffEmoji:'🦆', staffColor:'#3A6FA8', tags:['Song','Whole group'],         available:false },
  { id:'board-books',    grade:'daycare',   cluster:'language', title:'Story Time: Board Books',       desc:'Short read-alouds with bold repetitive patterns children can join in.',             staff:'Miss Puddles', staffEmoji:'🦆', staffColor:'#3A6FA8', tags:['Read-aloud','No materials'],  available:false },
  { id:'sensory-tray',   grade:'daycare',   cluster:'math',     title:'Sensory Tray Exploration',      desc:'Fill, pour and sort — early math concepts through hands-on play.',                  staff:'Miss Puddles', staffEmoji:'🦆', staffColor:'#3A6FA8', tags:['Sensory','Small group'],      available:false },
  { id:'fingerplay',     grade:'daycare',   cluster:'music',    title:'Fingerplay & Movement',         desc:'Simple action songs that build body awareness and the ability to follow.',           staff:'Miss Puddles', staffEmoji:'🦆', staffColor:'#3A6FA8', tags:['Movement','Song'],            available:false },
  // ── Preschool
  { id:'recipe-trail',   grade:'preschool', cluster:'routines', title:'Mix, Measure & Munch',          subtitle:'Follow the Recipe Trail', desc:'Children wash, count, pour and stir with Miss Maisy — a five-step cooking trail with full printable.',  staff:'Miss Maisy', staffEmoji:'🐄', staffColor:'#4A7A3A', preview: recipeTrail, tags:['Printable','Cooking','5 steps'], available:true },
  { id:'music-trail',    grade:'preschool', cluster:'music',    title:'Follow the Music Trail',        desc:'A movement path through the classroom — each station has a sound, beat or song.',  staff:'Mr Rusty',    staffEmoji:'🐴', staffColor:'#7A4E2D', tags:['Movement','Stations'],        available:false },
  { id:'story-circle',   grade:'preschool', cluster:'language', title:'Show & Tell Story Circle',      desc:'Each child brings one object and tells its story. Builds vocabulary and turn-taking.',staff:'Miss Puddles',staffEmoji:'🦆', staffColor:'#3A6FA8', tags:['Speaking','Whole group'],      available:false },
  { id:'shape-hunt',     grade:'preschool', cluster:'math',     title:'Shape Hunt Outdoors',           desc:'Find circles, squares and triangles in the schoolyard. Record on a tally sheet.',  staff:'Mr Maisy',    staffEmoji:'🐄', staffColor:'#B5272C', tags:['Outdoor','Printable'],        available:false },
  // ── Grade 1
  { id:'phonics',        grade:'grade1',    cluster:'language', title:'Phonics: Long & Short Vowel Sounds', desc:'Help children hear the difference between long and short vowel sounds through movement and listening games.', staff:'Miss Hayley', staffEmoji:'👩', staffColor:'#8B2635', tags:['Phonics','Video','Printable','5 steps'], available:true },
  { id:'rhyming',        grade:'grade1',    cluster:'language', title:'Rhyming & Sound Play',          desc:'Oral games and card sorts to develop phonological awareness.',                     staff:'Miss Hayley', staffEmoji:'👩', staffColor:'#8B2635', tags:['Game','Pairs'],               available:false },
  { id:'steady-beat',    grade:'grade1',    cluster:'music',    title:'Steady Beat & Rhythm',          desc:'Clapping, stepping and echoing — the foundation of reading rhythm notation.',       staff:'Mr Rusty',    staffEmoji:'🐴', staffColor:'#7A4E2D', tags:['Music','Movement'],           available:false },
  { id:'nature-sketch',  grade:'grade1',    cluster:'math',     title:'Nature Observation Journal',    desc:'Students draw, count and label things found outside.',                             staff:'Mr Puddles',  staffEmoji:'🦆', staffColor:'#2D6A8B', tags:['Science','Drawing','Outdoor'], available:false },
  // ── Grade 2
  { id:'inference',      grade:'grade2',    cluster:'language', title:'Reading: Making Inferences',    desc:'Use picture clues and context to figure out what the text does not say directly.',  staff:'Miss Hayley', staffEmoji:'👩', staffColor:'#8B2635', tags:['Reading','Discussion'],       available:false },
  { id:'adding-groups',  grade:'grade2',    cluster:'math',     title:'Adding with Equal Groups',      desc:'Build arrays with counters and connect them to repeated addition equations.',       staff:'Mr Sam',      staffEmoji:'🐷', staffColor:'#7A5530', tags:['Math','Manipulatives'],       available:false },
  { id:'creative-move',  grade:'grade2',    cluster:'music',    title:'Creative Movement Stories',     desc:'Students choreograph a short movement story inspired by a read-aloud.',              staff:'Miss Hayley', staffEmoji:'👩', staffColor:'#8B2635', tags:['Drama','Movement'],           available:false },
  { id:'build-challenge',grade:'grade2',    cluster:'math',     title:'Engineering Build Challenge',   desc:'Given a simple problem and limited materials, teams plan, build and test a solution.',staff:'Mr Sam',     staffEmoji:'🐷', staffColor:'#7A5530', tags:['STEM','Group'],               available:false },
]

const STAFF = [
  { name:'Old MacDonald', avatar:imgOldMac,      species:'Human', emoji:'👨‍🌾', role:'Headmaster & Band Leader',    grade:'Whole school',    color:'#8B5E3C', shadow:'#5C3A1E', traits:['Welcoming','Attentive','Playful'],      leads:['Morning gathering & assembly','Whole-school songs & celebrations','Storytime & presentations'],  props:['Straw hat','Storybook','Banjo or guitar'],           collab:['Mr Rusty — band scenes','Miss Puddles — arrivals','Miss Hayley — stories'] },
  { name:'Miss Puddles',  avatar:imgMissPuddles, species:'Duck',  emoji:'🦆',  role:'Daycare Teacher',              grade:'Daycare (2–3)',   color:'#3A6FA8', shadow:'#234568', traits:['Nurturing','Patient','Practical'],       leads:['Circle time & fingerplay songs','Early art & sensory activities','Sharing & turn-taking'],       props:['Blue gingham dress','Whistle on cord','Paintbrush'],  collab:['Old MacDonald — welcome','Mr Rusty — rhythm songs','Miss Maisy — family'] },
  { name:'Mr Rusty',      avatar:imgMrRusty,     species:'Horse', emoji:'🐴',  role:'Music & Dance Teacher',        grade:'Kinder – Gr 1/2',color:'#7A4E2D', shadow:'#503018', traits:['Warm','Rhythmic','Encouraging'],         leads:['Steady beat & rhythm games','Fiddle-led transitions','Barn-dance circles'],                      props:['Blue neckerchief','Fiddle and bow','Dark waistcoat'],  collab:['Old MacDonald — band','Miss Hayley — drama music','Mr Maisy — warm-ups'] },
  { name:'Miss Hayley',   avatar:imgMissHayley,  species:'Human', emoji:'👩',  role:'Grade 1/2 & Drama Teacher',    grade:'Grade 1/2',      color:'#8B2635', shadow:'#5C1820', traits:['Expressive','Encouraging','Imaginative'], leads:['Storytime & imagination games','Drama rehearsal & class plays','Creative movement'],              props:['Cowboy hat','Storybook or puppets','Hand drum'],      collab:['Old MacDonald — stories','Mr Rusty — music cues','Mr Sam — drama-build'] },
  { name:'Mr Sam',        avatar:imgMrSam,       species:'Pig',   emoji:'🐷',  role:'Math & Building Teacher',      grade:'Grade 1/2',      color:'#7A5530', shadow:'#4A3018', traits:['Inventive','Patient','Hands-on'],          leads:['Counting, measuring & sorting','Engineering & build-table','Plan–build–test cycles'],             props:['Black glasses','Notebook & ruler','Blocks/tool kit'],  collab:['Miss Hayley — projects','Miss Puddles — making','Mr Puddles — exhibits'] },
  { name:'Mr Maisy',      avatar:imgMrMaisy,     species:'Cow',   emoji:'🐄',  role:'Physical Education Teacher',   grade:'Whole school',   color:'#B5272C', shadow:'#7A1519', traits:['Energetic','Encouraging','Dependable'],    leads:['Outdoor games & warm-ups','Relay races & gross-motor','Teamwork through action'],                  props:['Red bandana & plaid shirt','Whistle','Hoops or ball'], collab:['Old MacDonald — assemblies','Mr Rusty — dance','Miss Hayley — movement'] },
  { name:'Mr Puddles',    avatar:imgMrPuddles,   species:'Duck',  emoji:'🦆',  role:'Art & Photography Teacher',    grade:'Whole school',   color:'#2D6A8B', shadow:'#1A4560', traits:['Curious','Gentle','Observant'],            leads:['Nature observation & bird studies','Painting, sketching & photography','Exhibitions'],             props:['Checked cap','Camera or binoculars','Sketchbook'],    collab:['Miss Puddles — daycare scenes','Old MacDonald — events','Miss Maisy — displays'] },
  { name:'Miss Maisy',    avatar:imgMissMaisy,   species:'Cow',   emoji:'🐄',  role:'Secretary & Gardening Lead',   grade:'Whole school',   color:'#4A7A3A', shadow:'#2E5022', traits:['Welcoming','Organised','Caring'],           leads:['Family welcome & office support','Gardening & simple food prep','Healthy habits & displays'],      props:['Apron & gardening gloves','Trug or watering can','Notice board'], collab:['Miss Puddles — family check-ins','Mr Puddles — displays','Mr Rusty — events'] },
]

const STUDENTS = [
  { name:'Hopper',   species:'Rabbit', emoji:'🐰', personality:'Energetic, optimistic, ready to join', color:'#C95F2A', unit:2 },
  { name:'Whiskers', species:'Cat',    emoji:'🐱', personality:'Curious, gentle, thoughtful',           color:'#7B4FA8', unit:3 },
  { name:'Scout',    species:'Dog',    emoji:'🐶', personality:'Adventurous, observant, dependable',    color:'#2D6FA8', unit:3 },
  { name:'Penny',    species:'Chick',  emoji:'🐣', personality:'Young, earnest, growing in confidence', color:'#B88B0A', unit:1 },
  { name:'Maisy',    species:'Cow',    emoji:'🐄', personality:'Warm, confident, encouraging',          color:'#1A4C7A', unit:2 },
  { name:'Puddles',  species:'Duck',   emoji:'🦆', personality:'Expressive, sociable, enthusiastic',    color:'#2D6E8A', unit:1 },
  { name:'Sam',      species:'Pig',    emoji:'🐷', personality:'Thoughtful, inventive, cheerful',       color:'#7A5530', unit:4 },
  { name:'Rusty',    species:'Horse',  emoji:'🐴', personality:'Calm, reliable, quietly courageous',    color:'#7A3A18', unit:4 },
]

const LESSON_STEPS = [
  { id:'watch',    icon:'📺', label:'Watch',    sub:'Read aloud video',     title:'Long & Short Vowel Song',    desc:'Kids enjoy watching and listening together. A great whole-class warm-up.',                               action:'View Full Screen',    color:'#B5272C', shadow:'#7A1519', btn:'#8F1F23', btnS:'#5C1013', printable:false },
  { id:'try',      icon:'✏️', label:'Try',      sub:'Teacher-led activity', title:'Vowel Sound Sort',           desc:'Show picture cards one at a time. Students sort into long or short vowel sounds as a class group.',      action:'View Activity',       color:'#1A5C8B', shadow:'#0F3D5E', btn:'#124A70', btnS:'#0A3050', printable:false },
  { id:'practice', icon:'🃏', label:'Practice', sub:'Student practice',     title:'Vowel Picture Card Sort',    desc:'Students sort picture cards into long and short vowel sounds independently or in pairs.',                 action:'🖨️ Print Cards',      color:'#B5652A', shadow:'#7A3F10', btn:'#8A4A18', btnS:'#5C3010', printable:true  },
  { id:'check',    icon:'✅', label:'Check',    sub:'Quick assessment',     title:'Vowel Spot Check',           desc:'Say a word aloud. Students show thumbs up for long, thumbs down for short. Fast and visible!',           action:'🖨️ Print Assessment', color:'#2D6E8A', shadow:'#1A4A60', btn:'#1E5A75', btnS:'#103C50', printable:true  },
  { id:'extend',   icon:'🔭', label:'Extend',   sub:'Find more ideas',      title:'Games & Activities',         desc:'Discover extension activities, songs, and games to deepen understanding of vowel sounds.',               action:'Find Activities',     color:'#6B3FA0', shadow:'#4A2870', btn:'#5A3388', btnS:'#3A1F60', printable:false },
]

// ── Shared UI ─────────────────────────────────────────────────────────────────

function LessonCard({ lesson, onOpen }: { lesson: LessonData; onOpen: (id: string) => void }) {
  const cluster = CLUSTERS.find(c => c.id === lesson.cluster)
  return (
    <div className="parchment-card overflow-hidden flex flex-col" style={{ opacity: lesson.available ? 1 : 0.72 }}>
      {/* Preview image or cluster-colored header */}
      {lesson.preview ? (
        <div className="relative overflow-hidden" style={{ height:'140px' }}>
          <img src={lesson.preview} alt={lesson.title} className="w-full h-full object-cover" style={{ objectPosition:'top center' }} />
          <div className="absolute inset-0" style={{ background:'linear-gradient(to bottom, transparent 50%, rgba(15,32,64,.6) 100%)' }} />
          <div className="absolute bottom-2 left-3">
            <span className="text-white text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor:'rgba(0,0,0,.4)', ...nunito('10px','white') }}>
              {lesson.subtitle ?? 'Printable included'}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-3"
          style={{ backgroundColor: cluster?.light ?? 'rgba(0,0,0,.04)', opacity: lesson.available ? 1 : 0.55 }}>
          <StaffAvatar src={STAFF_AVATAR[lesson.staff] ?? imgOldMac} name={lesson.staff} size={62} bg={lesson.staffColor} />
        </div>
      )}
      <div className="px-3 pt-2.5 pb-3 flex flex-col flex-1">
        {/* Cluster tag */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <span style={{ ...nunito('9px', cluster?.color ?? 'var(--text-soft)'), letterSpacing:'0.08em', textTransform:'uppercase' }}>{cluster?.label}</span>
          {!lesson.available && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor:'rgba(0,0,0,.07)', ...nunito('9px','var(--text-soft)') }}>Coming soon</span>}
        </div>
        {/* Title */}
        <div className="mb-1 leading-snug flex-1" style={{ ...lilita('15px','var(--text-dark)') }}>{lesson.title}</div>
        {/* Staff */}
        <div className="flex items-center gap-2 mb-2">
          <StaffAvatar src={STAFF_AVATAR[lesson.staff] ?? imgOldMac} name={lesson.staff} size={26} bg={lesson.staffColor} />
          <span style={{ ...nunito('11px', 'var(--text-soft)', 600) }}>{lesson.staff}</span>
        </div>
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {lesson.tags.map(t => <GoldChip key={t}>{t}</GoldChip>)}
        </div>
        {/* Action */}
        {lesson.available
          ? <FeltBtn bg={lesson.staffColor} shadow="rgba(0,0,0,.4)" onClick={() => onOpen(lesson.id)}>Open lesson →</FeltBtn>
          : <div className="w-full rounded-2xl py-2 text-center text-xs font-bold" style={{ backgroundColor:'rgba(0,0,0,.06)', color:'var(--text-soft)', border:'1.5px dashed var(--parch-dark)' }}>In the works 🌱</div>
        }
      </div>
    </div>
  )
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────

function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <>
      {/* ── Grade band picker — first thing above the fold ── */}
      <div style={{ backgroundColor:'var(--navy-dark)', borderBottom:'4px solid var(--gold)' }}>
        <div className="max-w-screen-xl mx-auto px-4 py-5">
          <div className="grid gap-3" style={{ gridTemplateColumns:'repeat(auto-fit, minmax(200px,1fr))' }}>
            {GRADE_CONFIG.map(g => (
              <button key={g.id} onClick={() => setPage(g.id as Page)}
                className="felt-patch text-left transition-all hover:brightness-108 hover:-translate-y-0.5 group"
                style={{ backgroundColor: g.color }}>
                <div className="relative z-10 p-4 flex items-center gap-4">
                  {/* Character patch avatar */}
                  <StaffAvatar src={g.avatar} name={g.avatarName} size={68} />
                  <div className="flex-1 min-w-0">
                    <div style={{ ...nunito('10px','rgba(255,255,255,.65)'), textTransform:'uppercase', letterSpacing:'0.1em' }}>{g.age}</div>
                    <div style={{ ...boogaloo('26px','white'), lineHeight:1 }}>{g.label}</div>
                    <div style={{ ...caveat('15px','rgba(255,255,255,.85)') }}>{g.tagline}</div>
                    <div style={{ ...nunito('10px','rgba(255,255,255,.68)', 600), marginTop:'2px' }}>Led by {g.staff}</div>
                    <div className="mt-2 inline-block rounded-lg px-2.5 py-1"
                      style={{ backgroundColor:'rgba(0,0,0,.25)', border:'1px dashed rgba(255,255,255,.35)' }}>
                      <span style={{ ...nunito('11px','white') }}>{ALL_LESSONS.filter(l => l.grade === g.id).length} lessons →</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Hero banner — brand text | barn scene ── */}
      <div style={{
        backgroundColor:'var(--burlap)',
        backgroundImage:
          'repeating-linear-gradient(90deg,transparent 0px,transparent 2px,rgba(120,78,28,.04) 2px,rgba(120,78,28,.04) 3px),' +
          'repeating-linear-gradient(0deg,transparent 0px,transparent 2px,rgba(120,78,28,.03) 2px,rgba(120,78,28,.03) 3px)',
        borderBottom:'3px solid var(--gold)',
      }}>
        <div className="max-w-screen-xl mx-auto px-5 py-6 flex items-center gap-6 flex-wrap" style={{ minHeight:'clamp(130px,16vw,200px)' }}>
          <div className="flex-1" style={{ minWidth:'240px' }}>
            <div style={{ ...nunito('10px','var(--gold-dark)'), letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:'6px' }}>
              Music · Learning · Visual Storytelling
            </div>
            <h1 style={{ ...playfairItalic('clamp(22px,3.2vw,44px)','var(--navy)'), marginBottom:'4px' }}>
              Old MacDonald Had a School
            </h1>
            <p style={{ ...caveat('17px','var(--text-mid)'), marginBottom:'8px' }}>by Jesse Neiman</p>
            <p style={{ ...nunito('12px','var(--text-soft)',600), lineHeight:'1.55' }}>
              Where familiar songs become new places to learn.
            </p>
          </div>
          <div className="hidden md:block flex-shrink-0 overflow-hidden rounded-2xl"
            style={{ width:'clamp(160px,18vw,260px)', height:'clamp(100px,12vw,170px)',
              boxShadow:'0 5px 0 rgba(0,0,0,.28), 0 10px 24px rgba(0,0,0,.18)',
              border:'2.5px solid var(--gold)' }}>
            <img src={barnHero} alt="Old MacDonald's felt barn school"
              className="w-full h-full object-cover" style={{ objectPosition:'center' }} />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">

        {/* ── Browse by Subject Cluster ── */}
        <section className="mb-10">
          <h2 style={{ ...lilita('clamp(22px,3vw,30px)','var(--navy)'), marginBottom:'6px' }}>Browse by Subject</h2>
          <p style={{ ...nunito('13px','var(--text-mid)', 600), marginBottom:'20px' }}>
            Topics are organised into four subject clusters. Each cluster spans all grade bands so one theme grows with your students.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {CLUSTERS.map(cl => {
              const clLessons = ALL_LESSONS.filter(l => l.cluster === cl.id)
              return (
                <div key={cl.id} className="warm-panel p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: cl.light, border:`2px solid ${cl.color}30` }}>{cl.icon}</div>
                    <div style={{ ...lilita('18px', cl.color) }}>{cl.label}</div>
                  </div>
                  <div className="space-y-1.5">
                    {clLessons.slice(0, 4).map(l => (
                      <div key={l.id} className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                        style={{ backgroundColor:'rgba(0,0,0,.03)', border:'1px solid rgba(0,0,0,.06)' }}>
                        <span className="text-base">{l.staffEmoji}</span>
                        <span style={{ ...nunito('12px','var(--text-dark)', 700) }}>{l.title}</span>
                        <span style={{ ...nunito('10px','var(--text-soft)', 600), marginLeft:'auto', flexShrink:0 }}>{l.grade.replace('grade','Gr ')}</span>
                        {l.available && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: cl.light, color: cl.color, ...nunito('9px',cl.color) }}>Ready</span>}
                      </div>
                    ))}
                    {clLessons.length > 4 && <div style={{ ...nunito('11px','var(--text-soft)', 600), paddingLeft:'8px' }}>+ {clLessons.length - 4} more…</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Featured printable (the recipe trail) ── */}
        <section className="mb-4">
          <div className="felt-navy rounded-3xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span>🐄</span>
                  <span style={{ ...nunito('11px','rgba(255,255,255,.6)'), textTransform:'uppercase', letterSpacing:'0.08em' }}>Preschool · Routines</span>
                </div>
                <h2 style={{ ...boogaloo('clamp(24px,3vw,36px)','var(--gold-light)'), marginBottom:'4px' }}>Mix, Measure & Munch</h2>
                <p style={{ ...caveat('20px','rgba(255,255,255,.82)'), marginBottom:'16px' }}>Follow the Recipe Trail — Miss Maisy&apos;s Market Basket</p>
                <p style={{ ...nunito('13px','rgba(255,255,255,.75)', 600), marginBottom:'20px', lineHeight:'1.6' }}>
                  A five-step cooking trail for preschool. Children wash, count, pour and stir. Includes a full illustrated printable trail — ready to download and display.
                </p>
                <div>
                  <FeltBtn bg="var(--gold)" shadow="var(--gold-dark)" full={false} onClick={() => setPage('preschool')}>
                    Open Preschool Lessons →
                  </FeltBtn>
                </div>
              </div>
              <div className="relative overflow-hidden" style={{ minHeight:'240px' }}>
                <img src={recipeTrail} alt="Mix Measure Munch — preschool recipe trail printable" className="w-full h-full object-cover" style={{ objectPosition:'top center' }} />
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}

// ── GRADE PAGE (reused for all 4 grade bands) ─────────────────────────────────

function GradePage({ grade, setPage }: { grade: string; setPage: (p: Page) => void }) {
  const [clusterFilter, setClusterFilter] = useState<string | null>(null)
  const config = GRADE_CONFIG.find(g => g.id === grade)!
  const lessons = ALL_LESSONS.filter(l =>
    l.grade === grade && (clusterFilter === null || l.cluster === clusterFilter)
  )

  const handleOpen = (id: string) => {
    if (id === 'phonics') setPage('lesson')
    if (id === 'barnyard-sounds') setPage('daycare-lesson')
  }

  return (
    <>
      {/* ── Grade hero ── */}
      <div className="felt-navy px-6 py-8" style={{ borderBottom:'5px solid var(--navy-dark)' }}>
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex-1">
              <div style={{ ...nunito('11px','rgba(255,255,255,.55)'), textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'6px' }}>
                {config.age} · Teacher-planning resource
              </div>
              <h1 style={{ ...boogaloo('clamp(32px,5vw,56px)','white'), marginBottom:'4px' }}>
                {config.label}
              </h1>
              <p style={{ ...caveat('20px','rgba(255,255,255,.8)'), marginBottom:'16px' }}>
                {config.tagline}
              </p>
              <div className="flex items-center gap-3">
                <StaffAvatar src={config.avatar} name={config.avatarName} size={48} />
                <span style={{ ...nunito('13px','rgba(255,255,255,.78)', 600) }}>Led by {config.staff}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {GRADE_CONFIG.map(g => (
                <button key={g.id} onClick={() => setPage(g.id as Page)}
                  className="rounded-2xl px-3 py-1.5 transition-all hover:brightness-110"
                  style={{ backgroundColor: g.id === grade ? g.color : 'rgba(255,255,255,.1)',
                    border: g.id === grade ? `2px solid white` : '1.5px solid rgba(255,255,255,.2)',
                    ...boogaloo('15px', g.id === grade ? 'white' : 'rgba(255,255,255,.65)') }}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-7">
        <div className="flex gap-7" style={{ alignItems:'start' }}>

          {/* ── Main lesson grid ── */}
          <div className="flex-1 min-w-0">
            {/* Cluster filter */}
            <div className="flex flex-wrap gap-2 mb-5">
              <button onClick={() => setClusterFilter(null)}
                className="px-3 py-1.5 rounded-full uppercase transition-all"
                style={{ ...nunito('11px', !clusterFilter ? 'var(--parchment)' : 'var(--text-soft)'),
                  backgroundColor: !clusterFilter ? 'var(--navy)' : 'transparent',
                  border: !clusterFilter ? '1.5px solid var(--navy)' : '1.5px dashed var(--parch-dark)',
                  letterSpacing:'0.06em' }}>All subjects</button>
              {CLUSTERS.map(cl => (
                <button key={cl.id} onClick={() => setClusterFilter(cl.id)}
                  className="px-3 py-1.5 rounded-full uppercase transition-all"
                  style={{ ...nunito('11px', clusterFilter === cl.id ? 'white' : cl.color),
                    backgroundColor: clusterFilter === cl.id ? cl.color : 'transparent',
                    border: clusterFilter === cl.id ? `1.5px solid ${cl.color}` : `1.5px dashed ${cl.color}80`,
                    letterSpacing:'0.06em' }}>
                  {cl.icon} {cl.label}
                </button>
              ))}
            </div>

            {/* Lesson cards */}
            <div className="grid gap-4" style={{ gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))' }}>
              {lessons.map(l => <LessonCard key={l.id} lesson={l} onOpen={handleOpen} />)}
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <aside className="hidden xl:block flex-shrink-0" style={{ width:'272px' }}>
            <div className="warm-panel p-4 mb-4">
              <h3 style={{ ...lilita('17px','var(--navy)'), marginBottom:'10px' }}>About {config.label}</h3>
              <div className="flex gap-2 items-center mb-3">
                {config.staffEmoji.split('').filter(Boolean).map((e, i) => (
                  <CharBadge key={i} emoji={e} color={config.color} size={40} />
                ))}
                <div className="ml-1">
                  <div style={{ ...nunito('12px','var(--text-dark)') }}>{config.staff}</div>
                  <div style={{ ...nunito('10px','var(--text-soft)', 600), textTransform:'uppercase', letterSpacing:'0.06em' }}>Class lead</div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label:'Age range', value: config.age },
                  { label:'Lessons', value: ALL_LESSONS.filter(l => l.grade === grade).length.toString() },
                  { label:'Ready now', value: ALL_LESSONS.filter(l => l.grade === grade && l.available).length.toString() },
                  { label:'With printables', value: ALL_LESSONS.filter(l => l.grade === grade && l.tags.includes('Printable')).length.toString() },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-1.5 px-2 rounded-xl"
                    style={{ backgroundColor:'rgba(0,0,0,.04)', borderBottom:'1px solid var(--parch-mid)' }}>
                    <span style={{ ...nunito('12px','var(--text-mid)', 600) }}>{item.label}</span>
                    <span style={{ ...lilita('15px','var(--navy)') }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cast for this grade */}
            <div className="parchment-card p-4 mb-4">
              <h3 style={{ ...lilita('15px','var(--text-dark)'), marginBottom:'10px' }}>Cast & Characters</h3>
              <div className="space-y-2">
                {STAFF.filter(s => s.grade.toLowerCase().includes(grade.replace('grade','')))
                  .concat(STAFF.filter(s => s.grade === 'Whole school'))
                  .slice(0, 4)
                  .map(s => (
                    <div key={s.name} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-base flex-shrink-0"
                        style={{ backgroundColor: s.color }}>{s.emoji}</div>
                      <div>
                        <div style={{ ...nunito('12px','var(--text-dark)') }}>{s.name}</div>
                        <div style={{ ...nunito('10px','var(--text-soft)', 600) }}>{s.role}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Quick jump to other grades */}
            <div className="sage-card p-4">
              <h3 style={{ ...lilita('15px','var(--sage-mid)'), marginBottom:'10px' }}>Other Grades</h3>
              <div className="space-y-2">
                {GRADE_CONFIG.filter(g => g.id !== grade).map(g => (
                  <button key={g.id} onClick={() => setPage(g.id as Page)} className="w-full text-left rounded-xl px-3 py-2 transition-all hover:brightness-105"
                    style={{ backgroundColor: g.color + '18', border:`1.5px dashed ${g.color}50` }}>
                    <span style={{ ...boogaloo('14px', g.color) }}>{g.label}</span>
                    <span style={{ ...nunito('10px','var(--text-soft)', 600), display:'block' }}>{g.age}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </>
  )
}

// ── DAYCARE LESSON PAGE ───────────────────────────────────────────────────────

const DAYCARE_SONGS = [
  { title:"I Went Down into the Barnyard", author:'Kathy Reid-Naiman', animals:'Cow · Duck · Pig · Horse', note:'Project source',      avatar:imgMissMaisy,   bg:'#4A7A3A' },
  { title:"Old MacDonald Had a Farm",      author:'Traditional',        animals:null,                       note:'Verify exact version', avatar:imgOldMac,      bg:'#B5272C' },
  { title:"I Had a Little Rooster",        author:'Traditional',        animals:null,                       note:'Verify exact version', avatar:imgMrRusty,     bg:'#7A4E2D' },
  { title:"Over in the Meadow",            author:'Traditional',        animals:null,                       note:'Verify text and tune', avatar:imgMissPuddles, bg:'#2255AA' },
]

function DaycareLessonPage({ setPage }: { setPage: (p: Page) => void }) {
  const [tab, setTab] = useState<'toddler'|'preschool'>('preschool')

  const activity = tab === 'preschool'
    ? 'Listen for the animal. Name it together. Copy its sound. Add its movement.'
    : 'Listen for the animal sound. Point to the picture. Copy the movement together.'

  return (
    <div>
      {/* Back */}
      <div style={{ backgroundColor:'var(--navy-dark)', borderBottom:'2px solid var(--gold)' }}>
        <div className="max-w-screen-xl mx-auto px-5 py-2.5 flex items-center gap-3">
          <button onClick={() => setPage('daycare')}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-all hover:brightness-110"
            style={{ backgroundColor:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.15)', ...nunito('12px','rgba(255,255,255,.75)',700) }}>
            ← Daycare
          </button>
          <span style={{ ...nunito('11px','rgba(255,255,255,.4)',600) }}>/ Barnyard Animal Sounds</span>
        </div>
      </div>

      {/* ── Title block ── */}
      <div style={{ backgroundColor:'var(--parchment)',
        backgroundImage:'repeating-linear-gradient(90deg,transparent 0,transparent 2px,rgba(120,78,28,.04) 2px,rgba(120,78,28,.04) 3px),repeating-linear-gradient(0deg,transparent 0,transparent 2px,rgba(120,78,28,.03) 2px,rgba(120,78,28,.03) 3px)',
        borderBottom:'3px solid var(--gold)' }}>
        <div className="max-w-screen-xl mx-auto px-5 py-8 text-center">
          <h1 style={{ ...playfairItalic('clamp(22px,3.8vw,40px)','var(--navy)'), marginBottom:'6px' }}>
            Barnyard Animal Sounds &amp; Action Imitation
          </h1>
          <p style={{ ...caveat('18px','var(--text-mid)'), marginBottom:'20px' }}>
            One learning focus. A new song whenever you return.
          </p>
          {/* Age band tabs */}
          <div className="inline-flex rounded-2xl overflow-hidden" style={{ border:'2px solid var(--navy)', boxShadow:'0 3px 0 rgba(0,0,0,.18)' }}>
            {(['toddler','preschool'] as const).map((id, i) => (
              <button key={id} onClick={() => setTab(id)}
                className="px-7 py-2 transition-all"
                style={{
                  backgroundColor: tab === id ? 'var(--navy)' : 'transparent',
                  borderRight: i === 0 ? '2px solid var(--navy)' : 'none',
                  ...nunito('13px', tab === id ? 'white' : 'var(--navy)', 800),
                }}>
                {id === 'toddler' ? 'Toddler' : 'Preschool'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Info strip ── */}
      <div style={{ backgroundColor:'var(--burlap)', borderBottom:'2px solid rgba(192,148,30,.35)' }}>
        <div className="max-w-screen-xl mx-auto px-5 py-4 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon:'🏠', head:'Learning focus —', body:'Animals, sounds and action imitation' },
            { icon:'🎵', head:'Teaching rhythm —', body:'Identify → Imitate → Move → Join In' },
            { icon:'🔍', head:'Observe —',          body:'Names · Sounds · Movement · Group response' },
          ].map(item => (
            <div key={item.head} className="flex items-start gap-3">
              <span style={{ fontSize:'22px', lineHeight:1 }}>{item.icon}</span>
              <div>
                <span style={{ ...nunito('11px','var(--text-soft)',800), textTransform:'uppercase', letterSpacing:'0.06em' }}>{item.head} </span>
                <span style={{ ...nunito('12px','var(--text-dark)',600) }}>{item.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Song shelf ── */}
      <div style={{ backgroundColor:'var(--navy-dark)',
        backgroundImage:'repeating-linear-gradient(90deg,transparent 0,transparent 2px,rgba(255,255,255,.018) 2px,rgba(255,255,255,.018) 3px),repeating-linear-gradient(0deg,transparent 0,transparent 2px,rgba(255,255,255,.014) 2px,rgba(255,255,255,.014) 3px)' }}>
        <div className="max-w-screen-xl mx-auto px-5 py-8">
          <h2 style={{ ...lilita('clamp(20px,2.8vw,28px)','white'), marginBottom:'20px' }}>Choose a song for today</h2>

          {/* Book shelf rail */}
          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-3">
              {DAYCARE_SONGS.map((song, i) => (
                <div key={i} className="flex flex-col" style={{ position:'relative' }}>
                  {/* Book card */}
                  <div className="parchment-card overflow-visible flex flex-col flex-1"
                    style={{ boxShadow:'4px 0 0 rgba(0,0,0,.18), 0 6px 0 rgba(0,0,0,.28), 0 12px 28px rgba(0,0,0,.35)', borderRadius:'6px 12px 12px 6px' }}>
                    {/* Badge strip on top */}
                    <div className="flex justify-center pt-5 pb-3"
                      style={{ backgroundColor: i === 0 ? 'rgba(139,38,53,.08)' : 'rgba(0,0,0,.04)', borderRadius:'4px 10px 0 0', borderBottom:'1px solid rgba(0,0,0,.07)' }}>
                      <StaffAvatar src={song.avatar} name="" size={72} bg={song.bg} />
                    </div>
                    <div className="px-3 pt-3 pb-3 flex flex-col flex-1">
                      <div style={{ ...playfairItalic('13px','var(--text-dark)'), lineHeight:1.35, marginBottom:'5px' }}>{song.title}</div>
                      <div style={{ ...caveat('14px','var(--text-soft)'), marginBottom:'6px' }}>{song.author}</div>
                      {song.animals && (
                        <div style={{ ...nunito('10px','var(--text-mid)',700), marginBottom:'8px', lineHeight:1.5 }}>{song.animals}</div>
                      )}
                      <div className="mt-auto pt-2">
                        <button className="w-full rounded-xl px-2 py-1.5 flex items-center justify-center gap-1.5 transition-all hover:brightness-110"
                          style={{ backgroundColor:'var(--navy)', boxShadow:'0 2px 0 var(--navy-dark)' }}>
                          <span style={{ color:'var(--gold-light)', fontSize:'11px' }}>★</span>
                          <span style={{ ...nunito('10px','white',700) }}>{song.note}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Book spine shadow */}
                  <div style={{ position:'absolute', top:0, left:0, bottom:0, width:'6px', borderRadius:'6px 0 0 6px',
                    background:'linear-gradient(to right, rgba(0,0,0,.3), rgba(0,0,0,.06))', zIndex:2 }} />
                </div>
              ))}
            </div>
            {/* Shelf rail */}
            <div style={{ height:'14px', background:'linear-gradient(to bottom,#4A2E12,#2E1A0A)', borderRadius:'2px',
              boxShadow:'0 4px 12px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.1)' }} />
          </div>
        </div>
      </div>

      {/* ── Today's activity ── */}
      <div style={{ backgroundColor:'var(--parchment)' }}>
        <div className="max-w-screen-xl mx-auto px-5 py-8">
          <div className="warm-panel p-5 md:p-7">
            <div className="flex gap-5 md:gap-7 flex-wrap items-start">
              {/* Miss Puddles badge */}
              <div className="flex-shrink-0">
                <StaffAvatar src={imgMissPuddles} name="Miss Puddles" size={88} bg="#7744CC" />
              </div>
              {/* Activity text */}
              <div className="flex-1" style={{ minWidth:'200px' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div style={{ width:14, height:14, backgroundColor:'var(--barn-red)', borderRadius:'3px', flexShrink:0 }} />
                  <div style={{ ...lilita('18px','var(--navy)') }}>Today&apos;s activity</div>
                </div>
                <hr className="sage-rule mb-3" />
                <p style={{ ...nunito('14px','var(--text-dark)',600), lineHeight:1.65, marginBottom:'12px' }}>
                  {activity}
                </p>
                <p style={{ ...nunito('12px','var(--text-mid)',700) }}>
                  <span style={{ fontWeight:900, color:'var(--text-dark)' }}>Movement choices:</span>{' '}
                  standing · seated · gesture only · watch and listen
                </p>
              </div>
              {/* Resource links */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button className="parchment-card px-4 py-2.5 flex items-center gap-2.5 hover:brightness-95 transition-all">
                  <span style={{ fontSize:'18px' }}>🎵</span>
                  <span style={{ ...nunito('12px','var(--navy)',700) }}>Lyrics &amp; chords</span>
                </button>
                <button className="parchment-card px-4 py-2.5 flex items-center gap-2.5 hover:brightness-95 transition-all">
                  <span style={{ fontSize:'18px' }}>📋</span>
                  <span style={{ ...nunito('12px','var(--navy)',700) }}>Activity guide</span>
                </button>
              </div>
            </div>
          </div>
          {/* Copyright note */}
          <p className="text-center mt-5" style={{ ...nunito('11px','var(--text-soft)',600) }}>
            🛡️ Lyrics and chords are shown only after the exact version and source are confirmed.
          </p>
        </div>
      </div>
    </div>
  )
}

// ── LESSON PAGE (Phonics) ─────────────────────────────────────────────────────

function LessonPage() {
  const [activeStep, setActiveStep] = useState('watch')
  const [note, setNote] = useState('')
  const printables = LESSON_STEPS.filter(s => s.printable)

  return (
    <>
      {/* Breadcrumb */}
      <div className="px-5 py-2" style={{ backgroundColor:'var(--parch-mid)', borderBottom:'1.5px solid var(--parch-dark)' }}>
        <div className="max-w-screen-xl mx-auto flex items-center gap-1.5 flex-wrap">
          {['Home','Grade 1','Language & Communication','Phonics'].map((c,i,arr) => (
            <span key={c} className="flex items-center gap-1.5">
              <span className="text-xs font-semibold" style={{ color: i===arr.length-1 ? 'var(--barn-red)' : 'var(--text-mid)' }}>{c}</span>
              {i < arr.length-1 && <span className="text-xs" style={{ color:'var(--text-soft)', opacity:.45 }}>›</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Felt board header */}
      <section className="felt-navy px-5 pt-6 pb-5" style={{ borderBottom:'5px solid var(--navy-dark)' }}>
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-start justify-between gap-6 mb-6 flex-wrap">
            <div className="flex-1" style={{ maxWidth:'640px' }}>
              <h1 className="text-white italic leading-tight mb-2"
                style={{ ...playfairItalic('clamp(20px,3vw,36px)','white'), textShadow:'0 2px 8px rgba(0,0,0,.4)' }}>
                Phonics: Long &amp; Short Vowel Sounds
              </h1>
              <p className="text-sm font-semibold leading-relaxed" style={{ color:'rgba(255,255,255,.85)' }}>
                A hands-on starting point for helping children hear the difference between long and short vowel sounds through movement, watching and listening games.
              </p>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <div className="relative pt-2">
                <Pin color="var(--gold)" />
                <div className="felt-patch px-5 py-3 text-center" style={{ backgroundColor:'var(--gold-dark)', minWidth:'170px' }}>
                  <div className="relative z-10" style={{ ...nunito('13px','white') }}>📌 Built for Grade 1</div>
                  <div className="relative z-10 text-yellow-100 text-xs font-semibold mt-1">Approx. 30–50 minutes</div>
                </div>
              </div>
              <div className="felt-patch px-4 py-2 text-center" style={{ backgroundColor:'var(--navy-mid)' }}>
                <div className="relative z-10 text-yellow-300 text-xs font-bold" style={{ fontFamily:"'Nunito', sans-serif" }}>🎯 Parents: 10–20 min</div>
              </div>
            </div>
          </div>

          {/* Step cards */}
          <div className="grid gap-4" style={{ gridTemplateColumns:'repeat(5, 1fr)' }}>
            {LESSON_STEPS.map((step, i) => {
              const pinColors = ['#C9A227','#E9C46A','#B5272C','#6B3FA0','#1A5C8B']
              const isActive = activeStep === step.id
              return (
                <div key={step.id} className="relative pt-3">
                  <Pin color={pinColors[i]} />
                  <div className={`felt-patch cursor-pointer flex flex-col h-full transition-all hover:-translate-y-0.5 ${isActive ? 'brightness-110' : ''}`}
                    style={{ backgroundColor: step.color, ...(isActive ? { outline:'3px solid rgba(255,255,255,.75)', outlineOffset:'2px' } : {}) }}
                    onClick={() => setActiveStep(step.id)}>
                    <div className="relative z-10 p-3 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="px-2.5 py-0.5 rounded-full text-white text-xs font-black"
                          style={{ backgroundColor:'rgba(0,0,0,.28)', fontFamily:"'Fredoka One', cursive", fontSize:'11px' }}>{step.label}</div>
                        {step.printable && <span className="text-xs" style={{ color:'rgba(255,255,255,.65)' }}>🖨️</span>}
                      </div>
                      <div className="rounded-xl mb-2.5 flex items-center justify-center"
                        style={{ backgroundColor:'rgba(0,0,0,.22)', border:'1px solid rgba(255,255,255,.14)', height:'52px' }}>
                        <span style={{ fontSize:'26px', filter:'drop-shadow(0 2px 4px rgba(0,0,0,.4))' }}>{step.icon}</span>
                      </div>
                      <div className="text-white text-xs font-bold uppercase tracking-widest mb-1" style={{ opacity:.72, fontSize:'9px' }}>{step.sub}</div>
                      <div className="text-white leading-snug mb-2 flex-1" style={{ ...nunito('13px','white',900) }}>{step.title}</div>
                      <p className="text-white text-xs leading-snug mb-3" style={{ opacity:.88, fontSize:'11px' }}>{step.desc}</p>
                      <FeltBtn bg={step.btn} shadow={step.btnS}>{step.action}</FeltBtn>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Print strip */}
          <div className="mt-4 flex items-center gap-3 flex-wrap">
            <span style={{ ...nunito('10px','rgba(255,255,255,.55)') }}>🖨️ Print for tomorrow:</span>
            {printables.map(s => (
              <button key={s.id} className="relative rounded-xl px-3 py-1.5 text-white text-xs transition-all hover:brightness-110"
                style={{ backgroundColor: s.color, boxShadow:`0 2px 0 ${s.shadow}`, fontFamily:"'Fredoka One', cursive", fontSize:'11px' }}>
                <div className="absolute inset-0.5 rounded-lg pointer-events-none" style={{ border:'1px dashed rgba(255,255,255,.35)' }} />
                <span className="relative z-10">{s.icon} {s.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Teacher Notes + Curriculum Map */}
      <section className="px-5 py-7">
        <div className="max-w-screen-xl mx-auto grid gap-5" style={{ gridTemplateColumns:'repeat(auto-fit, minmax(280px,1fr))' }}>
          {/* Teacher Notes */}
          <div className="relative pt-3">
            <Pin color="var(--gold)" />
            <div className="warm-panel p-5 h-full flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <img src={logoColor} alt="logo" className="w-9 h-9 object-contain opacity-90 flex-shrink-0" />
                <div>
                  <h2 className="italic font-bold leading-tight" style={{ ...playfairItalic('20px','var(--navy)') }}>Teacher Notes</h2>
                  <p className="text-xs font-semibold" style={{ color:'var(--text-soft)' }}>Adaptations and reminders for your class</p>
                </div>
              </div>
              <ul className="space-y-2.5 mb-4">
                {['Sing the vowel song together before the video — it primes the ear.',
                  'Use picture cards as exit tickets; note who confuses "boat" vs "hot".',
                  'Pair ELL students with a buddy for the card sort activity.'].map((n,i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                      style={{ backgroundColor:'var(--navy)', color:'var(--parchment)', fontFamily:"'Nunito', sans-serif", fontWeight:900, fontSize:'11px' }}>{i+1}</span>
                    <span className="text-sm font-semibold leading-snug" style={{ color:'var(--text-ink)' }}>{n}</span>
                  </li>
                ))}
              </ul>
              <div className="rounded-2xl overflow-hidden mb-3" style={{ border:'2px dashed var(--sage-border)' }}>
                <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add your own note here…" rows={3}
                  className="w-full p-3 text-sm resize-none focus:outline-none bg-transparent"
                  style={{ color:'var(--text-dark)', fontFamily:"'Nunito', sans-serif",
                    backgroundImage:'repeating-linear-gradient(transparent, transparent 23px, rgba(84,112,72,.15) 23px, rgba(84,112,72,.15) 24px)',
                    lineHeight:'24px' }} />
              </div>
              <FeltBtn bg="var(--navy)" shadow="var(--navy-dark)">💾 Save Note</FeltBtn>
            </div>
          </div>

          {/* Curriculum Map */}
          <div className="relative pt-3">
            <Pin color="var(--barn-red)" />
            <div className="felt-patch h-full" style={{ backgroundColor:'var(--navy)' }}>
              <div className="relative z-10 p-5 h-full flex flex-col">
                <h2 className="text-white italic mb-1" style={{ ...playfairItalic('20px','white') }}>🗺️ Curriculum Map</h2>
                <p className="text-xs font-semibold mb-4" style={{ color:'rgba(200,218,255,.72)' }}>Where this lesson sits in your learning journey.</p>
                <div className="space-y-2 mb-4">
                  {[
                    { label:'Language & Communication', depth:0, active:false, color:'#4A7AC8' },
                    { label:'Phonics',                  depth:1, active:true,  color:'#B5272C' },
                    { label:'Long & Short Vowel Sounds', depth:2, active:false, color:'#3D8AAA' },
                  ].map((item,i) => (
                    <div key={item.label} className="flex items-center gap-2.5" style={{ paddingLeft:`${item.depth*16}px` }}>
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs"
                        style={{ backgroundColor: item.active ? 'var(--gold)' : 'rgba(255,255,255,.18)',
                          color: item.active ? 'var(--navy-dark)' : 'rgba(255,255,255,.8)',
                          fontFamily:"'Nunito', sans-serif", fontWeight:900 }}>{i+1}</div>
                      <div className="flex-1 rounded-xl px-3 py-1.5 text-sm font-semibold"
                        style={{ backgroundColor: item.active ? 'var(--parchment)' : 'rgba(255,255,255,.08)',
                          color: item.active ? item.color : 'rgba(255,255,255,.85)',
                          border: item.active ? `2px dashed ${item.color}` : '1.5px dashed rgba(255,255,255,.2)',
                          fontFamily: item.active ? "'Playfair Display', serif" : "'Nunito', sans-serif",
                          fontStyle: item.active ? 'italic' : undefined, fontWeight: item.active ? 700 : 600 }}>
                        {item.active && '📍 '}{item.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2" style={{ ...nunito('9px','rgba(255,255,255,.5)'), letterSpacing:'0.1em', textTransform:'uppercase' }}>
                    <span style={{ color:'var(--sage)' }}>🌿</span> Also in Phonics
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {['Blending','Rhyming','Sight Words','Letter Sounds','Word Families'].map(t => (
                      <button key={t} className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-white transition-all hover:-translate-y-0.5"
                        style={{ backgroundColor:'rgba(255,255,255,.11)', border:'1.5px dashed rgba(255,255,255,.28)' }}>{t}</button>
                    ))}
                  </div>
                  <button className="w-full rounded-2xl py-2 px-4 text-sm font-bold transition-all hover:brightness-110"
                    style={{ backgroundColor:'rgba(255,255,255,.1)', border:'1.5px dashed rgba(255,255,255,.3)', color:'rgba(255,255,255,.88)' }}>
                    Browse all Grade 1 topics →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Also in this Topic */}
      <section className="px-5 pb-10">
        <div className="max-w-screen-xl mx-auto">
          <div className="warm-panel p-5">
            <h2 className="mb-4" style={{ ...lilita('20px','var(--navy)') }}>📚 Also in this Topic</h2>
            <div className="grid gap-3" style={{ gridTemplateColumns:'repeat(auto-fit, minmax(140px,1fr))' }}>
              {[
                { icon:'🎵', label:'Songs & Videos',  count:8,  sage:false },
                { icon:'📄', label:'Printable Cards',  count:12, sage:false },
                { icon:'🎲', label:'Games',            count:5,  sage:false },
                { icon:'📊', label:'Assessments',      count:4,  sage:false },
                { icon:'🌿', label:'Home Activities',  count:6,  sage:true  },
              ].map(item => (
                <button key={item.label} className="rounded-2xl p-3 text-left transition-all hover:-translate-y-0.5"
                  style={{ backgroundColor: item.sage ? 'var(--sage-tint)' : 'rgba(0,0,0,.04)',
                    border: item.sage ? '1.5px dashed var(--sage-border)' : '1.5px dashed var(--parch-dark)' }}>
                  <div className="text-2xl mb-1.5">{item.icon}</div>
                  <div style={{ ...nunito('13px', item.sage ? 'var(--sage-mid)' : 'var(--navy)') }}>{item.label}</div>
                  <div className="text-xs font-semibold mt-0.5" style={{ color:'var(--text-mid)' }}>{item.count} resources</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// ── CAST PAGE (de-emphasised, accessible via footer/secondary nav) ─────────────

function CastPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
      <h1 style={{ ...boogaloo('clamp(28px,4vw,42px)','var(--navy)'), marginBottom:'6px' }}>Cast &amp; Character Guide</h1>
      <p style={{ ...caveat('18px','var(--text-mid)'), marginBottom:'28px' }}>
        How the characters are used — the rules that keep every lesson consistent.
      </p>

      {/* Staff grid */}
      <section className="mb-10">
        <h2 style={{ ...lilita('22px','var(--navy)'), marginBottom:'16px' }}>👩‍🏫 The 8 Staff</h2>
        <div className="grid gap-3" style={{ gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))' }}>
          {STAFF.map(s => (
            <div key={s.name} className={s.name === 'Miss Maisy' ? 'sage-card p-4' : 'parchment-card p-4'}>
              <div className="flex items-center gap-3 mb-2 pb-2" style={{ borderBottom:`2px solid ${s.color}25` }}>
                <StaffAvatar src={s.avatar} name={s.name} size={48} />
                <div>
                  <div style={{ ...nunito('15px','var(--text-dark)', 900) }}>{s.name}</div>
                  <div style={{ ...nunito('11px', s.color, 700), textTransform:'uppercase', letterSpacing:'0.06em' }}>{s.role}</div>
                </div>
                <GoldChip>{s.grade}</GoldChip>
              </div>
              <ul className="space-y-1">
                {s.leads.map(l => (
                  <li key={l} className="flex gap-1.5 text-xs font-semibold" style={{ color:'var(--text-ink)' }}>
                    <span style={{ color:'var(--text-soft)' }}>›</span>{l}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Students grid */}
      <section className="mb-10">
        <div className="felt-navy rounded-3xl px-5 py-6">
          <h2 style={{ ...lilita('22px','var(--gold-light)'), marginBottom:'6px' }}>🐾 The 8 Students</h2>
          <p style={{ ...nunito('13px','rgba(255,255,255,.8)', 600), marginBottom:'16px' }}>Each student appears once across the four music units — the cast rotates rather than repeating.</p>
          <div className="grid gap-3" style={{ gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))' }}>
            {STUDENTS.map(s => (
              <div key={s.name} className="parchment-card overflow-hidden">
                <div className="h-1.5 w-full" style={{ backgroundColor: s.color }} />
                <div className="px-3 py-2.5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{s.emoji}</span>
                    <div style={{ ...nunito('14px','var(--text-dark)',900) }}>{s.name}</div>
                    <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: s.color, ...nunito('9px','white') }}>Unit {s.unit}</span>
                  </div>
                  <p className="text-xs font-semibold" style={{ color:'var(--text-ink)' }}>{s.personality}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Production rules */}
      <section>
        <h2 style={{ ...lilita('22px','var(--navy)'), marginBottom:'16px' }}>📋 Production Rules</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {[
            { label:'Staff Only Do What They Teach', body:'Match the staff role to the subject. Do not mix assignments.',                                              col:'var(--navy)',     sage:false },
            { label:'Honorifics Rule',               body:'Mr / Miss always distinguish adults from students with overlapping names.',                                col:'var(--gold-dark)', sage:false },
            { label:'Scenes Need the Right Cast',    body:'Add only students and props needed for that moment. Match visible actions to the learning moment.',         col:'var(--amber)',     sage:false },
            { label:'Worksheet Validity',            body:'Daycare and Preschool are pre-literate — no child-facing worksheet. Only Kinder and Grade 1/2 get one.',   col:'var(--sage-mid)', sage:true  },
            { label:'⚠️ Corrections Needed',         body:'Two daycare posters wrongly show Miss Hayley leading music. Fix: Daycare = Miss Puddles. Music = Mr Rusty.', col:'var(--barn-red)', sage:false },
          ].map(r => (
            <div key={r.label} className={r.sage ? 'sage-card p-4' : 'parchment-card p-4'}>
              <div className="uppercase tracking-widest mb-2" style={{ ...nunito('10px', r.col), letterSpacing:'0.09em' }}>{r.label}</div>
              <p className="text-sm font-semibold leading-snug" style={{ color:'var(--text-ink)' }}>{r.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>('home')

  return (
    <div className="min-h-screen" style={{ fontFamily:"'Nunito', sans-serif" }}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 px-4 py-2.5" style={{ backgroundColor:'var(--navy-dark)', borderBottom:'4px solid var(--gold)', boxShadow:'0 4px 20px rgba(0,0,0,.35)' }}>
        <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4 flex-wrap">

          {/* Logo + brand */}
          <button onClick={() => setPage('home')} className="flex items-center gap-3 flex-shrink-0">
            <img src={logoDark} alt="Old MacDonald Had a School" className="w-11 h-11 object-contain drop-shadow" />
            <div>
              <div className="italic font-bold leading-tight" style={{ fontFamily:"'Playfair Display', serif", color:'var(--parchment)', fontSize:'17px' }}>
                Old MacDonald Had a School
              </div>
              <div style={{ ...nunito('10px','var(--gold)'), textTransform:'uppercase', letterSpacing:'0.1em' }}>
                Teacher lesson resources
              </div>
            </div>
          </button>

          {/* Main grade nav */}
          <nav className="flex items-center gap-1.5 flex-wrap">
            <button onClick={() => setPage('home')}
              className="px-3 py-1.5 rounded-xl transition-all"
              style={{ ...boogaloo('14px', page === 'home' ? 'var(--gold)' : 'rgba(245,236,213,.65)'),
                backgroundColor: page === 'home' ? 'rgba(192,148,30,.15)' : 'transparent',
                border: page === 'home' ? '1.5px solid rgba(192,148,30,.4)' : '1.5px solid transparent' }}>
              Home
            </button>
            {GRADE_CONFIG.map(g => (
              <button key={g.id} onClick={() => setPage(g.id as Page)}
                className="px-3 py-1.5 rounded-xl transition-all"
                style={{ ...boogaloo('14px', page === g.id ? 'white' : 'rgba(245,236,213,.65)'),
                  backgroundColor: page === g.id ? g.color : 'transparent',
                  border: page === g.id ? `1.5px solid ${g.color}` : '1.5px solid transparent' }}>
                {g.label}
              </button>
            ))}

            {/* Separator */}
            <div className="w-px h-5 mx-1" style={{ backgroundColor:'rgba(255,255,255,.15)' }} />

            {/* De-emphasised Cast & Roles link */}
            <button onClick={() => setPage('cast')}
              className="px-2 py-1 rounded-lg text-xs transition-all hover:text-white"
              style={{ color: page === 'cast' ? 'var(--gold-light)' : 'rgba(245,236,213,.4)',
                textDecoration: page === 'cast' ? 'underline' : 'none', fontFamily:"'Nunito', sans-serif", fontWeight:600 }}>
              About
            </button>
          </nav>
        </div>
      </header>

      {/* ── Page content ── */}
      {page === 'home'                          && <HomePage setPage={setPage} />}
      {(page === 'daycare' || page === 'preschool' || page === 'grade1' || page === 'grade2') && <GradePage grade={page} setPage={setPage} />}
      {page === 'lesson'                        && <LessonPage />}
      {page === 'daycare-lesson'                && <DaycareLessonPage setPage={setPage} />}
      {page === 'cast'                          && <CastPage />}

      {/* ── Footer ── */}
      <footer className="px-4 py-5 mt-4" style={{ backgroundColor:'var(--navy-dark)', borderTop:'4px solid var(--gold)' }}>
        <div className="max-w-screen-xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <img src={logoDark} alt="logo" className="w-8 h-8 object-contain opacity-80" />
            <div>
              <div className="italic font-bold" style={{ fontFamily:"'Playfair Display', serif", color:'var(--parchment)', fontSize:'14px' }}>Old MacDonald Had a School</div>
              <div style={{ ...nunito('9px','var(--gold)'), textTransform:'uppercase', letterSpacing:'0.12em' }}>by Jesse Neiman</div>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            {GRADE_CONFIG.map(g => (
              <button key={g.id} onClick={() => setPage(g.id as Page)}
                className="text-xs font-bold hover:text-white transition-colors"
                style={{ color:'rgba(240,230,200,.5)', ...nunito('11px','rgba(240,230,200,.5)') }}>{g.label}</button>
            ))}
            <span style={{ color:'rgba(255,255,255,.2)' }}>·</span>
            <button onClick={() => setPage('cast')} className="text-xs hover:text-white transition-colors"
              style={{ color:'rgba(240,230,200,.35)', fontFamily:"'Nunito', sans-serif", fontWeight:600 }}>Cast Guide</button>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ color:'var(--sage)', fontSize:'14px' }}>🌿</span>
            <p className="italic font-bold" style={{ fontFamily:"'Playfair Display', serif", color:'var(--gold-light)', fontSize:'13px' }}>Rooted in play. Growing confident learners.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
