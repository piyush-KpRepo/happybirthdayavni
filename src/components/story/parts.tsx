import { useEffect, useRef, useState } from "react";
import { config } from "@/data/story-config";
import {
  Chapter,
  DestinyButton,
  Line,
  Passcode,
  PhotoFrame,
  RedCircle,
  Reveal,
} from "./primitives";

/* ================================================================== */
/* OPENING — TOP SECRET                                                */
/* ================================================================== */
export function TopSecret({ onEnter }: { onEnter: () => void }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const timers = [700, 1500, 2400, 3300, 4200, 5000].map((ms, i) =>
      window.setTimeout(() => setStage(i + 1), ms),
    );
    return () => timers.forEach(window.clearTimeout);
  }, []);

  const show = (n: number) => (stage >= n ? "animate-fade-up" : "invisible");

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto bg-ink px-6 py-16 text-center">
      <RedCircle size={96} className="text-2xl">
        🔴
      </RedCircle>
      <h1 className={`mt-8 font-serif text-4xl tracking-[0.2em] text-cream ${show(1)}`}>
        TOP SECRET
      </h1>
      <p className={`mt-3 max-w-xs text-sm text-blush/80 ${show(2)}`}>
        An extremely important investigation is currently underway.
      </p>
      <div className={`mt-8 space-y-1 ${show(3)}`}>
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-destiny">Subject</p>
        <p className="font-serif text-3xl text-cream">{config.her.toUpperCase()}</p>
      </div>
      <div className={`mt-6 space-y-1 ${show(4)}`}>
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-destiny">Known aliases</p>
        <p className="text-sm text-cream/80">Cute • Crazy • Professional Comedian • Diet Expert</p>
      </div>
      <div className={`mt-6 space-y-1 ${show(5)}`}>
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-destiny">Classification</p>
        <p className="font-serif text-2xl text-cream">WIFE</p>
      </div>
      <div className={`mt-10 ${show(6)}`}>
        <p className="mb-5 text-xs uppercase tracking-[0.3em] text-blush/70">
          Authorized person required.
        </p>
        <DestinyButton onClick={onEnter}>Enter the story 🔐</DestinyButton>
      </div>
    </div>
  );
}

/* ================================================================== */
/* FIRST PASSCODE                                                      */
/* ================================================================== */
export function EntryGate({ onSolved }: { onSolved: () => void }) {
  return (
    <section className="min-h-screen px-5 py-20 sm:px-8">
      <div className="mx-auto w-full max-w-md">
        <Reveal>
          <p className="text-[0.65rem] uppercase tracking-[0.4em] text-destiny">Before we begin…</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight">
            Every great love story has a secret.
          </h2>
        </Reveal>
        <div className="mt-8">
          <Passcode
            gate={config.gates.entry}
            onSolved={onSolved}
            successNote="Apparently, you really do remember your own love story."
          />
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/* CHAPTER 1                                                           */
/* ================================================================== */
export function ChapterOne({ done, onClue }: { done: boolean; onClue: () => void }) {
  const [found, setFound] = useState(done);
  return (
    <Chapter id="ch1" eyebrow="Chapter 01 — The Beginning" title="There she was." subtitle="5th Class">
      <Line delay={100}>
        Cute. Funny. Completely unaware that a certain {config.him} had already started developing a
        tiny little problem…
      </Line>
      <Reveal delay={300}>
        <p className="font-serif text-4xl text-destiny">A CRUSH. ❤️</p>
      </Reveal>
      <Reveal delay={200}>
        <PhotoFrame photo={config.photos.school} />
      </Reveal>
      <Line delay={100}>And that was the beginning.</Line>
      <Line delay={150}>But obviously… our story was nowhere near normal.</Line>

      <Reveal>
        <div className="flex flex-col items-center gap-4 pt-6 text-center">
          <p className="text-sm italic opacity-70">
            Something tells me this circle isn't finished yet…
          </p>
          <RedCircle
            size={84}
            label="Hidden clue"
            onClick={() => {
              setFound(true);
              onClue();
            }}
          >
            {found ? "🔴 clue" : "tap?"}
          </RedCircle>
          {found && <p className="animate-fade-up text-sm text-destiny">🔴 CLUE FOUND</p>}
        </div>
      </Reveal>
    </Chapter>
  );
}

/* ================================================================== */
/* CHAPTER 2 — THE LEGENDARY BLOCK                                     */
/* ================================================================== */
export function ChapterTwo({ done, onUnlock }: { done: boolean; onUnlock: () => void }) {
  const [stage, setStage] = useState(done ? 4 : 0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(done);

  useEffect(() => {
    if (started || !ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        if (e.isIntersecting) setStarted(true);
      },
      { threshold: 0.3 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started || stage >= 4) return;
    const timers = [600, 1800, 3200, 4200].map((ms, i) =>
      window.setTimeout(() => setStage((s) => Math.max(s, i + 1)), ms),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [started, stage]);

  return (
    <Chapter
      id="ch2"
      eyebrow="Chapter 02 — The First Confession"
      title="The Legendary Block"
      subtitle="11th Class"
      tone="dark"
    >
      <div ref={ref} className="space-y-4 rounded-3xl border border-destiny/30 bg-plum/50 p-6">
        {stage >= 1 && (
          <div className="animate-fade-up">
            <p className="text-[0.6rem] uppercase tracking-[0.3em] text-destiny">{config.him}</p>
            <p className="font-serif text-2xl">“I like you.”</p>
          </div>
        )}
        {stage >= 2 && (
          <div className="animate-fade-up">
            <p className="text-[0.6rem] uppercase tracking-[0.3em] text-destiny">{config.her}</p>
            <p className="font-serif text-2xl tracking-[0.3em]">…</p>
          </div>
        )}
        {stage >= 3 && (
          <div className="animate-scale-in rounded-2xl border border-destiny/50 bg-destiny/15 p-5 text-center">
            <p className="font-serif text-3xl text-blush">BLOCKED 🚫</p>
            <p className="mt-2 text-xs uppercase tracking-[0.3em] opacity-70">connection lost</p>
          </div>
        )}
      </div>

      {stage >= 4 && (
        <div className="animate-fade-up space-y-5">
          <p className="font-serif text-3xl text-destiny">THE FIRST GREAT PLOT TWIST.</p>
          <p className="text-base opacity-80">
            {config.him} had finally confessed. {config.her} had other plans.
          </p>
          <Line delay={0}>And somehow… instead of disappearing from each other's lives…</Line>
          <p className="font-serif text-2xl">You became BEST FRIENDS.</p>
          {!done ? (
            <DestinyButton full onClick={onUnlock}>
              Best friends unlocked ❤️
            </DestinyButton>
          ) : (
            <p className="text-sm text-destiny">✓ Best friends unlocked</p>
          )}
          <p className="text-sm italic opacity-70">
            “Apparently, getting rejected wasn't enough to get rid of me.”
          </p>
        </div>
      )}
    </Chapter>
  );
}

/* ================================================================== */
/* CHAPTER 3 — BEST FRIENDS                                            */
/* ================================================================== */
export function ChapterThree({ done, onUnlock }: { done: boolean; onUnlock: () => void }) {
  return (
    <Chapter
      id="ch3"
      eyebrow="Chapter 03 — Best Friends"
      title="The Plot Twist Nobody Expected"
    >
      <Line>The girl who blocked me…</Line>
      <Line delay={120}>…became one of my closest people.</Line>
      <Reveal delay={150}>
        <PhotoFrame photo={config.photos.friends} className="aspect-[4/3]" />
      </Reveal>
      <Line delay={100}>You went to college. Life moved forward.</Line>
      <Line delay={150}>But apparently destiny had its own plans.</Line>

      <Reveal>
        <div className="relative h-28 overflow-hidden">
          <span
            className="absolute top-1/2 left-1/2 -mt-6 -ml-6 h-12 w-12 rounded-full border border-destiny/70 bg-destiny/20 shadow-destiny animate-drift"
            style={{ ["--dx" as string]: "110px", ["--dy" as string]: "-10px" }}
          />
          <span
            className="absolute top-1/2 left-1/2 -mt-6 -ml-6 h-12 w-12 rounded-full border border-blush/40 animate-drift"
            style={{ ["--dx" as string]: "-110px", ["--dy" as string]: "10px" }}
          />
        </div>
      </Reveal>

      <Line delay={80}>Because this wasn't the end.</Line>
      {!done ? (
        <Reveal>
          <DestinyButton full onClick={onUnlock}>
            There's more? 👀
          </DestinyButton>
        </Reveal>
      ) : (
        <p className="text-sm text-destiny">✓ Chapter unlocked</p>
      )}
    </Chapter>
  );
}

/* ================================================================== */
/* CHAPTER 4 — ROUND TWO                                               */
/* ================================================================== */
export function ChapterFour({ done, onUnlock }: { done: boolean; onUnlock: () => void }) {
  const [phase, setPhase] = useState<"idle" | "loading" | "yes">(done ? "yes" : "idle");

  const confess = () => {
    setPhase("loading");
    window.setTimeout(() => {
      setPhase("yes");
      onUnlock();
    }, 2200);
  };

  return (
    <Chapter
      id="ch4"
      eyebrow="Chapter 04 — The Second Confession"
      title="Round Two"
      tone="dark"
    >
      <Line>After {config.her} got her second job…</Line>
      <Line delay={120}>
        {config.him} apparently looked at the history of this relationship and thought…
      </Line>
      <Line delay={240} className="text-destiny">
        “Let's try this one more time.” 😂
      </Line>

      {phase === "idle" && (
        <Reveal>
          <DestinyButton full onClick={confess}>
            Confess again ❤️
          </DestinyButton>
        </Reveal>
      )}

      {phase === "loading" && (
        <div className="flex flex-col items-center gap-4 py-8">
          <RedCircle size={110} className="text-xs">
            sending…
          </RedCircle>
          <p className="text-sm opacity-70 animate-fade-up">heart rate: unreasonable</p>
        </div>
      )}

      {phase === "yes" && (
        <div className="animate-scale-in space-y-5 rounded-3xl border border-destiny/50 bg-destiny/10 p-8 text-center">
          <p className="font-serif text-4xl text-blush">SHE SAID YES.</p>
          <p className="font-serif text-2xl text-destiny">FINALLY.</p>
          <p className="text-sm opacity-80">
            After all those years… all those twists… and one legendary BLOCK…
          </p>
          <p className="font-serif text-2xl">We finally became US.</p>
          <p className="text-lg tracking-[0.2em] text-gold">{config.togetherFor}</p>
        </div>
      )}
    </Chapter>
  );
}

/* ================================================================== */
/* THE AVNI TEST                                                       */
/* ================================================================== */
export function AvniTest({ done, onPass }: { done: boolean; onPass: () => void }) {
  const [index, setIndex] = useState(done ? config.quiz.length : 0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [wrong, setWrong] = useState<number | null>(null);

  const complete = index >= config.quiz.length;
  const q = complete ? null : config.quiz[index];

  const answer = (i: number) => {
    if (!q) return;
    if (i === q.correct) {
      setWrong(null);
      setFeedback(q.after);
      window.setTimeout(() => {
        setFeedback(null);
        setIndex((n) => {
          const next = n + 1;
          if (next >= config.quiz.length) onPass();
          return next;
        });
      }, 1600);
    } else {
      setWrong(i);
      window.setTimeout(() => setWrong(null), 600);
    }
  };

  return (
    <Chapter id="quiz" eyebrow="Interlude" title="THE AVNI TEST 😂" subtitle="Let's see if you actually know yourself.">
      {!complete && q && (
        <div className="space-y-4 rounded-3xl border border-destiny/30 bg-plum/45 p-6">
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-destiny">
            Question {index + 1} / {config.quiz.length}
          </p>
          <p className="font-serif text-2xl leading-snug">{q.q}</p>
          {q.sub && <p className="text-base italic opacity-75">{q.sub}</p>}
          <div className="space-y-3 pt-2">
            {q.options.map((opt, i) => (
              <button
                key={opt}
                type="button"
                onClick={() => answer(i)}
                className={`tap min-h-12 w-full rounded-2xl border border-destiny/35 bg-ink/50 px-5 py-3 text-left text-sm transition-colors hover:bg-destiny/15 ${
                  wrong === i ? "animate-shake border-destiny" : ""
                }`}
              >
                <span className="mr-3 text-destiny">{String.fromCharCode(65 + i)}.</span>
                {opt}
              </button>
            ))}
          </div>
          {feedback && (
            <p className="animate-fade-up rounded-2xl bg-destiny/15 p-4 text-center text-sm text-blush">
              {feedback}
            </p>
          )}
        </div>
      )}

      {complete && (
        <div className="animate-scale-in rounded-3xl border border-destiny/50 bg-destiny/10 p-8 text-center">
          <p className="text-[0.65rem] uppercase tracking-[0.35em] text-destiny">Result</p>
          <p className="mt-3 font-serif text-3xl">100% Avni.</p>
          <p className="font-serif text-2xl opacity-80">0% surprised.</p>
          <p className="mt-4 text-sm text-destiny">Quiz completed 🔓</p>
        </div>
      )}
    </Chapter>
  );
}

/* ================================================================== */
/* CHAPTER 5 — OUR ADVENTURES                                          */
/* ================================================================== */
const memories = [
  {
    tag: "Memory 01 — Austria ❄️",
    title: "Your First Snowfall",
    body: [
      "Watching you experience snowfall in Austria for the first time…",
      "…is one of those memories I know I'll carry forever.",
    ],
    photo: "austria" as const,
  },
  {
    tag: "Memory 02 — First International Flight ✈️",
    title: "Our First International Flight",
    body: [
      "Two people. One flight.",
      "And absolutely no idea how many memories were waiting for us.",
    ],
    photo: "flight" as const,
  },
  {
    tag: "Memory 03 — Our Wedding 💍",
    title: "And Then We Got Married.",
    body: [
      "After knowing you since school… after all the twists… after everything…",
      "I finally got to call you my wife.",
    ],
    photo: "wedding" as const,
  },
];

export function ChapterFive({ done, onUnlock }: { done: boolean; onUnlock: () => void }) {
  return (
    <Chapter id="ch5" eyebrow="Chapter 05 — Us" title="Our Adventures">
      {memories.map((m, i) => (
        <Reveal key={m.title} delay={i * 80}>
          <article className="space-y-4 rounded-3xl border border-destiny/25 bg-plum/35 p-5">
            <p className="text-[0.6rem] uppercase tracking-[0.3em] text-destiny">{m.tag}</p>
            <h3 className="font-serif text-2xl">{m.title}</h3>
            <PhotoFrame photo={config.photos[m.photo]} />
            {m.body.map((b) => (
              <p key={b} className="font-serif text-lg leading-relaxed opacity-90">
                {b}
              </p>
            ))}
            {m.photo === "wedding" && (
              <p className="pt-2 text-center font-serif text-2xl tracking-[0.15em] text-gold">
                {config.marriedFor}
              </p>
            )}
          </article>
        </Reveal>
      ))}

      <Reveal>
        <div className="flex flex-col items-center gap-4 pt-4 text-center">
          <p className="font-serif text-xl">Still think this was a straight line?</p>
          <RedCircle size={90} />
          <p className="font-serif text-2xl text-destiny">Of course not.</p>
          <p className="text-sm opacity-75">We were always going in circles.</p>
          {!done ? (
            <DestinyButton full onClick={onUnlock}>
              Follow the circle 🔴
            </DestinyButton>
          ) : (
            <p className="text-sm text-destiny">✓ Chapter unlocked</p>
          )}
        </div>
      </Reveal>
    </Chapter>
  );
}

/* ================================================================== */
/* RED CIRCLE PUZZLE                                                   */
/* ================================================================== */
const puzzleColors = [
  "border-blush/30 bg-blush/10",
  "border-gold/40 bg-gold/10",
  "border-cream/25 bg-cream/5",
  "border-plum bg-plum/60",
  "border-blush/20 bg-transparent",
  "border-gold/25 bg-transparent",
  "border-cream/15 bg-cream/5",
  "border-blush/30 bg-plum/40",
  "border-gold/30 bg-plum/30",
  "border-cream/20 bg-transparent",
];

const timeline = [
  "5th CLASS",
  "CRUSH",
  "11th CLASS",
  "BLOCKED",
  "BEST FRIENDS",
  "SECOND CONFESSION",
  "YES ❤️",
  "2.5 YEARS",
  "MARRIAGE 💍",
];

export function CirclePuzzle({ done, onSolve }: { done: boolean; onSolve: () => void }) {
  const [solved, setSolved] = useState(done);
  const [missIndex, setMissIndex] = useState<number | null>(null);
  const correctSlot = 6; // position of the real red circle in the grid

  const miss = (i: number) => {
    setMissIndex(i);
    window.setTimeout(() => setMissIndex(null), 900);
  };

  return (
    <Chapter id="puzzle" eyebrow="The puzzle" title="THE CIRCLE OF DESTINY 🔴" tone="dark">
      {!solved ? (
        <>
          <Line delay={0}>Not every circle belongs to our story.</Line>
          <p className="text-sm opacity-70">Find the one that brought us here.</p>
          <div className="grid grid-cols-3 gap-4 pt-4 sm:grid-cols-4">
            {Array.from({ length: 11 }).map((_, i) => {
              const isCorrect = i === correctSlot;
              return (
                <button
                  key={i}
                  type="button"
                  aria-label={isCorrect ? "A glowing red circle" : "A circle"}
                  onClick={() => {
                    if (isCorrect) {
                      setSolved(true);
                      onSolve();
                    } else miss(i);
                  }}
                  className={`tap aspect-square rounded-full border ${
                    isCorrect
                      ? "border-destiny bg-destiny/25 shadow-destiny animate-destiny-pulse"
                      : puzzleColors[i % puzzleColors.length]
                  } ${missIndex === i ? "animate-shake" : ""}`}
                />
              );
            })}
          </div>
          {missIndex !== null && (
            <p className="animate-fade-up text-center text-sm text-blush">
              ❌ Nope. That circle has no idea what it's doing here.
            </p>
          )}
        </>
      ) : (
        <div className="animate-scale-in rounded-full border border-destiny/60 bg-destiny/10 px-6 py-12 text-center shadow-destiny">
          <div className="space-y-1">
            {timeline.map((t, i) => (
              <div key={t}>
                <p
                  className="animate-fade-up font-serif text-lg tracking-[0.15em]"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  {t}
                </p>
                {i < timeline.length - 1 && <p className="text-xs text-destiny">↓</p>}
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-2 text-sm opacity-85">
            <p>We never had a straight line.</p>
            <p className="font-serif text-xl text-destiny">We had a red circle.</p>
            <p>Somehow, no matter where life took us…</p>
            <p>we kept finding our way back to each other.</p>
          </div>
        </div>
      )}
    </Chapter>
  );
}

/* ================================================================== */
/* THE AVNI REPORT                                                     */
/* ================================================================== */
const reportRows: [string, string][] = [
  ["Subject", "Avni"],
  ["Personality", "Cute + Crazy"],
  ["Mimicry level", "Dangerous"],
  ["Joke frequency", "Uncontrolled"],
  ["Diet commitment", "Under investigation"],
  ["Does exactly what Piyush says not to do", "100%"],
];

export function AvniReport() {
  return (
    <Chapter id="report" eyebrow="One last laugh" title="THE OFFICIAL AVNI REPORT">
      <Reveal>
        <dl className="divide-y divide-destiny/20 overflow-hidden rounded-3xl border border-destiny/30 bg-plum/40">
          {reportRows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-5 py-3">
              <dt className="min-w-0 text-xs uppercase tracking-[0.2em] opacity-65">{k}</dt>
              <dd className="shrink-0 text-sm text-blush">{v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal delay={80}>
        <div className="space-y-3 rounded-3xl border border-destiny/25 bg-ink/40 p-5">
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-destiny">Case file 001</p>
          <h3 className="font-serif text-2xl">The Forbidden Button</h3>
          <p className="text-sm opacity-85">Piyush: “Don't do that.”</p>
          <p className="text-sm opacity-85">Avni: does exactly that.</p>
          <p className="text-xs uppercase tracking-[0.25em] text-blush">Status: Unsolved.</p>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="space-y-2 rounded-3xl border border-destiny/25 bg-ink/40 p-5">
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-destiny">Case file 002</p>
          <h3 className="font-serif text-2xl">The Diet Plan</h3>
          <p className="text-sm opacity-85">8:00 AM — “Today I am eating healthy.”</p>
          <p className="text-sm opacity-85">7:00 PM — “Should we order something?”</p>
          <p className="text-sm opacity-85">Piyush: “Didn't you say you're dieting?”</p>
          <p className="text-sm opacity-85">Avni: “It's a cheat day.”</p>
          <p className="text-sm opacity-85">Piyush: “You said that yesterday.”</p>
          <p className="text-sm opacity-85">Avni: “Consistency is important.” 😂</p>
        </div>
      </Reveal>

      <Reveal delay={160}>
        <div className="space-y-3 rounded-3xl border border-destiny/25 bg-ink/40 p-5">
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-destiny">Case file 003</p>
          <h3 className="font-serif text-2xl">Professional Mimicry Artist</h3>
          <p className="font-serif text-lg">Why hire a comedian…</p>
          <p className="font-serif text-lg text-destiny">…when I married one?</p>
          {/* 🎬 Optional: set photos.mimicryClip in story-config.ts to an mp4 path */}
          {config.photos.mimicryClip ? (
            <video
              src={config.photos.mimicryClip}
              controls
              playsInline
              className="w-full rounded-2xl border border-destiny/30"
            />
          ) : (
            <div className="grid place-items-center rounded-2xl border border-dashed border-destiny/30 px-4 py-8 text-center text-[0.65rem] uppercase tracking-[0.3em] opacity-60">
              [ optional: add a funny clip ]
            </div>
          )}
        </div>
      </Reveal>
    </Chapter>
  );
}

export { Passcode };
