import { useSpeech, useVoices } from 'react-text-to-speech';

const useTimeLeftSpeech = () => {
  const { voices } = useVoices();

  const { start: start10SecondsSpeech, stop: stop10SecondsSpeech } = useSpeech({
    text: '10 Seconds.',
    lang: 'en-US',
    voiceURI:
      voices?.[3]?.voiceURI || 'Microsoft George - English (United Kingdom)',
    pitch: 0.6,
    rate: 0.8,
  });

  const { start: start30SecondsSpeech, stop: stop30SecondsSpeech } = useSpeech({
    text: '30 Seconds.',
    lang: 'en-US',
    voiceURI:
      voices?.[3]?.voiceURI || 'Microsoft George - English (United Kingdom)',
    pitch: 0.6,
    rate: 0.8,
  });

  return {
    start10SecondsSpeech,
    stop10SecondsSpeech,
    start30SecondsSpeech,
    stop30SecondsSpeech,
  };
};

export default useTimeLeftSpeech;
