interface InputProps {
  type?: 'text' | 'password' | 'email';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
  isSuccess?: boolean;
  disabled?: boolean;
}

export default function AuthInput({
  type = 'text',
  value,
  onChange,
  placeholder,
  hasError = false,
  isSuccess = false,
  disabled,
}: InputProps) {
  const borderClass = hasError
    ? 'border-warning-100 focus:border-warning-100'
    : isSuccess
      ? 'border-primary focus:border-primary'
      : 'border-gray2 focus:border-primary';

  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`text-bodySm sm:text-body placeholder:text-gray4 font-regular h-11 w-full rounded-lg border bg-white px-4 text-black transition outline-none ${borderClass}`}
    />
  );
}
