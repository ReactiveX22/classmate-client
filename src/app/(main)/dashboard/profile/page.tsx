'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/hooks/useAuth';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useUpdateProfile, useUserProfile } from '@/hooks/use-user-profile';
import { Achievement, UpdateProfileInput } from '@/types/user-profile';
import { format } from 'date-fns';
import {
  BriefcaseBusiness,
  CalendarIcon,
  Check,
  IdCard,
  Pencil,
  Phone,
  Plus,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { data: userAuth, isLoading: isAuthLoading } = useUser();
  const { data: userProfileData, isLoading: isProfileLoading } =
    useUserProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const userProfile = userProfileData?.profile;
  const teacherProfile = userProfileData?.teacher;
  const studentProfile = userProfileData?.student;

  // Form states
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form data when profile is loaded
  useEffect(() => {
    if (userProfile) {
      setPhone(userProfile.phone || '');
      setBio(userProfile.bio || '');
      setSkills(userProfile.skills || []);
      setAchievements(userProfile.achievements || []);
    }
  }, [userProfile]);

  // Dialog states
  const [isAchievementDialogOpen, setIsAchievementDialogOpen] = useState(false);
  const [newAchievement, setNewAchievement] = useState<Achievement>({
    id: '',
    date: new Date().toISOString().split('T')[0],
    title: '',
    issuer: '',
    description: '',
  });

  const [newSkill, setNewSkill] = useState('');

  if (isProfileLoading) {
    return <div className='p-8'>Loading profile...</div>;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!userAuth) {
    return <div className='p-8'>User not found.</div>;
  }

  const handleSaveProfile = () => {
    const payload: UpdateProfileInput = {
      phone,
      bio,
    };
    if (selectedImage) {
      payload.image = selectedImage;
    }
    updateProfile(payload, {
      onSuccess: () => {
        setSelectedImage(null);
      },
    });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setNewSkill('');
      updateProfile({ skills: updatedSkills });
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
    updateProfile({ skills: updatedSkills });
  };

  const handleSaveAchievement = () => {
    if (newAchievement.title && newAchievement.issuer && newAchievement.date) {
      let updatedAchievements: Achievement[];
      if (newAchievement.id) {
        // Edit existing
        updatedAchievements = achievements.map((a) =>
          a.id === newAchievement.id ? newAchievement : a,
        );
      } else {
        // Add new
        updatedAchievements = [
          ...achievements,
          { ...newAchievement, id: crypto.randomUUID() },
        ];
      }
      setAchievements(updatedAchievements);
      updateProfile({ achievements: updatedAchievements });

      setNewAchievement({
        id: '',
        date: new Date().toISOString().split('T')[0],
        title: '',
        issuer: '',
        description: '',
      });
      setIsAchievementDialogOpen(false);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleEditAchievement = (achievement: Achievement) => {
    setNewAchievement(achievement);
    setIsAchievementDialogOpen(true);
  };

  const handleRemoveAchievement = (id: string) => {
    const updatedAchievements = achievements.filter((a) => a.id !== id);
    setAchievements(updatedAchievements);
    updateProfile({ achievements: updatedAchievements });
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
              <div
                className='relative group cursor-pointer'
                onClick={handleTriggerFileInput}
              >
                <Avatar className='size-16 md:size-20'>
                  <AvatarImage
                    src={imagePreview || userAuth.image}
                    alt={userAuth.name}
                  />
                  <AvatarFallback className='bg-primary/10'>
                    <User className='text-muted-foreground' />
                  </AvatarFallback>
                </Avatar>
                <div className='absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                  <Pencil className='size-5 text-white' />
                </div>
                <input
                  type='file'
                  ref={fileInputRef}
                  className='hidden'
                  accept='image/*'
                  onChange={handleImageChange}
                />
              </div>
              <div className='flex flex-col gap-1'>
                <CardTitle>{userAuth.name}</CardTitle>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  {userAuth.email}
                </div>
                <Badge
                  variant='secondary'
                  className='w-fit text-[10px] mt-1 capitalize'
                >
                  {userAuth.role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Role Specific Read-only Fields */}
              {studentProfile && (
                <div className='flex items-center gap-2 text-sm'>
                  <IdCard size={16} />
                  <span>{studentProfile.studentId}</span>
                </div>
              )}

              {teacherProfile && (
                <div className='space-y-1'>
                  <div className='flex items-center gap-2 text-sm font-medium'>
                    <BriefcaseBusiness
                      size={16}
                      className='text-muted-foreground'
                    />
                    <span>{teacherProfile.title}</span>
                  </div>
                  {teacherProfile.joinDate && (
                    <div className='flex items-center gap-2 text-xs text-muted-foreground pl-6'>
                      Joined at{' '}
                      {format(
                        new Date(teacherProfile.joinDate),
                        'MMMM d, yyyy',
                      )}
                    </div>
                  )}
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
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <span className='flex items-center gap-2'>Saving...</span>
                  ) : (
                    <>
                      <Check size={16} />
                      Save Changes
                    </>
                  )}
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
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'sm' }),
                    'cursor-pointer',
                  )}
                  onClick={() =>
                    setNewAchievement({
                      id: '',
                      date: new Date().toISOString().split('T')[0],
                      title: '',
                      issuer: '',
                      description: '',
                    })
                  }
                >
                  <Plus size={16} />
                  Add
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {newAchievement.id
                        ? 'Edit Achievement'
                        : 'Add New Achievement'}
                    </DialogTitle>
                    <DialogDescription>
                      {newAchievement.id
                        ? 'Update details about your certification, award, or milestone.'
                        : 'Add details about your certification, award, or milestone.'}
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
                      <Popover>
                        <PopoverTrigger
                          className={cn(
                            buttonVariants({ variant: 'outline' }),
                            'w-full justify-start text-left font-normal',
                            !newAchievement.date && 'text-muted-foreground',
                          )}
                        >
                          <CalendarIcon className='mr-2 h-4 w-4' />
                          {newAchievement.date ? (
                            format(new Date(newAchievement.date), 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0'>
                          <Calendar
                            mode='single'
                            selected={
                              newAchievement.date
                                ? new Date(newAchievement.date)
                                : undefined
                            }
                            onSelect={(date) =>
                              setNewAchievement({
                                ...newAchievement,
                                date: date
                                  ? date.toISOString().split('T')[0] // Format as YYYY-MM-DD
                                  : '',
                              })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                    <Button onClick={handleSaveAchievement}>
                      Save Achievement
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
                  achievements.map((achievement, index) => (
                    <div
                      key={index}
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
                      <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1'>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-8 w-8 text-muted-foreground hover:bg-muted'
                          onClick={() => handleEditAchievement(achievement)}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-8 w-8 text-destructive hover:bg-destructive/10'
                          onClick={() =>
                            handleRemoveAchievement(achievement.id)
                          }
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
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
