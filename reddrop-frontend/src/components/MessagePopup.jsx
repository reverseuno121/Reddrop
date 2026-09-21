import "./styles/MessagePopup.css";

function MessagePopup({
  message,
  type = "error",
  title,
  icon,
  onClose,
  onConfirm,
  showCancel = false,
  confirmText = "OK",
  cancelText = "Cancel",
}) {
  const isSuccess = type === "success";
  const isConfirmation = type === "confirmation";

  return (
    <div
        className="message-popup-overlay"
        role="presentation"
      >
        <div
          className={`message-popup ${
            isSuccess
              ? "popup-success"
              : isConfirmation
              ? "popup-confirmation"
              : "popup-error"
          }`}
          role="dialog"
          aria-modal="true"
        >
        <div className="message-popup-icon">
          {icon ||
          (isSuccess
            ? "✓"
            : isConfirmation
            ? "?"
            : "!")}
        </div>

        <h3 aria-labelledby="message-popup-title">
          {title ||
            (isSuccess
              ? "Details Confirmed"
              : isConfirmation
              ? "Please Confirm"
              : "Something went wrong")}
        </h3>

        {message && <p>{message}</p>}

        <div className="message-popup-actions">
          {showCancel && (
            <button
              type="button"
              onClick={onClose}
              className="message-popup-cancel-btn"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            autoFocus
            onClick={onConfirm || onClose}
            className="message-popup-btn"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessagePopup;