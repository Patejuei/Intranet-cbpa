import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export interface TableFilterState {
    [key: string]: string | undefined;
    sort?: string;
    direction?: 'asc' | 'desc';
}

/**
 * Manages server-side Inertia table filters and column sorting with debounced text updates.
 */
export function useTableFilters<T extends TableFilterState>(
    endpoint: string,
    initialFilters: T,
) {
    const [filters, setFilters] = useState<T>(initialFilters);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    const navigate = (nextFilters: T) => {
        const cleanedParams: Record<string, string> = {};
        Object.entries(nextFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && value !== 'all') {
                cleanedParams[key] = value;
            }
        });

        router.get(endpoint, cleanedParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const setFilter = (
        key: keyof T,
        value: string,
        options: { debounce?: boolean } = {},
    ) => {
        const nextFilters = { ...filters, [key]: value };
        setFilters(nextFilters);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (options.debounce) {
            debounceRef.current = setTimeout(() => {
                navigate(nextFilters);
            }, 300);
        } else {
            navigate(nextFilters);
        }
    };

    const setSort = (
        column?: string,
        direction?: 'asc' | 'desc',
    ) => {
        const nextFilters = {
            ...filters,
            sort: column,
            direction: column ? direction || 'asc' : undefined,
        } as T;

        setFilters(nextFilters);
        navigate(nextFilters);
    };

    const toggleSort = (column: string) => {
        let nextSort: string | undefined = column;
        let nextDirection: 'asc' | 'desc' | undefined = 'asc';

        if (filters.sort === column) {
            if (filters.direction === 'asc') {
                nextDirection = 'desc';
            } else {
                nextSort = undefined;
                nextDirection = undefined;
            }
        }

        const nextFilters = {
            ...filters,
            sort: nextSort,
            direction: nextDirection,
        } as T;

        setFilters(nextFilters);
        navigate(nextFilters);
    };

    const clearFilters = (emptyState: T) => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        setFilters(emptyState);
        navigate(emptyState);
    };

    const hasActiveFilters = Object.entries(filters).some(
        ([, value]) => value !== undefined && value !== '' && value !== 'all',
    );

    return {
        filters,
        setFilter,
        setSort,
        toggleSort,
        clearFilters,
        hasActiveFilters,
    };
}
