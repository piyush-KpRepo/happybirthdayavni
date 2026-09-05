import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { config } from "@/data/story-config";
import { useStoryProgress, type Step } from "@/hooks/useStoryProgress";
import { DestinyButton, Passcode, RedCircle, Reveal } from "@/components/story/primitives";
import {
  AvniReport,
  AvniTest,
  ChapterFive,
  ChapterFour,
  ChapterOne,
  ChapterThree,
  ChapterTwo,
  CirclePuzzle,
  EntryGate,
  TopSecret,
} from "@/components/story/parts";
import { FinalAnimation, FinalLevel, LoveLetter, MusicButton } from "@/components/story/finale";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Red Circle of Destiny — For Avni ❤️" },
      {
        name: "description",
        content:
          "An interactive love story for Avni, from Piyush. Solve the clues, unlock the chapters, and follow the red circle that kept bringing us back to each other.",
      },
      { property: "og:title", content: "The Red Circle of Destiny — For Avni ❤️" },
      {
        property: "og:description",
        content:
          "A secret, interactive birthday story: clues, passcodes, memories and one red circle of destiny.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Story,
});

/* progress rail */
const rail = [
  { key: "ch1", label: "01" },
  { key: "ch2", label: "02" },
  { key: "ch3", label: "03" },
  { key: "ch4", label: "04" },
  { key: "ch5", label: "05" },
  { key: "final", label: "❤️" },
] as const;

function ProgressRail({ has }: { has: (s: Step) => boolean }) {
  return (
    <nav
      aria-label="Chapter progress"
      className="sticky top-0 z-30 flex justify-center gap-2 bg-ink/85 px-3 py-2 backdrop-blur"
    >
      {rail.map((r) => {
        const on = has(r.key as Step);
        return (
          <a
            key={r.key}
            href={on ? `#${r.key}` : undefined}
            aria-disabled={!on}
            className={`grid h-9 w-9 place-items-center rounded-full border text-[0.6rem] tracking-wider transition-all ${
              on
                ? "border-destiny bg-destiny/25 text-blush shadow-destiny"
                : "pointer-events-none border-cream/15 text-cream/25"
            }`}
          >
            {r.label}
          </a>
        );
      })}
    </nav>
  );
}

/* a locked teaser shown where a chapter isn't unlocked yet */
function LockedTeaser({ text }: { text: string }) {
  return (
    <div className="px-5 py-16 text-center opacity-60">
      <RedCircle size={54} pulse={false} className="mx-auto">
        🔒
      </RedCircle>
      <p className="mt-4 text-xs uppercase tracking-[0.3em]">{text}</p>
    </div>
  );
}

function Story() {
  const { has, unlock, reset, hydrated } = useStoryProgress();
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (hydrated && has("entered")) setShowIntro(false);
  }, [hydrated, has]);

  if (!hydrated) {
    return (
      <main className="grid min-h-screen place-items-center bg-ink">
        <RedCircle size={80} />
      </main>
    );
  }

  if (showIntro && !has("entered")) {
    return <TopSecret onEnter={() => setShowIntro(false)} />;
  }

  return (
    <main className="min-h-screen bg-background">
      <MusicButton />
      <ProgressRail has={has} />

      <h1 className="sr-only">The Red Circle of Destiny — an interactive love story for Avni</h1>

      {!has("entered") ? (
        <EntryGate onSolved={() => unlock("entered")} />
      ) : (
        <>
          <ChapterOne done={has("ch1")} onClue={() => unlock("ch1")} />

          {has("ch1") ? (
            <ChapterTwo done={has("ch2")} onUnlock={() => unlock("ch2")} />
          ) : (
            <LockedTeaser text="Chapter 02 locked — find the clue above" />
          )}

          {/* clue chain: the legendary block is also the key to chapter 03 */}
          {has("ch2") && !has("ch3") && (
            <section className="px-5 py-12 sm:px-8">
              <div className="mx-auto w-full max-w-md">
                <Passcode
                  gate={config.gates.blocked}
                  onSolved={() => unlock("ch3")}
                  successTitle="ACCESS GRANTED."
                  successNote="Ruthless. Efficient. Iconic."
                />
              </div>
            </section>
          )}

          {has("ch3") && (
            <ChapterThree done={has("ch4")} onUnlock={() => unlock("ch4")} />
          )}

          {has("ch4") && <ChapterFour done={has("quiz")} onUnlock={() => unlock("quiz")} />}

          {has("quiz") && <AvniTest done={has("ch5")} onPass={() => unlock("ch5")} />}

          {has("ch5") && <ChapterFive done={has("puzzle")} onUnlock={() => unlock("puzzle")} />}

          {has("puzzle") && <CirclePuzzle done={has("inside")} onSolve={() => unlock("inside")} />}

          {has("inside") && <AvniReport />}

          {/* clue chain: your private inside joke guards the letter section */}
          {has("inside") && !has("letter") && (
            <section className="bg-ink px-5 py-14 sm:px-8">
              <div className="mx-auto w-full max-w-md">
                <p className="mb-5 text-center text-[0.65rem] uppercase tracking-[0.4em] text-destiny">
                  Final security check
                </p>
                <Passcode
                  gate={config.gates.inside}
                  onSolved={() => unlock("letter")}
                  cta="Verify 🔐"
                  successTitle="IDENTITY CONFIRMED."
                  successNote="Only one person on earth could answer that."
                />
              </div>
            </section>
          )}

          {has("letter") && (
            <>
              <LoveLetter done={has("opened")} onOpen={() => unlock("opened")} />
              {has("opened") && (
                <FinalLevel done={has("final")} onReveal={() => unlock("final")} />
              )}
              {has("final") && <FinalAnimation />}
            </>
          )}

          <footer className="space-y-4 bg-ink px-5 py-12 text-center">
            <Reveal>
              <DestinyButton variant="ghost" onClick={reset}>
                Restart the story 🔁
              </DestinyButton>
            </Reveal>
            {/* --------------------------------------------------------
                EDITING NOTE (for Piyush only)
                Everything personal lives in: src/data/story-config.ts
                • photos  → put files in /public/photos and set the paths
                • music   → /public/audio/soundtrack.mp3
                • passcodes, clues, quiz, love letter → same file
               -------------------------------------------------------- */}
            <p className="mx-auto max-w-sm text-[0.6rem] leading-relaxed text-cream/25">
              Editing note: change photos, passwords, clues and the letter in
              src/data/story-config.ts — photos go in /public/photos, song in /public/audio.
            </p>
          </footer>
        </>
      )}
    </main>
  );
}
