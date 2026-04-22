interface SectionHeaderProps {
    title: string;
    icon: any;
    roles: string[];
}

export function SectionHeader({ title, icon: Icon, roles }: SectionHeaderProps) {
    return (
        <div className="mb-8 border-b pb-6">
            <div className="mb-2 flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Icon className="h-6 w-6" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            </div>
            <div className="flex flex-wrap gap-2">
                <span className="mr-2 text-sm text-muted-foreground">Alcance:</span>
                {roles.map((role) => (
                    <span
                        key={role}
                        className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground transition-colors"
                    >
                        {role}
                    </span>
                ))}
            </div>
        </div>
    );
}
