export default function DashboardPage() {
  return (
    <div>
      <div className='grid auto-rows-min gap-4 md:grid-cols-6'>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className='aspect-video rounded-xl bg-sidebar-accent' />
        ))}
      </div>
    </div>
  );
}
