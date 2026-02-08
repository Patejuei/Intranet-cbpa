import { useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { FormEventHandler } from 'react';

declare let route: any;

export default function RequestForm({ onSuccess }: { onSuccess: () => void }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        items: [{ item_name: '', quantity: 1, details: '' }],
    });

    const addItem = () => {
        setData('items', [
            ...data.items,
            { item_name: '', quantity: 1, details: '' },
        ]);
    };

    const removeItem = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setData('items', newItems);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('equipment.request'), {
            onSuccess: () => {
                reset();
                onSuccess();
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="space-y-4">
                {data.items.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-4 rounded-md border bg-muted/20 p-3"
                    >
                        <div className="flex-1">
                            <label className="text-xs font-medium">Ítem</label>
                            <input
                                type="text"
                                className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                value={item.item_name}
                                onChange={(e) =>
                                    updateItem(
                                        index,
                                        'item_name',
                                        e.target.value,
                                    )
                                }
                                placeholder="Ej: Casco F1"
                                required
                            />
                        </div>
                        <div className="w-20">
                            <label className="text-xs font-medium">Cant.</label>
                            <input
                                type="number"
                                min="1"
                                className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                value={item.quantity}
                                onChange={(e) =>
                                    updateItem(
                                        index,
                                        'quantity',
                                        parseInt(e.target.value),
                                    )
                                }
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-medium">
                                Detalle
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                                value={item.details}
                                onChange={(e) =>
                                    updateItem(index, 'details', e.target.value)
                                }
                                placeholder="Opcional"
                            />
                        </div>
                        {data.items.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="mt-5 rounded p-1 text-destructive hover:bg-destructive/10"
                            >
                                <Trash2 className="size-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
                <Plus className="size-3" /> Agregar otro ítem
            </button>

            <div className="flex justify-end gap-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                    Enviar Solicitud
                </button>
            </div>
        </form>
    );
}
