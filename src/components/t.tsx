"use client";

import { useT } from "./language-provider";

/** Render a translated string in a server component via a client boundary. */
export function T({
  k,
  className,
  as: Tag = "span",
}: {
  k: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const t = useT();
  return <Tag className={className}>{t(k)}</Tag>;
}
