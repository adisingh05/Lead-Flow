import Link from "next/link";
import { Zap, ArrowRight, Check } from "lucide-react";

const features = [
  {
    icon: "🔍",
    title: "AI Prospect Research",
    desc: "Automatically enriches every lead with company data, funding rounds, tech stack, and buying signals in seconds.",
  },
  {
    icon: "✍️",
    title: "Personalized Outreach",
    desc: "AI writes emails that sound like you — referencing the prospect's recent news, role, and pain points.",
  },
  {
    icon: "⚡",
    title: "Lead Scoring Engine",
    desc: "Every lead gets a score based on ICP fit, engagement signals, and behavioral data.",
  },
  {
    icon: "📋",
    title: "Campaign Sequences",
    desc: "Build multi-step outreach sequences across email, LinkedIn, and calls. Set it once, LeadFlow runs it.",
  },
  {
    icon: "📊",
    title: "Pipeline Analytics",
    desc: "Real-time dashboards show conversion rates, reply rates, and revenue attribution across every campaign.",
  },
  {
    icon: "🔗",
    title: "CRM Integrations",
    desc: "Sync with Salesforce, HubSpot, and Zoho in one click. Every interaction logged automatically.",
  },
];

const steps = [
  {
    num: "1",
    title: "Define your ICP",
    desc: "Tell LeadFlow who your ideal customer is — industry, size, title, and geography.",
  },
  {
    num: "2",
    title: "AI finds prospects",
    desc: "Our research agent scans the web and databases to build a qualified prospect list.",
  },
  {
    num: "3",
    title: "Launch campaigns",
    desc: "AI writes and sends personalized sequences. You review, approve, the AI handles delivery.",
  },
  {
    num: "4",
    title: "Close more deals",
    desc: "Warm replies land in your inbox. Your team takes over only when a lead is ready to talk.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "Free",
    desc: "For solo founders and early-stage teams",
    features: [
      "Up to 100 leads/month",
      "AI prospect research",
      "Basic email sequences",
      "Lead scoring",
      "1 user seat",
    ],
    featured: false,
  },
  {
    name: "Growth",
    price: "₹4,999",
    period: "/mo",
    desc: "For sales teams ready to scale outbound",
    features: [
      "Up to 2,000 leads/month",
      "Advanced AI personalization",
      "Multi-channel sequences",
      "Pipeline analytics",
      "CRM integrations",
      "5 user seats",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For larger teams with advanced requirements",
    features: [
      "Unlimited leads",
      "Custom AI workflows",
      "Dedicated success manager",
      "SSO & advanced security",
      "Unlimited seats",
    ],
    featured: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#0F0F0F] font-sans">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-[#FAFAF9]/90 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#2563EB] flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-[15px] tracking-tight">
              LeadFlow AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How it works", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-[13px] font-medium text-[#6B7280] hover:text-[#0F0F0F] transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-[13px] font-medium text-[#6B7280] hover:text-[#0F0F0F] px-3 py-1.5 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0F0F0F] text-white text-[13px] font-semibold rounded-lg hover:bg-[#222] transition-colors"
            >
              Get started
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-[#F0F4FF] text-[#2563EB] text-[12px] font-semibold px-3 py-1.5 rounded-full mb-8 uppercase tracking-wide">
          <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full animate-pulse" />
          AI-Native · Built for Indian Startups
        </div>
        <h1 className="text-[56px] font-bold leading-[1.08] tracking-[-2px] mb-6 max-w-3xl mx-auto">
          Find leads. Close deals.{" "}
          <span className="text-[#2563EB]">On autopilot.</span>
        </h1>
        <p className="text-[18px] text-[#6B7280] leading-relaxed mb-10 max-w-xl mx-auto">
          LeadFlow AI researches prospects, writes personalized outreach, and
          qualifies leads — so your team spends time selling, not searching.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white text-[15px] font-semibold rounded-xl hover:bg-[#1D4ED8] transition-colors"
          >
            Start free trial
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#how-it-works"
            className="px-6 py-3 border border-[#E5E7EB] text-[#0F0F0F] text-[15px] font-semibold rounded-xl hover:border-[#9CA3AF] transition-colors"
          >
            See how it works
          </a>
        </div>

        {/* Trust */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <div className="flex">
            {["#6366F1", "#EC4899", "#F59E0B", "#10B981"].map((color, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: color, marginLeft: i === 0 ? 0 : -8 }}
              >
                {["A", "R", "S", "K"][i]}
              </div>
            ))}
          </div>
          <span className="text-[13px] text-[#6B7280]">
            Trusted by 200+ founders in India
          </span>
        </div>
      </section>

      {/* LOGOS */}
      <div className="border-y border-[#E5E7EB] bg-white py-5">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center gap-12 flex-wrap">
          <span className="text-[12px] font-medium text-[#9CA3AF]">
            Loved by teams at
          </span>
          {[
            "Razorpay",
            "Zepto",
            "CRED",
            "BrowserStack",
            "Groww",
            "Freshworks",
          ].map((name) => (
            <span key={name} className="text-[14px] font-bold text-[#D1D5DB]">
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-[12px] font-semibold text-[#2563EB] uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-[38px] font-bold tracking-[-1px] leading-tight mb-4">
            Everything your outbound team needs
          </h2>
          <p className="text-[16px] text-[#6B7280] max-w-lg mx-auto">
            From finding the right prospect to closing the deal — LeadFlow AI
            handles the entire pipeline.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-[#E5E7EB] rounded-xl p-6 hover:shadow-sm transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-[#F0F4FF] flex items-center justify-center text-xl mb-4">
                {f.icon}
              </div>
              <h3 className="text-[15px] font-bold text-[#0F0F0F] mb-2">
                {f.title}
              </h3>
              <p className="text-[13px] text-[#6B7280] leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="bg-white border-y border-[#E5E7EB] py-24"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-[12px] font-semibold text-[#2563EB] uppercase tracking-widest mb-3">
              How it works
            </p>
            <h2 className="text-[38px] font-bold tracking-[-1px] leading-tight">
              From zero to pipeline in 4 steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="flex flex-col gap-3">
                <div className="w-9 h-9 rounded-full border-2 border-[#E5E7EB] flex items-center justify-center text-[13px] font-bold text-[#2563EB]">
                  {s.num}
                </div>
                <h3 className="text-[15px] font-bold text-[#0F0F0F]">
                  {s.title}
                </h3>
                <p className="text-[13px] text-[#6B7280] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="bg-[#0F0F0F] py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { num: "3×", label: "Higher reply rates vs manual outreach" },
            { num: "80%", label: "Less time spent on prospecting" },
            { num: "200+", label: "Startup teams using LeadFlow" },
            { num: "₹0", label: "Cost to get started today" },
          ].map((m) => (
            <div key={m.label} className="text-center">
              <p className="text-[44px] font-bold text-white tracking-tight leading-none mb-2">
                {m.num}
              </p>
              <p className="text-[13px] text-[#6B7280]">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-[12px] font-semibold text-[#2563EB] uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h2 className="text-[38px] font-bold tracking-[-1px] leading-tight mb-4">
            Simple pricing, no surprises
          </h2>
          <p className="text-[16px] text-[#6B7280]">
            Start free, scale as you grow.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-xl p-7 flex flex-col gap-5 ${
                plan.featured
                  ? "border-2 border-[#2563EB] shadow-lg"
                  : "border border-[#E5E7EB]"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              <div>
                <p className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide mb-2">
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-[36px] font-bold text-[#0F0F0F] leading-none tracking-tight">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-[14px] text-[#6B7280] mb-1">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-[#9CA3AF]">{plan.desc}</p>
              </div>
              <div className="h-px bg-[#E5E7EB]" />
              <ul className="flex flex-col gap-2.5">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-[13px] text-[#0F0F0F]"
                  >
                    <Check className="w-4 h-4 text-[#2563EB] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className={`w-full flex items-center justify-center py-2.5 rounded-lg text-[13px] font-semibold transition-colors ${
                  plan.featured
                    ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                    : "border border-[#E5E7EB] text-[#0F0F0F] hover:bg-[#F9FAFB]"
                }`}
              >
                {plan.name === "Enterprise" ? "Talk to sales" : "Get started"}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F0F4FF] border-y border-[#DBEAFE] py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-[38px] font-bold tracking-[-1px] leading-tight mb-4">
            Your next 100 customers are out there.
          </h2>
          <p className="text-[16px] text-[#6B7280] mb-8">
            Join 200+ Indian startup teams using LeadFlow AI to build pipeline
            on autopilot.
          </p>
          <div className="flex items-center gap-2 max-w-sm mx-auto mb-3">
            <input
              type="email"
              placeholder="you@startup.com"
              className="flex-1 px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-[13px] bg-white outline-none focus:border-[#2563EB] transition-colors"
            />
            <Link
              href="/dashboard"
              className="px-4 py-2.5 bg-[#0F0F0F] text-white text-[13px] font-semibold rounded-lg hover:bg-[#222] transition-colors whitespace-nowrap"
            >
              Get access
            </Link>
          </div>
          <p className="text-[12px] text-[#9CA3AF]">
            No credit card required · Setup in under 5 minutes
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#2563EB] flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-[14px]">LeadFlow AI</span>
          </div>
          <span className="text-[13px] text-[#9CA3AF]">
            © 2026 LeadFlow AI. Built in Bangalore 🇮🇳
          </span>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[13px] text-[#6B7280] hover:text-[#0F0F0F] transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
