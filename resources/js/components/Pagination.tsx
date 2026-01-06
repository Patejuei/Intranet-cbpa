import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export default function Pagination({ links }: PaginationProps) {
    if (links.length <= 3) return null; // Don't show if only Prev, 1 page, Next (and 1 page is active or not) - usually Laravel returns 3 links for 1 page.

    return (
        <div className="flex flex-wrap items-center justify-center gap-1 py-4">
            {links.map((link, key) => {
                let label = link.label;
                if (label === '&laquo; Previous')
                    return (
                        <Button
                            key={key}
                            variant="outline"
                            size="icon"
                            asChild
                            disabled={!link.url}
                        >
                            {link.url ? (
                                <Link
                                    href={link.url}
                                    preserveScroll
                                    preserveState
                                >
                                    <ChevronLeft className="size-4" />
                                </Link>
                            ) : (
                                <span>
                                    <ChevronLeft className="size-4" />
                                </span>
                            )}
                        </Button>
                    );
                if (label === 'Next &raquo;')
                    return (
                        <Button
                            key={key}
                            variant="outline"
                            size="icon"
                            asChild
                            disabled={!link.url}
                        >
                            {link.url ? (
                                <Link
                                    href={link.url}
                                    preserveScroll
                                    preserveState
                                >
                                    <ChevronRight className="size-4" />
                                </Link>
                            ) : (
                                <span>
                                    <ChevronRight className="size-4" />
                                </span>
                            )}
                        </Button>
                    );

                return (
                    <Button
                        key={key}
                        variant={link.active ? 'default' : 'outline'}
                        asChild={!!link.url}
                        disabled={!link.url}
                        className={!link.url ? 'pointer-events-none' : ''}
                    >
                        {link.url ? (
                            <Link href={link.url} preserveScroll preserveState>
                                <span
                                    dangerouslySetInnerHTML={{ __html: label }}
                                />
                            </Link>
                        ) : (
                            <span dangerouslySetInnerHTML={{ __html: label }} />
                        )}
                    </Button>
                );
            })}
        </div>
    );
}
