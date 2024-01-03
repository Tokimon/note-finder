const A4 = 440;
export const AIndex = 9;
export const numberOfOctaves = 9; // 0 .. 8

export const notes = ['c', 'c#/db', 'd', 'd#/eb', 'e', 'f', 'f#/gb', 'g', 'g#/ab', 'a', 'a#/bb', 'b'] as const;
export const numberOfNotes = notes.length;

export let highestFrequency = -Infinity;
export let lowestFrequency = Infinity;

const _2_12 = Math.pow(2, 1 / numberOfNotes);

const noteFrequencies: Record<string, { prev?: string; frequency: number; next?: string }> = {};
const frequencyToNoteMap: Record<number, string> = {};

const totalNotes = numberOfNotes * numberOfOctaves;

export const noteOctaveName = (note: string, octave: number) => note.replace('/', octave + '/') + octave;

const getNoteInfo = (n: number) => {
  const octave = Math.floor(n / numberOfNotes);
  const index = Math.floor(n % numberOfNotes);
  const name = noteOctaveName(notes[index], octave);

  const pow = numberOfNotes * (octave - 4) - (AIndex - index);
  const frequency = A4 * Math.pow(_2_12, pow);

  return { octave, index, name, frequency };
};

const finalNoteIndex = totalNotes - 1;
let prev;

for (let n = 0; n <= finalNoteIndex; n++) {
  const note = getNoteInfo(n);
  const { name, frequency } = note;
  const flooredCurrentFreq = Math.floor(frequency);

  noteFrequencies[name] = { frequency, prev: prev?.name };

  if (n === 0) lowestFrequency = frequency;
  if (n === finalNoteIndex) highestFrequency = frequency;

  if (prev) {
    const prevNote = noteFrequencies[prev.name];
    if (prevNote) prevNote.next = name;

    const flooredPrevFreq = Math.floor(prev.frequency);
    const diff = flooredCurrentFreq - flooredPrevFreq + 1;
    const threshold = Math.floor(diff / 2);

    for (let i = 0; i <= diff; i++) {
      // i < threshold ? { name: prev.name, accuracy: (threshold - i) / threshold } : { name, accuracy: i / diff };
      frequencyToNoteMap[flooredPrevFreq + i] = i < threshold ? prev.name : name;
    }
  }

  prev = note;
}

export const frequencyToNote = (htz: number) => {
  const note = frequencyToNoteMap[Math.floor(htz)];
  if (!note) return null;

  const exactNote = noteFrequencies[note];
  let precision = 1;

  if (htz > exactNote.frequency) {
    if (!exactNote.next) {
      precision = 2;
    } else {
      const { frequency } = noteFrequencies[exactNote.next];
      const span = frequency - exactNote.frequency;
      const diff = frequency - htz;
      precision = diff / span;
    }
  } else if (htz < exactNote.frequency) {
    if (!exactNote.prev) {
      precision = -1;
    } else {
      const { frequency } = noteFrequencies[exactNote.prev];
      const span = exactNote.frequency - frequency;
      const diff = htz - frequency;
      precision = diff / span;
    }
  }

  return { note, precision };
};
