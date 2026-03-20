export type Viseme = 'CLOSED' | 'NEUTRAL' | 'A' | 'E' | 'I' | 'O' | 'U';
export type VisemeDuration = 'short' | 'medium' | 'long';

export interface VisemeFrame {
  viseme: Viseme;
  duration: VisemeDuration;
  count: number;
  ms: number;
}

export interface SpeechSegment {
  word: string;
  pauseMsAfter: number;
}

export interface NaturalSpeechFrame {
  viseme: Viseme;
  ms: number;
  kind: 'lead' | 'speech' | 'bridge' | 'pause' | 'settle';
  wordIndex: number;
}

interface CountedViseme {
  viseme: Viseme;
  count: number;
}

const ACCENTED_VOWEL_MAP: Record<string, string> = {
  á: 'a',
  é: 'e',
  í: 'i',
  ó: 'o',
  ú: 'u',
};

const BILABIAL_CHARS = new Set(['m', 'b', 'p']);
const VOWEL_CHARS = new Set(['a', 'e', 'i', 'o', 'u']);

const VOWEL_VISEMES = new Set<Viseme>(['A', 'E', 'I', 'O', 'U']);
const WIDE_VISEMES = new Set<Viseme>(['A', 'O', 'U']);

const DURATION_MS: Record<VisemeDuration, number> = {
  short: 140,
  medium: 220,
  long: 320,
};

const PUNCTUATION_PAUSE_MS: Record<string, number> = {
  ',': 150,
  ';': 160,
  ':': 170,
  '.': 240,
  '!': 240,
  '?': 240,
};

function stripSpanishDiacritics(input: string) {
  return input.toLowerCase().replace(/[áéíóú]/g, (match) => ACCENTED_VOWEL_MAP[match] ?? match);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeSpanishText(input: string) {
  return stripSpanishDiacritics(input)
    .replace(/[^\p{L}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isBilabial(char: string) {
  return BILABIAL_CHARS.has(char);
}

function isVowelChar(char: string) {
  return VOWEL_CHARS.has(char);
}

function toViseme(char: string): Viseme {
  switch (char) {
    case 'a':
      return 'A';
    case 'e':
      return 'E';
    case 'i':
      return 'I';
    case 'o':
      return 'O';
    case 'u':
      return 'U';
    case 'm':
    case 'b':
    case 'p':
      return 'CLOSED';
    default:
      return 'NEUTRAL';
  }
}

function collapseVisemes(sequence: Viseme[]): CountedViseme[] {
  const collapsed: CountedViseme[] = [];

  for (const viseme of sequence) {
    const previous = collapsed[collapsed.length - 1];

    if (previous?.viseme === viseme) {
      previous.count += 1;
      continue;
    }

    collapsed.push({ viseme, count: 1 });
  }

  return collapsed;
}

function smoothVisemes(sequence: CountedViseme[]): CountedViseme[] {
  const smoothed: CountedViseme[] = [];

  for (let index = 0; index < sequence.length; index += 1) {
    const current = sequence[index];
    const previous = smoothed[smoothed.length - 1];
    const next = sequence[index + 1];

    const shouldRemoveNeutral =
      current.viseme === 'NEUTRAL' &&
      current.count === 1 &&
      previous &&
      next &&
      VOWEL_VISEMES.has(previous.viseme) &&
      VOWEL_VISEMES.has(next.viseme);

    if (shouldRemoveNeutral) {
      continue;
    }

    if (previous?.viseme === current.viseme) {
      previous.count += current.count;
      continue;
    }

    smoothed.push({ ...current });
  }

  return smoothed;
}

function durationFromCount(count: number): VisemeDuration {
  if (count >= 3) return 'long';
  if (count === 2) return 'medium';
  return 'short';
}

function adjustedSpeechMs(frame: VisemeFrame) {
  let ms = frame.ms;

  switch (frame.viseme) {
    case 'CLOSED':
      ms *= 1.08;
      break;
    case 'NEUTRAL':
      ms *= 0.78;
      break;
    case 'A':
      ms *= 1.18;
      break;
    case 'E':
      ms *= 1.06;
      break;
    case 'I':
      ms *= 0.94;
      break;
    case 'O':
      ms *= 1.14;
      break;
    case 'U':
      ms *= 1.08;
      break;
  }

  if (frame.duration === 'long' && frame.viseme !== 'NEUTRAL') {
    ms += 20;
  }

  return clamp(Math.round(ms), frame.viseme === 'CLOSED' ? 90 : 72, 400);
}

function pushSpeechFrame(
  frames: NaturalSpeechFrame[],
  viseme: Viseme,
  ms: number,
  kind: NaturalSpeechFrame['kind'],
  wordIndex: number
) {
  if (ms <= 0) return;

  const previous = frames[frames.length - 1];

  if (previous?.viseme === viseme) {
    previous.ms += ms;

    if (kind === 'speech' || kind === 'settle') {
      previous.kind = kind;
      previous.wordIndex = wordIndex;
    }

    return;
  }

  frames.push({ viseme, ms, kind, wordIndex });
}

export function segmentSpanishSpeech(input: string): SpeechSegment[] {
  const tokens = stripSpanishDiacritics(input).match(/[\p{L}ñ]+|[.,!?;:]+/gu) ?? [];
  const segments: SpeechSegment[] = [];

  for (const token of tokens) {
    if (/^[\p{L}ñ]+$/u.test(token)) {
      const word = normalizeSpanishText(token);
      if (!word) continue;
      segments.push({ word, pauseMsAfter: 0 });
      continue;
    }

    const previous = segments[segments.length - 1];
    if (!previous) continue;

    let pauseMs = 0;
    for (const character of token) {
      pauseMs = Math.max(pauseMs, PUNCTUATION_PAUSE_MS[character] ?? 0);
    }

    previous.pauseMsAfter = Math.max(previous.pauseMsAfter, pauseMs);
  }

  return segments;
}

export function buildSpanishVisemeSequence(input: string): VisemeFrame[] {
  const normalized = normalizeSpanishText(input);
  const rawSequence: Viseme[] = [];

  for (let index = 0; index < normalized.length; ) {
    const char = normalized[index] ?? '';
    const next = normalized[index + 1] ?? '';
    const nextNext = normalized[index + 2] ?? '';
    const pair = `${char}${next}`;

    if (char === ' ') {
      index += 1;
      continue;
    }

    if (pair === 'ch' || pair === 'll' || pair === 'rr' || pair === 'qu') {
      rawSequence.push('NEUTRAL');
      index += 2;
      continue;
    }

    if (pair === 'gu' && (nextNext === 'e' || nextNext === 'i')) {
      rawSequence.push('NEUTRAL');
      index += 2;
      continue;
    }

    if (char === 'h') {
      index += 1;
      continue;
    }

    rawSequence.push(toViseme(char));

    if (isBilabial(char)) {
      const previousChar = normalized[index - 1] ?? '';
      const isWordStart = index === 0 || previousChar === ' ';
      const nextIsVowel = isVowelChar(next);
      const previousIsVowel = isVowelChar(previousChar);

      if ((isWordStart && nextIsVowel) || (previousIsVowel && nextIsVowel)) {
        rawSequence.push('CLOSED');
      }
    }

    index += 1;
  }

  return smoothVisemes(collapseVisemes(rawSequence)).map(({ viseme, count }) => {
    const duration = durationFromCount(count);

    return {
      viseme,
      duration,
      count,
      ms: DURATION_MS[duration],
    };
  });
}

export function buildNaturalSpanishSpeechTimeline(input: string): NaturalSpeechFrame[] {
  const segments = segmentSpanishSpeech(input);
  const frames: NaturalSpeechFrame[] = [];

  if (!segments.length) return frames;

  pushSpeechFrame(frames, 'NEUTRAL', 105, 'lead', -1);

  segments.forEach((segment, wordIndex) => {
    const sequence = buildSpanishVisemeSequence(segment.word);

    sequence.forEach((frame, frameIndex) => {
      const previous = frames[frames.length - 1];
      const currentIsVowel = VOWEL_VISEMES.has(frame.viseme);
      const isWordInitialClosed = frameIndex === 0 && frame.viseme === 'CLOSED';

      if (isWordInitialClosed) {
        pushSpeechFrame(frames, 'CLOSED', 42, 'bridge', wordIndex);
      }

      if (previous?.viseme === 'CLOSED' && currentIsVowel) {
        pushSpeechFrame(frames, 'NEUTRAL', 28, 'bridge', wordIndex);
      }

      if (previous && WIDE_VISEMES.has(previous.viseme) && frame.viseme === 'CLOSED') {
        pushSpeechFrame(frames, 'CLOSED', 36, 'bridge', wordIndex);
      }

      pushSpeechFrame(frames, frame.viseme, adjustedSpeechMs(frame), 'speech', wordIndex);
    });

    const defaultPauseMs = wordIndex === segments.length - 1 ? 180 : 92;
    const pauseMs = Math.max(segment.pauseMsAfter, defaultPauseMs);

    pushSpeechFrame(frames, 'NEUTRAL', pauseMs, wordIndex === segments.length - 1 ? 'settle' : 'pause', wordIndex);
  });

  return frames;
}
