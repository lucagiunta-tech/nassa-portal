import { useState, useEffect, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  ArrowLeft, Plus, Trash2, X, Check, Eye,
  ChevronRight, ChevronLeft, ChevronDown,
  ExternalLink, FileText, LayoutGrid, BarChart2, AlertCircle,
  Activity, Users, Zap, Clock, StickyNote, TrendingUp, Flag
} from "lucide-react";

/* ─── TOKENS ──────────────────────────────────────────────── */
const C = {
  verde:"#1A8C3F", magenta:"#C2185B",
  testo:"#1A1A1A", muted:"#6B6B6B",
  sfondo:"#F5F5F5", border:"#E0E0E0", white:"#FFFFFF",
  arancio:"#E65100", blu:"#1565C0",
};
const FONT = "Arial, sans-serif";

/* ─── CONSTANTS ───────────────────────────────────────────── */
const PACCHETTI = {
  starter:        { label:"🥉 Starter",      prezzo:490,  ore:15  },
  essential:      { label:"🥈 Essential",    prezzo:790,  ore:28  },
  professional:   { label:"🥇 Professional", prezzo:1200, ore:45  },
  premium:        { label:"💎 Premium",      prezzo:1800, ore:70  },
  "full-service": { label:"🚀 Full Service", prezzo:2800, ore:120 },
};

const FASI = [
  { id:"analisi",        emoji:"🔍", label:"Analisi",        moduli:[{id:1,nome:"Mod.1 Intervista"},{id:2,nome:"Mod.2 Document Hub"},{id:3,nome:"Mod.3 Audit & Analisi"}] },
  { id:"strategia",      emoji:"🧭", label:"Strategia",      moduli:[{id:"4a",nome:"Mod.4a Brainstorming Concept"},{id:"4b",nome:"Mod.4b Moodboard Visiva"},{id:5,nome:"Mod.5 Copy Strategy"},{id:6,nome:"Mod.6 Pilastri"},{id:7,nome:"Mod.7 Branding System"},{id:8,nome:"Mod.8 Architettura Digitale"},{id:9,nome:"Mod.9 Linea Narrativa"}] },
  { id:"produzione",     emoji:"✏️", label:"Produzione",     moduli:[{id:10,nome:"Mod.10 Shooting Brief & Shotlist"},{id:11,nome:"Mod.11 Produzione Grafica & Video"}] },
  { id:"pianificazione", emoji:"📅", label:"Pianificazione", moduli:[{id:12,nome:"Mod.12 PED Piano Editoriale"},{id:13,nome:"Mod.13 Streamtime"},{id:14,nome:"Mod.14 Pubblicazione"}] },
  { id:"monitoraggio",   emoji:"📊", label:"Monitoraggio",   moduli:[{id:15,nome:"Mod.15 ADV & Performance"},{id:16,nome:"Mod.16 Report Mensile"},{id:17,nome:"Mod.17 QBR Trimestrale"}] },
];

const STATI_MODULO = { "da-fare":"Da fare", "in-corso":"In corso", "check":"Check", "completo":"Completato" };

const PIATTAFORME = {
  instagram: { label:"Instagram", color:"#E1306C" },
  facebook:  { label:"Facebook",  color:"#1877F2" },
  linkedin:  { label:"LinkedIn",  color:"#0A66C2" },
  tiktok:    { label:"TikTok",    color:"#111111" },
};

const DOC_CAT = {
  brand:     { label:"Brand",     color:"#1A8C3F" },
  strategia: { label:"Strategia", color:"#1565C0" },
  report:    { label:"Report",    color:"#6A1B9A" },
  contratti: { label:"Contratti", color:"#E65100" },
};

// Pipeline cols (top row) — Pubblicato goes to bottom row separately
const PIPELINE_COLS = {
  idea:       { emoji:"💡", label:"Idea",       hbg:"#FFF8E1", htx:"#795548" },
  brief:      { emoji:"📝", label:"Brief",      hbg:"#E3F2FD", htx:"#1565C0" },
  produzione: { emoji:"✏️", label:"Produzione", hbg:"#FFF3E0", htx:"#E65100" },
  semaforo:   { emoji:"🚦", label:"Semaforo",   hbg:"#FFFDE7", htx:"#F57F17" },
};
const PUBBLICATO_COL = { emoji:"✅", label:"Pubblicato", hbg:"#E8F5E9", htx:"#1A8C3F" };

const POST_COLORS = [
  ["#2C3E50","#3498DB"],["#1A8C3F","#27AE60"],["#8E44AD","#9B59B6"],
  ["#C2185B","#E91E63"],["#D35400","#E67E22"],["#1A1A2E","#16213E"],
];

/* ─── MOCK DATA ───────────────────────────────────────────── */
const MOCK_CLIENTE   = { slug:"eich-design", nome:"EICH Design", pacchetto:"professional", settore:"Design & Architettura", referente:"Marco Eich", email:"marco@eichdesign.it", dataInizio:"2026-03-01" };
const MOCK_PROGRESS  = {
  analisi:       { percentuale:100, moduli:{1:"completo",2:"completo",3:"completo"} },
  strategia:     { percentuale:100, moduli:{"4a":"completo","4b":"completo",5:"completo",6:"completo",7:"completo",8:"completo",9:"completo"} },
  produzione:    { percentuale:60,  moduli:{10:"completo",11:"in-corso"} },
  pianificazione:{ percentuale:30,  moduli:{12:"in-corso",13:"da-fare",14:"da-fare"} },
  monitoraggio:  { percentuale:0,   moduli:{15:"da-fare",16:"da-fare",17:"da-fare"} },
};
const MOCK_FEED = [
  { id:"p1", colori:POST_COLORS[0], titolo:"Brand Launch",   caption:"Quando il design parla da solo.\n\n#EICH #Design",          data:"2026-11-08", piattaforma:"instagram", stato:"pubblicato" },
  { id:"p2", colori:POST_COLORS[1], titolo:"Process",        caption:"Il processo è parte del prodotto.\n\n#BehindTheScenes",     data:"2026-11-11", piattaforma:"instagram", stato:"pubblicato" },
  { id:"p3", colori:POST_COLORS[2], titolo:"Progetto Villa", caption:"Progetto residenziale a Ragusa.\n\n#Architettura #Sicilia", data:"2026-11-14", piattaforma:"instagram", stato:"approvato"  },
  { id:"p4", colori:POST_COLORS[3], titolo:"Materiali",      caption:"La prima decisione estetica.\n\n#Materials",               data:"2026-11-18", piattaforma:"instagram", stato:"approvato"  },
  { id:"p5", colori:POST_COLORS[4], titolo:"Studio Tour",    caption:"Gli spazi influenzano il pensiero.\n\n#Studio",            data:"2026-11-22", piattaforma:"instagram", stato:"bozza"      },
  { id:"p6", colori:POST_COLORS[5], titolo:"Testimonial",    caption:"Un cliente soddisfatto.\n\n#ClientStory",                  data:"2026-11-27", piattaforma:"instagram", stato:"bozza"      },
];
const MOCK_PED = [
  { id:"ped1",  data:"2026-11-04", piattaforma:"instagram", titolo:"Brand Launch",         stato:"pubblicato" },
  { id:"ped2",  data:"2026-11-06", piattaforma:"facebook",  titolo:"Chi siamo",             stato:"pubblicato" },
  { id:"ped3",  data:"2026-11-11", piattaforma:"instagram", titolo:"Process",               stato:"pubblicato" },
  { id:"ped4",  data:"2026-11-12", piattaforma:"linkedin",  titolo:"Case Study Villa",      stato:"pubblicato" },
  { id:"ped5",  data:"2026-11-14", piattaforma:"instagram", titolo:"Progetto Villa",        stato:"semaforo"   },
  { id:"ped6",  data:"2026-11-18", piattaforma:"instagram", titolo:"Materiali",             stato:"semaforo"   },
  { id:"ped7",  data:"2026-11-20", piattaforma:"facebook",  titolo:"Offerta speciale",      stato:"produzione" },
  { id:"ped8",  data:"2026-11-25", piattaforma:"instagram", titolo:"Studio Tour",           stato:"produzione" },
  { id:"ped9",  data:"2026-11-27", piattaforma:"tiktok",    titolo:"Reel dietro le quinte", stato:"brief"      },
  { id:"ped10", data:"2026-11-29", piattaforma:"instagram", titolo:"Lancio collezione",     stato:"idea"       },
];
const MOCK_DOCS = [
  { id:"d1", nome:"Brand Book EICH Design", categoria:"brand",     data:"2026-04-15", dimensione:"8.2 MB", url:"#" },
  { id:"d2", nome:"Copy Strategy · V2",     categoria:"strategia", data:"2026-04-20", dimensione:"1.1 MB", url:"#" },
  { id:"d3", nome:"QBR Q3 2026",            categoria:"report",    data:"2026-10-05", dimensione:"2.4 MB", url:"#" },
];
const MOCK_KPI = {
  reach:45000, engagement:4.2, lead:28,
  topContent:[
    { titolo:"Brand Launch",    reach:12400, engagement:6.8 },
    { titolo:"Process",         reach:9800,  engagement:5.2 },
    { titolo:"Case Study Villa",reach:8100,  engagement:4.9 },
    { titolo:"Chi siamo",       reach:7600,  engagement:3.8 },
    { titolo:"Studio Tour",     reach:7100,  engagement:4.1 },
  ],
  trend:[
    {mese:"Mag",reach:18000},{mese:"Giu",reach:22000},{mese:"Lug",reach:28000},
    {mese:"Ago",reach:31000},{mese:"Set",reach:38000},{mese:"Ott",reach:45000},
  ],
};

/* ─── STORAGE ─────────────────────────────────────────────── */
const store = {
  async get(key) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
    catch { return null; }
  },
  async set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; }
    catch { return false; }
  },
  async del(key) {
    try { localStorage.removeItem(key); return true; }
    catch { return false; }
  },
};

async function seed() {
  if (await store.get("clients:eich-design")) return;
  await store.set("clients:eich-design", MOCK_CLIENTE);
  await store.set("clients:eich-design:progress", MOCK_PROGRESS);
  await store.set("clients:eich-design:feed", MOCK_FEED);
  await store.set("clients:eich-design:ped:2026-11", MOCK_PED);
  await store.set("clients:eich-design:docs", MOCK_DOCS);
  await store.set("clients:eich-design:kpi:2026-10", MOCK_KPI);
  await store.set("clients:index", ["eich-design"]);
}

/* ─── ROUTING ─────────────────────────────────────────────── */
function getRoute() {
  const h = window.location.hash.replace("#", "") || "/admin";
  if (h.startsWith("/admin/")) return { mode:"admin",  slug:h.slice(7) };
  if (h === "/admin" || h === "/") return { mode:"admin", slug:null };
  if (h.startsWith("/c/")) return { mode:"client", slug:h.slice(3) };
  return { mode:"admin", slug:null };
}
function nav(path) { window.location.hash = path; }

/* ─── ATOMS ───────────────────────────────────────────────── */
function Spinner() {
  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",padding:32}}>
      <div style={{width:24,height:24,border:"2px solid #E0E0E0",borderTopColor:C.verde,borderRadius:"50%",animation:"spin .7s linear infinite"}} />
    </div>
  );
}

function Badge({ stato }) {
  const map = {
    pubblicato: { bg:"#E8F5E9", tx:"#1A8C3F", label:"✅ Pubblicato" },
    approvato:  { bg:"#E3F2FD", tx:"#1565C0", label:"Approvato"     },
    semaforo:   { bg:"#FFFDE7", tx:"#F57F17", label:"🚦 Semaforo"   },
    produzione: { bg:"#FFF3E0", tx:"#E65100", label:"✏️ Produzione" },
    brief:      { bg:"#E3F2FD", tx:"#1565C0", label:"📝 Brief"      },
    idea:       { bg:"#FFF8E1", tx:"#795548", label:"💡 Idea"       },
    bozza:      { bg:"#F5F5F5", tx:"#6B6B6B", label:"Bozza"         },
    "da-fare":  { bg:"#F5F5F5", tx:"#6B6B6B", label:"Da fare"       },
    "in-corso": { bg:"#FFF3E0", tx:"#E65100", label:"In corso"      },
    completo:   { bg:"#E8F5E9", tx:"#1A8C3F", label:"Completato"    },
    check:      { bg:"#E3F2FD", tx:"#1565C0", label:"Check"         },
  };
  const s = map[stato] || map["da-fare"];
  return (
    <span style={{background:s.bg,color:s.tx,padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>
      {s.label}
    </span>
  );
}

function PTag({ p }) {
  const pl = PIATTAFORME[p];
  if (!pl) return null;
  return (
    <span style={{background:pl.color,color:"#fff",padding:"2px 7px",borderRadius:4,fontSize:10,fontWeight:700}}>
      {pl.label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  SECTION HEAD (shared)                                       */
/* ─────────────────────────────────────────────────────────── */
function SectionHead({ icon, label, count }) {
  return (
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
      <div style={{width:28,height:28,background:C.verde+"18",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        {icon}
      </div>
      <span style={{fontWeight:800,fontSize:14,color:C.testo}}>{label}</span>
      {count !== undefined && (
        <span style={{fontSize:11,background:C.sfondo,color:C.muted,padding:"1px 8px",borderRadius:10,fontWeight:700,marginLeft:4}}>{count}</span>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  DASHBOARD                                                   */
/* ─────────────────────────────────────────────────────────── */
function Dashboard({ slugs, clientMap, progressMap, pedMap }) {
  const [notes, setNotes]       = useState({});
  const [editNote, setEditNote] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSaving] = useState(false);

  useEffect(() => {
    store.get("dashboard:notes").then(n => setNotes(n || {}));
  }, []);

  function openNote(slug) { setNoteText(notes[slug] || ""); setEditNote(slug); }

  async function saveNote() {
    setSaving(true);
    const updated = { ...notes, [editNote]: noteText };
    await store.set("dashboard:notes", updated);
    setNotes(updated);
    setSaving(false);
    setEditNote(null);
  }

  const crits = [];
  slugs.forEach(slug => {
    const prog = progressMap[slug] || {};
    FASI.forEach(fase => {
      const fd = prog[fase.id] || { percentuale:0, moduli:{} };
      fase.moduli.forEach(mod => {
        const stato = (fd.moduli && fd.moduli[mod.id]) || "da-fare";
        if (stato === "in-corso" || stato === "check")
          crits.push({ slug, nome:clientMap[slug]?.nome||slug, fase:fase.label, faseEmoji:fase.emoji, modulo:mod.nome, stato });
      });
    });
  });

  const today  = new Date().toISOString().split("T")[0];
  const lineup = [];
  slugs.forEach(slug => {
    (pedMap[slug] || []).forEach(p => {
      if (p.data >= today && p.stato !== "pubblicato")
        lineup.push({ ...p, slug, clienteNome:clientMap[slug]?.nome||slug });
    });
  });
  lineup.sort((a, b) => a.data.localeCompare(b.data));

  const totClienti = slugs.length;
  const totOre     = slugs.reduce((acc, s) => acc + (PACCHETTI[clientMap[s]?.pacchetto]?.ore||0), 0);
  const totValue   = slugs.reduce((acc, s) => acc + (PACCHETTI[clientMap[s]?.pacchetto]?.prezzo||0), 0);

  function fmtData(s) {
    if (!s) return "";
    const pts = s.split("-");
    const mesi = ["","Gen","Feb","Mar","Apr","Mag","Giu","Lug","Ago","Set","Ott","Nov","Dic"];
    return parseInt(pts[2]) + " " + mesi[parseInt(pts[1])];
  }

  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"20px 16px",fontFamily:FONT}}>

      {/* KPI */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:22}}>
        {[
          { icon:<Users size={15} style={{color:C.verde}}/>,       label:"Clienti attivi",   value:String(totClienti),                sub:"progetti in essere"       },
          { icon:<Clock size={15} style={{color:C.blu}}/>,         label:"Ore gestite/mese", value:totOre+"h",                        sub:"somma pacchetti retainer" },
          { icon:<TrendingUp size={15} style={{color:C.magenta}}/>,label:"Valore mensile",   value:"€"+totValue.toLocaleString("it-IT"),sub:"ricavi retainer lordi"  },
        ].map(card => (
          <div key={card.label} style={{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:"14px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}>
              {card.icon}
              <span style={{fontSize:11,color:C.muted,fontWeight:700}}>{card.label}</span>
            </div>
            <div style={{fontSize:22,fontWeight:800,color:C.testo,lineHeight:1}}>{card.value}</div>
            <div style={{fontSize:10,color:C.muted,marginTop:4}}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Progetti */}
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:18,marginBottom:18}}>
        <SectionHead icon={<Activity size={14} style={{color:C.verde}}/>} label="Progetti in essere" count={slugs.length} />
        {!slugs.length && <div style={{textAlign:"center",padding:24,color:C.muted,fontSize:13}}>Nessun cliente. Creane uno dalla tab Clienti.</div>}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          {slugs.map(slug => {
            const cl    = clientMap[slug];
            const prog  = progressMap[slug] || {};
            const pac   = PACCHETTI[cl?.pacchetto] || PACCHETTI.professional;
            const percs = FASI.map(f => (prog[f.id] ? prog[f.id].percentuale : 0) || 0);
            const overall = Math.round(percs.reduce((a, b) => a + b, 0) / FASI.length);
            const nota  = notes[slug];
            return (
              <div key={slug} style={{border:"1px solid "+C.border,borderRadius:8,overflow:"hidden"}}>
                <div style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:12,background:C.sfondo}}>
                  <div style={{width:34,height:34,background:C.verde,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{color:"#fff",fontWeight:800,fontSize:14}}>{(cl?.nome||"N")[0]}</span>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:13}}>{cl?.nome}</div>
                    <div style={{fontSize:10,color:C.muted}}>{pac.label} · {pac.ore}h/mese · €{pac.prezzo}/mese</div>
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:15,fontWeight:800,color:overall===100?C.verde:overall>50?"#FB8C00":C.magenta}}>{overall}%</div>
                    <div style={{fontSize:9,color:C.muted}}>overall</div>
                  </div>
                  <button onClick={() => nav("/admin/"+slug)}
                    style={{background:C.verde,color:"#fff",border:"none",borderRadius:5,padding:"5px 11px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FONT,flexShrink:0}}>
                    Apri →
                  </button>
                </div>
                <div style={{padding:"10px 14px 6px",display:"flex",flexDirection:"column",gap:5}}>
                  {FASI.map(fase => {
                    const fd   = prog[fase.id] || { percentuale:0, moduli:{} };
                    const perc = fd.percentuale || 0;
                    const wip  = Object.values(fd.moduli||{}).some(s => s==="in-corso"||s==="check");
                    return (
                      <div key={fase.id} style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:12,width:18,flexShrink:0}}>{fase.emoji}</span>
                        <span style={{fontSize:11,color:C.muted,width:90,flexShrink:0}}>{fase.label}</span>
                        <div style={{flex:1,height:5,background:"#F0F0F0",borderRadius:3,overflow:"hidden"}}>
                          <div style={{height:"100%",width:perc+"%",background:perc===100?C.verde:wip?"#FB8C00":"#E0E0E0",borderRadius:3,transition:"width .4s"}} />
                        </div>
                        <span style={{fontSize:10,fontWeight:700,width:28,textAlign:"right",flexShrink:0,color:perc===100?C.verde:wip?C.arancio:C.muted}}>{perc}%</span>
                        {wip && <span style={{fontSize:9,background:"#FFF3E0",color:C.arancio,padding:"1px 5px",borderRadius:3,fontWeight:700,flexShrink:0}}>WIP</span>}
                      </div>
                    );
                  })}
                </div>
                <div style={{padding:"7px 14px 10px",borderTop:"1px solid "+C.border,marginTop:4,display:"flex",alignItems:"flex-start",gap:8}}>
                  <StickyNote size={12} style={{color:C.muted,marginTop:2,flexShrink:0}} />
                  {nota
                    ? <span style={{fontSize:11,color:C.testo,flex:1,lineHeight:1.5,whiteSpace:"pre-wrap"}}>{nota}</span>
                    : <span style={{fontSize:11,color:C.muted,flex:1,fontStyle:"italic"}}>Nessuna nota — aggiungi un appunto</span>
                  }
                  <button onClick={() => openNote(slug)}
                    style={{background:"none",border:"1px solid "+C.border,borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:FONT,color:C.muted,flexShrink:0}}>
                    {nota ? "Modifica" : "Aggiungi"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Criticità */}
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:18,marginBottom:18}}>
        <SectionHead icon={<Zap size={14} style={{color:C.magenta}}/>} label="Criticità attive" count={crits.length} />
        {!crits.length ? (
          <div style={{textAlign:"center",padding:14,color:C.verde,fontSize:13,fontWeight:700}}>✅ Tutto in ordine. Nessuna criticità.</div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {crits.map((cr, i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:7,
                background:cr.stato==="check"?"#E3F2FD":"#FFF3E0",
                border:"1px solid "+(cr.stato==="check"?"#BBDEFB":"#FFE0B2")}}>
                <span style={{fontSize:14,flexShrink:0}}>{cr.faseEmoji}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:700}}>{cr.nome}</div>
                  <div style={{fontSize:11,color:C.muted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cr.modulo}</div>
                </div>
                <div style={{flexShrink:0,textAlign:"right"}}>
                  <Badge stato={cr.stato} />
                  <div style={{fontSize:9,color:C.muted,marginTop:3}}>{cr.fase}</div>
                </div>
                <button onClick={() => nav("/admin/"+cr.slug)}
                  style={{background:"none",border:"1px solid "+C.border,borderRadius:4,padding:"3px 8px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FONT,color:C.testo,flexShrink:0}}>
                  →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lineup */}
      <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:10,padding:18,marginBottom:18}}>
        <SectionHead icon={<Flag size={14} style={{color:C.blu}}/>} label="Lineup pubblicazioni" count={lineup.length} />
        {!lineup.length ? (
          <div style={{textAlign:"center",padding:16,color:C.muted,fontSize:13}}>Nessuna pubblicazione in programma.</div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {lineup.slice(0, 12).map((item, i) => {
              const pil = PIATTAFORME[item.piattaforma];
              const colMap = { idea:{hbg:"#FFF8E1",htx:"#795548",emoji:"💡",label:"Idea"}, brief:{hbg:"#E3F2FD",htx:"#1565C0",emoji:"📝",label:"Brief"}, produzione:{hbg:"#FFF3E0",htx:"#E65100",emoji:"✏️",label:"Produzione"}, semaforo:{hbg:"#FFFDE7",htx:"#F57F17",emoji:"🚦",label:"Semaforo"} };
              const col = colMap[item.stato] || { hbg:"#F5F5F5", htx:"#6B6B6B", emoji:"", label:item.stato };
              return (
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:C.sfondo,borderRadius:7,border:"1px solid "+C.border}}>
                  <div style={{width:44,flexShrink:0,textAlign:"center"}}>
                    <div style={{fontSize:12,fontWeight:800,color:C.testo}}>{fmtData(item.data)}</div>
                  </div>
                  <div style={{width:1,height:26,background:C.border,flexShrink:0}} />
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.titolo}</div>
                    <div style={{fontSize:10,color:C.muted}}>{item.clienteNome}</div>
                  </div>
                  {pil && <span style={{background:pil.color,color:"#fff",padding:"1px 6px",borderRadius:3,fontSize:9,fontWeight:700,flexShrink:0}}>{pil.label}</span>}
                  <span style={{background:col.hbg,color:col.htx,padding:"2px 7px",borderRadius:4,fontSize:10,fontWeight:700,flexShrink:0}}>{col.emoji} {col.label}</span>
                </div>
              );
            })}
            {lineup.length > 12 && <div style={{textAlign:"center",fontSize:11,color:C.muted,padding:"4px 0"}}>+{lineup.length-12} altri in pipeline</div>}
          </div>
        )}
      </div>

      {/* Note modal */}
      {editNote && (
        <div onClick={() => setEditNote(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div onClick={e => e.stopPropagation()} style={{background:C.white,borderRadius:12,padding:24,maxWidth:420,width:"100%"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
              <StickyNote size={16} style={{color:C.verde}} />
              <h3 style={{margin:0,fontSize:14,fontWeight:700}}>Note — {clientMap[editNote]?.nome}</h3>
            </div>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={5} autoFocus
              placeholder="Appunti interni, follow-up, alert, prossime azioni..."
              style={{width:"100%",boxSizing:"border-box",border:"1px solid "+C.border,borderRadius:7,padding:"10px 12px",fontSize:13,fontFamily:FONT,resize:"vertical",lineHeight:1.6}} />
            <div style={{display:"flex",gap:10,marginTop:14}}>
              <button onClick={() => setEditNote(null)} style={{flex:1,border:"1px solid "+C.border,background:C.white,borderRadius:6,padding:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>Annulla</button>
              <button onClick={saveNote} disabled={savingNote} style={{flex:1,background:C.verde,color:"#fff",border:"none",borderRadius:6,padding:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>
                {savingNote ? "Salvataggio..." : "Salva nota"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  PROGRESS                                                    */
/* ─────────────────────────────────────────────────────────── */
function ProgressSection({ progress, isAdmin, onEdit }) {
  const [open, setOpen] = useState({});
  if (!progress) return <Spinner />;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {FASI.map(fase => {
        const fd     = progress[fase.id] || { percentuale:0, moduli:{} };
        const perc   = fd.percentuale || 0;
        const isOpen = open[fase.id];
        return (
          <div key={fase.id} style={{border:"1px solid "+C.border,borderRadius:8,overflow:"hidden",background:C.white}}>
            <div onClick={() => setOpen(p => ({...p,[fase.id]:!p[fase.id]}))}
              style={{padding:"13px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
              <span style={{fontSize:18}}>{fase.emoji}</span>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontWeight:700,fontSize:14}}>{fase.label}</span>
                  <span style={{fontSize:13,fontWeight:700,color:perc===100?C.verde:perc>0?"#E65100":C.muted}}>{perc}%</span>
                </div>
                <div style={{height:5,background:"#F0F0F0",borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:perc+"%",background:perc===100?C.verde:perc>0?"#FB8C00":"#E0E0E0",borderRadius:3,transition:"width .4s"}} />
                </div>
              </div>
              <ChevronDown size={15} style={{color:C.muted,transform:isOpen?"rotate(180deg)":"none",transition:"transform .2s",flexShrink:0}} />
            </div>
            {isOpen && (
              <div style={{borderTop:"1px solid "+C.border,padding:"8px 16px 12px",display:"flex",flexDirection:"column",gap:6}}>
                {fase.moduli.map(mod => {
                  const stato = (fd.moduli && fd.moduli[mod.id]) || "da-fare";
                  return (
                    <div key={mod.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 0",gap:8}}>
                      <span style={{fontSize:13,color:C.testo}}>{mod.nome}</span>
                      <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                        <Badge stato={stato} />
                        {isAdmin && (
                          <select value={stato} onClick={e => e.stopPropagation()} onChange={e => onEdit(fase.id,mod.id,e.target.value)}
                            style={{fontSize:11,border:"1px solid "+C.border,borderRadius:4,padding:"2px 4px",cursor:"pointer",fontFamily:FONT}}>
                            {Object.entries(STATI_MODULO).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                          </select>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  FEED                                                        */
/* ─────────────────────────────────────────────────────────── */
function FeedSection({ feed }) {
  const [sel, setSel] = useState(null);
  if (!feed || !feed.length) {
    return (
      <div style={{textAlign:"center",padding:40,color:C.muted}}>
        <LayoutGrid size={28} style={{marginBottom:8,opacity:.3}} />
        <p style={{margin:0,fontSize:14}}>Nessun post nel feed</p>
      </div>
    );
  }
  return (
    <>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:3}}>
        {feed.map(post => {
          const img = post.immagineUrl || post.immagineBase64;
          return (
            <div key={post.id} onClick={() => setSel(post)}
              style={{aspectRatio:"1",borderRadius:5,overflow:"hidden",cursor:"pointer",position:"relative",
                background:img?"transparent":"linear-gradient(135deg,"+(post.colori?.[0]||"#333")+","+(post.colori?.[1]||"#666")+")",
                display:"flex",alignItems:"center",justifyContent:"center"}}>
              {img
                ? <img src={img} alt={post.titolo} style={{width:"100%",height:"100%",objectFit:"cover"}} />
                : <span style={{color:"rgba(255,255,255,.65)",fontSize:10,textAlign:"center",padding:8,fontWeight:700}}>{post.titolo}</span>
              }
              <div style={{position:"absolute",bottom:4,right:4,background:"rgba(0,0,0,.55)",borderRadius:3,padding:"1px 5px"}}>
                <span style={{fontSize:9,color:"#fff"}}>{post.stato==="pubblicato"?"●":post.stato==="approvato"?"◑":"○"}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{marginTop:12,display:"flex",gap:12,justifyContent:"center"}}>
        {[["pubblicato","●"],["approvato","◑"],["bozza","○"]].map(([s, dot]) => (
          <span key={s} style={{fontSize:11,color:C.muted}}><span style={{marginRight:4}}>{dot}</span>{s.charAt(0).toUpperCase()+s.slice(1)}</span>
        ))}
      </div>
      {sel && (
        <div onClick={() => setSel(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div onClick={e => e.stopPropagation()} style={{background:C.white,borderRadius:12,overflow:"hidden",maxWidth:440,width:"100%",maxHeight:"88vh",overflowY:"auto"}}>
            <div style={{aspectRatio:"1",background:"linear-gradient(135deg,"+(sel.colori?.[0]||"#333")+","+(sel.colori?.[1]||"#666")+")",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
              {sel.immagineUrl||sel.immagineBase64
                ? <img src={sel.immagineUrl||sel.immagineBase64} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                : <span style={{color:"rgba(255,255,255,.8)",fontSize:22,fontWeight:700,textAlign:"center",padding:24}}>{sel.titolo}</span>
              }
              <button onClick={() => setSel(null)} style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,.5)",border:"none",borderRadius:"50%",width:30,height:30,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <X size={15} />
              </button>
            </div>
            <div style={{padding:20}}>
              <div style={{display:"flex",gap:8,marginBottom:12,alignItems:"center",flexWrap:"wrap"}}>
                <PTag p={sel.piattaforma} /><Badge stato={sel.stato} />
                <span style={{fontSize:12,color:C.muted,marginLeft:"auto"}}>{sel.data}</span>
              </div>
              <p style={{fontSize:14,color:C.testo,lineHeight:1.65,whiteSpace:"pre-line",margin:0}}>{sel.caption}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  CALENDAR  — con tooltip hover sui pallini                   */
/* ─────────────────────────────────────────────────────────── */
function CalendarSection({ ped, mese, onMeseChange }) {
  const [selDay, setSelDay]   = useState(null);
  const [filtro, setFiltro]   = useState(null);
  const [tooltip, setTooltip] = useState(null); // { post, cx, cy }

  const pts = mese.split("-").map(Number);
  const y = pts[0]; const m = pts[1];
  const first   = (new Date(y, m-1, 1).getDay() + 6) % 7;
  const days    = new Date(y, m, 0).getDate();
  const filtred = filtro ? ped.filter(p => p.piattaforma === filtro) : ped;
  const byDay   = {};
  filtred.forEach(p => {
    const d = parseInt(p.data.split("-")[2]);
    if (!byDay[d]) byDay[d] = [];
    byDay[d].push(p);
  });
  const label = new Date(y, m-1, 1).toLocaleString("it-IT", {month:"long",year:"numeric"});
  function prev() { const d = new Date(y,m-2,1); onMeseChange(d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")); }
  function next() { const d = new Date(y,m,1);   onMeseChange(d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")); }

  function showTooltip(e, post) {
    e.stopPropagation();
    setTooltip({ post, cx: e.clientX, cy: e.clientY });
  }

  const bb = {fontSize:11,padding:"3px 10px",borderRadius:20,border:"1px solid "+C.border,cursor:"pointer",fontWeight:700,fontFamily:FONT};

  return (
    <div style={{position:"relative"}} onClick={() => setTooltip(null)}>
      {/* nav mese */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <button onClick={prev} style={{background:"none",border:"1px solid "+C.border,borderRadius:6,padding:"5px 9px",cursor:"pointer"}}><ChevronLeft size={15} /></button>
        <span style={{fontWeight:700,fontSize:15,textTransform:"capitalize"}}>{label}</span>
        <button onClick={next} style={{background:"none",border:"1px solid "+C.border,borderRadius:6,padding:"5px 9px",cursor:"pointer"}}><ChevronRight size={15} /></button>
      </div>

      {/* filtro piattaforma */}
      <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
        <button onClick={() => setFiltro(null)} style={{...bb,background:!filtro?C.testo:C.white,color:!filtro?"#fff":C.testo}}>Tutti</button>
        {Object.entries(PIATTAFORME).map(([k, p]) => (
          <button key={k} onClick={() => setFiltro(filtro===k?null:k)} style={{...bb,background:filtro===k?p.color:C.white,color:filtro===k?"#fff":C.testo}}>
            {p.label}
          </button>
        ))}
      </div>

      {/* griglia giorni */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:10}}>
        {["Lun","Mar","Mer","Gio","Ven","Sab","Dom"].map(g => (
          <div key={g} style={{textAlign:"center",fontSize:10,fontWeight:700,color:C.muted,padding:"4px 0"}}>{g}</div>
        ))}
        {Array.from({length:first}, (_, i) => <div key={"e"+i} />)}
        {Array.from({length:days}, (_, i) => {
          const d     = i + 1;
          const posts = byDay[d] || [];
          const isSel = selDay === d;
          return (
            <div key={d} onClick={() => setSelDay(isSel?null:d)}
              style={{padding:"6px 2px",textAlign:"center",borderRadius:6,cursor:"pointer",
                background:isSel?C.verde:"transparent",border:"1px solid "+(isSel?C.verde:"transparent")}}>
              <div style={{fontSize:12,color:isSel?"#fff":C.testo,marginBottom:3}}>{d}</div>
              <div style={{display:"flex",justifyContent:"center",gap:2,flexWrap:"wrap"}}>
                {posts.slice(0, 3).map((post, idx) => {
                  const pil = PIATTAFORME[post.piattaforma];
                  return (
                    <div
                      key={idx}
                      onMouseEnter={e => showTooltip(e, post)}
                      onMouseLeave={() => setTooltip(null)}
                      onClick={e => e.stopPropagation()}
                      style={{width:7,height:7,borderRadius:"50%",background:pil?.color||"#999",cursor:"pointer",transition:"transform .15s"}}
                      onMouseOver={e => { e.currentTarget.style.transform="scale(1.6)"; }}
                      onMouseOut={e => { e.currentTarget.style.transform="scale(1)"; }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tooltip hover — fixed positioning */}
      {tooltip && (
        <div
          style={{position:"fixed",left:tooltip.cx+14,top:tooltip.cy-10,zIndex:9999,
            background:C.white,border:"1px solid "+C.border,borderRadius:8,padding:"10px 12px",
            boxShadow:"0 4px 16px rgba(0,0,0,.14)",minWidth:180,maxWidth:240,pointerEvents:"none"}}
        >
          {/* mini preview colore */}
          <div style={{width:"100%",height:6,borderRadius:3,marginBottom:8,
            background:"linear-gradient(90deg,"+(PIATTAFORME[tooltip.post.piattaforma]?.color||"#999")+","+(PIATTAFORME[tooltip.post.piattaforma]?.color||"#999")+"44)"}}/>
          <div style={{fontWeight:700,fontSize:12,color:C.testo,marginBottom:5,lineHeight:1.3}}>{tooltip.post.titolo}</div>
          <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap",marginBottom:6}}>
            <PTag p={tooltip.post.piattaforma} />
            <Badge stato={tooltip.post.stato} />
          </div>
          <div style={{fontSize:10,color:C.muted}}>{tooltip.post.data}</div>
        </div>
      )}

      {/* Dettaglio giorno selezionato */}
      {selDay && byDay[selDay] && (
        <div style={{background:C.sfondo,borderRadius:8,padding:12}}>
          <p style={{margin:"0 0 10px",fontSize:13,fontWeight:700}}>{selDay} {label}</p>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {byDay[selDay].map(post => (
              <div key={post.id} style={{background:C.white,borderRadius:6,padding:10,display:"flex",alignItems:"center",gap:10}}>
                <PTag p={post.piattaforma} />
                <span style={{flex:1,fontSize:13}}>{post.titolo}</span>
                <Badge stato={post.stato} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  DOCS                                                        */
/* ─────────────────────────────────────────────────────────── */
/* helper: rileva la sorgente da URL */
function detectSource(url) {
  if (!url) return "interno";
  if (url.includes("dropbox.com/paper") || url.includes("paper.dropbox")) return "paper";
  if (url.includes("dropbox.com")) return "dropbox";
  if (url.includes("docs.google.com") || url.includes("drive.google.com")) return "drive";
  return "link";
}

const SOURCE_META = {
  interno:  { label:"Documento interno", icon:"📝", color:"#1A8C3F",  bg:"#E8F5E9" },
  paper:    { label:"Dropbox Paper",      icon:"📄", color:"#0061FF",  bg:"#E3F0FF" },
  dropbox:  { label:"Dropbox",            icon:"📦", color:"#0061FF",  bg:"#E3F0FF" },
  drive:    { label:"Google Drive",       icon:"🗂",  color:"#1565C0",  bg:"#E3F2FD" },
  link:     { label:"Link esterno",       icon:"🔗", color:"#6B6B6B",  bg:"#F5F5F5" },
};

function DocsSection({ docs }) {
  const [filtro,   setFiltro]   = useState(null);
  const [viewDoc,  setViewDoc]  = useState(null); // doc con contenuto interno

  if (!docs || !docs.length) {
    return (
      <div style={{textAlign:"center",padding:40,color:C.muted}}>
        <FileText size={28} style={{marginBottom:8,opacity:.3}} />
        <p style={{margin:0,fontSize:14}}>Nessun documento disponibile</p>
      </div>
    );
  }

  const filtred = filtro ? docs.filter(d => d.categoria===filtro) : docs;
  const bb = {fontSize:11,padding:"3px 10px",borderRadius:20,border:"1px solid "+C.border,cursor:"pointer",fontWeight:700,fontFamily:FONT};

  return (
    <div>
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
        <button onClick={() => setFiltro(null)} style={{...bb,background:!filtro?C.testo:C.white,color:!filtro?"#fff":C.testo}}>Tutti</button>
        {Object.entries(DOC_CAT).map(([k, cat]) => (
          <button key={k} onClick={() => setFiltro(filtro===k?null:k)} style={{...bb,background:filtro===k?cat.color:C.white,color:filtro===k?"#fff":C.testo}}>
            {cat.label}
          </button>
        ))}
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtred.map(doc => {
          const cat    = DOC_CAT[doc.categoria] || DOC_CAT.brand;
          const src    = SOURCE_META[doc.sorgente || detectSource(doc.url)];
          const isInt  = (doc.sorgente === "interno");
          return (
            <div key={doc.id} style={{border:"1px solid "+C.border,borderRadius:8,padding:"12px 16px",background:C.white,display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:38,height:38,background:src.bg,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>
                {src.icon}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:13,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{doc.nome}</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",alignItems:"center"}}>
                  <span style={{background:cat.color+"22",color:cat.color,padding:"1px 6px",borderRadius:3,fontSize:10,fontWeight:700}}>{cat.label}</span>
                  <span style={{background:src.bg,color:src.color,padding:"1px 6px",borderRadius:3,fontSize:10,fontWeight:700}}>{src.label}</span>
                  {doc.data && <span style={{fontSize:10,color:C.muted}}>{doc.data}</span>}
                </div>
              </div>
              {isInt ? (
                <button onClick={() => setViewDoc(doc)}
                  style={{color:C.verde,border:"1px solid "+C.verde+"44",borderRadius:5,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer",background:"none",fontFamily:FONT,flexShrink:0}}>
                  Leggi
                </button>
              ) : (
                <a href={doc.url} target="_blank" rel="noreferrer"
                  style={{color:C.verde,display:"flex",alignItems:"center",gap:4,fontSize:12,fontWeight:700,textDecoration:"none",flexShrink:0}}>
                  Apri <ExternalLink size={11} />
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Viewer documento interno */}
      {viewDoc && (
        <div onClick={() => setViewDoc(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div onClick={e => e.stopPropagation()} style={{background:C.white,borderRadius:12,width:"100%",maxWidth:620,maxHeight:"85vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{padding:"16px 20px",borderBottom:"1px solid "+C.border,display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:18}}>📝</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14}}>{viewDoc.nome}</div>
                <div style={{fontSize:10,color:C.muted}}>{viewDoc.data}</div>
              </div>
              <button onClick={() => setViewDoc(null)} style={{background:"none",border:"none",cursor:"pointer",color:C.muted}}>
                <X size={16} />
              </button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
              <pre style={{margin:0,fontFamily:FONT,fontSize:13,color:C.testo,lineHeight:1.7,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>
                {viewDoc.contenuto || "Documento vuoto."}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  KANBAN — riga 1: pipeline (4 col), riga 2: pubblicato       */
/* ─────────────────────────────────────────────────────────── */
function kanbanFmtData(s) {
  if (!s) return "";
  const pts = s.split("-");
  return pts[2] + "/" + pts[1];
}

function KanbanCard({ post, col }) {
  const pil = PIATTAFORME[post.piattaforma];
  return (
    <div style={{background:C.white,borderRadius:7,padding:"9px 10px",border:"1px solid "+C.border,
      borderLeft:"3px solid "+col.htx,boxShadow:"0 1px 4px rgba(0,0,0,.05)"}}>
      <div style={{fontSize:12,fontWeight:700,color:C.testo,marginBottom:6,lineHeight:1.35}}>{post.titolo}</div>
      <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
        {pil && <span style={{background:pil.color,color:"#fff",padding:"1px 5px",borderRadius:3,fontSize:9,fontWeight:700}}>{pil.label}</span>}
        {post.data && <span style={{fontSize:10,color:C.muted,marginLeft:"auto"}}>{kanbanFmtData(post.data)}</span>}
      </div>
    </div>
  );
}

function KanbanSection({ ped, mese, onMeseChange }) {
  if (!ped) return <Spinner />;

  const byCol = {};
  Object.keys(PIPELINE_COLS).forEach(k => { byCol[k] = []; });
  byCol["pubblicato"] = [];
  ped.forEach(p => {
    if (byCol[p.stato] !== undefined) byCol[p.stato].push(p);
    else byCol["idea"].push(p);
  });

  return (
    <div>
      {/* mese selector */}
      <div style={{marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
        <input type="month" value={mese} onChange={e => onMeseChange(e.target.value)}
          style={{border:"1px solid "+C.border,borderRadius:6,padding:"6px 12px",fontSize:13,fontFamily:FONT,flex:1}} />
        <span style={{fontSize:11,color:C.muted}}>{ped.length} contenuti</span>
      </div>

      {/* RIGA 1 — Pipeline (4 colonne) */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
        {Object.entries(PIPELINE_COLS).map(([colKey, col]) => {
          const cards = byCol[colKey] || [];
          return (
            <div key={colKey} style={{background:C.sfondo,borderRadius:10,display:"flex",flexDirection:"column",minHeight:260,border:"1px solid "+C.border}}>
              <div style={{background:col.hbg,borderRadius:"10px 10px 0 0",padding:"10px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
                <span style={{fontSize:12,fontWeight:800,color:col.htx}}>{col.emoji} {col.label}</span>
                <span style={{fontSize:11,fontWeight:700,background:"rgba(0,0,0,.1)",color:col.htx,borderRadius:20,padding:"1px 7px"}}>{cards.length}</span>
              </div>
              <div style={{padding:8,display:"flex",flexDirection:"column",gap:7,flex:1}}>
                {!cards.length && (
                  <div style={{border:"1.5px dashed "+C.border,borderRadius:7,padding:"12px 8px",textAlign:"center",fontSize:11,color:C.muted}}>
                    Nessun contenuto
                  </div>
                )}
                {cards.map(post => <KanbanCard key={post.id} post={post} col={col} />)}
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGA 2 — Pubblicato (orizzontale full-width) */}
      <div style={{background:C.sfondo,borderRadius:10,border:"1px solid "+C.border,overflow:"hidden"}}>
        <div style={{background:PUBBLICATO_COL.hbg,padding:"10px 16px",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:13,fontWeight:800,color:PUBBLICATO_COL.htx}}>{PUBBLICATO_COL.emoji} {PUBBLICATO_COL.label}</span>
          <span style={{fontSize:11,fontWeight:700,background:"rgba(0,0,0,.08)",color:PUBBLICATO_COL.htx,borderRadius:20,padding:"1px 8px"}}>{byCol["pubblicato"].length}</span>
          <span style={{fontSize:10,color:PUBBLICATO_COL.htx,marginLeft:"auto",opacity:.7}}>scroll orizzontale</span>
        </div>
        {!byCol["pubblicato"].length ? (
          <div style={{padding:"16px 20px",fontSize:11,color:C.muted,fontStyle:"italic"}}>Nessun contenuto pubblicato questo mese</div>
        ) : (
          <div style={{display:"flex",gap:8,overflowX:"auto",padding:"10px 12px 12px",scrollbarWidth:"thin"}}>
            {byCol["pubblicato"].map(post => {
              const pil = PIATTAFORME[post.piattaforma];
              return (
                <div key={post.id} style={{background:C.white,borderRadius:7,padding:"9px 12px",border:"1px solid "+C.border,
                  borderLeft:"3px solid "+PUBBLICATO_COL.htx,boxShadow:"0 1px 4px rgba(0,0,0,.05)",
                  minWidth:160,maxWidth:180,flexShrink:0}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.testo,marginBottom:6,lineHeight:1.35,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{post.titolo}</div>
                  <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
                    {pil && <span style={{background:pil.color,color:"#fff",padding:"1px 5px",borderRadius:3,fontSize:9,fontWeight:700}}>{pil.label}</span>}
                    {post.data && <span style={{fontSize:10,color:C.muted,marginLeft:"auto",whiteSpace:"nowrap"}}>{kanbanFmtData(post.data)}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  KPI                                                         */
/* ─────────────────────────────────────────────────────────── */
function KPISection({ kpi, mese, onMeseChange }) {
  function fmt(n) { return n >= 1000 ? (n/1000).toFixed(1)+"k" : String(n); }
  return (
    <div>
      <div style={{marginBottom:16}}>
        <input type="month" value={mese} onChange={e => onMeseChange(e.target.value)}
          style={{border:"1px solid "+C.border,borderRadius:6,padding:"6px 12px",fontSize:14,fontFamily:FONT,width:"100%",boxSizing:"border-box"}} />
      </div>
      {!kpi ? (
        <div style={{textAlign:"center",padding:40,color:C.muted}}>
          <BarChart2 size={28} style={{marginBottom:8,opacity:.3}} />
          <p style={{margin:0,fontSize:14}}>Nessun dato per questo mese</p>
        </div>
      ) : (
        <>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}>
            {[{label:"Reach",value:fmt(kpi.reach),icon:"👁"},{label:"Eng. Rate",value:kpi.engagement+"%",icon:"❤️"},{label:"Lead",value:kpi.lead,icon:"🎯"}].map(card => (
              <div key={card.label} style={{border:"1px solid "+C.border,borderRadius:8,padding:"12px 10px",background:C.white,textAlign:"center"}}>
                <div style={{fontSize:20,marginBottom:4}}>{card.icon}</div>
                <div style={{fontSize:20,fontWeight:800,color:C.verde,lineHeight:1}}>{card.value}</div>
                <div style={{fontSize:11,color:C.muted,marginTop:4}}>{card.label}</div>
              </div>
            ))}
          </div>
          {kpi.trend && (
            <div style={{border:"1px solid "+C.border,borderRadius:8,padding:16,background:C.white,marginBottom:16}}>
              <p style={{margin:"0 0 12px",fontSize:13,fontWeight:700}}>Trend Reach — ultimi 6 mesi</p>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={kpi.trend} margin={{top:5,right:5,left:-20,bottom:0}}>
                  <defs>
                    <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={C.verde} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={C.verde} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis dataKey="mese" tick={{fontSize:11,fontFamily:FONT}} />
                  <YAxis tick={{fontSize:11,fontFamily:FONT}} tickFormatter={fmt} />
                  <Tooltip formatter={v => [fmt(v),"Reach"]} contentStyle={{fontFamily:FONT,fontSize:12}} />
                  <Area type="monotone" dataKey="reach" stroke={C.verde} strokeWidth={2} fill="url(#rg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
          {kpi.topContent && (
            <div style={{border:"1px solid "+C.border,borderRadius:8,background:C.white,overflow:"hidden"}}>
              <div style={{padding:"12px 16px",borderBottom:"1px solid "+C.border}}>
                <p style={{margin:0,fontSize:13,fontWeight:700}}>Top 5 contenuti</p>
              </div>
              {kpi.topContent.map((item, i) => (
                <div key={i} style={{padding:"10px 16px",borderBottom:i<kpi.topContent.length-1?"1px solid "+C.border:"none",display:"flex",alignItems:"center",gap:12}}>
                  <span style={{fontSize:12,fontWeight:700,color:C.muted,width:16}}>#{i+1}</span>
                  <span style={{flex:1,fontSize:13}}>{item.titolo}</span>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:12,fontWeight:700,color:C.verde}}>{fmt(item.reach)} reach</div>
                    <div style={{fontSize:11,color:C.muted}}>{item.engagement}% eng.</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  CLIENT VIEW  — con back button                             */
/* ─────────────────────────────────────────────────────────── */
function ClientView({ slug }) {
  const [cliente,  setCliente]  = useState(null);
  const [progress, setProgress] = useState(null);
  const [feed,     setFeed]     = useState(null);
  const [docs,     setDocs]     = useState(null);
  const [ped,      setPed]      = useState([]);
  const [kpi,      setKpi]      = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState("progress");
  const [mesePed,  setMesePed]  = useState("2026-11");
  const [meseKpi,  setMeseKpi]  = useState("2026-10");
  const [err,      setErr]      = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const c = await store.get("clients:"+slug);
      if (!c) { setErr("Cliente non trovato"); setLoading(false); return; }
      setCliente(c);
      const [p, f, d] = await Promise.all([
        store.get("clients:"+slug+":progress"),
        store.get("clients:"+slug+":feed"),
        store.get("clients:"+slug+":docs"),
      ]);
      setProgress(p||{}); setFeed(f||[]); setDocs(d||[]);
      setLoading(false);
    })();
  }, [slug]);

  useEffect(() => { store.get("clients:"+slug+":ped:"+mesePed).then(p => setPed(p||[])); }, [slug, mesePed]);
  useEffect(() => { store.get("clients:"+slug+":kpi:"+meseKpi).then(k => setKpi(k||null)); }, [slug, meseKpi]);

  if (loading) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.sfondo,fontFamily:FONT}}>
        <Spinner />
      </div>
    );
  }
  if (err) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.sfondo,fontFamily:FONT,flexDirection:"column",gap:12}}>
        <AlertCircle size={32} style={{color:C.magenta}} />
        <p style={{fontWeight:700}}>{err}</p>
      </div>
    );
  }

  const pac       = PACCHETTI[cliente.pacchetto] || PACCHETTI.professional;
  const fasePercs = Object.values(progress||{}).map(f => f.percentuale||0);
  const overall   = fasePercs.length ? Math.round(fasePercs.reduce((a,b)=>a+b,0)/fasePercs.length) : 0;

  const TABS = [
    {id:"progress",label:"Progetto"},{id:"feed",label:"Feed"},
    {id:"calendario",label:"Calendario"},{id:"kanban",label:"Kanban"},
    {id:"documenti",label:"Documenti"},{id:"kpi",label:"Report"},
  ];

  return (
    <div style={{minHeight:"100vh",background:C.sfondo,fontFamily:FONT,color:C.testo}}>
      <div style={{background:C.white,borderBottom:"1px solid "+C.border,padding:"14px 18px 0"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>

          {/* top bar: back + modifica */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <button
              onClick={() => nav("/admin")}
              style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"none",cursor:"pointer",color:C.muted,fontSize:12,fontFamily:FONT,padding:0}}
            >
              <ArrowLeft size={13} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => nav("/admin/"+slug)}
              style={{display:"flex",alignItems:"center",gap:5,background:"none",border:"1px solid "+C.border,borderRadius:6,padding:"4px 10px",cursor:"pointer",color:C.testo,fontSize:12,fontFamily:FONT,fontWeight:700}}
            >
              <Check size={12} style={{color:C.verde}} />
              Modifica
            </button>
          </div>

          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
            <div style={{width:46,height:46,background:C.verde,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{color:"#fff",fontWeight:800,fontSize:18}}>{(cliente.nome||"N")[0]}</span>
            </div>
            <div>
              <h1 style={{margin:0,fontSize:19,fontWeight:800}}>{cliente.nome}</h1>
              <span style={{fontSize:11,color:C.muted}}>{pac.label} · {pac.ore}h/mese</span>
            </div>
          </div>

          <div style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{fontSize:11,color:C.muted,fontWeight:700}}>Avanzamento progetto</span>
              <span style={{fontSize:12,fontWeight:800,color:C.verde}}>{overall}%</span>
            </div>
            <div style={{height:7,background:"#F0F0F0",borderRadius:4,overflow:"hidden"}}>
              <div style={{height:"100%",width:overall+"%",background:C.verde,borderRadius:4,transition:"width .5s"}} />
            </div>
          </div>

          <div style={{display:"flex",overflowX:"auto",borderTop:"1px solid "+C.border}}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{padding:"11px 14px",fontSize:12,fontWeight:700,border:"none",background:"none",cursor:"pointer",fontFamily:FONT,
                  color:tab===t.id?C.verde:C.muted,borderBottom:"2px solid "+(tab===t.id?C.verde:"transparent"),whiteSpace:"nowrap",flexShrink:0}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:600,margin:"0 auto",padding:16}}>
        {tab==="progress"   && <ProgressSection progress={progress} isAdmin={false} />}
        {tab==="feed"       && <FeedSection feed={feed} />}
        {tab==="calendario" && <CalendarSection ped={ped} mese={mesePed} onMeseChange={setMesePed} />}
        {tab==="kanban"     && <KanbanSection ped={ped} mese={mesePed} onMeseChange={setMesePed} />}
        {tab==="documenti"  && <DocsSection docs={docs} />}
        {tab==="kpi"        && <KPISection kpi={kpi} mese={meseKpi} onMeseChange={setMeseKpi} />}
      </div>
      <div style={{textAlign:"center",padding:"20px 16px",color:C.muted,fontSize:11}}>
        <span style={{fontWeight:700,color:C.verde}}>NASSA STUDIO</span> · Modica (RG) · nassastudio.it
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  ADMIN LIST                                                  */
/* ─────────────────────────────────────────────────────────── */
function AdminList() {
  const [slugs,       setSlugs]       = useState([]);
  const [clientMap,   setClientMap]   = useState({});
  const [progressMap, setProgressMap] = useState({});
  const [pedMap,      setPedMap]      = useState({});
  const [loading,     setLoading]     = useState(true);
  const [adminTab,    setAdminTab]    = useState("dashboard");
  const [showNew,     setShowNew]     = useState(false);
  const [nome,        setNome]        = useState("");
  const [slug,        setSlug]        = useState("");
  const [pac,         setPac]         = useState("professional");
  const [creating,    setCreating]    = useState(false);
  const MESE = "2026-11";

  const loadAll = useCallback(async () => {
    setLoading(true);
    const idx = await store.get("clients:index") || [];
    setSlugs(idx);
    const cm = {}, pm = {}, pedm = {};
    await Promise.all(idx.map(async s => {
      const [c, p, ped] = await Promise.all([
        store.get("clients:"+s),
        store.get("clients:"+s+":progress"),
        store.get("clients:"+s+":ped:"+MESE),
      ]);
      if (c) cm[s] = c;
      if (p) pm[s] = p;
      pedm[s] = ped || [];
    }));
    setClientMap(cm); setProgressMap(pm); setPedMap(pedm);
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  async function create() {
    if (!nome || !slug) return;
    setCreating(true);
    const s = slug.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
    await store.set("clients:"+s, {slug:s,nome,pacchetto:pac,dataInizio:new Date().toISOString().split("T")[0]});
    await store.set("clients:"+s+":progress", {});
    await store.set("clients:"+s+":feed", []);
    await store.set("clients:"+s+":docs", []);
    await store.set("clients:index", [...slugs, s]);
    setShowNew(false); setNome(""); setSlug("");
    setCreating(false);
    await loadAll();
    nav("/admin/"+s);
  }

  async function del(s) {
    if (!confirm("Eliminare "+( clientMap[s]?.nome||s)+"?")) return;
    await store.del("clients:"+s);
    await store.set("clients:index", slugs.filter(x => x!==s));
    await loadAll();
  }

  const inp = {width:"100%",boxSizing:"border-box",border:"1px solid "+C.border,borderRadius:6,padding:"8px 12px",fontSize:14,fontFamily:FONT};

  return (
    <div style={{minHeight:"100vh",background:C.sfondo,fontFamily:FONT}}>
      <div style={{background:C.white,borderBottom:"1px solid "+C.border,padding:"0 20px",display:"flex",justifyContent:"space-between",alignItems:"stretch",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div style={{padding:"13px 0"}}>
            <div style={{fontWeight:800,fontSize:15,color:C.verde}}>NASSA STUDIO</div>
            <div style={{fontSize:10,color:C.muted}}>Admin · Client Portal</div>
          </div>
          <div style={{display:"flex",height:"100%"}}>
            {[{id:"dashboard",label:"Dashboard"},{id:"clienti",label:"Clienti ("+slugs.length+")"}].map(t => (
              <button key={t.id} onClick={() => setAdminTab(t.id)}
                style={{padding:"0 16px",fontSize:12,fontWeight:700,border:"none",background:"none",cursor:"pointer",fontFamily:FONT,
                  color:adminTab===t.id?C.verde:C.muted,borderBottom:"2px solid "+(adminTab===t.id?C.verde:"transparent"),whiteSpace:"nowrap"}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center"}}>
          <button onClick={() => setShowNew(true)}
            style={{background:C.verde,color:"#fff",border:"none",borderRadius:6,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontFamily:FONT}}>
            <Plus size={13} /> Nuovo cliente
          </button>
        </div>
      </div>

      {loading ? <Spinner /> : adminTab==="dashboard" ? (
        <Dashboard slugs={slugs} clientMap={clientMap} progressMap={progressMap} pedMap={pedMap} />
      ) : (
        <div style={{maxWidth:700,margin:"0 auto",padding:20}}>
          <p style={{fontSize:14,fontWeight:700,marginBottom:14}}>Clienti attivi ({slugs.length})</p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {!slugs.length && <div style={{textAlign:"center",padding:40,color:C.muted,fontSize:14}}>Nessun cliente. Creane uno.</div>}
            {slugs.map(s => {
              const c = clientMap[s]; if (!c) return null;
              const p = PACCHETTI[c.pacchetto];
              return (
                <div key={s} style={{background:C.white,border:"1px solid "+C.border,borderRadius:8,padding:"13px 16px",display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:40,height:40,background:C.verde,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{color:"#fff",fontWeight:800,fontSize:16}}>{(c.nome||"N")[0]}</span>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14}}>{c.nome}</div>
                    <div style={{fontSize:11,color:C.muted}}>{s} · {p?p.label:c.pacchetto}</div>
                  </div>
                  <div style={{display:"flex",gap:7}}>
                    <button onClick={() => nav("/c/"+s)} style={{background:"none",border:"1px solid "+C.border,borderRadius:6,padding:"6px 8px",cursor:"pointer",display:"flex",alignItems:"center"}}>
                      <Eye size={14} style={{color:C.muted}} />
                    </button>
                    <button onClick={() => nav("/admin/"+s)} style={{background:C.verde,color:"#fff",border:"none",borderRadius:6,padding:"6px 13px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>
                      Modifica
                    </button>
                    <button onClick={() => del(s)} style={{background:"none",border:"1px solid "+C.magenta,borderRadius:6,padding:"6px 8px",cursor:"pointer",display:"flex",alignItems:"center"}}>
                      <Trash2 size={14} style={{color:C.magenta}} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showNew && (
        <div onClick={() => setShowNew(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div onClick={e => e.stopPropagation()} style={{background:C.white,borderRadius:12,padding:24,maxWidth:400,width:"100%"}}>
            <h3 style={{margin:"0 0 20px",fontSize:15,fontWeight:700}}>Nuovo cliente</h3>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div>
                <label style={{fontSize:12,fontWeight:700,display:"block",marginBottom:4}}>Nome</label>
                <input style={inp} value={nome}
                  onChange={e => { setNome(e.target.value); setSlug(e.target.value.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")); }}
                  placeholder="Es. EICH Design" />
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:700,display:"block",marginBottom:4}}>Slug URL</label>
                <input style={inp} value={slug} onChange={e => setSlug(e.target.value)} placeholder="es. eich-design" />
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:700,display:"block",marginBottom:4}}>Pacchetto</label>
                <select style={inp} value={pac} onChange={e => setPac(e.target.value)}>
                  {Object.entries(PACCHETTI).map(([k, v]) => <option key={k} value={k}>{v.label} — €{v.prezzo}/mese</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:20}}>
              <button onClick={() => setShowNew(false)} style={{flex:1,border:"1px solid "+C.border,background:C.white,borderRadius:6,padding:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>Annulla</button>
              <button onClick={create} disabled={creating||!nome||!slug}
                style={{flex:1,background:C.verde,color:"#fff",border:"none",borderRadius:6,padding:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT,opacity:(!nome||!slug)?0.5:1}}>
                {creating?"Creazione...":"Crea"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  DOC TAB ADMIN                                              */
/* ─────────────────────────────────────────────────────────── */
function DocTabAdmin({ docs, setDocs, inp }) {
  const [mode,     setMode]     = useState(null); // "interno" | "link"
  const [editDoc,  setEditDoc]  = useState(null); // id del doc in editing
  // campi nuovo doc
  const [nome,     setNome]     = useState("");
  const [cat,      setCat]      = useState("brand");
  const [url,      setUrl]      = useState("");
  const [contenuto,setContenuto]= useState("");

  function openNew(tipo) {
    setNome(""); setCat("brand"); setUrl(""); setContenuto("");
    setMode(tipo); setEditDoc(null);
  }

  function openEdit(doc) {
    setNome(doc.nome); setCat(doc.categoria); setUrl(doc.url||""); setContenuto(doc.contenuto||"");
    setEditDoc(doc.id); setMode(doc.sorgente==="interno"?"interno":"link");
  }

  function save() {
    const today = new Date().toISOString().split("T")[0];
    if (editDoc) {
      setDocs(prev => prev.map(d => d.id===editDoc
        ? {...d, nome, categoria:cat, url, contenuto, sorgente:mode==="interno"?"interno":detectSource(url) }
        : d));
    } else {
      const sorgente = mode==="interno" ? "interno" : detectSource(url);
      setDocs(prev => [...prev, {id:"d"+Date.now(), nome, categoria:cat, url, contenuto, sorgente, data:today}]);
    }
    setMode(null); setEditDoc(null);
  }

  function del(id) {
    setDocs(prev => prev.filter(d => d.id!==id));
  }

  const btnBase = {border:"none",borderRadius:8,padding:"12px 14px",cursor:"pointer",fontFamily:FONT,textAlign:"left",display:"flex",flexDirection:"column",gap:4};

  return (
    <div>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <span style={{fontSize:13,fontWeight:700}}>Documenti ({docs.length})</span>
        <div style={{display:"flex",gap:7}}>
          <button onClick={() => openNew("interno")}
            style={{background:C.verde,color:"#fff",border:"none",borderRadius:6,padding:"7px 11px",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontFamily:FONT}}>
            <Plus size={12} /> Scrivi documento
          </button>
          <button onClick={() => openNew("link")}
            style={{background:"none",border:"1px solid "+C.border,borderRadius:6,padding:"7px 11px",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontFamily:FONT,color:C.testo}}>
            <Plus size={12} /> Collega link
          </button>
        </div>
      </div>

      {/* Lista documenti */}
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:mode?16:0}}>
        {!docs.length && (
          <div style={{textAlign:"center",padding:32,color:C.muted,fontSize:13,border:"1.5px dashed "+C.border,borderRadius:8}}>
            Nessun documento. Crea un documento interno o collega un link esterno.
          </div>
        )}
        {docs.map(doc => {
          const cat2   = DOC_CAT[doc.categoria] || DOC_CAT.brand;
          const src    = SOURCE_META[doc.sorgente || detectSource(doc.url)];
          const isInt  = (doc.sorgente === "interno");
          return (
            <div key={doc.id} style={{background:C.white,border:"1px solid "+C.border,borderRadius:8,padding:"11px 14px",display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:34,height:34,background:src.bg,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:16}}>
                {src.icon}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:700,fontSize:13,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{doc.nome}</div>
                <div style={{display:"flex",gap:5,marginTop:3,flexWrap:"wrap"}}>
                  <span style={{background:cat2.color+"22",color:cat2.color,padding:"1px 5px",borderRadius:3,fontSize:10,fontWeight:700}}>{cat2.label}</span>
                  <span style={{background:src.bg,color:src.color,padding:"1px 5px",borderRadius:3,fontSize:10,fontWeight:700}}>{src.label}</span>
                  {doc.data && <span style={{fontSize:10,color:C.muted}}>{doc.data}</span>}
                </div>
              </div>
              <div style={{display:"flex",gap:6,flexShrink:0}}>
                <button onClick={() => openEdit(doc)}
                  style={{background:"none",border:"1px solid "+C.border,borderRadius:5,padding:"4px 9px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FONT,color:C.testo}}>
                  Modifica
                </button>
                {!isInt && doc.url && doc.url !== "#" && (
                  <a href={doc.url} target="_blank" rel="noreferrer"
                    style={{background:"none",border:"1px solid "+C.verde+"55",borderRadius:5,padding:"4px 9px",fontSize:11,fontWeight:700,textDecoration:"none",color:C.verde,display:"flex",alignItems:"center",gap:3}}>
                    Apri <ExternalLink size={10} />
                  </a>
                )}
                <button onClick={() => del(doc.id)}
                  style={{background:"none",border:"none",cursor:"pointer",color:C.magenta,padding:"4px"}}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form nuovo / edit */}
      {mode && (
        <div style={{background:C.sfondo,borderRadius:10,border:"1px solid "+C.border,padding:18,marginTop:8}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
            <span style={{fontSize:16}}>{mode==="interno"?"📝":"🔗"}</span>
            <span style={{fontWeight:700,fontSize:13}}>
              {editDoc ? "Modifica documento" : mode==="interno" ? "Nuovo documento interno" : "Collega documento esterno"}
            </span>
          </div>

          {/* Sorgente esterno: tre opzioni rapide */}
          {mode==="link" && !editDoc && (
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
              {[
                {key:"paper",  icon:"📄", label:"Dropbox Paper",   hint:"Incolla URL Paper"},
                {key:"dropbox",icon:"📦", label:"Dropbox",         hint:"Incolla URL Dropbox"},
                {key:"drive",  icon:"🗂",  label:"Google Drive",    hint:"Incolla URL Drive"},
              ].map(s => (
                <button key={s.key} onClick={() => setUrl("")}
                  style={{...btnBase, background:SOURCE_META[s.key].bg, color:SOURCE_META[s.key].color, border:"1px solid "+SOURCE_META[s.key].color+"33"}}>
                  <span style={{fontSize:20}}>{s.icon}</span>
                  <span style={{fontWeight:700,fontSize:11}}>{s.label}</span>
                  <span style={{fontSize:10,opacity:.7}}>{s.hint}</span>
                </button>
              ))}
            </div>
          )}

          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div>
              <label style={{fontSize:11,fontWeight:700,display:"block",marginBottom:4}}>Titolo</label>
              <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Es. Brand Book v2, QBR Q4..." style={{...inp,fontSize:13}} />
            </div>
            <div>
              <label style={{fontSize:11,fontWeight:700,display:"block",marginBottom:4}}>Categoria</label>
              <select value={cat} onChange={e => setCat(e.target.value)} style={{...inp,fontSize:13}}>
                {Object.entries(DOC_CAT).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>

            {mode==="link" && (
              <div>
                <label style={{fontSize:11,fontWeight:700,display:"block",marginBottom:4}}>
                  URL — {SOURCE_META[detectSource(url)].icon} {SOURCE_META[detectSource(url)].label}
                </label>
                <input value={url} onChange={e => setUrl(e.target.value)}
                  placeholder="https://paper.dropbox.com/... oppure https://drive.google.com/..."
                  style={{...inp,fontSize:12}} />
                {url && detectSource(url) !== "link" && (
                  <div style={{marginTop:5,fontSize:11,color:C.verde,fontWeight:700}}>
                    ✓ Rilevato: {SOURCE_META[detectSource(url)].label}
                  </div>
                )}
              </div>
            )}

            {mode==="interno" && (
              <div>
                <label style={{fontSize:11,fontWeight:700,display:"block",marginBottom:4}}>Contenuto</label>
                <textarea
                  value={contenuto}
                  onChange={e => setContenuto(e.target.value)}
                  rows={12}
                  placeholder={"Scrivi il documento qui.\n\n# Titolo sezione\nTesto della sezione...\n\n## Sottotitolo\n- Punto 1\n- Punto 2"}
                  style={{...inp,fontSize:13,fontFamily:"monospace",lineHeight:1.6,resize:"vertical"}}
                />
                <div style={{fontSize:10,color:C.muted,marginTop:4}}>Usa # per titoli, ## per sottotitoli, - per liste</div>
              </div>
            )}
          </div>

          <div style={{display:"flex",gap:10,marginTop:14}}>
            <button onClick={() => {setMode(null);setEditDoc(null);}}
              style={{flex:1,border:"1px solid "+C.border,background:C.white,borderRadius:6,padding:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>
              Annulla
            </button>
            <button onClick={save} disabled={!nome}
              style={{flex:1,background:C.verde,color:"#fff",border:"none",borderRadius:6,padding:10,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:FONT,opacity:!nome?0.5:1}}>
              {editDoc ? "Aggiorna" : "Salva documento"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  ADMIN EDIT                                                  */
/* ─────────────────────────────────────────────────────────── */
function AdminEdit({ slug }) {
  const [cliente,  setCliente]  = useState(null);
  const [progress, setProgress] = useState({});
  const [feed,     setFeed]     = useState([]);
  const [docs,     setDocs]     = useState([]);
  const [ped,      setPed]      = useState([]);
  const [kpi,      setKpi]      = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [tab,      setTab]      = useState("info");
  const [mesePed,  setMesePed]  = useState("2026-11");
  const [meseKpi,  setMeseKpi]  = useState("2026-10");

  useEffect(() => {
    (async () => {
      const [c, p, f, d] = await Promise.all([
        store.get("clients:"+slug), store.get("clients:"+slug+":progress"),
        store.get("clients:"+slug+":feed"), store.get("clients:"+slug+":docs"),
      ]);
      setCliente(c||{slug,nome:"",pacchetto:"professional"});
      setProgress(p||{}); setFeed(f||[]); setDocs(d||[]);
      setLoading(false);
    })();
  }, [slug]);

  useEffect(() => { store.get("clients:"+slug+":ped:"+mesePed).then(p => setPed(p||[])); }, [slug, mesePed]);
  useEffect(() => { store.get("clients:"+slug+":kpi:"+meseKpi).then(k => setKpi(k||null)); }, [slug, meseKpi]);

  async function save() {
    setSaving(true);
    await Promise.all([
      store.set("clients:"+slug, cliente),
      store.set("clients:"+slug+":progress", progress),
      store.set("clients:"+slug+":feed", feed),
      store.set("clients:"+slug+":docs", docs),
      store.set("clients:"+slug+":ped:"+mesePed, ped),
    ]);
    if (kpi) await store.set("clients:"+slug+":kpi:"+meseKpi, kpi);
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  function updModulo(fId, mId, stato) {
    setProgress(prev => {
      const np = {...prev};
      if (!np[fId]) np[fId] = {percentuale:0, moduli:{}};
      np[fId] = {...np[fId], moduli:{...np[fId].moduli,[mId]:stato}};
      const fase = FASI.find(f => f.id===fId);
      if (fase) {
        const tot  = fase.moduli.length;
        const done = fase.moduli.filter(m => np[fId].moduli[m.id]==="completo").length;
        np[fId].percentuale = Math.round(done/tot*100);
      }
      return np;
    });
  }

  function addPost() { setFeed(p => [...p, {id:"p"+Date.now(),colori:POST_COLORS[p.length%POST_COLORS.length],titolo:"Nuovo post",caption:"",data:new Date().toISOString().split("T")[0],piattaforma:"instagram",stato:"bozza"}]); }
  function updPost(id, f, v) { setFeed(p => p.map(x => x.id===id?{...x,[f]:v}:x)); }
  function delPost(id) { setFeed(p => p.filter(x => x.id!==id)); }
  function addDoc() { setDocs(p => [...p, {id:"d"+Date.now(),nome:"Nuovo documento",categoria:"brand",data:new Date().toISOString().split("T")[0],dimensione:"0 KB",url:"#"}]); }
  function updDoc(id, f, v) { setDocs(p => p.map(x => x.id===id?{...x,[f]:v}:x)); }
  function delDoc(id) { setDocs(p => p.filter(x => x.id!==id)); }
  function addPed() { setPed(p => [...p, {id:"ped"+Date.now(),data:mesePed+"-01",piattaforma:"instagram",titolo:"Nuovo post",stato:"idea"}]); }
  function updPed(id, f, v) { setPed(p => p.map(x => x.id===id?{...x,[f]:v}:x)); }
  function delPed(id) { setPed(p => p.filter(x => x.id!==id)); }

  const TABS = [{id:"info",label:"Info"},{id:"progress",label:"Progresso"},{id:"feed",label:"Feed"},{id:"ped",label:"Calendario"},{id:"docs",label:"Documenti"},{id:"kpi",label:"KPI"}];
  const inp = {width:"100%",boxSizing:"border-box",border:"1px solid "+C.border,borderRadius:6,padding:"8px 12px",fontSize:14,fontFamily:FONT};
  const lbl = {fontSize:12,fontWeight:700,display:"block",marginBottom:4};

  if (loading) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><Spinner /></div>;

  return (
    <div style={{minHeight:"100vh",background:C.sfondo,fontFamily:FONT,color:C.testo}}>
      <div style={{background:C.white,borderBottom:"1px solid "+C.border,padding:"10px 16px",display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:100}}>
        <button onClick={() => nav("/admin")} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:4,color:C.muted,fontSize:13,fontFamily:FONT}}>
          <ArrowLeft size={15} /> Dashboard
        </button>
        <div style={{flex:1,fontWeight:700,fontSize:15}}>{cliente?.nome||slug}</div>
        <button onClick={() => nav("/c/"+slug)} style={{background:"none",border:"1px solid "+C.border,borderRadius:6,padding:"6px 10px",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontFamily:FONT,color:C.testo}}>
          <Eye size={13} /> Preview
        </button>
        <button onClick={save} disabled={saving}
          style={{background:saved?"#27AE60":C.verde,color:"#fff",border:"none",borderRadius:6,padding:"8px 14px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:FONT}}>
          {saved && <Check size={13} />}
          {saving?"Salvataggio...":saved?"Salvato!":"Salva"}
        </button>
      </div>
      <div style={{background:C.white,borderBottom:"1px solid "+C.border,display:"flex",overflowX:"auto"}}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{padding:"11px 16px",fontSize:12,fontWeight:700,border:"none",background:"none",cursor:"pointer",fontFamily:FONT,
              color:tab===t.id?C.verde:C.muted,borderBottom:"2px solid "+(tab===t.id?C.verde:"transparent"),whiteSpace:"nowrap",flexShrink:0}}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{maxWidth:700,margin:"0 auto",padding:20}}>

        {tab==="info" && cliente && (
          <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:8,padding:20}}>
            <p style={{margin:"0 0 18px",fontSize:14,fontWeight:700}}>Dati cliente</p>
            <div style={{display:"flex",flexDirection:"column",gap:13}}>
              <div><label style={lbl}>Nome cliente</label><input style={inp} value={cliente.nome||""} onChange={e => setCliente(p=>({...p,nome:e.target.value}))} /></div>
              <div><label style={lbl}>Settore</label><input style={inp} value={cliente.settore||""} onChange={e => setCliente(p=>({...p,settore:e.target.value}))} /></div>
              <div><label style={lbl}>Referente</label><input style={inp} value={cliente.referente||""} onChange={e => setCliente(p=>({...p,referente:e.target.value}))} /></div>
              <div><label style={lbl}>Email</label><input style={inp} type="email" value={cliente.email||""} onChange={e => setCliente(p=>({...p,email:e.target.value}))} /></div>
              <div>
                <label style={lbl}>Pacchetto</label>
                <select style={inp} value={cliente.pacchetto||"professional"} onChange={e => setCliente(p=>({...p,pacchetto:e.target.value}))}>
                  {Object.entries(PACCHETTI).map(([k, v]) => <option key={k} value={k}>{v.label} — €{v.prezzo}/mese</option>)}
                </select>
              </div>
              <div><label style={lbl}>Data inizio</label><input style={inp} type="date" value={cliente.dataInizio||""} onChange={e => setCliente(p=>({...p,dataInizio:e.target.value}))} /></div>
              <div style={{marginTop:6,padding:12,background:C.sfondo,borderRadius:6}}>
                <p style={{margin:"0 0 4px",fontSize:11,fontWeight:700,color:C.muted}}>URL CLIENTE</p>
                <code style={{fontSize:13,color:C.verde}}>{"#/c/"+slug}</code>
              </div>
            </div>
          </div>
        )}

        {tab==="progress" && (
          <div>
            <p style={{fontSize:12,color:C.muted,marginBottom:14}}>Modifica lo stato dei moduli. Le % si aggiornano automaticamente.</p>
            <ProgressSection progress={progress} isAdmin={true} onEdit={updModulo} />
          </div>
        )}

        {tab==="feed" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <span style={{fontSize:13,fontWeight:700}}>Post nel feed ({feed.length})</span>
              <button onClick={addPost} style={{background:C.verde,color:"#fff",border:"none",borderRadius:6,padding:"7px 12px",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontFamily:FONT}}>
                <Plus size={13} /> Aggiungi
              </button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {feed.map((post, i) => (
                <div key={post.id} style={{background:C.white,border:"1px solid "+C.border,borderRadius:8,padding:14}}>
                  <div style={{display:"flex",gap:12,marginBottom:10}}>
                    <div style={{width:56,height:56,borderRadius:6,background:"linear-gradient(135deg,"+(post.colori?.[0]||"#333")+","+(post.colori?.[1]||"#666")+")",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{color:"rgba(255,255,255,.6)",fontSize:11,fontWeight:700}}>#{i+1}</span>
                    </div>
                    <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
                      <input value={post.titolo} onChange={e => updPost(post.id,"titolo",e.target.value)} style={{...inp,fontSize:13,fontWeight:700}} placeholder="Titolo" />
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                        <select value={post.piattaforma} onChange={e => updPost(post.id,"piattaforma",e.target.value)} style={{flex:"1 1 90px",border:"1px solid "+C.border,borderRadius:6,padding:"5px 7px",fontSize:12,fontFamily:FONT}}>
                          {Object.entries(PIATTAFORME).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                        <select value={post.stato} onChange={e => updPost(post.id,"stato",e.target.value)} style={{flex:"1 1 90px",border:"1px solid "+C.border,borderRadius:6,padding:"5px 7px",fontSize:12,fontFamily:FONT}}>
                          <option value="bozza">Bozza</option>
                          <option value="approvato">Approvato</option>
                          <option value="pubblicato">Pubblicato</option>
                        </select>
                        <input type="date" value={post.data} onChange={e => updPost(post.id,"data",e.target.value)} style={{flex:"1 1 110px",border:"1px solid "+C.border,borderRadius:6,padding:"5px 7px",fontSize:12,fontFamily:FONT}} />
                      </div>
                    </div>
                    <button onClick={() => delPost(post.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.magenta,flexShrink:0}}><Trash2 size={15} /></button>
                  </div>
                  <textarea value={post.caption} onChange={e => updPost(post.id,"caption",e.target.value)} rows={3} placeholder="Caption..." style={{...inp,resize:"vertical",fontSize:12,marginBottom:6}} />
                  <input value={post.immagineUrl||""} onChange={e => updPost(post.id,"immagineUrl",e.target.value)} placeholder="URL immagine (https://...)" style={{...inp,fontSize:12}} />
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="ped" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <input type="month" value={mesePed} onChange={e => setMesePed(e.target.value)} style={{border:"1px solid "+C.border,borderRadius:6,padding:"6px 12px",fontSize:14,fontFamily:FONT}} />
              <button onClick={addPed} style={{background:C.verde,color:"#fff",border:"none",borderRadius:6,padding:"7px 12px",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontFamily:FONT}}>
                <Plus size={13} /> Aggiungi
              </button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {ped.map(entry => (
                <div key={entry.id} style={{background:C.white,border:"1px solid "+C.border,borderRadius:8,padding:11,display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
                  <input type="date" value={entry.data} onChange={e => updPed(entry.id,"data",e.target.value)} style={{border:"1px solid "+C.border,borderRadius:6,padding:"5px 7px",fontSize:12,fontFamily:FONT,flex:"1 1 120px"}} />
                  <input value={entry.titolo} onChange={e => updPed(entry.id,"titolo",e.target.value)} placeholder="Titolo" style={{border:"1px solid "+C.border,borderRadius:6,padding:"5px 7px",fontSize:12,fontFamily:FONT,flex:"2 1 140px"}} />
                  <select value={entry.piattaforma} onChange={e => updPed(entry.id,"piattaforma",e.target.value)} style={{border:"1px solid "+C.border,borderRadius:6,padding:"5px 7px",fontSize:12,fontFamily:FONT,flex:"1 1 90px"}}>
                    {Object.entries(PIATTAFORME).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                  <select value={entry.stato} onChange={e => updPed(entry.id,"stato",e.target.value)} style={{border:"1px solid "+C.border,borderRadius:6,padding:"5px 7px",fontSize:12,fontFamily:FONT,flex:"1 1 90px"}}>
                    <option value="idea">💡 Idea</option>
                    <option value="brief">📝 Brief</option>
                    <option value="produzione">✏️ Produzione</option>
                    <option value="semaforo">🚦 Semaforo</option>
                    <option value="pubblicato">✅ Pubblicato</option>
                  </select>
                  <button onClick={() => delPed(entry.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.magenta}}><Trash2 size={14} /></button>
                </div>
              ))}
              {!ped.length && <div style={{textAlign:"center",padding:28,color:C.muted,fontSize:14}}>Nessun post per questo mese</div>}
            </div>
          </div>
        )}

        {tab==="docs" && (
          <DocTabAdmin docs={docs} setDocs={setDocs} inp={inp} />
        )}

        {tab==="kpi" && (
          <div>
            <div style={{marginBottom:14}}>
              <label style={lbl}>Mese</label>
              <input type="month" value={meseKpi} onChange={e => setMeseKpi(e.target.value)} style={{...inp,maxWidth:200}} />
            </div>
            <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:8,padding:18,marginBottom:12}}>
              <p style={{margin:"0 0 14px",fontSize:13,fontWeight:700}}>Metriche principali</p>
              {[{key:"reach",label:"Reach totale",ph:"45000"},{key:"engagement",label:"Engagement rate (%)",ph:"4.2"},{key:"lead",label:"Lead generati",ph:"28"}].map(f => (
                <div key={f.key} style={{marginBottom:10}}>
                  <label style={lbl}>{f.label}</label>
                  <input type="number" value={kpi?.[f.key]||""} placeholder={f.ph} style={inp}
                    onChange={e => setKpi(p => ({...(p||{}),[f.key]:parseFloat(e.target.value)||0}))} />
                </div>
              ))}
            </div>
            <div style={{background:C.white,border:"1px solid "+C.border,borderRadius:8,padding:18}}>
              <p style={{margin:"0 0 4px",fontSize:13,fontWeight:700}}>Top contenuti</p>
              <p style={{margin:"0 0 14px",fontSize:11,color:C.muted}}>Inserisci i 5 migliori del mese</p>
              {[0,1,2,3,4].map(i => {
                const item = (kpi?.topContent && kpi.topContent[i]) || {};
                return (
                  <div key={i} style={{display:"flex",gap:7,marginBottom:7,alignItems:"center"}}>
                    <span style={{fontSize:11,color:C.muted,width:18,flexShrink:0}}>#{i+1}</span>
                    <input value={item.titolo||""} placeholder="Titolo contenuto"
                      style={{flex:2,border:"1px solid "+C.border,borderRadius:6,padding:"5px 7px",fontSize:12,fontFamily:FONT}}
                      onChange={e => setKpi(p => { const t=[...((p?.topContent)||[{},{},{},{},{}])]; t[i]={...t[i],titolo:e.target.value}; return {...(p||{}),topContent:t}; })} />
                    <input type="number" value={item.reach||""} placeholder="Reach"
                      style={{flex:1,border:"1px solid "+C.border,borderRadius:6,padding:"5px 7px",fontSize:12,fontFamily:FONT}}
                      onChange={e => setKpi(p => { const t=[...((p?.topContent)||[{},{},{},{},{}])]; t[i]={...t[i],reach:parseInt(e.target.value)||0}; return {...(p||{}),topContent:t}; })} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────── */
/*  APP                                                         */
/* ─────────────────────────────────────────────────────────── */
export default function App() {
  const [route, setRoute] = useState(getRoute());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seed().then(() => setReady(true));
    function onHash() { setRoute(getRoute()); }
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (!ready) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.sfondo,fontFamily:FONT}}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{textAlign:"center"}}>
          <div style={{fontWeight:800,fontSize:17,color:C.verde,marginBottom:12}}>NASSA STUDIO</div>
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} *{box-sizing:border-box;} body{margin:0;}`}</style>
      {route.mode==="client" && <ClientView slug={route.slug} />}
      {route.mode==="admin" && route.slug && <AdminEdit slug={route.slug} />}
      {route.mode==="admin" && !route.slug && <AdminList />}
    </>
  );
}
