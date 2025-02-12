import React, { useState, useRef, useEffect, useCallback } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import H5AudioPlayer from "react-h5-audio-player";
import { throttle } from "lodash";
import { useCurrentTime } from "@/config/util/context/useCurrentTimeContext";
import { FaPlayCircle } from "react-icons/fa";
import { FaCirclePause, FaCirclePlay } from "react-icons/fa6";
import { TbArrowForwardUp, TbArrowBackUp } from "react-icons/tb";
type AudioPlayerProps = React.MutableRefObject<HTMLAudioElement> & {
  duration: number;
  currentTime: number;
  isPlaying: boolean;
};
export default function AudioController({ audio }: { audio: string }) {
  const [trackIndex, setTrackIndex] = useState(0);
  const { currentTimeStamp, setCurrentTimeStamp } = useCurrentTime();
  const audioRef = useRef<H5AudioPlayer | null>(null);

  // Throttled function for updating current time
  const throttledSetCurrentTime = useRef(
    throttle((time) => {
      setCurrentTimeStamp(time);
    }, 1000)
  ).current; // More frequent updates for smoother UI

  useEffect(() => {
    if (!audioRef.current || !audioRef?.current?.audio) return;
    const audioElem = audioRef?.current.audio.current;
    if (!audioElem) return;

    const handleTimeUpdate = () => {
      if (audioElem) {
        const currentTime = audioElem.currentTime;
        throttledSetCurrentTime(currentTime);
      }
    };

    audioElem.addEventListener("timeupdate", handleTimeUpdate);

    // Cleanup function to remove the event listener
    return () => {
      audioElem.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [throttledSetCurrentTime]);

  useEffect(() => {
    // Seek to new time only if the difference is significant to avoid playback interruption
    const currentTime = audioRef?.current?.audio?.current?.currentTime ?? 0;
    if (
      audioRef.current &&
      audioRef.current.audio.current &&
      Math.abs(currentTimeStamp - currentTime) > 0.5
    ) {
      audioRef.current.audio.current.currentTime = currentTimeStamp;
    }
  }, [currentTimeStamp]);

  return (
    <div className="audio-player">
      <AudioPlayer
        layout="horizontal-reverse"
        className="w-full h-[70px]"
        src={audio}
        ref={audioRef}
        showSkipControls={true}
        showJumpControls={false}
        showDownloadProgress={false}
        customAdditionalControls={[]}
        customVolumeControls={[]}
        customIcons={{
          play: <FaCirclePlay color="#C77DFF" />,
          pause: <FaCirclePause color="#C77DFF" />,
          next: <TbArrowForwardUp color="#C77DFF" />,
          previous: <TbArrowBackUp color="#C77DFF" />,
        }}
        onClickNext={() => setCurrentTimeStamp(currentTimeStamp + 5)}
        onClickPrevious={() =>
          setCurrentTimeStamp(Math.max(0, currentTimeStamp - 5))
        }
        onEnded={() =>
          setTrackIndex((prevTrack) =>
            prevTrack < audio.length - 1 ? prevTrack + 1 : 0
          )
        }
      />
    </div>
  );
}
