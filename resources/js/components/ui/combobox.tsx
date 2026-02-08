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
                        // Custom filter logic to match label AND description (e.g. SKU)
                        // 'val' is the option.value usually, which might not be enough.
                        // CommandItem 'value' prop should contain all searchable text.
                        if (val.toLowerCase().includes(search.toLowerCase())) return 1;
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
                                    value={`${option.label} ${option.description || ''} ${option.value}`} // composite for search
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
