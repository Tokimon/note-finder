const A4 = 440;
const AIndex = 9;
const numberOfOctaves = 9; // 0 .. 8

export const notes = [
  "c",
  "db",
  "d",
  "eb",
  "e",
  "f",
  "gb",
  "g",
  "ab",
  "a",
  "bb",
  "b"
] as const;

export let highestFrequency = -Infinity;
export let lowestFrequency = Infinity;

const numberOfNotes = notes.length;
const _2_12 = Math.pow(2, 1 / numberOfNotes);

const noteFrequencies: Record<string, number> = {};
const frequencyToNoteMap: Record<number, string> = {};

const totalNotes = numberOfNotes * numberOfOctaves;

const getNoteInfo = (n: number) => {
  const octave = Math.floor(n / numberOfNotes);
  const index = Math.floor(n % numberOfNotes);
  const name = notes[index] + octave;

  const pow = numberOfNotes * (octave - 4) - (index - AIndex);
  const frequency = A4 * Math.pow(_2_12, pow);

  return { octave, index, name, frequency };
};

const finalNoteIndex = totalNotes - 1;

for (let n = 0; n <= finalNoteIndex; n++) {
  const note = getNoteInfo(n);

  noteFrequencies[note.name] = note.frequency;

  if (n === finalNoteIndex) highestFrequency = note.frequency;
  if (n === 0) lowestFrequency = note.frequency;

  if (n > 0) {
    const prev = getNoteInfo(n - 1);
    const threshold = Math.ceil((note.frequency - prev.frequency) / 2);

    for (let j = Math.floor(note.frequency); j < prev.frequency; j++)
      frequencyToNoteMap[j] = j > threshold ? prev.name : note.name;
  }
}

export const frequencyToNote = (htz: number) => {
  const freq = Math.max(Math.min(Math.floor(htz), highestFrequency), lowestFrequency);
  return frequencyToNoteMap[freq];
};
