import { Component, createMemo, createSignal } from 'solid-js';
// import { AudioInfo } from '../utils/audioInfo';
import { startMicrophone } from '../utils/startMicrophone';

import styles from './App.module.css';

// const audio = AudioInfo(2048);

const App: Component = () => {
  const [stop, setStop] = createSignal<(() => void) | null>(null);

  const start = async () => {
    const stopMicrophone = await startMicrophone((note) => { console.log(note); });
    setStop(() => () => {
      stopMicrophone();
      setStop(null);
    })
  }


  return (
    <div class={styles.App}>
      {!!stop() ? 'RUNNING' : 'STOPPED'}<br/>
      <button onClick={() => (stop() || start)()}>RECORD</button>
    </div>
  );
};

export default App;
