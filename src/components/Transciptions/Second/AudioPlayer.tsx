import React, { useState, useRef, useEffect } from "react";
import styles from "./AudioPlayer.module.css";
import { BsArrowLeftShort } from "react-icons/bs";
import { BsArrowRightShort } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
type AudioPlayerProps = React.MutableRefObject<HTMLAudioElement> & {
  duration: number;
  currentTime: number;
  isPlaying: boolean;
};
const AudioPlayer = () => {
  // state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // references
  const audioPlayer = useRef() as AudioPlayerProps; // reference our audio component
  const progressBar = useRef<HTMLInputElement>(null); // reference our progress bar
  const animationRef = useRef<number | null>(null); // reference the animation
  useEffect(() => {
    if (audioPlayer.current && audioPlayer.current.duration) {
      const seconds = Math.floor(audioPlayer.current.duration);
      setDuration(seconds);
      if (progressBar.current) {
        progressBar.current.max = String(seconds);
      }
    }
  }, [
    audioPlayer?.current?.onloadedmetadata,
    audioPlayer?.current?.readyState,
  ]);
  const backThirty = () => {
    if (progressBar.current) {
      progressBar.current.value = (
        Number(progressBar.current.value) - 30
      ).toString();
      changeRange();
    }
  };
  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying); // Changed 'Animation' to 'animationRef'
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current as number); // Changed 'Animation' to 'animationRef';
    }
  };

  const whilePlaying = () => {
    if (progressBar.current) {
      progressBar.current.value = audioPlayer.current.currentTime.toString();
      changePlayerCurrentTime();
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

  const changeRange = () => {
    if (progressBar.current) {
      audioPlayer.current.currentTime = parseFloat(progressBar.current.value);
      changePlayerCurrentTime();
    }
  };

  const changePlayerCurrentTime = () => {
    if (progressBar.current) {
      progressBar.current.style.setProperty(
        "--seek-before-width",
        `${(Number(progressBar.current.value) / duration) * 100}%`
      );
      setCurrentTime(Number(progressBar.current.value)); // Convert the value to a number
    }
  };

  const forwardThirty = () => {
    if (progressBar.current) {
      progressBar.current.value = String(
        Number(progressBar.current.value) + 30
      );
      changeRange();
    }
  };

  function calculateTime(currentTime: number): React.ReactNode {
    throw new Error("Function not implemented.");
  }

  return (
    <div className={styles.audioPlayer}>
      <audio
        ref={audioPlayer}
        src="https://cdn.simplecast.com/audio/cae8b0eb-d9a9-480d-a652-0defcbe047f4/episodes/af52a99b-88c0-4638-b120-d46e142d06d3/audio/500344fb-2e2b-48af-be86-af6ac341a6da/default_tc.mp3"
        preload="metadata"
      ></audio>
      <button className={styles.forwardBackward} onClick={backThirty}>
        <BsArrowLeftShort /> 30
      </button>
      <button onClick={togglePlayPause} className={styles.playPause}>
        {isPlaying ? <FaPause /> : <FaPlay className={styles.play} />}
      </button>
      <button className={styles.forwardBackward} onClick={forwardThirty}>
        30 <BsArrowRightShort />
      </button>

      {/* current time */}
      <div className={styles.currentTime}>{calculateTime(currentTime)}</div>

      {/* progress bar */}
      <div>
        <input
          type="range"
          className={styles.progressBar}
          defaultValue="0"
          ref={progressBar}
          onChange={changeRange}
        />
      </div>

      {/* duration */}
      <div className={styles.duration}>
        {duration && !isNaN(duration) && calculateTime(duration)}
      </div>
    </div>
  );
};

export { AudioPlayer };
