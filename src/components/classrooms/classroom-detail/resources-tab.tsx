"use client";

import { RoleGuard } from "@/components/common/role-guard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { usePosts } from "@/hooks/use-posts";
import { Role } from "@/types/auth";
import {
  IconBook,
  IconLoader2,
  IconPlus,
  IconSearch,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { CreatePostDialog } from "./posts/create-post-dialog";
import { MaterialCard } from "./posts/post-types/material-card";
import { ResourceListItem } from "./resources/resource-list-item";

interface ResourcesTabProps {
  classroomId: string;
}

type ResourceView = "all" | "bookmarked" | "instructor";

const SIDEBAR_STEP = 5;

export function ResourcesTab({ classroomId }: ResourcesTabProps) {
  const [view, setView] = useState<ResourceView>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibleBookmarkedCount, setVisibleBookmarkedCount] =
    useState(SIDEBAR_STEP);
  const [visibleInstructorCount, setVisibleInstructorCount] =
    useState(SIDEBAR_STEP);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePosts(classroomId, {
      limit: 20,
      type: "material",
      search: debouncedSearch || undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      bookmarked: view === "bookmarked" ? true : undefined,
      fromInstructor: view === "instructor" ? true : undefined,
    });

  const { data: bookmarkedData, isLoading: isBookmarkedLoading } = usePosts(
    classroomId,
    {
      limit: 50,
      type: "material",
      bookmarked: true,
    },
  );

  const { data: instructorData, isLoading: isInstructorLoading } = usePosts(
    classroomId,
    {
      limit: 50,
      type: "material",
      fromInstructor: true,
    },
  );

  const { data: tagSourceData } = usePosts(classroomId, {
    limit: 50,
    type: "material",
    search: debouncedSearch || undefined,
    bookmarked: view === "bookmarked" ? true : undefined,
    fromInstructor: view === "instructor" ? true : undefined,
  });

  const materials = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  const sortedMaterials = useMemo(() => {
    return [...materials].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [materials]);

  const bookmarkedMaterials = useMemo(() => {
    if (!bookmarkedData) return [];
    return bookmarkedData.pages.flatMap((page) => page.data);
  }, [bookmarkedData]);

  const instructorMaterials = useMemo(() => {
    if (!instructorData) return [];
    return instructorData.pages.flatMap((page) => page.data);
  }, [instructorData]);

  const tagSourceMaterials = useMemo(() => {
    if (!tagSourceData) return [];
    return tagSourceData.pages.flatMap((page) => page.data);
  }, [tagSourceData]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    for (const material of tagSourceMaterials) {
      for (const tag of material.tags || []) {
        tags.add(tag);
      }
    }
    return Array.from(tags).sort();
  }, [tagSourceMaterials]);

  const isEmpty = !isLoading && materials.length === 0;

  const visibleBookmarked = bookmarkedMaterials.slice(
    0,
    visibleBookmarkedCount,
  );
  const visibleInstructor = instructorMaterials.slice(
    0,
    visibleInstructorCount,
  );

  return (
    <div className="mx-auto pb-12 sm:pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-4">
        <div className="space-y-3 lg:col-start-1 lg:row-start-1 mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={view === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("all")}
              >
                All
              </Button>
              <Button
                variant={view === "bookmarked" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("bookmarked")}
              >
                Bookmarked
              </Button>
              <Button
                variant={view === "instructor" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("instructor")}
              >
                From Instructor
              </Button>
            </div>

            <CreatePostDialog
              classroomId={classroomId}
              defaultType="material"
              hideTypeSelection={true}
              trigger={
                <Button size="sm">
                  <IconPlus />
                  <span>Upload Resource</span>
                </Button>
              }
            />
          </div>

          <div className="relative">
            <IconSearch className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, content, or tags..."
              className="pl-9"
            />
          </div>

          {availableTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const selected = selectedTags.includes(tag);
                return (
                  <Button
                    key={tag}
                    variant={selected ? "default" : "outline"}
                    size="sm"
                    className="h-7 px-2 text-xs"
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

        <div className="lg:col-start-1 lg:row-start-2">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-14 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-14 w-full rounded-md" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : isEmpty ? (
            <Card className="border-dashed shadow-none bg-muted/30">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 bg-background rounded-full mb-4 shadow-sm">
                  <IconBook className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">
                  {view === "bookmarked"
                    ? "No bookmarked resources"
                    : view === "instructor"
                      ? "No instructor resources"
                      : "No materials found"}
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                  {view === "all"
                    ? "Try removing filters or search terms to see more resources."
                    : "Switch to All or adjust your search and tags to find more resources."}
                </p>
                <RoleGuard allowedRoles={[Role.Instructor]}>
                  <CreatePostDialog
                    classroomId={classroomId}
                    defaultType="material"
                    hideTypeSelection={true}
                    trigger={<Button variant="outline">Create material</Button>}
                  />
                </RoleGuard>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedMaterials.map((post) => (
                <MaterialCard
                  key={post.id}
                  post={post}
                  resourceHref={`/dashboard/classrooms/${classroomId}/resources/${post.id}`}
                />
              ))}

              {hasNextPage && (
                <div className="flex justify-center pt-6">
                  <Button
                    variant="ghost"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                  >
                    {isFetchingNextPage ? (
                      <>
                        <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load more"
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="space-y-4 lg:col-start-2 lg:row-start-2">
          <Card size="sm">
            <CardHeader>
              <CardTitle>Bookmarks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {isBookmarkedLoading ? (
                <div className="flex items-center justify-center py-4">
                  <IconLoader2 className="h-4 w-4 animate-spin text-muted-foreground" />
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
                <p className="text-sm text-muted-foreground py-2">
                  No bookmarks yet.
                </p>
              )}

              {bookmarkedMaterials.length > visibleBookmarkedCount && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() =>
                    setVisibleBookmarkedCount((prev) => prev + SIDEBAR_STEP)
                  }
                >
                  View more
                </Button>
              )}
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>From Instructor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {isInstructorLoading ? (
                <div className="flex items-center justify-center py-4">
                  <IconLoader2 className="h-4 w-4 animate-spin text-muted-foreground" />
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
                <p className="text-sm text-muted-foreground py-2">
                  No instructor resources yet.
                </p>
              )}

              {instructorMaterials.length > visibleInstructorCount && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-2"
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
