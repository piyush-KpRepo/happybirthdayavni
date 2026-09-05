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
      <RedCircle size={96}>
        <span className="block h-4 w-4 rounded-full bg-destiny shadow-destiny" />
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
        <p className="text-sm text-cream/80">Cute • Crazy • Professional Comedian • Ultra Cleaner</p>
      </div>
      <div className={`mt-6 space-y-1 ${show(5)}`}>
        <p className="text-[0.65rem] uppercase tracking-[0.35em] text-destiny">Classification</p>
        <p className="font-serif text-2xl text-cream">WIFE ❤️</p>
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
            successTitle="ACCESS GRANTED 🔓"
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
/* CHAPTER 2 — THE LEGENDARY BLOCK (starts with a quiz)                */
/* ================================================================== */
export function ChapterTwo({ done, onUnlock }: { done: boolean; onUnlock: () => void }) {
  const [stage, setStage] = useState(done ? 5 : 0); // 0=quiz, 1=answered, 2=dialogue, 3=blocked, 4=twist, 5=done
  const [wrongAnswer, setWrongAnswer] = useState<number | null>(null);
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

  // Dialogue animation after quiz answered
  useEffect(() => {
    if (stage < 1 || stage >= 5) return;
    const timers = [600, 1800, 3200, 4200].map((ms, i) =>
      window.setTimeout(() => setStage((s) => Math.max(s, i + 2)), ms),
    );
    return () => timers.forEach(window.clearTimeout);
  }, [stage]);

  const quizOptions = [
    "Said yes ❤️",
    "Ran away 🏃‍♀️",
    "Said let's just be friends",
    "BLOCKED 🚫",
  ];

  const answerQuiz = (i: number) => {
    if (i === 3) {
      setStage(1);
    } else {
      setWrongAnswer(i);
      window.setTimeout(() => setWrongAnswer(null), 600);
    }
  };

  return (
    <Chapter
      id="ch2"
      eyebrow="Chapter 02 — The Legendary Block 🚫"
      title="THE LEGENDARY BLOCK"
      subtitle="11th Class"
      tone="dark"
    >
      <div ref={ref} className="space-y-5">
        {stage === 0 && (
          <div className="space-y-4 rounded-3xl border border-destiny/30 bg-plum/50 p-6">
            <p className="font-serif text-xl">What did Avni do when Piyush said…</p>
            <p className="font-serif text-3xl text-destiny text-center">"I LIKE YOU."</p>
            <div className="space-y-3 pt-2">
              {quizOptions.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => answerQuiz(i)}
                  className={`tap min-h-12 w-full rounded-2xl border border-destiny/35 bg-ink/50 px-5 py-3 text-left text-sm transition-colors hover:bg-destiny/15 ${
                    wrongAnswer === i ? "animate-shake border-destiny" : ""
                  }`}
                >
                  <span className="mr-3 text-destiny">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {stage >= 1 && stage < 5 && (
          <div className="animate-fade-up rounded-3xl border border-destiny/40 bg-destiny/15 p-5 text-center">
            <p className="font-serif text-2xl text-blush">CORRECT. 😂</p>
            <p className="mt-2 text-sm opacity-80">Apparently you remember this part.</p>
          </div>
        )}

        {stage >= 2 && (
          <div className="space-y-4 rounded-3xl border border-destiny/30 bg-plum/50 p-6">
            <div className="animate-fade-up">
              <p className="text-[0.6rem] uppercase tracking-[0.3em] text-destiny">{config.him}</p>
              <p className="font-serif text-2xl">"I like you."</p>
            </div>
            {stage >= 3 && (
              <div className="animate-fade-up">
                <p className="text-[0.6rem] uppercase tracking-[0.3em] text-destiny">{config.her}</p>
                <p className="font-serif text-2xl tracking-[0.3em]">…</p>
              </div>
            )}
            {stage >= 4 && (
              <div className="animate-scale-in rounded-2xl border border-destiny/50 bg-destiny/15 p-5 text-center">
                <p className="font-serif text-3xl text-blush">BLOCKED 🚫</p>
                <p className="mt-2 text-xs uppercase tracking-[0.3em] opacity-70">connection lost</p>
              </div>
            )}
          </div>
        )}

        {stage >= 5 && (
          <div className="animate-fade-up space-y-5">
            <p className="font-serif text-2xl text-destiny">
              And thus began one of the greatest plot twists in the history of {config.him} & {config.her}.
            </p>
            <p className="text-base opacity-80">
              {config.him} had finally confessed. {config.her} had other plans.
            </p>
            <Line delay={0}>But somehow… instead of disappearing from each other's lives…</Line>
            <p className="font-serif text-2xl">You became BEST FRIENDS.</p>
            {!done ? (
              <DestinyButton full onClick={onUnlock}>
                Best friends unlocked ❤️
              </DestinyButton>
            ) : (
              <p className="text-sm text-destiny">✓ Best friends unlocked</p>
            )}
          </div>
        )}
      </div>
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
  const [phase, setPhase] = useState<"idle" | "loading" | "yes" | "married">(done ? "married" : "idle");

  const confess = () => {
    setPhase("loading");
    window.setTimeout(() => {
      setPhase("yes");
      window.setTimeout(() => {
        setPhase("married");
        onUnlock();
      }, 2000);
    }, 2200);
  };

  return (
    <Chapter
      id="ch4"
      eyebrow="Chapter 03 — Round Two"
      title="Round Two"
      tone="dark"
    >
      <Line>After {config.her} got her second job…</Line>
      <Line delay={120}>
        {config.him} apparently looked at the history of this relationship and thought…
      </Line>
      <Line delay={240} className="text-destiny">
        "Let's try this one more time." 😂
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
        </div>
      )}

      {phase === "married" && (
        <div className="animate-fade-up space-y-5">
          <p className="font-serif text-3xl text-blush">SHE SAID YES.</p>
          <p className="font-serif text-2xl text-destiny">FINALLY.</p>
          <p className="text-sm opacity-80">
            After all those years… all those twists… and one legendary BLOCK…
          </p>
          <p className="font-serif text-2xl">We finally became US.</p>
          <p className="text-sm opacity-75">
            We spent {config.togetherFor}… and then… we got married. 💍
          </p>
          {!done ? (
            <DestinyButton full onClick={() => onUnlock()}>
              Continue ❤️
            </DestinyButton>
          ) : (
            <p className="text-sm text-destiny">✓ Chapter unlocked</p>
          )}
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

  useEffect(() => {
    if (complete) onPass();
  }, [complete, onPass]);
  const q = complete ? null : config.quiz[index];

  const answer = (i: number) => {
    if (!q) return;
    if (i === q.correct) {
      setWrong(null);
      setFeedback(q.after);
      window.setTimeout(() => {
        setFeedback(null);
        setIndex((n) => n + 1);
      }, 1800);
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
/* WEDDING CHAPTER                                                     */
/* ================================================================== */
export function WeddingChapter({ done, onUnlock }: { done: boolean; onUnlock: () => void }) {
  return (
    <Chapter
      id="wedding"
      eyebrow="Chapter 04"
      title="THE DAY WE BECAME HUSBAND & WIFE 💍"
      tone="dark"
    >
      <Line>After knowing you since school…</Line>
      <Line delay={80}>After all the twists…</Line>
      <Line delay={160}>After the crush…</Line>
      <Line delay={200}>The block…</Line>
      <Line delay={240}>Best friendship…</Line>
      <Line delay={280}>Another confession…</Line>
      <Line delay={320}>YES…</Line>
      <Line delay={360}>{config.togetherFor}…</Line>
      <Line delay={400}>And finally…</Line>
      <Reveal delay={440}>
        <p className="font-serif text-3xl text-blush">WE GOT MARRIED.</p>
      </Reveal>
      <Reveal delay={200}>
        <PhotoFrame photo={config.photos.wedding} />
      </Reveal>
      <Reveal>
        <p className="pt-2 text-center font-serif text-2xl tracking-[0.15em] text-gold">
          {config.marriedFor}
        </p>
      </Reveal>
      <Line delay={100}>But our story didn't stop there.</Line>
      <Line delay={150}>It was only beginning a new chapter.</Line>
      {!done ? (
        <Reveal>
          <DestinyButton full onClick={onUnlock}>
            Continue ❤️
          </DestinyButton>
        </Reveal>
      ) : (
        <p className="text-sm text-destiny">✓ Chapter unlocked</p>
      )}
    </Chapter>
  );
}

/* ================================================================== */
/* CHAPTER 5 — OUR ADVENTURES                                          */
/* ================================================================== */
const memories = [
  {
    tag: "Memory 01 — Your First Snowfall ❄️",
    title: "Your First Snowfall",
    body: [
      "Watching you experience snowfall in Austria for the first time…",
      "…is one of those memories I'll carry forever.",
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
    tag: "Memory 03 — Our Marriage 💍",
    title: "One of the biggest days of our lives.",
    body: [
      "After knowing you since school… after all the twists… after everything…",
      "I finally got to call you my wife.",
    ],
    photo: "marriage2" as const,
  },
];

export function ChapterFive({ done, onUnlock }: { done: boolean; onUnlock: () => void }) {
  return (
    <Chapter id="ch5" eyebrow="Chapter 05 — Our Adventures ❤️" title="OUR ADVENTURES">
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
          </article>
        </Reveal>
      ))}

      <Reveal>
        <div className="flex flex-col items-center gap-4 pt-4 text-center">
          <p className="font-serif text-xl">{config.marriedForShort}</p>
          <p className="font-serif text-xl">And still choosing each other every day.</p>
          <RedCircle size={90} />
          <p className="font-serif text-2xl text-destiny">Of course not.</p>
          <p className="text-sm opacity-75">We were always going in circles.</p>
          {!done ? (
            <DestinyButton full onClick={onUnlock}>
              Continue 🔴
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
/* THE AVNI REPORT                                                     */
/* ================================================================== */
const reportRows: [string, string][] = [
  ["Subject", "Avni"],
  ["Status", "Wife ❤️"],
  ["Personality", "Funny • Crazy • Cute"],
  ["Mimicry level", "Dangerously High 🎤"],
  ["Joke frequency", "Uncontrolled 😂"],
  ["Ultra-Cleaning Mode", "ULTRA HIGH — MAJOR 🧹"],
  ["Ability to ignore Piyush's \"No\"", "100% 😈"],
  ["Diet consistency", "Under investigation 🍕"],
  ["Husband", "Piyush"],
  ["Recommended punishment", "Unlimited hugs from husband ❤️"],
];

export function AvniReport({ done, onUnlock }: { done: boolean; onUnlock: () => void }) {
  return (
    <Chapter id="report" eyebrow="One last laugh" title="THE OFFICIAL AVNI REPORT 😂">
      <Reveal>
        <dl className="divide-y divide-destiny/20 overflow-hidden rounded-3xl border border-destiny/30 bg-plum/40">
          {reportRows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-5 py-3">
              <dt className="min-w-0 text-xs uppercase tracking-[0.2em] opacity-65">{k}</dt>
              <dd className="shrink-0 text-right text-sm text-blush">{v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal delay={80}>
        <div className="space-y-3 rounded-3xl border border-destiny/25 bg-ink/40 p-5">
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-destiny">Case file 001</p>
          <h3 className="font-serif text-2xl">The Cleaning Incident 🧹</h3>
          <p className="text-sm opacity-85">The maid came.</p>
          <p className="text-sm opacity-85">The maid cleaned.</p>
          <p className="text-sm opacity-85">The maid left.</p>
          <p className="text-sm opacity-85">Avni looked around.</p>
          <p className="text-sm opacity-85">Avni decided the cleaning needed another cleaning.</p>
          <p className="text-sm opacity-85">{config.him}: "But she literally just cleaned."</p>
          <p className="text-sm opacity-85">{config.her}: "I know."</p>
          <p className="font-serif text-lg text-destiny">ULTRA CLEANING MODE: ACTIVATED. 😂</p>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="space-y-2 rounded-3xl border border-destiny/25 bg-ink/40 p-5">
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-destiny">Case file 002</p>
          <h3 className="font-serif text-2xl">The Diet Plan 🍕</h3>
          <p className="text-sm opacity-85">Morning Avni: "Today I'm eating healthy."</p>
          <p className="text-sm opacity-85">Evening Avni: "Should we order something?"</p>
          <p className="text-sm opacity-85">{config.him}: "Didn't you say you're dieting?"</p>
          <p className="text-sm opacity-85">{config.her}: "It's a cheat day."</p>
          <p className="text-sm opacity-85">{config.him}: "You said that yesterday."</p>
          <p className="text-sm opacity-85">{config.her}: "Consistency is important." 😂</p>
        </div>
      </Reveal>

      <Reveal delay={160}>
        <div className="space-y-3 rounded-3xl border border-destiny/25 bg-ink/40 p-5">
          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-destiny">Case file 003</p>
          <h3 className="font-serif text-2xl">Professional Mimicry Artist 🎤</h3>
          <p className="font-serif text-lg">Why hire a comedian…</p>
          <p className="font-serif text-lg text-destiny">…when I married one?</p>
          <p className="text-sm opacity-80">Mimicry Level: ULTRA</p>
          <p className="text-sm opacity-80">Threat Level: Husband's sanity under investigation.</p>
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

      {!done && (
        <Reveal>
          <DestinyButton full onClick={onUnlock}>
            Continue to the challenge 🧹
          </DestinyButton>
        </Reveal>
      )}
    </Chapter>
  );
}

export { Passcode };
