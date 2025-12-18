import { ExtendedColumnSort } from '@/types/data-table';
import { useQueryState, parseAsInteger } from 'nuqs';
import { getSortingStateParser } from '@/lib/parsers';

export function useTableQueryState<TData>(
  defaultSorting: ExtendedColumnSort<TData>[] = []
) {
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({ clearOnDefault: true })
  );

  const [perPage, setPerPage] = useQueryState(
    'perPage',
    parseAsInteger.withDefault(10).withOptions({ clearOnDefault: true })
  );

  const [sorting, setSorting] = useQueryState(
    'sort',
    getSortingStateParser<TData>()
      .withDefault(defaultSorting)
      .withOptions({ clearOnDefault: true })
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
