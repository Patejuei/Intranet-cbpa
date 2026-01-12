import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Material } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface MaterialFormProps {
    material?: Material | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function MaterialForm({
    material,
    onSuccess,
    onCancel,
}: MaterialFormProps) {
    const isEditing = !!material;

    const { data, setData, post, processing, errors, reset } = useForm({
        _method: isEditing ? 'PUT' : 'POST',
        product_name: material?.product_name || '',
        brand: material?.brand || '',
        model: material?.model || '',
        stock_quantity: material?.stock_quantity || 0,
        company: material?.company || 'Comandancia',
        category: material?.category || 'Sin Categoría',
        serial_number: material?.serial_number || '',
        document_path: null as File | null,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();

        const url = isEditing ? `/inventory/${material?.id}` : '/inventory';

        // Use post for both, but _method: PUT handles the update logic on backend
        // This is required for file uploads to work with PUT in Laravel
        post(url, {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onSuccess();
            },
        });
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <form onSubmit={submit} className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="company">Compañía</Label>
                <Select
                    value={data.company}
                    onValueChange={(value) => setData('company', value)}
                >
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
                        <SelectItem value="Cuarta Compañía">
                            Cuarta Compañía
                        </SelectItem>
                        <SelectItem value="Quinta Compañía">
                            Quinta Compañía
                        </SelectItem>
                        <SelectItem value="Sexta Compañía">
                            Sexta Compañía
                        </SelectItem>
                        <SelectItem value="Séptima Compañía">
                            Séptima Compañía
                        </SelectItem>
                        <SelectItem value="Octava Compañía">
                            Octava Compañía
                        </SelectItem>
                        <SelectItem value="Novena Compañía">
                            Novena Compañía
                        </SelectItem>
                        <SelectItem value="Brigada Juvenil">
                            Brigada Juvenil
                        </SelectItem>
                        <SelectItem value="Comandancia">Comandancia</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.company} className="mt-2" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="product_name">Nombre del Producto</Label>
                <Input
                    id="product_name"
                    value={data.product_name}
                    onChange={(e) => setData('product_name', e.target.value)}
                    required
                    aria-invalid={!!errors.product_name}
                />
                <InputError message={errors.product_name} className="mt-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Input
                        id="brand"
                        value={data.brand}
                        onChange={(e) => setData('brand', e.target.value)}
                        aria-invalid={!!errors.brand}
                    />
                    <InputError message={errors.brand} className="mt-2" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="model">Modelo</Label>
                    <Input
                        id="model"
                        value={data.model}
                        onChange={(e) => setData('model', e.target.value)}
                        aria-invalid={!!errors.model}
                    />
                    <InputError message={errors.model} className="mt-2" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="serial_number">
                        N° de Serie de Fabricante
                    </Label>
                    <Input
                        id="serial_number"
                        value={data.serial_number}
                        onChange={(e) =>
                            setData('serial_number', e.target.value)
                        }
                        aria-invalid={!!errors.serial_number}
                    />
                    <InputError
                        message={errors.serial_number}
                        className="mt-2"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="stock_quantity">Cantidad Inicial</Label>
                    <Input
                        id="stock_quantity"
                        type="number"
                        min="0"
                        value={data.stock_quantity}
                        onChange={(e) =>
                            setData('stock_quantity', parseInt(e.target.value))
                        }
                        required
                        aria-invalid={!!errors.stock_quantity}
                    />
                    <InputError
                        message={errors.stock_quantity}
                        className="mt-2"
                    />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="category">Categoría</Label>
                <Select
                    value={data.category}
                    onValueChange={(value) => setData('category', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccione Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Sin Categoría">
                            Sin Categoría
                        </SelectItem>
                        <SelectItem value="Equipos de Protección Personal">
                            Equipos de Protección Personal
                        </SelectItem>
                        <SelectItem value="Material de Extinción">
                            Material de Extinción
                        </SelectItem>
                        <SelectItem value="Herramientas de Rescate">
                            Herramientas de Rescate
                        </SelectItem>
                        <SelectItem value="Material Médico">
                            Material Médico
                        </SelectItem>
                        <SelectItem value="Telecomunicaciones">
                            Telecomunicaciones
                        </SelectItem>
                        <SelectItem value="Entrada Forzada">
                            Entrada Forzada
                        </SelectItem>
                        <SelectItem value="Escalas">Escalas</SelectItem>
                        <SelectItem value="Ventilación">Ventilación</SelectItem>
                        <SelectItem value="Riesgos Eléctricos">
                            Riesgos Eléctricos
                        </SelectItem>
                        <SelectItem value="Materiales Peligrosos">
                            Materiales Peligrosos
                        </SelectItem>
                        <SelectItem value="Seguridad">Seguridad</SelectItem>
                        <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={errors.category} className="mt-2" />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="document_path">
                    Documento de Alta (Opcional)
                </Label>
                <Input
                    id="document_path"
                    type="file"
                    onChange={(e) =>
                        setData(
                            'document_path',
                            e.target.files ? e.target.files[0] : null,
                        )
                    }
                    className="cursor-pointer"
                    aria-invalid={!!errors.document_path}
                />
                <p className="text-[0.8rem] text-muted-foreground">
                    Adjuntar factura, guía de despacho o acta de alta.
                </p>
                <InputError message={errors.document_path} className="mt-2" />
            </div>

            <DialogFooter>
                {hasErrors && (
                    <div className="mr-auto text-sm text-red-500">
                        Hay errores en el formulario. Por favor revise los
                        campos.
                    </div>
                )}
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={processing}>
                    {isEditing ? 'Actualizar' : 'Guardar'}
                </Button>
            </DialogFooter>
        </form>
    );
}
