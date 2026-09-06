'use client';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
export function Modal({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode }) {
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose(); if (open) addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/20 p-6 backdrop-blur-sm" onClick={onClose}>
      <div role="dialog" aria-modal aria-label={title} onClick={e => e.stopPropagation()} className="w-full max-w-lg rounded-soft-lg bg-nm-bg p-8 shadow-soft-lg animate-nm-in">
        <div className="flex items-start justify-between gap-4"><h2 className="text-2xl">{title}</h2><IconButton size="sm" label="Close" onClick={onClose}><X className="size-4" /></IconButton></div>
        <div className="mt-4 text-sm leading-relaxed text-nm-muted">{children}</div>
        {footer && <div className="mt-8 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}
