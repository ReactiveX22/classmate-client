import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  IconUsers,
  IconSchool,
  IconBook,
  IconUserPlus,
  IconFileText,
  IconBell,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function DashboardPage() {
  // Mock Data for Stats
  const stats = [
    {
      title: 'Total Students',
      value: '2,850',
      change: '+180 from last month',
      icon: IconUsers,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Total Teachers',
      value: '145',
      change: '+12 from last month',
      icon: IconSchool,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Active Courses',
      value: '48',
      change: '+4 new this semester',
      icon: IconBook,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
  ];

  // Mock Data for Recent Activity
  const activities = [
    {
      user: 'Sarah Miller',
      action: 'submitted assignment',
      target: 'Physics 101 Stats',
      time: '2 hours ago',
      avatar: '',
      initials: 'SM',
    },
    {
      user: 'James Wilson',
      action: 'posted a new announcement',
      target: 'School Holiday Update',
      time: '5 hours ago',
      avatar: '',
      initials: 'JW',
    },
    {
      user: 'Dr. Emily Chen',
      action: 'created a new course',
      target: 'Advanced Biology',
      time: '1 day ago',
      avatar: '',
      initials: 'EC',
    },
    {
      user: 'Alex Thompson',
      action: 'registered as new student',
      target: '',
      time: '1 day ago',
      avatar: '',
      initials: 'AT',
    },
  ];

  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground'>
            Overview of your organization&apos;s activity.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button>
            <IconUserPlus className='mr-2 h-4 w-4' />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stat.value}</div>
              <p className='text-xs text-muted-foreground'>{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-7'>
        {/* Recent Activity */}
        <Card className='col-span-4'>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions across the organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-8'>
              {activities.map((activity, index) => (
                <div key={index} className='flex items-center'>
                  <Avatar className='h-9 w-9'>
                    <AvatarImage src={activity.avatar} alt={activity.user} />
                    <AvatarFallback>{activity.initials}</AvatarFallback>
                  </Avatar>
                  <div className='ml-4 space-y-1'>
                    <p className='text-sm font-medium leading-none'>
                      {activity.user}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {activity.action}{' '}
                      {activity.target && (
                        <span className='font-medium text-foreground'>
                          {activity.target}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className='ml-auto font-medium text-xs text-muted-foreground'>
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className='col-span-3'>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks.</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <Button
              variant='outline'
              className='w-full justify-start'
              size='lg'
            >
              <IconUserPlus className='mr-2 h-4 w-4' />
              Register New Student
            </Button>
            <Button
              variant='outline'
              className='w-full justify-start'
              size='lg'
            >
              <IconSchool className='mr-2 h-4 w-4' />
              Add Teacher Account
            </Button>
            <Button
              variant='outline'
              className='w-full justify-start'
              size='lg'
            >
              <IconFileText className='mr-2 h-4 w-4' />
              Create Announcement
            </Button>
            <Button
              variant='outline'
              className='w-full justify-start'
              size='lg'
            >
              <IconBell className='mr-2 h-4 w-4' />
              Send Notification
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
