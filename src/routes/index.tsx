import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStoryProgress, type Step } from "@/hooks/useStoryProgress";
import { DestinyButton, RedCircle, Reveal } from "@/components/story/primitives";
import {
  AvniReport,
  AvniTest,
  ChapterFive,
  ChapterFour,
  ChapterOne,
  ChapterThree,
  ChapterTwo,
  EntryGate,
  TopSecret,
  WeddingChapter,
} from "@/components/story/parts";
import { FinalAnimation, FinalLevel, LoveLetter, MusicButton } from "@/components/story/finale";
import { AvoidBlockGame, CatchCircleGame, CleaningGame, MazeGame } from "@/components/story/games";

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
  { key: "wedding", label: "04" },
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
    <main className="min-h-screen bg-background pb-20">
      <MusicButton />
      <ProgressRail has={has} />

      <h1 className="sr-only">The Red Circle of Destiny — an interactive love story for Avni</h1>

      {!has("entered") ? (
        <EntryGate onSolved={() => unlock("entered")} />
      ) : (
        <>
          {/* Chapter 1 — 5th class / crush */}
          <ChapterOne done={has("ch1")} onClue={() => unlock("ch1")} />

          {/* Mini Game 1 — Catch the Red Circle */}
          {has("ch1") && (
            <CatchCircleGame done={has("game1")} onSolve={() => unlock("game1")} />
          )}

          {/* Chapter 2 — The Legendary Block */}
          {has("game1") ? (
            <ChapterTwo done={has("ch2")} onUnlock={() => unlock("ch2")} />
          ) : (
            has("ch1") && <LockedTeaser text="Chapter 02 locked — catch the red circle first" />
          )}

          {/* Mini Game 2 — Avoid the Block */}
          {has("ch2") && (
            <AvoidBlockGame done={has("game2")} onSolve={() => unlock("game2")} />
          )}

          {/* Best Friends chapter */}
          {has("game2") ? (
            <ChapterThree done={has("ch3")} onUnlock={() => unlock("ch3")} />
          ) : (
            has("ch2") && <LockedTeaser text="Chapter 03 locked — survive the block first" />
          )}

          {/* Second Confession / YES */}
          {has("ch3") && (
            <ChapterFour done={has("ch4")} onUnlock={() => unlock("ch4")} />
          )}

          {/* Avni Quiz */}
          {has("ch4") && <AvniTest done={has("quiz")} onPass={() => unlock("quiz")} />}

          {/* Wedding chapter */}
          {has("quiz") ? (
            <WeddingChapter done={has("wedding")} onUnlock={() => unlock("wedding")} />
          ) : (
            has("ch4") && <LockedTeaser text="Wedding chapter locked — pass the Avni Test first" />
          )}

          {/* Adventures after marriage */}
          {has("wedding") ? (
            <ChapterFive done={has("ch5")} onUnlock={() => unlock("ch5")} />
          ) : (
            has("quiz") && <LockedTeaser text="Chapter 05 locked — unlock the wedding first" />
          )}

          {/* Official Avni Report */}
          {has("ch5") && (
            <AvniReport done={has("report")} onUnlock={() => unlock("report")} />
          )}

          {/* Mini Game 3 — Cleaning Challenge */}
          {has("report") && (
            <CleaningGame done={has("game3")} onSolve={() => unlock("game3")} />
          )}

          {/* Locked Love Letter */}
          {has("game3") && (
            <LoveLetter done={has("opened")} onOpen={() => unlock("opened")} />
          )}

          {/* Final Game — Red Circle Maze */}
          {has("opened") && (
            <MazeGame done={has("game4")} onSolve={() => unlock("game4")} />
          )}

          {/* Final Photo Reveal */}
          {has("game4") && (
            <FinalLevel done={has("final")} onReveal={() => unlock("final")} />
          )}

          {/* Final Animation */}
          {has("final") && <FinalAnimation />}

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
