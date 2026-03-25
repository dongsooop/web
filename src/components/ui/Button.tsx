import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'outline' | 'text' | 'gray';
type ButtonHeight = 'default' | 'cta';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  height?: ButtonHeight;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const VARIANT_CLASS_MAP: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white',
  outline: 'border border-primary bg-white text-primary',
  text: 'bg-transparent text-gray4',
  gray: 'bg-gray1 text-gray4',
};

const HEIGHT_CLASS_MAP: Record<ButtonHeight, string> = {
  default: 'h-[44px]',
  cta: 'h-[48px]',
};

export default function Button({
  children,
  variant = 'primary',
  height = 'default',
  fullWidth = false,
  className = '',
  disabled = false,
  isLoading = false,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseClass =
    'inline-flex items-center justify-center rounded-[8px] px-4 font-semibold transition cursor-pointer';

  const widthClass = fullWidth ? 'w-full' : '';
  const variantClass = VARIANT_CLASS_MAP[variant];
  const heightClass = HEIGHT_CLASS_MAP[height];

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseClass} ${widthClass} ${variantClass} ${heightClass} ${className}`}
      {...props}
    >
      {isLoading ? '처리 중...' : children}
    </button>
  );
}
