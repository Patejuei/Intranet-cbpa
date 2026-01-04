import { MaterialSelector } from '@/components/MaterialSelector';
import Pagination from '@/components/Pagination';
import AppLayout from '@/layouts/app-layout';
import { Material } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import {
    ArrowDownCircle,
    ArrowUpCircle,
    Box,
    History,
    Save,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Log {
    id: number;
    item_name: string;
    serial_number: string;
    inventory_number: string;
    category: string;
    type: string;
    reason: string;
    status: string;
    created_at: string;
    user: { name: string };
}

interface PageProps {
    logs: {
        data: Log[];
        links: any[];
    };
    materials: Material[];
}

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
];

import { usePermissions } from '@/hooks/use-permissions';

export default function EquipmentIndex({ logs, materials }: PageProps) {
    const [actionType, setActionType] = useState<'ALTA' | 'BAJA'>('ALTA');
    const { canCreate } = usePermissions();

    const { data, setData, post, processing, reset, errors } = useForm({
        item_name: '',
        brand: '',
        model: '',
        serial_number: '',
        inventory_number: '', // Not used in form, but part of Log
        category: '',
        type: 'ALTA',
        quantity: 1,
        reason: '',
        status: '', // Removed default PENDIENTE
        document: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/equipment', {
            onSuccess: () => reset(),
        });
    };

    const toggleAction = (type: 'ALTA' | 'BAJA') => {
        setActionType(type);
        setData('type', type);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Material Menor', href: '/equipment' },
            ]}
        >
            <Head title="Gestión Material Menor" />

            <div className="flex flex-col gap-6 p-4">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Formulario */}
                    {canCreate('equipment') && (
                        <div className="rounded-xl border bg-card p-6 shadow-sm">
                            <div className="mb-6 flex items-center gap-2">
                                <Box className="size-5 text-primary" />
                                <h2 className="text-lg font-semibold text-foreground">
                                    Registro de Material
                                </h2>
                            </div>

                            <div className="mb-6 flex gap-2 rounded-lg bg-muted p-1">
                                <button
                                    onClick={() => toggleAction('ALTA')}
                                    className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${actionType === 'ALTA' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <ArrowUpCircle className="size-4" />{' '}
                                        Alta
                                    </span>
                                </button>
                                <button
                                    onClick={() => toggleAction('BAJA')}
                                    className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${actionType === 'BAJA' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <ArrowDownCircle className="size-4" />{' '}
                                        Baja
                                    </span>
                                </button>
                            </div>

                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Nombre del Material
                                    </label>
                                    <input
                                        type="text"
                                        value={data.item_name}
                                        onChange={(e) =>
                                            setData('item_name', e.target.value)
                                        }
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                        placeholder="Ej: Pitón Protek, Hacha..."
                                        required
                                    />
                                    {errors.item_name && (
                                        <p className="mt-1 text-xs text-destructive">
                                            {errors.item_name}
                                        </p>
                                    )}
                                </div>

                                {/* Smart Search Logic */}
                                {(actionType === 'ALTA' ||
                                    actionType === 'BAJA') && (
                                    <div className="space-y-4 rounded-lg bg-muted/50 p-4">
                                        <div>
                                            <label className="mb-1 block text-sm font-medium">
                                                {actionType === 'ALTA'
                                                    ? 'Buscador Inteligente (Autocompletar Alta)'
                                                    : 'Buscador Inteligente (Seleccionar Baja)'}
                                            </label>
                                            <MaterialSelector
                                                materials={materials}
                                                value={undefined} // Controlled logic via direct form update
                                                onChange={(id: number) => {
                                                    const m = materials.find(
                                                        (mat) => mat.id === id,
                                                    );
                                                    if (m) {
                                                        setData((prev) => ({
                                                            ...prev,
                                                            item_name:
                                                                m.product_name,
                                                            brand:
                                                                m.brand || '',
                                                            model:
                                                                m.model || '',
                                                            category:
                                                                m.category ||
                                                                prev.category,
                                                            serial_number:
                                                                m.serial_number ||
                                                                '',
                                                            inventory_number:
                                                                m.code ||
                                                                m.serial_number ||
                                                                '',
                                                        }));
                                                    }
                                                }}
                                                placeholder="Buscar por Nombre, Código o S/N..."
                                            />
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {actionType === 'ALTA'
                                                    ? 'Busque un material existente para sumar stock automáticamente.'
                                                    : 'Busque el material que desea dar de baja.'}
                                            </p>
                                        </div>

                                        {/* Manual Inventory Number (Visible for Alta for custom codes, or display for Baja) */}
                                        <div
                                            className={
                                                actionType === 'BAJA'
                                                    ? 'opacity-50'
                                                    : ''
                                            }
                                        >
                                            <label className="mb-1 block text-sm font-medium">
                                                {actionType === 'ALTA'
                                                    ? 'N° Inventario Personalizado (Opcional)'
                                                    : 'N° Inventario Seleccionado'}
                                            </label>
                                            <input
                                                type="text"
                                                value={data.inventory_number}
                                                onChange={(e) =>
                                                    setData(
                                                        'inventory_number',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                                placeholder={
                                                    actionType === 'ALTA'
                                                        ? 'Dejar vacío para generación automática (ej: EPP-XXXX)'
                                                        : 'Se rellena automáticamente...'
                                                }
                                                readOnly={true}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Marca
                                        </label>
                                        <input
                                            type="text"
                                            value={data.brand || ''}
                                            onChange={(e) =>
                                                setData('brand', e.target.value)
                                            }
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                            placeholder="Ej: Protek"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Modelo
                                        </label>
                                        <input
                                            type="text"
                                            value={data.model || ''}
                                            onChange={(e) =>
                                                setData('model', e.target.value)
                                            }
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                            placeholder="Ej: 366"
                                        />
                                    </div>
                                </div>

                                {actionType === 'ALTA' && (
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Categoría (Necesaria para
                                            Auto-Generar Código)
                                        </label>
                                        <select
                                            value={data.category}
                                            onChange={(e) =>
                                                setData(
                                                    'category',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                            required
                                        >
                                            <option value="">
                                                Seleccione Categoría
                                            </option>
                                            {CATEGORIES.map((cat) => (
                                                <option
                                                    key={cat.value}
                                                    value={cat.value}
                                                >
                                                    {cat.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category && (
                                            <p className="mt-1 text-xs text-destructive">
                                                {errors.category}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Cantidad
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.quantity}
                                        onChange={(e) =>
                                            setData(
                                                'quantity',
                                                parseInt(e.target.value) || 1,
                                            )
                                        }
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                        required
                                    />
                                    {errors.quantity && (
                                        <p className="mt-1 text-xs text-destructive">
                                            {errors.quantity}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Número de Serie (Fabricante)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.serial_number}
                                        onChange={(e) =>
                                            setData(
                                                'serial_number',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                        placeholder="Ingrese S/N si aplica (Limita stock a 1 en Alta)"
                                    />
                                    {errors.serial_number && (
                                        <p className="mt-1 text-xs text-destructive">
                                            {errors.serial_number}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Motivo / Descripción
                                    </label>
                                    <textarea
                                        value={data.reason}
                                        onChange={(e) =>
                                            setData('reason', e.target.value)
                                        }
                                        className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                        placeholder={
                                            actionType === 'ALTA'
                                                ? 'Detalles de la adquisición...'
                                                : 'Razón de la baja (daño, pérdida, etc)...'
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Documento de Respaldo (Opcional)
                                    </label>
                                    <input
                                        type="file"
                                        onChange={(e) =>
                                            setData(
                                                'document',
                                                e.target.files
                                                    ? e.target.files[0]
                                                    : null,
                                            )
                                        }
                                        className="w-full cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20"
                                        accept=".pdf,.jpg,.png,.jpeg"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                                >
                                    <Save className="size-4" />
                                    Registrar{' '}
                                    {actionType === 'ALTA' ? 'Alta' : 'Baja'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Historial */}
                    <div
                        className={`flex max-h-[600px] flex-col overflow-hidden rounded-xl border bg-card p-6 shadow-sm ${!canCreate('equipment') ? 'col-span-2' : ''}`}
                    >
                        <div className="mb-6 flex items-center gap-2 text-primary">
                            <History className="size-5" />
                            <h2 className="text-lg font-semibold text-foreground">
                                Historial de Movimientos
                            </h2>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2">
                            {logs.data.length === 0 ? (
                                <p className="py-8 text-center text-muted-foreground">
                                    No hay registros recientes.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {logs.data.map((log) => (
                                        <div
                                            key={log.id}
                                            className="rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted/50"
                                        >
                                            <div className="mb-1 flex items-start justify-between">
                                                <div>
                                                    <span className="block font-semibold">
                                                        {log.item_name}
                                                    </span>
                                                    {log.inventory_number && (
                                                        <span className="rounded border bg-background px-1.5 py-0.5 font-mono text-xs">
                                                            {
                                                                log.inventory_number
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                        log.type === 'ALTA'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}
                                                >
                                                    {log.type}
                                                </span>
                                            </div>
                                            <p className="mb-1 text-sm text-muted-foreground">
                                                {log.serial_number && (
                                                    <span className="mr-2">
                                                        S/N: {log.serial_number}
                                                    </span>
                                                )}
                                                Por: {log.user.name}
                                            </p>
                                            {log.reason && (
                                                <p className="border-l-2 border-primary/30 pl-2 text-sm italic">
                                                    "{log.reason}"
                                                </p>
                                            )}
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(
                                                        log.created_at,
                                                    ).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <Pagination links={logs.links} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
