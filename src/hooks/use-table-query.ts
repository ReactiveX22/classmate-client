import { useQueryState, parseAsInteger } from 'nuqs';
import { getSortingStateParser } from '@/lib/parsers';

export function useTableQueryState() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));

  const [perPage, setPerPage] = useQueryState(
    'perPage',
    parseAsInteger.withDefault(10)
  );

  const [sorting, setSorting] = useQueryState(
    'sort',
    getSortingStateParser().withDefault([])
  );

  return {
    page,
    setPage,
    perPage,
    setPerPage,
    sorting,
    setSorting,
    resetPagination: () => setPage(1),
  };
}
