'use client';

interface SchoolEmailInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
}

export default function SchoolEmailInput({
  value,
  onChange,
  placeholder,
  disabled = false,
  hasError = false,
}: SchoolEmailInputProps) {
  return (
    <div
      className={`flex h-11 w-full items-center rounded-lg border px-4 ${hasError ? 'border-warning-100' : 'border-gray2'}`}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="text-bodySm sm:text-body font-regular placeholder:text-gray4 max-w-full min-w-0 flex-1 bg-transparent text-black"
      />

      <span className="text-bodySm sm:text-body font-regular text-gray4 shrink-0">
        @dongyang.ac.kr
      </span>
    </div>
  );
}
