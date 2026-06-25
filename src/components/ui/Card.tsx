import { cn } from '@/lib/cn';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className }: CardProps) {
  const baseStyle = 'border-gray1 flex w-full h-full flex-col rounded-xl border bg-white p-4';
  const finalClassName = cn(baseStyle, className);
  return <section className={finalClassName}>{children}</section>;
}
