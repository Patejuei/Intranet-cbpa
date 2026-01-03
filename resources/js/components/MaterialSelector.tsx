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
import { Material } from '@/types';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

interface MaterialSelectorProps {
    materials: Material[];
    value?: number;
    onChange: (value: number) => void;
    placeholder?: string;
    disabled?: boolean;
}

export function MaterialSelector({
    materials,
    value,
    onChange,
    placeholder = 'Seleccionar Material...',
    disabled,
}: MaterialSelectorProps) {
    const [open, setOpen] = useState(false);

    // Derived selected material for display
    const selectedMaterial = materials.find((m) => m.id === value);

    const [filteredMaterials, setFilteredMaterials] = useState<Material[]>(
        materials.slice(0, 50), // Initial limit for performance
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between overflow-hidden text-left font-normal"
                    disabled={disabled}
                >
                    {selectedMaterial ? (
                        <span className="truncate">
                            {selectedMaterial.code && (
                                <span className="mr-2 font-mono text-xs opacity-70">
                                    [{selectedMaterial.code}]
                                </span>
                            )}
                            {selectedMaterial.product_name}
                            {selectedMaterial.serial_number && (
                                <span className="ml-2 font-mono text-xs text-muted-foreground">
                                    (S/N: {selectedMaterial.serial_number})
                                </span>
                            )}
                        </span>
                    ) : (
                        <span className="text-muted-foreground">
                            {placeholder}
                        </span>
                    )}
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
                <Command
                    filter={(value, search) => {
                        // Custom filter logic if needed, but Command default is usually fuzzy.
                        // value passed here is usually the "value" prop of CommandItem, which we set to a composite string.
                        if (value.toLowerCase().includes(search.toLowerCase()))
                            return 1;
                        return 0;
                    }}
                >
                    <CommandInput placeholder="Buscar por Nombre, Código o S/N..." />
                    <CommandList>
                        <CommandEmpty>No se encontró material.</CommandEmpty>
                        <CommandGroup>
                            {materials.map((material) => (
                                <CommandItem
                                    key={material.id}
                                    value={`${material.product_name} ${material.code || ''} ${material.serial_number || ''}`}
                                    onSelect={() => {
                                        onChange(material.id);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={`mr-2 size-4 ${
                                            value === material.id
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        }`}
                                    />
                                    <div className="flex flex-col">
                                        <span>{material.product_name}</span>
                                        <div className="flex gap-2 text-xs text-muted-foreground">
                                            {material.code && (
                                                <span>
                                                    Code: {material.code}
                                                </span>
                                            )}
                                            {material.serial_number && (
                                                <span>
                                                    S/N:{' '}
                                                    {material.serial_number}
                                                </span>
                                            )}
                                            <span>
                                                (Stock:{' '}
                                                {material.stock_quantity})
                                            </span>
                                        </div>
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
