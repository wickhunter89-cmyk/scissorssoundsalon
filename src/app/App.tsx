import { useState, useEffect, useRef } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

// ── Salon photos ───────────────────────────────────────────
import imgArtist from "@/imports/scissor-sound-01.jpg";
import imgG1 from "@/imports/scissor-sound-02.jpg";
import imgG2 from "@/imports/scissor-sound-03.jpg";
import imgG3 from "@/imports/scissor-sound-04.jpg";
import imgG4 from "@/imports/scissor-sound-01.jpg";
import imgG5 from "@/imports/scissor-sound-02.jpg";

// ── scroll-reveal hook ───────────────────────────────────────
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); io.disconnect(); }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, on };
}

type RevealFrom = "bottom" | "left" | "right" | "scale";
function Reveal({ children, className = "", delay = 0, from = "bottom" as RevealFrom }: {
  children: React.ReactNode; className?: string; delay?: number; from?: RevealFrom;
}) {
  const { ref, on } = useReveal();
  const initial =
    from === "left"  ? "translateX(-52px)" :
    from === "right" ? "translateX(52px)"  :
    from === "scale" ? "scale(0.9)"        : "translateY(46px)";
  return (
    <div ref={ref} className={className} style={{
      opacity: on ? 1 : 0,
      transform: on ? "none" : initial,
      transition: `opacity 0.82s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.82s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    }}>{children}</div>
  );
}

// ── 3-D sphere ───────────────────────────────────────────────
function Ball({ s, x, y, d, dur, o }: { s:number; x:number; y:number; d:number; dur:number; o:number }) {
  return (
    <div style={{
      position:"absolute", width:s, height:s, left:`${x}%`, top:`${y}%`,
      borderRadius:"50%", opacity:o, pointerEvents:"none",
      background:"radial-gradient(circle at 32% 30%, rgba(255,255,255,0.96) 0%, rgba(225,211,166,0.9) 18%, rgba(183,134,47,0.78) 48%, rgba(111,83,34,0.86) 78%, rgba(45,42,32,0.96) 100%)",
      boxShadow:`0 ${s*.12}px ${s*.35}px rgba(111,83,34,0.45), inset 0 -${s*.08}px ${s*.18}px rgba(0,0,0,0.22), inset ${s*.06}px ${s*.06}px ${s*.18}px rgba(255,255,255,0.68)`,
      animation:`ballDrift ${dur}s ease-in-out ${d}s infinite`,
    }} />
  );
}

const BALLS = [
  { s:88,  x:3,  y:8,  d:0,   dur:8,   o:.27 },
  { s:42,  x:87, y:4,  d:1.5, dur:10,  o:.31 },
  { s:125, x:78, y:18, d:0.4, dur:12,  o:.17 },
  { s:56,  x:18, y:62, d:2.2, dur:9,   o:.25 },
  { s:32,  x:52, y:82, d:3,   dur:7,   o:.33 },
  { s:98,  x:93, y:58, d:0.8, dur:11,  o:.19 },
  { s:60,  x:38, y:28, d:4.1, dur:9.5, o:.21 },
  { s:22,  x:67, y:52, d:0.6, dur:8,   o:.37 },
  { s:74,  x:9,  y:84, d:2.8, dur:10,  o:.23 },
  { s:46,  x:81, y:90, d:1.3, dur:8.5, o:.29 },
  { s:28,  x:55, y:14, d:3.6, dur:7,   o:.35 },
  { s:108, x:2,  y:44, d:0.2, dur:13,  o:.13 },
];

// ── stars ────────────────────────────────────────────────────
function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-px">
      {Array.from({ length: 5 }).map((_,i) => (
        <svg key={i} className="w-[14px] h-[14px]" fill={i < n ? "#d4a055" : "#e8cfe0"} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

// ── gradient-border card ─────────────────────────────────────
function GCard({ children, className = "", gold = false, style: extraStyle = {} }: {
  children: React.ReactNode; className?: string; gold?: boolean; style?: React.CSSProperties;
}) {
  const border = gold
    ? "linear-gradient(135deg,#e8d08a,#c9a058,#f0dfa0,#c9a058)"
    : "linear-gradient(135deg,#d8c08a,rgba(183,134,47,0.4),#d8c08a,rgba(183,134,47,0.2))";
  return (
    <div className={className} style={{
      background:`linear-gradient(rgba(255,255,255,0.7),rgba(255,255,255,0.7)) padding-box, ${border} border-box`,
      border:"1px solid transparent",
      backdropFilter:"blur(18px)",
      boxShadow:"0 8px 40px rgba(111,83,34,0.09), 0 2px 8px rgba(111,83,34,0.05)",
      ...extraStyle,
    }}>{children}</div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-[10px] font-semibold tracking-[0.22em] uppercase" style={{
      background:"linear-gradient(rgba(255,253,248,0.85),rgba(255,253,248,0.85)) padding-box, linear-gradient(135deg,#d8c08a,#b7862f,#d8c08a) border-box",
      border:"1px solid transparent", color:"#6f5322",
    }}>
      <span style={{width:5,height:5,borderRadius:"50%",background:"#b7862f",display:"inline-block"}} />
      {label}
      <span style={{width:5,height:5,borderRadius:"50%",background:"#b7862f",display:"inline-block"}} />
    </div>
  );
}

function Divider() {
  return <div style={{height:1,maxWidth:460,margin:"0 auto",background:"linear-gradient(90deg,transparent,rgba(183,134,47,0.28),transparent)"}} />;
}

// ── Data ─────────────────────────────────────────────────────
const GALLERY_PHOTOS = [imgArtist, imgG1, imgG2, imgG3];
const GALLERY_ALTS = [
  "Scissor Sound Unisex Luxury Salon — bridal makeup look",
  "Scissor Sound Unisex Luxury Salon — bridal styling",
  "Scissor Sound Unisex Luxury Salon — bridal portrait",
  "Scissor Sound Unisex Luxury Salon — luxury bridal look",
];

const REVIEWS = [
  { name:"Priya Sharma",     occasion:"Bride · Dec 2024",          stars:5, quote:"Our artist transformed me into the most beautiful version of myself. I cried seeing my reflection — happy tears! Every single guest complimented my makeup all evening long." },
  { name:"Neha Kapoor",      occasion:"Bride · Feb 2025",          stars:5, quote:"I had tried 3 other artists before my sister found Scissor Sound Unisex Luxury Salon. The difference is night and day. Flawless skin, long-lasting, and absolutely breathtaking." },
  { name:"Simran Kaur",      occasion:"Engagement · Nov 2024",     stars:5, quote:"My engagement makeup was so perfect that people thought I was a model. He understood my skin tone and crafted a look I never imagined for myself." },
  { name:"Manpreet Gill",    occasion:"Family Package · Jan 2025", stars:5, quote:"Professional, talented, and incredibly kind. He made my whole family comfortable and the results were stunning. Forever grateful for this magical day." },
  { name:"Ritu Verma",       occasion:"Bride · Mar 2025",          stars:5, quote:"My bridal makeup lasted from morning pheras all the way to the evening reception without any touch-up. Absolutely magical, long-lasting artistry." },
  { name:"Amandeep Dhillon", occasion:"Party Makeup · Apr 2025",   stars:5, quote:"Booked for my cousin's wedding and the whole family was amazed. Even my mother-in-law could not stop complimenting. Exceptional artistry and care." },
];

const SCROLL_CARDS = [
  { name:"Harpreet B.",    text:"Magic in his hands. My dulhan look was everything I dreamed of!" },
  { name:"Dr. Ananya M.", text:"Radiant without feeling heavy — perfect for my big day!" },
  { name:"Komal A.",       text:"He understood my vision better than I did. Loved every bit!" },
  { name:"Sunita V.",      text:"The trial session gave me so much confidence going in." },
  { name:"Divya R.",       text:"Stunning bridal work. A solid 10 out of 10, no second thoughts!" },
  { name:"Jaspreet M.",    text:"Everyone kept asking who did my makeup. Referrals keep coming!" },
  { name:"Pooja D.",       text:"Best decision I made for my whole wedding." },
  { name:"Ritika S.",      text:"Absolutely loved my engagement look. So so glam!" },
];

const FAQS = [
  { q:"How far in advance should I book?",      a:"We recommend booking 3–6 months before your wedding, especially during peak season (Oct–Feb). Contact us early to secure your preferred date." },
  { q:"Do you offer a trial session?",          a:"Absolutely — a pre-bridal trial is highly recommended. We finalise your look, test products on your skin, and ensure you're 100% happy before the big day." },
  { q:"What brands do you use?",                a:"Only premium international brands: MAC, KRYOLAN, HUDA BEAUTY, NARS, CHARLOTTE TILBURY, and more. All skin-safe, tested, and long-lasting." },
  { q:"Do you travel outside Rehan?",        a:"Yes! We cover all of Himachal Pradesh and neighbouring states. Travel charges apply for locations outside Rehan city limits." },
  { q:"How long does bridal makeup take?",      a:"A full bridal look takes 2.5–4 hours depending on complexity. We recommend starting early for a relaxed, stress-free experience." },
  { q:"Do you also do hairstyling?",            a:"Yes — complete bridal packages include makeup, hairstyling, draping, and skin prep sessions. Ask about our all-inclusive packages." },
];

const PRICE_TABS = ["💄 Party", "💍 Engagement", "🌼 Haldi / Mehndi", "👰 Bridal"] as const;
type PriceTab = typeof PRICE_TABS[number];
const PRICES: Record<PriceTab, { label:string; price:string }[]> = {
  "💄 Party": [
    { label:"Basic Makeup",     price:"₹2,000" },
    { label:"HD Makeup",        price:"₹3,500" },
    { label:"Airbrush Makeup",  price:"₹4,500" },
    { label:"Signature Makeup", price:"₹7,000" },
  ],
  "💍 Engagement": [
    { label:"Basic Makeup",     price:"₹5,000"  },
    { label:"HD Makeup",        price:"₹10,000" },
    { label:"Signature Makeup", price:"₹15,000" },
  ],
  "🌼 Haldi / Mehndi": [
    { label:"Basic Makeup", price:"₹3,000" },
    { label:"HD Makeup",    price:"₹5,000" },
  ],
  "👰 Bridal": [
    { label:"Basic Bridal",     price:"₹15,000" },
    { label:"HD Bridal",        price:"₹23,000" },
    { label:"Signature Bridal", price:"₹40,000" },
    { label:"Airbrush / Radiant Bridal Makeup", price:"₹30,000" },
  ],
};

const NAV = ["Home","Services","Gallery","Reviews","Appointment","FAQ","Contact"];

// ════════════════════════════════════════════════════════════
export default function App() {
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [lightbox,  setLightbox]  = useState<number|null>(null);
  const [activeFaq, setActiveFaq] = useState<number|null>(null);
  const [priceTab,  setPriceTab]  = useState<PriceTab>("💄 Party");
  const [form,      setForm]      = useState({ name:"", phone:"", date:"", service:"", msg:"" });
  const [sent,      setSent]      = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape")     setLightbox(null);
      if (e.key === "ArrowLeft")  setLightbox(p => p !== null ? Math.max(0, p - 1) : null);
      if (e.key === "ArrowRight") setLightbox(p => p !== null ? Math.min(GALLERY_PHOTOS.length - 1, p + 1) : null);
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [lightbox]);

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4500);
    setForm({ name:"", phone:"", date:"", service:"", msg:"" });
  };

  // icon SVGs
  const WaIcon = () => (
    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.934 1.397 5.61L0 24l6.545-1.376A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.045-1.393l-.361-.215-3.883.816.818-3.774-.235-.376A9.818 9.818 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/>
    </svg>
  );
  const IgIcon = ({ cls = "w-5 h-5" }: { cls?: string }) => (
    <svg className={`${cls} text-white`} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ fontFamily:"'Jost',sans-serif", background:"#fbf8f1" }}>

      {/* ── GLOBAL CSS ── */}
      <style>{`
        @keyframes ballDrift {
          0%   { transform:translateY(0) rotateX(0deg) rotateY(0deg); }
          30%  { transform:translateY(-22px) rotateX(18deg) rotateY(22deg); }
          65%  { transform:translateY(-10px) rotateX(-12deg) rotateY(-16deg); }
          100% { transform:translateY(0) rotateX(0deg) rotateY(0deg); }
        }
        @keyframes blob1 { 0%,100%{ transform:translate(0,0) scale(1); } 40%{ transform:translate(40px,-28px) scale(1.08); } 70%{ transform:translate(-18px,22px) scale(0.94); } }
        @keyframes blob2 { 0%,100%{ transform:translate(0,0) scale(1); } 35%{ transform:translate(-32px,18px) scale(1.06); } 70%{ transform:translate(22px,-14px) scale(0.96); } }
        @keyframes blob3 { 0%,100%{ transform:translate(0,0) scale(1); } 45%{ transform:translate(18px,30px) scale(1.1); } 80%{ transform:translate(-14px,-18px) scale(0.93); } }
        @keyframes gradShift { 0%,100%{ background-position:0% 50%; } 50%{ background-position:100% 50%; } }
        @keyframes ringRot { from{ transform:translate(-50%,-50%) rotate(0deg); } to{ transform:translate(-50%,-50%) rotate(360deg); } }
        @keyframes heroPulse { 0%,100%{ box-shadow:0 0 60px rgba(183,134,47,0.28),0 0 120px rgba(216,192,138,0.14); } 50%{ box-shadow:0 0 90px rgba(183,134,47,0.44),0 0 160px rgba(216,192,138,0.24); } }
        @keyframes fadeUp { from{ opacity:0; transform:translateY(30px); } to{ opacity:1; transform:none; } }
        @keyframes marqueeRun { from{ transform:translateX(0); } to{ transform:translateX(-50%); } }
        @keyframes shimBtn { 0%{ background-position:-200% center; } 100%{ background-position:200% center; } }
        @keyframes spinSlow { from{ transform:rotate(0deg); } to{ transform:rotate(360deg); } }
        @keyframes goldPulse { 0%,100%{ opacity:.7; } 50%{ opacity:1; } }
        .h1{ animation:fadeUp .85s cubic-bezier(.22,1,.36,1) .1s  both; }
        .h2{ animation:fadeUp .85s cubic-bezier(.22,1,.36,1) .3s  both; }
        .h3{ animation:fadeUp .85s cubic-bezier(.22,1,.36,1) .48s both; }
        .h4{ animation:fadeUp .85s cubic-bezier(.22,1,.36,1) .62s both; }
        .hImg{ animation:fadeUp .85s cubic-bezier(.22,1,.36,1) .2s both; }
        .btn-shim{
          background:linear-gradient(90deg,#6b5224,#9b742f,#c7a55a,#d8c08a,#c7a55a,#9b742f,#6b5224);
          background-size:200% auto;
          animation:shimBtn 4s linear infinite;
        }
        .gal-item{ transition:transform .4s cubic-bezier(.22,1,.36,1),box-shadow .4s ease; cursor:pointer; }
        .gal-item:hover{ transform:scale(1.04) translateY(-6px); }
        .svc-card{ transition:transform .4s ease,box-shadow .4s ease; }
        .svc-card:hover{ transform:perspective(700px) rotateY(-5deg) rotateX(3deg) translateY(-8px); }
        .marquee-track{ animation:marqueeRun 36s linear infinite; }
        .marquee-track:hover{ animation-play-state:paused; }
        .price-row:hover{ background:rgba(183,134,47,0.05) !important; }
        html{scroll-behavior:smooth;}\n        ::-webkit-scrollbar{ width:5px; }
        ::-webkit-scrollbar-thumb{ background:#d8c08a; border-radius:4px; }
        ::-webkit-scrollbar-track{ background:#fbf8f1; }
      `}</style>

      {/* ── FIXED BACKGROUND ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{zIndex:0}}>
        <div style={{position:"absolute",width:520,height:520,top:"-80px",right:"-60px",borderRadius:"50%",background:"radial-gradient(circle,rgba(216,192,138,0.22) 0%,transparent 72%)",filter:"blur(55px)",animation:"blob1 14s ease-in-out infinite"}} />
        <div style={{position:"absolute",width:600,height:600,bottom:"-100px",left:"-80px",borderRadius:"50%",background:"radial-gradient(circle,rgba(183,134,47,0.14) 0%,transparent 70%)",filter:"blur(60px)",animation:"blob2 18s ease-in-out infinite"}} />
        <div style={{position:"absolute",width:400,height:400,top:"45%",left:"42%",transform:"translate(-50%,-50%)",borderRadius:"50%",background:"radial-gradient(circle,rgba(239,231,214,0.3) 0%,transparent 75%)",filter:"blur(48px)",animation:"blob3 12s ease-in-out infinite"}} />
        <div style={{position:"absolute",width:340,height:340,top:"25%",left:"-40px",borderRadius:"50%",background:"radial-gradient(circle,rgba(216,192,138,0.16) 0%,transparent 70%)",filter:"blur(55px)",animation:"blob1 22s ease-in-out 4s infinite"}} />
        {BALLS.map((b,i) => <Ball key={i} {...b} />)}
      </div>

      {/* ════ NAVBAR ════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500" style={{
        background: scrolled ? "rgba(255,253,248,0.9)" : "rgba(255,253,248,0.45)",
        backdropFilter:"blur(24px)",
        borderBottom: scrolled ? "1px solid rgba(183,134,47,0.1)" : "none",
        boxShadow: scrolled ? "0 4px 30px rgba(111,83,34,0.07)" : "none",
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-[68px] sm:h-[76px]">
          <a href="#home" className="flex flex-col leading-none">
            <span style={{fontFamily:"'Great Vibes',cursive",fontSize:"1.75rem",color:"#6f5322",lineHeight:1}}>Scissor Sound Unisex Luxury Salon</span>
            <span style={{fontSize:"0.57rem",letterSpacing:"0.2em",color:"#6d675d",fontWeight:600,textTransform:"uppercase",lineHeight:1.9}}>Best Bridal Makeup Artist</span>
          </a>
          <div className="hidden lg:flex items-center gap-5 xl:gap-6">
            {NAV.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`}
                className="text-[12.5px] font-medium transition-colors hover:text-[#6f7c5d] relative group"
                style={{color:"#403c35",letterSpacing:"0.04em"}}>
                {l}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px group-hover:w-full transition-all duration-300" style={{background:"#b7862f"}} />
              </a>
            ))}
            <a href="tel:+919816460167"
              className="btn-shim ml-1 px-5 py-2.5 rounded-full text-white text-[12.5px] font-semibold hover:scale-105 hover:shadow-lg transition-all"
              style={{boxShadow:"0 4px 18px rgba(183,134,47,0.38)"}}>
              📞 Call Now
            </a>
          </div>
          <button onClick={() => setMenuOpen(m => !m)} className="lg:hidden w-10 h-10 flex flex-col justify-center gap-[5px]" aria-label="Menu">
            {[0,1,2].map(i => (
              <span key={i} className="block w-6 h-0.5 rounded transition-all duration-300 origin-center" style={{
                background:"#6f5322",
                transform: i===0&&menuOpen?"rotate(45deg) translate(5px,5px)":i===2&&menuOpen?"rotate(-45deg) translate(5px,-5px)":"",
                opacity: i===1&&menuOpen?0:1,
              }} />
            ))}
          </button>
        </div>
        <div style={{maxHeight:menuOpen?"420px":"0",overflow:"hidden",transition:"max-height 0.45s ease",background:"rgba(255,253,248,0.97)",backdropFilter:"blur(20px)"}}>
          <div className="px-5 py-4 flex flex-col gap-2 border-t" style={{borderColor:"rgba(183,134,47,0.1)"}}>
            {NAV.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                className="py-2.5 font-medium border-b text-[14px] transition-colors hover:text-[#6f7c5d]"
                style={{color:"#403c35",borderColor:"rgba(183,134,47,0.07)"}}>
                {l}
              </a>
            ))}
            <a href="tel:+919816460167" className="mt-2 py-3 rounded-2xl text-center text-white text-sm font-semibold btn-shim">📞 Call Now</a>
          </div>
        </div>
      </nav>

      {/* ════ HERO ════ */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden z-10">
        <div className="absolute inset-0 z-0" style={{background:"linear-gradient(145deg,#fffdf8 0%,#f4eddf 34%,#fbf8f1 62%,#efe8d9 100%)",backgroundSize:"200% 200%",animation:"gradShift 10s ease infinite"}} />
        <div style={{position:"absolute",width:680,height:680,borderRadius:"50%",border:"1px dashed rgba(183,134,47,0.1)",top:"50%",left:"60%",animation:"ringRot 40s linear infinite"}} />
        <div style={{position:"absolute",width:460,height:460,borderRadius:"50%",border:"1px solid rgba(216,192,138,0.18)",top:"50%",left:"60%",animation:"ringRot 25s linear infinite reverse"}} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full py-16">
          <div className="grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <div className="h1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-[10px] font-bold tracking-[0.24em] uppercase"
                style={{background:"rgba(111,83,34,0.07)",color:"#6f5322",border:"1px solid rgba(183,134,47,0.2)"}}>
                ✦ Rehan's Premium Unisex Salon ✦
              </div>
              <h1 className="h2 font-bold leading-[1.05] mb-5"
                style={{fontFamily:"'Fraunces',serif",fontSize:"clamp(2.4rem,5.5vw,4.1rem)",color:"#1d1b18"}}>
                Where Every
                <em className="not-italic block" style={{color:"#b7862f"}}>Bride Becomes</em>
                <span className="block" style={{fontStyle:"italic",fontWeight:300,fontSize:"0.88em",color:"#6f7c5d"}}>Unforgettable</span>
              </h1>
              <p className="h3 mb-8 max-w-lg mx-auto lg:mx-0 text-[15px] leading-[1.9]" style={{color:"#6d675d"}}>
                Scissor Sound Unisex Luxury Salon — a premium unisex salon experience in Rehan for hair, makeup, beauty and nails. Professional care, premium products, and personalised styling for everyone.
              </p>
              <div className="h4 flex flex-wrap gap-4 justify-center lg:justify-start">
                <a href="#appointment" className="btn-shim px-8 py-3.5 rounded-full text-white font-semibold text-[14px] hover:scale-105 hover:shadow-2xl transition-all" style={{boxShadow:"0 10px 30px rgba(183,134,47,0.42)"}}>
                  Book Appointment ✦
                </a>
                <a href="#gallery" className="px-8 py-3.5 rounded-full font-semibold text-[14px] border-2 hover:bg-[#f3efe5] transition-all" style={{borderColor:"#b7862f",color:"#b7862f"}}>
                  View Gallery →
                </a>
              </div>
              <div className="h4 mt-10 pt-8 flex gap-8 justify-center lg:justify-start" style={{borderTop:"1px solid rgba(183,134,47,0.1)"}}>
                {[["500+","Happy Brides"],["10+","Years"],["4.9★","Rating"]].map(([n,l]) => (
                  <div key={l}>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:"1.75rem",fontWeight:700,color:"#6f5322",lineHeight:1}}>{n}</div>
                    <div style={{fontSize:"0.68rem",color:"#6d675d",letterSpacing:"0.06em",marginTop:3}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center">
              <div className="hImg relative" style={{width:"min(400px,88vw)"}}>
                <div style={{position:"absolute",inset:"-20px",borderRadius:32,background:"radial-gradient(ellipse,rgba(183,134,47,0.22) 0%,transparent 72%)",filter:"blur(28px)",animation:"heroPulse 3.5s ease-in-out infinite"}} />
                <div style={{position:"absolute",inset:"-14px",borderRadius:30,border:"1px solid rgba(216,192,138,0.28)"}} />
                <div style={{position:"absolute",inset:"-7px",borderRadius:26,background:"linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0)) padding-box, linear-gradient(135deg,#d8c08a,rgba(183,134,47,0.3),#d8c08a) border-box",border:"1.5px solid transparent"}} />
                <div style={{borderRadius:22,overflow:"hidden",boxShadow:"0 30px 80px rgba(111,83,34,0.3),0 8px 24px rgba(0,0,0,0.08)"}}>
                  <ImageWithFallback src={imgArtist} alt="Scissor Sound Unisex Luxury Salon — lead unisex salon"
                    className="w-full object-cover object-top" style={{aspectRatio:"3/4"}} />
                </div>
                <div style={{position:"absolute",bottom:24,left:-20,background:"rgba(255,253,248,0.92)",backdropFilter:"blur(16px)",border:"1px solid rgba(216,192,138,0.5)",borderRadius:16,padding:"10px 16px",boxShadow:"0 8px 30px rgba(111,83,34,0.14)"}}>
                  <div style={{fontFamily:"'Great Vibes',cursive",fontSize:"1.15rem",color:"#6f5322",lineHeight:1}}>Scissor Sound Unisex Luxury Salon</div>
                  <div style={{fontSize:"0.6rem",color:"#6d675d",letterSpacing:"0.14em",marginTop:3}}>REHAN, HIMACHAL PRADESH</div>
                </div>
                <div style={{position:"absolute",top:20,right:-16,background:"linear-gradient(135deg,#c9a058,#e8d08a,#c9a058)",borderRadius:12,padding:"8px 14px",boxShadow:"0 6px 20px rgba(201,160,88,0.4)"}}>
                  <div style={{fontSize:"0.6rem",fontWeight:700,color:"#3a2000",letterSpacing:"0.12em"}}>⭐ TOP ARTIST</div>
                  <div style={{fontSize:"0.58rem",color:"rgba(58,32,0,0.7)",letterSpacing:"0.08em"}}>REHAN 2026</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════ TICKER ════ */}
      <div className="relative z-10 overflow-hidden py-4" style={{background:"linear-gradient(135deg,#1d1b18,#2d0a1a,#1d1b18)",borderTop:"1px solid rgba(183,134,47,0.2)",borderBottom:"1px solid rgba(183,134,47,0.2)"}}>
        <div className="marquee-track flex whitespace-nowrap" style={{width:"max-content"}}>
          {Array.from({length:6}).map((_,i) => (
            <span key={i} className="inline-flex items-center gap-6 px-6 text-[11px] font-semibold tracking-[0.22em] uppercase" style={{color:"rgba(216,192,138,0.8)"}}>
              <span style={{color:"#c9a058",fontSize:"0.8rem"}}>✦</span> Best Bridal Makeup Artist
              <span style={{color:"#c9a058",fontSize:"0.8rem"}}>✦</span> Scissor Sound Unisex Luxury Salon · Rehan
              <span style={{color:"#c9a058",fontSize:"0.8rem"}}>✦</span> Premium Products Only
              <span style={{color:"#c9a058",fontSize:"0.8rem"}}>✦</span> 500+ Happy Brides
            </span>
          ))}
        </div>
      </div>

      {/* ════ SERVICES + PRICING ════ */}
      <section id="services" className="relative z-10 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-16">
            <Badge label="Services & Pricing" />
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:"clamp(2rem,4vw,3rem)",fontWeight:700,color:"#1d1b18",lineHeight:1.1}}>
              Bridal Beauty, <em style={{color:"#b7862f",fontStyle:"italic"}}>Perfected</em>
            </h2>
            <p className="mt-4 max-w-md mx-auto text-[15px]" style={{color:"#6d675d"}}>
              Premium services for every occasion — from intimate haldi ceremonies to grand bridal looks.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
            {[
              { icon:"💍", label:"Bridal Makeup",    desc:"Timeless, luminous looks crafted to last from pheras to reception — perfect in every photo." },
              { icon:"✨", label:"HD & Airbrush",     desc:"Flawless camera-ready finish that glows beautifully under studio and natural lighting." },
              { icon:"🌸", label:"Party Makeup",      desc:"Glamorous looks tailored to your outfit, skin tone, and the vibe of every celebration." },
              { icon:"👨‍👩‍👧", label:"Family Package", desc:"Complete packages for bride, mother of bride, sisters & bridesmaids — all in one booking." },
              { icon:"🎭", label:"Engagement Glam",   desc:"Soft, radiant engagement looks that photograph beautifully and feel effortlessly you." },
              { icon:"🌙", label:"Pre-Bridal Prep",   desc:"Glow-prep skin sessions & trial makeup to perfect your look before the big day." },
            ].map((s,i) => (
              <Reveal key={s.label} delay={i*0.07}>
                <div className="svc-card rounded-2xl p-7 h-full flex flex-col" style={{
                  background:"linear-gradient(rgba(255,255,255,0.72),rgba(255,255,255,0.72)) padding-box, linear-gradient(135deg,#d8c08a,rgba(183,134,47,0.4),#d8c08a) border-box",
                  border:"1px solid transparent",backdropFilter:"blur(18px)",
                  boxShadow:"0 8px 40px rgba(111,83,34,0.09)",
                }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                    style={{background:"linear-gradient(135deg,rgba(239,231,214,0.9),rgba(216,192,138,0.5))"}}>
                    {s.icon}
                  </div>
                  <h3 className="font-bold text-[15px] mb-2" style={{fontFamily:"'Fraunces',serif",color:"#1d1b18"}}>{s.label}</h3>
                  <p className="text-[13px] leading-relaxed flex-1" style={{color:"#6d675d"}}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Pricing table */}
          <Reveal>
            <div className="rounded-3xl overflow-hidden" style={{
              background:"linear-gradient(rgba(255,255,255,0.8),rgba(255,255,255,0.8)) padding-box, linear-gradient(135deg,#e8d08a,#c9a058,#e8d08a) border-box",
              border:"1px solid transparent",backdropFilter:"blur(20px)",
              boxShadow:"0 20px 60px rgba(111,83,34,0.12)",
            }}>
              <div className="px-6 pt-8 pb-5 text-center" style={{background:"linear-gradient(135deg,rgba(22,8,18,0.97),rgba(45,10,26,0.97))"}}>
                <div style={{fontFamily:"'Great Vibes',cursive",fontSize:"1.8rem",color:"#d8c08a",lineHeight:1}}>Professional</div>
                <h3 className="mt-1 font-bold text-xl tracking-wide" style={{fontFamily:"'Fraunces',serif",color:"#fbf8f1"}}>MAKEUP PRICE LIST</h3>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[10px] tracking-widest" style={{color:"rgba(216,192,138,0.55)"}}>
                  <span>✨ Premium Products</span>
                  <span style={{color:"#c9a058"}}>✦</span>
                  <span>✨ Long Lasting Finish</span>
                  <span style={{color:"#c9a058"}}>✦</span>
                  <span>✨ Luxury Experience</span>
                </div>
              </div>

              <div className="flex overflow-x-auto scrollbar-none" style={{background:"rgba(22,8,18,0.9)"}}>
                {PRICE_TABS.map(tab => (
                  <button key={tab} onClick={() => setPriceTab(tab)}
                    className="flex-1 min-w-[110px] py-3.5 text-[12px] font-semibold tracking-wide transition-all whitespace-nowrap px-2 sm:px-3"
                    style={{
                      color: priceTab===tab ? "#1d1b18" : "rgba(216,192,138,0.5)",
                      background: priceTab===tab ? "linear-gradient(135deg,#c9a058,#e8d08a)" : "transparent",
                      borderBottom: priceTab===tab ? "none" : "1px solid rgba(216,192,138,0.07)",
                    }}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="px-4 sm:px-8 py-5 space-y-1">
                {PRICES[priceTab].map((row,i) => (
                  <div key={i} className="price-row flex items-center justify-between px-4 py-4 rounded-xl transition-all"
                    style={{borderBottom:"1px dashed rgba(183,134,47,0.09)"}}>
                    <span className="text-[14px] font-medium" style={{color:"#1d1b18"}}>{row.label}</span>
                    <span className="text-[17px] font-bold" style={{fontFamily:"'Fraunces',serif",color:"#6f5322"}}>{row.price}</span>
                  </div>
                ))}
              </div>
              <div className="px-6 pb-7 pt-2 text-center">
                <a href="#appointment" className="btn-shim inline-block px-8 py-3 rounded-full text-white text-[13px] font-semibold"
                  style={{boxShadow:"0 8px 24px rgba(183,134,47,0.35)"}}>
                  Book This Service ✦
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Divider />

      {/* ════ GALLERY ════ */}
      <section id="gallery" className="relative z-10 py-24 sm:py-32">
        <div className="absolute inset-0" style={{background:"linear-gradient(180deg,transparent,rgba(239,231,214,0.35) 20%,rgba(239,231,214,0.35) 80%,transparent)"}} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-14">
            <Badge label="Portfolio" />
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:"clamp(2rem,4vw,3rem)",fontWeight:700,color:"#1d1b18",lineHeight:1.1}}>
              Moments of <em style={{color:"#b7862f",fontStyle:"italic"}}>Pure Beauty</em>
            </h2>
            <p className="mt-4 text-[15px]" style={{color:"#6d675d"}}>Click any photo to view full screen — every look is a masterpiece.</p>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4" style={{gridAutoRows:"220px"}}>
            {GALLERY_PHOTOS.map((src,i) => (
              <Reveal key={i} delay={i*0.05}
                className={i===0?"col-span-2 row-span-2":i===5?"col-span-2":""}>
                <div className="gal-item relative overflow-hidden rounded-2xl w-full h-full group"
                  style={{boxShadow:"0 6px 24px rgba(111,83,34,0.12)"}}
                  onClick={() => setLightbox(i)}>
                  <div className="w-full h-full p-2 sm:p-3" style={{background:"linear-gradient(145deg,#fffdf8,#efe7d6)",border:"1px solid rgba(183,134,47,0.18)"}}>
                    <ImageWithFallback src={src} alt={GALLERY_ALTS[i]}
                      className="w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-[1.035]" />
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center"
                    style={{background:"rgba(22,8,18,0.48)",backdropFilter:"blur(2px)"}}>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.4)"}}>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>
                    <span className="mt-2 text-white text-[11px] font-medium tracking-widest">VIEW</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ UNISEX EXPERIENCE ════ */}
      <section id="unisex" className="relative z-10 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center">
            <Reveal from="left">
              <Badge label="Unisex Salon" />
              <h2 style={{fontFamily:"'Fraunces',serif",fontSize:"clamp(2rem,4vw,3rem)",fontWeight:700,color:"#1d1b18",lineHeight:1.08}}>
                Beauty Has <em style={{color:"#b7862f",fontStyle:"italic"}}>No Boundaries.</em>
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed" style={{color:"#6d675d"}}>
                Scissor Sound Unisex Luxury Salon is a modern, welcoming beauty destination in Rehan where women and men can enjoy professional grooming, styling and beauty services under one roof.
              </p>
              <p className="mt-4 text-[14px] leading-relaxed" style={{color:"#6d675d"}}>
                From precision haircuts and beard grooming to hair colour, makeup, nails, facials and occasion-ready styling, our team focuses on a polished result that feels personal to you.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mt-7">
                {[
                  {t:"For Her",d:"Hair, makeup, nails, facials, bridal & occasion styling"},
                  {t:"For Him",d:"Haircuts, beard styling, grooming, facials & occasion looks"},
                  {t:"For Everyone",d:"Hair colour, treatments, beauty care & premium self-care"},
                  {t:"One Modern Space",d:"Clean stations, premium products and a comfortable atmosphere"},
                ].map(item => (
                  <div key={item.t} className="rounded-2xl p-5" style={{background:"rgba(255,255,255,0.62)",border:"1px solid rgba(183,134,47,0.14)",boxShadow:"0 8px 24px rgba(111,83,34,0.06)"}}>
                    <div className="font-semibold text-[14px]" style={{color:"#6f5322"}}>{item.t}</div>
                    <p className="mt-2 text-[12px] leading-relaxed" style={{color:"#6d675d"}}>{item.d}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal from="right">
              <GCard gold className="rounded-[28px] p-7 sm:p-9">
                <div className="flex items-center justify-between gap-4 mb-7">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{color:"#b7862f"}}>Scissor Sound Standard</div>
                    <h3 className="mt-2" style={{fontFamily:"'Fraunces',serif",fontSize:"1.65rem",fontWeight:700,color:"#1d1b18"}}>Professional care, for every guest.</h3>
                  </div>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{background:"linear-gradient(135deg,rgba(233,208,138,0.35),rgba(201,160,88,0.2))"}}>✦</div>
                </div>
                <div className="space-y-4">
                  {[
                    ["01","Consultation first","We understand your style, occasion and preferences before starting."],
                    ["02","Premium products","Carefully selected professional products for a refined finish."],
                    ["03","Personalised styling","Looks are adapted to your features, hair and individual taste."],
                    ["04","Comfortable experience","A clean, bright and welcoming salon designed for everyone."],
                  ].map(([n,t,d]) => (
                    <div key={n} className="flex gap-4 items-start">
                      <span className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold" style={{background:"rgba(183,134,47,0.1)",color:"#b7862f",border:"1px solid rgba(183,134,47,0.2)"}}>{n}</span>
                      <div><div className="text-[13px] font-semibold" style={{color:"#1d1b18"}}>{t}</div><p className="mt-1 text-[12px] leading-relaxed" style={{color:"#6d675d"}}>{d}</p></div>
                    </div>
                  ))}
                </div>
              </GCard>
            </Reveal>
          </div>
        </div>
      </section>

      <Divider />

      {/* ════ SIGNATURE SERVICES ════ */}
      <section id="experience" className="relative z-10 py-24 sm:py-32">
        <div className="absolute inset-0" style={{background:"linear-gradient(180deg,transparent,rgba(239,231,214,0.3) 20%,rgba(239,231,214,0.3) 80%,transparent)"}} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-14">
            <Badge label="Signature Services" />
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:"clamp(2rem,4vw,3rem)",fontWeight:700,color:"#1d1b18",lineHeight:1.1}}>
              One Salon. <em style={{color:"#b7862f",fontStyle:"italic"}}>Everyday Grooming.</em>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-[15px] leading-relaxed" style={{color:"#6d675d"}}>
              Whether you are getting ready for a wedding, refreshing your everyday style or simply taking time for yourself, Scissor Sound has a service for you.
            </p>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {ico:"✂",title:"Hair Studio",text:"Cuts, styling, blow-dry, colour, smoothening and restorative hair treatments."},
              {ico:"✦",title:"Makeup & Glam",text:"Bridal, engagement, party and occasion makeup with personalised styling."},
              {ico:"◇",title:"Men's Grooming",text:"Precision cuts, beard shaping, grooming, facials and polished occasion looks."},
              {ico:"♡",title:"Beauty & Nails",text:"Facials, skincare, manicure, pedicure, nail care and relaxing beauty rituals."},
            ].map((item,i) => (
              <Reveal key={item.title} delay={i*0.07}>
                <GCard gold className="rounded-2xl p-7 h-full hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-5" style={{background:"linear-gradient(135deg,rgba(233,208,138,0.35),rgba(201,160,88,0.2))",color:"#6f5322"}}>{item.ico}</div>
                  <h3 style={{fontFamily:"'Fraunces',serif",fontSize:"1.25rem",fontWeight:700,color:"#1d1b18"}}>{item.title}</h3>
                  <p className="mt-3 text-[13px] leading-relaxed" style={{color:"#6d675d"}}>{item.text}</p>
                </GCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ════ WHY CHOOSE US ════ */}
      <section className="relative z-10 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-14">
            <Badge label="Why Choose Us" />
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:"clamp(2rem,4vw,3rem)",fontWeight:700,color:"#1d1b18",lineHeight:1.1}}>
              The <em style={{color:"#b7862f",fontStyle:"italic"}}>Scissor Sound Unisex Luxury Salon</em> Difference
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { n:"10+",  lbl:"Years of Experience",  ico:"🏆", desc:"A decade perfecting bridal beauty across Himachal Pradesh — one radiant bride at a time." },
              { n:"500+", lbl:"Happy Brides",        ico:"💄", desc:"Over 500 brides have trusted us with their most important day and glowed through every moment." },
              { n:"4.9★", lbl:"Average Rating",      ico:"⭐", desc:"Consistently rated 4.9/5 across Google, Instagram, and word-of-mouth from real brides." },
              { n:"100%", lbl:"Premium Products",    ico:"✨", desc:"Only MAC, KRYOLAN, HUDA BEAUTY, NARS & CHARLOTTE TILBURY — skin-safe and long-lasting." },
              { n:"Pan",  lbl:"Himachal Pradesh Coverage",     ico:"📍", desc:"On-location service at your home, hotel, or venue across all of Himachal Pradesh." },
              { n:"24h",  lbl:"Fast Booking",        ico:"💬", desc:"Quick WhatsApp response, dedicated trial sessions, and a team with you every step." },
            ].map((w,i) => (
              <Reveal key={w.lbl} delay={i*0.07}>
                <GCard gold className="rounded-2xl p-7 h-full flex gap-5 items-start hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                    style={{background:"linear-gradient(135deg,rgba(233,208,138,0.35),rgba(201,160,88,0.22))"}}>
                    {w.ico}
                  </div>
                  <div>
                    <div style={{fontFamily:"'Fraunces',serif",fontSize:"1.6rem",fontWeight:700,color:"#6f5322",lineHeight:1}}>{w.n}</div>
                    <div className="font-semibold text-[13px] mt-0.5 mb-2" style={{color:"#1d1b18"}}>{w.lbl}</div>
                    <p className="text-[13px] leading-relaxed" style={{color:"#6d675d"}}>{w.desc}</p>
                  </div>
                </GCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ REVIEWS ════ */}
      <section id="reviews" className="relative z-10 py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-14">
            <Badge label="Reviews" />
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:"clamp(2rem,4vw,3rem)",fontWeight:700,color:"#1d1b18",lineHeight:1.1}}>
              Real Brides, <em style={{color:"#b7862f",fontStyle:"italic"}}>Real Stories</em>
            </h2>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Stars n={5} />
              <span style={{fontFamily:"'Fraunces',serif",fontSize:"1.4rem",fontWeight:700,color:"#6f5322"}}>4.9</span>
              <span className="text-[13px]" style={{color:"#6d675d"}}>/5 · 200+ Reviews</span>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {REVIEWS.map((r,i) => (
              <Reveal key={i} delay={i*0.07}>
                <GCard className="rounded-2xl p-6 h-full flex flex-col hover:-translate-y-1 transition-transform duration-300">
                  <Stars n={r.stars} />
                  <p className="mt-4 text-[13px] leading-relaxed flex-1" style={{color:"#403c35",fontStyle:"italic"}}>"{r.quote}"</p>
                  <div className="mt-5 pt-4 flex items-center gap-3" style={{borderTop:"1px solid rgba(183,134,47,0.08)"}}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px] flex-shrink-0"
                      style={{background:"linear-gradient(135deg,#efe7d6,#d8c08a)",color:"#6f5322"}}>{r.name[0]}</div>
                    <div>
                      <div className="font-semibold text-[13px]" style={{color:"#1d1b18"}}>{r.name}</div>
                      <div className="text-[11px]" style={{color:"#6d675d"}}>{r.occasion}</div>
                    </div>
                  </div>
                </GCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ COMPLIMENTS 3 — love notes ════ */}
      <section className="relative z-10 py-20 sm:py-24 overflow-hidden">
        <div className="absolute inset-0" style={{background:"linear-gradient(135deg,#efe7d6 0%,#f5f0e6 40%,#efe7d6 100%)",backgroundSize:"200% 200%",animation:"gradShift 12s ease infinite"}} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-10">
            <Badge label="Love Notes" />
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:"clamp(1.8rem,3.5vw,2.4rem)",fontWeight:700,color:"#1d1b18",lineHeight:1.1}}>
              Words That <em style={{color:"#b7862f",fontStyle:"italic"}}>Warm Our Hearts</em>
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              {n:"Ritika S.",     t:"Absolutely loved my engagement look!"},
              {n:"Pooja D.",      t:"Best decision I made for my whole wedding."},
              {n:"Arshdeep K.",  t:"Professional, punctual and absolutely perfect."},
              {n:"Megha T.",      t:"My skin looked radiant from dawn to midnight!"},
              {n:"Sunita V.",     t:"The trial session gave me so much confidence."},
              {n:"Jaspreet M.", t:"Everyone kept asking who did my makeup!"},
              {n:"Divya R.",      t:"Stunning bridal work — 10 out of 10!"},
              {n:"Komal A.",      t:"He understood my vision better than I did."},
              {n:"Parminder K.", t:"Hair + makeup both were flawless all day."},
              {n:"Gurpreet B.", t:"Drove from Amritsar — worth every kilometre!"},
              {n:"Nisha G.",      t:"My photos came out like a magazine spread."},
              {n:"Sneha R.",      t:"Mom, sister and I all looked stunning. Thank you!"},
            ].map((c,i) => (
              <Reveal key={i} delay={i*0.04} from="scale">
                <GCard className="rounded-xl p-4 text-center h-full hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex justify-center mb-2.5"><Stars n={5} /></div>
                  <p className="text-[12px] leading-relaxed mb-3" style={{color:"#403c35",fontStyle:"italic"}}>"{c.t}"</p>
                  <span className="text-[11px] font-semibold" style={{color:"#6f5322"}}>— {c.n}</span>
                </GCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* ════ APPOINTMENT ════ */}
      <section id="appointment" className="relative z-10 py-24 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-16 items-start">
            <Reveal from="left">
              <Badge label="Book Now" />
              <h2 style={{fontFamily:"'Fraunces',serif",fontSize:"clamp(2rem,3.8vw,2.8rem)",fontWeight:700,color:"#1d1b18",lineHeight:1.1}}>
                Reserve Your <em style={{color:"#b7862f",fontStyle:"italic"}}>Bridal Date</em>
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed mb-8" style={{color:"#6d675d"}}>
                Fill in the form and we will confirm your booking within 24 hours. Early bookings are strongly advised for peak wedding season.
              </p>
              <div className="space-y-3">
                {([
                  {ico:"📞",t:"Call / WhatsApp",b:"09816460167",href:"tel:+919816460167"},
                  {ico:"📍",t:"Studio Address",b:"opp. Indian Oil Petrol Pump, Rehan, Tartialan, Rehan, Tartialan, Himachal Pradesh 176022",href:""},
                  {ico:"🕐",t:"Working Hours",b:"Mon – Sun · 7:00 AM – 9:00 PM\n(By Appointment Only)",href:""},
                  {ico:"📸",t:"Instagram",b:"instagram.com",href:"https://instagram.com"},
                ] as {ico:string;t:string;b:string;href:string}[]).map(item => (
                  <div key={item.t} className="flex gap-4 p-4 rounded-xl" style={{background:"rgba(255,255,255,0.55)",border:"1px solid rgba(183,134,47,0.1)",backdropFilter:"blur(12px)"}}>
                    <span className="text-xl flex-shrink-0 mt-0.5">{item.ico}</span>
                    <div>
                      <div className="text-[11px] font-semibold mb-0.5 tracking-wide" style={{color:"#6f5322"}}>{item.t}</div>
                      {item.href
                        ? <a href={item.href} className="text-[13px] hover:underline" style={{color:"#b7862f"}}>{item.b}</a>
                        : <p className="text-[13px] leading-snug whitespace-pre-line" style={{color:"#6d675d"}}>{item.b}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal from="right">
              <GCard className="rounded-3xl p-7 sm:p-9">
                <h3 style={{fontFamily:"'Fraunces',serif",fontSize:"1.35rem",fontWeight:700,color:"#1d1b18",marginBottom:20}}>Your Appointment Details</h3>
                <form onSubmit={submitForm} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[{lbl:"Full Name",key:"name",type:"text",ph:"e.g. Priya Sharma"},{lbl:"Phone Number",key:"phone",type:"tel",ph:"e.g. 98729 66763"}].map(f => (
                      <div key={f.key}>
                        <label className="block text-[11px] font-semibold mb-1.5 tracking-widest uppercase" style={{color:"#6f5322"}}>{f.lbl}</label>
                        <input type={f.type} placeholder={f.ph} required
                          value={form[f.key as keyof typeof form]}
                          onChange={e => setForm(p => ({...p,[f.key]:e.target.value}))}
                          className="w-full px-4 py-3 rounded-xl text-[13px] outline-none transition-all focus:ring-2 focus:ring-[#d8c08a]"
                          style={{background:"rgba(239,231,214,0.6)",border:"1px solid rgba(183,134,47,0.15)",color:"#1d1b18"}} />
                      </div>
                    ))}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold mb-1.5 tracking-widest uppercase" style={{color:"#6f5322"}}>Preferred Date</label>
                      <input type="date" required value={form.date}
                        onChange={e => setForm(p => ({...p,date:e.target.value}))}
                        className="w-full px-4 py-3 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-[#d8c08a]"
                        style={{background:"rgba(239,231,214,0.6)",border:"1px solid rgba(183,134,47,0.15)",color:"#1d1b18"}} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold mb-1.5 tracking-widest uppercase" style={{color:"#6f5322"}}>Service</label>
                      <select required value={form.service}
                        onChange={e => setForm(p => ({...p,service:e.target.value}))}
                        className="w-full px-4 py-3 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-[#d8c08a]"
                        style={{background:"rgba(239,231,214,0.6)",border:"1px solid rgba(183,134,47,0.15)",color:"#1d1b18"}}>
                        <option value="">Select service…</option>
                        <option>Bridal Makeup</option>
                        <option>HD &amp; Airbrush Makeup</option>
                        <option>Party Makeup</option>
                        <option>Engagement Glam</option>
                        <option>Haldi / Mehndi Makeup</option>
                        <option>Family Package</option>
                        <option>Pre-Bridal Prep</option>
                        
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1.5 tracking-widest uppercase" style={{color:"#6f5322"}}>Message / Special Requests</label>
                    <textarea rows={3} placeholder="Tell us about your look or any special requirements…"
                      value={form.msg} onChange={e => setForm(p => ({...p,msg:e.target.value}))}
                      className="w-full px-4 py-3 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-[#d8c08a] resize-none"
                      style={{background:"rgba(239,231,214,0.6)",border:"1px solid rgba(183,134,47,0.15)",color:"#1d1b18"}} />
                  </div>
                  <button type="submit"
                    className="w-full py-4 rounded-2xl text-white font-semibold text-[14px] transition-all hover:scale-[1.02] hover:shadow-2xl active:scale-[0.99]"
                    style={{background:sent?"linear-gradient(135deg,#059669,#10b981)":"linear-gradient(135deg,#6f5322,#b7862f,#c7a55a)",boxShadow:"0 10px 30px rgba(183,134,47,0.38)"}}>
                    {sent ? "✓ Request Sent! We'll call you within 24 hours." : "Confirm Appointment ✦"}
                  </button>
                </form>
              </GCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════ FAQ ════ */}
      <section id="faq" className="relative z-10 py-24 sm:py-28">
        <div className="absolute inset-0" style={{background:"linear-gradient(180deg,transparent,rgba(239,231,214,0.3) 25%,rgba(239,231,214,0.3) 75%,transparent)"}} />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-14">
            <Badge label="FAQ" />
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:"clamp(2rem,4vw,2.8rem)",fontWeight:700,color:"#1d1b18",lineHeight:1.1}}>
              Frequently Asked <em style={{color:"#b7862f",fontStyle:"italic"}}>Questions</em>
            </h2>
          </Reveal>
          <div className="space-y-3">
            {FAQS.map((faq,i) => (
              <Reveal key={i} delay={i*0.05}>
                <div className="rounded-2xl overflow-hidden transition-all duration-300" style={{
                  background:`linear-gradient(rgba(255,255,255,${activeFaq===i?0.85:0.65}),rgba(255,255,255,${activeFaq===i?0.85:0.65})) padding-box, linear-gradient(135deg,${activeFaq===i?"#d8c08a,rgba(183,134,47,0.5),#d8c08a":"rgba(216,192,138,0.4),rgba(183,134,47,0.12),rgba(216,192,138,0.4)"}) border-box`,
                  border:"1px solid transparent",backdropFilter:"blur(16px)",
                  boxShadow:activeFaq===i?"0 10px 35px rgba(111,83,34,0.12)":"0 2px 8px rgba(111,83,34,0.04)",
                }}>
                  <button className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left"
                    onClick={() => setActiveFaq(activeFaq===i?null:i)}>
                    <span className="font-semibold text-[14px] sm:text-[15px]" style={{color:"#1d1b18"}}>{faq.q}</span>
                    <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                      style={{background:activeFaq===i?"linear-gradient(135deg,#b7862f,#6f5322)":"rgba(239,231,214,0.8)",color:activeFaq===i?"#fff":"#b7862f",transform:activeFaq===i?"rotate(45deg)":"none"}}>+</span>
                  </button>
                  <div style={{maxHeight:activeFaq===i?"200px":"0",overflow:"hidden",transition:"max-height 0.42s cubic-bezier(.22,1,.36,1)"}}>
                    <p className="px-6 pb-5 text-[13px] leading-relaxed" style={{color:"#6d675d"}}>{faq.a}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ MAP ════ */}
      <section id="contact" className="relative z-10 py-24 sm:py-28">
        <div className="absolute inset-0" style={{background:"linear-gradient(180deg,transparent,rgba(239,231,214,0.38) 20%,rgba(239,231,214,0.38) 80%,transparent)"}} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <Reveal className="text-center mb-14">
            <Badge label="Find Us" />
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:"clamp(2rem,4vw,2.8rem)",fontWeight:700,color:"#1d1b18",lineHeight:1.1}}>
              Visit Our <em style={{color:"#b7862f",fontStyle:"italic"}}>Studio</em>
            </h2>
          </Reveal>
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            <Reveal from="left">
              <div className="overflow-hidden rounded-2xl" style={{height:420,border:"1px solid rgba(183,134,47,0.14)",boxShadow:"0 16px 50px rgba(111,83,34,0.12)"}}>
                <iframe
                  src="https://www.google.com/maps?q=Shop%20No.%2012%2C%20Kalika%20Mata%20Market%2C%20Chamti%20Khera%20Main%20Road%2C%20Krishna%20Colony%2C%20Rehan%2C%20Himachal Pradesh%20312001&output=embed"
                  width="100%" height="100%"
                  style={{border:0,filter:"saturate(0.7) hue-rotate(300deg) brightness(1.05)"}}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  title="Scissor Sound Unisex Luxury Salon Studio" />
              </div>
            </Reveal>
            <Reveal from="right" className="grid sm:grid-cols-2 gap-4 content-start">
              {([
                {ico:"📍",t:"Address",b:"Scissor Sound Unisex Luxury Salon, opp. Indian Oil Petrol Pump, Rehan, Tartialan, Rehan, Tartialan, Himachal Pradesh 176022",href:""},
                {ico:"📞",t:"Call / WhatsApp",b:"09816460167",href:"tel:+919816460167"},
                {ico:"🕐",t:"Working Hours",b:"Mon – Sun\n7:00 AM – 9:00 PM\n(By Appointment Only)",href:""},
                {ico:"📸",t:"Instagram",b:"instagram.com",href:"https://instagram.com"},
              ] as {ico:string;t:string;b:string;href:string}[]).map(item => (
                <GCard key={item.t} className="rounded-xl p-5">
                  <div className="text-2xl mb-2">{item.ico}</div>
                  <div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{color:"#6f5322"}}>{item.t}</div>
                  {item.href
                    ? <a href={item.href} className="text-[13px] hover:underline" style={{color:"#b7862f"}}>{item.b}</a>
                    : <p className="text-[13px] leading-snug whitespace-pre-line" style={{color:"#6d675d"}}>{item.b}</p>}
                </GCard>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════ CTA ════ */}
      <section className="relative z-10 py-24 sm:py-32 overflow-hidden" style={{background:"#24231f"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 30% 50%,rgba(183,134,47,0.18) 0%,transparent 60%)"}} />
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 75% 40%,rgba(111,83,34,0.15) 0%,transparent 55%)"}} />
        <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",border:"1px solid rgba(183,134,47,0.07)",top:"50%",left:"50%",transform:"translate(-50%,-50%)",animation:"spinSlow 40s linear infinite"}} />
        {[{s:60,x:8,y:20,d:0,dur:8,o:.22},{s:35,x:88,y:70,d:2,dur:10,o:.25},{s:80,x:80,y:10,d:1,dur:12,o:.15}].map((b,i) => <Ball key={i} {...b} />)}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Reveal>
            <div style={{fontFamily:"'Great Vibes',cursive",fontSize:"2.2rem",color:"rgba(216,192,138,0.7)",marginBottom:8}}>Your wedding day</div>
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:"clamp(2.2rem,5vw,3.8rem)",fontWeight:700,color:"rgba(255,253,248,0.95)",lineHeight:1.05,marginBottom:16}}>
              Deserves the <em style={{color:"#d8c08a",fontStyle:"italic"}}>Most Radiant</em> You
            </h2>
            <p className="max-w-2xl mx-auto text-[15px] mb-10 leading-relaxed" style={{color:"rgba(216,192,138,0.6)"}}>
              Refresh your look in a modern, premium space. Book Scissor Sound Unisex Luxury Salon in Rehan for hair, makeup, beauty and nail services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#appointment" className="btn-shim px-9 py-4 rounded-full text-white font-semibold text-[14px] hover:scale-105 hover:shadow-2xl transition-all" style={{boxShadow:"0 10px 30px rgba(183,134,47,0.45)"}}>
                Book Appointment ✦
              </a>
              <a href="https://wa.me/919816460167?text=Hi%20Scissor Sound Unisex Luxury Salon!%20I%20want%20to%20book%20an%20appointment."
                target="_blank" rel="noopener noreferrer"
                className="px-9 py-4 rounded-full font-semibold text-[14px] text-white hover:bg-white/10 hover:scale-105 transition-all"
                style={{border:"1.5px solid rgba(216,192,138,0.35)"}}>
                WhatsApp Us 💬
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer className="relative z-10 pt-16 pb-8" style={{background:"#171713"}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12" style={{borderBottom:"1px solid rgba(183,134,47,0.09)"}}>
            <div className="lg:col-span-2">
              <div style={{fontFamily:"'Great Vibes',cursive",fontSize:"2.2rem",color:"#d8c08a",lineHeight:1}}>Scissor Sound Unisex Luxury Salon</div>
              <p className="mt-3 text-[13px] leading-relaxed max-w-xs" style={{color:"rgba(216,192,138,0.4)"}}>
                A modern unisex salon in Rehan for hair, makeup, beauty and nails. Premium products. Personalised artistry. Timeless radiance.
              </p>
              <div className="flex gap-3 mt-6">
                <a href="https://wa.me/919816460167" target="_blank" rel="noopener noreferrer"
                  className="transition-transform hover:scale-110"
                  style={{width:36,height:36,borderRadius:"50%",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(37,211,102,0.4)"}}>
                  <WaIcon />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                  className="transition-transform hover:scale-110"
                  style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 14px rgba(220,39,67,0.4)"}}>
                  <IgIcon />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest mb-5" style={{color:"rgba(216,192,138,0.65)"}}>Quick Links</h4>
              <ul className="space-y-2.5">
                {NAV.map(l => <li key={l}><a href={`#${l.toLowerCase()}`} className="text-[13px] transition-colors hover:text-[#d8c08a]" style={{color:"rgba(216,192,138,0.38)"}}>{l}</a></li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest mb-5" style={{color:"rgba(216,192,138,0.65)"}}>Luxury Services</h4>
              <ul className="space-y-2.5">
                {["Bridal Makeup","Hair Styling","Nail & Beauty Care"].map(c => (
                  <li key={c} className="text-[12px] leading-snug" style={{color:"rgba(216,192,138,0.38)"}}>{c}</li>
                ))}
              </ul>
              <h4 className="text-[11px] font-bold uppercase tracking-widest mt-7 mb-3" style={{color:"rgba(216,192,138,0.65)"}}>Contact</h4>
              <p className="text-[12px]" style={{color:"rgba(216,192,138,0.38)"}}>09816460167</p>
              <p className="text-[12px] mt-1" style={{color:"rgba(216,192,138,0.38)"}}>Rehan, Tartialan, Himachal Pradesh 176022</p>
            </div>
          </div>
          <div className="pt-6 text-center text-[11px]" style={{color:"rgba(216,192,138,0.22)"}}>
            © 2025 Scissor Sound Unisex Luxury Salon · All rights reserved · Crafted with 💕 in Rehan, Himachal Pradesh
          </div>
        </div>
      </footer>

      {/* ════ FLOATING BUTTONS ════ */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-3">
        <a href="https://wa.me/919816460167?text=Hi%20Scissor Sound Unisex Luxury Salon!%20I%20want%20to%20book%20an%20appointment."
          target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
          className="transition-all duration-300 hover:scale-110"
          style={{width:52,height:52,borderRadius:"50%",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 22px rgba(37,211,102,0.55)"}}>
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.934 1.397 5.61L0 24l6.545-1.376A11.942 11.942 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.045-1.393l-.361-.215-3.883.816.818-3.774-.235-.376A9.818 9.818 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/></svg>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
          className="transition-all duration-300 hover:scale-110"
          style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 22px rgba(220,39,67,0.5)"}}>
          <IgIcon cls="w-6 h-6" />
        </a>
      </div>

      {/* ════ LIGHTBOX ════ */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{background:"rgba(13,5,9,0.96)",backdropFilter:"blur(14px)"}}
          onClick={() => setLightbox(null)}>
          <button
            onClick={e => { e.stopPropagation(); setLightbox(p => p !== null ? Math.max(0, p-1) : null); }}
            className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{background:"rgba(255,255,255,0.09)",border:"1px solid rgba(216,192,138,0.22)"}}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          </button>

          <div className="relative mx-14 sm:mx-24 max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <div style={{borderRadius:20,overflow:"hidden",boxShadow:"0 30px 80px rgba(0,0,0,0.65)"}}>
              <ImageWithFallback src={GALLERY_PHOTOS[lightbox]} alt={GALLERY_ALTS[lightbox]}
                className="w-full max-h-[82vh] object-contain" />
            </div>
            <p className="mt-4 text-center text-[12px]" style={{color:"rgba(216,192,138,0.6)",letterSpacing:"0.1em"}}>
              Scissor Sound Unisex Luxury Salon · {lightbox+1} / {GALLERY_PHOTOS.length}
            </p>
          </div>

          <button
            onClick={e => { e.stopPropagation(); setLightbox(p => p !== null ? Math.min(GALLERY_PHOTOS.length-1, p+1) : null); }}
            className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{background:"rgba(255,255,255,0.09)",border:"1px solid rgba(216,192,138,0.22)"}}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </button>

          <button onClick={() => setLightbox(null)}
            className="absolute top-5 right-4 sm:right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{background:"rgba(255,255,255,0.09)",border:"1px solid rgba(216,192,138,0.18)"}}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {GALLERY_PHOTOS.map((_,i) => (
              <button key={i}
                onClick={e => { e.stopPropagation(); setLightbox(i); }}
                style={{width:i===lightbox?22:7,height:7,borderRadius:4,background:i===lightbox?"#d8c08a":"rgba(216,192,138,0.28)",transition:"all 0.3s ease"}} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
