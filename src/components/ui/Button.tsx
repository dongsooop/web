import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'outline' | 'text' | 'gray';
type ButtonHeight = 'default' | 'cta';
type ButtonFontWeight = 'regular' | 'semibold';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  height?: ButtonHeight;
  fontWeight?: ButtonFontWeight;
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
  default: 'h-11',
  cta: 'min-h-12',
};

const FONT_WEIGHT_CLASS_MAP: Record<ButtonFontWeight, string> = {
  regular: 'font-regular',
  semibold: 'font-semibold',
};

export default function Button({
  children,
  variant = 'primary',
  height = 'default',
  fontWeight = 'semibold',
  fullWidth = false,
  className = '',
  disabled = false,
  isLoading = false,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseClass =
    'inline-flex items-center justify-center rounded-[8px] px-4 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-60';

  const widthClass = fullWidth ? 'w-full' : '';
  const variantClass = VARIANT_CLASS_MAP[variant];
  const heightClass = HEIGHT_CLASS_MAP[height];
  const fontWeightClass = FONT_WEIGHT_CLASS_MAP[fontWeight];

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseClass} ${widthClass} ${variantClass} ${heightClass} ${fontWeightClass} ${className}`}
      {...props}
    >
      <span className="flex items-center gap-2">
        {isLoading && (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        <span>{children}</span>
      </span>
    </button>
  );
}
