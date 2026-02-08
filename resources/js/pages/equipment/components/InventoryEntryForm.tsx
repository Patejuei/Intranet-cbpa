import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { MaterialAcquisition } from '@/types';
import { useForm } from '@inertiajs/react';
import { Check, CheckCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

// Categories from index (should be shared constant or imported)
const CATEGORIES = [
    { value: 'EPP', label: 'Equipos de Protección Personal (EPP)' },
    { value: 'EXT', label: 'Material de Extinción (EXT)' },
    { value: 'RES', label: 'Herramientas de Rescate (RES)' },
    { value: 'MED', label: 'Material Médico (MED)' },
    { value: 'TEL', label: 'Telecomunicaciones (TEL)' },
    { value: 'EFO', label: 'Entrada Forzada (EFO)' },
    { value: 'ESC', label: 'Escalas (ESC)' },
    { value: 'VEN', label: 'Ventilación (VEN)' },
    { value: 'REL', label: 'Riesgos Eléctricos (REL)' },
    { value: 'HAZ', label: 'Materiales Peligrosos (HAZ)' },
    { value: 'SEG', label: 'Seguridad' },
    { value: 'OTR', label: 'Otro' },
];

interface EntryItemForm {
    id: number;
    item_name: string;
    quantity: number;
    brand: string;
    model: string;
    serial_number: string;
    inventory_code: string;
    category: string;
}

export default function InventoryEntryForm({
    acquisition,
    onSuccess,
}: {
    acquisition: MaterialAcquisition;
    onSuccess: () => void;
}) {
    // Initial state based on requested items
    const { data, setData, post, processing } = useForm<{
        items: EntryItemForm[];
    }>({
        items: acquisition.items.map((item) => ({
            id: item.id,
            item_name: item.item_name, // Editable now
            quantity: item.quantity,
            brand: '',
            model: '',
            serial_number: '',
            inventory_code: '',
            category: '',
        })),
    });

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/equipment/acquisitions/' + acquisition.id + '/inventory-entry', {
            onSuccess: onSuccess,
        });
    };

    return (
        <form onSubmit={submit}>
            <Card className="border-primary/20">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <CheckCircle className="size-4" />
                        </div>
                        Ingreso a Inventario Comandancia
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Complete los datos técnicos para ingresar oficialmente
                        el material.
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {data.items.map((item, index) => (
                        <Card
                            key={item.id}
                            className="border-primary/10 bg-muted/30"
                        >
                            <CardContent className="p-4">
                                <div className="mb-3 flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <Label
                                            htmlFor={`item-name-${item.id}`}
                                            className="text-xs"
                                        >
                                            Nombre del Ítem
                                        </Label>
                                        <Input
                                            id={`item-name-${item.id}`}
                                            className="mt-1"
                                            value={item.item_name}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    'item_name',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <Badge variant="secondary" className="mt-5">
                                        Cant: {item.quantity}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor={`category-${item.id}`}
                                            className="text-xs"
                                        >
                                            Categoría
                                        </Label>
                                        <Select
                                            value={item.category}
                                            onValueChange={(value) =>
                                                updateItem(
                                                    index,
                                                    'category',
                                                    value,
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                id={`category-${item.id}`}
                                            >
                                                <SelectValue placeholder="Seleccione Categoría" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CATEGORIES.map((cat) => (
                                                    <SelectItem
                                                        key={cat.value}
                                                        value={cat.value}
                                                    >
                                                        {cat.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor={`brand-${item.id}`}
                                            className="text-xs"
                                        >
                                            Marca
                                        </Label>
                                        <Input
                                            id={`brand-${item.id}`}
                                            value={item.brand}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    'brand',
                                                    e.target.value,
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor={`model-${item.id}`}
                                            className="text-xs"
                                        >
                                            Modelo
                                        </Label>
                                        <Input
                                            id={`model-${item.id}`}
                                            value={item.model}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    'model',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor={`serial-${item.id}`}
                                            className="text-xs"
                                        >
                                            Nº Serie
                                        </Label>
                                        <Input
                                            id={`serial-${item.id}`}
                                            value={item.serial_number}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    'serial_number',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor={`inventory-${item.id}`}
                                            className="text-xs"
                                        >
                                            Cód. Inventario
                                        </Label>
                                        <Input
                                            id={`inventory-${item.id}`}
                                            value={item.inventory_code}
                                            onChange={(e) =>
                                                updateItem(
                                                    index,
                                                    'inventory_code',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Opcional"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <div className="flex justify-end border-t pt-4">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="gap-2"
                        >
                            <Check className="size-4" />
                            Finalizar Ingreso
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
