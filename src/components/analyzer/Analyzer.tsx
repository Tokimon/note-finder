import { createEffect, createSignal, on, onCleanup } from 'solid-js';

import { analyzeAudioStream } from '../../utils/analyzeAudioStream';
import { frequencyToNote } from '../../utils/notes';

import styles from './Analyzer.module.css';

type NoteDisplayProps = {
  stream: MediaStream | null;
};

const unknownNote = { note: '--', precision: 0 };

export const Analyzer = (props: NoteDisplayProps) => {
  const [note, setNote] = createSignal(unknownNote);

  // TODO
  // - Gather note information for a few ms (minimum time in a tempo given) before setting actual note
  //   - Use most predominant note
  //   - Determine the best precision

  createEffect(() => {
    const handlers = props.stream && analyzeAudioStream(props.stream);
    if (!handlers) return;

    let raf: number | undefined;

    const update = () => {
      raf = requestAnimationFrame(update);

      const frequency = handlers.analyze();
      const note = frequencyToNote(frequency);

      setNote(() => note || unknownNote);
    };

    update();

    onCleanup(() => {
      handlers.disconnect();
      raf && cancelAnimationFrame(raf);
    });
  });

  return (
    <div class={styles.Note}>
      {note().note}
      <i class={styles.Precision}>{note().precision}</i>
    </div>
  );
};
