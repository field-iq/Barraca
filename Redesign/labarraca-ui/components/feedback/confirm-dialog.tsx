'use client';
import { Modal } from './modal';
import { Button } from '@/components/ui/button';
export function ConfirmDialog({ open, onClose, onConfirm, title, body, confirmLabel = 'Confirm', destructive }: { open: boolean; onClose: () => void; onConfirm: () => void; title: string; body: string; confirmLabel?: string; destructive?: boolean }) {
  return <Modal open={open} onClose={onClose} title={title} footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant={destructive ? 'danger' : 'accent'} onClick={onConfirm}>{confirmLabel}</Button></>}>{body}</Modal>;
}
