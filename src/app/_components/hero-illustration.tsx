export function HeroIllustration({ className }: { className?: string }) {
    return (
        <div className={className}>
            {/* Placeholder illustration - replace with actual image/SVG */}
            <div className="relative aspect-square w-full rounded-2xl bg-linear-to-br from-blue-100 to-blue-50 p-8">
                <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                        <div className="mb-4 text-6xl">🎉</div>
                        <p className="text-sm text-neutral-600">
                            Hero Illustration Placeholder
                        </p>
                        <p className="mt-1 text-xs text-neutral-500">
                            Replace with actual illustration
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
