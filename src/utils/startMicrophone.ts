import { rfft } from 'kissfft-wasm';
import { frequencyToNote } from './notes';

export async function startMicrophone(onNoteUpdate: (note: string) => void) {
  const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

  let rafId: number;
  const fftSize = 2048;
  const frequencies = new Float32Array(fftSize);
  
  const context = new AudioContext();
  const analyser = context.createAnalyser();
  const gainNode = context.createGain();
  const { sampleRate } = context

  try {
    gainNode.gain.value = 0;
    analyser.smoothingTimeConstant = 0;
    analyser.fftSize = fftSize;

    gainNode.connect(context.destination);

    const microphoneStream = context.createMediaStreamSource(audioStream);
    microphoneStream.connect(analyser);
    analyser.connect(gainNode);
  } catch(err) {
    console.error(err);
  }

  const updatePitch = () => {
    rafId = requestAnimationFrame(updatePitch);
    
    analyser.getFloatTimeDomainData(frequencies);
    const pitch = rfft(frequencies);

    // Figure out precision of note
    // - Create references to notes before and after in initial note parsing
    // - Calculate percentage of deviation depending on the distance to notes before and after
    // - Figure out why there are undefined values in the list
    let strongestSignal = 0;
    let strongestFrequency = 0;

    for (let i=0; i <= fftSize; i++) {
      const signal = Math.abs(pitch[i]);

      if (signal >= 10 && signal > strongestSignal) {
        strongestSignal = signal;
        strongestFrequency = i * sampleRate / fftSize;
      }
    }
    
    const note = frequencyToNote(strongestFrequency);

    onNoteUpdate(note);
  }

  updatePitch();

  const stopMicrophone = () => {
    audioStream.getAudioTracks().forEach((track) => track.stop());
    analyser.disconnect();
    cancelAnimationFrame(rafId)
  };

  return stopMicrophone;
}