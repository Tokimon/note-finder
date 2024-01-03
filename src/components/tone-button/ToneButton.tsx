import { createSignal, For } from 'solid-js';
import { AIndex, noteOctaveName, notes, numberOfNotes, numberOfOctaves } from '../../utils/notes';

import styles from './ToneButton.module.css';

export type ToneButtonProps = {
  onToggle: (stream: MediaStream | null) => void;
};

export const ToneButton = ({ onToggle }: ToneButtonProps) => {
  const [loading, setLoading] = createSignal(false);
  const [streaming, setStreaming] = createSignal(false);

  const [tone, setTone] = createSignal('piano');
  const [noteIndex, setNoteIndex] = createSignal(AIndex);
  const [octave, setOctave] = createSignal(4);

  // TODO: Play tone: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Advanced_techniques#dial_up_%E2%80%94_loading_a_sound_sample

  return (
    <fieldset>
      <legend>Analyze tone</legend>

      <select onChange={(e) => setTone(e.currentTarget.value)}>
        <For each={['piano', 'bass', 'noise']}>{(t) => <option selected={tone() === t}>{t}</option>}</For>
      </select>

      <div class={styles.Selector}>
        <ul>
          <For each={Array(numberOfNotes)}>
            {(_, n) => <li classList={{ [styles.selected]: noteIndex() === n() }}>{notes[n()]}</li>}
          </For>
        </ul>

        <input
          type="range"
          min={0}
          max={numberOfNotes - 1}
          step={1}
          value={noteIndex()}
          onInput={(e) => setNoteIndex(parseInt(e.currentTarget.value))}
        />
      </div>

      <div class={styles.Selector}>
        <ul>
          <For each={Array(numberOfOctaves)}>
            {(_, n) => <li classList={{ [styles.selected]: octave() - 1 === n() }}>{n() + 1}</li>}
          </For>
        </ul>

        <input
          type="range"
          min={1}
          max={numberOfOctaves}
          step={1}
          value={octave()}
          onInput={(e) => setOctave(parseInt(e.currentTarget.value))}
        />
      </div>

      <button onClick={() => {}} disabled={loading()}>
        {streaming() ? 'STOP PLAYING' : `PLAY ${tone()}: ${noteOctaveName(notes[noteIndex()], octave())}`}
      </button>
    </fieldset>
  );
};
