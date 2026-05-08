'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ---------- Confetti ---------- */
function useConfetti(canvasRef) {
  return useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const COLORS = ['#ff7a00','#ffb040','#00c16a','#00e07a','#fff','#ffdd57','#ff4f7b'];
    const pieces = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.4 - canvas.height * 0.2,
      r: Math.random() * 7 + 3,
      d: Math.random() * 140,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      tilt: Math.random() * 10 - 10,
      tiltSpeed: Math.random() * 0.1 + 0.05,
      speed: Math.random() * 3 + 1.5,
      opacity: 1,
    }));
    let frame;
    let tick = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tick++;
      pieces.forEach(p => {
        p.y += p.speed;
        p.tilt += p.tiltSpeed;
        if (tick > 120) p.opacity = Math.max(0, p.opacity - 0.012);
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(p.x + p.tilt, p.y, p.r, p.r * 0.5, p.tilt, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
      });
      if (tick < 260) frame = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, [canvasRef]);
}

/* ---------- Animated checkmark SVG ---------- */
function AnimatedCheck() {
  return (
    <svg width={56} height={56} viewBox="0 0 56 56" fill="none">
      <motion.circle cx={28} cy={28} r={26} stroke="#00c16a" strokeWidth={3}
        initial={{ pathLength:0, opacity:0 }} animate={{ pathLength:1, opacity:1 }}
        transition={{ duration:0.6, ease:'easeOut' }}/>
      <motion.path d="M16 28l9 9 15-16" stroke="white" strokeWidth={3.5}
        strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength:0 }} animate={{ pathLength:1 }}
        transition={{ duration:0.45, delay:0.5, ease:'easeOut' }}/>
    </svg>
  );
}

/* ---------- Success Screen ---------- */
function SuccessScreen({ name, email, branch }) {
  const canvasRef = useRef(null);
  const fireConfetti = useConfetti(canvasRef);
  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
    const cleanup = fireConfetti();
    return cleanup;
  }, [fireConfetti]);
  useEffect(() => {
    const iv = setInterval(() => setCountdown(c => c - 1), 1000);
    const t = setTimeout(() => { window.location.href = 'https://qr-mlr.vercel.app/'; }, 5000);
    return () => { clearInterval(iv); clearTimeout(t); };
  }, []);

  return (
    <motion.div
      initial={{ opacity:0, scale:0.96 }}
      animate={{ opacity:1, scale:1 }}
      exit={{ opacity:0, scale:0.96 }}
      transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
      style={{ position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 20px', textAlign:'center', overflow:'hidden' }}>

      {/* confetti canvas */}
      <canvas ref={canvasRef} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:100 }}/>

      {/* blurred bg same as form */}
      <div style={{ position:'fixed', inset:0, zIndex:0, background:'radial-gradient(ellipse 80% 60% at 50% 20%,rgba(0,193,106,0.12),transparent 70%), radial-gradient(ellipse 60% 40% at 50% 80%,rgba(255,122,0,0.10),transparent 70%)' }}/>

      <div style={{ position:'relative', zIndex:10, maxWidth:520, width:'100%' }}>

        {/* check icon */}
        <motion.div
          initial={{ scale:0, rotate:-20 }}
          animate={{ scale:1, rotate:0 }}
          transition={{ type:'spring', stiffness:260, damping:16, delay:0.1 }}
          style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:100, height:100, borderRadius:30, background:'linear-gradient(135deg,rgba(0,193,106,0.18),rgba(0,193,106,0.06))', border:'1.5px solid rgba(0,193,106,0.35)', boxShadow:'0 0 60px rgba(0,193,106,0.25)', marginBottom:28 }}>
          <AnimatedCheck/>
        </motion.div>

        {/* heading */}
        <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35, duration:0.55, ease:[0.22,1,0.36,1] }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(0,193,106,0.1)', border:'1px solid rgba(0,193,106,0.3)', borderRadius:99, padding:'5px 16px', marginBottom:20 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#00c16a', boxShadow:'0 0 8px #00c16a', display:'inline-block' }}/>
            <span style={{ fontSize:10, fontWeight:700, color:'rgba(0,193,106,0.9)', letterSpacing:'0.14em', textTransform:'uppercase' }}>Application Received</span>
          </div>
          <h1 style={{ fontSize:'clamp(1.9rem,5vw,2.8rem)', fontWeight:800, color:'#fff', lineHeight:1.1, marginBottom:14, textShadow:'0 2px 24px rgba(0,0,0,0.5)' }}>
            You're on the list,{' '}
            <span style={{ background:'linear-gradient(95deg,#00c16a,#00e07a)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              {name.split(' ')[0]}!
            </span>
          </h1>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.55)', lineHeight:1.8, maxWidth:380, margin:'0 auto 32px' }}>
            Our admissions team will personally reach out within{' '}
            <strong style={{ color:'rgba(255,255,255,0.85)' }}>2–3 working days</strong>{' '}
            to guide you through the next steps.
          </p>
        </motion.div>

        {/* details card */}
        <motion.div
          initial={{ opacity:0, y:22 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.55, duration:0.55, ease:[0.22,1,0.36,1] }}
          style={{ background:'rgba(255,255,255,0.06)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)', border:'1px solid rgba(255,255,255,0.14)', borderRadius:20, padding:'24px 28px', marginBottom:24, textAlign:'left' }}>
          <p style={{ margin:'0 0 16px', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.35)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Your submission</p>
          {[
            { label:'Name',   value: name },
            { label:'Email',  value: email },
            { label:'Branch', value: branch || '—' },
          ].map(({ label, value }) => (
            <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
              <span style={{ fontSize:12, color:'rgba(255,255,255,0.38)', fontWeight:600 }}>{label}</span>
              <span style={{ fontSize:13, color:'rgba(255,255,255,0.85)', fontWeight:700 }}>{value}</span>
            </div>
          ))}
          <div style={{ marginTop:16, padding:'12px 16px', borderRadius:12, background:'rgba(0,193,106,0.08)', border:'1px solid rgba(0,193,106,0.2)' }}>
            <p style={{ margin:0, fontSize:12, color:'rgba(0,193,106,0.85)', fontWeight:600 }}>
              ✓ Welcome email sent to {email}
            </p>
          </div>
        </motion.div>

        {/* what happens next */}
        <motion.div
          initial={{ opacity:0, y:22 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.7, duration:0.55, ease:[0.22,1,0.36,1] }}
          style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:32 }}>
          {[
            { step:'01', text:'Check your inbox — a welcome email is on its way', color:'#00c16a' },
            { step:'02', text:'Our counsellor calls you within 2–3 working days', color:'#ff7a00' },
            { step:'03', text:'Campus visit · Counselling · Admission', color:'#00c16a' },
          ].map(({ step, text, color }) => (
            <div key={step} style={{ display:'flex', alignItems:'center', gap:14, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'12px 16px', textAlign:'left' }}>
              <span style={{ flexShrink:0, width:28, height:28, borderRadius:9, background:`${color}22`, border:`1px solid ${color}55`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color, letterSpacing:'0.04em' }}>{step}</span>
              <span style={{ fontSize:12.5, color:'rgba(255,255,255,0.6)', fontWeight:500, lineHeight:1.5 }}>{text}</span>
            </div>
          ))}
        </motion.div>

        {/* footer */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.25)', marginBottom:4 }}>MLR Institute of Technology · Maisammaguda, Hyderabad</p>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.18)', marginBottom:16 }}>info@mlrit.ac.in · 9652226061</p>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.35)', fontWeight:500 }}>
            Redirecting in <span style={{ color:'#00c16a', fontWeight:700 }}>{countdown}</span>s…
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

const INTERESTS = ['AI & ML','Robotics','Startups','Design','Coding','Research','IoT','Data Science','Cybersecurity','Product','Cloud','Embedded'];
const BRANCHES  = ['CSE','CSE AI/ML','IT','ECE','EEE','Mechanical','Civil'];
const STATES    = ['Andhra Pradesh','Telangana','Tamil Nadu','Karnataka','Maharashtra','Kerala','Gujarat','Other'];

/* Inject responsive CSS once */
const RESPONSIVE_CSS = `
  @media (max-width: 540px) {
    .mf-grid { grid-template-columns: 1fr !important; }
    .mf-span2 { grid-column: span 1 !important; }
    .mf-sh-line { display: none !important; }
    .mf-contact-strip { gap: 6px !important; }
    .mf-contact-strip > div { padding: 4px 10px !important; }
    .mf-hero h1 { font-size: 1.65rem !important; }
    .mf-hero p  { font-size: 13px !important; }
    .mf-card    { padding: 20px 14px !important; border-radius: 20px !important; }
    .mf-sh-num  { width: 34px !important; height: 34px !important; border-radius: 10px !important; font-size: 11px !important; }
    .mf-sh-label{ font-size: 1rem !important; }
    .mf-submit  { padding: 14px 18px !important; font-size: 13px !important; }
    .mf-chip    { padding: 6px 11px !important; font-size: 11px !important; }
    .mf-qtile   { padding: 12px 12px !important; }
  }
`;

const GC = { background:'rgba(255,255,255,0.07)',backdropFilter:'blur(28px)',WebkitBackdropFilter:'blur(28px)',border:'1px solid rgba(255,255,255,0.18)',boxShadow:'0 8px 40px rgba(0,0,0,0.25),inset 0 1px 0 rgba(255,255,255,0.12)' };
const GI = { background:'rgba(255,255,255,0.06)',backdropFilter:'blur(12px)',WebkitBackdropFilter:'blur(12px)',border:'1.5px solid rgba(255,255,255,0.18)' };
const GB = { background:'rgba(255,255,255,0.07)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.18)' };

const reveal = (d=0) => ({
  initial:{opacity:0,y:24},whileInView:{opacity:1,y:0},
  viewport:{once:true,margin:'-40px'},
  transition:{duration:0.55,delay:d,ease:[0.22,1,0.36,1]},
});

/* Hoverable question tile — subtle green shade on hover */
function QTile({ children, delay=0, cols=1 }) {
  const [h, setH] = useState(false);
  return (
    <motion.div {...reveal(delay)}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className={`mf-qtile${cols===2 ? ' mf-span2' : ''}`}
      style={{
        gridColumn: cols===2 ? 'span 2' : 'span 1',
        borderRadius: 16,
        padding: '14px 16px',
        border: `1.5px solid ${h ? 'rgba(0,193,106,0.65)' : 'rgba(255,255,255,0.07)'}`,
        background: h ? 'rgba(0,193,106,0.07)' : 'rgba(255,255,255,0.02)',
        boxShadow: h ? '0 0 0 1px rgba(0,193,106,0.25),0 6px 28px rgba(0,193,106,0.12)' : 'none',
        transition: 'all 0.28s cubic-bezier(0.22,1,0.36,1)',
      }}>
      {children}
    </motion.div>
  );
}

/* Question label with spring pop */
function QL({ children, opt }) {
  const [h, setH] = useState(false);
  return (
    <div style={{ marginBottom:9 }}>
      <span
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          display:'inline-block',fontSize:13,fontWeight:600,cursor:'default',
          color: h ? '#00c16a' : 'rgba(255,255,255,0.78)',
          transform: h ? 'translateY(-4px) scale(1.04)' : 'none',
          transformOrigin:'left center',
          transition:'color .2s ease,transform .28s cubic-bezier(.34,1.56,.64,1)',
        }}>
        {children}
      </span>
      {opt && <span style={{ fontSize:11,color:'rgba(255,255,255,0.28)',marginLeft:8 }}>optional</span>}
    </div>
  );
}

/* Section heading with spring pop */
function SH({ n, label, sub }) {
  const [h, setH] = useState(false);
  return (
    <div style={{ display:'flex',alignItems:'center',gap:13,marginBottom:20 }}>
      <div className="mf-sh-num" style={{ flexShrink:0,width:40,height:40,borderRadius:13,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:'#fff',background:'linear-gradient(135deg,#ff7a00,#ffb05a)',boxShadow:'0 4px 18px rgba(255,122,0,0.5)' }}>
        {String(n).padStart(2,'0')}
      </div>
      <div>
        <span
          className="mf-sh-label"
          onMouseEnter={() => setH(true)}
          onMouseLeave={() => setH(false)}
          style={{
            display:'inline-block',fontSize:'1.2rem',fontWeight:700,cursor:'default',
            color: h ? '#00c16a' : '#fff',
            transform: h ? 'translateY(-3px) scale(1.025)' : 'none',
            transformOrigin:'left center',
            transition:'color .2s ease,transform .28s cubic-bezier(.34,1.56,.64,1)',
          }}>
          {label}
        </span>
        {sub && <div style={{ fontSize:11,color:'rgba(255,255,255,0.38)',marginTop:2 }}>{sub}</div>}
      </div>
      <div className="mf-sh-line" style={{ flex:1,height:1,background:'linear-gradient(90deg,rgba(255,122,0,0.5),transparent)',marginLeft:6 }}/>
    </div>
  );
}

const iCls = 'w-full rounded-xl px-4 py-3.5 text-white text-sm placeholder-white/30 outline-none appearance-none transition-all duration-300 hover:border-[#00c16a]/50 focus:border-[#ff7a00]/60 focus:shadow-[0_0_0_3px_rgba(255,122,0,0.18)]';

function Inp({ label, name, type='text', value, onChange, error, opt, ph, maxLength, inputMode, min, max, step, onKeyDown }) {
  return (
    <>
      <QL opt={opt}>{label}</QL>
      <input type={type} name={name} value={value} onChange={onChange}
        placeholder={ph||`Enter ${label.toLowerCase()}`}
        className={iCls}
        maxLength={maxLength} inputMode={inputMode} min={min} max={max} step={step} onKeyDown={onKeyDown}
        style={{ ...GI,borderRadius:12,fontFamily:'inherit',width:'100%' }}/>
      <AnimatePresence>
        {error && <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
          style={{fontSize:11,color:'#fca5a5',fontWeight:600,marginTop:5}}>{error}</motion.p>}
      </AnimatePresence>
    </>
  );
}

function Sel({ label, name, opts, value, onChange, error }) {
  return (
    <>
      <QL>{label}</QL>
      <div style={{ position:'relative' }}>
        <select name={name} value={value} onChange={onChange}
          className={iCls}
          style={{ ...GI,borderRadius:12,paddingRight:38,cursor:'pointer',fontFamily:'inherit',width:'100%' }}>
          <option value="" style={{ background:'#0f172a',color:'#fff' }}>Choose...</option>
          {opts.map(o => <option key={o} style={{ background:'#0f172a',color:'#fff' }}>{o}</option>)}
        </select>
        <svg style={{ position:'absolute',right:13,top:'50%',transform:'translateY(-50%)',pointerEvents:'none' }}
          width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth={2}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>
      <AnimatePresence>
        {error && <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
          style={{fontSize:11,color:'#fca5a5',fontWeight:600,marginTop:5}}>{error}</motion.p>}
      </AnimatePresence>
    </>
  );
}

export default function MLRITForm() {
  const videoRef = useRef(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = 0.35;
    const onEnded = () => v.pause();
    v.addEventListener('ended', onEnded);
    return () => v.removeEventListener('ended', onEnded);
  }, []);

  const blank = { name:'',email:'',phone:'',college:'',pct:'',branch:'',excites:'',goals:'',city:'',state:'',consent:false };
  const [f, setF]         = useState(blank);
  const [chips, setChips] = useState([]);
  const [errs, setErrs]   = useState({});
  const [done, setDone]   = useState(false);
  const [submitted, setSubmitted] = useState(null); // { name, email, branch }
  const [submitting, setSubmitting] = useState(false);
  const [submitErr, setSubmitErr]   = useState('');

  const set = e => {
    const { name,value,type,checked } = e.target;
    if (name === 'phone' && !/^\d*$/.test(value)) return;
    if (name === 'pct') {
      if (value !== '' && (isNaN(value) || Number(value) < 0 || Number(value) > 100)) return;
    }
    setF(p => ({ ...p,[name]:type==='checkbox'?checked:value }));
    setErrs(p => ({ ...p,[name]:'' }));
  };
  const tog = c => setChips(p => p.includes(c) ? p.filter(x=>x!==c) : [...p,c]);

  const validate = () => {
    const e={};
    if (!f.name.trim())                               e.name    = 'Name required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email   = 'Valid email required';
    if (!/^\d{10}$/.test(f.phone))                   e.phone   = '10-digit number';
    if (!f.college.trim())                            e.college = 'College required';
    if (!f.pct||isNaN(f.pct))                        e.pct     = 'Enter percentage';
    if (!f.branch)                                   e.branch  = 'Select branch';
    if (!f.excites.trim())                           e.excites = 'Tell us more';
    if (!f.city.trim())                              e.city    = 'City required';
    if (!f.state)                                    e.state   = 'Select state';
    if (!f.consent)                                  e.consent = 'Consent required';
    return e;
  };

  const submit = async e => {
    e.preventDefault();
    const ev = validate();
    if (Object.keys(ev).length) { setErrs(ev); return; }
    setSubmitting(true);
    setSubmitErr('');
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, chips: chips.join(', ') }),
      });
      if (!res.ok) throw new Error('Server error');
      setSubmitted({ name: f.name, email: f.email, branch: f.branch });
      setDone(true);
    } catch {
      setSubmitErr('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const DIV_O = <div style={{ height:1,background:'linear-gradient(90deg,transparent,rgba(255,122,0,0.45),transparent)',margin:'28px 0' }}/>;
  const DIV_G = <div style={{ height:1,background:'linear-gradient(90deg,transparent,rgba(0,193,106,0.45),transparent)',margin:'28px 0' }}/>;

  const GLOBAL_CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
    #mf * { font-family:'Sora',sans-serif; box-sizing:border-box; }
    select option { background:#0f172a; color:#fff; }
    input:-webkit-autofill,input:-webkit-autofill:focus { -webkit-box-shadow:0 0 0 100px rgba(15,23,42,0.9) inset!important; -webkit-text-fill-color:#fff!important; }
    ::selection { background:rgba(255,122,0,0.3); }
    ::-webkit-scrollbar { width:5px; }
    ::-webkit-scrollbar-thumb { background:rgba(255,122,0,0.4); border-radius:99px; }
    ${RESPONSIVE_CSS}
  `;

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <div id="mf" style={{ position:'relative',minHeight:'100vh',overflowX:'hidden' }}>

        {/* Campus background video — always present */}
        <div style={{ position:'fixed',inset:0,zIndex:0 }}>
          <video ref={videoRef} autoPlay muted playsInline
            style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:'center center',transform:'scale(1.08)',transformOrigin:'center center' }}>
            <source src="https://res.cloudinary.com/dt21hlxa1/video/upload/background_iegs9i.mp4" type="video/mp4"/>
          </video>
          <div style={{ position:'absolute',inset:0,background:'linear-gradient(160deg,rgba(4,8,20,0.62) 0%,rgba(4,8,20,0.38) 50%,rgba(0,12,8,0.55) 100%)' }}/>
          <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse 70% 35% at 50% 0%,rgba(255,122,0,0.08),transparent 65%)' }}/>
          <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse 70% 35% at 50% 100%,rgba(0,193,106,0.07),transparent 65%)' }}/>
        </div>

        <AnimatePresence mode="wait">
          {done && submitted ? (
            <SuccessScreen key="success" name={submitted.name} email={submitted.email} branch={submitted.branch}/>
          ) : (
            <motion.div key="form"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0, scale:0.97 }}
              transition={{ duration:0.4, ease:[0.22,1,0.36,1] }}>

              {/* Content */}
              <div style={{ position:'relative',zIndex:10,maxWidth:640,margin:'0 auto',padding:'52px 14px 48px' }}>

                {/* Hero */}
                <motion.div {...reveal(0)} className="mf-hero" style={{ textAlign:'center',marginBottom:36 }}>
                  <motion.div animate={{ y:[0,-5,0] }} transition={{ duration:3.5,repeat:Infinity,ease:'easeInOut' }}
                    style={{ ...GB,display:'inline-flex',alignItems:'center',gap:8,borderRadius:99,padding:'7px 20px',marginBottom:18 }}>
                    <span style={{ width:7,height:7,borderRadius:'50%',background:'#00c16a',boxShadow:'0 0 8px #00c16a',display:'inline-block',flexShrink:0 }}/>
                    <span style={{ fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.7)',letterSpacing:'0.13em',textTransform:'uppercase' }}>Admissions Open · 2025–26</span>
                  </motion.div>
                  <h1 style={{ fontSize:'clamp(1.9rem,5.5vw,3rem)',fontWeight:800,color:'#fff',lineHeight:1.1,marginBottom:12,textShadow:'0 2px 24px rgba(0,0,0,0.5)' }}>
                    Shape your future at{' '}
                    <span style={{ background:'linear-gradient(95deg,#ff7a00,#ffb040)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text' }}>MLRIT</span>
                  </h1>
                  <p style={{ fontSize:14,color:'rgba(255,255,255,0.5)',lineHeight:1.8,maxWidth:400,margin:'0 auto' }}>
                    A few questions. That's all it takes to begin an extraordinary engineering journey.
                  </p>
                </motion.div>

                {/* Contact strip */}
                <motion.div {...reveal(0.06)} className="mf-contact-strip" style={{ display:'flex',flexWrap:'wrap',justifyContent:'center',gap:8,marginBottom:24 }}>
                  {[
                    { icon:<svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>, l:'info@mlrit.ac.in' },
                    { icon:<svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>, l:'9652226061' },
                    { icon:<svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>, l:'Toll Free: 18005724363' },
                    { icon:<svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-9 10 9"/><path d="M6 10v8a1 1 0 001 1h4v-5h2v5h4a1 1 0 001-1v-8"/></svg>, l:'NAAC A Grade' },
                  ].map(x => (
                    <div key={x.l} style={{ ...GB,display:'inline-flex',alignItems:'center',gap:6,borderRadius:99,padding:'5px 13px' }}>
                      {x.icon}
                      <span style={{ fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.65)' }}>{x.l}</span>
                    </div>
                  ))}
                </motion.div>

                {/* Form card */}
                <motion.div {...reveal(0.1)} className="mf-card" style={{ ...GC,borderRadius:28,padding:'clamp(20px,5vw,42px)',position:'relative',overflow:'hidden' }}>
                  <div style={{ position:'absolute',inset:0,borderRadius:28,background:'linear-gradient(135deg,rgba(255,255,255,0.07) 0%,transparent 45%)',pointerEvents:'none' }}/>

                  <form onSubmit={submit} style={{ position:'relative',zIndex:10 }}>

                    <SH n={1} label="Who are you?" sub="Let's start with the basics"/>
                    <div className="mf-grid" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
                      <QTile delay={0.05} cols={2}><Inp label="What should we call you?" name="name" value={f.name} onChange={set} error={errs.name} ph="Your full name" maxLength={60}/></QTile>
                      <QTile delay={0.10}><Inp label="Your email address" name="email" type="email" value={f.email} onChange={set} error={errs.email} ph="you@example.com" maxLength={100}/></QTile>
                      <QTile delay={0.15}><Inp label="Mobile number" name="phone" type="tel" value={f.phone} onChange={set} error={errs.phone} ph="10-digit mobile" maxLength={10} inputMode="numeric"/></QTile>
                    </div>

                    {DIV_O}

                    <SH n={2} label="Academic background" sub="Tell us where you're coming from"/>
                    <div className="mf-grid" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
                      <QTile delay={0.05} cols={2}><Inp label="Which college are you in?" name="college" value={f.college} onChange={set} error={errs.college} ph="Your college name" maxLength={100}/></QTile>
                      <QTile delay={0.10}><Inp label="Percentage / GPA" name="pct" type="number" value={f.pct} onChange={set} error={errs.pct} ph="e.g. 92.5" min="0" max="100" step="0.01"/></QTile>
                      <QTile delay={0.15}><Sel label="Preferred branch" name="branch" opts={BRANCHES} value={f.branch} onChange={set} error={errs.branch}/></QTile>
                    </div>

                    {DIV_G}

                    <SH n={3} label="Your aspirations" sub="Help us understand what drives you"/>
                    <div className="mf-grid" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
                      <QTile delay={0.05} cols={2}>
                        <QL>What excites you most about MLRIT?</QL>
                        <textarea name="excites" value={f.excites} onChange={set} rows={3}
                          placeholder="Research culture, innovation labs, placements..."
                          maxLength={500}
                          className={iCls} style={{ ...GI,borderRadius:12,resize:'none',fontFamily:'inherit',width:'100%' }}/>
                        <AnimatePresence>
                          {errs.excites && <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}} style={{fontSize:11,color:'#fca5a5',fontWeight:600,marginTop:5}}>{errs.excites}</motion.p>}
                        </AnimatePresence>
                      </QTile>
                      <QTile delay={0.10} cols={2}>
                        <QL opt>Areas of interest</QL>
                        <div style={{ display:'flex',flexWrap:'wrap',gap:8,marginTop:4 }}>
                          {INTERESTS.map((c,i) => (
                            <motion.button key={c} type="button" onClick={() => tog(c)}
                              initial={{opacity:0,scale:0.8}} whileInView={{opacity:1,scale:1}}
                              viewport={{once:true}} transition={{delay:i*0.03,duration:0.3}}
                              whileHover={{scale:1.07}} whileTap={{scale:0.94}}
                              onMouseEnter={e => { if (!chips.includes(c)) { e.currentTarget.style.borderColor='rgba(0,193,106,0.6)'; e.currentTarget.style.color='#00c16a'; }}}
                              onMouseLeave={e => { if (!chips.includes(c)) { e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'; e.currentTarget.style.color='rgba(255,255,255,0.65)'; }}}
                              className="mf-chip"
                              style={chips.includes(c)
                                ? { padding:'7px 14px',borderRadius:99,fontSize:12,fontWeight:600,border:'none',cursor:'pointer',background:'linear-gradient(135deg,#ff7a00,#ffaa40)',color:'#fff',boxShadow:'0 4px 16px rgba(255,122,0,0.4)',fontFamily:'inherit' }
                                : { padding:'7px 14px',borderRadius:99,fontSize:12,fontWeight:600,border:'1.5px solid rgba(255,255,255,0.20)',cursor:'pointer',background:'rgba(255,255,255,0.06)',color:'rgba(255,255,255,0.65)',fontFamily:'inherit' }}>
                              {c}
                            </motion.button>
                          ))}
                        </div>
                      </QTile>
                      <QTile delay={0.15} cols={2}>
                        <QL opt>What are your future goals?</QL>
                        <textarea name="goals" value={f.goals} onChange={set} rows={3}
                          placeholder="Build an AI startup, do research, lead product teams..."
                          maxLength={500}
                          className={iCls} style={{ ...GI,borderRadius:12,resize:'none',fontFamily:'inherit',width:'100%' }}/>
                      </QTile>
                    </div>

                    {DIV_O}

                    <SH n={4} label="Where are you from?" sub="Just your location"/>
                    <div className="mf-grid" style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
                      <QTile delay={0.05}><Inp label="City" name="city" value={f.city} onChange={set} error={errs.city} ph="Your city" maxLength={60}/></QTile>
                      <QTile delay={0.10}><Sel label="State" name="state" opts={STATES} value={f.state} onChange={set} error={errs.state}/></QTile>
                    </div>

                    {DIV_G}

                    <SH n={5} label="Almost there" sub="One last confirmation"/>
                    <div style={{ display:'flex',flexDirection:'column',gap:18 }}>
                      <QTile delay={0.05} cols={2}>
                        <div onClick={() => setF(p => ({ ...p,consent:!p.consent }))}
                          style={{ display:'flex',gap:13,alignItems:'flex-start',cursor:'pointer' }}>
                          <div style={{ width:21,height:21,minWidth:21,borderRadius:7,marginTop:1,display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s ease',
                            ...(f.consent ? { background:'linear-gradient(135deg,#ff7a00,#ffaa40)',boxShadow:'0 3px 12px rgba(255,122,0,0.45)' } : { border:'1.5px solid rgba(255,255,255,0.3)',background:'rgba(255,255,255,0.06)' }) }}>
                            {f.consent && <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>}
                          </div>
                          <p style={{ fontSize:12,color:'rgba(255,255,255,0.6)',lineHeight:1.7,userSelect:'none',margin:0 }}>
                            I agree to MLRIT contacting me regarding my application. My information will be processed securely for admissions purposes only.
                          </p>
                        </div>
                        <AnimatePresence>
                          {errs.consent && <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}} style={{fontSize:11,color:'#fca5a5',fontWeight:600,marginTop:8}}>{errs.consent}</motion.p>}
                        </AnimatePresence>
                      </QTile>

                      <motion.button type="submit" {...reveal(0.1)}
                        whileHover={submitting ? {} : { scale:1.015,y:-1 }} whileTap={submitting ? {} : { scale:0.985 }}
                        disabled={submitting}
                        className="mf-submit"
                        style={{
                          width:'100%', padding:'15px 24px', borderRadius:10,
                          background: submitting ? 'rgba(255,122,0,0.08)' : 'transparent',
                          color:'#fff', fontSize:13, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase',
                          border: submitting ? '1.5px solid #ff7a00' : '1.5px solid rgba(255,255,255,0.55)',
                          cursor: submitting ? 'not-allowed' : 'pointer',
                          display:'flex', alignItems:'center', justifyContent:'space-between',
                          fontFamily:'inherit', transition:'border-color .2s ease, background .2s ease',
                          position:'relative', overflow:'hidden', opacity: submitting ? 0.8 : 1,
                        }}
                        onMouseEnter={e => { if (submitting) return; e.currentTarget.style.borderColor='#ff7a00'; e.currentTarget.style.background='rgba(255,122,0,0.08)'; }}
                        onMouseLeave={e => { if (submitting) return; e.currentTarget.style.borderColor='rgba(255,255,255,0.55)'; e.currentTarget.style.background='transparent'; }}>
                        <span style={{ letterSpacing:'0.1em' }}>{submitting ? 'Sending…' : 'Submit Application'}</span>
                        <span style={{ display:'flex',alignItems:'center',gap:6,opacity:0.7,fontSize:11,fontWeight:600,letterSpacing:'0.06em' }}>
                          {submitting ? (
                            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ animation:'spin 1s linear infinite' }}><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.3}/><path d="M21 12a9 9 0 00-9-9"/></svg>
                          ) : (
                            <>MLRIT 2025–26 <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></>
                          )}
                        </span>
                      </motion.button>

                      <AnimatePresence>
                        {submitErr && (
                          <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                            style={{textAlign:'center',fontSize:12,color:'#fca5a5',fontWeight:600,marginTop:8}}>
                            {submitErr}
                          </motion.p>
                        )}
                      </AnimatePresence>
                      <p style={{ textAlign:'center',fontSize:11,color:'rgba(255,255,255,0.28)',marginTop:-10,display:'flex',alignItems:'center',justifyContent:'center',gap:5 }}>
                        <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                        Encrypted &amp; secure · Response within 5 business days
                      </p>
                    </div>
                  </form>
                </motion.div>

                {/* Branch pills */}
                <motion.div {...reveal(0.2)} style={{ display:'flex',flexWrap:'wrap',justifyContent:'center',gap:8,marginTop:24 }}>
                  {BRANCHES.map(b => (
                    <span key={b} style={{ ...GB,borderRadius:99,padding:'5px 15px',fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.5)',letterSpacing:'0.04em' }}>{b}</span>
                  ))}
                </motion.div>
                <div style={{ textAlign:'center',marginTop:16 }}>
                  <p style={{ fontSize:11,color:'rgba(255,255,255,0.3)',marginBottom:4 }}>MLRIT · Maisammaguda, Hyderabad · Est. 2004</p>
                  <p style={{ fontSize:11,color:'rgba(255,255,255,0.22)',marginBottom:14 }}>info@mlrit.ac.in · 9652226061 · 18005724363 (Toll Free)</p>
                  <div style={{ display:'flex',alignItems:'center',gap:10,justifyContent:'center' }}>
                    <div style={{ flex:1,height:'1px',background:'linear-gradient(90deg,transparent,rgba(0,193,106,0.3))' }}/>
                    <p style={{ fontSize:11,color:'rgba(0,193,106,0.6)',fontWeight:600,letterSpacing:'0.04em',whiteSpace:'nowrap' }}>✦ Implemented by the students of MLRIT ✦</p>
                    <div style={{ flex:1,height:'1px',background:'linear-gradient(90deg,rgba(0,193,106,0.3),transparent)' }}/>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
