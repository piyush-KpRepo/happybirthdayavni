import { useEffect, useMemo, useRef, useState } from "react";
import { config } from "@/data/story-config";
import { Chapter, DestinyButton, Passcode, PhotoFrame, RedCircle, Reveal } from "./primitives";

/* ================================================================== */
/* LOCKED LOVE LETTER                                                  */
/* ================================================================== */
export function LoveLetter({ done, onOpen }: { done: boolean; onOpen: () => void }) {
  const [asking, setAsking] = useState(false);
  const [open, setOpen] = useState(done);

  return (
    <section id="letter" className="scroll-mt-16 bg-ink px-5 py-24 text-cream sm:px-8">
      <div className="mx-auto w-full max-w-xl text-center">
        <Reveal>
          <RedCircle size={120} className="mx-auto text-[0.6rem]">
            PRIVATE ❤️
          </RedCircle>
          <p className="mt-8 text-[0.65rem] uppercase tracking-[0.4em] text-destiny">
            Classified message for {config.her}
          </p>
        </Reveal>

        {!open && !asking && (
          <Reveal delay={150}>
            <div className="mt-8">
              <DestinyButton onClick={() => setAsking(true)}>🔒 Open love letter</DestinyButton>
            </div>
          </Reveal>
        )}

        {!open && asking && (
          <div className="mt-8 text-left">
            <Passcode
              gate={config.gates.letter}
              onSolved={() => {
                setOpen(true);
                onOpen();
              }}
              cta="Open 💌"
              successTitle="ENVELOPE OPENING…"
            />
          </div>
        )}

        {open && (
          <article className="mt-10 animate-scale-in rounded-3xl border border-destiny/40 bg-plum/40 p-6 text-left sm:p-9">
            {config.letter.split("\n\n").map((para, i) => (
              <p
                key={i}
                className="mb-5 animate-fade-up font-serif text-lg leading-relaxed text-cream/90 last:mb-0"
                style={{ animationDelay: `${Math.min(i * 90, 900)}ms` }}
              >
                {para}
              </p>
            ))}
          </article>
        )}
      </div>
    </section>
  );
}

/* ================================================================== */
/* FINAL LEVEL — PHOTO REVEAL                                          */
/* ================================================================== */
const checklist = [
  "Found the first clue",
  "Survived the legendary block",
  "Became best friends",
  "Survived the Avni Test",
  "Found the Red Circle",
  "Unlocked the love letter",
];

export function FinalLevel({ done, onReveal }: { done: boolean; onReveal: () => void }) {
  const [revealed, setRevealed] = useState(done);

  return (
    <Chapter id="final" eyebrow="One last thing…" title="You've made it through the entire story.">
      <Reveal>
        <ul className="space-y-2 rounded-3xl border border-destiny/25 bg-plum/35 p-5 text-sm">
          {checklist.map((c) => (
            <li key={c} className="flex gap-3">
              <span className="text-destiny">✓</span>
              <span className="opacity-85">{c}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      {!revealed ? (
        <>
          <Reveal>
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <p className="font-serif text-xl">But there is one final secret.</p>
              <p className="text-4xl">🔒</p>
              <p className="text-[0.65rem] uppercase tracking-[0.35em] text-destiny">Photo locked</p>
            </div>
          </Reveal>
          <Reveal>
            <Passcode
              gate={config.gates.final}
              onSolved={() => {
                setRevealed(true);
                onReveal();
              }}
              cta="Reveal 🔓"
              successTitle="FINAL LEVEL COMPLETE ❤️"
            />
          </Reveal>
        </>
      ) : (
        <div className="animate-scale-in space-y-6 text-center">
          <PhotoFrame photo={config.photos.final} shape="circle" />
          <p className="font-serif text-3xl text-blush">Happy Birthday, {config.her} ❤️</p>
          <div className="space-y-1 font-serif text-xl opacity-90">
            <p>My crush.</p>
            <p>My best friend.</p>
            <p>My crazy person.</p>
            <p>My wife.</p>
            <p className="opacity-70">And hopefully…</p>
            <p>My favourite person to annoy for the rest of my life.</p>
          </div>
          <p className="text-sm tracking-[0.2em] text-destiny">
            Love you forever. — {config.him} ❤️
          </p>
        </div>
      )}
    </Chapter>
  );
}

/* ================================================================== */
/* FINAL ANIMATION — circles merging                                   */
/* ================================================================== */
export function FinalAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);
  const [stage, setStage] = useState(0);

  const dots = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => {
        const angle = (i / 22) * Math.PI * 2;
        const radius = 130 + (i % 5) * 26;
        return {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          d: 900 + (i % 7) * 260,
          s: 5 + (i % 4) * 3,
        };
      }),
    [],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        if (e.isIntersecting) {
          setPlay(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!play) return;
    const t = [3400, 5200, 7000].map((ms, i) =>
      window.setTimeout(() => setStage(i + 1), ms),
    );
    return () => t.forEach(window.clearTimeout);
  }, [play]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink px-5 py-28 text-center text-cream">
      <div className="relative mx-auto grid h-72 w-72 place-items-center">
        {dots.map((d, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-destiny shadow-destiny transition-all ease-in-out"
            style={{
              width: d.s,
              height: d.s,
              transform: play ? "translate(0,0)" : `translate(${d.x}px, ${d.y}px)`,
              opacity: play ? 0.35 : 0.9,
              transitionDuration: `${d.d + 1600}ms`,
            }}
          />
        ))}
        <div
          className={`grid h-44 w-44 place-items-center rounded-full border border-destiny bg-destiny/15 shadow-destiny transition-all duration-[2200ms] ${
            stage >= 1 ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        >
          <span className="font-serif text-3xl text-blush">{config.her.toUpperCase()} ❤️</span>
        </div>
      </div>

      <p
        className={`mt-12 font-serif text-xl tracking-[0.2em] transition-opacity duration-1000 ${stage >= 2 ? "opacity-90" : "opacity-0"}`}
      >
        OUR STORY IS STILL BEING WRITTEN…
      </p>
      <p
        className={`mt-4 font-serif text-2xl text-destiny transition-opacity duration-1000 ${stage >= 3 ? "opacity-100" : "opacity-0"}`}
      >
        Happy Birthday, my love.
      </p>
    </section>
  );
}

/* ================================================================== */
/* MUSIC BUTTON (never autoplays)                                      */
/* ================================================================== */
export function MusicButton() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;
    try {
      if (playing) {
        el.pause();
        setPlaying(false);
      } else {
        await el.play();
        setPlaying(true);
      }
    } catch {
      setFailed(true);
    }
  };

  return (
    <>
      {/* 🎵 Replace /public/audio/soundtrack.mp3 with your own song */}
      <audio ref={audioRef} src={config.music.src} loop preload="none" onError={() => setFailed(true)} />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause soundtrack" : config.music.label}
        className="tap fixed right-3 bottom-4 z-40 flex min-h-10 items-center gap-2 rounded-full border border-destiny/50 bg-ink/80 px-4 py-2 text-[0.6rem] uppercase tracking-[0.2em] text-blush backdrop-blur"
      >
        🎵 <span>{failed ? "add a song" : playing ? "pause" : "our soundtrack"}</span>
      </button>
    </>
  );
}
