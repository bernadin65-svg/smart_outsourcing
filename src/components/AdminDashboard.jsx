import { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie,
} from "recharts";


const API = "https://smart-outsourcing.onrender.com/api/users";
const Icons = {
  users:    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  chart:    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  logout:   <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  search:   <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  refresh:  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  trash:    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  eye:      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  close:    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check:    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  briefcase:<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  mail:     <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  clock:    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  euro:     <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 10h12"/><path d="M4 14h12"/><path d="M19.5 5a9 9 0 1 0 0 14"/></svg>,
  home:     <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  settings: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  arrow_up: <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"/></svg>,
  arrow_dn: <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>,
};

const SERVICE_LABELS = { relation_client:"Relation client", back_office:"Back Office", ventes_marketing:"Ventes & Marketing", fonctions_supports:"Fonctions supports" };
const BUDGET_LABELS  = { moins_1k:"< 1 000 €/mois", "1k_5k":"1 000–5 000 €", "5k_15k":"5 000–15 000 €", "15k_plus":"+ 15 000 €/mois" };
const DELAI_LABELS   = { immediat:"⚡ Immédiat", "1_mois":"📅 Sous 1 mois", "3_mois":"🗓️ Sous 3 mois", exploration:"🔭 Exploration" };
const DELAI_COLORS   = { immediat:"#ef4444", "1_mois":"#f59e0b", "3_mois":"#3b82f6", exploration:"#64748b" };

/* ══════════════════════════════════════════
   LOGIN  (light theme)
══════════════════════════════════════════ */
function AdminLogin({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("Remplissez tous les champs."); return; }
    setLoading(true); setError("");
    try {
      const res  = await fetch(`${API}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:email.toLowerCase(),password})});
      const data = await res.json();
      if (!res.ok) { setError("Identifiants incorrects."); setLoading(false); return; }
      if (data.user.role!=="admin") { setError("Accès refusé — administrateurs uniquement."); setLoading(false); return; }
      localStorage.setItem("adminToken",data.token);
      localStorage.setItem("adminUser",JSON.stringify(data.user));
      onLogin(data.user,data.token);
    } catch { setError("Erreur réseau."); }
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",background:"#f0f2f5",fontFamily:"'Nunito',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box}
      `}</style>

      {/* Left panel */}
      <div style={{width:"45%",background:"linear-gradient(145deg,#1e3a5f 0%,#2563eb 100%)",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"3rem",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",width:"320px",height:"320px",borderRadius:"50%",border:"1px solid rgba(255,255,255,0.08)",top:"-60px",left:"-60px"}}/>
        <div style={{position:"absolute",width:"200px",height:"200px",borderRadius:"50%",border:"1px solid rgba(255,255,255,0.06)",bottom:"60px",right:"-40px"}}/>
        <div style={{position:"relative",zIndex:1,textAlign:"center"}}>
          <div style={{width:"64px",height:"64px",background:"rgba(255,255,255,0.15)",borderRadius:"18px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",fontWeight:900,color:"#fff",margin:"0 auto 20px",border:"1px solid rgba(255,255,255,0.25)",backdropFilter:"blur(8px)"}}>SF</div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:"32px",color:"#fff",fontWeight:700,marginBottom:"10px",lineHeight:1.2}}>SmartFlow<br/>Outsourcing</div>
          <p style={{color:"rgba(255,255,255,0.55)",fontSize:"14px",maxWidth:"260px",lineHeight:1.6}}>Plateforme d'administration BPO — gérez vos utilisateurs et candidatures en toute simplicité.</p>
          <div style={{marginTop:"32px",display:"flex",gap:"20px",justifyContent:"center"}}>
            {[["100+","Clients"],["4","Services"],["24/7","Support"]].map(([v,l])=>(
              <div key={l} style={{textAlign:"center"}}>
                <div style={{fontSize:"22px",fontWeight:800,color:"#fff"}}>{v}</div>
                <div style={{fontSize:"11px",color:"rgba(255,255,255,0.45)",marginTop:"2px"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem"}}>
        <div style={{width:"100%",maxWidth:"400px",animation:"fadeUp .5s ease"}}>
          <div style={{marginBottom:"36px"}}>
            <h2 style={{fontFamily:"'Nunito',sans-serif",fontSize:"26px",fontWeight:800,color:"#1e293b",margin:"0 0 6px"}}>Connexion administrateur</h2>
            <p style={{color:"#94a3b8",fontSize:"14px",margin:0}}>Accès réservé au panneau SmartFlow</p>
          </div>
          {error && <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"10px",padding:"11px 14px",fontSize:"13px",color:"#dc2626",marginBottom:"18px",display:"flex",alignItems:"center",gap:"8px"}}>⚠ {error}</div>}
          {[{label:"Email administrateur",val:email,set:setEmail,type:"email",ph:"admin@smartflow.mg"},].map(f=>(
            <div key={f.label} style={{marginBottom:"16px"}}>
              <label style={{display:"block",fontSize:"12px",fontWeight:700,color:"#475569",marginBottom:"6px",letterSpacing:"0.3px"}}>{f.label}</label>
              <input value={f.val} onChange={e=>f.set(e.target.value)} type={f.type} placeholder={f.ph}
                style={{width:"100%",background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:"10px",padding:"11px 14px",fontSize:"14px",color:"#1e293b",outline:"none",fontFamily:"inherit",transition:"border-color .2s"}}
                onFocus={e=>e.target.style.borderColor="#2563eb"} onBlur={e=>e.target.style.borderColor="#e2e8f0"}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
            </div>
          ))}
          <div style={{marginBottom:"24px"}}>
            <label style={{display:"block",fontSize:"12px",fontWeight:700,color:"#475569",marginBottom:"6px"}}>Mot de passe</label>
            <div style={{position:"relative"}}>
              <input value={password} onChange={e=>setPassword(e.target.value)} type={showPwd?"text":"password"} placeholder="••••••••"
                style={{width:"100%",background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:"10px",padding:"11px 44px 11px 14px",fontSize:"14px",color:"#1e293b",outline:"none",fontFamily:"inherit",transition:"border-color .2s"}}
                onFocus={e=>e.target.style.borderColor="#2563eb"} onBlur={e=>e.target.style.borderColor="#e2e8f0"}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
              <button onClick={()=>setShowPwd(v=>!v)} style={{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:"16px",color:"#94a3b8"}}>{showPwd?"🙈":"👁️"}</button>
            </div>
          </div>
          <button onClick={handleLogin} disabled={loading}
            style={{width:"100%",padding:"13px",background:"linear-gradient(135deg,#1e3a5f,#2563eb)",border:"none",borderRadius:"10px",color:"#fff",fontSize:"14px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .2s",opacity:loading?.7:1,letterSpacing:"0.2px"}}
            onMouseEnter={e=>{if(!loading)e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 8px 20px rgba(37,99,235,0.35)"}}
            onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none"}}>
            {loading?"Connexion en cours...":"Se connecter →"}
          </button>
          <p style={{textAlign:"center",fontSize:"11px",color:"#cbd5e1",marginTop:"20px"}}>🔒 Réservé aux administrateurs SmartFlow</p>
        </div>
      </div>
    </div>
  );
}

/* ══ CIRCULAR PROGRESS ══ */
function CircularProgress({ value, max, color, size=56 }) {
  const pct = max ? Math.min(value/max*100,100) : 0;
  const r   = (size-8)/2;
  const c   = 2*Math.PI*r;
  const offset = c - (pct/100)*c;
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="5"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        style={{transition:"stroke-dashoffset .6s ease"}}/>
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        style={{transform:"rotate(90deg) translate(0,0)",fill:color,fontSize:size>50?"12px":"10px",fontWeight:700,fontFamily:"'Nunito',sans-serif"}}
        transform={`rotate(90, ${size/2}, ${size/2})`}>{Math.round(pct)}</text>
    </svg>
  );
}

/* ══ KPI CARD ══ */
function KpiCard({ label, value, sub, color, icon, trend, trendUp }) {
  return (
    <div style={{background:"#fff",borderRadius:"12px",padding:"20px 22px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1px solid #f1f5f9",borderTop:`3px solid ${color}`,display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all .2s"}}
      onMouseEnter={e=>e.currentTarget.style.boxShadow="0 6px 20px rgba(0,0,0,0.1)"}
      onMouseLeave={e=>e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)"}>
      <div>
        <div style={{fontSize:"11px",fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.8px",marginBottom:"8px"}}>{label}</div>
        <div style={{fontSize:"30px",fontWeight:800,color:"#1e293b",lineHeight:1,fontFamily:"'Nunito',sans-serif"}}>{value}</div>
        {trend && (
          <div style={{display:"flex",alignItems:"center",gap:"4px",marginTop:"6px",fontSize:"12px",color:trendUp?"#10b981":"#ef4444",fontWeight:600}}>
            {trendUp ? Icons.arrow_up : Icons.arrow_dn} {trend}
          </div>
        )}
        {sub && !trend && <div style={{fontSize:"12px",color:"#94a3b8",marginTop:"4px"}}>{sub}</div>}
      </div>
      <CircularProgress value={typeof value==="number"?value:parseInt(value)||0} max={typeof value==="number"?Math.max(value*1.5,10):100} color={color} size={58}/>
    </div>
  );
}

/* ══ ROLE BADGE ══ */
const RoleBadge = ({role}) => {
  const cfg = {
    admin:    {bg:"#eef2ff",color:"#4f46e5",label:"Admin"},
    candidat: {bg:"#f0fdf4",color:"#16a34a",label:"Candidat"},
  };
  const c = cfg[role]||cfg.candidat;
  return <span style={{background:c.bg,color:c.color,borderRadius:"5px",padding:"2px 9px",fontSize:"11px",fontWeight:700}}>{c.label}</span>;
};

/* ══ CHARTS ══ */
function LineChartWidget({users}) {
  const days = Array.from({length:7},(_,i)=>{
    const d=new Date(); d.setDate(d.getDate()-(6-i));
    return {label:d.toLocaleDateString("fr-FR",{weekday:"short",day:"numeric"}),date:d.toDateString(),count:0};
  });
  users.forEach(u=>{const day=days.find(d=>d.date===new Date(u.created_at).toDateString());if(day)day.count++;});
  return (
    <ResponsiveContainer width="100%" height={210}>
      <BarChart data={days} margin={{top:5,right:10,left:-20,bottom:0}}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
        <XAxis dataKey="label" tick={{fill:"#94a3b8",fontSize:11}} axisLine={false} tickLine={false}/>
        <YAxis tick={{fill:"#94a3b8",fontSize:11}} axisLine={false} tickLine={false} allowDecimals={false}/>
        <Tooltip contentStyle={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:"10px",fontSize:"12px",color:"#1e293b",boxShadow:"0 4px 12px rgba(0,0,0,0.08)"}} formatter={v=>[`${v} inscription(s)`,""]}/>
        <Bar dataKey="count" radius={[6,6,0,0]} fill="#3b82f6" opacity={0.85}/>
      </BarChart>
    </ResponsiveContainer>
  );
}

function DonutChart({candidats,admins,total}) {
  const data=[{name:"Candidats",value:candidats,color:"#10b981"},{name:"Admins",value:admins,color:"#3b82f6"}].filter(d=>d.value>0);
  if(total===0) return <div style={{textAlign:"center",padding:"40px 0",color:"#94a3b8",fontSize:"13px"}}>Aucune donnée</div>;
  const pct = total ? Math.round(candidats/total*100) : 0;
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
      <div style={{position:"relative",width:"180px",height:"180px"}}>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={62} outerRadius={82} paddingAngle={3} dataKey="value">
              {data.map((d,i)=><Cell key={i} fill={d.color}/>)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
          <div style={{fontSize:"26px",fontWeight:800,color:"#1e293b"}}>{pct}%</div>
          <div style={{fontSize:"10px",color:"#94a3b8",fontWeight:600}}>Candidats</div>
        </div>
      </div>
      <div style={{display:"flex",gap:"18px",marginTop:"12px"}}>
        {data.map(d=>(
          <div key={d.name} style={{display:"flex",alignItems:"center",gap:"7px"}}>
            <div style={{width:"10px",height:"10px",borderRadius:"50%",background:d.color}}/>
            <span style={{fontSize:"12px",color:"#64748b"}}>{d.name}</span>
            <span style={{fontSize:"12px",fontWeight:700,color:"#1e293b"}}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesBarChart({candidatures}) {
  const counts={};
  candidatures.forEach(c=>(c.service||"").split(",").map(s=>s.trim()).filter(Boolean).forEach(s=>{counts[s]=(counts[s]||0)+1;}));
  const data=Object.entries(SERVICE_LABELS).map(([id,label])=>({label,count:counts[id]||0}));
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{top:5,right:10,left:-20,bottom:0}}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
        <XAxis dataKey="label" tick={{fill:"#94a3b8",fontSize:9}} axisLine={false} tickLine={false}/>
        <YAxis tick={{fill:"#94a3b8",fontSize:11}} axisLine={false} tickLine={false} allowDecimals={false}/>
        <Tooltip contentStyle={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:"10px",fontSize:"12px",color:"#1e293b",boxShadow:"0 4px 12px rgba(0,0,0,0.08)"}} formatter={v=>[`${v} demande(s)`,""]}/>
        <Bar dataKey="count" radius={[6,6,0,0]}>{data.map((_,i)=><Cell key={i} fill={["#3b82f6","#8b5cf6","#06b6d4","#10b981"][i%4]}/>)}</Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function DelaiBarChart({candidatures}) {
  const data=Object.entries(DELAI_LABELS).map(([id,label])=>({label:label.replace(/[⚡📅🗓️🔭]\s/,""),count:candidatures.filter(c=>c.delai===id).length,color:DELAI_COLORS[id]}));
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{top:5,right:10,left:-20,bottom:0}}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
        <XAxis dataKey="label" tick={{fill:"#94a3b8",fontSize:10}} axisLine={false} tickLine={false}/>
        <YAxis tick={{fill:"#94a3b8",fontSize:11}} axisLine={false} tickLine={false} allowDecimals={false}/>
        <Tooltip contentStyle={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:"10px",fontSize:"12px",color:"#1e293b",boxShadow:"0 4px 12px rgba(0,0,0,0.08)"}} formatter={v=>[`${v} dossier(s)`,""]}/>
        <Bar dataKey="count" radius={[6,6,0,0]}>{data.map((d,i)=><Cell key={i} fill={d.color}/>)}</Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ══ PROGRESS BAR ══ */
function ProgressBar({label,value,max,color}) {
  const pct = max ? Math.min(value/max*100,100) : 0;
  return (
    <div style={{marginBottom:"14px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
        <span style={{fontSize:"12px",color:"#64748b",fontWeight:600}}>{label}</span>
        <span style={{fontSize:"12px",fontWeight:700,color}}>{Math.round(pct)}%</span>
      </div>
      <div style={{height:"6px",background:"#f1f5f9",borderRadius:"999px",overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:"999px",transition:"width .6s ease"}}/>
      </div>
    </div>
  );
}

/* ══ MODALS ══ */
function UserModal({user,onClose,onDelete}) {
  if(!user) return null;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.5)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:"1rem"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"18px",padding:"2rem",width:"100%",maxWidth:"420px",fontFamily:"'Nunito',sans-serif",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px"}}>
          <h3 style={{color:"#1e293b",fontSize:"18px",fontWeight:800,margin:0}}>Détails utilisateur</h3>
          <button onClick={onClose} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"8px",width:"32px",height:"32px",cursor:"pointer",color:"#64748b",display:"flex",alignItems:"center",justifyContent:"center"}}>{Icons.close}</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"20px",padding:"14px",background:"#f8fafc",borderRadius:"12px",border:"1px solid #e2e8f0"}}>
          <div style={{width:"50px",height:"50px",borderRadius:"50%",background:"linear-gradient(135deg,#3b82f6,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",fontWeight:800,color:"#fff"}}>{user.prenom?.[0]}{user.nom?.[0]}</div>
          <div>
            <div style={{color:"#1e293b",fontWeight:700,fontSize:"16px"}}>{user.prenom} {user.nom}</div>
            <div style={{color:"#94a3b8",fontSize:"12px",marginTop:"2px"}}>{user.email}</div>
            <div style={{marginTop:"6px"}}><RoleBadge role={user.role}/></div>
          </div>
        </div>
        {[["ID","#"+user.id],["Nom complet",`${user.prenom} ${user.nom}`],["Email",user.email],["Rôle",user.role],["Inscrit le",new Date(user.created_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid #f1f5f9"}}>
            <span style={{fontSize:"12px",color:"#94a3b8"}}>{k}</span>
            <span style={{fontSize:"13px",color:"#1e293b",fontWeight:600,textAlign:"right",maxWidth:"60%",wordBreak:"break-all"}}>{v}</span>
          </div>
        ))}
        <div style={{display:"flex",gap:"10px",marginTop:"20px"}}>
          <button onClick={onClose} style={{flex:1,padding:"11px",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"10px",color:"#64748b",fontSize:"13px",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Fermer</button>
          <button onClick={()=>{onDelete(user.id);onClose();}} style={{flex:1,padding:"11px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"10px",color:"#dc2626",fontSize:"13px",cursor:"pointer",fontFamily:"inherit",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}>
            {Icons.trash} Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

function CandidatureModal({candidature,onClose,onDelete}) {
  if(!candidature) return null;
  const services=(candidature.service||"").split(",").map(s=>s.trim()).filter(Boolean);
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.5)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999,padding:"1rem"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"18px",padding:"2rem",width:"100%",maxWidth:"460px",fontFamily:"'Nunito',sans-serif",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px"}}>
          <h3 style={{color:"#1e293b",fontSize:"18px",fontWeight:800,margin:0}}>Dossier BPO #{candidature.id}</h3>
          <button onClick={onClose} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"8px",width:"32px",height:"32px",cursor:"pointer",color:"#64748b",display:"flex",alignItems:"center",justifyContent:"center"}}>{Icons.close}</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"14px",padding:"14px",background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:"12px",marginBottom:"18px"}}>
          <div style={{width:"44px",height:"44px",borderRadius:"50%",background:"linear-gradient(135deg,#059669,#10b981)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"15px",fontWeight:800,color:"#fff"}}>{(candidature.prenom||"?")[0]}{(candidature.nom||"?")[0]}</div>
          <div style={{flex:1}}>
            <div style={{color:"#1e293b",fontWeight:700,fontSize:"14px"}}>{candidature.prenom} {candidature.nom}</div>
            <div style={{color:"#64748b",fontSize:"12px",marginTop:"2px",display:"flex",alignItems:"center",gap:"4px"}}>{Icons.mail} {candidature.email}</div>
          </div>
          <span style={{background:"#dcfce7",color:"#16a34a",borderRadius:"6px",padding:"3px 10px",fontSize:"11px",fontWeight:700}}>✓ Soumis</span>
        </div>
        <div style={{marginBottom:"14px"}}>
          <div style={{fontSize:"11px",fontWeight:700,color:"#94a3b8",letterSpacing:"0.6px",textTransform:"uppercase",marginBottom:"8px"}}>Services demandés</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
            {services.length>0?services.map(s=><span key={s} style={{background:"#eff6ff",color:"#2563eb",borderRadius:"6px",padding:"4px 10px",fontSize:"12px",fontWeight:600}}>{SERVICE_LABELS[s]||s}</span>):<span style={{color:"#94a3b8",fontSize:"12px"}}>—</span>}
          </div>
        </div>
        {[["Budget",Icons.euro,BUDGET_LABELS[candidature.budget]||candidature.budget||"—"],["Délai",Icons.clock,DELAI_LABELS[candidature.delai]||candidature.delai||"—"],["Soumis le",Icons.clock,candidature.created_at?new Date(candidature.created_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"}):"—"]].map(([label,icon,val])=>(
          <div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid #f1f5f9"}}>
            <span style={{fontSize:"12px",color:"#94a3b8",display:"flex",alignItems:"center",gap:"6px"}}>{icon} {label}</span>
            <span style={{fontSize:"13px",color:"#1e293b",fontWeight:600}}>{val}</span>
          </div>
        ))}
        {candidature.besoin && (
          <div style={{marginTop:"14px",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"10px",padding:"12px 14px"}}>
            <div style={{fontSize:"11px",fontWeight:700,color:"#94a3b8",letterSpacing:"0.6px",textTransform:"uppercase",marginBottom:"6px"}}>Besoin exprimé</div>
            <p style={{margin:0,fontSize:"13px",color:"#475569",lineHeight:1.7,fontStyle:"italic"}}>"{candidature.besoin}"</p>
          </div>
        )}
        <div style={{display:"flex",gap:"10px",marginTop:"20px"}}>
          <button onClick={onClose} style={{flex:1,padding:"11px",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"10px",color:"#64748b",fontSize:"13px",cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Fermer</button>
          {onDelete&&<button onClick={()=>{onDelete(candidature.id);onClose();}} style={{flex:1,padding:"11px",background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"10px",color:"#dc2626",fontSize:"13px",cursor:"pointer",fontFamily:"inherit",fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:"6px"}}>{Icons.trash} Supprimer</button>}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   DASHBOARD  (light professional theme)
══════════════════════════════════════════ */
function Dashboard({admin,token,onLogout}) {
  const [users,setUsers]               = useState([]);
  const [candidatures,setCandidatures] = useState([]);
  const [loadingUsers,setLoadingUsers] = useState(true);
  const [loadingCands,setLoadingCands] = useState(true);
  const [search,setSearch]             = useState("");
  const [searchCand,setSearchCand]     = useState("");
  const [filterRole,setFilterRole]     = useState("tous");
  const [filterDelai,setFilterDelai]   = useState("tous");
  const [selectedUser,setSelectedUser] = useState(null);
  const [selectedCand,setSelectedCand] = useState(null);
  const [activeTab,setActiveTab]       = useState("stats");
  const [toastMsg,setToastMsg]         = useState(null);

  const showToast=(msg,type="success")=>{setToastMsg({msg,type});setTimeout(()=>setToastMsg(null),3500);};

  const fetchUsers=async()=>{
    setLoadingUsers(true);
    try{const res=await fetch(`${API}/all`,{headers:{"Authorization":`Bearer ${token}`}});const data=await res.json();if(res.ok)setUsers(Array.isArray(data)?data:[]);else showToast("Erreur chargement","error");}catch{showToast("Erreur réseau","error");}
    setLoadingUsers(false);
  };
  const fetchCandidatures=async()=>{
    setLoadingCands(true);
    try{const res=await fetch(`${API}/candidatures`,{headers:{"Authorization":`Bearer ${token}`}});const data=await res.json();if(res.ok)setCandidatures(Array.isArray(data)?data:[]);else showToast("Erreur chargement","error");}catch{showToast("Erreur réseau","error");}
    setLoadingCands(false);
  };

  useEffect(()=>{fetchUsers();fetchCandidatures();},[]);

  const handleDeleteUser=async(id)=>{
    if(!window.confirm("Supprimer cet utilisateur ?"))return;
    try{const res=await fetch(`${API}/${id}`,{method:"DELETE",headers:{"Authorization":`Bearer ${token}`}});if(res.ok){setUsers(u=>u.filter(x=>x.id!==id));showToast("Utilisateur supprimé ✓");}else showToast("Erreur suppression","error");}catch{showToast("Erreur réseau","error");}
  };
  const handleDeleteCand=async(id)=>{
    if(!window.confirm("Supprimer cette candidature ?"))return;
    try{const res=await fetch(`${API}/candidature/${id}`,{method:"DELETE",headers:{"Authorization":`Bearer ${token}`}});if(res.ok){setCandidatures(c=>c.filter(x=>x.id!==id));showToast("Candidature supprimée ✓");}else showToast("Erreur suppression","error");}catch{showToast("Erreur réseau","error");}
  };

  const filteredUsers=users.filter(u=>{
    const q=search.toLowerCase();
    return(!q||u.nom?.toLowerCase().includes(q)||u.prenom?.toLowerCase().includes(q)||u.email?.toLowerCase().includes(q))&&(filterRole==="tous"||u.role===filterRole);
  });
  const filteredCands=candidatures.filter(c=>{
    const q=searchCand.toLowerCase();
    return(!q||c.nom?.toLowerCase().includes(q)||c.prenom?.toLowerCase().includes(q)||c.email?.toLowerCase().includes(q)||c.service?.toLowerCase().includes(q))&&(filterDelai==="tous"||c.delai===filterDelai);
  });

  const stats={
    total:users.length,admins:users.filter(u=>u.role==="admin").length,candidats:users.filter(u=>u.role==="candidat").length,
    today:users.filter(u=>new Date(u.created_at).toDateString()===new Date().toDateString()).length,
    totalCands:candidatures.length,immediat:candidatures.filter(c=>c.delai==="immediat").length,
  };

  const NAV=[
    {id:"stats",icon:Icons.home,label:"Dashboard"},
    {id:"users",icon:Icons.users,label:"Utilisateurs",badge:stats.total,bColor:"#3b82f6"},
    {id:"candidatures",icon:Icons.briefcase,label:"Candidatures",badge:stats.totalCands,bColor:"#10b981"},
  ];

  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#f0f2f5",fontFamily:"'Nunito',sans-serif",color:"#1e293b"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
        @keyframes toastIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#f1f5f9}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}
        .trow:hover{background:#f8fafc!important}
        .nav-btn:hover{background:#eff6ff!important;color:#2563eb!important}
        .action-btn:hover{opacity:.8}
      `}</style>

      {/* TOAST */}
      {toastMsg&&(
        <div style={{position:"fixed",bottom:"24px",right:"24px",zIndex:99999,background:toastMsg.type==="error"?"#fef2f2":"#f0fdf4",border:`1px solid ${toastMsg.type==="error"?"#fecaca":"#bbf7d0"}`,borderRadius:"12px",padding:"12px 18px",color:toastMsg.type==="error"?"#dc2626":"#16a34a",fontSize:"13px",fontFamily:"inherit",animation:"toastIn .3s ease",display:"flex",alignItems:"center",gap:"8px",boxShadow:"0 4px 16px rgba(0,0,0,0.1)"}}>
          {toastMsg.type==="error"?"❌":"✅"} {toastMsg.msg}
        </div>
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{width:"230px",flexShrink:0,background:"#fff",borderRight:"1px solid #e2e8f0",padding:"0",display:"flex",flexDirection:"column",height:"100vh",position:"sticky",top:0,boxShadow:"1px 0 0 #f1f5f9"}}>
        {/* Logo */}
        <div style={{padding:"24px 20px 20px",borderBottom:"1px solid #f1f5f9"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <div style={{width:"38px",height:"38px",background:"linear-gradient(135deg,#1e3a5f,#2563eb)",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",fontWeight:900,color:"#fff",flexShrink:0}}>SF</div>
            <div>
              <div style={{color:"#1e293b",fontWeight:800,fontSize:"15px",lineHeight:1}}>SmartFlow</div>
              <div style={{color:"#94a3b8",fontSize:"10px",fontWeight:600,letterSpacing:"1px",marginTop:"2px"}}>ADMIN PANEL</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{flex:1,padding:"14px 12px",display:"flex",flexDirection:"column",gap:"3px",overflowY:"auto"}}>
          <div style={{fontSize:"10px",fontWeight:700,color:"#94a3b8",letterSpacing:"1px",textTransform:"uppercase",padding:"4px 8px",marginBottom:"4px"}}>Menu</div>
          {NAV.map(item=>(
            <button key={item.id} className="nav-btn" onClick={()=>setActiveTab(item.id)} style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 12px",borderRadius:"9px",border:"none",background:activeTab===item.id?"#eff6ff":"transparent",color:activeTab===item.id?"#2563eb":"#475569",cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontSize:"13px",fontWeight:activeTab===item.id?700:500,textAlign:"left",transition:"all .18s",width:"100%"}}>
              <span style={{color:activeTab===item.id?"#2563eb":"#94a3b8",flexShrink:0}}>{item.icon}</span>
              <span style={{flex:1}}>{item.label}</span>
              {item.badge!==undefined&&<span style={{background:item.bColor+"22",color:item.bColor,borderRadius:"999px",padding:"1px 7px",fontSize:"10px",fontWeight:700,minWidth:"22px",textAlign:"center"}}>{item.badge}</span>}
            </button>
          ))}
          <div style={{fontSize:"10px",fontWeight:700,color:"#94a3b8",letterSpacing:"1px",textTransform:"uppercase",padding:"14px 8px 4px",marginTop:"4px"}}>Configuration</div>
          <button className="nav-btn" style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 12px",borderRadius:"9px",border:"none",background:"transparent",color:"#475569",cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontSize:"13px",fontWeight:500,textAlign:"left",transition:"all .18s",width:"100%"}}>
            <span style={{color:"#94a3b8"}}>{Icons.settings}</span> Paramètres
          </button>
        </nav>

        {/* Admin info */}
        <div style={{padding:"14px 12px",borderTop:"1px solid #f1f5f9"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 12px",background:"#f8fafc",borderRadius:"10px",border:"1px solid #f1f5f9",marginBottom:"8px"}}>
            <div style={{width:"34px",height:"34px",borderRadius:"50%",background:"linear-gradient(135deg,#2563eb,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:800,color:"#fff",flexShrink:0}}>{admin.prenom?.[0]}{admin.nom?.[0]}</div>
            <div style={{minWidth:0}}>
              <div style={{color:"#1e293b",fontSize:"12px",fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{admin.prenom} {admin.nom}</div>
              <div style={{color:"#3b82f6",fontSize:"10px",fontWeight:600}}>Administrateur</div>
            </div>
          </div>
          <button onClick={onLogout} className="nav-btn" style={{display:"flex",alignItems:"center",gap:"10px",padding:"9px 12px",borderRadius:"9px",border:"none",background:"transparent",color:"#ef4444",cursor:"pointer",fontFamily:"'Nunito',sans-serif",fontSize:"13px",fontWeight:600,width:"100%",textAlign:"left",transition:"all .18s"}}>
            {Icons.logout} Déconnexion
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{flex:1,padding:"28px 32px",overflowY:"auto"}}>

        {/* Breadcrumb */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"24px",flexWrap:"wrap",gap:"12px"}}>
          <div>
            <h1 style={{fontSize:"22px",fontWeight:800,color:"#1e293b",margin:"0 0 4px"}}>{activeTab==="stats"?"Dashboard":activeTab==="users"?"Utilisateurs":"Candidatures BPO"}</h1>
            <div style={{fontSize:"12px",color:"#94a3b8",display:"flex",alignItems:"center",gap:"6px"}}>
              <span style={{color:"#64748b",fontWeight:600}}>SmartFlow</span>
              <span>/</span>
              <span>{activeTab==="stats"?"Dashboard":activeTab==="users"?"Utilisateurs":"Candidatures"}</span>
            </div>
          </div>
          <div style={{display:"flex",gap:"8px"}}>
            <button onClick={activeTab==="users"?fetchUsers:fetchCandidatures} style={{display:"flex",alignItems:"center",gap:"6px",padding:"9px 16px",background:"#fff",border:"1px solid #e2e8f0",borderRadius:"9px",color:"#475569",fontSize:"13px",cursor:"pointer",fontFamily:"inherit",fontWeight:600,boxShadow:"0 1px 3px rgba(0,0,0,0.05)",transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="#3b82f6"} onMouseLeave={e=>e.currentTarget.style.borderColor="#e2e8f0"}>
              {Icons.refresh} Actualiser
            </button>
          </div>
        </div>

        {/* ── STATS TAB ── */}
        {activeTab==="stats" && (
          <div style={{animation:"fadeUp .35s ease"}}>
            {/* KPI row */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"14px",marginBottom:"24px"}}>
              <KpiCard label="Nouveaux comptes" value={stats.total} color="#3b82f6" trend={`+${stats.today} aujourd'hui`} trendUp/>
              <KpiCard label="Candidatures BPO"  value={stats.totalCands} color="#10b981" sub={`${stats.immediat} immédiats`} trend={stats.immediat>0?`${stats.immediat} urgents`:null} trendUp={false}/>
              <KpiCard label="Candidats inscrits" value={stats.candidats} color="#8b5cf6" sub="comptes actifs"/>
              <KpiCard label="Administrateurs"   value={stats.admins}    color="#f59e0b" sub="accès complet"/>
            </div>

            {/* Charts row 1 */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:"16px",marginBottom:"16px"}}>
              <div style={{background:"#fff",borderRadius:"12px",padding:"22px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1px solid #f1f5f9"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"18px"}}>
                  <div>
                    <div style={{fontSize:"15px",fontWeight:800,color:"#1e293b"}}>Inscriptions — 7 derniers jours</div>
                    <div style={{fontSize:"12px",color:"#94a3b8",marginTop:"2px"}}>Nouveaux utilisateurs par jour</div>
                  </div>
                </div>
                <LineChartWidget users={users}/>
              </div>
              <div style={{background:"#fff",borderRadius:"12px",padding:"22px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1px solid #f1f5f9"}}>
                <div style={{fontSize:"15px",fontWeight:800,color:"#1e293b",marginBottom:"4px"}}>Répartition des rôles</div>
                <div style={{fontSize:"12px",color:"#94a3b8",marginBottom:"16px"}}>Vue globale des comptes</div>
                <DonutChart candidats={stats.candidats} admins={stats.admins} total={stats.total}/>
              </div>
            </div>

            {/* Charts row 2 */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"16px"}}>
              <div style={{background:"#fff",borderRadius:"12px",padding:"22px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1px solid #f1f5f9"}}>
                <div style={{fontSize:"14px",fontWeight:800,color:"#1e293b",marginBottom:"4px"}}>Services demandés</div>
                <div style={{fontSize:"12px",color:"#94a3b8",marginBottom:"16px"}}>Répartition par département BPO</div>
                <ServicesBarChart candidatures={candidatures}/>
              </div>
              <div style={{background:"#fff",borderRadius:"12px",padding:"22px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1px solid #f1f5f9"}}>
                <div style={{fontSize:"14px",fontWeight:800,color:"#1e293b",marginBottom:"4px"}}>Délais de démarrage</div>
                <div style={{fontSize:"12px",color:"#94a3b8",marginBottom:"16px"}}>Urgence des dossiers BPO</div>
                <DelaiBarChart candidatures={candidatures}/>
              </div>
            </div>

            {/* Bottom: recent + targets */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
              {/* Recent users */}
              <div style={{background:"#fff",borderRadius:"12px",padding:"22px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1px solid #f1f5f9"}}>
                <div style={{fontSize:"14px",fontWeight:800,color:"#1e293b",marginBottom:"16px",display:"flex",alignItems:"center",gap:"8px"}}>{Icons.users} Derniers inscrits</div>
                {users.slice(0,5).map((u,i)=>(
                  <div key={u.id} style={{display:"flex",alignItems:"center",gap:"10px",padding:"9px 0",borderBottom:i<4?"1px solid #f8fafc":"none"}}>
                    <div style={{width:"34px",height:"34px",borderRadius:"50%",background:"linear-gradient(135deg,#3b82f6,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:800,color:"#fff",flexShrink:0}}>{u.prenom?.[0]}{u.nom?.[0]}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{color:"#1e293b",fontSize:"13px",fontWeight:600}}>{u.prenom} {u.nom}</div>
                      <div style={{color:"#94a3b8",fontSize:"11px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <RoleBadge role={u.role}/>
                      <div style={{color:"#94a3b8",fontSize:"10px",marginTop:"2px"}}>{new Date(u.created_at).toLocaleDateString("fr-FR")}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Targets / progress */}
              <div style={{background:"#fff",borderRadius:"12px",padding:"22px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1px solid #f1f5f9"}}>
                <div style={{fontSize:"14px",fontWeight:800,color:"#1e293b",marginBottom:"4px"}}>Objectifs de la plateforme</div>
                <div style={{fontSize:"12px",color:"#94a3b8",marginBottom:"20px"}}>Progression des métriques clés</div>
                <ProgressBar label="Taux de candidatures" value={stats.totalCands} max={Math.max(stats.totalCands*1.2,20)} color="#3b82f6"/>
                <ProgressBar label="Candidats actifs"     value={stats.candidats}  max={Math.max(stats.total,1)}           color="#10b981"/>
                <ProgressBar label="Dossiers urgents"     value={stats.immediat}   max={Math.max(stats.totalCands,1)}      color="#ef4444"/>
                <ProgressBar label="Couverture admin"     value={stats.admins}     max={Math.max(stats.total,1)}           color="#f59e0b"/>
                <div style={{marginTop:"20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                  {[{label:"Total utilisateurs",v:stats.total,c:"#3b82f6"},{label:"Dossiers BPO",v:stats.totalCands,c:"#10b981"},{label:"Démarrage immédiat",v:stats.immediat,c:"#ef4444"},{label:"Admins actifs",v:stats.admins,c:"#f59e0b"}].map(x=>(
                    <div key={x.label} style={{background:"#f8fafc",borderRadius:"10px",padding:"12px",border:"1px solid #f1f5f9"}}>
                      <div style={{fontSize:"20px",fontWeight:800,color:x.c}}>{x.v}</div>
                      <div style={{fontSize:"11px",color:"#94a3b8",marginTop:"2px"}}>{x.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab==="users" && (
          <div style={{animation:"fadeUp .35s ease"}}>
            <div style={{background:"#fff",borderRadius:"12px",padding:"20px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1px solid #f1f5f9",marginBottom:"16px",display:"flex",gap:"10px",flexWrap:"wrap",alignItems:"center"}}>
              <div style={{position:"relative",flex:1,minWidth:"220px"}}>
                <span style={{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"#94a3b8"}}>{Icons.search}</span>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un utilisateur..." style={{width:"100%",background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:"9px",padding:"10px 14px 10px 36px",fontSize:"13px",color:"#1e293b",fontFamily:"inherit",outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor="#3b82f6"} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
              </div>
              {["tous","candidat","admin"].map(r=>(
                <button key={r} onClick={()=>setFilterRole(r)} style={{padding:"9px 16px",borderRadius:"9px",border:`1.5px solid ${filterRole===r?"#3b82f6":"#e2e8f0"}`,background:filterRole===r?"#eff6ff":"#fff",color:filterRole===r?"#2563eb":"#64748b",fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}>
                  {r==="tous"?"Tous":r==="admin"?"Admins":"Candidats"}
                </button>
              ))}
            </div>

            <div style={{background:"#fff",borderRadius:"12px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1px solid #f1f5f9",overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"46px 1fr 1fr 90px 120px 80px",gap:"12px",padding:"12px 20px",borderBottom:"1px solid #f1f5f9",fontSize:"10px",fontWeight:700,color:"#94a3b8",letterSpacing:"0.8px",textTransform:"uppercase",background:"#f8fafc"}}>
                <span>ID</span><span>Utilisateur</span><span>Email</span><span>Rôle</span><span>Inscrit le</span><span style={{textAlign:"right"}}>Actions</span>
              </div>
              {loadingUsers?<div style={{padding:"48px",textAlign:"center",color:"#94a3b8",fontSize:"14px"}}>Chargement...</div>
              :filteredUsers.length===0?<div style={{padding:"48px",textAlign:"center",color:"#94a3b8",fontSize:"14px"}}>Aucun utilisateur trouvé.</div>
              :filteredUsers.map((u,i)=>(
                <div key={u.id} className="trow" onClick={()=>setSelectedUser(u)} style={{display:"grid",gridTemplateColumns:"46px 1fr 1fr 90px 120px 80px",gap:"12px",padding:"13px 20px",borderBottom:i<filteredUsers.length-1?"1px solid #f8fafc":"none",alignItems:"center",transition:"background .15s",cursor:"pointer",animation:`slideIn .3s ease ${Math.min(i*0.04,0.4)}s both`}}>
                  <span style={{fontSize:"11px",color:"#94a3b8",fontWeight:700}}>#{u.id}</span>
                  <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <div style={{width:"32px",height:"32px",borderRadius:"50%",background:"linear-gradient(135deg,#3b82f6,#6366f1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:800,color:"#fff",flexShrink:0}}>{u.prenom?.[0]}{u.nom?.[0]}</div>
                    <span style={{color:"#1e293b",fontSize:"13px",fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.prenom} {u.nom}</span>
                  </div>
                  <span style={{color:"#64748b",fontSize:"12px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.email}</span>
                  <span><RoleBadge role={u.role}/></span>
                  <span style={{color:"#94a3b8",fontSize:"11px",fontWeight:600}}>{new Date(u.created_at).toLocaleDateString("fr-FR")}</span>
                  <div style={{display:"flex",gap:"5px",justifyContent:"flex-end"}} onClick={e=>e.stopPropagation()}>
                    <button className="action-btn" onClick={()=>setSelectedUser(u)} style={{width:"28px",height:"28px",borderRadius:"7px",background:"#eff6ff",border:"1px solid #dbeafe",cursor:"pointer",color:"#2563eb",display:"flex",alignItems:"center",justifyContent:"center",transition:"opacity .15s"}}>{Icons.eye}</button>
                    <button className="action-btn" onClick={()=>handleDeleteUser(u.id)} style={{width:"28px",height:"28px",borderRadius:"7px",background:"#fef2f2",border:"1px solid #fecaca",cursor:"pointer",color:"#dc2626",display:"flex",alignItems:"center",justifyContent:"center",transition:"opacity .15s"}}>{Icons.trash}</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{marginTop:"10px",fontSize:"11px",color:"#94a3b8",textAlign:"right",fontWeight:600}}>{filteredUsers.length} résultat{filteredUsers.length!==1?"s":""} affiché{filteredUsers.length!==1?"s":""}</div>
          </div>
        )}

        {/* ── CANDIDATURES TAB ── */}
        {activeTab==="candidatures" && (
          <div style={{animation:"fadeUp .35s ease"}}>
            <div style={{background:"#fff",borderRadius:"12px",padding:"20px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1px solid #f1f5f9",marginBottom:"16px",display:"flex",gap:"10px",flexWrap:"wrap",alignItems:"center"}}>
              <div style={{position:"relative",flex:1,minWidth:"220px"}}>
                <span style={{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"#94a3b8"}}>{Icons.search}</span>
                <input value={searchCand} onChange={e=>setSearchCand(e.target.value)} placeholder="Rechercher une candidature..." style={{width:"100%",background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:"9px",padding:"10px 14px 10px 36px",fontSize:"13px",color:"#1e293b",fontFamily:"inherit",outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor="#10b981"} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
              </div>
              {["tous","immediat","1_mois","3_mois","exploration"].map(d=>(
                <button key={d} onClick={()=>setFilterDelai(d)} style={{padding:"9px 14px",borderRadius:"9px",border:`1.5px solid ${filterDelai===d?"#10b981":"#e2e8f0"}`,background:filterDelai===d?"#f0fdf4":"#fff",color:filterDelai===d?"#16a34a":"#64748b",fontSize:"12px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all .2s",whiteSpace:"nowrap"}}>
                  {d==="tous"?"Tous":DELAI_LABELS[d]||d}
                </button>
              ))}
            </div>

            <div style={{background:"#fff",borderRadius:"12px",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",border:"1px solid #f1f5f9",overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"46px 1fr 1fr 130px 110px 110px 80px",gap:"10px",padding:"12px 20px",borderBottom:"1px solid #f1f5f9",fontSize:"10px",fontWeight:700,color:"#94a3b8",letterSpacing:"0.8px",textTransform:"uppercase",background:"#f8fafc"}}>
                <span>ID</span><span>Client</span><span>Services</span><span>Budget</span><span>Délai</span><span>Date</span><span style={{textAlign:"right"}}>Actions</span>
              </div>
              {loadingCands?<div style={{padding:"48px",textAlign:"center",color:"#94a3b8",fontSize:"14px"}}>Chargement...</div>
              :filteredCands.length===0?<div style={{padding:"56px",textAlign:"center"}}><div style={{fontSize:"36px",marginBottom:"12px"}}>📋</div><div style={{color:"#94a3b8",fontSize:"14px"}}>Aucune candidature trouvée</div></div>
              :filteredCands.map((c,i)=>{
                const services=(c.service||"").split(",").map(s=>s.trim()).filter(Boolean);
                const dc=DELAI_COLORS[c.delai]||"#64748b";
                return (
                  <div key={c.id} className="trow" onClick={()=>setSelectedCand(c)} style={{display:"grid",gridTemplateColumns:"46px 1fr 1fr 130px 110px 110px 80px",gap:"10px",padding:"13px 20px",borderBottom:i<filteredCands.length-1?"1px solid #f8fafc":"none",alignItems:"center",transition:"background .15s",cursor:"pointer",animation:`slideIn .3s ease ${Math.min(i*0.04,0.4)}s both`}}>
                    <span style={{fontSize:"11px",color:"#94a3b8",fontWeight:700}}>#{c.id}</span>
                    <div style={{display:"flex",alignItems:"center",gap:"9px"}}>
                      <div style={{width:"32px",height:"32px",borderRadius:"50%",background:"linear-gradient(135deg,#059669,#10b981)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:800,color:"#fff",flexShrink:0}}>{(c.prenom||"?")[0]}{(c.nom||"?")[0]}</div>
                      <div style={{overflow:"hidden"}}>
                        <div style={{color:"#1e293b",fontSize:"13px",fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.prenom} {c.nom}</div>
                        <div style={{color:"#94a3b8",fontSize:"11px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.email}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>
                      {services.slice(0,2).map(s=><span key={s} style={{background:"#eff6ff",color:"#2563eb",borderRadius:"5px",padding:"2px 7px",fontSize:"10px",fontWeight:700,whiteSpace:"nowrap"}}>{SERVICE_LABELS[s]||s}</span>)}
                      {services.length>2&&<span style={{color:"#94a3b8",fontSize:"10px",padding:"2px 0"}}>+{services.length-2}</span>}
                    </div>
                    <span style={{color:"#475569",fontSize:"12px",fontWeight:600}}>{BUDGET_LABELS[c.budget]||c.budget||"—"}</span>
                    <span style={{background:dc+"18",border:`1px solid ${dc}55`,color:dc,borderRadius:"6px",padding:"2px 8px",fontSize:"11px",fontWeight:700,whiteSpace:"nowrap",display:"inline-block"}}>{DELAI_LABELS[c.delai]||c.delai||"—"}</span>
                    <span style={{color:"#94a3b8",fontSize:"11px",fontWeight:600}}>{c.created_at?new Date(c.created_at).toLocaleDateString("fr-FR"):"—"}</span>
                    <div style={{display:"flex",gap:"5px",justifyContent:"flex-end"}} onClick={e=>e.stopPropagation()}>
                      <button className="action-btn" onClick={()=>setSelectedCand(c)} style={{width:"28px",height:"28px",borderRadius:"7px",background:"#f0fdf4",border:"1px solid #bbf7d0",cursor:"pointer",color:"#16a34a",display:"flex",alignItems:"center",justifyContent:"center",transition:"opacity .15s"}}>{Icons.eye}</button>
                      <button className="action-btn" onClick={()=>handleDeleteCand(c.id)} style={{width:"28px",height:"28px",borderRadius:"7px",background:"#fef2f2",border:"1px solid #fecaca",cursor:"pointer",color:"#dc2626",display:"flex",alignItems:"center",justifyContent:"center",transition:"opacity .15s"}}>{Icons.trash}</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:"10px",fontSize:"11px",color:"#94a3b8",textAlign:"right",fontWeight:600}}>{filteredCands.length} dossier{filteredCands.length!==1?"s":""} affiché{filteredCands.length!==1?"s":""}</div>
          </div>
        )}
      </main>

      <UserModal user={selectedUser} onClose={()=>setSelectedUser(null)} onDelete={handleDeleteUser}/>
      <CandidatureModal candidature={selectedCand} onClose={()=>setSelectedCand(null)} onDelete={handleDeleteCand}/>
    </div>
  );
}

/* ══ ROOT ══ */
export default function AdminDashboard() {
  const [admin,setAdmin] = useState(()=>{try{return JSON.parse(localStorage.getItem("adminUser"));}catch{return null;}});
  const [token,setToken] = useState(()=>localStorage.getItem("adminToken")||"");
  const handleLogin  = (user,tok)=>{setAdmin(user);setToken(tok);};
  const handleLogout = ()=>{localStorage.removeItem("adminToken");localStorage.removeItem("adminUser");setAdmin(null);setToken("");};
  if(!admin||!token) return <AdminLogin onLogin={handleLogin}/>;
  return <Dashboard admin={admin} token={token} onLogout={handleLogout}/>;
}
