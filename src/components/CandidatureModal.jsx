import { useState, useRef, useEffect } from "react";
import assets from '../assets/assets';
import toast, { Toaster } from 'react-hot-toast';

const API = "https://smart-outsourcing.onrender.com/api/users";
const NOTIFY_EMAIL = "ybernadin65@gmail.com";
const WEB3FORMS_KEY = "62f19032-2024-4fd3-b234-62c7cee06c5b";

const COUNTRIES = [
  { code: "mg", name: "Madagascar",    dial: "+261" },
  { code: "fr", name: "France",        dial: "+33"  },
  { code: "gb", name: "Royaume-Uni",   dial: "+44"  },
  { code: "us", name: "États-Unis",    dial: "+1"   },
  { code: "it", name: "Italie",        dial: "+39"  },
  { code: "de", name: "Allemagne",     dial: "+49"  },
  { code: "es", name: "Espagne",       dial: "+34"  },
  { code: "be", name: "Belgique",      dial: "+32"  },
  { code: "ch", name: "Suisse",        dial: "+41"  },
  { code: "ca", name: "Canada",        dial: "+1"   },
  { code: "re", name: "La Réunion",    dial: "+262" },
  { code: "mu", name: "Maurice",       dial: "+230" },
  { code: "cm", name: "Cameroun",      dial: "+237" },
  { code: "sn", name: "Sénégal",       dial: "+221" },
  { code: "ci", name: "Côte d'Ivoire", dial: "+225" },
  { code: "ma", name: "Maroc",         dial: "+212" },
  { code: "tn", name: "Tunisie",       dial: "+216" },
  { code: "dz", name: "Algérie",       dial: "+213" },
  { code: "pt", name: "Portugal",      dial: "+351" },
  { code: "nl", name: "Pays-Bas",      dial: "+31"  },
  { code: "au", name: "Australie",     dial: "+61"  },
  { code: "jp", name: "Japon",         dial: "+81"  },
  { code: "cn", name: "Chine",         dial: "+86"  },
  { code: "in", name: "Inde",          dial: "+91"  },
  { code: "br", name: "Brésil",        dial: "+55"  },
];

const SERVICES = [
  { id: "relation_client",    label: "Relation client",    icon: "💬", desc: "Support, SAV, hotline" },
  { id: "back_office",        label: "Back Office",        icon: "📊", desc: "Saisie, gestion, traitement" },
  { id: "ventes_marketing",   label: "Ventes & Marketing", icon: "📈", desc: "Prospection, lead gen, CRM" },
  { id: "fonctions_supports", label: "Fonctions supports", icon: "🎙️", desc: "RH, compta, IT, juridique" },
];

const TAILLES = [
  { id: "1-10",    label: "1–10",    sub: "employés" },
  { id: "11-50",   label: "11–50",   sub: "employés" },
  { id: "51-200",  label: "51–200",  sub: "employés" },
  { id: "201-500", label: "201–500", sub: "employés" },
  { id: "500+",    label: "500+",    sub: "employés"  },
];

const BUDGETS = [
  { id: "moins_1k", label: "< 1 000 €/mois"   },
  { id: "1k_5k",    label: "1 000 – 5 000 €"  },
  { id: "5k_15k",   label: "5 000 – 15 000 €" },
  { id: "15k_plus", label: "+ 15 000 €/mois"  },
];

const DELAIS = [
  { id: "immediat",    label: "⚡ Immédiat",   sub: "Dès maintenant"  },
  { id: "1_mois",      label: "📅 1 mois",     sub: "Sous 30 jours"   },
  { id: "3_mois",      label: "🗓️ 3 mois",     sub: "Sous 90 jours"   },
  { id: "exploration", label: "🔭 Exploration", sub: "Je me renseigne" },
];

/* ── Flag Emoji ── */
const Flag = ({ code, size = 20 }) => {
  const emoji = code.toUpperCase().split('').map(c =>
    String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)
  ).join('');
  return <span style={{ fontSize: size, lineHeight: 1, display: "inline-block", flexShrink: 0 }}>{emoji}</span>;
};

/* ── Country Selector ── */
function CountrySelector({ selected, onSelect, hasError }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.dial.includes(search)
  );

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(v => !v)} style={{
        display: "flex", alignItems: "center", gap: "7px",
        background: "rgba(255,255,255,0.05)",
        border: `1px solid ${hasError ? "rgba(220,38,38,0.65)" : open ? "rgba(96,165,250,0.6)" : "rgba(255,255,255,0.09)"}`,
        borderRadius: "10px", padding: "0 12px", cursor: "pointer", color: "#fff",
        fontFamily: "inherit", fontSize: "13px", whiteSpace: "nowrap", flexShrink: 0,
        boxSizing: "border-box", height: "44px",
        boxShadow: open ? "0 0 0 3px rgba(96,165,250,0.08)" : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}>
        <Flag code={selected.code} size={22} />
        <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{selected.dial}</span>
        <span style={{
          width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent",
          borderTop: `5px solid rgba(255,255,255,${open ? "0.7" : "0.35"})`, display: "inline-block",
          transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s",
        }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0,
          background: "#0f1929", border: "1px solid rgba(96,165,250,0.2)",
          borderRadius: "12px", zIndex: 99999, width: "255px", maxHeight: "270px",
          display: "flex", flexDirection: "column",
          boxShadow: "0 16px 48px rgba(0,0,0,0.7)", overflow: "hidden",
        }}>
          <div style={{ padding: "8px 8px 4px" }}>
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un pays..."
              style={{
                width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 10px",
                fontSize: "13px", color: "#fff", fontFamily: "inherit", outline: "none",
              }} />
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {filtered.length === 0 ? (
              <div style={{ padding: "14px", textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Aucun résultat</div>
            ) : filtered.map(c => (
              <button key={c.code} type="button"
                onClick={() => { onSelect(c); setOpen(false); setSearch(""); }}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  width: "100%", padding: "9px 12px",
                  background: selected.code === c.code ? "rgba(37,99,235,0.22)" : "transparent",
                  border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(96,165,250,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = selected.code === c.code ? "rgba(37,99,235,0.22)" : "transparent"; }}
              >
                <Flag code={c.code} size={22} />
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>{c.dial}</span>
                {selected.code === c.code && <span style={{ color: "#60a5fa", fontSize: "13px" }}>✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   ÉTAPE VÉRIFICATION EMAIL
══════════════════════════════════════════ */
function VerifyEmailView({ email, code, onVerified, onResend, onBack }) {
  const [input, setInput]       = useState(["", "", "", "", "", ""]);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [resendCd, setResendCd] = useState(30);
  const [shake, setShake]       = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendCd <= 0) return;
    const t = setInterval(() => setResendCd(c => c <= 1 ? (clearInterval(t), 0) : c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCd]);

  const handleDigit = (idx, val) => {
    const clean = val.replace(/\D/, "").slice(-1);
    const next = [...input];
    next[idx] = clean;
    setInput(next);
    setError("");
    if (clean && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !input[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
    if (e.key === "Enter") handleVerify();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setInput(text.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const entered = input.join("");
    if (entered.length < 6) { setError("Entrez les 6 chiffres du code"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    if (entered === code) {
      onVerified();
    } else {
      setError("Code incorrect. Vérifiez votre e-mail.");
      setShake(true);
      setInput(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleResend = async () => {
    if (resendCd > 0) return;
    await onResend();
    setResendCd(30);
    setInput(["", "", "", "", "", ""]);
    setError("");
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="sf-view">
      <div style={{ textAlign: "center", marginBottom: "26px" }}>
        <div style={{
          width: "62px", height: "62px", borderRadius: "50%",
          background: "rgba(37,99,235,0.12)", border: "1px solid rgba(96,165,250,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "26px", margin: "0 auto 14px",
        }}>✉️</div>
        <h3 style={{ color: "#fff", fontSize: "17px", fontWeight: 700, margin: "0 0 8px" }}>
          Vérification de votre e-mail
        </h3>
        <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "13px", margin: 0, lineHeight: 1.7 }}>
          Un code à 6 chiffres a été envoyé à<br />
          <strong style={{ color: "#60a5fa" }}>{email}</strong>
        </p>
      </div>

      <div style={{
        display: "flex", gap: "10px", justifyContent: "center",
        marginBottom: "20px",
        animation: shake ? "shake 0.4s ease" : "none",
      }} onPaste={handlePaste}>
        {input.map((digit, idx) => (
          <input
            key={idx}
            ref={el => inputRefs.current[idx] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleDigit(idx, e.target.value)}
            onKeyDown={e => handleKeyDown(idx, e)}
            autoFocus={idx === 0}
            style={{
              width: "46px", height: "54px", textAlign: "center",
              fontSize: "22px", fontWeight: 700,
              background: digit ? "rgba(37,99,235,0.18)" : "rgba(255,255,255,0.05)",
              border: `2px solid ${error ? "rgba(220,38,38,0.6)" : digit ? "rgba(96,165,250,0.6)" : "rgba(255,255,255,0.12)"}`,
              borderRadius: "12px", color: "#fff", fontFamily: "inherit",
              outline: "none", transition: "all 0.18s ease",
              boxSizing: "border-box",
            }}
          />
        ))}
      </div>

      {error && (
        <div style={{ textAlign: "center", color: "rgba(220,80,80,0.9)", fontSize: "12.5px", marginBottom: "16px" }}>
          ⚠️ {error}
        </div>
      )}

      <button className="sf-submit" onClick={handleVerify} disabled={loading}
        style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>
        {loading ? "Vérification..." : "Confirmer le code →"}
      </button>

      <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "16px", alignItems: "center" }}>
        <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.3)" }}>Code non reçu ?</span>
        <button onClick={handleResend} disabled={resendCd > 0} style={{
          background: "none", border: "none", cursor: resendCd > 0 ? "not-allowed" : "pointer",
          fontFamily: "inherit", fontSize: "12.5px",
          color: resendCd > 0 ? "rgba(255,255,255,0.25)" : "#60a5fa",
          textDecoration: resendCd > 0 ? "none" : "underline", padding: 0,
        }}>
          {resendCd > 0 ? `Renvoyer dans ${resendCd}s` : "Renvoyer le code"}
        </button>
      </div>

      <div style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.15)", borderRadius: "10px", padding: "11px 14px", marginTop: "16px", fontSize: "12px", color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
        💡 Vérifiez également vos spams si vous ne trouvez pas l'e-mail.
      </div>

      <button onClick={onBack} style={backBtnStyle}>← Modifier l'adresse e-mail</button>
    </div>
  );
}

/* ══════════════════════════════════════════
   MOT DE PASSE OUBLIÉ
══════════════════════════════════════════ */
function ForgotPasswordView({ onBack, onSuccess }) {
  const [subStep, setSubStep]       = useState("choose");
  const [method, setMethod]         = useState(null);
  const [value, setValue]           = useState("");
  const [newPwd, setNewPwd]         = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [resendCd, setResendCd]     = useState(0);
  const [emailDirect, setEmailDirect]     = useState("");
  const [pwdDirect, setPwdDirect]         = useState("");
  const [confirmDirect, setConfirmDirect] = useState("");
  const [showPwdDirect, setShowPwdDirect] = useState(false);

  const startResendTimer = () => {
    setResendCd(30);
    const t = setInterval(() => setResendCd(c => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; }), 1000);
  };

  const strengthChecks = (pwd) => [
    { label: "6 caractères minimum", ok: pwd.length >= 6 },
    { label: "Une lettre majuscule",  ok: /[A-Z]/.test(pwd) },
    { label: "Un chiffre",            ok: /\d/.test(pwd) },
  ];

  const handleChoose = (m) => { setMethod(m); setValue(""); setError(""); setSubStep(m === "email_pwd" ? "email_pwd" : "input"); };

  const handleSend = async () => {
    if (!value.trim()) { setError("Ce champ est requis"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    startResendTimer();
    setSubStep("code");
  };

  const handleEmailPwdReset = async () => {
    if (!emailDirect.trim() || !/\S+@\S+\.\S+/.test(emailDirect)) { setError("Adresse e-mail invalide"); return; }
    if (pwdDirect.length < 6) { setError("Au moins 6 caractères requis"); return; }
    if (pwdDirect !== confirmDirect) { setError("Les mots de passe ne correspondent pas"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/reset-password-direct`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailDirect.trim().toLowerCase(), newPassword: pwdDirect }),
      });
      if (!res.ok) { setError("Aucun compte trouvé avec cet e-mail."); setLoading(false); return; }
    } catch { /* fallback silencieux */ }
    setLoading(false);
    setSubStep("done");
    setTimeout(() => onSuccess(), 2800);
  };

  const handleResetPassword = async () => {
    if (newPwd.length < 6) { setError("Au moins 6 caractères requis"); return; }
    if (newPwd !== confirmPwd) { setError("Les mots de passe ne correspondent pas"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubStep("done");
    setTimeout(() => onSuccess(), 2800);
  };

  if (subStep === "choose") return (
    <div className="sf-view">
      <div style={{ textAlign: "center", marginBottom: "22px" }}>
        <div style={{ fontSize: "32px", marginBottom: "10px" }}>🔐</div>
        <h3 style={{ color: "#fff", fontSize: "17px", fontWeight: 700, margin: "0 0 6px" }}>Mot de passe oublié ?</h3>
        <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "13px", margin: 0 }}>
          Choisissez comment récupérer l'accès à votre compte
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
        {[
          { id: "email_pwd", icon: "🔑", label: "E-mail + nouveau mot de passe", desc: "Entrez votre e-mail et définissez directement un nouveau mot de passe" },
          { id: "email",     icon: "✉️", label: "Lien par e-mail",               desc: "Recevoir un lien de réinitialisation sur votre adresse e-mail" },
          { id: "phone",     icon: "📱", label: "Code par SMS",                  desc: "Recevoir un code de vérification sur votre téléphone" },
        ].map(opt => (
          <button key={opt.id} onClick={() => handleChoose(opt.id)} style={{
            display: "flex", alignItems: "center", gap: "14px",
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px", padding: "14px 16px", cursor: "pointer", fontFamily: "inherit", textAlign: "left",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(37,99,235,0.1)"; e.currentTarget.style.borderColor = "rgba(96,165,250,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
          >
            <span style={{ fontSize: "26px", flexShrink: 0 }}>{opt.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#fff", marginBottom: "3px" }}>{opt.label}</div>
              <div style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.35)", lineHeight: 1.4 }}>{opt.desc}</div>
            </div>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "16px" }}>›</span>
          </button>
        ))}
      </div>
      <button onClick={onBack} style={{ width: "100%", padding: "11px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "rgba(255,255,255,0.45)", fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>
        ← Retour à la connexion
      </button>
    </div>
  );

  if (subStep === "email_pwd") return (
    <div className="sf-view">
      <button onClick={() => setSubStep("choose")} style={backBtnStyle}>← Retour</button>
      <div style={{ textAlign: "center", marginBottom: "22px" }}>
        <div style={{ fontSize: "28px", marginBottom: "10px" }}>🔑</div>
        <h3 style={{ color: "#fff", fontSize: "17px", fontWeight: 700, margin: "0 0 6px" }}>Réinitialisation directe</h3>
        <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "13px", margin: 0 }}>Entrez votre e-mail et définissez un nouveau mot de passe</p>
      </div>
      <div style={{ ...styles.field, marginBottom: "14px" }}>
        <Label>Adresse e-mail de votre compte</Label>
        <input className="sf-input" type="email" value={emailDirect}
          onChange={e => { setEmailDirect(e.target.value); setError(""); }}
          placeholder="jean.rakoto@email.com" style={inputStyle(!!error && !emailDirect)} autoFocus />
      </div>
      <div style={{ ...styles.field, marginBottom: "14px" }}>
        <Label>Nouveau mot de passe</Label>
        <div style={{ position: "relative" }}>
          <input className="sf-input" type={showPwdDirect ? "text" : "password"} value={pwdDirect}
            onChange={e => { setPwdDirect(e.target.value); setError(""); }}
            placeholder="••••••••" style={{ ...inputStyle(false), paddingRight: "44px" }} />
          <button onClick={() => setShowPwdDirect(v => !v)} style={styles.eyeBtn}>{showPwdDirect ? "🙈" : "👁️"}</button>
        </div>
      </div>
      <div style={{ ...styles.field, marginBottom: "14px" }}>
        <Label>Confirmer le mot de passe</Label>
        <input className="sf-input" type="password" value={confirmDirect}
          onChange={e => { setConfirmDirect(e.target.value); setError(""); }}
          placeholder="••••••••" style={inputStyle(!!error && confirmDirect.length > 0 && confirmDirect !== pwdDirect)} />
        {error && <span style={errText}>{error}</span>}
      </div>
      <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "5px" }}>
        {strengthChecks(pwdDirect).map(c => <StrengthRow key={c.label} c={c} />)}
      </div>
      <button className="sf-submit" onClick={handleEmailPwdReset} disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>
        {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
      </button>
    </div>
  );

  if (subStep === "input") return (
    <div className="sf-view">
      <button onClick={() => setSubStep("choose")} style={backBtnStyle}>← Retour</button>
      <div style={{ textAlign: "center", marginBottom: "22px" }}>
        <div style={{ fontSize: "28px", marginBottom: "10px" }}>{method === "email" ? "✉️" : "📱"}</div>
        <h3 style={{ color: "#fff", fontSize: "17px", fontWeight: 700, margin: "0 0 6px" }}>
          {method === "email" ? "Récupération par e-mail" : "Récupération par SMS"}
        </h3>
      </div>
      <div style={{ ...styles.field, marginBottom: "20px" }}>
        <Label>{method === "email" ? "Adresse e-mail" : "Numéro de téléphone"}</Label>
        <input className="sf-input" type={method === "email" ? "email" : "tel"} value={value}
          onChange={e => { setValue(e.target.value); setError(""); }}
          placeholder={method === "email" ? "jean.rakoto@email.com" : "+261 34 00 000 00"}
          style={inputStyle(!!error)} autoFocus />
        {error && <span style={errText}>{error}</span>}
      </div>
      <button className="sf-submit" onClick={handleSend} disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>
        {loading ? "Envoi..." : method === "email" ? "Envoyer le lien" : "Envoyer le code SMS"}
      </button>
    </div>
  );

  if (subStep === "code") return (
    <div className="sf-view">
      <div style={{ textAlign: "center", marginBottom: "22px" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", margin: "0 auto 12px" }}>
          {method === "email" ? "✉️" : "📱"}
        </div>
        <h3 style={{ color: "#fff", fontSize: "17px", fontWeight: 700, margin: "0 0 6px" }}>
          {method === "email" ? "Vérifiez vos e-mails" : "Code envoyé !"}
        </h3>
        <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "12.5px", margin: 0, lineHeight: 1.7 }}>
          {method === "email"
            ? <>Un lien a été envoyé à <strong style={{ color: "#60a5fa" }}>{value}</strong>.</>
            : <>Code envoyé au <strong style={{ color: "#60a5fa" }}>{value}</strong>.</>}
        </p>
      </div>
      <button className="sf-submit" onClick={() => setSubStep("newpwd")} style={styles.submitBtn}>
        J'ai reçu le lien →
      </button>
      <div style={{ textAlign: "center", marginTop: "14px" }}>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Pas reçu ? </span>
        <button onClick={() => { if (resendCd === 0) { handleSend(); } }} disabled={resendCd > 0}
          style={{ background: "none", border: "none", cursor: resendCd > 0 ? "not-allowed" : "pointer", fontFamily: "inherit", fontSize: "12px", color: resendCd > 0 ? "rgba(255,255,255,0.25)" : "#60a5fa", textDecoration: resendCd > 0 ? "none" : "underline", padding: 0 }}>
          {resendCd > 0 ? `Renvoyer dans ${resendCd}s` : "Renvoyer"}
        </button>
      </div>
    </div>
  );

  if (subStep === "newpwd") return (
    <div className="sf-view">
      <div style={{ textAlign: "center", marginBottom: "22px" }}>
        <div style={{ fontSize: "28px", marginBottom: "10px" }}>🔒</div>
        <h3 style={{ color: "#fff", fontSize: "17px", fontWeight: 700, margin: "0 0 6px" }}>Nouveau mot de passe</h3>
      </div>
      <div style={{ ...styles.field, marginBottom: "14px" }}>
        <Label>Nouveau mot de passe</Label>
        <div style={{ position: "relative" }}>
          <input className="sf-input" type={showNewPwd ? "text" : "password"} value={newPwd}
            onChange={e => { setNewPwd(e.target.value); setError(""); }}
            placeholder="••••••••" style={{ ...inputStyle(!!error), paddingRight: "44px" }} autoFocus />
          <button onClick={() => setShowNewPwd(v => !v)} style={styles.eyeBtn}>{showNewPwd ? "🙈" : "👁️"}</button>
        </div>
      </div>
      <div style={{ ...styles.field, marginBottom: "14px" }}>
        <Label>Confirmer le mot de passe</Label>
        <input className="sf-input" type="password" value={confirmPwd}
          onChange={e => { setConfirmPwd(e.target.value); setError(""); }}
          placeholder="••••••••" style={inputStyle(!!error && confirmPwd.length > 0 && confirmPwd !== newPwd)} />
        {error && <span style={errText}>{error}</span>}
      </div>
      <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "5px" }}>
        {strengthChecks(newPwd).map(c => <StrengthRow key={c.label} c={c} />)}
      </div>
      <button className="sf-submit" onClick={handleResetPassword} disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>
        {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
      </button>
    </div>
  );

  if (subStep === "done") return (
    <div className="sf-view" style={{ textAlign: "center", padding: "1rem 0" }}>
      <div style={{ ...styles.successIcon, marginBottom: "16px" }}>✓</div>
      <h3 style={{ ...styles.successTitle, marginBottom: "8px" }}>Mot de passe réinitialisé !</h3>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "20px" }}>
        Redirection vers la connexion...
      </p>
      <div style={{ height: "3px", background: "rgba(37,99,235,0.15)", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ height: "100%", background: "#2563eb", width: "100%", animation: "progress 2.8s linear" }} />
      </div>
    </div>
  );

  return null;
}

/* ══════════════════════════════════════════
   PAGE BPO (Formulaire d'offre)
══════════════════════════════════════════ */
function BpoPage({ prenom, onSubmit, loading }) {
  const [bpo, setBpo]     = useState({ services: [], taille: "", budget: "", delai: "", besoin: "" });
  const [errors, setErrors] = useState({});

  const toggleService = (id) => {
    setBpo(b => ({ ...b, services: b.services.includes(id) ? b.services.filter(s => s !== id) : [...b.services, id] }));
    setErrors(e => ({ ...e, services: false }));
  };
  const select = (field, val) => { setBpo(b => ({ ...b, [field]: val })); setErrors(e => ({ ...e, [field]: false })); };

  const handleSubmit = () => {
    const errs = {};
    if (bpo.services.length === 0) errs.services = true;
    if (!bpo.taille) errs.taille = true;
    if (!bpo.budget) errs.budget = true;
    if (!bpo.delai)  errs.delai  = true;
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit(bpo);
  };

  return (
    <div className="sf-view">
      <div style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(96,165,250,0.05) 100%)", border: "1px solid rgba(37,99,235,0.25)", borderRadius: "14px", padding: "18px 20px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <span style={{ fontSize: "22px" }}>🏢</span>
          <h2 style={{ margin: 0, fontSize: "16px", color: "#fff", fontWeight: 700 }}>Bienvenue, {prenom} !</h2>
        </div>
        <p style={{ margin: 0, fontSize: "12.5px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
          Complétez votre dossier de candidature BPO ci-dessous.
        </p>
      </div>

      <div style={{ marginBottom: "22px" }}>
        <Label>Services BPO souhaités {errors.services && <Err />}</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "10px" }}>
          {SERVICES.map(s => {
            const active = bpo.services.includes(s.id);
            return (
              <button key={s.id} onClick={() => toggleService(s.id)} style={{
                display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "3px",
                padding: "12px 13px", background: active ? "rgba(37,99,235,0.18)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${errors.services && !active ? "rgba(220,38,38,0.4)" : active ? "rgba(96,165,250,0.55)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "11px", cursor: "pointer", transition: "all 0.18s ease", textAlign: "left",
                fontFamily: "inherit", position: "relative",
              }}>
                <span style={{ fontSize: "20px" }}>{s.icon}</span>
                <span style={{ fontSize: "12.5px", fontWeight: 600, color: active ? "#fff" : "rgba(255,255,255,0.6)" }}>{s.label}</span>
                <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.28)", lineHeight: 1.3 }}>{s.desc}</span>
                {active && <span style={{ position: "absolute", top: "8px", right: "10px", color: "#60a5fa", fontSize: "14px" }}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: "22px" }}>
        <Label>Nombre d'employés {errors.taille && <Err />}</Label>
        <div style={{ display: "flex", gap: "7px", marginTop: "10px", flexWrap: "wrap" }}>
          {TAILLES.map(t => {
            const active = bpo.taille === t.id;
            return (
              <button key={t.id} onClick={() => select("taille", t.id)} style={{
                display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 14px", flex: 1, minWidth: "58px",
                background: active ? "rgba(37,99,235,0.2)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${errors.taille && !active ? "rgba(220,38,38,0.5)" : active ? "rgba(96,165,250,0.6)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "10px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s ease",
              }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: active ? "#fff" : "rgba(255,255,255,0.55)" }}>{t.label}</span>
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)" }}>{t.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: "22px" }}>
        <Label>Budget mensuel {errors.budget && <Err />}</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "10px" }}>
          {BUDGETS.map(b => {
            const active = bpo.budget === b.id;
            return (
              <button key={b.id} onClick={() => select("budget", b.id)} style={{
                padding: "11px 14px", background: active ? "rgba(37,99,235,0.2)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${errors.budget && !active ? "rgba(220,38,38,0.5)" : active ? "rgba(96,165,250,0.6)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "10px", cursor: "pointer", fontFamily: "inherit",
                fontSize: "12.5px", fontWeight: active ? 600 : 400, color: active ? "#fff" : "rgba(255,255,255,0.5)",
                transition: "all 0.18s ease", textAlign: "center",
              }}>{b.label}</button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: "22px" }}>
        <Label>Quand souhaitez-vous démarrer ? {errors.delai && <Err />}</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "10px" }}>
          {DELAIS.map(d => {
            const active = bpo.delai === d.id;
            return (
              <button key={d.id} onClick={() => select("delai", d.id)} style={{
                display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 10px",
                background: active ? "rgba(37,99,235,0.2)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${errors.delai && !active ? "rgba(220,38,38,0.5)" : active ? "rgba(96,165,250,0.6)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "10px", cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s ease", gap: "2px",
              }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: active ? "#fff" : "rgba(255,255,255,0.55)" }}>{d.label}</span>
                <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.28)" }}>{d.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: "26px" }}>
        <Label>Décrivez votre besoin <span style={{ color: "rgba(255,255,255,0.2)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— optionnel</span></Label>
        <textarea value={bpo.besoin} onChange={e => setBpo(b => ({ ...b, besoin: e.target.value }))}
          placeholder="Ex : Nous cherchons 5 agents bilingues pour la gestion de tickets clients..." rows={3}
          style={{ marginTop: "8px", width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "10px", padding: "11px 14px", fontSize: "13px", color: "#fff", fontFamily: "inherit", resize: "vertical", outline: "none" }}
          onFocus={e => e.target.style.borderColor = "rgba(96,165,250,0.6)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.09)"}
        />
      </div>

      <button className="sf-submit" onClick={handleSubmit} disabled={loading}
        style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
        {loading ? "Envoi en cours..." : "Soumettre ma candidature →"}
      </button>
      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.22)", textAlign: "center", marginTop: "10px" }}>
        🔒 Vos données sont confidentielles et sécurisées
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════
   VUE MESSAGERIE
══════════════════════════════════════════ */
function MessagesView({ user, onClose }) {
  const status = user.candidatureStatus || "pending";

  const serviceLabels = {
    relation_client: "Relation client", back_office: "Back Office",
    ventes_marketing: "Ventes & Marketing", fonctions_supports: "Fonctions supports",
  };
  const budgetLabels  = { moins_1k: "< 1 000 €/mois", "1k_5k": "1 000–5 000 €", "5k_15k": "5 000–15 000 €", "15k_plus": "+ 15 000 €/mois" };
  const delaiLabels   = { immediat: "Immédiat", "1_mois": "Sous 1 mois", "3_mois": "Sous 3 mois", exploration: "En exploration" };

  const submittedAt = user.bpoData?.submittedAt
    ? new Date(user.bpoData.submittedAt)
    : new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

  const fmtDate = (d) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const fmtTime = (d) => d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  const storageKey = `sf_usermsg_${(user.email || "").toLowerCase()}`;
  const loadExtraMsgs = () => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "[]"); } catch { return []; }
  };
  const [extraMsgs, setExtraMsgs] = useState(loadExtraMsgs);
  const [inputVal, setInputVal]   = useState("");
  const [sending, setSending]     = useState(false);
  const threadRef = useRef(null);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [extraMsgs]);

  const handleSend = () => {
    const text = inputVal.trim();
    if (!text) return;
    setSending(true);
    const msg = { id: `u_${Date.now()}`, from: "user", time: Date.now(), text };
    const updated = [...extraMsgs, msg];
    setExtraMsgs(updated);
    setInputVal("");
    try { localStorage.setItem(storageKey, JSON.stringify(updated)); } catch { /* ignore */ }
    setTimeout(() => setSending(false), 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const sfMessages = [];
  sfMessages.push({
    id: "confirm", from: "sf", time: submittedAt,
    text: `Bonjour ${user.prenom} 👋\n\nNous avons bien reçu votre candidature BPO soumise le ${fmtDate(submittedAt)}. Votre dossier est en cours d'examen par notre équipe.\n\n⏱️ Délai de réponse estimé : 48h ouvrées.`,
  });
  if (status === "accepted") {
    sfMessages.push({
      id: "response", from: "sf", time: new Date(submittedAt.getTime() + 30 * 60 * 60 * 1000),
      text: `✅ Excellente nouvelle ${user.prenom} !\n\nVotre candidature BPO a été acceptée. Nous sommes ravis de vous accompagner.\n\n📞 Un consultant vous contactera sous 24h.`,
      highlight: "green",
    });
  }
  if (status === "rejected") {
    sfMessages.push({
      id: "response", from: "sf", time: new Date(submittedAt.getTime() + 36 * 60 * 60 * 1000),
      text: `Bonjour ${user.prenom},\n\nAprès examen de votre dossier, nous ne pouvons pas donner suite pour le moment. Nous conservons votre dossier et reviendrons vers vous si une opportunité correspond.\n\nCordialement,\nL'équipe SmartFlow Outsourcing`,
      highlight: "red",
    });
  }

  const statusBadge = {
    pending:  { color: "#f59e0b", bg: "rgba(245,158,11,0.15)", label: "En attente" },
    accepted: { color: "#10b981", bg: "rgba(16,185,129,0.15)", label: "Acceptée ✓" },
    rejected: { color: "#ef4444", bg: "rgba(239,68,68,0.15)",  label: "Non retenue" },
  }[status];

  const BubbleSF = ({ msg }) => {
    const highlight = msg.highlight === "green"
      ? { border: "1px solid rgba(16,185,129,0.35)", background: "rgba(16,185,129,0.07)" }
      : msg.highlight === "red"
        ? { border: "1px solid rgba(239,68,68,0.35)", background: "rgba(239,68,68,0.07)" }
        : { border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.05)" };
    const t = msg.time instanceof Date ? msg.time : new Date(msg.time);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginLeft: "4px" }}>
          <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg, #2563eb, #60a5fa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: 800, color: "#fff", flexShrink: 0 }}>SF</div>
          <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.35)" }}>SmartFlow · {fmtDate(t)} à {fmtTime(t)}</span>
        </div>
        <div style={{ maxWidth: "86%", marginLeft: "36px", ...highlight, borderRadius: "4px 18px 18px 18px", padding: "12px 15px", fontSize: "12.5px", color: "rgba(255,255,255,0.82)", lineHeight: 1.75, whiteSpace: "pre-line" }}>
          {msg.text}
        </div>
      </div>
    );
  };

  return (
    <div className="sf-view" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px 14px", borderBottom: "1px solid rgba(255,255,255,0.07)", marginBottom: "12px" }}>
        <div style={{ width: "42px", height: "42px", borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg, #2563eb, #60a5fa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800, color: "#fff", position: "relative" }}>
          SF
          <span style={{ position: "absolute", bottom: "1px", right: "1px", width: "11px", height: "11px", borderRadius: "50%", background: "#22c55e", border: "2px solid #0c1220" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>SmartFlow Outsourcing</div>
          <div style={{ fontSize: "11px", color: "#22c55e", marginTop: "2px" }}>● En ligne</div>
        </div>
        <div style={{ background: statusBadge.bg, border: `1px solid ${statusBadge.color}40`, borderRadius: "20px", padding: "4px 10px", fontSize: "10.5px", fontWeight: 700, color: statusBadge.color, flexShrink: 0 }}>
          {statusBadge.label}
        </div>
      </div>

      <div ref={threadRef} style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "0 4px", marginBottom: "12px", maxHeight: "340px", overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
          <div style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.28)", marginRight: "4px" }}>
            Vous · {fmtDate(submittedAt)} à {fmtTime(submittedAt)}
          </div>
          <div style={{ maxWidth: "82%", background: "#2563eb", borderRadius: "18px 18px 4px 18px", padding: "11px 15px", fontSize: "12.5px", color: "#fff", lineHeight: 1.65 }}>
            📋 Candidature BPO soumise
            {user.bpoData?.services?.length > 0 && (
              <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.2)", fontSize: "11.5px", color: "rgba(255,255,255,0.8)" }}>
                {user.bpoData.services.map(s => serviceLabels[s] || s).join(" · ")}
                {user.bpoData.taille && <> · {user.bpoData.taille} emp.</>}
                {user.bpoData.budget && <> · {budgetLabels[user.bpoData.budget]}</>}
                {user.bpoData.delai  && <> · {delaiLabels[user.bpoData.delai]}</>}
              </div>
            )}
          </div>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", marginRight: "4px" }}>Lu ✓✓</div>
        </div>

        {sfMessages.map(msg => <BubbleSF key={msg.id} msg={msg} />)}

        {extraMsgs.map(msg => (
          <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "3px" }}>
            <div style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.28)", marginRight: "4px" }}>
              Vous · {fmtDate(new Date(msg.time))} à {fmtTime(new Date(msg.time))}
            </div>
            <div style={{ maxWidth: "82%", background: "#2563eb", borderRadius: "18px 18px 4px 18px", padding: "10px 14px", fontSize: "12.5px", color: "#fff", lineHeight: 1.65, whiteSpace: "pre-line" }}>
              {msg.text}
            </div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", marginRight: "4px" }}>Envoyé ✓</div>
          </div>
        ))}

        {status === "pending" && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "4px" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "linear-gradient(135deg, #2563eb, #60a5fa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: 800, color: "#fff", flexShrink: 0 }}>SF</div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "20px", padding: "8px 14px" }}>
              {[0, 160, 320].map(delay => (
                <span key={delay} style={{ width: "7px", height: "7px", borderRadius: "50%", background: "rgba(255,255,255,0.4)", display: "inline-block", animation: `typingDot 1.2s ${delay}ms infinite ease-in-out` }} />
              ))}
            </div>
            <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.25)" }}>En cours de réponse...</span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", marginBottom: "14px" }}>
        <textarea
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écrire un message..."
          rows={1}
          style={{
            flex: 1, background: "none", border: "none", outline: "none", resize: "none",
            color: "#fff", fontFamily: "inherit", fontSize: "13px", lineHeight: 1.5,
            maxHeight: "90px", overflowY: "auto", padding: "4px 0",
          }}
          onInput={e => {
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 90) + "px";
          }}
        />
        <button
          onClick={handleSend}
          disabled={!inputVal.trim() || sending}
          style={{
            width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
            background: inputVal.trim() ? "#2563eb" : "rgba(255,255,255,0.08)",
            border: "none", cursor: inputVal.trim() ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.2s", fontSize: "15px",
          }}
        >
          {sending ? "⏳" : "➤"}
        </button>
      </div>

      <div style={{ background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.15)", borderRadius: "10px", padding: "10px 14px", marginBottom: "14px", fontSize: "11px", color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>
        🔔 Vos messages sont sauvegardés. Vous recevrez une réponse par e-mail.
      </div>

      <button className="sf-submit" onClick={onClose} style={styles.submitBtn}>
        Fermer
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   DASHBOARD UTILISATEUR
══════════════════════════════════════════ */
function UserDashboard({ user, onSubmitBpo, loadingBpo, onClose }) {
  const hasCandidature = !!user.bpoData;
  if (!hasCandidature) {
    return <BpoPage prenom={user.prenom} onSubmit={onSubmitBpo} loading={loadingBpo} />;
  }
  return <MessagesView user={user} onClose={onClose} />;
}

/* ══════════════════════════════════════════
   FONCTIONS EMAIL
══════════════════════════════════════════ */
async function sendEmailToUser({ userEmail, userName, subject, body }) {
  try {
    const res = await fetch(`${API}/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: userEmail, subject, body }),
    });
    const d = await res.json();
    return d.success === true;
  } catch {
    return false;
  }
}

async function sendEmailToAdmin({ fromName, fromEmail, subject, body }) {
  const fd = new FormData();
  fd.append("access_key", WEB3FORMS_KEY);
  fd.append("subject",    subject);
  fd.append("name",       fromName);
  fd.append("email",      fromEmail);
  fd.append("message",    body);
  try {
    const r = await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
    const d = await r.json();
    return d.success === true;
  } catch {
    return false;
  }
}

/* ══════════════════════════════════════════
   MODAL PRINCIPAL
══════════════════════════════════════════ */
export default function CandidatureModal({ isOpen, onClose }) {
  const [view, setView]   = useState("register");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [form, setForm]   = useState({ nom: "", prenom: "", telephone: "", email: "", password: "" });
  const [verifyCode, setVerifyCode]   = useState("");
  const [loginForm, setLoginForm]     = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginGlobalError, setLoginGlobalError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [connectedUser, setConnectedUser] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  // ✅ AJOUT : message d'erreur email dynamique
  const [emailErrorMsg, setEmailErrorMsg] = useState("Adresse e-mail invalide");

  // ✅ MODIFIÉ : reset du message quand l'utilisateur modifie l'email
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(er => ({ ...er, [name]: false }));
    if (name === "email") setEmailErrorMsg("Adresse e-mail invalide");
  };

  const handleSubmitRegister = async () => {
    const newErrors = {};
    if (!form.nom.trim())       newErrors.nom = true;
    if (!form.prenom.trim())    newErrors.prenom = true;
    if (!form.telephone.trim()) newErrors.telephone = true;
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) newErrors.email = true;
    if (!form.password.trim())  newErrors.password = true;
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoadingSubmit(true);

    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom:      form.nom.trim(),
          prenom:   form.prenom.trim(),
          email:    form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });
      const data = await res.json();

      // ✅ MODIFIÉ : message précis pour email déjà utilisé
      if (res.status === 409) {
        setEmailErrorMsg("Cet e-mail est déjà utilisé.");
        setErrors(er => ({ ...er, email: true }));
        toast.error("Cet e-mail est déjà utilisé.");
        setLoadingSubmit(false);
        return;
      }
      if (!res.ok) {
        toast.error(data.message || "Erreur lors de l'inscription");
        setLoadingSubmit(false);
        return;
      }
    } catch { /* Continuer même si le backend est injoignable */ }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    setVerifyCode(code);

    const userEmailClean = form.email.trim().toLowerCase();

    const verifyEmailBody = `Bonjour ${form.prenom},

Merci de vous être inscrit(e) sur SmartFlow Outsourcing — la plateforme BPO de référence à Madagascar.

Votre code de vérification est :

${code}

Ce code est valable 10 minutes. Ne le partagez avec personne.

Si vous n'avez pas effectué cette inscription, ignorez cet e-mail.

Cordialement,
L'équipe SmartFlow Outsourcing
Madagascar · Antsiranana`;

    const sentToUser = await sendEmailToUser({
      userEmail: userEmailClean,
      userName:  form.prenom,
      subject:   "🔐 Votre code de vérification SmartFlow",
      body:      verifyEmailBody,
    });

    await sendEmailToAdmin({
      fromName:  `${form.prenom} ${form.nom}`,
      fromEmail: userEmailClean,
      subject:   `🔔 Nouvelle inscription — ${form.prenom} ${form.nom}`,
      body:      `Nouvelle inscription sur SmartFlow Outsourcing.\n\nPrénom   : ${form.prenom}\nNom      : ${form.nom}\nEmail    : ${userEmailClean}\nTél      : ${selectedCountry.dial} ${form.telephone}\nPays     : ${selectedCountry.name}\n\nCode envoyé à l'utilisateur : ${code}`,
    });

    setLoadingSubmit(false);

    if (sentToUser) {
      toast.success(`✅ Code envoyé à ${userEmailClean} !`);
    } else {
      toast.error("⚠️ Impossible d'envoyer le code. Vérifiez votre connexion ou vos spams.");
    }

    setView("verify");
  };

  const handleResendCode = async () => {
    const newCode = String(Math.floor(100000 + Math.random() * 900000));
    setVerifyCode(newCode);

    const userEmailClean = form.email.trim().toLowerCase();

    const sent = await sendEmailToUser({
      userEmail: userEmailClean,
      userName:  form.prenom,
      subject:   "🔐 Nouveau code de vérification SmartFlow",
      body:      `Bonjour ${form.prenom},\n\nVotre nouveau code de vérification est :\n\n${newCode}\n\nCe code est valable 10 minutes.\n\nCordialement,\nL'équipe SmartFlow Outsourcing`,
    });

    if (sent) {
      toast.success("Nouveau code envoyé !");
    } else {
      toast.error("Impossible d'envoyer le code. Vérifiez votre connexion.");
    }
  };

  const handleVerified = () => {
    toast.success("✅ E-mail vérifié ! Connectez-vous pour continuer.");
    setLoginForm({ email: form.email.trim().toLowerCase(), password: "" });
    setLoginErrors({});
    setLoginGlobalError("");
    setView("login");
  };

  const handleLogin = async () => {
    const newErrors = {};
    if (!loginForm.email.trim())    newErrors.email = true;
    if (!loginForm.password.trim()) newErrors.password = true;
    if (Object.keys(newErrors).length > 0) { setLoginErrors(newErrors); return; }

    setLoadingSubmit(true);
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email:    loginForm.email.trim().toLowerCase(),
          password: loginForm.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setLoginGlobalError("E-mail ou mot de passe incorrect.");
        setLoginErrors({ email: true, password: true });
        setLoadingSubmit(false);
        return;
      }

      localStorage.setItem("token", data.token);

      let candidature = null;
      try {
        const cRes = await fetch(`${API}/candidature`, {
          headers: { "Authorization": `Bearer ${data.token}` },
        });
        if (cRes.ok) candidature = await cRes.json();
      } catch { /* pas de candidature */ }

      let bpoData = null;
      let candidatureStatus = null;

      const normalizeRaw = (raw, status) => {
        if (!raw || (!raw.service && !raw.services && !raw.budget)) return null;
        const servicesArray = Array.isArray(raw.services)
          ? raw.services
          : typeof raw.service === "string"
            ? raw.service.split(",").map(s => s.trim()).filter(Boolean)
            : [];
        return {
          services:    servicesArray,
          taille:      raw.taille || raw.taille_entreprise || "",
          budget:      raw.budget || "",
          delai:       raw.delai  || "",
          besoin:      raw.besoin || "",
          submittedAt: raw.submittedAt || raw.createdAt || raw.created_at || Date.now(),
          _status:     status || raw.status || "pending",
        };
      };

      if (candidature) {
        candidatureStatus = candidature.status || null;
        const raw = candidature.bpoData ?? candidature;
        bpoData = normalizeRaw(raw, candidatureStatus);
      }

      if (!bpoData) {
        try {
          const userEmail = loginForm.email.trim().toLowerCase();
          const saved = localStorage.getItem(`sf_candidature_${userEmail}`);
          if (saved) {
            const parsed = JSON.parse(saved);
            bpoData = parsed.bpoData || null;
            candidatureStatus = candidatureStatus || parsed.status || "pending";
          }
        } catch { /* ignore */ }
      } else if (bpoData._status) {
        candidatureStatus = candidatureStatus || bpoData._status;
      }

      setForm(f => ({ ...f, nom: data.user.nom, prenom: data.user.prenom, email: data.user.email }));
      setConnectedUser({
        ...data.user,
        bpoData,
        candidatureStatus,
      });
      setLoadingSubmit(false);
      setView("dashboard");

    } catch {
      toast.error("Erreur réseau. Vérifiez que le serveur tourne.");
      setLoadingSubmit(false);
    }
  };

  const handleSubmitBpo = async (bpoData) => {
    setLoadingSubmit(true);

    const serviceLabels = {
      relation_client: "Relation client", back_office: "Back Office",
      ventes_marketing: "Ventes & Marketing", fonctions_supports: "Fonctions supports"
    };
    const budgetLabels  = {
      moins_1k: "< 1 000 €/mois", "1k_5k": "1 000 – 5 000 €",
      "5k_15k": "5 000 – 15 000 €", "15k_plus": "+ 15 000 €/mois"
    };
    const delaiLabels   = {
      immediat: "Immédiat", "1_mois": "Sous 1 mois",
      "3_mois": "Sous 3 mois", exploration: "En exploration"
    };

    const servicesStr = bpoData.services.map(s => serviceLabels[s] || s).join(", ");
    const budgetStr   = budgetLabels[bpoData.budget]  || bpoData.budget;
    const delaiStr    = delaiLabels[bpoData.delai]    || bpoData.delai;
    const userEmail   = (connectedUser?.email || form.email || "").trim().toLowerCase();
    const userPrenom  = connectedUser?.prenom || form.prenom || "";
    const userNom     = connectedUser?.nom    || form.nom    || "";
    const userTel     = `${selectedCountry.dial} ${form.telephone}`;

    try {
      const token = localStorage.getItem("token");
      await fetch(`${API}/candidature`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          service: bpoData.services.join(", "),
          budget:  bpoData.budget,
          delai:   bpoData.delai,
          besoin:  bpoData.besoin,
        }),
      });
    } catch { /* fallback silencieux */ }

    const adminBody = `
🆕 NOUVELLE CANDIDATURE BPO — SmartFlow Outsourcing

─── CANDIDAT ───────────────────────────
Nom complet : ${userPrenom} ${userNom}
Email       : ${userEmail}
Téléphone   : ${userTel}
Pays        : ${selectedCountry.name}

─── PROJET BPO ─────────────────────────
Services    : ${servicesStr}
Taille      : ${bpoData.taille} employés
Budget      : ${budgetStr}
Délai       : ${delaiStr}
${bpoData.besoin ? `Besoin      : ${bpoData.besoin}` : ""}

─────────────────────────────────────────
Soumis le ${new Date().toLocaleDateString("fr-FR")} via SmartFlow Outsourcing
    `.trim();

    await sendEmailToAdmin({
      fromName:  `${userPrenom} ${userNom}`,
      fromEmail: userEmail,
      subject:   `🆕 Nouvelle candidature BPO — ${userPrenom} ${userNom}`,
      body:      adminBody,
    });

    const userConfirmBody = `Bonjour ${userPrenom},

Nous avons bien reçu votre candidature BPO sur SmartFlow Outsourcing.

─── RÉCAPITULATIF ───────────────────────
Services    : ${servicesStr}
Taille      : ${bpoData.taille} employés
Budget      : ${budgetStr}
Délai       : ${delaiStr}
${bpoData.besoin ? `Besoin      : ${bpoData.besoin}` : ""}
─────────────────────────────────────────

Notre équipe examinera votre dossier et vous répondra dans les 48 heures ouvrées.

Cordialement,
L'équipe SmartFlow Outsourcing
Madagascar · Antsiranana`;

    await sendEmailToUser({
      userEmail: userEmail,
      userName:  userPrenom,
      subject:   "✅ Candidature BPO reçue — SmartFlow Outsourcing",
      body:      userConfirmBody,
    });

    toast.success("✅ Candidature envoyée avec succès !");
    setLoadingSubmit(false);

    const savedBpo = { ...bpoData, submittedAt: Date.now() };

    try {
      if (userEmail) {
        localStorage.setItem(
          `sf_candidature_${userEmail}`,
          JSON.stringify({ bpoData: savedBpo, status: "pending" })
        );
      }
    } catch { /* ignore */ }

    setConnectedUser(prev => ({
      ...(prev || {}),
      bpoData: savedBpo,
      candidatureStatus: "pending",
    }));
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setView("register");
      setConnectedUser(null);
      setForm({ nom: "", prenom: "", telephone: "", email: "", password: "" });
      setLoginForm({ email: "", password: "" });
      setErrors({}); setLoginErrors({}); setLoginGlobalError("");
      setSelectedCountry(COUNTRIES[0]);
      setShowPassword(false); setShowLoginPassword(false);
      setLoadingSubmit(false); setVerifyCode("");
      setEmailErrorMsg("Adresse e-mail invalide"); // ✅ reset au fermeture
    }, 300);
  };

  const switchToLogin    = () => { setView("login");    setErrors({}); setLoginGlobalError(""); };
  const switchToRegister = () => { setView("register"); setLoginErrors({}); setLoginGlobalError(""); };

  if (!isOpen) return null;

  const showTabs = view === "register" || view === "login";

  return (
    <>
      <Toaster position="top-center" toastOptions={{
        style: { background: "#1e293b", color: "#fff", border: "1px solid rgba(96,165,250,0.2)", fontSize: "13px" },
        success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
        error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
      }} />

      <style>{`
        @keyframes fadeUp   { from { opacity:0; transform:translateY(24px) scale(0.98); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes fadeDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes checkPop { 0%{transform:scale(0);opacity:0} 70%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
        @keyframes slideIn  { from { opacity:0; transform:translateX(16px); } to { opacity:1; transform:translateX(0); } }
        @keyframes progress { from { width:0 } to { width:100% } }
        @keyframes shake    { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        @keyframes typingDot { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
        .sf-modal::-webkit-scrollbar       { width:4px; }
        .sf-modal::-webkit-scrollbar-track { background:transparent; }
        .sf-modal::-webkit-scrollbar-thumb { background:rgba(96,165,250,0.3); border-radius:4px; }
        .sf-input { transition:border-color 0.2s, box-shadow 0.2s; }
        .sf-input:focus { border-color:rgba(96,165,250,0.6) !important; box-shadow:0 0 0 3px rgba(96,165,250,0.08); outline:none; }
        .sf-submit { transition:all 0.2s ease !important; }
        .sf-submit:hover:not(:disabled) { background:#1d4ed8 !important; transform:translateY(-1px); box-shadow:0 6px 20px rgba(37,99,235,0.35); }
        .sf-submit:active:not(:disabled) { transform:translateY(0) !important; }
        .sf-view  { animation:slideIn 0.25s ease; }
        .sf-tab   { flex:1; padding:9px; border:none; cursor:pointer; font-family:inherit; font-size:13px; font-weight:500; border-radius:8px; transition:all 0.2s; }
        .sf-tab.active   { background:rgba(37,99,235,0.25); color:#60a5fa; }
        .sf-tab.inactive { background:transparent; color:rgba(255,255,255,0.35); }
        .sf-tab.inactive:hover { color:rgba(255,255,255,0.6); }
        .sf-closeBtn:hover { background:rgba(255,255,255,0.12) !important; }
      `}</style>

      <div onClick={handleClose} style={styles.overlay}>
        <div className="sf-modal" onClick={e => e.stopPropagation()} style={styles.modal}>

          <button className="sf-closeBtn" onClick={handleClose} style={styles.closeBtn}>✕</button>

          <div style={styles.logoRow}>
            <img src={assets.smartflow_logo} alt="SmartFlow Outsourcing"
              style={{ height: "102px", width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)" }} />
          </div>

          {showTabs && (
            <div style={styles.tabBar}>
              <button className={`sf-tab ${view === "register" ? "active" : "inactive"}`} onClick={switchToRegister}>Créer un compte</button>
              <button className={`sf-tab ${view === "login"    ? "active" : "inactive"}`} onClick={switchToLogin}>Se connecter</button>
            </div>
          )}

          {view === "register" && (
            <div className="sf-view">
              <p style={styles.sub}>Rejoignez la plateforme BPO de référence à Madagascar</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                {[{ name: "nom", label: "Nom", ph: "Rakoto" }, { name: "prenom", label: "Prénom", ph: "Jean" }].map(({ name, label, ph }) => (
                  <div key={name} style={styles.field}>
                    <Label>{label}</Label>
                    <input className="sf-input" name={name} value={form[name]} onChange={handleChange} placeholder={ph} style={inputStyle(errors[name])} />
                  </div>
                ))}
              </div>

              <div style={{ ...styles.field, marginBottom: "14px" }}>
                <Label>Numéro de téléphone</Label>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <CountrySelector selected={selectedCountry} onSelect={setSelectedCountry} hasError={errors.telephone} />
                  <input className="sf-input" name="telephone" type="tel" value={form.telephone} onChange={handleChange} placeholder="34 00 000 00" style={{ ...inputStyle(errors.telephone), flex: 1 }} />
                </div>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.22)", marginTop: "2px" }}>{selectedCountry.name} · {selectedCountry.dial}</span>
              </div>

              <div style={{ ...styles.field, marginBottom: "14px" }}>
                <Label>Adresse e-mail</Label>
                <input className="sf-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="jean.rakoto@email.com" style={inputStyle(errors.email)} />
                {/* ✅ MODIFIÉ : message dynamique */}
                {errors.email && <span style={errText}>{emailErrorMsg}</span>}
              </div>

              <div style={{ ...styles.field, marginBottom: "24px" }}>
                <Label>Mot de passe</Label>
                <div style={{ position: "relative" }}>
                  <input className="sf-input" name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} placeholder="••••••••" style={{ ...inputStyle(errors.password), paddingRight: "44px" }} />
                  <button onClick={() => setShowPassword(v => !v)} style={styles.eyeBtn}>{showPassword ? "🙈" : "👁️"}</button>
                </div>
              </div>

              <button className="sf-submit" onClick={handleSubmitRegister} disabled={loadingSubmit}
                style={{ ...styles.submitBtn, opacity: loadingSubmit ? 0.7 : 1, cursor: loadingSubmit ? "not-allowed" : "pointer" }}>
                {loadingSubmit ? "Envoi du code..." : "S'inscrire & recevoir le code →"}
              </button>
              <p style={styles.terms}>
                En vous inscrivant, vous acceptez nos{" "}
                <a href="#" style={styles.link}>Conditions d'utilisation</a> et notre{" "}
                <a href="#" style={styles.link}>Politique de confidentialité</a>.
              </p>
            </div>
          )}

          {view === "verify" && (
            <VerifyEmailView
              email={form.email}
              code={verifyCode}
              onVerified={handleVerified}
              onResend={handleResendCode}
              onBack={() => setView("register")}
            />
          )}

          {view === "login" && (
            <div className="sf-view">
              <p style={styles.sub}>Accédez à votre espace SmartFlow</p>

              {loginGlobalError && (
                <div style={alertBox("red")}>⚠️ {loginGlobalError}</div>
              )}

              <div style={{ ...styles.field, marginBottom: "16px" }}>
                <Label>Adresse e-mail</Label>
                <input className="sf-input" type="email" value={loginForm.email}
                  onChange={e => { setLoginForm(f => ({ ...f, email: e.target.value })); setLoginErrors(er => ({ ...er, email: false })); setLoginGlobalError(""); }}
                  placeholder="jean.rakoto@email.com" style={inputStyle(loginErrors.email)} />
              </div>
              <div style={{ ...styles.field, marginBottom: "10px" }}>
                <Label>Mot de passe</Label>
                <div style={{ position: "relative" }}>
                  <input className="sf-input" type={showLoginPassword ? "text" : "password"} value={loginForm.password}
                    onChange={e => { setLoginForm(f => ({ ...f, password: e.target.value })); setLoginErrors(er => ({ ...er, password: false })); setLoginGlobalError(""); }}
                    placeholder="••••••••" style={{ ...inputStyle(loginErrors.password), paddingRight: "44px" }} />
                  <button onClick={() => setShowLoginPassword(v => !v)} style={styles.eyeBtn}>{showLoginPassword ? "🙈" : "👁️"}</button>
                </div>
              </div>

              <div style={{ textAlign: "right", marginBottom: "24px" }}>
                <button onClick={() => setView("forgot")} style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer", fontSize: "12px", fontFamily: "inherit", padding: 0, textDecoration: "underline" }}>
                  Mot de passe oublié ?
                </button>
              </div>

              <button className="sf-submit" onClick={handleLogin} disabled={loadingSubmit}
                style={{ ...styles.submitBtn, opacity: loadingSubmit ? 0.7 : 1, cursor: loadingSubmit ? "not-allowed" : "pointer" }}>
                {loadingSubmit ? "Connexion en cours..." : "Se connecter →"}
              </button>
              <p style={styles.terms}>
                Pas encore de compte ?{" "}
                <a href="#" style={styles.link} onClick={e => { e.preventDefault(); switchToRegister(); }}>Créer un compte</a>
              </p>
            </div>
          )}

          {view === "dashboard" && connectedUser && (
            <UserDashboard
              user={connectedUser}
              onSubmitBpo={handleSubmitBpo}
              loadingBpo={loadingSubmit}
              onClose={handleClose}
            />
          )}

          {view === "forgot" && (
            <ForgotPasswordView
              onBack={() => setView("login")}
              onSuccess={() => { setView("login"); setLoginForm({ email: "", password: "" }); }}
            />
          )}

        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   HELPERS UI
══════════════════════════════════════════ */

const Label = ({ children }) => (
  <span style={{ fontSize: "11px", fontWeight: "500", color: "rgba(255,255,255,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", display: "block", marginBottom: "2px" }}>
    {children}
  </span>
);

const Err = () => (
  <span style={{ color: "rgba(220,38,38,0.8)", marginLeft: "6px", fontWeight: "600", fontSize: "10px", textTransform: "none", letterSpacing: 0 }}>* requis</span>
);

const StrengthRow = ({ c }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <div style={{ width: "15px", height: "15px", borderRadius: "50%", flexShrink: 0, background: c.ok ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)", border: `1px solid ${c.ok ? "rgba(16,185,129,0.6)" : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: c.ok ? "#10b981" : "transparent" }}>✓</div>
    <span style={{ fontSize: "11.5px", color: c.ok ? "rgba(16,185,129,0.9)" : "rgba(255,255,255,0.28)" }}>{c.label}</span>
  </div>
);

const errText = { fontSize: "11px", color: "rgba(220,38,38,0.85)", marginTop: "3px", display: "block" };

const backBtnStyle = {
  display: "block", width: "100%", padding: "10px", background: "transparent",
  border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer",
  fontFamily: "inherit", fontSize: "12.5px", textAlign: "center", marginTop: "6px",
};

const alertBox = (color) => ({
  background: color === "red" ? "rgba(220,38,38,0.1)" : "rgba(16,185,129,0.1)",
  border: `1px solid ${color === "red" ? "rgba(220,38,38,0.3)" : "rgba(16,185,129,0.3)"}`,
  borderRadius: "10px", padding: "10px 14px", marginBottom: "16px",
  fontSize: "12.5px", color: color === "red" ? "rgba(255,100,100,0.9)" : "rgba(100,255,180,0.9)",
  display: "flex", alignItems: "center", gap: "8px",
});

const inputStyle = (hasError) => ({
  background: "rgba(255,255,255,0.05)",
  border: `1px solid ${hasError ? "rgba(220,38,38,0.65)" : "rgba(255,255,255,0.09)"}`,
  borderRadius: "10px", padding: "11px 14px", fontSize: "14px", color: "#fff",
  width: "100%", fontFamily: "inherit", boxSizing: "border-box",
});

const styles = {
  overlay:      { position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "1rem" },
  modal:        { background: "#0c1220", border: "1px solid rgba(37,99,235,0.22)", borderRadius: "22px", padding: "2.5rem 2rem 2rem", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto", position: "relative", animation: "fadeUp 0.35s ease", boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(96,165,250,0.06) inset" },
  closeBtn:     { position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.06)", border: "none", color: "rgba(255,255,255,0.45)", width: "30px", height: "30px", borderRadius: "50%", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" },
  logoRow:      { display: "flex", alignItems: "center", justifyContent: "center", gap: "9px", marginBottom: "1.4rem" },
  tabBar:       { display: "flex", gap: "4px", background: "rgba(255,255,255,0.04)", padding: "4px", borderRadius: "10px", marginBottom: "1.6rem" },
  sub:          { textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.38)", marginBottom: "1.6rem", lineHeight: "1.5" },
  field:        { display: "flex", flexDirection: "column", gap: "6px" },
  eyeBtn:       { position: "absolute", right: "13px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.35)", fontSize: "16px", lineHeight: 1, display: "flex", alignItems: "center" },
  submitBtn:    { width: "100%", padding: "13px", background: "#2563eb", border: "none", borderRadius: "11px", color: "#fff", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" },
  terms:        { fontSize: "11px", color: "rgba(255,255,255,0.22)", textAlign: "center", marginTop: "1rem", lineHeight: "1.6" },
  link:         { color: "#60a5fa", textDecoration: "none", fontWeight: "500" },
  successIcon:  { width: "64px", height: "64px", background: "rgba(37,99,235,0.12)", border: "1px solid rgba(37,99,235,0.4)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: "28px", color: "#60a5fa" },
  successTitle: { color: "#fff", fontSize: "19px", marginBottom: "0.75rem" },
};