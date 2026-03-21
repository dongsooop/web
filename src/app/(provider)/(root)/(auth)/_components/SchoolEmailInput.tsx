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
}

export default function SchoolEmailInput({
  value,
  onChange,
  placeholder = '학교 Gmail을 입력해 주세요',
  domain = '@dongyang.ac.kr',
  disabled = false,
  name,
  id,
  autoComplete = 'username',
}: SchoolEmailInputProps) {
  return (
    <div
      className={`flex h-[44px] w-full items-center rounded-[8px] border px-4 ${
        disabled ? 'border-gray2 bg-gray1' : 'border-gray2 bg-white'
      }`}
    >
      <input
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className="text-normal font-regular placeholder:text-gray4 disabled:text-gray4 max-w-full min-w-0 flex-1 bg-transparent text-black outline-none disabled:cursor-not-allowed"
      />

      <span className="text-normal font-regular text-gray4 shrink-0">{domain}</span>
    </div>
  );
}
