import { fft } from 'kissfft-wasm';
import { AudioInfo } from './audioInfo';

export const correlateFrequency = (audio: AudioInfo) => fft(audio.loadFrequencies());