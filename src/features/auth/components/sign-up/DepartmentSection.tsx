import { ChevronDown } from 'lucide-react';
import { FieldLegend } from '@/components/ui/FieldTitle';
import { DEPARTMENTS } from '@/constants/department';

type DepartmentSectionProps = {
  value: string;
  onOpen: () => void;
};

export default function DepartmentSection({ value, onOpen }: DepartmentSectionProps) {
  const selectedDepartment = DEPARTMENTS.find((department) => department.code === value);
  const hasValue = value && value !== 'UNKNOWN' && value !== '';
  const displayText = hasValue ? selectedDepartment?.displayName : '학과 선택';

  return (
    <fieldset className="flex flex-col gap-4 px-4">
      <FieldLegend required>학과</FieldLegend>

      <button
        type="button"
        onClick={onOpen}
        className="border-gray2 active:border-primary flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border bg-white px-4 transition-all outline-none"
      >
        <span className={`text-bodySm sm:text-body ${hasValue ? 'text-black' : 'text-gray3'}`}>
          {displayText}
        </span>
        <ChevronDown size={12} strokeWidth={1.5} className="text-gray4" aria-hidden="true" />
      </button>
    </fieldset>
  );
}
