import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "@/components/common/Toaster";
import { SimulatorSection } from "@/components/common/SimulatorSection";
import { ChallengesSection } from "@/components/common/ChallengesSection";
import { WhatIfForm } from "@/components/forms/WhatIfForm";
import { SocialSection } from "@/components/common/SocialSection";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <Toaster />

      <main id="main-content">
        <HeroSection />
        <ProblemSection />
        <SimulatorSection />
        <FeaturesSection />
        <AvatarSection />
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-6 md:grid-cols-2">
            <AiDetectiveCard />
            <ChallengesSection />
          </div>
        </section>
        <section className="py-28" aria-label="What-If Scanner">
          <div className="mx-auto max-w-4xl px-4">
            <div className="mb-14 text-center">
              <span className="mb-3 block font-mono text-[0.65rem] font-bold uppercase tracking-[0.15em] text-blue-300/90">
                Feature 06
              </span>
              <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
                What-If <span className="text-blue-400">Scanner</span>
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-slate-400">
                Ask any question about your lifestyle. Get the future in seconds.
              </p>
            </div>
            <WhatIfForm />
          </div>
        </section>

        <SocialSection />
        <DownloadSection />
        <MethodologySection />
      </main>

      <Footer />
    </>
  );
}

function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4 pb-20 pt-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(34,197,94,.18)_0%,transparent_70%),radial-gradient(ellipse_40%_60%_at_80%_50%,rgba(34,197,94,.07)_0%,transparent_60%)]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(34,197,94,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,.05)_1px,transparent_1px)] [background-size:60px_60px]" />
        <div className="absolute left-1/2 top-1/3 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-brand/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <div className="mb-8 inline-flex items-center gap-2.5">
          <Badge>
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand"
              aria-hidden="true"
            />
            AI-Powered Climate Simulator
          </Badge>
        </div>

        <h1 className="mb-6 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
            See the future
          </span>
          <br />
          <span className="bg-gradient-to-br from-brand to-emerald-200 bg-clip-text text-transparent">
            you&apos;re creating
          </span>
          <br />
          <span className="text-4xl font-light text-slate-400 sm:text-5xl md:text-6xl">
            before it happens.
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
          CarbonMirror doesn&apos;t just track your emissions — it shows you the exact
          future your lifestyle is building.{" "}
          <span className="text-slate-300">
            Switch timelines. Explore paths. Change what matters.
          </span>
        </p>

        <div className="mb-16 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#simulator"
            className="rounded-2xl bg-brand px-8 py-4 text-sm font-bold text-white shadow-[0_0_40px_rgba(34,197,94,.2)] transition-colors hover:bg-brand-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            See Your Future
          </a>
          <a
            href="#download"
            className="rounded-2xl border border-brand/15 bg-surface/60 px-8 py-4 text-sm font-semibold text-slate-200 backdrop-blur-xl transition-colors hover:border-brand/30 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            Download Free
          </a>
        </div>

        <div className="mx-auto grid max-w-md grid-cols-3 gap-3">
          <StatCard value="7" label="AI features" ariaLabel="7 AI features" />
          <StatCard value="10yr" label="projections" ariaLabel="10 year projections" />
          <StatCard value="∞" label="what-ifs" ariaLabel="Unlimited what-if scenarios" />
        </div>

        <div
          className="mt-16 flex flex-col items-center gap-2 opacity-40"
          aria-hidden="true"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-slate-500">
            Scroll to explore
          </span>
          <div className="h-10 w-px animate-pulse bg-gradient-to-b from-brand to-transparent" />
        </div>
      </div>
    </section>
  );
}

function StatCard({
  value,
  label,
  ariaLabel,
}: {
  value: string;
  label: string;
  ariaLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-surface/60 p-4 text-center backdrop-blur-xl">
      <div
        className="mb-0.5 font-mono text-2xl font-bold text-brand"
        aria-label={ariaLabel}
      >
        {value}
      </div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section id="problem" className="py-28" aria-label="The Problem">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-14 text-center">
          <span className="mb-3 block font-mono text-[0.65rem] font-bold uppercase tracking-[0.15em] text-brand/90">
            The Problem
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Carbon is <span className="text-brand">invisible.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-400">
            Numbers like “320 kg CO₂” are meaningless. Here’s the difference.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="relative overflow-hidden border-red-500/20">
            <CardContent className="p-8">
              <div
                aria-hidden="true"
                className="absolute right-0 top-0 h-32 w-32 rounded-full bg-red-500/5 blur-2xl"
              />
              <Badge variant="danger" className="mb-5">
                Other apps say
              </Badge>
              <div className="mb-2 font-mono text-4xl font-bold tracking-tight text-slate-200">
                320 kg CO₂
              </div>
              <p className="mb-6 text-sm text-slate-400">This month. Okay. Now what?</p>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>Invisible. Meaningless abstract numbers.</li>
                <li>No connection to your daily life.</li>
                <li>Generic advice. Zero behavior change.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-brand/25 shadow-[0_0_40px_rgba(34,197,94,.12)]">
            <CardContent className="p-8">
              <div
                aria-hidden="true"
                className="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand/10 blur-3xl"
              />
              <Badge className="mb-5">CarbonMirror says</Badge>
              <div className="mb-4 text-base font-semibold leading-relaxed text-slate-100">
                “If you continue this lifestyle for{" "}
                <span className="font-bold text-brand">5 years</span>, your emissions
                equal <span className="font-bold text-brand">12 flights</span> Delhi →
                London.”
              </div>
              <div className="mb-6 text-sm leading-relaxed text-slate-400">
                “Take public transport twice a week — prevents emissions equal to{" "}
                <span className="font-semibold text-brand">
                  powering your home for 8 months.
                </span>
                ”
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li>Relatable. Tangible. Emotionally real.</li>
                <li>AI-personalised to your exact routine.</li>
                <li>Shows your future before it happens.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-28" aria-label="Carbon Time Machine">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-14 text-center">
          <span className="mb-3 block font-mono text-[0.65rem] font-bold uppercase tracking-[0.15em] text-brand/90">
            Feature 02
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Carbon <span className="text-brand">Time Machine</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            320 kg CO₂ means nothing. These analogies mean everything.
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <Card className="border-brand/10">
            <CardContent className="px-10 py-5 text-center">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                Today&apos;s footprint
              </p>
              <div className="mt-2 font-mono text-5xl font-bold text-white">
                15.0<span className="ml-2 text-xl text-slate-400">kg CO₂</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <FeatureTile title="60 km" subtitle="Driving a petrol car" variant="info" />
          <FeatureTile title="1,800×" subtitle="Smartphone charges" variant="subtle" />
          <FeatureTile
            title="40 days"
            subtitle="Running a ceiling fan"
            variant="warning"
          />
        </div>
        <p className="mt-4 text-center font-mono text-xs text-slate-500">
          Tap any card to reveal conversion factor &amp; data source (demo simplified)
        </p>
      </div>
    </section>
  );
}

function FeatureTile({
  title,
  subtitle,
  variant,
}: {
  title: string;
  subtitle: string;
  variant: React.ComponentProps<typeof Badge>["variant"];
}) {
  return (
    <Card className="border-white/5">
      <CardContent className="p-6">
        <Badge variant={variant}>tap</Badge>
        <div className="mt-5 font-mono text-4xl font-bold text-slate-100">{title}</div>
        <div className="mt-1 text-sm font-medium text-slate-400">{subtitle}</div>
      </CardContent>
    </Card>
  );
}

function AiDetectiveCard() {
  return (
    <Card className="border-white/5">
      <CardContent className="p-8">
        <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.15em] text-brand/90">
          Feature 03
        </span>
        <h3 className="mt-3 text-2xl font-extrabold tracking-tight">
          AI Lifestyle <span className="text-brand">Detective</span>
        </h3>
        <p className="mt-2 text-sm text-slate-400">
          The AI finds hidden carbon in your routine you never even considered.
        </p>

        <div className="mt-6 rounded-2xl border border-brand/10 bg-surface-2/60 p-5">
          <div className="text-sm font-bold text-slate-100">Hidden emission detected</div>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            You drive 5 km to work daily. A metro route exists with only{" "}
            <span className="font-bold text-brand">8 min</span> extra travel time.
          </p>
          <div className="mt-4 border-t border-slate-700/40 pt-4">
            <p className="text-sm font-medium text-slate-200">
              Take metro Mon &amp; Wed →{" "}
              <span className="font-bold text-brand">save 18.0 kg CO₂/month</span> with
              only <span className="font-semibold text-yellow-300">+16 min/week</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AvatarSection() {
  return (
    <section id="avatar" className="py-28" aria-label="Carbon Avatar">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-14 text-center">
          <span className="mb-3 block font-mono text-[0.65rem] font-bold uppercase tracking-[0.15em] text-brand/90">
            Feature 05
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Carbon <span className="text-brand">Avatar</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Your virtual ecosystem lives and dies by your choices. Feel the difference.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <AvatarStateCard
            title="Polluted Forest"
            note="Score > 70th percentile"
            tone="red"
          />
          <AvatarStateCard
            title="Grassland"
            note="Score 30th–70th percentile"
            tone="yellow"
          />
          <AvatarStateCard
            title="Thriving Forest"
            note="Score < 30th percentile"
            tone="green"
          />
        </div>
      </div>
    </section>
  );
}

function AvatarStateCard({
  title,
  note,
  tone,
}: {
  title: string;
  note: string;
  tone: "red" | "yellow" | "green";
}) {
  const toneClasses =
    tone === "red"
      ? "border-red-500/20 hover:border-red-500/40"
      : tone === "yellow"
        ? "border-yellow-500/20 hover:border-yellow-500/40"
        : "border-brand/25";
  return (
    <Card className={toneClasses}>
      <CardContent className="p-6">
        <div
          className="mb-5 h-44 rounded-2xl bg-gradient-to-b from-black/20 to-black/60"
          aria-hidden="true"
        />
        <div className="font-bold text-slate-100">{title}</div>
        <p className="mt-1 text-sm text-slate-400">
          A simplified visual state in this refactor.
        </p>
        <div className="mt-2 font-mono text-xs text-slate-400">{note}</div>
      </CardContent>
    </Card>
  );
}

function DownloadSection() {
  return (
    <section id="download" className="py-28" aria-label="Download the app">
      <div className="mx-auto max-w-3xl px-4">
        <Card className="relative overflow-hidden border-brand/20 shadow-[0_0_60px_rgba(34,197,94,.15)]">
          <CardContent className="p-10 text-center md:p-16">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-3xl"
            />
            <div className="relative">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-brand/30 bg-brand/10">
                <div className="h-8 w-8 rounded-full bg-brand/20" aria-hidden="true" />
              </div>
              <h2 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">
                What future are
                <br />
                <span className="text-brand">you building?</span>
              </h2>
              <p className="mx-auto mb-10 max-w-md leading-relaxed text-slate-400">
                Most apps tell you what you did. CarbonMirror shows you what you’re
                creating — and how to change it today.
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <a
                  href="#"
                  className="rounded-2xl border border-slate-700/50 bg-surface-2/60 px-5 py-3.5 text-left text-slate-100 backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  aria-label="App Store download — Coming Soon"
                >
                  <div className="text-xs text-slate-400">Download on the</div>
                  <div className="text-sm font-bold">App Store (Coming Soon)</div>
                </a>
                <a
                  href="#"
                  className="rounded-2xl border border-slate-700/50 bg-surface-2/60 px-5 py-3.5 text-left text-slate-100 backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  aria-label="Google Play download — Coming Soon"
                >
                  <div className="text-xs text-slate-400">Get it on</div>
                  <div className="text-sm font-bold">Google Play (Coming Soon)</div>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function MethodologySection() {
  return (
    <section id="methodology" className="py-20" aria-labelledby="methodology-heading">
      <div className="mx-auto max-w-3xl px-4">
        <Card className="border-brand/10">
          <CardContent className="p-8">
            <h2
              id="methodology-heading"
              className="mb-4 text-2xl font-bold text-slate-100"
            >
              Our Methodology
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-slate-400">
              CarbonMirror calculates emission records using officially published,
              versioned, and publicly accessible emission factor databases. All CO₂ values
              are expressed in kilograms CO₂-equivalent (CO₂e) with one decimal place of
              precision.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <InfoBox
                title="IPCC AR6 (2022)"
                text="Transport & energy emission factors."
              />
              <InfoBox title="US EPA (2023)" text="Electronics & appliances factors." />
              <InfoBox title="DEFRA (2023)" text="Household energy conversion factors." />
            </div>
            <p className="mt-4 font-mono text-xs text-slate-500">
              When emission factors are updated, all projections are recalculated within
              24 hours and users are notified.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function InfoBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-slate-700/30 bg-surface-2/50 p-4">
      <div className="mb-1 font-bold text-brand">{title}</div>
      <p className="text-xs leading-relaxed text-slate-400">{text}</p>
    </div>
  );
}
