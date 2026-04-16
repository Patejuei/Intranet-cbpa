import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FileDown, FileSpreadsheet, Loader2 } from 'lucide-react';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    route: string;
    type: 'pdf' | 'excel';
    includeOptions?: { id: string; label: string }[];
}

export function ReportModal({ isOpen, onClose, title, route, type, includeOptions }: ReportModalProps) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [options, setOptions] = useState<Record<string, boolean>>(
        includeOptions?.reduce((acc, opt) => ({ ...acc, [opt.id]: true }), {}) || {}
    );
    const [loading, setLoading] = useState(false);

    const handleDownload = () => {
        setLoading(true);
        const params = new URLSearchParams({
            start_date: startDate,
            end_date: endDate,
            ...Object.fromEntries(
                Object.entries(options)
                    .filter(([_, value]) => value)
                    .map(([key]) => [`include_${key}`, '1'])
            )
        });

        // Use window.location.href for direct download
        window.location.href = `${route}?${params.toString()}`;
        
        // Simulating a wait to close the loading state
        setTimeout(() => {
            setLoading(false);
            onClose();
        }, 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Seleccione el periodo y los datos que desea incluir en el reporte.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="start_date">Fecha Inicio</Label>
                            <Input
                                id="start_date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="end_date">Fecha Fin</Label>
                            <Input
                                id="end_date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {includeOptions && includeOptions.length > 0 && (
                        <div className="flex flex-col gap-3">
                            <Label>Datos a incluir</Label>
                            <div className="grid grid-cols-1 gap-2 border rounded-md p-3">
                                {includeOptions.map((opt) => (
                                    <div key={opt.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={opt.id}
                                            checked={options[opt.id]}
                                            onCheckedChange={(checked) => 
                                                setOptions(prev => ({ ...prev, [opt.id]: !!checked }))
                                            }
                                        />
                                        <Label htmlFor={opt.id} className="text-sm font-normal cursor-pointer">
                                            {opt.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button onClick={handleDownload} disabled={loading}>
                        {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : type === 'pdf' ? (
                            <FileDown className="mr-2 h-4 w-4" />
                        ) : (
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                        )}
                        Generar {type === 'pdf' ? 'PDF' : 'Excel'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
