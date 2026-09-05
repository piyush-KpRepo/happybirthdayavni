/* =====================================================================
 *  ✏️  EDIT EVERYTHING HERE — names, photos, passwords, clues, letter.
 *  Photos: drop your image files in  /public/photos/  and set the `src`
 *  below, e.g. src: "/photos/school.jpg". Leave src: null to keep the
 *  elegant placeholder frame.
 *  Music: drop an mp3 at /public/audio/soundtrack.mp3 (or change the path).
 * ===================================================================== */

export type Photo = {
  /** Put your file in /public/photos and write the path here, or null */
  src: string | null;
  label: string;
  alt: string;
};

export const config = {
  her: "Avni",
  him: "Piyush",

  /** 🎵 Replace this file with your own song (public/audio/soundtrack.mp3) */
  music: {
    src: "/audio/soundtrack.mp3",
    label: "Play our soundtrack",
  },

  /* --- 🔐 PASSCODES ------------------------------------------------
   * Each gate accepts any string in `accept` (case/space insensitive).
   * Make them as personal as you like — only she should be able to guess.
   * ----------------------------------------------------------------- */
  gates: {
    entry: {
      question: "What's the first thing that started all of this?",
      hint: "Think back to the time when Piyush first developed a certain little problem…",
      accept: ["crush"],
      wrong: ["❌ Nope.", "Nice try, Avni.", "Hint: It wasn't your diet."],
    },
    blocked: {
      question: "What did Avni turn Piyush into in 11th class?",
      hint: "One tap. One button. One legendary decision.",
      accept: ["blocked", "block"],
      wrong: ["❌ Not quite.", "You did it with one tap, remember?"],
    },
    /** 👉 CHANGE THIS ONE — make it an inside joke only you two know. */
    inside: {
      question: "Our private password (only you would know this one)",
      hint: "The thing we always say to each other when nobody's listening.",
      accept: ["always", "hamesha"], // ← replace with your inside joke
      wrong: ["❌ Hmm. Try again.", "Nobody else on earth knows this. Except you."],
    },
    letter: {
      question: "This is the place where you experienced something for the first time with me.",
      hint: "It was cold. It was white. You couldn't stop smiling.",
      accept: ["austria"],
      wrong: ["❌ Not it.", "It was cold, and you were glowing."],
    },
    final: {
      question: "Where did I get to watch you experience your first snowfall?",
      hint: "Same answer. Some places you never forget.",
      accept: ["austria"],
      wrong: ["❌ Almost.", "Snow. Mountains. You, laughing."],
    },
  },

  /* --- 📸 PHOTOS ---------------------------------------------------- */
  photos: {
    school: { src: null, label: "ADD SCHOOL PHOTO", alt: "School days" } as Photo,
    friends: { src: null, label: "ADD BEST FRIENDS PHOTO", alt: "Best friends" } as Photo,
    austria: { src: null, label: "ADD AUSTRIA PHOTO", alt: "First snowfall in Austria" } as Photo,
    flight: { src: null, label: "ADD FLIGHT PHOTO", alt: "First international flight" } as Photo,
    wedding: { src: null, label: "ADD WEDDING PHOTO", alt: "Our wedding" } as Photo,
    final: { src: null, label: "ADD YOUR FAVORITE PHOTO HERE", alt: "Us" } as Photo,
    /** optional funny clip — set to an mp4 in /public/photos or leave null */
    mimicryClip: null as string | null,
  },

  marriedFor: "6 MONTHS MARRIED ❤️",
  togetherFor: "2.5 YEARS TOGETHER ❤️",

  /* --- 💌 THE LETTER ------------------------------------------------ */
  letter: `Okay… jokes apart.

If someone had told the 5th-class version of me that the girl I had a crush on would one day become my wife, I probably wouldn't have believed them.

We took the longest possible route.

Crush → confession → BLOCK → best friends → college → second confession → YES → 2.5 years together → marriage.

But maybe that's what makes our story ours.

We didn't have a straight line.

We had a red circle.

No matter how far life took us, somehow we always came back to each other.

You are my crush.

My best friend.

My crazy person.

My favourite comedian.

And now, my wife.

And honestly…

I wouldn't want this story any other way.

Happy Birthday, Avni.

I love you.

— Piyush ❤️`,

  /* --- 😂 QUIZ ------------------------------------------------------ */
  quiz: [
    {
      q: "What happens when Piyush says…",
      sub: "“Please don't do that.”",
      options: [
        "Avni listens immediately ❤️",
        "Avni thinks about it",
        "Avni does exactly that 😈",
        "Piyush gives up",
      ],
      correct: 2,
      after: "Correct. Scientists have been unable to explain this phenomenon.",
    },
    {
      q: "Avni starts a diet at…",
      sub: "",
      options: ["8 AM", "10 AM", "Monday", "Every single morning"],
      correct: 3,
      after: "Excellent. And how long does it last?",
    },
    {
      q: "Diet plan at 8 AM… fast food order at 7 PM…",
      sub: "What happened?",
      options: ["Failure", "Cheat day", "Strategic nutrition", "Avni logic™"],
      correct: 3,
      after: "RESULT: 100% Avni. 0% surprised.",
    },
  ],
} as const;

/** normalises an answer before comparing */
export const matches = (input: string, accept: readonly string[]) =>
  accept.includes(input.trim().toLowerCase().replace(/\s+/g, " "));
