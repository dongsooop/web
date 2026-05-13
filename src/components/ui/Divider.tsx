interface DividerProps {
  className?: string;
  spacing?: boolean;
}

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function Divider({ className = '', spacing = true }: DividerProps) {
  return (
    <div className={cx(spacing && 'py-3', className)}>
      <div className="bg-gray2 h-px" />
    </div>
  );
}
