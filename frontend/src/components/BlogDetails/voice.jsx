import React from "react";
import { HiOutlineSpeakerWave, HiOutlineSpeakerXMark } from "react-icons/hi2";

const Voice = ({ voice, setVoice, blog }) => {
  const speakBlog = (text) => {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    const isBangla = /[\u0980-\u09FF]/.test(text);

    const voices = window.speechSynthesis.getVoices();

    // try Bangla voice first
    let voice =
      voices.find((v) => v.lang.includes("bn")) ||
      voices.find((v) => v.lang.includes("en"));

    if (voice) speech.voice = voice;

    speech.lang = isBangla ? "bn-BD" : "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
  };

  const stopVoice = () => {
    window.speechSynthesis.cancel();
    setVoice(false);
  };

  return (
    <div>
      {voice ? (
        <button
          onClick={() => {
            stopVoice();
            setVoice(false);
          }}
          className="fixed bottom-5 right-5 z-50 
         text-black font-semibold 
         py-3 px-6 
         rounded-full 
         shadow-lg hover:shadow-xl 
         transition-all duration-300 
         flex items-center gap-2
         border border-white/20 cursor-pointer bg-white/80"
        >
          <HiOutlineSpeakerXMark />
          Stop
        </button>
      ) : (
        <button
          onClick={() => {
            speakBlog(blog.content);
            setVoice(true);
          }}
          className="fixed bottom-5 right-5 z-50 
         text-black font-semibold 
         py-3 px-6 
         rounded-full 
         shadow-lg hover:shadow-xl 
         transition-all duration-300 
         flex items-center gap-2
         border border-white/20 cursor-pointer bg-white/80"
        >
          <HiOutlineSpeakerWave />
          Listen
        </button>
      )}
    </div>
  );
};

export default Voice;
