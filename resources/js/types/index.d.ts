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
    company?: string;
    permissions?: string[];
    [key: string]: unknown;
}

export interface Firefighter {
    id: number;
    general_registry_number: string | null;
    full_name: string;
    rut: string;
    company: string;
    email?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Material {
    id: number;
    product_name: string;
    brand: string | null;
    model: string | null;
    code: string | null;
    serial_number?: string | null;
    stock_quantity: number;
    company: string;
    category: string | null;
    document_path?: string | null;
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
    delivery_items: DeliveryItem[];
    created_at: string;
    updated_at: string;
}

export interface Vehicle {
    id: number;
    name: string;
    status: string;
    company: string;
}

export interface VehicleIssue {
    id: number;
    description: string;
    severity: string;
    status: string;
    vehicle: Vehicle;
    created_at: string;
}

export interface ReceptionItem {
    id: number;
    material_id: number;
    quantity: number;
    material?: Material;
}

export interface ReceptionCertificate {
    id: number;
    firefighter_id: number;
    user_id: number;
    date: string;
    observations: string | null;
    company: string;
    correlative: number;
    firefighter?: Firefighter;
    user?: User;
    reception_items?: ReceptionItem[]; // Note: relationship is often 'items' in Model but checks what Controller returns
    items?: ReceptionItem[]; // Controller returns 'items'
    created_at: string;
    updated_at: string;
}

export interface Pagination<T> {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}
