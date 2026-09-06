import { useCallback, useEffect, useRef, useState } from "react";
import { config } from "@/data/story-config";
import { Chapter, DestinyButton, RedCircle, Reveal } from "./primitives";

/* ================================================================== */
/* GAME 1 — CATCH THE RED CIRCLE                                       */
/* ================================================================== */
export function CatchCircleGame({ done, onSolve }: { done: boolean; onSolve: () => void }) {
  const [solved, setSolved] = useState(done);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(14);
  const [playing, setPlaying] = useState(!done);
  const [feedback, setFeedback] = useState<string | null>(null);
  const arenaRef = useRef<HTMLDivElement>(null);

  const moveCircle = useCallback(() => {
    setPos({ x: 12 + Math.random() * 76, y: 12 + Math.random() * 70 });
  }, []);

  const start = () => {
    setSolved(false);
    setTaps(0);
    setTimeLeft(14);
    setPlaying(true);
    setFeedback(null);
    moveCircle();
  };

  useEffect(() => {
    if (!playing || solved) return;
    const timer = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(timer);
          setPlaying(false);
          setFeedback("Destiny escaped! 😂");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [playing, solved]);

  const tap = () => {
    if (!playing || solved) return;
    const next = taps + 1;
    setTaps(next);
    setFeedback("❤️ Found me.");
    if (next >= 5) {
      setSolved(true);
      setPlaying(false);
      setFeedback(null);
      onSolve();
    } else {
      window.setTimeout(() => setFeedback(null), 600);
      moveCircle();
    }
  };

  if (solved) {
    return (
      <Chapter id="game1" eyebrow="Destiny Test #1 🔴" title="DESTINY FOUND." tone="dark">
        <div className="animate-scale-in space-y-5 text-center">
          <RedCircle size={100} className="mx-auto">
            ✓
          </RedCircle>
          <p className="font-serif text-2xl text-blush">DESTINY FOUND. 🔴</p>
          <p className="text-sm opacity-80">Okay, you're good at this.</p>
          <p className="text-sm opacity-80">Maybe that's why you found me too.</p>
        </div>
      </Chapter>
    );
  }

  return (
    <Chapter id="game1" eyebrow="Destiny Test #1 🔴" title="CATCH THE RED CIRCLE" tone="dark">
      <Reveal>
        <p className="text-sm opacity-80">Apparently, destiny keeps moving.</p>
        <p className="text-sm opacity-80">Catch it before it disappears!</p>
        <p className="mt-2 text-[0.65rem] uppercase tracking-[0.3em] text-destiny">
          Tap the red circle 5 times
        </p>
      </Reveal>

      <div
        ref={arenaRef}
        className="relative h-80 w-full overflow-hidden rounded-3xl border border-destiny/30 bg-plum/30"
      >
        {playing ? (
          <button
            type="button"
            onClick={tap}
            aria-label="Catch the red circle"
            className="tap absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <RedCircle size={56} pulse={false}>
              🔴
            </RedCircle>
          </button>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <p className="font-serif text-xl text-blush">{feedback}</p>
            <DestinyButton onClick={start}>Try again</DestinyButton>
          </div>
        )}
      </div>

      {playing && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-destiny">Taps: {taps}/5</span>
          <span className="opacity-70">⏱ {timeLeft}s</span>
        </div>
      )}

      {feedback && playing && (
        <p className="animate-fade-up text-center text-sm text-blush">{feedback}</p>
      )}
    </Chapter>
  );
}

/* ================================================================== */
/* GAME 2 — AVOID THE BLOCK                                            */
/* ================================================================== */
export function AvoidBlockGame({ done, onSolve }: { done: boolean; onSolve: () => void }) {
  const [solved, setSolved] = useState(done);
  const [playing, setPlaying] = useState(!done);
  const [hit, setHit] = useState(false);
  const [piyushPos, setPiyushPos] = useState({ x: 10, y: 50 });
  const arenaRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef(false);
  const rafRef = useRef<number>(0);
  const blocksRef = useRef([
    { x: 35, y: 25, dx: 0, dy: 1.2 },
    { x: 55, y: 60, dx: 0, dy: -1 },
    { x: 75, y: 35, dx: 0, dy: 1.5 },
  ]);
  const [, force] = useState(0);

  const start = () => {
    setSolved(false);
    setHit(false);
    setPlaying(true);
    setPiyushPos({ x: 10, y: 50 });
    blocksRef.current = [
      { x: 35, y: 25, dx: 0, dy: 1.2 },
      { x: 55, y: 60, dx: 0, dy: -1 },
      { x: 75, y: 35, dx: 0, dy: 1.5 },
    ];
  };

  // Game loop
  useEffect(() => {
    if (!playing || solved) return;

    const loop = () => {
      const arena = arenaRef.current;
      if (!arena) return;
      const h = arena.clientHeight;
      const w = arena.clientWidth;

      blocksRef.current = blocksRef.current.map((b) => {
        let ny = b.y + b.dy;
        let ndy = b.dy;
        if (ny < 8) { ny = 8; ndy = -ndy; }
        if (ny > 92) { ny = 92; ndy = -ndy; }
        return { ...b, y: ny, dy: ndy };
      });

      // Check collision
      for (const b of blocksRef.current) {
        const dx = b.x - piyushPos.x;
        const dy = b.y - piyushPos.y;
        if (Math.sqrt(dx * dx + dy * dy) < 8) {
          setHit(true);
          setPlaying(false);
          return;
        }
      }

      // Check win
      if (piyushPos.x > 88) {
        setSolved(true);
        setPlaying(false);
        onSolve();
        return;
      }

      force((n) => n + 1);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, solved, piyushPos.x, piyushPos.y]);

  const handlePointer = (e: React.PointerEvent) => {
    if (!playing || solved) return;
    const arena = arenaRef.current;
    if (!arena) return;
    const rect = arena.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPiyushPos({ x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) });
  };

  if (solved) {
    return (
      <Chapter id="game2" eyebrow="Mini Game 2 🚫" title="CONNECTION ESTABLISHED" tone="dark">
        <div className="animate-scale-in space-y-5 text-center">
          <p className="font-serif text-3xl text-blush">❤️ CONNECTION ESTABLISHED</p>
          <p className="text-sm opacity-80">
            Thankfully, destiny eventually removed the block.
          </p>
        </div>
      </Chapter>
    );
  }

  return (
    <Chapter id="game2" eyebrow="Mini Game 2 🚫" title="SURVIVE THE BLOCK" tone="dark">
      <Reveal>
        <p className="text-sm opacity-80">Since you clearly remember what happened…</p>
        <p className="text-sm opacity-80">Let's see if Piyush can make it to Avni this time.</p>
        <p className="mt-2 text-[0.65rem] uppercase tracking-[0.3em] text-destiny">
          Drag Piyush ❤️ to Avni — avoid the 🚫 blocks
        </p>
      </Reveal>

      <div
        ref={arenaRef}
        className="relative h-80 w-full touch-none overflow-hidden rounded-3xl border border-destiny/30 bg-plum/30"
        onPointerDown={(e) => { dragRef.current = true; handlePointer(e); }}
        onPointerMove={(e) => { if (dragRef.current) handlePointer(e); }}
        onPointerUp={() => { dragRef.current = false; }}
        onPointerLeave={() => { dragRef.current = false; }}
      >
        {/* Avni target */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl" style={{ left: "92%", top: "50%" }}>
          {config.her === "Avni" ? "👸" : "❤️"}
        </div>

        {/* Piyush */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl transition-transform"
          style={{ left: `${piyushPos.x}%`, top: `${piyushPos.y}%` }}
        >
          ❤️
        </div>

        {/* Blocks */}
        {blocksRef.current.map((b, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-2xl"
            style={{ left: `${b.x}%`, top: `${b.y}%` }}
          >
            🚫
          </div>
        ))}
      </div>

      {!playing && hit && (
        <div className="space-y-4 text-center">
          <p className="font-serif text-xl text-blush">🚫 BLOCKED AGAIN!</p>
          <p className="text-sm opacity-70">Some things never change. 😂</p>
          <DestinyButton onClick={start}>Try again</DestinyButton>
        </div>
      )}

      {!playing && !hit && !solved && (
        <div className="text-center">
          <DestinyButton onClick={start}>Start</DestinyButton>
        </div>
      )}
    </Chapter>
  );
}

/* ================================================================== */
/* GAME 3 — AVNI CLEANING CHALLENGE                                    */
/* ================================================================== */
const cleaningObjects = [
  { id: "cushion", label: "Crooked cushion", emoji: "🛋️", x: 20, y: 30, imperfect: true },
  { id: "book", label: "Misaligned book", emoji: "📚", x: 55, y: 25, imperfect: true },
  { id: "dust", label: "Tiny dust speck", emoji: "💨", x: 75, y: 60, imperfect: true },
  { id: "glass", label: "Off-center glass", emoji: "🥃", x: 40, y: 65, imperfect: true },
  { id: "chair", label: "Crooked chair", emoji: "🪑", x: 80, y: 35, imperfect: true },
  { id: "sofa", label: "Sofa", emoji: "🛋️", x: 15, y: 70, imperfect: false },
  { id: "window", label: "Window", emoji: "🪟", x: 50, y: 15, imperfect: false },
  { id: "table", label: "Table", emoji: "🪵", x: 65, y: 75, imperfect: false },
];

export function CleaningGame({ done, onSolve }: { done: boolean; onSolve: () => void }) {
  const [solved, setSolved] = useState(done);
  const [cleaned, setCleaned] = useState<Set<string>>(done ? new Set(cleaningObjects.filter((o) => o.imperfect).map((o) => o.id)) : new Set());
  const [feedback, setFeedback] = useState<string | null>(null);

  const imperfectIds = cleaningObjects.filter((o) => o.imperfect).map((o) => o.id);

  const clean = (id: string, imperfect: boolean) => {
    if (solved) return;
    if (!imperfect) {
      setFeedback("That's already clean. Move on. 😂");
      window.setTimeout(() => setFeedback(null), 800);
      return;
    }
    if (cleaned.has(id)) return;
    const next = new Set(cleaned);
    next.add(id);
    setCleaned(next);
    setFeedback("🧹 CLEAN!");
    window.setTimeout(() => setFeedback(null), 600);

    if (next.size >= imperfectIds.length) {
      window.setTimeout(() => {
        setSolved(true);
        onSolve();
      }, 800);
    }
  };

  if (solved) {
    return (
      <Chapter id="game3" eyebrow="Mini Game 3 🧹" title="ULTRA CLEANING MODE" tone="dark">
        <div className="animate-scale-in space-y-5 text-center">
          <RedCircle size={100} className="mx-auto">
            🧹
          </RedCircle>
          <p className="font-serif text-2xl text-blush">ULTRA CLEANING MODE</p>
          <p className="font-serif text-xl text-destiny">ACTIVATED.</p>
          <p className="text-sm opacity-80">LEVEL: ULTRA HIGH — MAJOR</p>
          <p className="text-sm opacity-70">
            The maid has officially been declared unnecessary. 😂
          </p>
          <p className="font-serif text-lg text-blush">And yes… I love you anyway. ❤️</p>
        </div>
      </Chapter>
    );
  }

  return (
    <Chapter id="game3" eyebrow="Mini Game 3 🧹" title="AVNI CLEANING SIMULATOR" tone="dark">
      <Reveal>
        <p className="text-sm opacity-80">The maid has already cleaned the room.</p>
        <p className="text-sm opacity-80">But we both know that's not enough.</p>
        <p className="mt-2 text-[0.65rem] uppercase tracking-[0.3em] text-destiny">
          Tap everything that needs cleaning again
        </p>
      </Reveal>

      <div className="relative h-80 w-full overflow-hidden rounded-3xl border border-destiny/30 bg-plum/30">
        {cleaningObjects.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => clean(o.id, o.imperfect)}
            aria-label={o.label}
            className={`tap absolute -translate-x-1/2 -translate-y-1/2 text-3xl transition-all ${
              cleaned.has(o.id) ? "opacity-20 grayscale" : "opacity-90"
            }`}
            style={{ left: `${o.x}%`, top: `${o.y}%` }}
          >
            {o.emoji}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-destiny">Cleaned: {cleaned.size}/{imperfectIds.length}</span>
      </div>

      {feedback && (
        <p className="animate-fade-up text-center text-sm text-blush">{feedback}</p>
      )}
    </Chapter>
  );
}

/* ================================================================== */
/* GAME 4 — RED CIRCLE MAZE                                            */
/* ================================================================== */
const mazeLayout = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const mazeMilestones = [
  { row: 1, col: 1, label: "5th CLASS" },
  { row: 1, col: 7, label: "CRUSH" },
  { row: 3, col: 7, label: "BLOCK" },
  { row: 5, col: 7, label: "BEST FRIENDS" },
  { row: 5, col: 4, label: "YES" },
  { row: 5, col: 1, label: "MARRIAGE" },
  { row: 5, col: 0, label: "❤️", isGoal: true },
];

export function MazeGame({ done, onSolve }: { done: boolean; onSolve: () => void }) {
  const [solved, setSolved] = useState(done);
  const [player, setPlayer] = useState({ row: 1, col: 1 });
  const [visited, setVisited] = useState<Set<string>>(new Set(["1,1"]));
  const arenaRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef(player);
  const solvedRef = useRef(solved);
  playerRef.current = player;
  solvedRef.current = solved;

  const move = (dr: number, dc: number) => {
    if (solvedRef.current) return;
    const { row, col } = playerRef.current;
    const nr = row + dr;
    const nc = col + dc;
    if (nr < 0 || nr >= mazeLayout.length || nc < 0 || nc >= mazeLayout[0].length) return;
    const goal = mazeMilestones.find((m) => m.isGoal);
    const isGoal = Boolean(goal && nr === goal.row && nc === goal.col);
    if (mazeLayout[nr][nc] === 1 && !isGoal) return;
    setPlayer({ row: nr, col: nc });
    setVisited((prev) => new Set(prev).add(`${nr},${nc}`));

    if (isGoal) {
      setSolved(true);
      onSolve();
    }
  };

  // Touch/drag navigation
  useEffect(() => {
    if (solved) return;
    const arena = arenaRef.current;
    if (!arena) return;

    let touchStart: { x: number; y: number } | null = null;

    const handleStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      touchStart = { x: t.clientX, y: t.clientY };
    };

    const handleEnd = (e: TouchEvent) => {
      if (!touchStart) return;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - touchStart.x;
      const dy = t.clientY - touchStart.y;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (Math.max(absX, absY) < 20) return;

      if (absX > absY) move(0, dx > 0 ? 1 : -1);
      else move(dy > 0 ? 1 : -1, 0);
      touchStart = null;
    };

    arena.addEventListener("touchstart", handleStart, { passive: true });
    arena.addEventListener("touchend", handleEnd, { passive: true });
    return () => {
      arena.removeEventListener("touchstart", handleStart);
      arena.removeEventListener("touchend", handleEnd);
    };
  }, [solved]);

  // Keyboard navigation
  useEffect(() => {
    if (solved) return;
    const handleKey = (e: KeyboardEvent) => {
      let dr = 0,
        dc = 0;
      if (e.key === "ArrowUp") dr = -1;
      else if (e.key === "ArrowDown") dr = 1;
      else if (e.key === "ArrowLeft") dc = -1;
      else if (e.key === "ArrowRight") dc = 1;
      else return;
      e.preventDefault();
      move(dr, dc);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [solved]);

  if (solved) {
    return (
      <Chapter id="game4" eyebrow="Final Game 🔴" title="YOU FOUND ME." tone="dark">
        <div className="animate-scale-in space-y-5 text-center">
          <RedCircle size={100} className="mx-auto">
            ❤️
          </RedCircle>
          <p className="font-serif text-3xl text-blush">YOU FOUND ME. ❤️</p>
          <p className="text-sm opacity-80">Just like you always do.</p>
          <p className="text-sm opacity-70">One last secret is waiting below…</p>
        </div>
      </Chapter>
    );
  }

  return (
    <Chapter id="game4" eyebrow="Final Game 🔴" title="RED CIRCLE MAZE" tone="dark">
      <Reveal>
        <p className="text-sm opacity-80">You've spent years finding your way back to me.</p>
        <p className="text-sm opacity-80">Let's see if you can do it one more time.</p>
        <p className="mt-2 text-[0.65rem] uppercase tracking-[0.3em] text-destiny">
          Swipe to move — reach the ❤️
        </p>
      </Reveal>

      <div
        ref={arenaRef}
        className="mx-auto w-full max-w-xs touch-none select-none rounded-3xl border border-destiny/30 bg-plum/30 p-2"
      >
        {mazeLayout.map((row, ri) => (
          <div key={ri} className="flex">
            {row.map((cell, ci) => {
              const isPlayer = player.row === ri && player.col === ci;
              const milestone = mazeMilestones.find((m) => m.row === ri && m.col === ci);
              const isWall = cell === 1;
              const isVisited = visited.has(`${ri},${ci}`);
              return (
                <div
                  key={ci}
                  className={`relative aspect-square flex-1 ${
                    isWall
                      ? "bg-ink"
                      : "bg-plum/20"
                  } ${isVisited && !isWall ? "bg-destiny/10" : ""} m-px rounded-md flex items-center justify-center`}
                >
                  {isPlayer && (
                    <span className="h-4 w-4 rounded-full bg-destiny shadow-destiny animate-destiny-pulse" />
                  )}
                  {!isPlayer && milestone && (
                    <span className="text-center text-[0.45rem] leading-tight text-blush/70">
                      {milestone.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <DestinyButton variant="ghost" onClick={() => move(-1, 0)}>
          ↑
        </DestinyButton>
        <div className="flex gap-2">
          <DestinyButton variant="ghost" onClick={() => move(0, -1)}>
            ←
          </DestinyButton>
          <DestinyButton variant="ghost" onClick={() => move(1, 0)}>
            ↓
          </DestinyButton>
          <DestinyButton variant="ghost" onClick={() => move(0, 1)}>
            →
          </DestinyButton>
        </div>
        <p className="text-[0.6rem] uppercase tracking-[0.2em] text-destiny/70">or use arrow keys</p>
      </div>
    </Chapter>
  );
}
