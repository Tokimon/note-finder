import { batch, createSignal } from 'solid-js';

import { startMicrophone } from '../../utils/startMicrophone';

export type MicrophoneButtonProps = {
  onToggle: (stream: MediaStream | null) => void;
};

export const MicrophoneButton = ({ onToggle }: MicrophoneButtonProps) => {
  const [loading, setLoading] = createSignal(false);
  const [stopMicrophone, setMicrophoneStop] = createSignal<(() => void) | null>(null);

  const startRecordingMicrophone = async () => {
    setLoading(true);

    const { stop, stream } = await startMicrophone();

    onToggle(stream);

    setMicrophoneStop(() => () => {
      batch(() => {
        stop();
        setMicrophoneStop(null);
        onToggle(null);
      });
    });

    setLoading(false);
  };

  return (
    <button onClick={() => (stopMicrophone() || startRecordingMicrophone)()} disabled={loading()}>
      {stopMicrophone() ? 'STOP RECORDING' : 'START RECORDING'}
    </button>
  );
};
