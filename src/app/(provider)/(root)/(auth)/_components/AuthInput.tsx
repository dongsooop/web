interface InputProps {
  type?: 'text' | 'password' | 'email';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function AuthInput({
  type = 'text',
  value,
  onChange,
  placeholder,
}: InputProps) {
  return (
    <div className="flex h-[44px] w-full items-center rounded-[8px] border border-gray2 px-4">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-normal font-regular text-black outline-none placeholder:text-gray4"
      />
    </div>
  );
}