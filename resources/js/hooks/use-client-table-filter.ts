import { useMemo, useState } from 'react';
import { ColumnFilterOption } from '@/components/SortableTableHead';
import { TableFilterState } from '@/hooks/use-table-filters';

export type ColumnAccessor<T> = (
    item: T,
) => string | number | boolean | null | undefined;

interface UseClientTableFilterOptions<T> {
    accessors: Record<string, ColumnAccessor<T>>;
    exactMatchColumns?: string[];
    initialSort?: {
        key: string;
        direction: 'asc' | 'desc';
    };
}

/**
 * Client-side filtering and sorting hook compatible with SortableTableHead.
 */
export function useClientTableFilter<T>(
    items: T[],
    {
        accessors,
        exactMatchColumns = [],
        initialSort,
    }: UseClientTableFilterOptions<T>,
) {
    const [filters, setFilters] = useState<TableFilterState>({
        sort: initialSort?.key,
        direction: initialSort?.direction,
    });

    const setFilter = (key: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const setSort = (column?: string, direction?: 'asc' | 'desc') => {
        setFilters((prev) => ({
            ...prev,
            sort: column,
            direction: column ? direction || 'asc' : undefined,
        }));
    };

    const clearFilters = () => {
        setFilters({
            sort: initialSort?.key,
            direction: initialSort?.direction,
        });
    };

    const hasActiveFilters = useMemo(() => {
        return Object.entries(filters).some(([key, value]) => {
            if (key === 'sort') {
                return value !== undefined && value !== initialSort?.key;
            }
            if (key === 'direction') {
                return (
                    filters.sort !== undefined &&
                    (filters.sort !== initialSort?.key ||
                        value !== initialSort?.direction)
                );
            }
            return value !== undefined && value !== '' && value !== 'all';
        });
    }, [filters, initialSort]);

    const getUniqueOptions = (column: string): ColumnFilterOption[] => {
        const accessor = accessors[column];
        if (!accessor) return [];

        const unique = new Set<string>();
        items.forEach((item) => {
            const val = accessor(item);
            if (val !== null && val !== undefined && String(val).trim() !== '') {
                unique.add(String(val).trim());
            }
        });

        return Array.from(unique)
            .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
            .map((val) => ({ value: val, label: val }));
    };

    const filteredItems = useMemo(() => {
        const activeFilterEntries = Object.entries(filters).filter(
            ([key, value]) =>
                key !== 'sort' &&
                key !== 'direction' &&
                value !== undefined &&
                value !== '' &&
                value !== 'all',
        );

        const filtered =
            activeFilterEntries.length === 0
                ? [...items]
                : items.filter((item) =>
                      activeFilterEntries.every(([key, filterVal]) => {
                          const accessor = accessors[key];
                          if (!accessor) return true;
                          const raw = accessor(item);
                          const str =
                              raw === null || raw === undefined
                                  ? ''
                                  : String(raw);
                          if (exactMatchColumns.includes(key)) {
                              return str === filterVal;
                          }
                          return str
                              .toLowerCase()
                              .includes((filterVal || '').toLowerCase());
                      }),
                  );

        if (filters.sort && accessors[filters.sort]) {
            const accessor = accessors[filters.sort];
            const dir = filters.direction === 'desc' ? -1 : 1;

            filtered.sort((a, b) => {
                const aVal = accessor(a);
                const bVal = accessor(b);

                if (aVal === bVal) return 0;
                if (aVal === null || aVal === undefined || aVal === '')
                    return 1;
                if (bVal === null || bVal === undefined || bVal === '')
                    return -1;

                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    return (aVal - bVal) * dir;
                }

                return (
                    String(aVal).localeCompare(String(bVal), 'es', {
                        numeric: true,
                        sensitivity: 'base',
                    }) * dir
                );
            });
        }

        return filtered;
    }, [items, filters, accessors, exactMatchColumns]);

    return {
        filteredItems,
        filters,
        setFilter,
        setSort,
        clearFilters,
        hasActiveFilters,
        getUniqueOptions,
    };
}
