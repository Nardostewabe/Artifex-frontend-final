import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info', // 'info', 'success', 'warning', 'danger'
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        isAlert: false,
    });

    // We use a ref to hold the resolve function of the current promise
    const resolveRef = useRef(null);

    const handleClose = useCallback(() => {
        setModalState((prev) => ({ ...prev, isOpen: false }));
        if (resolveRef.current) {
            resolveRef.current(false); // Resolve with false (cancelled/closed)
            resolveRef.current = null;
        }
    }, []);

    const handleConfirm = useCallback(() => {
        setModalState((prev) => ({ ...prev, isOpen: false }));
        if (resolveRef.current) {
            resolveRef.current(true); // Resolve with true (confirmed)
            resolveRef.current = null;
        }
    }, []);

    /**
     * Shows a modal and returns a promise that resolves to true (confirmed) or false (cancelled).
     */
    const showModal = useCallback(({
        title = 'Confirm',
        message = 'Are you sure?',
        type = 'info',
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        isAlert = false
    }) => {
        // If there's already an open modal, we might want to close it or queue.
        // For simplicity, we just overwrite for now, but resolving the previous one is safer.
        if (resolveRef.current) {
            resolveRef.current(false);
        }

        setModalState({
            isOpen: true,
            title,
            message,
            type,
            confirmText,
            cancelText,
            isAlert,
        });

        return new Promise((resolve) => {
            resolveRef.current = resolve;
        });
    }, []);

    /**
     * Convenience method for a simple alert (OK button only).
     */
    const showAlert = useCallback((message, title = 'Alert', type = 'info') => {
        return showModal({
            title,
            message,
            type,
            confirmText: 'OK',
            isAlert: true,
        });
    }, [showModal]);

    return (
        <ModalContext.Provider value={{ showModal, showAlert }}>
            {children}
            <ConfirmationModal
                isOpen={modalState.isOpen}
                onClose={handleClose}
                onConfirm={handleConfirm}
                title={modalState.title}
                message={modalState.message}
                type={modalState.type}
                confirmText={modalState.confirmText}
                cancelText={modalState.cancelText}
                isAlert={modalState.isAlert}
            />
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
