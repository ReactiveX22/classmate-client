import { Providers } from '@/lib/providers/QueryProvider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NuqsAdapter>
      <Providers>{children}</Providers>
    </NuqsAdapter>
  );
}
