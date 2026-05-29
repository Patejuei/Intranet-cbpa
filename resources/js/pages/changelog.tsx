import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitCommit, Calendar, History } from 'lucide-react';

interface ChangelogEntry {
    version: string;
    date: string;
    changes: string[];
}

export default function Changelog({ changelogEntries }: { changelogEntries: ChangelogEntry[] }) {
    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Panel Principal', href: '/dashboard' },
                { title: 'Changelog', href: '/changelog' },
            ]}
        >
            <Head title="Registro de Cambios (Changelog)" />

            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 md:p-8">
                <div>
                    <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
                        <History className="h-8 w-8 text-primary" />
                        Registro de Cambios
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Mantente al día con las últimas actualizaciones, mejoras y correcciones de la Intranet.
                    </p>
                </div>

                <div className="relative mt-4 border-l border-muted-foreground/20 pl-6 ml-4 space-y-12">
                    {changelogEntries.map((entry, index) => (
                        <div key={entry.version} className="relative">
                            {/* Timeline Dot */}
                            <div className="absolute -left-[35px] mt-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-background border-2 border-primary">
                                {index === 0 && (
                                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                )}
                            </div>

                            <Card className={index === 0 ? "border-primary/50 shadow-md" : "shadow-sm"}>
                                <CardHeader className="pb-3">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <CardTitle className="text-xl">
                                                Versión {entry.version}
                                            </CardTitle>
                                            {index === 0 && (
                                                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                                                    Actual
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            {entry.date}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {entry.changes.map((change, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm">
                                                <GitCommit className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                                <span className="leading-relaxed">{change}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
