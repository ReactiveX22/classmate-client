'use client';

import { useState, useEffect } from 'react';
import { useQueryState } from 'nuqs';
import { useNotices, useNotice } from '@/hooks/use-notices';
import { NoticeList } from '@/components/notices/notice-list';
import { NoticeDetail } from '@/components/notices/notice-detail';
import { NoticeToolbar } from '@/components/notices/notice-toolbar';
import { PageHeader } from '@/components/common/page-header';

export default function NoticesPage() {
  const [selectedId, setSelectedId] = useQueryState('id');

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

  return (
    <div className='flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-background'>
      <div className='flex-1 flex flex-col min-h-0 m-4 rounded-xl border bg-card shadow-sm overflow-hidden'>
        <NoticeToolbar searchPromise={search} onSearchChange={setSearch} />

        <div className='flex flex-1 overflow-hidden'>
          {/* Left Column: List */}
          <div className='w-[380px] border-r bg-muted/10 flex flex-col'>
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

          {/* Right Column: Detail */}
          <div className='flex-1 overflow-hidden bg-background'>
            <NoticeDetail data={selectedNotice} />
          </div>
        </div>
      </div>
    </div>
  );
}
