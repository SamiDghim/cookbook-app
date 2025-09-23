import React from 'react';

interface ModalProps {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export default function Modal({ open, title, children, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black opacity-40"
        onClick={onCancel}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onCancel?.(); }}
      />
      <div
        className="bg-white rounded-lg shadow-lg max-w-lg w-full z-10 p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {title && <h3 id="modal-title" className="text-lg font-semibold mb-3">{title}</h3>}
        <div className="mb-4">{children}</div>
        <div className="flex justify-end gap-3">
          <button type="button" className="px-4 py-2 rounded border" onClick={onCancel} data-testid="modal-cancel">{cancelText}</button>
          <button type="button" className="px-4 py-2 rounded bg-blue-600 text-white" onClick={onConfirm} data-testid="modal-confirm">{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
