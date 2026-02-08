import { MaterialAcquisition } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

declare let route: any;

export default function PurchaseForm({
    acquisition,
    onSuccess,
}: {
    acquisition: MaterialAcquisition;
    onSuccess: () => void;
}) {
    const { data, setData, post, processing, errors } = useForm({
        invoice_number: '',
        invoice_date: '',
        supplier_rut: '',
        supplier_name: '',
        document: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('equipment.purchase', acquisition.id), {
            onSuccess: onSuccess,
        });
    };

    return (
        <form onSubmit={submit} className="space-y-3">
            <h3 className="text-sm font-semibold">
                Ingresar Detalles de Compra
            </h3>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-medium">Nº Factura</label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                        value={data.invoice_number}
                        onChange={(e) =>
                            setData('invoice_number', e.target.value)
                        }
                        required
                    />
                </div>
                <div>
                    <label className="text-xs font-medium">Fecha Factura</label>
                    <input
                        type="date"
                        className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                        value={data.invoice_date}
                        onChange={(e) =>
                            setData('invoice_date', e.target.value)
                        }
                        required
                    />
                </div>
                <div>
                    <label className="text-xs font-medium">RUT Proveedor</label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                        value={data.supplier_rut}
                        onChange={(e) =>
                            setData('supplier_rut', e.target.value)
                        }
                        required
                    />
                </div>
                <div>
                    <label className="text-xs font-medium">
                        Nombre Proveedor
                    </label>
                    <input
                        type="text"
                        className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                        value={data.supplier_name}
                        onChange={(e) =>
                            setData('supplier_name', e.target.value)
                        }
                        required
                    />
                </div>
            </div>
            <div>
                <label className="text-xs font-medium">
                    Documento (PDF/Imagen)
                </label>
                <input
                    type="file"
                    className="w-full text-sm"
                    onChange={(e) =>
                        setData(
                            'document',
                            e.target.files ? e.target.files[0] : null,
                        )
                    }
                    accept=".pdf,.jpg,.png"
                />
            </div>
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-md bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
                >
                    Confirmar Compra
                </button>
            </div>
        </form>
    );
}
