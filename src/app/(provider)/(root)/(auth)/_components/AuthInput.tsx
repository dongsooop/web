interface InputProps {
  type?: 'text' | 'password' | 'email';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
  disabled?: boolean;
}

export default function AuthInput({
  type = 'text',
  value,
  onChange,
  placeholder,
  hasError = false,
  disabled,
}: InputProps) {
  const borderClass = hasError
    ? 'border-red-500 focus:border-red-500'
    : 'border-gray2 focus:border-primary';

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`text-normal placeholder:text-gray4 font-regular h-[44px] w-full rounded-[8px] border bg-white px-4 text-black transition outline-none ${borderClass}`}
    />
  );
}
