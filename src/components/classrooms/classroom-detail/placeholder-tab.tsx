import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface PlaceholderTabProps {
  title: string;
  description: string;
  icon: LucideIcon | React.ComponentType<{ size?: number; className?: string }>;
}

export function PlaceholderTab({
  title,
  description,
  icon: Icon,
}: PlaceholderTabProps) {
  return (
    <div className='mt-6'>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-lg'>
            <Icon size={48} className='text-muted-foreground mb-4' />
            <h3 className='text-lg font-semibold mb-2'>{title}</h3>
            <p className='text-sm text-muted-foreground text-center mb-4'>
              {description}
            </p>
            <p className='text-xs text-muted-foreground font-medium uppercase tracking-wider bg-secondary px-2 py-1 rounded'>
              Coming Soon
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
