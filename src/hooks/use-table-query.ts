import { ExtendedColumnSort } from '@/types/data-table';
import { useQueryState, parseAsInteger, useQueryStates, ParserMap } from 'nuqs';
import { getSortingStateParser } from '@/lib/parsers';

export function useTableQueryState<TData, TFilters extends ParserMap = ParserMap>(
  defaultSorting: ExtendedColumnSort<TData>[] = [],
  filterConfig?: TFilters
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

  const [filters, setFilters] = useQueryStates(
    filterConfig || ({} as TFilters)
  );

  return {
    page,
    setPage,
    perPage,
    setPerPage,
    sorting,
    setSorting,
    filters: filters as { [K in keyof TFilters]: any },
    setFilters,
    resetPagination: () => setPage(1),
  };
}
