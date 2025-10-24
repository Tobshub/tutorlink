import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/app/_components/navbar";
import { HeroIllustration } from "@/app/_components/hero-illustration";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white via-blue-50 to-[#43A8FF]">
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
                <Link href="/login">Find Tutors</Link>
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

        {/* About Section */}
        <section id="about" className="scroll-mt-24 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Card className="overflow-hidden bg-white/90 backdrop-blur-sm shadow-lg">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                  {/* Left Side - Illustration */}
                  <div className="relative p-6 sm:p-8 lg:p-12">
                    <div className="aspect-square w-full max-w-md mx-auto lg:mx-0">
                      <Image
                        src="/images/Group 46.png"
                        alt="TutorLink learning platform illustration"
                        width={400}
                        height={400}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Right Side - Content */}
                  <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
                    <h2 className="mb-6 font-poppins text-2xl font-semibold text-neutral-900 sm:text-3xl lg:text-4xl">
                      About TutorLink
                    </h2>
                    <p className="mb-6 text-base leading-relaxed text-neutral-700 sm:text-lg">
                      TutorLink is an intelligent learning platform built to make finding and connecting with the right tutor simple, instant, and meaningful.
                    </p>
                    <p className="mb-8 text-base leading-relaxed text-neutral-700 sm:text-lg">
                      We use advanced AI to match students with tutors based on learning style, subject needs, and availability — so every session feels personalized and productive.
                    </p>
                    <div className="text-right">
                      <Link
                        href="#how-it-works"
                        className="inline-flex items-center text-sm font-medium text-[#1E88FF] underline-offset-4 hover:underline"
                      >
                        See More
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="scroll-mt-24 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* For Students */}
            <div className="mb-16 lg:mb-20">
              <div className="mb-8 rounded-2xl bg-[#1E88FF] px-6 py-4 text-center">
                <h3 className="font-poppins text-xl font-bold text-white sm:text-2xl">FOR STUDENTS</h3>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
                {/* Steps */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E88FF] text-sm font-bold text-white">1</div>
                    <div>
                      <span className="font-semibold text-neutral-900">Create</span>
                      <span className="text-[#1E88FF]"> Your Profile</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E88FF] text-sm font-bold text-white">2</div>
                    <div>
                      <span className="font-semibold text-neutral-900">Get</span>
                      <span className="text-[#1E88FF]"> Matched Instantly</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E88FF] text-sm font-bold text-white">3</div>
                    <div>
                      <span className="font-semibold text-neutral-900">Start</span>
                      <span className="text-[#1E88FF]"> a Live Session</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E88FF] text-sm font-bold text-white">4</div>
                    <div>
                      <span className="font-semibold text-neutral-900">Review</span>
                      <span className="text-[#1E88FF]"> with AI Summaries</span>
                    </div>
                  </div>
                </div>

                {/* Illustration */}
                <div className="flex justify-center lg:justify-end">
                  <div className="w-full max-w-sm">
                    <Image
                      src="/images/Group 47.png"
                      alt="Student learning process illustration"
                      width={300}
                      height={300}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* For Tutors */}
            <div>
              <div className="mb-8 rounded-2xl bg-[#1E88FF] px-6 py-4 text-center">
                <h3 className="font-poppins text-xl font-bold text-white sm:text-2xl">FOR TUTORS</h3>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
                {/* Steps */}
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E88FF] text-sm font-bold text-white">1</div>
                    <div>
                      <span className="font-semibold text-neutral-900">Create</span>
                      <span className="text-[#1E88FF]"> Your Profile</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E88FF] text-sm font-bold text-white">2</div>
                    <div>
                      <span className="font-semibold text-neutral-900">Get</span>
                      <span className="text-[#1E88FF]"> Matched Instantly</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E88FF] text-sm font-bold text-white">3</div>
                    <div>
                      <span className="font-semibold text-neutral-900">Start</span>
                      <span className="text-[#1E88FF]"> a Live Session</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E88FF] text-sm font-bold text-white">4</div>
                    <div>
                      <span className="font-semibold text-neutral-900">Review</span>
                      <span className="text-[#1E88FF]"> with AI Summaries</span>
                    </div>
                  </div>
                </div>

                {/* Illustration */}
                <div className="flex justify-center lg:justify-end">
                  <div className="w-full max-w-sm">
                    <Image
                      src="/images/Group 46.png"
                      alt="Tutor teaching process illustration"
                      width={300}
                      height={300}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Find Tutors Section */}
        <section id="find-tutors" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1E88FF] via-white to-[#1E88FF]">
            <div className="relative mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
              <div className="text-center">
                <h2 className="mb-8 font-poppins text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl">
                  FIND TUTORS
                </h2>
                <div className="mt-12">
                  <p className="font-poppins text-lg font-medium text-neutral-900 sm:text-xl">
                    Getting <em>help</em> or sharing your <strong>knowledge</strong> has never been <em><strong>easier.</strong></em>
                  </p>
                </div>
                <div className="mt-8">
                  <Button
                    asChild
                    variant="brand"
                    size="lg"
                    className="rounded-full px-8 py-4 text-lg font-semibold shadow-lg"
                  >
                    <Link href="/signup">FOR STUDENTS</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EduFeed Section */}
        <section id="edu-feed" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1E88FF] via-white to-[#1E88FF]">
            <div className="relative mx-auto max-w-4xl px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
              <div className="text-center">
                <h2 className="font-poppins text-3xl font-bold text-neutral-900 sm:text-4xl lg:text-5xl">
                  EduFeed
                </h2>
                <div className="mt-8">
                  <p className="text-lg text-neutral-700 sm:text-xl">
                    AI-powered study notes and educational content tailored to your learning journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
          <div className="rounded-3xl bg-gradient-to-b from-[#1E88FF] to-[#1669D6] px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
            <div className="mx-auto max-w-6xl">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Contact Us */}
                <div className="text-center md:text-left">
                  <h3 className="mb-4 font-poppins text-xl font-bold italic text-white sm:text-2xl">
                    Contact Us
                  </h3>
                  <p className="mb-4 text-white">
                    Got a question, suggestion, or partnership idea?
                  </p>
                  <div className="flex items-center justify-center gap-2 text-white md:justify-start">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>admin@tutorlink.com</span>
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="text-center md:text-left">
                  <h3 className="mb-4 font-poppins text-xl font-bold italic text-white sm:text-2xl">
                    Phone & Email
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-white md:justify-start">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>+234 **********</span>
                      {/* TODO: Add actual phone number */}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-white md:justify-start">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>+234 **********</span>
                      {/* TODO: Add actual phone number */}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="text-center md:text-left">
                  <h3 className="mb-4 font-poppins text-xl font-bold italic text-white sm:text-2xl">
                    Info
                  </h3>
                  <div className="text-white">
                    <p className="mb-2">Lines are open:</p>
                    <p className="font-medium">Monday - Friday</p>
                    <p className="font-medium">9:00am - 5:30pm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
