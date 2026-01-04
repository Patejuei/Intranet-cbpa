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
                    return (
                        <Button
                            key={i}
                            variant="ghost"
                            size="icon"
                            className="pointer-events-none text-muted-foreground"
                            disabled
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }}></span>
                        </Button>
                    );
                }

                // Previous/Next logic usually handled by Laravel labels (&laquo; Previous, Next &raquo;)
                // We can just render them or check labels.
                
                const isActive = link.active;
                
                return (
                    <Link key={i} href={link.url} preserveScroll>
                         <Button
                            variant={isActive ? "default" : "outline"}
                            size="icon"
                            className={cn("w-9 h-9", isActive && "pointer-events-none")}
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }}></span>
                        </Button>
                    </Link>
                );
            })}
        </div>
    );
}
