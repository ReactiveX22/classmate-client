'use client';

import { RoleGuard } from '@/components/common/role-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { usePosts } from '@/hooks/use-posts';
import { Role } from '@/types/auth';
import { IconBook, IconLoader2, IconPlus, IconSearch } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { CreatePostDialog } from './posts/create-post-dialog';
import { MaterialCard } from './posts/post-types/material-card';
import { ResourceListItem } from './resources/resource-list-item';

interface ResourcesTabProps {
  classroomId: string;
}

const SIDEBAR_STEP = 5;

export function ResourcesTab({ classroomId }: ResourcesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibleBookmarkedCount, setVisibleBookmarkedCount] = useState(SIDEBAR_STEP);
  const [visibleInstructorCount, setVisibleInstructorCount] = useState(SIDEBAR_STEP);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePosts(classroomId, {
    limit: 20,
    type: 'material',
    search: debouncedSearch || undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
  });

  const { data: bookmarkedData, isLoading: isBookmarkedLoading } = usePosts(
    classroomId,
    {
      limit: 50,
      type: 'material',
      bookmarked: true,
    },
  );

  const { data: instructorData, isLoading: isInstructorLoading } = usePosts(
    classroomId,
    {
      limit: 50,
      type: 'material',
      fromInstructor: true,
    },
  );

  const materials = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  const bookmarkedMaterials = useMemo(() => {
    if (!bookmarkedData) return [];
    return bookmarkedData.pages.flatMap((page) => page.data);
  }, [bookmarkedData]);

  const instructorMaterials = useMemo(() => {
    if (!instructorData) return [];
    return instructorData.pages.flatMap((page) => page.data);
  }, [instructorData]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    for (const material of materials) {
      for (const tag of material.tags || []) {
        tags.add(tag);
      }
    }
    return Array.from(tags).sort();
  }, [materials]);

  const isEmpty = !isLoading && materials.length === 0;

  const visibleBookmarked = bookmarkedMaterials.slice(0, visibleBookmarkedCount);
  const visibleInstructor = instructorMaterials.slice(0, visibleInstructorCount);

  return (
    <div className='max-w-7xl mx-auto pb-12 sm:pb-20'>
      <div className='grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 lg:gap-8'>
        <div className='space-y-4'>
          <div className='flex items-center justify-end mb-4'>
            <RoleGuard allowedRoles={[Role.Instructor]}>
              <CreatePostDialog
                classroomId={classroomId}
                defaultType='material'
                hideTypeSelection={true}
                trigger={
                  <Button className='gap-2 shadow-sm mt-4'>
                    <IconPlus size={18} />
                    <span>Upload Resource</span>
                  </Button>
                }
              />
            </RoleGuard>
          </div>

          <div className='space-y-3'>
            <div className='relative'>
              <IconSearch className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search by title, content, or tags...'
                className='pl-9'
              />
            </div>

            {availableTags.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {availableTags.map((tag) => {
                  const selected = selectedTags.includes(tag);
                  return (
                    <Button
                      key={tag}
                      variant={selected ? 'default' : 'outline'}
                      size='sm'
                      className='h-7 px-2 text-xs'
                      onClick={() =>
                        setSelectedTags((prev) =>
                          selected
                            ? prev.filter((value) => value !== tag)
                            : [...prev, tag],
                        )
                      }
                    >
                      #{tag}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>

          {isLoading ? (
            <div className='flex justify-center py-12'>
              <IconLoader2 className='animate-spin text-muted-foreground' />
            </div>
          ) : isEmpty ? (
            <Card className='border-dashed shadow-none bg-muted/30'>
              <CardContent className='flex flex-col items-center justify-center py-16 text-center'>
                <div className='p-4 bg-background rounded-full mb-4 shadow-sm'>
                  <IconBook className='w-8 h-8 text-muted-foreground' />
                </div>
                <h3 className='text-lg font-medium mb-1'>No materials found</h3>
                <p className='text-muted-foreground text-sm max-w-sm mx-auto mb-6'>
                  Try removing filters or search terms to see more resources.
                </p>
                <RoleGuard allowedRoles={[Role.Instructor]}>
                  <CreatePostDialog
                    classroomId={classroomId}
                    defaultType='material'
                    hideTypeSelection={true}
                    trigger={<Button variant='outline'>Create material</Button>}
                  />
                </RoleGuard>
              </CardContent>
            </Card>
          ) : (
            <div className='space-y-4'>
              {materials.map((post) => (
                <MaterialCard
                  key={post.id}
                  post={post}
                  resourceHref={`/dashboard/classrooms/${classroomId}/resources/${post.id}`}
                />
              ))}

              {hasNextPage && (
                <div className='flex justify-center pt-6'>
                  <Button
                    variant='ghost'
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? (
                      <>
                        <IconLoader2 className='mr-2 h-4 w-4 animate-spin' />
                        Loading...
                      </>
                    ) : (
                      'Load more'
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <aside className='space-y-4'>
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm'>Bookmarks</CardTitle>
            </CardHeader>
            <CardContent className='space-y-1'>
              {isBookmarkedLoading ? (
                <div className='flex items-center justify-center py-4'>
                  <IconLoader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                </div>
              ) : visibleBookmarked.length > 0 ? (
                visibleBookmarked.map((post) => (
                  <ResourceListItem
                    key={post.id}
                    post={post}
                    href={`/dashboard/classrooms/${classroomId}/resources/${post.id}`}
                  />
                ))
              ) : (
                <p className='text-sm text-muted-foreground py-2'>
                  No bookmarks yet.
                </p>
              )}

              {bookmarkedMaterials.length > visibleBookmarkedCount && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='w-full mt-2'
                  onClick={() =>
                    setVisibleBookmarkedCount((prev) => prev + SIDEBAR_STEP)
                  }
                >
                  View more
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='text-sm'>From Instructor</CardTitle>
            </CardHeader>
            <CardContent className='space-y-1'>
              {isInstructorLoading ? (
                <div className='flex items-center justify-center py-4'>
                  <IconLoader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                </div>
              ) : visibleInstructor.length > 0 ? (
                visibleInstructor.map((post) => (
                  <ResourceListItem
                    key={post.id}
                    post={post}
                    href={`/dashboard/classrooms/${classroomId}/resources/${post.id}`}
                  />
                ))
              ) : (
                <p className='text-sm text-muted-foreground py-2'>
                  No instructor resources yet.
                </p>
              )}

              {instructorMaterials.length > visibleInstructorCount && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='w-full mt-2'
                  onClick={() =>
                    setVisibleInstructorCount((prev) => prev + SIDEBAR_STEP)
                  }
                >
                  View more
                </Button>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
