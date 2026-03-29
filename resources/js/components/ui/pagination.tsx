import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export function Pagination({ links }: PaginationProps) {
    return (
        <div className="flex items-center justify-center gap-1 mt-6">
            {links.map((link, i) => {
                if (!link.url) {
                    const isPreviousDisabled = link.label.includes('Previous') || link.label.includes('Anterior') || link.label === 'pagination.previous' || link.label.includes('&laquo;');
                    const isNextDisabled = link.label.includes('Next') || link.label.includes('Siguiente') || link.label === 'pagination.next' || link.label.includes('&raquo;');
                    let emptyContent = <span dangerouslySetInnerHTML={{ __html: link.label }}></span>;
                    if (isPreviousDisabled) emptyContent = <ChevronLeft className="size-4" />;
                    if (isNextDisabled) emptyContent = <ChevronRight className="size-4" />;
                    return (
                        <Button
                            key={i}
                            variant="ghost"
                            size="icon"
                            className="pointer-events-none text-muted-foreground"
                            disabled
                        >
                            {emptyContent}
                        </Button>
                    );
                }

                const isPrevious = link.label.includes('Previous') || link.label.includes('Anterior') || link.label === 'pagination.previous' || link.label.includes('&laquo;');
                const isNext = link.label.includes('Next') || link.label.includes('Siguiente') || link.label === 'pagination.next' || link.label.includes('&raquo;');
                const isActive = link.active;
                
                let content = <span dangerouslySetInnerHTML={{ __html: link.label }}></span>;
                if (isPrevious) content = <ChevronLeft className="size-4" />;
                if (isNext) content = <ChevronRight className="size-4" />;

                return (
                    <Link key={i} href={link.url} preserveScroll>
                         <Button
                            variant={isActive ? "default" : "outline"}
                            size="icon"
                            className={cn("w-9 h-9", isActive && "pointer-events-none")}
                        >
                            {content}
                        </Button>
                    </Link>
                );
            })}
        </div>
    );
}
