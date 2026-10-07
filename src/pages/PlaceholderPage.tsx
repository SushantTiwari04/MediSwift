import { PageContainerPlaceholder } from '@/components/layout/PageContainer';
import type { Role } from '@/config/navigation';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  role: Role;
}

export function PlaceholderPage({ title, description, role }: PlaceholderPageProps) {
  return (
    <PageContainerPlaceholder
      title={title}
      description={description}
      role={role}
    />
  );
}
