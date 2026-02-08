import { MaterialAcquisition } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { BadgeCheck, PackageCheck } from 'lucide-react';
import { useState } from 'react';
import InventoryEntryForm from './InventoryEntryForm';
import PurchaseForm from './PurchaseForm';

export default function AcquisitionsList({
    acquisitions,
}: {
    acquisitions: MaterialAcquisition[];
}) {
    const { userRole } = usePage<any>().props;
    const [receivingId, setReceivingId] = useState<number | null>(null);
    const [receptionItems, setReceptionItems] = useState<any>({}); // { [itemId]: code }

    const handleConfirmReception = (id: number) => {
        if (
            confirm(
                '¿Confirmar que el material ha llegado físicamente a secretaría?',
            )
        ) {
            router.post('/equipment/acquisitions/' + id + '/reception', {
                items: Object.entries(receptionItems).map(([itemId, code]) => ({
                    id: itemId,
                    inventory_code: code as string,
                })),
            });
            setReceivingId(null);
            setReceptionItems({});
        }
    };

    return (
        <div className="space-y-4">
            {acquisitions.length === 0 && (
                <p className="py-8 text-center text-muted-foreground">
                    No hay solicitudes activas.
                </p>
            )}

            {acquisitions.map((acq) => (
                <div
                    key={acq.id}
                    className="rounded-lg border bg-card p-4 shadow-sm"
                >
                    <div className="mb-4 flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold">
                                    {acq.company}
                                </span>
                                <span
                                    className={`rounded-full border px-2 py-0.5 text-xs ${getStatusColor(acq.status)}`}
                                >
                                    {getStatusLabel(acq.status)}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Solicitado el{' '}
                                {new Date(acq.created_at).toLocaleDateString()}
                            </p>
                            {acq.invoice_number && (
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Factura: {acq.invoice_number} (
                                    {acq.supplier_name})
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mb-4 space-y-2">
                        {acq.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex justify-between border-b pb-1 text-sm last:border-0 last:pb-0"
                            >
                                <span>
                                    {item.item_name}{' '}
                                    {item.details && (
                                        <span className="text-muted-foreground">
                                            ({item.details})
                                        </span>
                                    )}
                                </span>
                                <span className="font-medium">
                                    x{item.quantity}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Actions based on Role and Status */}
                    <div className="mt-3 border-t pt-3">
                        {/* Secretary: Request -> Purchase */}
                        {userRole === 'secretaria_adquisiciones' &&
                            acq.status === 'requested' && (
                                <div className="rounded bg-muted/30 p-3">
                                    <PurchaseForm
                                        acquisition={acq}
                                        onSuccess={() => {}}
                                    />
                                </div>
                            )}

                        {/* Secretary: Purchased -> Received */}
                        {userRole === 'secretaria_adquisiciones' &&
                            acq.status === 'purchased' && (
                                <>
                                    {receivingId === acq.id ? (
                                        <div className="mt-3 overflow-hidden rounded-lg border border-yellow-200 bg-yellow-50 shadow-sm dark:border-gray-700 dark:bg-slate-900">
                                            <div className="border-b border-yellow-100 bg-yellow-100/50 px-3 py-2 dark:border-gray-700 dark:bg-slate-800">
                                                <h4 className="flex items-center gap-2 text-sm font-semibold text-yellow-800 dark:text-gray-100">
                                                    <PackageCheck className="size-4" />
                                                    Recepción Física y
                                                    Etiquetado
                                                </h4>
                                            </div>
                                            <div className="p-4">
                                                <p className="mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Ingrese los códigos de
                                                    inventario para los ítems
                                                    recibidos.
                                                </p>
                                                <div className="space-y-3">
                                                    {acq.items.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                                                        >
                                                            <span className="flex-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                                {item.item_name}
                                                            </span>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                                    Cant:{' '}
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </span>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Código Inventario"
                                                                    className="h-9 w-40 rounded-md border border-gray-300 px-3 text-sm text-gray-900 shadow-sm focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                                                                    value={
                                                                        receptionItems[
                                                                            item
                                                                                .id
                                                                        ] || ''
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        setReceptionItems(
                                                                            {
                                                                                ...receptionItems,
                                                                                [item.id]:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            },
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-4 flex justify-end gap-3">
                                                    <button
                                                        onClick={() =>
                                                            setReceivingId(null)
                                                        }
                                                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleConfirmReception(
                                                                acq.id,
                                                            )
                                                        }
                                                        className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:outline-none dark:bg-yellow-700 dark:hover:bg-yellow-600"
                                                    >
                                                        Confirmar Recepción
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setReceivingId(acq.id);
                                            }}
                                            className="flex w-full items-center justify-center gap-2 rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm font-medium text-yellow-700 transition-colors hover:bg-yellow-100 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
                                        >
                                            <PackageCheck className="size-4" />{' '}
                                            Recepcionar Materiales
                                        </button>
                                    )}
                                </>
                            )}
                        {/* Inspector: Received -> Completed (Inventory Entry) */}
                        {userRole === 'inspector' &&
                            acq.status === 'received' && (
                                <InventoryEntryForm
                                    acquisition={acq}
                                    onSuccess={() => {}}
                                />
                            )}

                        {/* Completed View */}
                        {acq.status === 'completed' && (
                            <p className="flex items-center justify-center gap-1 text-center text-xs font-medium text-green-600">
                                <BadgeCheck className="size-4" /> Ingresado a
                                Inventario
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case 'requested':
            return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
        case 'purchased':
            return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'; // "Alta Pendiente"
        case 'received':
            return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
        case 'completed':
            return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
        default:
            return 'bg-gray-100 dark:bg-gray-800';
    }
}

function getStatusLabel(status: string) {
    switch (status) {
        case 'requested':
            return 'Solicitado';
        case 'purchased':
            return 'Comprado / Por Recibir';
        case 'received':
            return 'Recibido / En Espera de Ingreso';
        case 'completed':
            return 'Finalizado';
        default:
            return status;
    }
}
