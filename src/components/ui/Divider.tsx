interface DividerProps {
  spacing?: boolean;
}

export function Divider({ spacing = true }: DividerProps) {
  return (
    <div className={spacing ? 'py-3' : ''}>
      <div className="bg-gray2 h-px" />
    </div>
  );
}
