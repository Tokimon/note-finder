import { Component, createSignal } from 'solid-js';

import { Analyzer } from '../analyzer/Analyzer';
import { MicrophoneButton } from '../microphone-button/MicrophoneButton';
import { ToneButton } from '../tone-button/ToneButton';

import styles from './App.module.css';

const App: Component = () => {
  const [stream, setStream] = createSignal<MediaStream | null>(null);

  return (
    <div class={styles.App}>
      <Analyzer stream={stream()} />

      <MicrophoneButton onToggle={setStream} />

      <ToneButton onToggle={setStream} />
    </div>
  );
};

export default App;
