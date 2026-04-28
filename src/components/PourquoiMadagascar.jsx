import { useState, useEffect, useRef } from "react";

const cards = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
        <line x1="4" y1="22" x2="4" y2="15"/>
      </svg>
    ),
    badge: "90% francophone",
    badgeColor: "#e8543a",
    badgeBg: "rgba(232,84,58,0.15)",
    iconBg: "rgba(232,84,58,0.12)",
    iconColor: "#e8543a",
    barColor: "linear-gradient(90deg, #e8543a, rgba(232,84,58,0.3))",
    title: "Main-d'oeuvre qualifiée et jeune",
    desc: "Madagascar forme de nombreux diplomés chaque année, notamment dans le secteur du web, de la PAO, de la modération et de la relation client. Une grande partie de la population est parfaitement bilingue français-malgache.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    badge: "Jusqu'à -60% de coûts",
    badgeColor: "#22a861",
    badgeBg: "rgba(34,168,97,0.15)",
    iconBg: "rgba(34,168,97,0.12)",
    iconColor: "#22a861",
    barColor: "linear-gradient(90deg, #22a861, rgba(34,168,97,0.3))",
    title: "Réduction significative des coûts",
    desc: "Les tarifs de la main-d'oeuvre sont très compétitifs par rapport aux pays occidentaux, permettant des économies substantielles. Les salaires et frais d'inscription sont nettement plus avantageux qu'en Europe.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    badge: "UTC+3",
    badgeColor: "#5b9cf6",
    badgeBg: "rgba(41,121,212,0.15)",
    iconBg: "rgba(41,121,212,0.12)",
    iconColor: "#5b9cf6",
    barColor: "linear-gradient(90deg, #5b9cf6, rgba(91,156,246,0.3))",
    title: "Faible décalage horaire",
    desc: "Avec seulement 1 à 2 heures de différence avec la France (selon la saison), la collaboration en temps réel est facilitée.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    badge: "ISO 27001 certifié",
    badgeColor: "#22a861",
    badgeBg: "rgba(34,168,97,0.15)",
    iconBg: "rgba(34,168,97,0.12)",
    iconColor: "#22a861",
    barColor: "linear-gradient(90deg, #22a861, rgba(34,168,97,0.3))",
    title: "Infrastructures télécoms solides",
    desc: "Le pays dispose de plusieurs câbles sous-marins de fibre optique, assurant une connexion internet stable et fiable pour les entreprises.",
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function Card({ card, index, visible }) {
  return (
    <div
      className="flex flex-col rounded-[18px] p-8 border transition-all duration-300 bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.55s ease ${index * 0.1}s, transform 0.55s ease ${index * 0.1}s`,
      }}
    >
      {/* Badge */}
      <div className="flex justify-end mb-5">
        <span
          className="text-xs font-semibold px-3 py-1 rounded-full tracking-wide"
          style={{ background: card.badgeBg, color: card.badgeColor }}
        >
          {card.badge}
        </span>
      </div>

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-[14px] flex items-center justify-center mb-5"
        style={{ background: card.iconBg, color: card.iconColor }}
      >
        {card.icon}
      </div>

      {/* Title */}
      <h3
        className="text-[18px] font-bold leading-snug mb-3 text-gray-800"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {card.title}
      </h3>

      {/* Description */}
      <p
        className="text-sm leading-relaxed mb-7 flex-1 text-gray-500"
        style={{ fontFamily: "'Lato', sans-serif" }}
      >
        {card.desc}
      </p>

      {/* Bar */}
      <div
        className="h-[3px] rounded"
        style={{
          background: card.barColor,
          width: visible ? "60%" : "0%",
          transition: `width 0.8s ease ${index * 0.1 + 0.3}s`,
        }}
      />
    </div>
  );
}

export default function PourquoiMadagascar() {
  const [sectionRef, visible] = useInView(0.1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Lato:wght@400;600&display=swap');
      `}</style>

      <section
        id="PourquoiMadagascar"
        className="py-20 px-6 bg-gray-50 dark:bg-[#0d1117] transition-colors duration-300"
      >
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 text-[#e8543a] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(232,84,58,0.15)", fontFamily: "'Lato', sans-serif" }}
          >
            <span style={{ fontSize: "8px" }}>●</span> Pourquoi Madagascar
          </div>

          <h2
            className="font-extrabold leading-tight mb-4 text-gray-800 dark:text-[#f0f0f0]"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(28px, 4vw, 44px)",
            }}
          >
            L'île rouge,{" "}
            <span style={{ color: "#e8543a" }}>votre avantage</span>
            <br />compétitif
          </h2>

          <p
            className="text-base max-w-xl mx-auto leading-relaxed text-gray-500 dark:text-[#8892a4]"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Découvrez pourquoi de plus en plus d'entreprises européennes font confiance à Madagascar pour leurs opérations BPO.
          </p>
        </div>

        {/* Cards grid */}
        <div
          ref={sectionRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-[1040px] mx-auto"
        >
          {cards.map((card, i) => (
            <Card key={i} card={card} index={i} visible={visible} />
          ))}
        </div>

        {/* Map banner */}
        <div
          className="max-w-[1040px] mx-auto mt-12 flex flex-col sm:flex-row items-center gap-8 rounded-[20px] p-8 border transition-colors duration-300 bg-white border-gray-200 shadow-sm"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s",
          }}
        >
          {/* SVG Madagascar */}
          <svg className="w-[140px] sm:w-[180px] flex-shrink-0" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M60 10 C72 12 82 22 86 38 C90 54 88 72 84 88 C80 104 74 118 70 134 C66 150 64 166 60 182 C56 166 54 150 50 134 C46 118 40 104 36 88 C32 72 30 54 34 38 C38 22 48 12 60 10Z"
              fill="rgba(232,84,58,0.1)"
              stroke="#e8543a"
              strokeWidth="1.5"
            />
            <circle cx="60" cy="95" r="5" fill="#e8543a" />
            <circle cx="60" cy="95" r="11" fill="rgba(232,84,58,0.2)" />
          </svg>

          {/* Text */}
          <div>
            <h4
              className="text-xl font-bold mb-2 text-gray-800"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Madagascar en chiffres
            </h4>
            <p
              className="text-sm leading-relaxed text-gray-500"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Une destination BPO en plein essor, avec un vivier de talents francophones,
              des infrastructures modernes et un cadre réglementaire favorable aux investisseurs étrangers.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-5">
              {[
                { val: "31M+",  label: "Habitants" },
                { val: "90%",   label: "Francophones" },
                { val: "-60%",  label: "Coûts vs Europe" },
                { val: "UTC+3", label: "Fuseau horaire" },
              ].map((s, i) => (
                <div key={i}>
                  <div
                    className="text-[28px] font-extrabold"
                    style={{ fontFamily: "'Playfair Display', serif", color: "#e8543a" }}
                  >
                    {s.val}
                  </div>
                  <div
                    className="text-xs mt-0.5 text-gray-400"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}