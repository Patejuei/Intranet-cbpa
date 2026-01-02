import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { User } from '@/types';
import { router, usePage } from '@inertiajs/react';

const companies = [
    'Primera Compañía',
    'Segunda Compañía',
    'Tercera Compañía',
    'Cuarta Compañía',
    'Quinta Compañía',
    'Séptima Compañía',
    'Octava Compañía',
    'Novena Compañía',
    'Décima Compañía',
    'Comandancia',
];

export default function CompanyFilter({ className }: { className?: string }) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const user = auth.user;

    // Only show for Comandancia or Admin
    if (user.company !== 'Comandancia' && user.role !== 'admin') {
        return null;
    }

    const currentCompany =
        new URLSearchParams(window.location.search).get('company') || 'all';

    const handleChange = (value: string) => {
        const url = new URL(window.location.href);
        if (value && value !== 'all') {
            url.searchParams.set('company', value);
        } else {
            url.searchParams.delete('company');
        }
        router.get(
            url.toString(),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <div className={className}>
            <Select value={currentCompany} onValueChange={handleChange}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por Compañía" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todas las Compañías</SelectItem>
                    {companies.map((c) => (
                        <SelectItem key={c} value={c}>
                            {c}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
