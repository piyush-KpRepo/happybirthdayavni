import { useEffect, useRef, useState, type ReactNode } from "react";
import { matches } from "@/data/story-config";
import type { Photo } from "@/data/story-config";

/* ------------------------------------------------------------------ */
/* Reveal on scroll                                                    */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? "reveal-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The red circle of destiny                                           */
/* ------------------------------------------------------------------ */
export function RedCircle({
  size = 72,
  children,
  onClick,
  pulse = true,
  className = "",
  label,
}: {
  size?: number;
  children?: ReactNode;
  onClick?: () => void;
  pulse?: boolean;
  className?: string;
  label?: string;
}) {
  const inner = (
    <span
      className={`grid place-items-center rounded-full border border-destiny/70 bg-destiny/10 text-center text-[0.7rem] uppercase tracking-[0.2em] text-blush shadow-destiny ${
        pulse ? "animate-destiny-pulse" : ""
      } ${className}`}
      style={{ width: size, height: size }}
    >
      {children}
    </span>
  );

  if (!onClick) return inner;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label ?? "Red circle"}
      className="tap inline-grid place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destiny"
    >
      {inner}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Section shell                                                       */
/* ------------------------------------------------------------------ */
export function Chapter({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  tone = "wine",
}: {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  tone?: "wine" | "dark" | "cream";
}) {
  const bg =
    tone === "dark"
      ? "bg-ink text-cream"
      : tone === "cream"
        ? "bg-cream text-ink"
        : "bg-background text-foreground";
  return (
    <section id={id} className={`${bg} scroll-mt-16 px-5 py-20 sm:px-8`}>
      <div className="mx-auto w-full max-w-xl">
        <Reveal>
          {eyebrow && (
            <p className="mb-3 text-[0.65rem] uppercase tracking-[0.4em] text-destiny">{eyebrow}</p>
          )}
          <h2 className="font-serif text-3xl leading-tight sm:text-4xl">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-sm uppercase tracking-[0.25em] opacity-60">{subtitle}</p>
          )}
        </Reveal>
        <div className="mt-8 space-y-6">{children}</div>
      </div>
    </section>
  );
}

export function Line({
  children,
  delay = 0,
  serif = true,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  serif?: boolean;
  className?: string;
}) {
  return (
    <Reveal delay={delay}>
      <p
        className={`${serif ? "font-serif text-xl sm:text-2xl" : "text-base"} leading-relaxed ${className}`}
      >
        {children}
      </p>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */
export function DestinyButton({
  children,
  onClick,
  type = "button",
  variant = "solid",
  full = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "solid" | "ghost";
  full?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`tap min-h-12 rounded-full px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] transition-all duration-300 ${
        full ? "w-full" : ""
      } ${
        variant === "solid"
          ? "bg-destiny text-cream shadow-destiny hover:brightness-110"
          : "border border-destiny/60 text-blush hover:bg-destiny/15"
      }`}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Photo placeholder / frame                                           */
/* ------------------------------------------------------------------ */
export function PhotoFrame({
  photo,
  shape = "rounded",
  className = "",
}: {
  photo: Photo;
  shape?: "rounded" | "circle";
  className?: string;
}) {
  const shapeCls = shape === "circle" ? "rounded-full aspect-square" : "rounded-3xl aspect-[4/5]";
  return (
    <div
      className={`group relative w-full overflow-hidden border border-destiny/40 bg-plum/40 shadow-destiny ${shapeCls} ${className}`}
    >
      {photo.src ? (
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center">
          <RedCircle size={56}>◎</RedCircle>
          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-blush/80">[ {photo.label} ]</p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Passcode input                                                      */
/* ------------------------------------------------------------------ */
export function Passcode({
  gate,
  onSolved,
  cta = "Unlock 🔓",
  successTitle = "ACCESS GRANTED.",
  successNote,
}: {
  gate: { question: string; hint: string; accept: readonly string[]; wrong: readonly string[] };
  onSolved: () => void;
  cta?: string;
  successTitle?: string;
  successNote?: string;
}) {
  const [value, setValue] = useState("");
  const [state, setState] = useState<"idle" | "wrong" | "ok">("idle");
  const [tries, setTries] = useState(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matches(value, gate.accept)) {
      setState("ok");
      window.setTimeout(onSolved, 1400);
    } else {
      setState("wrong");
      setTries((t) => t + 1);
      window.setTimeout(() => setState((s) => (s === "wrong" ? "idle" : s)), 900);
    }
  };

  if (state === "ok") {
    return (
      <div className="animate-scale-in rounded-3xl border border-destiny/50 bg-destiny/10 p-8 text-center">
        <RedCircle size={64} className="mx-auto">
          ✓
        </RedCircle>
        <p className="mt-5 font-serif text-2xl text-blush">{successTitle}</p>
        {successNote && <p className="mt-2 text-sm opacity-75">{successNote}</p>}
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={`rounded-3xl border border-destiny/35 bg-plum/40 p-6 ${state === "wrong" ? "animate-shake" : ""}`}
    >
      <p className="font-serif text-xl leading-snug">{gate.question}</p>
      <p className="mt-2 text-sm italic opacity-65">{gate.hint}</p>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        inputMode="text"
        autoCapitalize="characters"
        autoComplete="off"
        spellCheck={false}
        placeholder="type your answer"
        aria-label={gate.question}
        className="mt-5 w-full rounded-2xl border border-destiny/40 bg-ink/60 px-5 py-4 text-center text-lg uppercase tracking-[0.3em] text-cream placeholder:text-[0.7rem] placeholder:tracking-[0.2em] placeholder:text-cream/30 focus:border-destiny focus:outline-none"
      />
      <div className="mt-4">
        <DestinyButton type="submit" full>
          {cta}
        </DestinyButton>
      </div>
      {state === "wrong" && (
        <div className="mt-4 space-y-1 text-center text-sm text-blush">
          {gate.wrong.map((w) => (
            <p key={w}>{w}</p>
          ))}
        </div>
      )}
      {tries >= 3 && state !== "wrong" && (
        <p className="mt-4 text-center text-xs opacity-50">
          Take your time. Unlimited attempts, no lockouts. (Obviously.)
        </p>
      )}
    </form>
  );
}
