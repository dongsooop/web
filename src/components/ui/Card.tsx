type CardProps = {
  title?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export default function Card({ title, right, children, className }: CardProps) {
  const baseStyle = 'rounded-2xl block bg-white p-4 shadow-sm flex h-full flex-col';
  const mergedClassName = className ? `${baseStyle} ${className}` : baseStyle;

  return (
    <section className={mergedClassName}>
      {(title || right) && (
        <div className="border-gray2 flex items-center justify-between px-2 py-3">
          <div className="text-large font-semibold text-black">{title}</div>
          {right}
        </div>
      )}
      <div className="flex-1 p-2">{children}</div>
    </section>
  );
}