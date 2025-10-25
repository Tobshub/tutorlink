import Image from "next/image";

export function HeroIllustration({ className }: { className?: string }) {
    return (
        <div className={className}>
            <Image
                src="/images/online-learning-bro-1.png"
                alt="Hero illustration showing online learning"
                width={500}
                height={500}
                className="h-full w-full object-contain"
                priority
            />
        </div>
    );
}
