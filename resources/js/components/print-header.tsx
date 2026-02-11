import { formatDate } from '@/lib/utils';

interface PrintHeaderProps {
    title: string;
    id: number;
    date?: string;
}

export default function PrintHeader({
    title,
    id,
    date = new Date().toISOString(),
}: PrintHeaderProps) {
    return (
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
            <div className="flex items-center gap-4">
                <img
                    src="/images/cbpa_logo.jpg"
                    alt="Logo CBPA"
                    className="h-16 w-16 object-contain"
                />
                <div>
                    <h1 className="text-2xl font-bold tracking-wider uppercase">
                        Cuerpo de Bomberos Puente Alto
                    </h1>
                    <h2 className="text-lg font-semibold text-slate-700 uppercase">
                        Depto. Material Mayor
                    </h2>
                </div>
            </div>
            <div className="text-right">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="font-mono text-lg">
                    #{String(id).padStart(6, '0')}
                </p>
                <p className="text-sm text-slate-600">{formatDate(date)}</p>
            </div>
        </div>
    );
}
