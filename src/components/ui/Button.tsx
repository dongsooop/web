import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type BtnColor = 'primary' | 'outline' | 'text' | 'gray' | 'danger';
type BtnHeight = 'default' | 'large';
type BtnFontWeight = 'regular' | 'semibold';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  color?: BtnColor;
  height?: BtnHeight;
  fontWeight?: BtnFontWeight;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const COLOR_CLASS_MAP: Record<BtnColor, string> = {
  primary: 'bg-primary text-white',
  outline: 'border border-gray2 bg-white text-gray6',
  text: 'bg-transparent text-gray4',
  gray: 'bg-gray1 text-gray4',
  danger: 'border border-warning-100 bg-white text-warning-100',
};

const HEIGHT_CLASS_MAP: Record<BtnHeight, string> = {
  default: 'h-11',
  large: 'h-12',
};

const FONT_WEIGHT_CLASS_MAP: Record<BtnFontWeight, string> = {
  regular: 'font-regular',
  semibold: 'font-semibold',
};

export default function Button({
  children,
  color = 'primary',
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
    'inline-flex items-center justify-center rounded-xl px-4 text-[14px]/[20px] transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-60';

  const widthClass = fullWidth ? 'w-full' : '';
  const colorClass = COLOR_CLASS_MAP[color];
  const heightClass = HEIGHT_CLASS_MAP[height];
  const fontWeightClass = FONT_WEIGHT_CLASS_MAP[fontWeight];

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(baseClass, widthClass, className, colorClass, heightClass, fontWeightClass)}
      {...props}
    >
      <span className={cn('flex items-center', isLoading ? 'gap-2' : 'gap-0')}>
        {children}
        {isLoading && (
          <span
            className="h-4 w-4 animate-spin rounded-lg border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
      </span>
    </button>
  );
}
