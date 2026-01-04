import { MaterialSelector } from '@/components/MaterialSelector';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Firefighter, Material, SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Check, ChevronsUpDown, Plus, Save, Trash } from 'lucide-react';
import { useState } from 'react';

export default function ReceptionCreate({
    firefighters,
    materials,
}: {
    firefighters: Firefighter[];
    materials: Material[];
}) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const { data, setData, post, processing, errors } = useForm({
        firefighter_id: '',
        date: new Date().toISOString().split('T')[0],
        observations: '',
        company:
            user.company === 'Comandancia' ||
            user.role === 'admin' ||
            user.role === 'capitan'
                ? 'Segunda Compañía'
                : user.company,
        items: [{ material_id: '', quantity: 1 }],
    });

    const [openFirefighter, setOpenFirefighter] = useState(false);

    const addItem = () => {
        setData('items', [...data.items, { material_id: '', quantity: 1 }]);
    };

    const removeItem = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItem = (
        index: number,
        field: string,
        value: string | number,
    ) => {
        const newItems = [...data.items];
        // @ts-ignore
        newItems[index][field] = value;
        setData('items', newItems);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/receptions');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Actas de Recepción', href: '/receptions' },
                { title: 'Nueva Acta', href: '/receptions/create' },
            ]}
        >
            <Head title="Nueva Acta de Recepción" />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Nueva Acta de Recepción
                    </h2>
                    <p className="text-muted-foreground">
                        Registre la recepción de material devuelto por un
                        voluntario.
                    </p>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-6">
                    <div className="grid gap-4 rounded-xl border bg-card p-6 shadow-sm">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <Label>Bombero (Entrega Material)</Label>
                                <Popover
                                    open={openFirefighter}
                                    onOpenChange={setOpenFirefighter}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openFirefighter}
                                            className="w-full justify-between"
                                        >
                                            {data.firefighter_id
                                                ? firefighters.find(
                                                      (f) =>
                                                          f.id.toString() ===
                                                          data.firefighter_id,
                                                  )?.full_name
                                                : 'Seleccione bombero...'}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                        <Command>
                                            <CommandInput placeholder="Buscar bombero..." />
                                            <CommandList>
                                                <CommandEmpty>
                                                    No se encontró bombero.
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {firefighters.map((f) => (
                                                        <CommandItem
                                                            key={f.id}
                                                            value={f.full_name}
                                                            onSelect={() => {
                                                                setData(
                                                                    'firefighter_id',
                                                                    f.id.toString(),
                                                                );
                                                                setOpenFirefighter(
                                                                    false,
                                                                );
                                                            }}
                                                        >
                                                            {f.full_name}
                                                            <Check
                                                                className={cn(
                                                                    'ml-auto',
                                                                    data.firefighter_id ===
                                                                        f.id.toString()
                                                                        ? 'opacity-100'
                                                                        : 'opacity-0',
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                {errors.firefighter_id && (
                                    <p className="text-sm text-red-500">
                                        {errors.firefighter_id}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="date">Fecha</Label>
                                <DatePicker
                                    date={data.date}
                                    setDate={(d) =>
                                        setData(
                                            'date',
                                            d ? format(d, 'yyyy-MM-dd') : '',
                                        )
                                    }
                                />
                                {errors.date && (
                                    <p className="text-sm text-red-500">
                                        {errors.date}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="company">Compañía</Label>
                            <CompanyField
                                value={data.company}
                                onChange={(val) => setData('company', val)}
                            />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                                Materiales Recibidos
                            </h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addItem}
                            >
                                <Plus className="mr-2 size-4" /> Agregar Item
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {data.items.map((item, index) => (
                                <MaterialRow
                                    key={index}
                                    item={item}
                                    index={index}
                                    materials={materials}
                                    updateItem={updateItem}
                                    removeItem={removeItem}
                                    isSingle={data.items.length === 1}
                                />
                            ))}
                        </div>
                        {errors.items && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.items}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-2 rounded-xl border bg-card p-6 shadow-sm">
                        <Label htmlFor="observations">Observaciones</Label>
                        <textarea
                            id="observations"
                            value={data.observations}
                            onChange={(e) =>
                                setData('observations', e.target.value)
                            }
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link href="/receptions">
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="gap-2"
                        >
                            <Save className="size-4" /> Guardar Acta
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

function MaterialRow({
    item,
    index,
    materials,
    updateItem,
    removeItem,
    isSingle,
}: {
    item: { material_id: string; quantity: number };
    index: number;
    materials: Material[];
    updateItem: (index: number, field: string, value: string | number) => void;
    removeItem: (index: number) => void;
    isSingle: boolean;
}) {
    return (
        <div className="flex items-end gap-4 border-b pb-4 last:border-0 last:pb-0">
            <div className="flex flex-1 flex-col gap-2">
                <Label>Material</Label>
                <MaterialSelector
                    materials={materials}
                    value={
                        item.material_id
                            ? parseInt(item.material_id)
                            : undefined
                    }
                    onChange={(val) =>
                        updateItem(index, 'material_id', val.toString())
                    }
                    placeholder="Seleccione material (Nombre, Cód, o S/N)..."
                />
            </div>
            <div className="grid w-32 gap-2">
                <Label>Cantidad</Label>
                <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                        updateItem(index, 'quantity', parseInt(e.target.value))
                    }
                    required
                />
            </div>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => removeItem(index)}
                disabled={isSingle}
            >
                <Trash className="size-4" />
            </Button>
        </div>
    );
}

function CompanyField({
    value,
    onChange,
}: {
    value: string;
    onChange: (val: string) => void;
}) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    // Allow selection if Admin, Capitan, or Comandancia
    const canSelect =
        user.role === 'admin' ||
        user.role === 'capitan' ||
        user.company === 'Comandancia';

    if (!canSelect) {
        return (
            <Input
                value={value}
                disabled
                className="bg-muted text-muted-foreground opacity-100" // Make it readable
            />
        );
    }

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione Compañía" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Primera Compañía">
                    Primera Compañía
                </SelectItem>
                <SelectItem value="Segunda Compañía">
                    Segunda Compañía
                </SelectItem>
                <SelectItem value="Tercera Compañía">
                    Tercera Compañía
                </SelectItem>
                <SelectItem value="Cuarta Compañía">Cuarta Compañía</SelectItem>
                <SelectItem value="Quinta Compañía">Quinta Compañía</SelectItem>
                <SelectItem value="Séptima Compañía">
                    Séptima Compañía
                </SelectItem>
                <SelectItem value="Octava Compañía">Octava Compañía</SelectItem>
                <SelectItem value="Novena Compañía">Novena Compañía</SelectItem>
                <SelectItem value="Décima Compañía">Décima Compañía</SelectItem>
                <SelectItem value="Comandancia">Comandancia</SelectItem>
            </SelectContent>
        </Select>
    );
}
