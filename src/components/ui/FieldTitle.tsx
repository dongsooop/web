import type { ReactNode } from 'react';

type FieldTitleProps = {
  children: ReactNode;
  description?: ReactNode;
  required?: boolean;
};

function RequiredMark() {
  return (
    <span className="text-primary ml-1" aria-hidden="true">
      *
    </span>
  );
}

export function FieldLabel({ children, required = false }: FieldTitleProps) {
  return (
    <label className="text-bodySm flex min-h-11 items-center font-semibold text-black">
      {children}
      {required ? <RequiredMark /> : null}
    </label>
  );
}

export function FieldLegend({ children, description, required = false }: FieldTitleProps) {
  return (
    <legend className="text-bodySm flex min-h-11 items-center gap-2 font-semibold text-black">
      <span className="inline-flex shrink-0 items-center">
        {children}
        {required ? <RequiredMark /> : null}
      </span>
      {description}
    </legend>
  );
}
