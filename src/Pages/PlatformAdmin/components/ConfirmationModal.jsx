import React from 'react';
import { X, AlertTriangle, ShieldAlert, Trash2, Info } from 'lucide-react';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "warning", // warning, danger, info
    isProcessing = false
}) => {
    if (!isOpen) return null;

    const themes = {
        warning: {
            icon: <AlertTriangle className="text-amber-500" size={32} />,
            bg: "bg-amber-50",
            button: "bg-amber-600 hover:bg-amber-700 shadow-amber-200",
            border: "border-amber-100"
        },
        danger: {
            icon: <ShieldAlert className="text-rose-500" size={32} />,
            bg: "bg-rose-50",
            button: "bg-rose-600 hover:bg-rose-700 shadow-rose-200",
            border: "border-rose-100"
        },
        info: {
            icon: <Info className="text-blue-500" size={32} />,
            bg: "bg-blue-50",
            button: "bg-blue-600 hover:bg-blue-700 shadow-blue-200",
            border: "border-blue-100"
        }
    };

    const activeTheme = themes[type] || themes.warning;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden transform animate-in zoom-in-95 duration-200">

                {/* Header decoration */}
                <div className={`h-2 ${activeTheme.bg}`} />

                <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className={`p-4 rounded-2xl ${activeTheme.bg} ${activeTheme.border} border shadow-inner`}>
                            {activeTheme.icon}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                            {title}
                        </h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                            {message}
                        </p>
                    </div>

                    <div className="flex gap-3 mt-10">
                        <button
                            onClick={onClose}
                            disabled={isProcessing}
                            className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100 disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isProcessing}
                            className={`flex-1 py-4 ${activeTheme.button} text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center`}
                        >
                            {isProcessing ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : confirmText}
                        </button>
                    </div>
                </div>

                {/* Footer Accent */}
                <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Platform Security Protocol • v1.0</p>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
