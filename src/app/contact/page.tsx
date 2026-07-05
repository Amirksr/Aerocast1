import type { Metadata } from "next";
import { Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { T } from "@/components/t";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Get in touch with the AeroCast team. We reply to every message within one business day.",
};

const CONTACT_CARDS = [
  { icon: Mail, titleKey: "email", valueKey: "emailVal", hintKey: "emailHint" },
  { icon: MessageCircle, titleKey: "chat", valueKey: "chatVal", hintKey: "chatHint" },
  { icon: MapPin, titleKey: "hq", valueKey: "hqVal", hintKey: "hqHint" },
  { icon: Clock, titleKey: "hours", valueKey: "hoursVal", hintKey: "hoursHint" },
];

export default function ContactPage() {
  return (
    <div className="container-page min-h-screen pb-24 pt-28 sm:pt-36">
      <div className="mb-12 max-w-2xl">
        <span className="chip"><T k="nav.contact" /></span>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          <T k="contact.title" />
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          <T k="contact.subtitle" />
        </p>
      </div>

      <div className="mb-12 overflow-hidden rounded-[2.5rem] shadow-card">
        <img
          src="/images/snow.jpg"
          alt="Snow-covered mountains at dawn"
          className="img-tinted h-48 w-full object-cover sm:h-64"
        />
        <div className="img-tint" aria-hidden />
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        {/* Form */}
        <div className="card p-6 sm:p-8">
          <ContactForm />
        </div>

        {/* Info */}
        <div className="space-y-4">
          {CONTACT_CARDS.map((c, i) => (
            <ContactCard key={c.title} index={i} {...c} />
          ))}

          <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-brand-600 to-sky-600 p-6 text-white dark:border-white/10">
            <h3 className="font-display text-lg font-bold"><T k="contact.apiTitle" /></h3>
            <p className="mt-2 text-sm text-brand-100">
              <T k="contact.apiDesc" />
            </p>
            <a
              href="mailto:api@aerocast.app"
              className="mt-4 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50"
            >
              api@aerocast.app
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ContactCard({
  icon: Icon,
  titleKey,
  valueKey,
  hintKey,
  index,
}: {
  icon: typeof Mail;
  titleKey: string;
  valueKey: string;
  hintKey: string;
  index: number;
}) {
  return (
    <div
      className="flex items-start gap-4 rounded-3xl border border-slate-200/70 bg-white/60 p-5 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-card dark:border-white/10 dark:bg-slate-900/40"
      style={{ animation: `fade-up 0.5s ease ${index * 0.08}s both` }}
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-sky-400 text-white shadow-glow">
        <Icon size={20} />
      </span>
      <div>
        <p className="text-sm font-medium text-slate-400">
          <T k={`contact.${titleKey}`} />
        </p>
        <p className="font-display text-lg font-bold">
          <T k={`contact.${valueKey}`} />
        </p>
        <p className="text-xs text-slate-400">
          <T k={`contact.${hintKey}`} />
        </p>
      </div>
    </div>
  );
}
