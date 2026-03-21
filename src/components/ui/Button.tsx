import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'outline' | 'text';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClass =
    'inline-flex h-[44px] items-center justify-center rounded-[8px] px-4 text-normal font-bold transition disabled:cursor-not-allowed disabled:opacity-60';

  const widthClass = fullWidth ? 'w-full' : '';

  const variantClass =
    variant === 'primary'
      ? 'bg-primary text-white'
      : variant === 'outline'
        ? 'border border-primary bg-white text-primary'
        : 'bg-transparent text-gray4';

  return (
    <button
      disabled={disabled}
      className={`${baseClass} ${widthClass} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}