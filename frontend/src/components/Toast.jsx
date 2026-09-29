import { useEffect } from "react";

function Toast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return undefined;

    const timeout = window.setTimeout(onDismiss, 3200);
    return () => window.clearTimeout(timeout);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      <span>{message}</span>
      <button
        type="button"
        className="toast-dismiss"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        Dismiss
      </button>
    </div>
  );
}

export default Toast;
