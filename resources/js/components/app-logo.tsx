interface AppLogoProps {
    className?: string;
}

export default function AppLogo({ className }: AppLogoProps) {
    return (
        <>
            <div
                className={`flex aspect-square size-10 items-center justify-center rounded-md ${className}`}
            >
                <img
                    src="/images/cbpa_logo.jpg"
                    alt="CBPA Logo"
                    className="size-full rounded-full bg-white object-contain transition-opacity hover:opacity-90"
                />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold">Intranet CBPA</span>
            </div>
        </>
    );
}
