'use client';

import { NoticeDetail } from '@/components/notices/notice-detail';
import { NoticeList } from '@/components/notices/notice-list';
import { NoticeToolbar } from '@/components/notices/notice-toolbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNotice, useNotices } from '@/hooks/use-notices';
import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';

export default function NoticesPage() {
  const [selectedId, setSelectedId] = useQueryState('id');
  const isMobile = useIsMobile();

  // Filter States
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // Data Query
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useNotices({
      limit: 50,
      search: debouncedSearch,
    });

  const notices = data?.pages.flatMap((page) => page.data) || [];
  const foundInList = notices.find((n) => n.notice.id === selectedId);

  const { data: individualNotice } = useNotice(selectedId, {
    enabled: !foundInList,
  });

  const selectedNotice = foundInList || individualNotice || null;

  const showDetail = isMobile && selectedId;
  const showList = !isMobile || !selectedId;

  return (
    <div className='flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-background'>
      <div className='flex-1 flex flex-col min-h-0 m-2 md:m-4 rounded-xl border bg-card shadow-sm overflow-hidden'>
        <NoticeToolbar searchPromise={search} onSearchChange={setSearch} />

        <div className='flex flex-1 overflow-hidden'>
          {/* Left Column: List */}
          {showList && (
            <div className='w-full md:w-[380px] md:border-r bg-muted/10 flex flex-col'>
              <NoticeList
                notices={notices}
                isLoading={isLoading}
                selectedId={selectedId}
                onSelect={setSelectedId}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                fetchNextPage={fetchNextPage}
              />
            </div>
          )}

          {/* Right Column: Detail */}
          {(!isMobile || showDetail) && (
            <div className='flex-1 overflow-hidden bg-background'>
              <NoticeDetail
                data={selectedNotice}
                onBack={isMobile ? () => setSelectedId(null) : undefined}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
