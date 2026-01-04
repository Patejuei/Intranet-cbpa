import Pagination from '@/components/Pagination';
import { DatePicker } from '@/components/ui/date-picker';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Activity, Battery, Calendar, ClipboardList, Save } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Log {
    id: number;
    change_date: string;
    equipment_id: string;
    equipment_type: string;
    responsible_name: string;
    observations: string;
    next_change_date: string;
    created_at: string;
    user: { name: string };
}

import CompanyFilter from '@/components/app/CompanyFilter';

interface PageProps {
    logs: {
        data: Log[];
        links: any[];
    };
}

export default function BatteryIndex({ logs }: PageProps) {
    const [activeTab, setActiveTab] = useState<'log' | 'new'>('log');

    const { data, setData, post, processing, reset, errors } = useForm({
        change_date: new Date().toISOString().split('T')[0],
        equipment_id: '',
        equipment_type: 'Equipo de Respiracion',
        responsible_name: '',
        observations: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/batteries', {
            onSuccess: () => {
                reset();
                setActiveTab('log');
            },
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Baterías', href: '/batteries' },
            ]}
        >
            <Head title="Control de Baterías" />

            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    {/* Custom Tabs */}
                    <div className="flex w-full space-x-1 rounded-xl bg-muted p-1 md:w-fit">
                        <button
                            onClick={() => setActiveTab('log')}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                                activeTab === 'log'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                            }`}
                        >
                            <ClipboardList className="size-4" />
                            Bitácora
                        </button>
                        <button
                            onClick={() => setActiveTab('new')}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                                activeTab === 'new'
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
                            }`}
                        >
                            <Battery className="size-4" />
                            Nuevo Registro
                        </button>
                    </div>

                    <CompanyFilter />
                </div>

                {activeTab === 'new' ? (
                    <div className="max-w-2xl rounded-xl border bg-card p-6 shadow-sm">
                        <div className="mb-6 flex items-center gap-2 text-primary">
                            <Battery className="size-5" />
                            <h2 className="text-lg font-semibold text-foreground">
                                Registrar Cambio de Batería
                            </h2>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Fecha de Cambio
                                    </label>
                                    <DatePicker
                                        date={data.change_date}
                                        setDate={(d) =>
                                            setData(
                                                'change_date',
                                                d
                                                    ? format(d, 'yyyy-MM-dd')
                                                    : '',
                                            )
                                        }
                                    />
                                    {errors.change_date && (
                                        <p className="mt-1 text-xs text-destructive">
                                            {errors.change_date}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        ID del Equipo
                                    </label>
                                    <input
                                        type="text"
                                        value={data.equipment_id}
                                        onChange={(e) =>
                                            setData(
                                                'equipment_id',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                        placeholder="Ej: ERA-01"
                                    />
                                    {errors.equipment_id && (
                                        <p className="mt-1 text-xs text-destructive">
                                            {errors.equipment_id}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Tipo de Equipo
                                    </label>
                                    <select
                                        value={data.equipment_type}
                                        onChange={(e) =>
                                            setData(
                                                'equipment_type',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                    >
                                        <option value="Equipo de Respiracion">
                                            Equipo de Respiración
                                        </option>
                                        <option value="Toma presion">
                                            Toma Presión
                                        </option>
                                        <option value="Saturometro">
                                            Saturómetro
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Responsable del Cambio
                                    </label>
                                    <input
                                        type="text"
                                        value={data.responsible_name}
                                        onChange={(e) =>
                                            setData(
                                                'responsible_name',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                        placeholder="Nombre del Bombero"
                                    />
                                    {errors.responsible_name && (
                                        <p className="mt-1 text-xs text-destructive">
                                            {errors.responsible_name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">
                                    Observaciones
                                </label>
                                <textarea
                                    value={data.observations}
                                    onChange={(e) =>
                                        setData('observations', e.target.value)
                                    }
                                    className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                    placeholder="Detalles adicionales..."
                                />
                            </div>

                            <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                                <p className="flex items-center gap-2">
                                    <Calendar className="size-4" />
                                    Próximo cambio programado:{' '}
                                    <span className="font-semibold text-foreground">
                                        6 meses después de la fecha seleccionada
                                    </span>
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                                <Save className="size-4" />
                                Registrar Cambio
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="rounded-xl border bg-card shadow-sm">
                        <div className="border-b p-4">
                            <h2 className="flex items-center gap-2 text-lg font-semibold">
                                <Activity className="size-5 text-primary" />
                                Bitácora de Cambios
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">
                                            Fecha Cambio
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Equipo
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Tipo
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Responsable
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Próx. Cambio
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Observaciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {logs.data.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-4 py-8 text-center text-muted-foreground"
                                            >
                                                No hay registros en la bitácora.
                                            </td>
                                        </tr>
                                    ) : (
                                        logs.data.map((log) => (
                                            <tr
                                                key={log.id}
                                                className="hover:bg-muted/30"
                                            >
                                                <td className="px-4 py-3 font-medium">
                                                    {new Date(
                                                        log.change_date,
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {log.equipment_id}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                                        {log.equipment_type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {log.responsible_name}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="flex items-center gap-1 font-medium text-orange-600">
                                                        <Calendar className="size-3" />
                                                        {new Date(
                                                            log.next_change_date,
                                                        ).toLocaleDateString(
                                                            'es-ES',
                                                            {
                                                                day: '2-digit',
                                                                month: '2-digit',
                                                                year: 'numeric',
                                                            },
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground italic">
                                                    {log.observations || '-'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination links={logs.links} />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
