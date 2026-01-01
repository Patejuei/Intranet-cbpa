import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    role?: string;
    permissions?: string[];
    [key: string]: unknown;
}

export interface Firefighter {
    id: number;
    general_registry_number: string | null;
    full_name: string;
    rut: string;
    company: string;
    created_at: string;
    updated_at: string;
}

export interface Material {
    id: number;
    product_name: string;
    brand: string | null;
    model: string | null;
    code: string | null;
    stock_quantity: number;
    company: string;
    category: string | null;
    created_at: string;
    updated_at: string;
}

export interface DeliveryItem {
    id: number;
    material_id: number;
    quantity: number;
    material?: Material;
}

export interface DeliveryCertificate {
    id: number;
    firefighter_id: number;
    user_id: number;
    date: string;
    observations: string | null;
    company: string;
    firefighter?: Firefighter;
    user?: User;
    items?: DeliveryItem[];
    created_at: string;
    updated_at: string;
}
