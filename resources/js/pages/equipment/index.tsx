import Pagination from '@/components/Pagination';
import { usePermissions } from '@/hooks/use-permissions';
import AppLayout from '@/layouts/app-layout';
import { Material } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    ArrowDownCircle,
    ArrowUpCircle,
    Box,
    History,
    LayoutList,
    PlusCircle,
    Save,
    Trash,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

// New Components
import AcquisitionsList from './components/AcquisitionsList';
import BajasList, { MaterialBajaRequest } from './components/BajasList';
import RequestForm from './components/RequestForm';

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
    acquisitions: any[];
    materials: Material[];
    userRole: string;
    userCompany: string;
    companies: string[];
    bajaRequests: {
        data: MaterialBajaRequest[];
        links: any[];
    };
}

export default function EquipmentIndex({
    logs,
    acquisitions,
    materials,
    companies, // Add prop
    bajaRequests,
}: PageProps) {
    const { userRole, userCompany, url } = usePage<any>().props; // Destructure userCompany here from page props if needed or use from props
    const { canCreate } = usePermissions();

    // Determine initial tab
    const initialTab =
        typeof window !== 'undefined' &&
        window.location.search.includes('bajas_page')
            ? 'BAJAS'
            : 'GESTION';
    const [activeTab, setActiveTab] = useState<'GESTION' | 'ALTA' | 'BAJAS'>(
        initialTab,
    );
    const [showRequestForm, setShowRequestForm] = useState(false);

    interface EquipmentFormData {
        type: 'ALTA';
        document: File | null;
        company: string;
        invoice_number: string;
        invoice_date: string;
        supplier_rut: string;
        supplier_name: string;
        items: {
            item_name: string;
            quantity: number;
            unit_price: number;
        }[];
    }

    // --- Manual Log Form Logic (Alta) ---
    const { data, setData, post, processing, reset, errors } =
        useForm<EquipmentFormData>({
            // Shared
            type: 'ALTA',
            document: null,
            company: userCompany || '', // Add company state

            // Alta Specific (Invoice Header)
            invoice_number: '',
            invoice_date: '',
            supplier_rut: '',
            supplier_name: '',
            items: [],
        });

    const formatRut = (rut: string) => {
        if (!rut) return '';
        const clean = rut.replace(/[^0-9kK]/g, '');
        if (clean.length < 2) return clean;
        const body = clean.slice(0, -1);
        const dv = clean.slice(-1).toUpperCase();
        return `${body}-${dv}`;
    };

    const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const formatted = formatRut(value);
        setData('supplier_rut', formatted);
    };

    // Helper to manage items in Alta
    const addItem = () => {
        setData('items', [
            ...data.items,
            { item_name: '', quantity: 1, unit_price: 0 },
        ]);
    };

    const removeItem = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        // @ts-ignore
        newItems[index][field] = value;
        setData('items', newItems);
    };

    const submitManual: FormEventHandler = (e) => {
        e.preventDefault();
        post('/equipment', {
            onSuccess: () => {
                reset();
                setData('items', []);
            },
        });
    };

    // Helper for manual form
    const isManualTab = activeTab === 'ALTA';

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Material Menor', href: '/equipment' },
            ]}
        >
            <Head title="Gestión Material Menor" />

            <div className="flex flex-col gap-6 p-4">
                {/* Tabs Header */}
                <div className="flex gap-2 overflow-x-auto border-b pb-2">
                    <button
                        onClick={() => setActiveTab('GESTION')}
                        className={`flex items-center gap-2 rounded-t-lg border-b-2 px-4 py-2 transition-colors ${
                            activeTab === 'GESTION'
                                ? 'border-primary bg-primary/5 font-semibold text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <LayoutList className="size-4" /> Gestión / Solicitudes
                    </button>
                    {(canCreate('equipment') ||
                        userRole === 'admin' ||
                        userRole === 'secretaria_adquisiciones') && (
                        <>
                            <button
                                onClick={() => {
                                    setActiveTab('ALTA');
                                    // Initialize with one item if empty
                                    if (data.items.length === 0) {
                                        setData('items', [
                                            {
                                                item_name: '',
                                                quantity: 1,
                                                unit_price: 0,
                                            },
                                        ]);
                                    }
                                }}
                                className={`flex items-center gap-2 rounded-t-lg border-b-2 px-4 py-2 transition-colors ${
                                    activeTab === 'ALTA'
                                        ? 'border-green-600 bg-green-50 font-semibold text-green-700'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <ArrowUpCircle className="size-4" /> Registrar
                                Compra
                            </button>
                            <button
                                onClick={() => setActiveTab('BAJAS')}
                                className={`flex items-center gap-2 rounded-t-lg border-b-2 px-4 py-2 transition-colors ${
                                    activeTab === 'BAJAS'
                                        ? 'border-red-600 bg-red-50 font-semibold text-red-700'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <ArrowDownCircle className="size-4" />{' '}
                                Solicitudes de Baja
                            </button>
                        </>
                    )}
                </div>

                <div className="grid items-start gap-6 md:grid-cols-3">
                    {/* Main Content Area */}
                    <div className="space-y-6 md:col-span-3">
                        {/* Tab: GESTION */}
                        {activeTab === 'GESTION' && (
                            <div className="space-y-6">
                                {/* Actions Header */}
                                <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            Solicitudes y Adquisiciones
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            Gestione el flujo de compra y
                                            recepción.
                                        </p>
                                    </div>
                                    {/* Captain can request */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() =>
                                                setActiveTab('BAJAS')
                                            }
                                            className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm text-secondary-foreground hover:bg-secondary/80"
                                        >
                                            <Trash className="size-4" />
                                            Solicitudes de Baja
                                        </button>
                                        {userRole === 'capitan' && (
                                            <button
                                                onClick={() =>
                                                    setShowRequestForm(
                                                        !showRequestForm,
                                                    )
                                                }
                                                className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
                                            >
                                                <PlusCircle className="size-4" />{' '}
                                                Nueva Solicitud
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Request Form (Collapsible) */}
                                {showRequestForm && userRole === 'capitan' && (
                                    <div className="animate-in rounded-xl border bg-card p-6 shadow-sm fade-in slide-in-from-top-2">
                                        <div className="mb-4 flex justify-between">
                                            <h3 className="font-semibold">
                                                Formulario de Solicitud
                                            </h3>
                                            <button
                                                onClick={() =>
                                                    setShowRequestForm(false)
                                                }
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <RequestForm
                                            onSuccess={() =>
                                                setShowRequestForm(false)
                                            }
                                        />
                                    </div>
                                )}

                                {/* List */}
                                <AcquisitionsList acquisitions={acquisitions} />

                                {/* Logs History Moved Here */}
                                <div className="rounded-xl border bg-card p-6 shadow-sm">
                                    <div className="mb-4 flex items-center gap-2 text-muted-foreground">
                                        <History className="size-5" />
                                        <h3 className="font-semibold text-foreground">
                                            Historial de Movimientos
                                        </h3>
                                    </div>

                                    <div className="space-y-3">
                                        {logs.data.length === 0 ? (
                                            <p className="text-center text-sm text-muted-foreground">
                                                Sin registros.
                                            </p>
                                        ) : (
                                            <div className="overflow-hidden rounded-md border">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-muted/50">
                                                        <tr>
                                                            <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                                                                Ítem
                                                            </th>
                                                            <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                                                                Tipo
                                                            </th>
                                                            <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                                                                Usuario
                                                            </th>
                                                            <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                                                                Fecha
                                                            </th>
                                                            <th className="px-4 py-2 text-left font-medium text-muted-foreground">
                                                                Motivo
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y">
                                                        {logs.data.map(
                                                            (log) => (
                                                                <tr
                                                                    key={log.id}
                                                                    className="hover:bg-muted/30"
                                                                >
                                                                    <td className="px-4 py-2 font-medium">
                                                                        {
                                                                            log.item_name
                                                                        }
                                                                    </td>
                                                                    <td className="px-4 py-2">
                                                                        <span
                                                                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                                                log.type ===
                                                                                'ALTA'
                                                                                    ? 'bg-green-100 text-green-700'
                                                                                    : 'bg-red-100 text-red-700'
                                                                            }`}
                                                                        >
                                                                            {
                                                                                log.type
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-4 py-2 text-muted-foreground">
                                                                        {
                                                                            log
                                                                                .user
                                                                                .name
                                                                        }
                                                                    </td>
                                                                    <td className="px-4 py-2 text-muted-foreground">
                                                                        {new Date(
                                                                            log.created_at,
                                                                        ).toLocaleDateString()}
                                                                    </td>
                                                                    <td className="px-4 py-2 text-muted-foreground">
                                                                        {
                                                                            log.reason
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            ),
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-4">
                                        <Pagination links={logs.links} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab: MANUAL ALTA / BAJA */}
                        {isManualTab && (
                            <div className="rounded-xl border bg-card p-6 shadow-sm">
                                <div className="mb-6 flex items-center gap-2">
                                    <Box className="size-5 text-primary" />
                                    <h2 className="text-lg font-semibold text-foreground">
                                        Registro de Alta Manual
                                    </h2>
                                </div>

                                <form
                                    onSubmit={submitManual}
                                    className="space-y-6"
                                >
                                    {/* ALTA: Invoice Data First */}
                                    {activeTab === 'ALTA' && (
                                        <div className="space-y-4 rounded-xl border bg-muted/30 p-4">
                                            <h4 className="flex items-center gap-2 font-semibold text-primary">
                                                <LayoutList className="size-4" />{' '}
                                                Datos de Adquisición
                                            </h4>
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium">
                                                        Nº Factura
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            data.invoice_number
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'invoice_number',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium">
                                                        Fecha Factura
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={
                                                            data.invoice_date
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'invoice_date',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium">
                                                        RUT Proveedor
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            data.supplier_rut
                                                        }
                                                        onChange={
                                                            handleRutChange
                                                        }
                                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        placeholder="12.345.678-K"
                                                        maxLength={12}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium">
                                                        Nombre Proveedor
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            data.supplier_name
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'supplier_name',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-1 block text-sm font-medium">
                                                        Compañía Destino
                                                    </label>
                                                    {userRole === 'admin' ||
                                                    userRole === 'comandante' ||
                                                    userRole ===
                                                        'secretaria_adquisiciones' ? (
                                                        <select
                                                            value={data.company}
                                                            onChange={(e) =>
                                                                setData(
                                                                    'company',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                            required
                                                        >
                                                            <option value="">
                                                                Seleccione
                                                                Compañía
                                                            </option>
                                                            {companies.map(
                                                                (company) => (
                                                                    <option
                                                                        key={
                                                                            company
                                                                        }
                                                                        value={
                                                                            company
                                                                        }
                                                                    >
                                                                        {
                                                                            company
                                                                        }
                                                                    </option>
                                                                ),
                                                            )}
                                                        </select>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={
                                                                userCompany ||
                                                                data.company
                                                            }
                                                            readOnly
                                                            className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ALTA: Dynamic Items List */}
                                    {activeTab === 'ALTA' && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold">
                                                    Listado de Materiales
                                                </h4>
                                            </div>
                                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                                <div className="w-full overflow-auto">
                                                    <table className="w-full text-sm">
                                                        <thead className="[&_tr]:border-b">
                                                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                                <th className="h-10 w-1/2 px-4 text-left align-middle font-medium text-muted-foreground">
                                                                    Nombre del
                                                                    Item
                                                                </th>
                                                                <th className="h-10 w-24 px-4 text-center align-middle font-medium text-muted-foreground">
                                                                    Cantidad
                                                                </th>
                                                                <th className="h-10 w-32 px-4 text-right align-middle font-medium text-muted-foreground">
                                                                    Valor
                                                                    Unitario
                                                                </th>
                                                                <th className="h-10 w-10 px-4 align-middle font-medium text-muted-foreground"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="[&_tr:last-child]:border-0">
                                                            {data.items.map(
                                                                (
                                                                    item,
                                                                    index,
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                                                    >
                                                                        <td className="p-2 align-middle">
                                                                            <input
                                                                                type="text"
                                                                                value={
                                                                                    item.item_name
                                                                                }
                                                                                onChange={(
                                                                                    e,
                                                                                ) =>
                                                                                    updateItem(
                                                                                        index,
                                                                                        'item_name',
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                    )
                                                                                }
                                                                                className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                                                                placeholder="Ej: Casco F1, Guantes..."
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="p-2 align-middle">
                                                                            <input
                                                                                type="number"
                                                                                min="1"
                                                                                value={
                                                                                    item.quantity
                                                                                }
                                                                                onChange={(
                                                                                    e,
                                                                                ) =>
                                                                                    updateItem(
                                                                                        index,
                                                                                        'quantity',
                                                                                        parseInt(
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                        ) ||
                                                                                            1,
                                                                                    )
                                                                                }
                                                                                className="w-full rounded-md border border-input bg-background px-3 py-1 text-center text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td className="p-2 align-middle">
                                                                            <div className="relative">
                                                                                <span className="absolute top-1.5 left-2 text-muted-foreground">
                                                                                    $
                                                                                </span>
                                                                                <input
                                                                                    type="number"
                                                                                    min="0"
                                                                                    value={
                                                                                        item.unit_price
                                                                                    }
                                                                                    onChange={(
                                                                                        e,
                                                                                    ) =>
                                                                                        updateItem(
                                                                                            index,
                                                                                            'unit_price',
                                                                                            parseInt(
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                            ) ||
                                                                                                0,
                                                                                        )
                                                                                    }
                                                                                    className="w-full rounded-md border border-input bg-background py-1 pr-2 pl-6 text-right text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-2 text-center align-middle">
                                                                            {data
                                                                                .items
                                                                                .length >
                                                                                1 && (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        removeItem(
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                    className="text-destructive transition-colors hover:text-destructive/80"
                                                                                >
                                                                                    <Trash className="size-4" />
                                                                                </button>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                ),
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="p-2">
                                                    <button
                                                        type="button"
                                                        onClick={addItem}
                                                        className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-input bg-background py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                                                    >
                                                        <PlusCircle className="size-4" />{' '}
                                                        Agregar otro item
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                                    >
                                        <Save className="size-4" />
                                        Confirmar Alta Masiva
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Tab: BAJAS */}
                        {activeTab === 'BAJAS' && (
                            <BajasList
                                requests={bajaRequests}
                                userRole={userRole}
                            />
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
