export default function Loading() {
  return (
    <div
      className="editorial-loading"
      style={{
        display: "grid",
        placeItems: "center",
        minHeight: "60vh",
        gap: "1.5rem",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "4.2rem",
            height: "4.2rem",
            borderRadius: "999px",
            border: "1px solid rgba(201, 169, 110, 0.24)",
            background:
              "radial-gradient(circle at 35% 30%, rgba(201, 169, 110, 0.18), transparent 64%), linear-gradient(145deg, rgba(92, 63, 40, 0.7), rgba(25, 19, 16, 0.9))",
            fontFamily: "var(--font-display-serif), 'Didot', Georgia, serif",
            fontSize: "1.2rem",
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase" as const,
            color: "rgba(247, 242, 234, 0.94)",
            animation: "pulse 2s ease-in-out infinite",
          }}
        >
          VA
        </div>
        <p
          style={{
            marginTop: "1rem",
            fontSize: "0.66rem",
            fontWeight: 700,
            letterSpacing: "0.24em",
            textTransform: "uppercase" as const,
            color: "rgba(201, 169, 110, 0.72)",
          }}
        >
          Loading
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }
      `}</style>
    </div>
  );
}
