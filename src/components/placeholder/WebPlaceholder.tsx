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
    <WebPlaceholderContent
      title={title}
      description={description}
    />
  );
}
