'use client';

type ConfirmSubmitButtonProps = {
  message: string;
  children: React.ReactNode;
};

export default function ConfirmSubmitButton({ message, children }: ConfirmSubmitButtonProps) {
  return (
    <button type="submit" onClick={(e) => { if (!confirm(message)) e.preventDefault(); }}>
      {children}
    </button>
  );
}
