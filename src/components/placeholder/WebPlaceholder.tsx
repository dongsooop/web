import AppShell from '@/components/layout/AppShell';
import WebPlaceholderContent from '@/components/placeholder/WebPlaceholderContent';

type WebPlaceholderProps = {
  title: string;
  description: string;
};

export default function WebPlaceholder({
  title,
  description,
}: WebPlaceholderProps) {
  return (
    <AppShell>
      <WebPlaceholderContent
        title={title}
        description={description}
      />
    </AppShell>
  );
}
