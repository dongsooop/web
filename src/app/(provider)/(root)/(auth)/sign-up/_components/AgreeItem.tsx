'use client';

import Link from 'next/link';

interface AgreementItemProps {
  label: string;
  link: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

const AgreementItem = ({ label, link, checked, onChange }: AgreementItemProps) => {
  return (
    <div className="flex items-center justify-between">
      <label className="flex min-h-[44px] cursor-pointer items-center py-1">
        <div className="-ml-3 flex h-[44px] w-[44px] items-center justify-center">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="accent-primary h-4 w-4 cursor-pointer"
          />
        </div>
        <span className="text-normal font-regular leading-none text-black">{label}</span>
      </label>
      <Link
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-small text-gray4 ml-auto flex min-h-[44px] min-w-[44px] items-center justify-end font-bold hover:underline"
      >
        보기
      </Link>
    </div>
  );
};

interface AgreementSectionProps {
  agreedTerms: boolean;
  agreedPrivacy: boolean;
  onTermsChange: (val: boolean) => void;
  onPrivacyChange: (val: boolean) => void;
}

const TERMS_URL =
  'https://zircon-football-529.notion.site/Dongsoop-2333ee6f2561800cb85fdc87fbe9b4c2';
const PRIVACY_URL =
  'https://zircon-football-529.notion.site/Dongsoop-2333ee6f256180a0821fdbf087345a1d';

export default function AgreementSection({
  agreedTerms,
  agreedPrivacy,
  onTermsChange,
  onPrivacyChange,
}: AgreementSectionProps) {
  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="flex items-end gap-2">
        <p className="text-normal font-bold text-black">
          약관 동의<span className="text-primary"> *</span>
        </p>
      </div>
      <div className="border-gray2 flex flex-col gap-4 rounded-[8px] border p-4">
        <AgreementItem
          label="동숲 서비스 이용약관 동의"
          link={TERMS_URL}
          checked={agreedTerms}
          onChange={onTermsChange}
        />
        <AgreementItem
          label="개인정보 처리방침 동의"
          link={PRIVACY_URL}
          checked={agreedPrivacy}
          onChange={onPrivacyChange}
        />
      </div>
    </div>
  );
}
