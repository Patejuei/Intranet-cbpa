import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft, Check, ChevronsUpDown, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
// import { route } from 'ziggy-js';

interface Material {
    id: number;
    product_name: string;
    serial_number: string;
    code: string;
}

export default function RepairRequestCreate() {
    const { data, setData, post, processing, errors } = useForm({
        material_id: '',
        description: '',
    });

    const [materials, setMaterials] = useState<Material[]>([]);
    const [loadingMaterials, setLoadingMaterials] = useState(false);
    const [open, setOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Reparaciones',
            href: '/repairs',
        },
        {
            title: 'Nueva Solicitud',
            href: '#',
        },
    ];

    // Fetch materials for selection
    useEffect(() => {
        setLoadingMaterials(true);
        axios
            .get('/materials/lookup')
            .then((response) => {
                setMaterials(response.data.data || []);
            })
            .catch((error) => {
                console.error('Error fetching materials:', error);
            })
            .finally(() => setLoadingMaterials(false));
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/repairs');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nueva Reparación" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <a href="/repairs">
                                <ArrowLeft className="h-5 w-5" />
                            </a>
                        </Button>
                        <h2 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">
                            Nueva Solicitud de Reparación
                        </h2>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Detalles de la Solicitud</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="material_id">
                                        Material a Reparar
                                    </Label>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className={cn(
                                                    'w-full justify-between',
                                                    !data.material_id &&
                                                        'text-muted-foreground',
                                                )}
                                            >
                                                {data.material_id
                                                    ? materials.find(
                                                          (material) =>
                                                              material.id.toString() ===
                                                              data.material_id,
                                                      )
                                                        ? `${materials.find((material) => material.id.toString() === data.material_id)?.product_name} - ${materials.find((material) => material.id.toString() === data.material_id)?.serial_number || materials.find((material) => material.id.toString() === data.material_id)?.code}`
                                                        : 'Seleccione un material'
                                                    : 'Seleccione un material'}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                            <Command>
                                                <CommandInput placeholder="Buscar material..." />
                                                <CommandList>
                                                    <CommandEmpty>
                                                        No se encontraron
                                                        materiales.
                                                    </CommandEmpty>
                                                    <CommandGroup>
                                                        {materials.map(
                                                            (material) => (
                                                                <CommandItem
                                                                    key={
                                                                        material.id
                                                                    }
                                                                    value={`${material.product_name} ${material.serial_number} ${material.code}`}
                                                                    onSelect={() => {
                                                                        setData(
                                                                            'material_id',
                                                                            material.id.toString(),
                                                                        );
                                                                        setOpen(
                                                                            false,
                                                                        );
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            'mr-2 h-4 w-4',
                                                                            data.material_id ===
                                                                                material.id.toString()
                                                                                ? 'opacity-100'
                                                                                : 'opacity-0',
                                                                        )}
                                                                    />
                                                                    {
                                                                        material.product_name
                                                                    }{' '}
                                                                    -{' '}
                                                                    {material.serial_number ||
                                                                        material.code}
                                                                </CommandItem>
                                                            ),
                                                        )}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    {errors.material_id && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.material_id}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="description">
                                        Descripción del Problema
                                    </Label>
                                    <Textarea
                                        id="description"
                                        className="mt-1 block w-full"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Describa el daño o la falla..."
                                        rows={4}
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                    >
                                        <a href="/repairs">Cancelar</a>
                                    </Button>
                                    <Button
                                        disabled={processing}
                                        className="gap-2"
                                    >
                                        <Save className="h-4 w-4" />
                                        Enviar Solicitud
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
