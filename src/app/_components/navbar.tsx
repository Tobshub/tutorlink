"use client";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type ActiveClass = "#home" | "#about" | "#how-it-works" | "#find-tutors" | "#edu-feed" | "#contact";

export function Navbar() {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState<ActiveClass>("#home");

    return (
        <nav className="tl-nav flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm sm:px-6">
            <Link href="/" onClick={() => setActive("#home")} className="flex items-center gap-1 text-xl font-bold">
                <span className="font-geist text-neutral-900">Tutor</span>
                <span className="font-poppins text-[#1E88FF]">Link</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:block">
                <NavigationMenu>
                    <NavigationMenuList className="font-poppins">
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link
                                    href="/"
                                    onClick={() => setActive("#home")}
                                    className={cn(
                                        "text-sm font-medium",
                                        active === "#home"
                                            ? "text-[#1E88FF] bg-[--brand-100] rounded-full shadow-xs hover:text-black!"
                                            : "text-neutral-700 hover:text-neutral-900"
                                    )}
                                >
                                    Home
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link
                                    href="#about"
                                    onClick={() => setActive("#about")}
                                    className={cn(
                                        "text-sm font-medium",
                                        active === "#about"
                                            ? "text-[#1E88FF] bg-[--brand-100] rounded-full shadow-xs hover:text-black!"
                                            : "text-neutral-700 hover:text-neutral-900"
                                    )}
                                >
                                    About
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link
                                    href="#how-it-works"
                                    onClick={() => setActive("#how-it-works")}
                                    className={cn(
                                        "text-sm font-medium",
                                        active === "#how-it-works"
                                            ? "text-[#1E88FF] bg-[--brand-100] rounded-full shadow-xs hover:text-black!"
                                            : "text-neutral-700 hover:text-neutral-900"
                                    )}
                                >
                                    How It Works
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link
                                    href="/login"
                                    onClick={() => setActive("#find-tutors")}
                                    className={cn(
                                        "text-sm font-medium",
                                        active === "#find-tutors"
                                            ? "text-[#1E88FF] bg-[--brand-100] rounded-full shadow-xs hover:text-black!"
                                            : "text-neutral-700 hover:text-neutral-900"
                                    )}
                                >
                                    Find Tutors
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link
                                    href="#edu-feed"
                                    onClick={() => setActive("#edu-feed")}
                                    className={cn(
                                        "text-sm font-medium",
                                        active === "#edu-feed"
                                            ? "text-[#1E88FF] bg-[--brand-100] rounded-full shadow-xs hover:text-black!"
                                            : "text-neutral-700 hover:text-neutral-900"
                                    )}
                                >
                                    Edu Feed
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink asChild>
                                <Link
                                    href="#contact"
                                    onClick={() => setActive("#contact")}
                                    className={cn(
                                        "text-sm font-medium",
                                        active === "#contact"
                                            ? "text-[#1E88FF] bg-[--brand-100] rounded-full shadow-xs hover:text-black!"
                                            : "text-neutral-700 hover:text-neutral-900"
                                    )}
                                >
                                    Contact
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            {/* Desktop CTAs */}
            <div className="hidden items-center gap-3 md:flex">
                <Button asChild variant="brandOutline" size="lg" className="rounded-full">
                    <Link href="/login" aria-label="Log in to TutorLink">Log in</Link>
                </Button>
                <Button asChild variant="brand" size="lg" className="rounded-full shadow-md">
                    <Link href="/signup" aria-label="Create a TutorLink account" className="hover:text-black/90!">Sign up</Link>
                </Button>
            </div>

            {/* Mobile Nav */}
            <div className="md:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" aria-label="Open menu">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-64 px-3">
                        <div className="mt-6 flex flex-col gap-1 font-poppins">
                            <Link
                                href="/"
                                onClick={() => {
                                    setActive("#home");
                                    setOpen(false);
                                }}
                                className={cn(
                                    "text-sm font-medium px-3 py-2",
                                    active === "#home"
                                        ? "text-[#1E88FF] bg-[--brand-100] rounded-full shadow-xs"
                                        : "text-neutral-700 hover:text-neutral-900 hover:bg-[--brand-100] rounded-full"
                                )}
                            >
                                Home
                            </Link>
                            <Link
                                href="#about"
                                onClick={() => {
                                    setActive("#about");
                                    setOpen(false);
                                }}
                                className={cn(
                                    "text-sm font-medium px-3 py-2",
                                    active === "#about"
                                        ? "text-[#1E88FF] bg-[--brand-100] rounded-full shadow-xs"
                                        : "text-neutral-700 hover:text-neutral-900 hover:bg-[--brand-100] rounded-full"
                                )}
                            >
                                About
                            </Link>
                            <Link
                                href="#how-it-works"
                                onClick={() => {
                                    setActive("#how-it-works");
                                    setOpen(false);
                                }}
                                className={cn(
                                    "text-sm font-medium px-3 py-2",
                                    active === "#how-it-works"
                                        ? "text-[#1E88FF] bg-[--brand-100] rounded-full shadow-xs"
                                        : "text-neutral-700 hover:text-neutral-900 hover:bg-[--brand-100] rounded-full"
                                )}
                            >
                                How It Works
                            </Link>
                            <Link
                                href="/login"
                                onClick={() => {
                                    setActive("#find-tutors");
                                    setOpen(false);
                                }}
                                className={cn(
                                    "text-sm font-medium px-3 py-2",
                                    active === "#find-tutors"
                                        ? "text-[#1E88FF] bg-[--brand-100] rounded-full shadow-xs"
                                        : "text-neutral-700 hover:text-neutral-900 hover:bg-[--brand-100] rounded-full"
                                )}
                            >
                                Find Tutors
                            </Link>
                            <Link
                                href="#edu-feed"
                                onClick={() => {
                                    setActive("#edu-feed");
                                    setOpen(false);
                                }}
                                className={cn(
                                    "text-sm font-medium px-3 py-2",
                                    active === "#edu-feed"
                                        ? "text-[#1E88FF] bg-[--brand-100] rounded-full shadow-xs"
                                        : "text-neutral-700 hover:text-neutral-900 hover:bg-[--brand-100] rounded-full"
                                )}
                            >
                                Edu Feed
                            </Link>
                            <Link
                                href="#contact"
                                onClick={() => {
                                    setActive("#contact");
                                    setOpen(false);
                                }}
                                className={cn(
                                    "text-sm font-medium px-3 py-2",
                                    active === "#contact"
                                        ? "text-[#1E88FF] bg-[--brand-100] rounded-full shadow-xs"
                                        : "text-neutral-700 hover:text-neutral-900 hover:bg-[--brand-100] rounded-full"
                                )}
                            >
                                Contact
                            </Link>

                            {/* Mobile CTAs */}
                            <div className="mt-4 flex flex-col gap-2">
                                <Button asChild variant="brand" size="lg" className="rounded-full shadow-md">
                                    <Link href="/signup" aria-label="Create a TutorLink account" onClick={() => setOpen(false)}>
                                        Sign up
                                    </Link>
                                </Button>
                                <Button asChild variant="brandOutline" size="lg" className="rounded-full">
                                    <Link href="/login" aria-label="Log in to TutorLink" onClick={() => setOpen(false)}>
                                        Log in
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav >
    );
}

