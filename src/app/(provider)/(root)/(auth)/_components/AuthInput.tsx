interface InputProps {
  type?: 'text' | 'password' | 'email';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
}

export default function AuthInput({
  type = 'text',
  value,
  onChange,
  placeholder,
  hasError = false,
}: InputProps) {
  const borderClass = hasError
    ? 'border-red-500 focus:border-red-500'
    : 'border-gray-300 focus:border-primary';

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`text-normal placeholder:text-gray4 font-regular h-[44px] w-full rounded-[8px] border bg-white px-4 transition outline-none ${borderClass}`}
    />
  );
}
