'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/hooks/useAuth';
import { Role } from '@/types/auth';
import { format } from 'date-fns';
import {
  BriefcaseBusiness,
  Check,
  IdCard,
  Pencil,
  Phone,
  Plus,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Achievement {
  id: string;
  date: string;
  title: string;
  issuer: string;
  description: string;
}

export default function ProfilePage() {
  const { data: user, isLoading } = useUser();

  // Mock data state - in a real app this would come from an API
  const [phone, setPhone] = useState('+1 (555) 000-0000');
  const [bio, setBio] = useState(
    'Passionate learner and technology enthusiast. Always looking to expand my knowledge and collaborate with others.',
  );
  const [skills, setSkills] = useState([
    'JavaScript',
    'React',
    'Node.js',
    'TypeScript',
    'UI/UX Design',
  ]);
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      date: '2024-05-15',
      title: 'Open Source Contributor',
      issuer: 'GitHub',
      description: 'Contributed core features to a major ORM library.',
    },
    {
      id: '2',
      date: '2023-11-20',
      title: 'Hackathon Winner',
      issuer: 'TechCrunch',
      description: 'First place in the annual university hackathon.',
    },
  ]);

  // Dialog states
  const [isAchievementDialogOpen, setIsAchievementDialogOpen] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Omit<Achievement, 'id'>>(
    {
      date: new Date().toISOString().split('T')[0],
      title: '',
      issuer: '',
      description: '',
    },
  );

  const [newSkill, setNewSkill] = useState('');

  if (isLoading) {
    return <div className='p-8'>Loading profile...</div>;
  }

  if (!user) {
    return <div className='p-8'>User not found.</div>;
  }

  const handleSaveProfile = () => {
    // Here call mutation to update profile
    toast.success('Profile updated successfully');
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
      toast.success('Skill added');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleAddAchievement = () => {
    if (newAchievement.title && newAchievement.issuer && newAchievement.date) {
      setAchievements([
        ...achievements,
        { ...newAchievement, id: crypto.randomUUID() },
      ]);
      setNewAchievement({
        date: new Date().toISOString().split('T')[0],
        title: '',
        issuer: '',
        description: '',
      });
      setIsAchievementDialogOpen(false);
      toast.success('Achievement added');
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleRemoveAchievement = (id: string) => {
    setAchievements(achievements.filter((a) => a.id !== id));
    toast.success('Achievement removed');
  };

  return (
    <div className='container max-w-7xl mx-auto p-4 md:p-8 space-y-8'>
      <div>
        <h1 className='text-xl font-semibold'>Profile & Settings</h1>
        <p className='text-sm text-muted-foreground'>
          Manage your personal information and preferences.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column - User Info */}
        <div className='lg:col-span-1 space-y-6'>
          <Card>
            <CardHeader className='flex flex-row items-center gap-4 pb-2'>
              <div className='relative group cursor-pointer'>
                <Avatar className='size-16 md:size-20'>
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback className='bg-primary/10'>
                    <User className='text-muted-foreground' />
                  </AvatarFallback>
                </Avatar>
                <div className='absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                  <Pencil className='size-5 text-white' />
                </div>
              </div>
              <div className='flex flex-col gap-1'>
                <CardTitle>{user.name}</CardTitle>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  {user.email}
                </div>
                <Badge
                  variant='secondary'
                  className='w-fit text-[10px] mt-1 capitalize'
                >
                  {user.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Role Specific Read-only Fields */}
              {user.role === Role.Student && (
                <div className='flex items-center gap-2 text-sm'>
                  <IdCard size={16} />
                  <span>STU-{user.id.slice(0, 8).toUpperCase()}</span>
                </div>
              )}

              {(user.role === Role.Instructor || user.role === Role.Admin) && (
                <div className='space-y-1'>
                  <div className='flex items-center gap-2 text-sm font-medium'>
                    <BriefcaseBusiness
                      size={16}
                      className='text-muted-foreground'
                    />
                    <span>Senior Instructor</span>
                  </div>
                  <div className='flex items-center gap-2 text-xs text-muted-foreground pl-6'>
                    Joined at {format(new Date(user.createdAt), 'MMMM d, yyyy')}
                  </div>
                </div>
              )}

              {/* Editable Fields */}
              <div className='space-y-3'>
                <div className='space-y-2'>
                  <Label htmlFor='phone' className='text-muted-foreground'>
                    Phone
                  </Label>
                  <div className='relative'>
                    <Phone
                      className='absolute left-3 top-2.5 text-muted-foreground'
                      size={16}
                    />
                    <Input
                      id='phone'
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className='pl-9'
                      placeholder='+1 (555) 000-0000'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='bio' className='text-muted-foreground'>
                    Bio
                  </Label>
                  <Textarea
                    id='bio'
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder='Tell us about yourself...'
                    className='min-h-[120px] resize-none'
                  />
                </div>

                <Button
                  variant='outline'
                  onClick={handleSaveProfile}
                  className='w-full cursor-pointer'
                >
                  <Check size={16} />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                Skills & Interests
              </CardTitle>
              <CardDescription>
                Add your technical skills and areas of interest.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex flex-wrap gap-2'>
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant='secondary'
                    className='flex text-sm items-center gap-2 cursor-pointer group'
                  >
                    {skill}
                    <span onClick={() => handleRemoveSkill(skill)}>
                      <X
                        size={14}
                        className='opacity-0 group-hover:opacity-100 transition-opacity text-destructive'
                      />
                    </span>
                  </Badge>
                ))}
              </div>
              <div className='flex gap-2 max-w-sm'>
                <Input
                  placeholder='Add a skill...'
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button
                  size='icon'
                  variant='outline'
                  onClick={handleAddSkill}
                  disabled={!newSkill.trim()}
                >
                  <Plus />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Achievements Section */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <div className='space-y-1.5'>
                <CardTitle className='flex items-center gap-2'>
                  Achievements
                </CardTitle>
                <CardDescription>
                  Showcase your professional milestones and awards.
                </CardDescription>
              </div>
              <Dialog
                open={isAchievementDialogOpen}
                onOpenChange={setIsAchievementDialogOpen}
              >
                <DialogTrigger
                  render={
                    <Button
                      size='sm'
                      variant='outline'
                      className='cursor-pointer'
                    >
                      <Plus size={16} />
                      Add
                    </Button>
                  }
                />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Achievement</DialogTitle>
                    <DialogDescription>
                      Add details about your certification, award, or milestone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className='space-y-4 py-4'>
                    <div className='grid gap-2'>
                      <Label htmlFor='title'>Title</Label>
                      <Input
                        id='title'
                        value={newAchievement.title}
                        onChange={(e) =>
                          setNewAchievement({
                            ...newAchievement,
                            title: e.target.value,
                          })
                        }
                        placeholder='e.g. Certified React Developer'
                      />
                    </div>
                    <div className='grid gap-2'>
                      <Label htmlFor='issuer'>Issuer</Label>
                      <Input
                        id='issuer'
                        value={newAchievement.issuer}
                        onChange={(e) =>
                          setNewAchievement({
                            ...newAchievement,
                            issuer: e.target.value,
                          })
                        }
                        placeholder='e.g. Meta, Google, University'
                      />
                    </div>
                    <div className='grid gap-2'>
                      <Label htmlFor='date'>Date</Label>
                      <Input
                        id='date'
                        type='date'
                        value={newAchievement.date}
                        onChange={(e) =>
                          setNewAchievement({
                            ...newAchievement,
                            date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className='grid gap-2'>
                      <Label htmlFor='desc'>Description</Label>
                      <Textarea
                        id='desc'
                        value={newAchievement.description}
                        onChange={(e) =>
                          setNewAchievement({
                            ...newAchievement,
                            description: e.target.value,
                          })
                        }
                        placeholder='Brief description of the achievement...'
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant='outline'
                      onClick={() => setIsAchievementDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddAchievement}>
                      Add Achievement
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {achievements.length === 0 ? (
                  <div className='text-center py-8 text-muted-foreground text-sm'>
                    No achievements added yet.
                  </div>
                ) : (
                  achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className='flex flex-col sm:flex-row gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm relative group'
                    >
                      <div className='min-w-[120px] text-sm text-muted-foreground flex flex-col gap-1 sm:border-r sm:pr-4'>
                        <span className='font-medium text-foreground'>
                          {achievement.issuer}
                        </span>
                        <span className='text-xs'>
                          {format(new Date(achievement.date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div className='flex-1 space-y-1'>
                        <h4 className='font-semibold leading-none'>
                          {achievement.title}
                        </h4>
                        <p className='text-sm text-muted-foreground'>
                          {achievement.description}
                        </p>
                      </div>
                      <Button
                        size='icon'
                        variant='ghost'
                        className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-destructive hover:bg-destructive/10'
                        onClick={() => handleRemoveAchievement(achievement.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
