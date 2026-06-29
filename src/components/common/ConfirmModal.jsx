import { useEffect } from "react";

export default function ConfirmModal({
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="f-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="f-modal-box confirm-modal-box">
        <div className="confirm-icon">⚠️</div>
        <p id="confirm-title" className="confirm-message">
          {message}
        </p>
        <div className="confirm-actions">
          <button className="f-btn-outline sm" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className="f-btn-danger sm confirm-danger"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
