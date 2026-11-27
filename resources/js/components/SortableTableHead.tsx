import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { TableHead } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
    ArrowDown,
    ArrowUp,
    Check,
    ChevronDown,
    Filter,
    Search,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export interface ColumnFilterOption {
    value: string;
    label: string;
}

interface SortableTableHeadProps {
    column: string;
    label: string;
    sortable?: boolean;
    sortKey?: string;
    sortDirection?: 'asc' | 'desc';
    onSort?: (column?: string, direction?: 'asc' | 'desc') => void;
    filterType?: 'text' | 'select' | 'multi-select';
    filterValue?: string;
    filterPlaceholder?: string;
    filterOptions?: ColumnFilterOption[];
    onFilterChange?: (value: string) => void;
    align?: 'left' | 'right' | 'center';
    className?: string;
}

function parseMultiValue(value?: string): string[] {
    if (!value || value === 'all') return [];
    return value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
}

/**
 * Excel-style column header with a popover menu for sorting and filtering.
 */
export function SortableTableHead({
    column,
    label,
    sortable = true,
    sortKey,
    sortDirection,
    onSort,
    filterType,
    filterValue = '',
    filterPlaceholder = 'Filtrar...',
    filterOptions = [],
    onFilterChange,
    align = 'left',
    className,
}: SortableTableHeadProps) {
    const [open, setOpen] = useState(false);
    const [draftValue, setDraftValue] = useState(filterValue);
    const [draftSelected, setDraftSelected] = useState<string[]>(() =>
        parseMultiValue(filterValue),
    );
    const [optionSearch, setOptionSearch] = useState('');

    useEffect(() => {
        setDraftValue(filterValue === 'all' ? '' : filterValue);
        setDraftSelected(parseMultiValue(filterValue));
        if (!open) {
            setOptionSearch('');
        }
    }, [filterValue, open]);

    const selectedCount = useMemo(
        () => parseMultiValue(filterValue).length,
        [filterValue],
    );

    const filteredOptions = useMemo(() => {
        const q = optionSearch.trim().toLowerCase();
        if (!q) return filterOptions;
        return filterOptions.filter((opt) =>
            opt.label.toLowerCase().includes(q),
        );
    }, [filterOptions, optionSearch]);

    const isSorted = sortKey === column;
    const hasFilter =
        filterType === 'multi-select'
            ? selectedCount > 0
            : Boolean(filterValue) &&
              filterValue !== 'all' &&
              filterValue !== '';
    const isActive = isSorted || hasFilter;

    const applyTextFilter = () => {
        onFilterChange?.(draftValue.trim());
        setOpen(false);
    };

    const applyMultiSelectFilter = () => {
        onFilterChange?.(draftSelected.join(','));
        setOpen(false);
    };

    const clearColumnFilter = () => {
        setDraftValue('');
        setDraftSelected([]);
        onFilterChange?.(filterType === 'select' ? 'all' : '');
        setOpen(false);
    };

    const handleSelectOption = (value: string) => {
        onFilterChange?.(value);
        setOpen(false);
    };

    const toggleMultiOption = (value: string) => {
        setDraftSelected((prev) =>
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value],
        );
    };

    const handleSortClick = (direction: 'asc' | 'desc') => {
        if (isSorted && sortDirection === direction) {
            onSort?.(undefined, undefined);
        } else {
            onSort?.(column, direction);
        }
        setOpen(false);
    };

    return (
        <TableHead className={className}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className={cn(
                            'group inline-flex w-full items-center justify-between gap-1.5 rounded-md px-1.5 py-1 -mx-1.5 text-left uppercase tracking-wider transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            align === 'right' && 'justify-end text-right',
                            align === 'center' && 'justify-center text-center',
                            isActive && 'text-foreground font-bold',
                        )}
                    >
                        <span className="truncate">{label}</span>
                        <span className="flex items-center gap-0.5 shrink-0">
                            {isSorted &&
                                (sortDirection === 'asc' ? (
                                    <ArrowUp className="size-3.5 text-primary" />
                                ) : (
                                    <ArrowDown className="size-3.5 text-primary" />
                                ))}
                            {hasFilter && (
                                <span className="inline-flex items-center gap-0.5 text-primary">
                                    <Filter className="size-3 fill-primary/20" />
                                    {filterType === 'multi-select' &&
                                        selectedCount > 0 && (
                                            <span className="text-[10px] font-bold leading-none">
                                                {selectedCount}
                                            </span>
                                        )}
                                </span>
                            )}
                            <ChevronDown
                                className={cn(
                                    'size-3.5 transition-transform duration-150',
                                    isActive
                                        ? 'text-primary'
                                        : 'opacity-45 group-hover:opacity-90',
                                    open && 'rotate-180',
                                )}
                            />
                        </span>
                    </button>
                </PopoverTrigger>

                <PopoverContent
                    align="start"
                    className="w-64 p-2.5 shadow-lg"
                >
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-xs font-semibold text-foreground">
                                {label}
                            </span>
                            {(isSorted || hasFilter) && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (isSorted) {
                                            onSort?.(undefined, undefined);
                                        }
                                        if (hasFilter) {
                                            setDraftSelected([]);
                                            setDraftValue('');
                                            onFilterChange?.(
                                                filterType === 'select'
                                                    ? 'all'
                                                    : '',
                                            );
                                        }
                                        setOpen(false);
                                    }}
                                    className="text-[11px] font-medium text-muted-foreground hover:text-destructive transition-colors"
                                >
                                    Restablecer
                                </button>
                            )}
                        </div>

                        {sortable && onSort && (
                            <>
                                <div className="flex flex-col gap-0.5">
                                    <button
                                        type="button"
                                        onClick={() => handleSortClick('asc')}
                                        className={cn(
                                            'flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-xs transition-colors hover:bg-muted',
                                            isSorted &&
                                                sortDirection === 'asc' &&
                                                'bg-primary/10 font-semibold text-primary',
                                        )}
                                    >
                                        <span className="flex items-center gap-2">
                                            <ArrowUp className="size-3.5" />
                                            Ordenar ascendente (A → Z)
                                        </span>
                                        {isSorted &&
                                            sortDirection === 'asc' && (
                                                <Check className="size-3.5" />
                                            )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSortClick('desc')}
                                        className={cn(
                                            'flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-xs transition-colors hover:bg-muted',
                                            isSorted &&
                                                sortDirection === 'desc' &&
                                                'bg-primary/10 font-semibold text-primary',
                                        )}
                                    >
                                        <span className="flex items-center gap-2">
                                            <ArrowDown className="size-3.5" />
                                            Ordenar descendente (Z → A)
                                        </span>
                                        {isSorted &&
                                            sortDirection === 'desc' && (
                                                <Check className="size-3.5" />
                                            )}
                                    </button>
                                </div>
                                {filterType && <Separator />}
                            </>
                        )}

                        {filterType === 'text' && onFilterChange && (
                            <div className="flex flex-col gap-2">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/70" />
                                    <Input
                                        autoFocus
                                        placeholder={filterPlaceholder}
                                        value={draftValue}
                                        onChange={(e) =>
                                            setDraftValue(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                applyTextFilter();
                                            }
                                        }}
                                        className="h-8 pl-8 pr-7 text-xs"
                                    />
                                    {draftValue && (
                                        <button
                                            type="button"
                                            onClick={() => setDraftValue('')}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            aria-label="Limpiar texto"
                                        >
                                            <X className="size-3.5" />
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center justify-end gap-1.5">
                                    {hasFilter && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearColumnFilter}
                                            className="h-7 px-2 text-xs"
                                        >
                                            Limpiar
                                        </Button>
                                    )}
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={applyTextFilter}
                                        className="h-7 px-3 text-xs"
                                    >
                                        Aplicar
                                    </Button>
                                </div>
                            </div>
                        )}

                        {filterType === 'select' && onFilterChange && (
                            <div className="flex max-h-72 flex-col gap-0.5 overflow-y-auto pr-0.5">
                                <button
                                    type="button"
                                    onClick={() => handleSelectOption('all')}
                                    className={cn(
                                        'flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-xs transition-colors hover:bg-muted',
                                        (!filterValue ||
                                            filterValue === 'all') &&
                                            'bg-primary/10 font-semibold text-primary',
                                    )}
                                >
                                    <span>Todas / Todos</span>
                                    {(!filterValue ||
                                        filterValue === 'all') && (
                                        <Check className="size-3.5" />
                                    )}
                                </button>
                                {filterOptions.map((opt) => {
                                    const selected = filterValue === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() =>
                                                handleSelectOption(opt.value)
                                            }
                                            className={cn(
                                                'flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-xs transition-colors hover:bg-muted',
                                                selected &&
                                                    'bg-primary/10 font-semibold text-primary',
                                            )}
                                        >
                                            <span className="truncate">
                                                {opt.label}
                                            </span>
                                            {selected && (
                                                <Check className="size-3.5 shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {filterType === 'multi-select' && onFilterChange && (
                            <div className="flex flex-col gap-2">
                                {filterOptions.length > 6 && (
                                    <div className="relative">
                                        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/70" />
                                        <Input
                                            placeholder="Buscar opción..."
                                            value={optionSearch}
                                            onChange={(e) =>
                                                setOptionSearch(e.target.value)
                                            }
                                            className="h-8 pl-8 pr-7 text-xs"
                                        />
                                        {optionSearch && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setOptionSearch('')
                                                }
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                aria-label="Limpiar búsqueda"
                                            >
                                                <X className="size-3.5" />
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="flex max-h-72 flex-col gap-0.5 overflow-y-auto pr-0.5">
                                    {filteredOptions.length > 0 ? (
                                        filteredOptions.map((opt) => {
                                            const checked =
                                                draftSelected.includes(
                                                    opt.value,
                                                );
                                            return (
                                                <label
                                                    key={opt.value}
                                                    className={cn(
                                                        'flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-xs transition-colors hover:bg-muted',
                                                        checked &&
                                                            'bg-primary/5 font-medium text-foreground',
                                                    )}
                                                >
                                                    <Checkbox
                                                        checked={checked}
                                                        onCheckedChange={() =>
                                                            toggleMultiOption(
                                                                opt.value,
                                                            )
                                                        }
                                                    />
                                                    <span className="truncate">
                                                        {opt.label}
                                                    </span>
                                                </label>
                                            );
                                        })
                                    ) : (
                                        <p className="py-3 text-center text-xs text-muted-foreground">
                                            Sin coincidencias
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between gap-1.5 border-t border-border/60 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setDraftSelected([])}
                                        className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Limpiar ({draftSelected.length})
                                    </button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={applyMultiSelectFilter}
                                        className="h-7 px-3 text-xs"
                                    >
                                        Aplicar
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </TableHead>
    );
}
