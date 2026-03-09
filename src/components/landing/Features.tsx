import {
  IconBell,
  IconChalkboard,
  IconRocket,
  IconSchool,
  IconUserShield,
  IconUsers,
} from '@tabler/icons-react';

export function Features() {
  const features = [
    {
      icon: IconChalkboard,
      title: 'Classroom Management',
      description:
        'Manage your virtual classrooms, post assignments, and track attendance seamlessly across all your courses.',
    },
    {
      icon: IconSchool,
      title: 'Course Materials',
      description:
        'Access courses, download reading materials, and submit assignments all in one centralized student portal.',
    },
    {
      icon: IconBell,
      title: 'Smart Notifications',
      description:
        'Never miss a deadline or critical announcement. Real-time updates for important campus notices and results.',
    },
    {
      icon: IconUsers,
      title: 'User Management',
      description:
        'Easily manage students, teachers, and assign course materials from a comprehensive admin dashboard.',
    },
    {
      icon: IconUserShield,
      title: 'Secure',
      description: 'Role-based access control protecting sensitive data.',
    },
    {
      icon: IconRocket,
      title: 'Easy to Use',
      description:
        'Intuitive interfaces designed to save time for educators and simplify navigation for students.',
    },
  ];

  return (
    <section
      id='features'
      className='py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto'
    >
      <div className='mb-12 md:mb-16 text-center md:text-left'>
        <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-balance tracking-tight'>
          Everything you need to{' '}
          <span className='text-primary'>run your campus</span>
        </h2>
        <p className='text-lg sm:text-xl text-muted-foreground max-w-2xl text-balance mx-auto md:mx-0'>
          Powerful features designed specifically for every role in the modern
          university ecosystem.
        </p>
      </div>

      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8'>
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-card p-6 md:p-8 hover:shadow-xl hover:border-primary/20 transition-all duration-300 ${
        className || ''
      }`}
    >
      <div className='mb-4 md:mb-6 inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm group-hover:-translate-y-1 transition-transform'>
        <Icon size={20} className='md:w-6 md:h-6' />
      </div>
      <h3 className='mb-2 text-xl font-bold tracking-tight'>{title}</h3>
      <p className='text-muted-foreground leading-relaxed'>{description}</p>
    </div>
  );
}
