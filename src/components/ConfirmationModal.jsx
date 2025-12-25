import React from 'react';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

/**
 * A reusable modal component for confirmations and alerts.
 * 
 * @param {boolean} isOpen - Whether the modal is visible.
 * @param {function} onClose - Callback when the modal is closed (cancel/X).
 * @param {function} onConfirm - Callback when the confirm button is clicked.
 * @param {string} title - The modal title.
 * @param {string} message - The modal body message.
 * @param {string} confirmText - Text for the confirm button (default: "Confirm").
 * @param {string} cancelText - Text for the cancel button (default: "Cancel").
 * @param {string} type - 'danger' (red), 'success' (green), 'info' (blue/default), 'warning' (yellow).
 * @param {boolean} isAlert - If true, only shows the "Confirm" button (acting as OK).
 */
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "info",
  isAlert = false
}) => {
  if (!isOpen) return null;

  // Determine colors and icons based on type
  const styles = {
    danger: {
      icon: <AlertTriangle className="text-red-600" size={24} />,
      bgIcon: "bg-red-100",
      btnConfirm: "bg-red-600 hover:bg-red-700 focus:ring-red-200",
      textTitle: "text-red-900"
    },
    success: {
        icon: <CheckCircle className="text-green-600" size={24} />,
        bgIcon: "bg-green-100",
        btnConfirm: "bg-green-600 hover:bg-green-700 focus:ring-green-200",
        textTitle: "text-green-900"
    },
    warning: {
        icon: <AlertTriangle className="text-yellow-600" size={24} />,
        bgIcon: "bg-yellow-100",
        btnConfirm: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-200",
        textTitle: "text-yellow-900"
    },
    info: {
      icon: <Info className="text-blue-600" size={24} />,
      bgIcon: "bg-blue-100",
      btnConfirm: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-200",
      textTitle: "text-slate-800"
    }
  };

  const style = styles[type] || styles.info;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        
        <div className="p-6 text-center">
            <div className={`mx-auto flex items-center justify-center w-12 h-12 rounded-full mb-4 ${style.bgIcon}`}>
                {style.icon}
            </div>

            <h3 className={`text-lg font-bold mb-2 ${style.textTitle}`}>
                {title}
            </h3>
            
            <p className="text-slate-500 text-sm mb-6">
                {message}
            </p>

            <div className="flex gap-3 justify-center">
                {!isAlert && (
                    <button 
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-100 transition"
                    >
                        {cancelText}
                    </button>
                )}
                <button 
                    onClick={() => {
                        if (onConfirm) onConfirm();
                        if (isAlert) onClose(); // Alerts close on confirm/OK
                    }}
                    className={`flex-1 px-4 py-2 text-white font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 ring-offset-1 transition ${style.btnConfirm}`}
                >
                    {confirmText}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
