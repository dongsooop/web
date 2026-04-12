'use client';

interface SchoolEmailInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  domain?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  autoComplete?: string;
  hasError?: boolean;
}

export default function SchoolEmailInput({
  value,
  onChange,
  placeholder,
  domain = '@dongyang.ac.kr',
  disabled = false,
  name,
  id,
  autoComplete = 'username',
  hasError = false,
}: SchoolEmailInputProps) {
  return (
    <div
      className={`flex h-[44px] w-full items-center rounded-[8px] border px-4 ${hasError ? 'border-red-500' : 'border-gray2'}`}
    >
      <input
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="text-normal font-regular placeholder:text-gray4 max-w-full min-w-0 flex-1 bg-transparent text-black"
      />

      <span className="text-normal font-regular text-gray4 shrink-0">{domain}</span>
    </div>
  );
}
