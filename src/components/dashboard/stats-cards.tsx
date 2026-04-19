'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'motion/react';
import { IconUsers, IconSchool, IconBook } from '@tabler/icons-react';

interface StatItemProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  bgColor: string;
  index: number;
}

function StatItem({ title, value, description, icon: Icon, bgColor, index }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="relative overflow-hidden border-none shadow-md bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group gap-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <div className={`p-2 rounded-xl ${bgColor} bg-opacity-10 transition-transform duration-300 group-hover:scale-110`}>
            <Icon className={`size-5`} stroke={1.5} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">{value}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        </CardContent>
        {/* Decorative background element */}
        <div className={`absolute -right-4 -bottom-4 size-18 rounded-full ${bgColor} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500`} />
      </Card>
    </motion.div>
  );
}

export function StatsCards() {
  const stats = [
    {
      title: 'Students',
      value: '1,284',
      description: 'Total enrolled students',
      icon: IconUsers,
      bgColor: 'bg-blue-500',
    },
    {
      title: 'Teachers',
      value: '84',
      description: 'Total faculty members',
      icon: IconSchool,
      bgColor: 'bg-indigo-500',
    },
    {
      title: 'Courses',
      value: '42',
      description: 'Total active courses',
      icon: IconBook,
      bgColor: 'bg-rose-500',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <StatItem key={stat.title} {...stat} index={index} />
      ))}
    </div>
  );
}
