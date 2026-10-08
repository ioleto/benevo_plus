'use client';

import type { ReactNode } from 'react';

type ConfirmSubmitButtonProps = {
  message: string;
  children: ReactNode;
  className?: string;
};

export default function ConfirmSubmitButton({ message, children, className }: ConfirmSubmitButtonProps) {
  return (
    <button type="submit" className={className} onClick={(e) => { if (!confirm(message)) e.preventDefault(); }}>
      {children}
    </button>
  );
}
