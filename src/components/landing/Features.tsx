import {
  IconBell,
  IconCalendar,
  IconChalkboard,
  IconRocket,
  IconSchool,
  IconUserShield,
} from '@tabler/icons-react';

export function Features() {
  return (
    <section id='features' className='py-24 px-6 max-w-7xl mx-auto'>
      <div className='mb-16'>
        <h2 className='text-3xl md:text-4xl font-bold mb-4'>
          Everything you need to run your campus
        </h2>
        <p className='text-xl text-muted-foreground max-w-2xl'>
          Powerful features for every role in the university ecosystem.
        </p>
      </div>

      <div className='grid md:grid-cols-3 gap-8'>
        {/* Feature 1 */}
        <div className='group relative overflow-hidden rounded-2xl border bg-card p-8 hover:shadow-lg transition-all duration-300'>
          <div className='mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
            <IconChalkboard size={24} />
          </div>
          <h3 className='mb-2 text-xl font-bold'>Teacher Dashboard</h3>
          <p className='text-muted-foreground'>
            Manage classes, post assignments, and track attendance seamlessly.
            grading made easy.
          </p>
        </div>

        {/* Feature 2 */}
        <div className='group relative overflow-hidden rounded-2xl border bg-card p-8 hover:shadow-lg transition-all duration-300'>
          <div className='mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
            <IconSchool size={24} />
          </div>
          <h3 className='mb-2 text-xl font-bold'>Student Portal</h3>
          <p className='text-muted-foreground'>
            A central hub for your academic life. proper schedule, submissions,
            grades, and resources.
          </p>
        </div>

        {/* Feature 3 */}
        <div className='group relative overflow-hidden rounded-2xl border bg-card p-8 hover:shadow-lg transition-all duration-300'>
          <div className='mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
            <IconBell size={24} />
          </div>
          <h3 className='mb-2 text-xl font-bold'>Smart Notifications</h3>
          <p className='text-muted-foreground'>
            Never miss a deadline or announcement. Real-time updates for notices
            and results.
          </p>
        </div>
      </div>

      {/* Bento Grid Concept for more features */}
      <div className='mt-8 grid md:grid-cols-4 md:grid-rows-2 gap-4 h-150'>
        <div className='md:col-span-2 md:row-span-2 rounded-2xl border bg-card p-8 flex flex-col justify-between hover:border-primary/50 transition-colors'>
          <div>
            <div className='mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
              <IconCalendar size={24} />
            </div>
            <h3 className='text-2xl font-bold mb-2'>Academic Calendar</h3>
            <p className='text-muted-foreground'>
              Keep track of exams, holidays, and events.
            </p>
          </div>
          <div className='w-full h-48 bg-muted/50 rounded-xl border border-dashed flex items-center justify-center text-muted-foreground/30'>
            <IconCalendar size={48} stroke={1} />
          </div>
        </div>
        <div className='md:col-span-2 md:row-span-1 rounded-2xl border bg-card p-8 flex items-center justify-between hover:border-primary/50 transition-colors'>
          <div>
            <div className='mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
              <IconUserShield size={24} />
            </div>
            <h3 className='text-xl font-bold mb-2'>Admin Controls</h3>
            <p className='text-muted-foreground'>
              Full oversight of the system.
            </p>
          </div>
        </div>
        <div className='md:col-span-1 md:row-span-1 rounded-2xl border bg-card p-8 hover:border-primary/50 transition-colors'>
          <div className='mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
            <IconUserShield size={24} />
          </div>
          <h3 className='text-xl font-bold mb-2'>Secure</h3>
          <p className='text-muted-foreground text-sm'>
            Role-based access control.
          </p>
        </div>
        <div className='md:col-span-1 md:row-span-1 rounded-2xl border bg-card p-8 hover:border-primary/50 transition-colors'>
          <div className='mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary'>
            <IconRocket size={24} />
          </div>
          <h3 className='text-xl font-bold mb-2'>Fast</h3>
          <p className='text-muted-foreground text-sm'>
            Optimized for performance.
          </p>
        </div>
      </div>
    </section>
  );
}
