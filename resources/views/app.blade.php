<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark'=> ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Intranet del Cuerpo de Bomberos de Puente Alto - Gestión de vehículos, personal y emergencias.">
    <meta name="keywords" content="cbpa, bomberos, puente alto, intranet, gestion, vehículos, material mayor">
    <meta name="author" content="Cuerpo de Bomberos de Puente Alto">
    <meta property="og:title" content="Intranet CBPA">
    <meta property="og:description" content="Intranet Corporativa del Cuerpo de Bomberos de Puente Alto.">
    <meta property="og:type" content="website">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? "system" }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    {{-- Inline style to set the HTML background color based on our theme in app.css --}}
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <link rel="icon" href="/images/cbpa_logo.jpg" type="image/jpeg">
    <link rel="apple-touch-icon" href="/images/cbpa_logo.jpg">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    <script>
        const Ziggy = {
            url: '{{ url(' / ') }}',
            port: null,
            defaults: {},
            routes: {
                'dashboard': {
                    uri: 'dashboard',
                    methods: ['GET', 'HEAD']
                },
                'equipment.repairs.index': {
                    uri: 'repairs',
                    methods: ['GET', 'HEAD']
                },
                'equipment.repairs.create': {
                    uri: 'repairs/create',
                    methods: ['GET', 'HEAD']
                },
                'equipment.repairs.store': {
                    uri: 'repairs',
                    methods: ['POST']
                },
                'equipment.repairs.show': {
                    uri: 'repairs/{repair}',
                    methods: ['GET', 'HEAD'],
                    parameters: ['repair']
                },
                'equipment.repairs.receive': {
                    uri: 'repairs/{repair}/receive',
                    methods: ['POST'],
                    parameters: ['repair']
                },
                'equipment.repairs.evaluate': {
                    uri: 'repairs/{repair}/evaluate',
                    methods: ['POST'],
                    parameters: ['repair']
                },
                'equipment.repairs.send_provider': {
                    uri: 'repairs/{repair}/send-provider',
                    methods: ['POST'],
                    parameters: ['repair']
                },
                'equipment.repairs.finish': {
                    uri: 'repairs/{repair}/finish',
                    methods: ['POST'],
                    parameters: ['repair']
                },
                'equipment.repairs.download_provider_act': {
                    uri: 'repairs/{repair}/provider-act',
                    methods: ['GET', 'HEAD'],
                    parameters: ['repair']
                },
                'materials.lookup': {
                    uri: 'materials/lookup',
                    methods: ['GET', 'HEAD']
                },
            }
        };
        if (typeof window !== 'undefined') {
            window.Ziggy = Ziggy;
        }
    </script>
    {{-- @routes disabled until tightenco/ziggy can be installed --}}
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>