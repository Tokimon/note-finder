export type AudioInfo = {
  context: AudioContext;
  analyser: AnalyserNode;
  gain: GainNode;
  frequencies: Float32Array;
  fftSize: number;
  loadFrequencies: () => Float32Array;
};

export function AudioInfo(fftSize: number): AudioInfo {
  const context = new AudioContext();
  const analyser = context.createAnalyser();
  const gain = context.createGain();
  const frequencies = new Float32Array(fftSize);

  gain.gain.value = 0;
  analyser.smoothingTimeConstant = 0;
  analyser.fftSize = fftSize;

  gain.connect(context.destination);

  const loadFrequencies = () => {
    analyser.getFloatTimeDomainData(frequencies);
    return frequencies;
  };

  return {
    context,
    analyser,
    gain,
    frequencies,
    fftSize,
    loadFrequencies
  };
}