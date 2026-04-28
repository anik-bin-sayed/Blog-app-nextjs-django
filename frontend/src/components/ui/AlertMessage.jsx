import React, { useEffect } from "react";
import {
  MdErrorOutline,
  MdWarningAmber,
  MdInfoOutline,
  MdCheckCircleOutline,
} from "react-icons/md";
import { AiFillCloseCircle } from "react-icons/ai";

const icons = {
  error: MdErrorOutline,
  warning: MdWarningAmber,
  info: MdInfoOutline,
  success: MdCheckCircleOutline,
};

const colors = {
  error: {
    bg: "bg-red-50",
    border: "border-red-500",
    text: "text-red-700",
    icon: "text-red-500",
    close: "text-red-400 hover:text-red-600",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-500",
    text: "text-amber-700",
    icon: "text-amber-500",
    close: "text-amber-400 hover:text-amber-600",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-500",
    text: "text-blue-700",
    icon: "text-blue-500",
    close: "text-blue-400 hover:text-blue-600",
  },
  success: {
    bg: "bg-emerald-50",
    border: "border-emerald-500",
    text: "text-emerald-700",
    icon: "text-emerald-500",
    close: "text-emerald-400 hover:text-emerald-600",
  },
};

const AlertMessage = ({
  message,
  type = "error",
  onClose,
  autoDismiss = 3000,
}) => {
  useEffect(() => {
    if (message && autoDismiss && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [message, autoDismiss, onClose]);

  if (!message) return null;

  const Icon = icons[type];
  const c = colors[type];

  return (
    <div
      className={`${c.bg} border-l-4 ${c.border} rounded-md p-3 mb-4 flex items-start justify-between gap-2 animate-slideDown shadow-sm`}
    >
      <div className="flex items-start gap-2">
        <Icon className={`${c.icon} text-lg mt-0.5 shrink-0`} />
        <p className={`${c.text} text-sm`}>{message}</p>
      </div>
      {onClose && (
        <button type="button" onClick={onClose} className={c.close}>
          <AiFillCloseCircle className="text-base" />
        </button>
      )}
    </div>
  );
};

export default AlertMessage;
