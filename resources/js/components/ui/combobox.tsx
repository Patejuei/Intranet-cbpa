import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { useState } from 'react';

export interface ComboboxOption {
    value: string;
    label: string;
    description?: string; // For SKU or extra info
    searchValue?: string; // Custom searchable text
}

interface ComboboxProps {
    options: ComboboxOption[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    disabled?: boolean;
    className?: string;
    searchInDescription?: boolean;
    clearable?: boolean;
}

export function Combobox({
    options,
    value,
    onChange,
    placeholder = 'Seleccionar...',
    searchPlaceholder = 'Buscar...',
    emptyText = 'No se encontraron resultados.',
    disabled,
    className,
    searchInDescription = true,
    clearable = false,
}: ComboboxProps) {
    const [open, setOpen] = useState(false);

    const selected = options.find((option) => option.value === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        'w-full justify-between font-normal',
                        !value && 'text-muted-foreground',
                        className,
                    )}
                    disabled={disabled}
                >
                    <span className="truncate">
                        {selected ? (
                            <span>
                                {selected.label}
                                {selected.description && (
                                    <span className="ml-2 text-muted-foreground opacity-70">
                                        {selected.description}
                                    </span>
                                )}
                            </span>
                        ) : (
                            placeholder
                        )}
                    </span>
                    <span className="flex items-center gap-1 shrink-0 ml-2">
                        {clearable && value && !disabled && (
                            <span
                                role="button"
                                tabIndex={0}
                                aria-label="Limpiar selección"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange('');
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.stopPropagation();
                                        onChange('');
                                    }
                                }}
                                className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            >
                                <X className="h-3.5 w-3.5" />
                            </span>
                        )}
                        <ChevronsUpDown className="h-4 w-4 opacity-50" />
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command
                    filter={(val, search) => {
                        const clean = (s: string) =>
                            s
                                .toLowerCase()
                                .normalize('NFD') // remove accents
                                .replace(/[\u0300-\u036f]/g, '');

                        const target = clean(val);
                        const searchWords = clean(search).split(/\s+/).filter(Boolean);

                        if (searchWords.length === 0) return 1;

                        const allMatch = searchWords.every((word) => target.includes(word));
                        return allMatch ? 1 : 0;
                    }}
                >
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList>
                        <CommandEmpty>{emptyText}</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={
                                        option.searchValue ||
                                        `${option.label} ${searchInDescription ? option.description || '' : ''}`
                                    }
                                    onSelect={() => {
                                        if (clearable && value === option.value) {
                                            onChange('');
                                        } else {
                                            onChange(option.value);
                                        }
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value === option.value
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span>{option.label}</span>
                                        {option.description && (
                                            <span className="text-xs text-muted-foreground">
                                                {option.description}
                                            </span>
                                        )}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
