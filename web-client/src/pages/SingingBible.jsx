import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Music, ExternalLink, Mic, Mic2, BookOpen,
  Search, Play, ChevronDown, RefreshCw, Radio, X
} from "lucide-react";
import AnimateOnScroll from "../components/AnimateOnScroll";

const BOOKS = [
  { slug:"01-genesis",name:"Genesis",chapters:50,testament:"OT" },
  { slug:"02-exodus",name:"Exodus",chapters:40,testament:"OT" },
  { slug:"03-leviticus",name:"Leviticus",chapters:27,testament:"OT" },
  { slug:"04-numbers",name:"Numbers",chapters:36,testament:"OT" },
  { slug:"05-deuteronomy",name:"Deuteronomy",chapters:34,testament:"OT" },
  { slug:"06-joshua",name:"Joshua",chapters:24,testament:"OT" },
  { slug:"07-judges",name:"Judges",chapters:21,testament:"OT" },
  { slug:"08-ruth",name:"Ruth",chapters:4,testament:"OT" },
  { slug:"09-1-samuel",name:"1 Samuel",chapters:31,testament:"OT" },
  { slug:"10-2-samuel",name:"2 Samuel",chapters:24,testament:"OT" },
  { slug:"11-1-kings",name:"1 Kings",chapters:22,testament:"OT" },
  { slug:"12-2-kings",name:"2 Kings",chapters:25,testament:"OT" },
  { slug:"13-1-chronicles",name:"1 Chronicles",chapters:29,testament:"OT" },
  { slug:"14-2-chronicles",name:"2 Chronicles",chapters:36,testament:"OT" },
  { slug:"15-ezra",name:"Ezra",chapters:10,testament:"OT" },
  { slug:"16-nehemiah",name:"Nehemiah",chapters:13,testament:"OT" },
  { slug:"17-esther",name:"Esther",chapters:10,testament:"OT" },
  { slug:"18-job",name:"Job",chapters:42,testament:"OT" },
  { slug:"19-psalms",name:"Psalms",chapters:150,testament:"OT" },
  { slug:"20-proverbs",name:"Proverbs",chapters:31,testament:"OT" },
  { slug:"21-ecclesiastes",name:"Ecclesiastes",chapters:12,testament:"OT" },
  { slug:"22-song-of-solomon",name:"Song of Solomon",chapters:8,testament:"OT" },
  { slug:"23-isaiah",name:"Isaiah",chapters:66,testament:"OT" },
  { slug:"24-jeremiah",name:"Jeremiah",chapters:52,testament:"OT" },
  { slug:"25-lamentations",name:"Lamentations",chapters:5,testament:"OT" },
  { slug:"26-ezekiel",name:"Ezekiel",chapters:48,testament:"OT" },
  { slug:"27-daniel",name:"Daniel",chapters:12,testament:"OT" },
  { slug:"28-hosea",name:"Hosea",chapters:14,testament:"OT" },
  { slug:"29-joel",name:"Joel",chapters:3,testament:"OT" },
  { slug:"30-amos",name:"Amos",chapters:9,testament:"OT" },
  { slug:"31-obadiah",name:"Obadiah",chapters:1,testament:"OT" },
  { slug:"32-jonah",name:"Jonah",chapters:4,testament:"OT" },
  { slug:"33-micah",name:"Micah",chapters:7,testament:"OT" },
  { slug:"34-nahum",name:"Nahum",chapters:3,testament:"OT" },
  { slug:"35-habakkuk",name:"Habakkuk",chapters:3,testament:"OT" },
  { slug:"36-zephaniah",name:"Zephaniah",chapters:3,testament:"OT" },
  { slug:"37-haggai",name:"Haggai",chapters:2,testament:"OT" },
  { slug:"38-zechariah",name:"Zechariah",chapters:14,testament:"OT" },
  { slug:"39-malachi",name:"Malachi",chapters:4,testament:"OT" },
  { slug:"40-matthew",name:"Matthew",chapters:28,testament:"NT" },
  { slug:"41-mark",name:"Mark",chapters:16,testament:"NT" },
  { slug:"42-luke",name:"Luke",chapters:24,testament:"NT" },
  { slug:"43-john",name:"John",chapters:21,testament:"NT" },
  { slug:"44-acts",name:"Acts",chapters:28,testament:"NT" },
  { slug:"45-romans",name:"Romans",chapters:16,testament:"NT" },
  { slug:"46-1-corinthians",name:"1 Corinthians",chapters:16,testament:"NT" },
  { slug:"47-2-corinthians",name:"2 Corinthians",chapters:13,testament:"NT" },
  { slug:"48-galatians",name:"Galatians",chapters:6,testament:"NT" },
  { slug:"49-ephesians",name:"Ephesians",chapters:6,testament:"NT" },
  { slug:"50-philippians",name:"Philippians",chapters:4,testament:"NT" },
  { slug:"51-colossians",name:"Colossians",chapters:4,testament:"NT" },
  { slug:"52-1-thessalonians",name:"1 Thessalonians",chapters:5,testament:"NT" },
  { slug:"53-2-thessalonians",name:"2 Thessalonians",chapters:3,testament:"NT" },
  { slug:"54-1-timothy",name:"1 Timothy",chapters:6,testament:"NT" },
  { slug:"55-2-timothy",name:"2 Timothy",chapters:4,testament:"NT" },
  { slug:"56-titus",name:"Titus",chapters:3,testament:"NT" },
  { slug:"57-philemon",name:"Philemon",chapters:1,testament:"NT" },
  { slug:"58-hebrews",name:"Hebrews",chapters:13,testament:"NT" },
  { slug:"59-james",name:"James",chapters:5,testament:"NT" },
  { slug:"60-1-peter",name:"1 Peter",chapters:5,testament:"NT" },
  { slug:"61-2-peter",name:"2 Peter",chapters:3,testament:"NT" },
  { slug:"62-1-john",name:"1 John",chapters:5,testament:"NT" },
  { slug:"63-2-john",name:"2 John",chapters:1,testament:"NT" },
  { slug:"64-3-john",name:"3 John",chapters:1,testament:"NT" },
  { slug:"65-jude",name:"Jude",chapters:1,testament:"NT" },
  { slug:"66-revelation",name:"Revelation",chapters:22,testament:"NT" },
];

const STYLES = [
  { slug:"adult-choir",label:"Adult Choir",emoji:"🎶" },
  { slug:"african-dance",label:"African Dance",emoji:"🥁" },
  { slug:"barbershop-quartet",label:"Barbershop",emoji:"🎩" },
  { slug:"calming-lullaby",label:"Lullaby",emoji:"🌙" },
  { slug:"childrens-choir",label:"Children Choir",emoji:"👦" },
  { slug:"choir-of-angels",label:"Choir of Angels",emoji:"😇" },
  { slug:"contemporary-pop",label:"Contemporary Pop",emoji:"🎤" },
  { slug:"country",label:"Country",emoji:"🤠" },
  { slug:"gregorian-chant",label:"Gregorian Chant",emoji:"⛪" },
  { slug:"hip-hop",label:"Hip Hop",emoji:"🎧" },
  { slug:"jazz",label:"Jazz",emoji:"🎷" },
  { slug:"latin",label:"Latin",emoji:"💃" },
  { slug:"middle-eastern",label:"Middle Eastern",emoji:"🌙" },
  { slug:"orchestral",label:"Orchestral",emoji:"🎻" },
  { slug:"reggae",label:"Reggae",emoji:"🌴" },
  { slug:"soul-r-and-b",label:"Soul / R&B",emoji:"❤️" },
];

const QUICK_PICKS = [
  { name:"Psalm 23",slug:"19-psalms",ch:23 },
  { name:"Psalm 91",slug:"19-psalms",ch:91 },
  { name:"John 3",slug:"43-john",ch:3 },
  { name:"Isaiah 53",slug:"23-isaiah",ch:53 },
  { name:"Genesis 1",slug:"01-genesis",ch:1 },
  { name:"Rev 22",slug:"66-revelation",ch:22 },
];

const singingUrl = (vo,st,bk,ch) =>
  `https://thesinging.bible/#sbe/${vo}/adult/${st}/${bk}/${ch}`;

async function fetchVerses(bookName, chapter) {
  const q = encodeURIComponent(`${bookName} ${chapter}`);
  const r = await fetch(`https://bible-api.com/${q}?translation=kjv`);
  if (!r.ok) throw new Error("API error");
  const d = await r.json();
  return d.verses || [];
}

/* Animated sound bars shown while playing */
function SoundBars() {
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:"3px", height:"24px" }}>
      {[1,2,3,4,5].map(i=>(
        <div key={i} style={{
          width:"4px", background:"var(--accent-gold)", borderRadius:"2px",
          animation:`sbBar${i} 0.8s ease-in-out ${i*0.1}s infinite alternate`,
        }}/>
      ))}
      <style>{`
        @keyframes sbBar1{from{height:4px}to{height:20px}}
        @keyframes sbBar2{from{height:8px}to{height:16px}}
        @keyframes sbBar3{from{height:12px}to{height:24px}}
        @keyframes sbBar4{from{height:6px}to{height:18px}}
        @keyframes sbBar5{from{height:4px}to{height:14px}}
      `}</style>
    </div>
  );
}

export default function SingingBible() {
  const [voice,setVoice] = useState("male");
  const [style,setStyle] = useState("adult-choir");
  const [bookSlug,setBookSlug] = useState("19-psalms");
  const [chapter,setChapter] = useState(23);
  const [testament,setTestament] = useState("All");
  const [bookSearch,setBookSearch] = useState("");
  const [playing,setPlaying] = useState(false);
  const [verses,setVerses] = useState([]);
  const [loading,setLoading] = useState(false);
  const [verseErr,setVerseErr] = useState("");
  const [activeVerse,setActiveVerse] = useState(0);
  const popupRef = useRef(null);

  const currentBook = BOOKS.find(b=>b.slug===bookSlug)||BOOKS[18];
  const currentStyle = STYLES.find(s=>s.slug===style)||STYLES[0];

  useEffect(()=>{ setChapter(1); },[bookSlug]);

  // Auto-advance verse highlight every 8s
  useEffect(()=>{
    if(!playing||verses.length===0) return;
    const t = setInterval(()=>{
      setActiveVerse(v=>{
        const next = v+1;
        if(next>=verses.length) return v;
        document.getElementById(`sv-${next}`)
          ?.scrollIntoView({behavior:"smooth",block:"center"});
        return next;
      });
    },8000);
    return ()=>clearInterval(t);
  },[playing,verses]);

  // Detect popup closed
  useEffect(()=>{
    if(!playing) return;
    const t = setInterval(()=>{
      if(popupRef.current && popupRef.current.closed){
        setPlaying(false);
        popupRef.current = null;
      }
    },1000);
    return ()=>clearInterval(t);
  },[playing]);

  const filteredBooks = useMemo(()=>
    BOOKS.filter(b=>{
      const tOk = testament==="All"||b.testament===testament;
      const sOk = !bookSearch||b.name.toLowerCase().includes(bookSearch.toLowerCase());
      return tOk&&sOk;
    }),[testament,bookSearch]);

  function openPlayer(bSlug, bCh) {
    const url = singingUrl(voice, style, bSlug, bCh);
    // Position popup on the right side of the screen, compact
    const pw = 780, ph = 620;
    const left = Math.max(0, window.screen.width - pw - 20);
    const top  = 60;
    if(popupRef.current && !popupRef.current.closed){
      popupRef.current.location.href = url;
      popupRef.current.focus();
    } else {
      popupRef.current = window.open(url,"singing_bible_player",
        `width=${pw},height=${ph},left=${left},top=${top},scrollbars=yes,resizable=yes`);
    }
  }

  async function play(slug, ch) {
    const bSlug = slug||bookSlug;
    const bCh   = ch||chapter;
    const book  = BOOKS.find(b=>b.slug===bSlug)||currentBook;
    if(slug){ setBookSlug(slug); setChapter(ch); }

    openPlayer(bSlug, bCh);
    setPlaying(true);
    setActiveVerse(0);
    setVerses([]);
    setVerseErr("");
    setLoading(true);
    try {
      const v = await fetchVerses(book.name, bCh);
      setVerses(v);
    } catch {
      setVerseErr("Could not load verses. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  }

  function stopPlayer(){
    if(popupRef.current && !popupRef.current.closed) popupRef.current.close();
    popupRef.current = null;
    setPlaying(false);
    setVerses([]);
  }

  const chNums = Array.from({length:currentBook.chapters},(_,i)=>i+1);

  const LBL = { fontSize:"11px",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--text-secondary)",display:"block",marginBottom:"8px" };
  const SEL = { width:"100%",padding:"10px 36px 10px 14px",background:"var(--input-bg)",border:"1.5px solid var(--border-color)",borderRadius:"10px",fontSize:"14px",fontWeight:"600",color:"var(--text-primary)",cursor:"pointer",appearance:"none",WebkitAppearance:"none",outline:"none",fontFamily:"var(--font-sans)" };

  return (
    <div style={{minHeight:"100vh",background:"var(--bg-primary)"}}>

      {/* Hero */}
      <div style={{background:"linear-gradient(135deg,var(--bg-secondary),var(--bg-tertiary))",borderBottom:"1px solid var(--border-color)",padding:"36px 24px 32px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        {["♩","♪","♫","♬","♩","♪","♫","♬"].map((n,i)=>(
          <span key={i} aria-hidden style={{position:"absolute",top:`${10+(i*11)%70}%`,left:`${(i*13)%95}%`,fontSize:`${20+(i%3)*10}px`,opacity:0.06,pointerEvents:"none",userSelect:"none"}}>{n}</span>
        ))}
        <div style={{position:"relative",maxWidth:"620px",margin:"0 auto"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:"8px",background:"rgba(184,134,11,0.1)",border:"1px solid rgba(184,134,11,0.25)",borderRadius:"30px",padding:"5px 16px",marginBottom:"16px"}}>
            <Music size={13} style={{color:"var(--accent-gold)"}}/><span style={{fontSize:"11px",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--accent-gold)"}}>Powered by TheSinging.Bible</span>
          </div>
          <h1 style={{fontFamily:"var(--font-display)",fontSize:"clamp(26px,5vw,46px)",fontWeight:"800",margin:"0 0 12px",color:"var(--text-primary)",lineHeight:1.15}}>🎵 The Singing Bible</h1>
          <p style={{fontSize:"15px",color:"var(--text-secondary)",lineHeight:1.7,margin:"0 auto 20px",maxWidth:"500px"}}>
            Choose a book, chapter, voice &amp; style — press <strong>Play</strong> to launch the music player while the <strong>full Bible verses appear here</strong>.
          </p>
          <div style={{display:"flex",justifyContent:"center",gap:"28px",flexWrap:"wrap"}}>
            {[["66","Books"],["1,189","Chapters"],["16+","Styles"],["2","Voices"]].map(([n,l],i)=>(
              <div key={i} style={{textAlign:"center"}}>
                <div style={{fontSize:"20px",fontWeight:"800",color:"var(--accent-gold)"}}>{n}</div>
                <div style={{fontSize:"11px",color:"var(--text-secondary)",fontWeight:"600",textTransform:"uppercase"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div style={{maxWidth:"1200px",margin:"0 auto",padding:"28px 20px 60px",display:"grid",gridTemplateColumns:"minmax(280px,320px) 1fr",gap:"24px",alignItems:"start"}} className="singing-layout">

        {/* LEFT Controls */}
        <AnimateOnScroll animation="fadeUp">
          <div style={{background:"var(--glass-bg)",border:"1px solid var(--border-color)",borderRadius:"18px",overflow:"hidden",boxShadow:"var(--card-shadow)",position:"sticky",top:"90px"}}>
            <div style={{background:"linear-gradient(135deg,var(--accent-gold-light),transparent)",borderBottom:"1px solid var(--border-color)",padding:"16px 20px",display:"flex",alignItems:"center",gap:"10px"}}>
              <div style={{width:"36px",height:"36px",borderRadius:"10px",background:"var(--accent-gold)",display:"flex",alignItems:"center",justifyContent:"center"}}><Music size={18} color="#fff"/></div>
              <div><div style={{fontWeight:"800",fontSize:"15px",color:"var(--text-primary)"}}>Select Passage</div><div style={{fontSize:"12px",color:"var(--text-secondary)"}}>Book · Chapter · Voice · Style</div></div>
            </div>
            <div style={{padding:"18px",display:"flex",flexDirection:"column",gap:"16px"}}>

              {/* Voice */}
              <div>
                <label style={LBL}>🎤 Voice</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
                  {[["male","Male",<Mic size={14}/>],["female","Female",<Mic2 size={14}/>]].map(([v,l,I])=>(
                    <button key={v} onClick={()=>setVoice(v)} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",padding:"10px",fontWeight:"700",fontSize:"13px",cursor:"pointer",fontFamily:"var(--font-sans)",borderRadius:"10px",background:voice===v?"var(--accent-gold)":"var(--bg-tertiary)",color:voice===v?"#fff":"var(--text-secondary)",border:`1.5px solid ${voice===v?"var(--accent-gold)":"var(--border-color)"}`}}>{I} {l}</button>
                  ))}
                </div>
              </div>

              {/* Book */}
              <div>
                <label style={LBL}>📖 Bible Book</label>
                <div style={{display:"flex",gap:"5px",marginBottom:"8px",flexWrap:"wrap"}}>
                  {["All","OT","NT"].map(t=>(
                    <button key={t} onClick={()=>setTestament(t)} style={{padding:"3px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:"700",cursor:"pointer",border:"1px solid",fontFamily:"var(--font-sans)",borderColor:testament===t?"var(--accent-gold)":"var(--border-color)",background:testament===t?"var(--accent-gold-light)":"transparent",color:testament===t?"var(--accent-gold)":"var(--text-secondary)"}}>
                      {t==="OT"?"Old Test.":t==="NT"?"New Test.":"All"}
                    </button>
                  ))}
                </div>
                <div style={{position:"relative",marginBottom:"8px"}}>
                  <Search size={13} style={{position:"absolute",left:"10px",top:"50%",transform:"translateY(-50%)",color:"var(--text-secondary)"}}/>
                  <input type="text" placeholder="Find a book…" value={bookSearch} onChange={e=>setBookSearch(e.target.value)} style={{...SEL,padding:"8px 12px 8px 30px"}}/>
                </div>
                <div style={{maxHeight:"175px",overflowY:"auto",background:"var(--input-bg)",border:"1.5px solid var(--border-color)",borderRadius:"10px"}}>
                  {filteredBooks.map(b=>(
                    <button key={b.slug} onClick={()=>setBookSlug(b.slug)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",padding:"8px 14px",border:"none",borderBottom:"1px solid var(--border-color)",cursor:"pointer",fontSize:"13px",fontFamily:"var(--font-sans)",background:bookSlug===b.slug?"var(--accent-gold-light)":"transparent",color:bookSlug===b.slug?"var(--accent-gold)":"var(--text-primary)",fontWeight:bookSlug===b.slug?"700":"500"}}>
                      <span>{b.name}</span>
                      <span style={{fontSize:"10px",color:"var(--text-secondary)",background:"var(--bg-tertiary)",padding:"1px 7px",borderRadius:"10px"}}>{b.chapters}ch</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chapter */}
              <div>
                <label style={LBL}><BookOpen size={12} style={{display:"inline",verticalAlign:"middle",marginRight:"4px"}}/>Chapter</label>
                <div style={{position:"relative"}}>
                  <select value={chapter} onChange={e=>setChapter(Number(e.target.value))} style={SEL}>
                    {chNums.map(n=><option key={n} value={n}>Chapter {n}</option>)}
                  </select>
                  <ChevronDown size={14} style={{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",pointerEvents:"none",color:"var(--text-secondary)"}}/>
                </div>
              </div>

              {/* Style */}
              <div>
                <label style={LBL}>🎼 Music Style</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"5px",maxHeight:"185px",overflowY:"auto"}}>
                  {STYLES.map(s=>(
                    <button key={s.slug} onClick={()=>setStyle(s.slug)} style={{display:"flex",alignItems:"center",gap:"5px",padding:"7px 9px",borderRadius:"8px",fontSize:"11px",fontWeight:"700",cursor:"pointer",fontFamily:"var(--font-sans)",background:style===s.slug?"var(--accent-gold-light)":"var(--bg-tertiary)",color:style===s.slug?"var(--accent-gold)":"var(--text-secondary)",border:`1.5px solid ${style===s.slug?"var(--accent-gold)":"var(--border-color)"}`}}>
                      <span>{s.emoji}</span><span style={{overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Play / Stop */}
              <button onClick={playing ? ()=>play() : ()=>play()} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",width:"100%",padding:"14px",background:"var(--accent-gold)",color:"#fff",border:"none",borderRadius:"12px",fontWeight:"800",fontSize:"15px",cursor:"pointer",fontFamily:"var(--font-sans)",transition:"all 0.2s",boxShadow:"0 4px 20px rgba(184,134,11,0.35)"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(184,134,11,0.5)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 4px 20px rgba(184,134,11,0.35)";}}>
                <Play size={18} fill="#fff"/>
                {playing ? "Change & Replay" : `Play — ${currentBook.name} ${chapter}`}
              </button>

              {playing && (
                <button onClick={stopPlayer} style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",width:"100%",padding:"10px",background:"transparent",color:"var(--text-secondary)",border:"1px solid var(--border-color)",borderRadius:"10px",fontWeight:"700",fontSize:"13px",cursor:"pointer",fontFamily:"var(--font-sans)"}}>
                  <X size={14}/> Stop Player
                </button>
              )}

              <div style={{background:"var(--bg-tertiary)",borderRadius:"10px",padding:"11px 14px",border:"1px solid var(--border-color)"}}>
                <div style={{fontSize:"10px",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.07em",color:"var(--text-secondary)",marginBottom:"5px"}}>Current Selection</div>
                <div style={{fontSize:"13px",fontWeight:"700",color:"var(--text-primary)",lineHeight:1.7}}>
                  📖 {currentBook.name} · Ch. {chapter}<br/>
                  🎤 {voice==="male"?"Male":"Female"} · {currentStyle.emoji} {currentStyle.label}
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* RIGHT: Now Playing + Verses */}
        <AnimateOnScroll animation="fadeUp" delay={120}>
          <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>

            {/* Status */}
            <div style={{background:"var(--glass-bg)",border:"1px solid var(--border-color)",borderRadius:"14px",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                {playing && <SoundBars/>}
                <div>
                  <div style={{fontSize:"11px",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.07em",color:"var(--accent-gold)",marginBottom:"3px"}}>{playing?"▶ Now Playing":"⏸ Ready to Play"}</div>
                  <div style={{fontWeight:"800",fontSize:"18px",color:"var(--text-primary)"}}>{currentBook.name} · Chapter {chapter}</div>
                  <div style={{fontSize:"12px",color:"var(--text-secondary)",marginTop:"2px"}}>{voice==="male"?"🎤 Male":"🎤 Female"} · {currentStyle.emoji} {currentStyle.label} · KJV</div>
                </div>
              </div>
              {playing && (
                <div style={{display:"flex",gap:"8px"}}>
                  <button onClick={()=>play()} style={{display:"flex",alignItems:"center",gap:"6px",padding:"8px 14px",background:"var(--accent-gold)",color:"#fff",border:"none",borderRadius:"8px",fontSize:"12px",fontWeight:"700",cursor:"pointer",fontFamily:"var(--font-sans)"}}><RefreshCw size={13}/> Reload</button>
                  <button onClick={()=>window.open(singingUrl(voice,style,bookSlug,chapter),"_blank","noopener")} style={{display:"flex",alignItems:"center",gap:"6px",padding:"8px 14px",background:"var(--bg-tertiary)",color:"var(--text-secondary)",border:"1px solid var(--border-color)",borderRadius:"8px",fontSize:"12px",fontWeight:"700",cursor:"pointer",fontFamily:"var(--font-sans)"}}><ExternalLink size={13}/> Full Screen</button>
                </div>
              )}
            </div>

            {/* Player notice when playing */}
            {playing && (
              <div style={{background:"linear-gradient(135deg,rgba(184,134,11,0.12),rgba(184,134,11,0.04))",border:"1px solid rgba(184,134,11,0.35)",borderRadius:"14px",padding:"18px 22px",display:"flex",alignItems:"center",gap:"16px"}}>
                <div style={{width:"48px",height:"48px",borderRadius:"12px",background:"var(--accent-gold)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Radio size={24} color="#fff"/>
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:"800",fontSize:"15px",color:"var(--text-primary)",marginBottom:"3px"}}>Music Player is Live 🎵</div>
                  <div style={{fontSize:"13px",color:"var(--text-secondary)",lineHeight:1.5}}>
                    TheSinging.Bible is playing in a side window on your screen. Read the verses below while the music plays.
                  </div>
                </div>
                <button onClick={()=>{ if(popupRef.current&&!popupRef.current.closed) popupRef.current.focus(); }} style={{padding:"8px 16px",background:"var(--accent-gold)",color:"#fff",border:"none",borderRadius:"8px",fontWeight:"700",fontSize:"12px",cursor:"pointer",fontFamily:"var(--font-sans)",flexShrink:0}}>
                  Go to Player
                </button>
              </div>
            )}

            {/* Main card: idle or verses */}
            <div style={{background:"var(--glass-bg)",border:"1px solid var(--border-color)",borderRadius:"18px",overflow:"hidden",boxShadow:"var(--card-shadow)"}}>
              {!playing ? (
                /* Idle */
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 32px",textAlign:"center",gap:"24px",minHeight:"500px"}}>
                  <div style={{fontSize:"64px",animation:"sbPulse 2.5s ease-in-out infinite"}}>🎵</div>
                  <div>
                    <h2 style={{fontWeight:"800",fontSize:"24px",color:"var(--text-primary)",margin:"0 0 10px"}}>Sing the Scripture</h2>
                    <p style={{color:"var(--text-secondary)",fontSize:"14px",lineHeight:1.7,maxWidth:"400px",margin:"0 auto"}}>
                      Choose your <strong>book</strong>, <strong>chapter</strong>, <strong>voice</strong> and <strong>style</strong> on the left, then press <strong>Play</strong>. A music player opens while the <strong>Bible verses appear right here</strong>.
                    </p>
                  </div>
                  <button onClick={()=>play()} style={{display:"flex",alignItems:"center",gap:"8px",padding:"16px 40px",background:"var(--accent-gold)",color:"#fff",border:"none",borderRadius:"14px",fontWeight:"800",fontSize:"17px",cursor:"pointer",fontFamily:"var(--font-sans)",animation:"sbPulse 2.5s ease-in-out infinite",boxShadow:"0 6px 24px rgba(184,134,11,0.4)"}}>
                    <Play size={22} fill="#fff"/> Play {currentBook.name} {chapter}
                  </button>
                  <div style={{width:"100%",maxWidth:"440px"}}>
                    <div style={{fontSize:"11px",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.07em",color:"var(--text-secondary)",marginBottom:"10px"}}>Popular Chapters</div>
                    <div style={{display:"flex",gap:"8px",flexWrap:"wrap",justifyContent:"center"}}>
                      {QUICK_PICKS.map(q=>(
                        <button key={q.name} onClick={()=>play(q.slug,q.ch)}
                          style={{padding:"7px 16px",borderRadius:"20px",fontSize:"13px",fontWeight:"700",cursor:"pointer",background:"var(--accent-gold-light)",color:"var(--accent-gold)",border:"1px solid rgba(184,134,11,0.3)",fontFamily:"var(--font-sans)",transition:"all 0.15s"}}
                          onMouseEnter={e=>{e.currentTarget.style.background="var(--accent-gold)";e.currentTarget.style.color="#fff";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="var(--accent-gold-light)";e.currentTarget.style.color="var(--accent-gold)";}}>
                          {q.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Verses while music plays */
                <div>
                  <div style={{background:"linear-gradient(135deg,#1a1409,#3a2d1d)",padding:"20px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px"}}>
                    <div>
                      <div style={{fontSize:"11px",fontWeight:"700",textTransform:"uppercase",letterSpacing:"0.09em",color:"#d4a017",marginBottom:"4px"}}>📖 Bible Verses — Read Along</div>
                      <div style={{fontWeight:"800",fontSize:"20px",color:"#f5ead6"}}>{currentBook.name} · Chapter {chapter}</div>
                      <div style={{fontSize:"11px",color:"rgba(245,234,214,0.5)",marginTop:"2px"}}>King James Version (KJV)</div>
                    </div>
                    {playing && <SoundBars/>}
                  </div>

                  {loading ? (
                    <div style={{padding:"50px",textAlign:"center",color:"var(--text-secondary)",fontSize:"14px"}}>🎵 Loading verses…</div>
                  ) : verseErr ? (
                    <div style={{padding:"40px",textAlign:"center"}}>
                      <div style={{color:"var(--text-secondary)",marginBottom:"12px"}}>{verseErr}</div>
                      <button onClick={()=>play()} style={{padding:"8px 20px",background:"var(--accent-gold)",color:"#fff",border:"none",borderRadius:"8px",fontWeight:"700",cursor:"pointer",fontFamily:"var(--font-sans)"}}>Try Again</button>
                    </div>
                  ) : (
                    <div style={{padding:"20px 28px 48px"}}>
                      {verses.map((v,i)=>(
                        <div key={v.verse} id={`sv-${i}`} onClick={()=>setActiveVerse(i)}
                          style={{display:"flex",gap:"16px",padding:"14px 16px",marginBottom:"6px",borderRadius:"14px",cursor:"pointer",transition:"all 0.35s",background:activeVerse===i?"linear-gradient(135deg,var(--accent-gold-light),rgba(184,134,11,0.05))":"transparent",border:activeVerse===i?"1px solid rgba(184,134,11,0.35)":"1px solid transparent"}}>
                          <span style={{flexShrink:0,width:"30px",height:"30px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:"800",marginTop:"4px",transition:"all 0.3s",background:activeVerse===i?"var(--accent-gold)":"var(--bg-tertiary)",color:activeVerse===i?"#fff":"var(--text-secondary)"}}>
                            {v.verse}
                          </span>
                          <p style={{margin:0,fontSize:"17px",lineHeight:1.9,transition:"all 0.3s",color:activeVerse===i?"var(--text-primary)":"var(--text-secondary)",fontWeight:activeVerse===i?"600":"400"}}>
                            {v.text.trim()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Scripture quote */}
            <div style={{background:"linear-gradient(135deg,var(--accent-gold-light),var(--bg-tertiary))",border:"1px solid rgba(184,134,11,0.2)",borderRadius:"12px",padding:"16px 20px",display:"flex",gap:"12px",alignItems:"flex-start"}}>
              <span style={{fontSize:"20px",flexShrink:0}}>📖</span>
              <div>
                <p style={{margin:"0 0 4px",fontStyle:"italic",fontSize:"14px",color:"var(--text-primary)",lineHeight:1.6}}>"Let the word of Christ dwell in you richly, teaching and admonishing one another in all wisdom, singing psalms and hymns and spiritual songs…"</p>
                <span style={{fontSize:"12px",fontWeight:"700",color:"var(--accent-gold)",textTransform:"uppercase",letterSpacing:"0.05em"}}>Colossians 3:16</span>
              </div>
            </div>

          </div>
        </AnimateOnScroll>
      </div>

      <style>{`
        @keyframes sbPulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.05);} }
        @media(max-width:820px){ .singing-layout{ grid-template-columns:1fr !important; } }
      `}</style>
    </div>
  );
}
