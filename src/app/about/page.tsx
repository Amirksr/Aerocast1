import type { Metadata } from "next";
import { AboutContent } from "@/components/about-content";

export const metadata: Metadata = {
  title: "About AeroCast",
  description:
    "Learn about AeroCast's mission, our values and the technology stack behind the platform.",
};

export default function AboutPage() {
  return <AboutContent />;
}
