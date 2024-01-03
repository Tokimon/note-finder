export async function startMicrophone() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const stop = () => stream.getAudioTracks().forEach((track) => track.stop());

  return { stop, stream };
}
