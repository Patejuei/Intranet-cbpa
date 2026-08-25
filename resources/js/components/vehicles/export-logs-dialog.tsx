import * as React from 'react';
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
    Calendar as CalendarIcon,
    Car,
    Download,
    FileSpreadsheet,
    Layers,
} from 'lucide-react';
import { format } from 'date-fns';

export interface VehicleOption {
    id: number;
    name: string;
    company?: string | null;
}

interface ExportLogsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vehicles: VehicleOption[];
    currentMovementKey?: string;
}

const MONTHS = [
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
];

export function ExportLogsDialog({
    open,
    onOpenChange,
    vehicles,
    currentMovementKey,
}: ExportLogsDialogProps) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = (currentDate.getMonth() + 1).toString();

    // Generate years from currentYear + 1 down to 2020
    const availableYears = React.useMemo(() => {
        const years: string[] = [];
        for (let y = currentYear + 1; y >= 2020; y--) {
            years.push(y.toString());
        }
        return years;
    }, [currentYear]);

    // Selected vehicle IDs
    const [selectedVehicles, setSelectedVehicles] = useState<number[]>([]);

    // Period selection
    const [periodType, setPeriodType] = useState<'month' | 'year' | 'custom'>('month');
    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
    const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
    const [dateFrom, setDateFrom] = useState<string>(
        format(new Date(currentYear, currentDate.getMonth(), 1), 'yyyy-MM-dd')
    );
    const [dateTo, setDateTo] = useState<string>(format(currentDate, 'yyyy-MM-dd'));

    // Initialize or reset vehicle selection when modal opens
    useEffect(() => {
        if (open) {
            setSelectedVehicles(vehicles.map((v) => v.id));
        }
    }, [open, vehicles]);

    const handleToggleAllVehicles = () => {
        if (selectedVehicles.length === vehicles.length) {
            setSelectedVehicles([]);
        } else {
            setSelectedVehicles(vehicles.map((v) => v.id));
        }
    };

    const handleToggleVehicle = (id: number) => {
        setSelectedVehicles((prev) =>
            prev.includes(id) ? prev.filter((vId) => vId !== id) : [...prev, id]
        );
    };

    const handleExport = (exportAll = false) => {
        const params = new URLSearchParams();

        if (exportAll) {
            params.append('export_all', '1');
        } else {
            if (selectedVehicles.length > 0) {
                params.append('vehicle_ids', selectedVehicles.join(','));
            }

            params.append('period_type', periodType);

            if (periodType === 'month') {
                params.append('month', selectedMonth);
                params.append('year', selectedYear);
            } else if (periodType === 'year') {
                params.append('year', selectedYear);
            } else if (periodType === 'custom') {
                if (dateFrom) params.append('date_from', dateFrom);
                if (dateTo) params.append('date_to', dateTo);
            }
        }

        if (currentMovementKey) {
            params.append('movement_key', currentMovementKey);
        }

        window.location.href = `/vehicles/logs/export?${params.toString()}`;
        onOpenChange(false);
    };

    const allSelected = vehicles.length > 0 && selectedVehicles.length === vehicles.length;
    const isExportDisabled = selectedVehicles.length === 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
                        <DialogTitle>Exportar Bitácoras a Excel</DialogTitle>
                    </div>
                    <DialogDescription>
                        Seleccione los vehículos y el periodo temporal para generar el reporte en formato Excel (.xlsx).
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-2">
                    {/* Section 1: Vehículos */}
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Car className="h-4 w-4 text-muted-foreground" />
                                <Label className="font-semibold text-sm">
                                    Vehículos a exportar
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                    {selectedVehicles.length} de {vehicles.length} seleccionados
                                </Badge>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs px-2"
                                    onClick={handleToggleAllVehicles}
                                >
                                    {allSelected ? 'Desmarcar todos' : 'Marcar todos'}
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-md border p-2 bg-muted/20">
                            <ScrollArea className="h-36 pr-3">
                                {vehicles.length === 0 ? (
                                    <p className="text-xs text-muted-foreground py-4 text-center">
                                        No hay vehículos disponibles para exportar.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                        {vehicles.map((v) => {
                                            const isChecked = selectedVehicles.includes(v.id);
                                            return (
                                                <div
                                                    key={v.id}
                                                    onClick={() => handleToggleVehicle(v.id)}
                                                    className={`flex items-center space-x-2.5 rounded-md border p-2 text-xs transition-colors cursor-pointer select-none ${
                                                        isChecked
                                                            ? 'border-primary/50 bg-primary/5 text-foreground'
                                                            : 'border-transparent hover:bg-muted/60 text-muted-foreground'
                                                    }`}
                                                >
                                                    <Checkbox
                                                        checked={isChecked}
                                                        onCheckedChange={() => handleToggleVehicle(v.id)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="font-medium truncate text-foreground">
                                                            {v.name}
                                                        </span>
                                                        {v.company && (
                                                            <span className="text-[10px] text-muted-foreground truncate">
                                                                {v.company}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                        {isExportDisabled && (
                            <p className="text-xs text-destructive">
                                Seleccione al menos un vehículo para la exportación por filtro.
                            </p>
                        )}
                    </div>

                    <Separator />

                    {/* Section 2: Periodo */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <Label className="font-semibold text-sm">
                                Periodo a exportar
                            </Label>
                        </div>

                        <RadioGroup
                            value={periodType}
                            onValueChange={(val: 'month' | 'year' | 'custom') => setPeriodType(val)}
                            className="grid grid-cols-3 gap-2"
                        >
                            <label
                                className={`flex flex-col items-center justify-between rounded-md border p-2.5 text-center text-xs font-medium cursor-pointer transition-all hover:bg-muted/50 ${
                                    periodType === 'month'
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-muted text-muted-foreground'
                                }`}
                            >
                                <RadioGroupItem value="month" className="sr-only" />
                                <span>Por Mes</span>
                            </label>

                            <label
                                className={`flex flex-col items-center justify-between rounded-md border p-2.5 text-center text-xs font-medium cursor-pointer transition-all hover:bg-muted/50 ${
                                    periodType === 'year'
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-muted text-muted-foreground'
                                }`}
                            >
                                <RadioGroupItem value="year" className="sr-only" />
                                <span>Por Año</span>
                            </label>

                            <label
                                className={`flex flex-col items-center justify-between rounded-md border p-2.5 text-center text-xs font-medium cursor-pointer transition-all hover:bg-muted/50 ${
                                    periodType === 'custom'
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-muted text-muted-foreground'
                                }`}
                            >
                                <RadioGroupItem value="custom" className="sr-only" />
                                <span>Personalizado</span>
                            </label>
                        </RadioGroup>

                        {/* Options based on selected period type */}
                        <div className="rounded-md border p-3 bg-muted/10">
                            {periodType === 'month' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Mes</Label>
                                        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                            <SelectTrigger className="h-9">
                                                <SelectValue placeholder="Seleccione mes" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {MONTHS.map((m) => (
                                                    <SelectItem key={m.value} value={m.value}>
                                                        {m.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs">Año</Label>
                                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                                            <SelectTrigger className="h-9">
                                                <SelectValue placeholder="Seleccione año" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableYears.map((year) => (
                                                    <SelectItem key={year} value={year}>
                                                        {year}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}

                            {periodType === 'year' && (
                                <div className="space-y-1.5 max-w-xs">
                                    <Label className="text-xs">Año a exportar</Label>
                                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                                        <SelectTrigger className="h-9">
                                            <SelectValue placeholder="Seleccione año" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableYears.map((year) => (
                                                <SelectItem key={year} value={year}>
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {periodType === 'custom' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="export_date_from" className="text-xs">
                                            Fecha Desde
                                        </Label>
                                        <Input
                                            id="export_date_from"
                                            type="date"
                                            className="h-9"
                                            value={dateFrom}
                                            onChange={(e) => setDateFrom(e.target.value)}
                                            onClick={(e) => e.currentTarget.showPicker?.()}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="export_date_to" className="text-xs">
                                            Fecha Hasta
                                        </Label>
                                        <Input
                                            id="export_date_to"
                                            type="date"
                                            className="h-9"
                                            value={dateTo}
                                            onChange={(e) => setDateTo(e.target.value)}
                                            onClick={(e) => e.currentTarget.showPicker?.()}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleExport(true)}
                        className="w-full sm:w-auto"
                    >
                        <Layers className="h-4 w-4 mr-1.5 text-muted-foreground" />
                        Exportar Todo
                    </Button>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            className="w-full sm:w-auto"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            disabled={isExportDisabled}
                            onClick={() => handleExport(false)}
                            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            <Download className="h-4 w-4 mr-1.5" />
                            Exportar
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
