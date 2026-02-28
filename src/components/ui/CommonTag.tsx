type TagTone = 'blue' | 'gray' | 'red' | 'yellow' | 'outline';

type CommonTagProps = {
  label: string;
  tone?: TagTone;
};

const TONE_MAP: Record<TagTone, string> = {
  outline: 'border border-gray2 bg-white text-gray6',
  blue: 'border border-primary/20 bg-primary/5 text-primary',
  gray: 'border border-gray2 bg-gray1 text-gray6',
  red: 'border border-label-red-10 bg-label-red-10 text-label-red-100',
  yellow: 'border border-label-yellow-10 bg-label-yellow-10 text-label-yellow-100',
};

export default function CommonTag({
  label,
  tone = 'outline',
}: CommonTagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-small font-semibold ${TONE_MAP[tone]}`}
    >
      {label}
    </span>
  );
}