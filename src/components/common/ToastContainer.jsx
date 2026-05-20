export default function ToastContainer({ toasts }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: ".5rem",
        pointerEvents: "none",
        alignItems: "center",
      }}
    >
      {toasts.map((t) => (
        <div key={t.id} className={`ml-toast ${t.type}`}>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
