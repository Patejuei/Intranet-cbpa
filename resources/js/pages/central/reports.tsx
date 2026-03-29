import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, subMonths, startOfMonth, endOfMonth, startOfYear, endOfYear, setMonth, setYear } from 'date-fns';
import { CalendarDays, FileSpreadsheet, FileText, Filter, Search } from 'lucide-react';

interface ReportItem {
    user_name: string;
    vehicle_name: string;
    start_time: string;
    end_time: string;
    duration_human: string;
    is_primary: boolean;
}

export default function CentralReports({
    reportData,
    filters,
}: {
    reportData: ReportItem[];
    filters: { start_date: string; end_date: string };
}) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);

    const applyFilter = (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
        router.get('/central/reports', { start_date: start, end_date: end }, { preserveState: true });
    };

    const handleManualFilter = () => {
        applyFilter(startDate, endDate);
    };

    const setPreset = (type: 'current_month' | 'last_quarter' | 'current_year') => {
        const now = new Date();
        let start, end;

        if (type === 'current_month') {
            start = startOfMonth(now);
            end = endOfMonth(now);
        } else if (type === 'last_quarter') {
            start = startOfMonth(subMonths(now, 2));
            end = endOfMonth(now);
        } else if (type === 'current_year') {
            start = startOfYear(now);
            end = endOfYear(now);
        }

        if (start && end) {
            applyFilter(format(start, 'yyyy-MM-dd'), format(end, 'yyyy-MM-dd'));
        }
    };

    const handleMonthChange = (monthIdx: string) => {
        const now = new Date();
        const date = setMonth(now, parseInt(monthIdx));
        applyFilter(format(startOfMonth(date), 'yyyy-MM-dd'), format(endOfMonth(date), 'yyyy-MM-dd'));
    };

    const handleYearChange = (year: string) => {
        const now = new Date();
        const date = setYear(now, parseInt(year));
        applyFilter(format(startOfYear(date), 'yyyy-MM-dd'), format(endOfYear(date), 'yyyy-MM-dd'));
    };

    const handleExport = (formatType: 'excel' | 'pdf') => {
        const url = `/central/reports/export-${formatType}?start_date=${startDate}&end_date=${endDate}`;
        window.open(url, '_blank');
    };

    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

    return (
        <AppLayout 
            breadcrumbs={[
                { title: 'Central de Alarmas', href: '/central/duty' },
                { title: 'Reportes', href: '/central/reports' }
            ]}
        >
            <Head title="Reportes de Conductores" />
            <div className="flex h-full flex-col gap-4 p-4">
                <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                    <div>
                        <h1 className="text-xl font-bold">Reportes de Tiempos</h1>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
                            <FileSpreadsheet className="mr-2 h-3.5 w-3.5 text-green-600" />
                            Excel
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                            <FileText className="mr-2 h-3.5 w-3.5 text-red-600" />
                            PDF
                        </Button>
                    </div>
                </div>

                <Card className="border-primary/10 bg-primary/5 shadow-none">
                    <CardContent className="p-3">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            {/* Filtros rápidos compactos */}
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-1.5 mr-2 text-primary font-semibold text-sm">
                                    <Filter className="h-4 w-4" />
                                    <span>Rápidos:</span>
                                </div>
                                <Button variant="secondary" size="sm" className="h-7 px-3 text-xs" onClick={() => setPreset('current_month')}>
                                    Mes
                                </Button>
                                <Button variant="secondary" size="sm" className="h-7 px-3 text-xs" onClick={() => setPreset('last_quarter')}>
                                    Trimestre
                                </Button>
                                <Button variant="secondary" size="sm" className="h-7 px-3 text-xs" onClick={() => setPreset('current_year')}>
                                    Año
                                </Button>
                                
                                <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

                                <Select onValueChange={handleMonthChange}>
                                    <SelectTrigger className="h-7 w-[110px] bg-background text-xs">
                                        <SelectValue placeholder="Ir a Mes..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {months.map((m, i) => (
                                            <SelectItem key={i} value={i.toString()} className="text-xs">{m}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select onValueChange={handleYearChange}>
                                    <SelectTrigger className="h-7 w-[85px] bg-background text-xs">
                                        <SelectValue placeholder="Año..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map(y => (
                                            <SelectItem key={y} value={y} className="text-xs">{y}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Manual */}
                            <div className="flex flex-wrap items-center gap-2 border-t pt-3 lg:border-t-0 lg:pt-0">
                                <div className="flex items-center gap-1.5 mr-2 text-muted-foreground font-semibold text-sm">
                                    <CalendarDays className="h-4 w-4" />
                                    <span>Personalizado:</span>
                                </div>
                                <Input 
                                    type="date" 
                                    value={startDate} 
                                    onChange={(e) => setStartDate(e.target.value)} 
                                    className="h-7 w-[120px] bg-background p-1 text-xs" 
                                />
                                <span className="text-muted-foreground">a</span>
                                <Input 
                                    type="date" 
                                    value={endDate} 
                                    onChange={(e) => setEndDate(e.target.value)} 
                                    className="h-7 w-[120px] bg-background p-1 text-xs" 
                                />
                                <Button size="sm" className="h-7 px-3 text-xs" onClick={handleManualFilter}>
                                    <Search className="mr-1.5 h-3 w-3" />
                                    Filtrar
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader className="py-3 px-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base text-muted-foreground">Resultados del Período</CardTitle>
                            <span className="text-xs font-medium">
                                {format(new Date(startDate + 'T12:00:00'), 'dd/MM/yyyy')} - {format(new Date(endDate + 'T12:00:00'), 'dd/MM/yyyy')}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="border-t">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30">
                                        <TableHead className="h-9 px-4 text-xs">Conductor</TableHead>
                                        <TableHead className="h-9 px-4 text-xs">Vehículo</TableHead>
                                        <TableHead className="h-9 px-4 text-xs font-mono">Inicio</TableHead>
                                        <TableHead className="h-9 px-4 text-xs font-mono">Término</TableHead>
                                        <TableHead className="h-9 px-4 text-xs">Tipo</TableHead>
                                        <TableHead className="h-9 px-4 text-right text-xs">Horas Totales</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportData.map((item, idx) => (
                                        <TableRow key={idx} className="hover:bg-muted/10 transition-colors text-xs sm:text-sm">
                                            <TableCell className="py-2 px-4 font-medium">{item.user_name}</TableCell>
                                            <TableCell className="py-2 px-4">{item.vehicle_name}</TableCell>
                                            <TableCell className="py-2 px-4 font-mono text-muted-foreground text-[11px]">{item.start_time}</TableCell>
                                            <TableCell className="py-2 px-4 font-mono text-muted-foreground text-[11px]">{item.end_time}</TableCell>
                                            <TableCell className="py-2 px-4">
                                                {item.is_primary ? (
                                                    <Badge className="h-5 px-1.5 text-[10px] bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border-none">Primario</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="h-5 px-1.5 text-[10px] text-muted-foreground font-normal">Secundario</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="py-2 px-4 text-right">
                                                <span className="font-mono font-bold text-primary">{item.duration_human}</span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {reportData.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-12 text-center text-muted-foreground italic text-sm">
                                                Sin registros para las fechas seleccionadas.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
