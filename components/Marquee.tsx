"use client";

export default function Marquee() {
  const items = [
    "Nike Air Force 1", "Jordan 4", "Air Max Plus", "Nike SB",
    "Air Max 95", "Off-White Collab", "Timberland", "Vans Old Skool",
  ];

  const doubled = [...items, ...items];

  return (
    <>
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-inner {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
      `}</style>

      <div style={{
        background: "var(--gold)",
        padding: "12px 0",
        overflow: "hidden",
        borderTop: "1px solid rgba(0,0,0,0.2)",
        borderBottom: "1px solid rgba(0,0,0,0.2)",
      }}>
        <div className="marquee-inner">
          {doubled.map((item, i) => (
            <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
              <span className="font-display" style={{
                color: "var(--black)",
                fontSize: 18,
                letterSpacing: "0.05em",
                paddingRight: 40,
              }}>
                {item}
              </span>
              <span style={{ color: "rgba(0,0,0,0.35)", fontSize: 14, paddingRight: 40 }}>
                ★
              </span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}