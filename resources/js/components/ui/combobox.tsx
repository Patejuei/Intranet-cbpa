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
import { Check, ChevronsUpDown } from 'lucide-react';
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
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command
                    filter={(val, search) => {
                        const normalize = (s: string) =>
                            s
                                .toLowerCase()
                                .normalize('NFD') // remove accents
                                .replace(/[\u0300-\u036f]/g, '')
                                .replace(/[-\s]/g, ''); // strip hyphens and spaces

                        if (normalize(val).includes(normalize(search))) return 1;
                        return 0;
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
                                        onChange(option.value);
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
