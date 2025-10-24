import Link from "next/link";
import { Navbar } from "@/app/_components/navbar";
import { HeroIllustration } from "@/app/_components/hero-illustration";
import { Button } from "@/components/ui/button";
import { SectionPill } from "./_components/section-pill";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-linear-to-b from-white via-blue-50 to-[#43A8FF]">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <Navbar />

        {/* Hero Section - Mobile First */}
        <section id="home" className="scroll-mt-24 mt-8 grid grid-cols-1 gap-8 px-2 sm:mt-12 sm:px-4 lg:grid-cols-2 lg:gap-12">
          {/* Left Content */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <p className="text-xl font-semibold text-neutral-800 sm:text-2xl">
              Welcome To
            </p>

            <h1 className="font-roboto-mono text-4xl tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
              <span>Tutor</span>
              <span className="text-[#1E88FF]">Link</span>
              <span
                className="ml-2 inline-block align-middle text-[#1E88FF] sm:ml-3"
                aria-hidden
              >
                {/* Chain link icon */}
                <svg
                  className="h-8 w-8 sm:h-9 sm:w-9"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.59 13.41a1.998 1.998 0 0 0 2.82 0l2.12-2.12a2 2 0 1 0-2.83-2.83l-1.06 1.06"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.41 10.59a1.998 1.998 0 0 0-2.82 0l-2.12 2.12a2 2 0 1 0 2.83 2.83l1.06-1.06"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Yellow bordered info box (Card) */}
            <Card className="border-2 border-yellow-400 bg-white/80 backdrop-blur">
              <CardContent className="p-4 sm:p-6">
                <p className="text-sm text-neutral-800 sm:text-base">
                  <span className="font-semibold">
                    Struggling with homework or exam prep?
                  </span>{" "}
                  TutorLink&apos;s got you.
                </p>
                <p className="mt-2 text-sm text-neutral-800 sm:text-base">
                  Tap in, link up with <span className="font-semibold">verified tutors</span> in
                  seconds, and get <span className="font-semibold">AI-powered</span> study notes
                  that keep you ahead — anytime, anywhere.
                </p>
              </CardContent>
            </Card>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild variant="brand" className="rounded-full px-6 py-6 sm:py-3 text-black">
                <Link href="#find-tutors">Find Tutors</Link>
              </Button>
              <Button
                asChild
                variant="brandOutline"
                className="rounded-full px-6 py-6 sm:py-3"
              >
                <Link href="#how-it-works">How It Works</Link>
              </Button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative mt-4 lg:mt-0">
            <HeroIllustration className="mx-auto w-full max-w-md lg:max-w-none" />
          </div>
        </section>

        {/* Stub sections for in-page navigation - replace with real content later */}
        <section id="about" className="scroll-mt-24 py-16 sm:py-24">
          <Card className="mx-auto max-w-4xl">
            <CardContent className="p-6">
              <h2 className="mb-2 text-2xl font-semibold">About</h2>
              <p className="text-neutral-700">This section will explain what TutorLink is about.</p>
            </CardContent>
          </Card>
        </section>

        <section id="how-it-works" className="scroll-mt-24 py-16 sm:py-24">
          <Card className="mx-auto max-w-4xl">
            <CardContent className="p-6">
              <div className="mb-3">
                <SectionPill>FOR TUTORS</SectionPill>
              </div>
              <h2 className="mb-2 text-2xl font-semibold">How It Works</h2>
              <p className="text-neutral-700">Overview of how students connect with verified tutors.</p>
            </CardContent>
          </Card>
        </section>

        <section id="find-tutors" className="scroll-mt-24 py-16 sm:py-24">
          <Card className="mx-auto max-w-4xl">
            <CardContent className="p-6">
              <div className="mb-3">
                <SectionPill>FOR STUDENTS</SectionPill>
              </div>
              <h2 className="mb-2 text-2xl font-semibold">Find Tutors</h2>
              <p className="text-neutral-700">Search and discovery section placeholder.</p>
            </CardContent>
          </Card>
        </section>

        <section id="edu-feed" className="scroll-mt-24 py-16 sm:py-24">
          <Card className="mx-auto max-w-4xl">
            <CardContent className="p-6">
              <h2 className="mb-2 text-2xl font-semibold">Edu Feed</h2>
              <p className="text-neutral-700">AI-powered notes and updates will live here.</p>
            </CardContent>
          </Card>
        </section>

        <section id="contact" className="scroll-mt-24 py-16 sm:py-24">
          <Card className="mx-auto max-w-4xl">
            <CardContent className="p-6">
              <h2 className="mb-2 text-2xl font-semibold">Contact</h2>
              <p className="text-neutral-700">Get in touch with the TutorLink team.</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
