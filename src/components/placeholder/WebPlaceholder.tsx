import AppShell from '@/components/layout/AppShell';
import WebPlaceholderContent from '@/components/placeholder/WebPlaceholderContent';

type WebPlaceholderProps = {
  pageTitle: string;
  pageDescription: string;
};

export default function WebPlaceholder({
  pageTitle,
  pageDescription,
}: WebPlaceholderProps) {
  return (
    <AppShell>
      <WebPlaceholderContent
        pageTitle={pageTitle}
        pageDescription={pageDescription}
      />
    </AppShell>
  );
}
