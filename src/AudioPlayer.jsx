import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import AudioControls from "./AudoControls";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Offcanvas from "react-bootstrap/Offcanvas";

const AudioPlayer = ({ episodes, metaData }) => {

  const [episodeIndex, setEpisodeIndex] = useState(0);
  const [episodeProgress, setEpisodeProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [runTime, setRunTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [persistProgressIndex, setPersistProgressIndex] = useState(Number);
  const [persistProgress, setPersistProgress] = useState([]);
  const [showHistory, setShowhistory] = useState(false);
  const [showAboutEpisode, setShowAboutEpisode] = useState(false);

  let { title, episodeImage, sourceAudio, description, pubDate } =
    episodes[episodeIndex];
  const { channelImage, channelTitle, channelLink } = metaData;

  const audioRef = useRef(new Audio(sourceAudio));
  const intervalRef = useRef();
  const isReady = useRef(false);
  const handleCloseHistory = () => setShowhistory(false);
  const handleShowHistory = () => setShowhistory(true);
  const handleCloseAboutEpisode = () => setShowAboutEpisode(false);
  const handleShowAboutEpisode = () => setShowAboutEpisode(true);

  const { duration } = audioRef.current;

  const converToPercentage = () => {
    let temp = (episodeProgress / duration) * 100;

    return temp;
  };
  const currentPercentage = duration ? `${converToPercentage}%` : "0%";

  const cleanCurrentPercentage = duration ? converToPercentage().toString() : 0;

  const remaining = duration
    ? new Date((duration - episodeProgress) * 1000).toISOString().slice(11, 19)
    : "";

  const tempRunTime = duration
    ? new Date(duration * 1000).toISOString().slice(11, -5)
    : "Ready";

  const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #777), color-stop(${currentPercentage}, #FFF))
  `;

  function findPersistIndex() {
    const index = persistProgress.findIndex((object) => {
      return object.sourceAudio === sourceAudio;
    });

    setPersistProgressIndex(index);

    if (index == -1) {
      setPersistProgress([
        ...persistProgress,
        {
          title,
          channelTitle,
          channelImage,
          episodeImage,
          sourceAudio,
          episodeProgress: 0,
          cleanCurrentPercentage,
        },
      ]);
    }

    return index;
  }

  const toNextEpisode = () => {
    setIsPlaying(false);

    if (episodeIndex - 1 < 0) {
      setEpisodeIndex(episodes.length - 1);
      setEpisodeProgress(0);
    } else {
      setEpisodeIndex(episodeIndex - 1);
      setEpisodeProgress(0);
    }
  };

  const toPrevEpisode = () => {
    setIsPlaying(false);

    isReady.current = false;

    if (episodeIndex < episodes.length - 1) {
      setEpisodeIndex(episodeIndex + 1);
    } else {
      setEpisodeIndex(0);
    }
  };

  const startTimer = () => {
    clearInterval(intervalRef.current);
    findPersistIndex();

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        setIsPlaying(false);
      } else {
        const tempUpdatedPersist = persistProgress;
        findPersistIndex();
        tempUpdatedPersist[persistProgressIndex].episodeProgress =
          audioRef.current.currentTime;
        tempUpdatedPersist[persistProgressIndex].currentPercentage =
          cleanCurrentPercentage;
        setPersistProgress(tempUpdatedPersist);

        setRemainingTime(remaining);
        setEpisodeProgress(
          persistProgress[persistProgressIndex].episodeProgress
        );
      }
    }, [1000]);
  };

  const onScrub = (value) => {
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    const tempUpdatedPersist = persistProgress;
    tempUpdatedPersist[persistProgressIndex].episodeProgress = value;
    setRemainingTime(remaining);
    setEpisodeProgress(persistProgress[persistProgressIndex].episodeProgress);

    setPersistProgress(tempUpdatedPersist);
  };

  const onScrubEnd = () => {
    if (!isPlaying) {
      setIsPlaying(true);
    }

    startTimer();
  };

  useEffect(() => {
    setEpisodeIndex(0);
  }, [episodes]);

  useEffect(() => {
    const trackUpdateRemaining = duration
      ? new Date((duration - episodeProgress) * 1000)
          .toISOString()
          .slice(11, 19)
      : "";

    const tempRunTime = duration
      ? new Date(duration * 1000).toISOString().slice(11, -5)
      : "Ready";

    setRemainingTime(trackUpdateRemaining);
    setRunTime(tempRunTime);
    setEpisodeProgress(0);
  }, [duration]);

  useEffect(() => {
    const checkIndex = findPersistIndex();

    if (checkIndex != -1 && checkIndex != undefined) {
      setPersistProgressIndex(checkIndex);
      audioRef.current.currentTime =
        persistProgress[checkIndex].episodeProgress;
    }
  }, [episodeIndex, audioRef.current]);

  useEffect(() => {
    setRunTime(tempRunTime);
    if (isPlaying) {
      audioRef.current.play();

      startTimer();
    } else {
      audioRef.current.pause();
    }
  });

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  });

  useEffect(() => {
    audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    audioRef.current.pause();
    audioRef.current = new Audio(sourceAudio);
    setPlaybackRate(1);

    const checkIndex = findPersistIndex();

    if (checkIndex != -1 && checkIndex != undefined) {
      setPersistProgressIndex(checkIndex);
      audioRef.current.currentTime =
        persistProgress[checkIndex].episodeProgress;
      setRunTime(tempRunTime);
    }

    findPersistIndex();

    if (isReady.current) {
      audioRef.current.pause();
      setIsPlaying(false);

      startTimer();
    } else {
      isReady.current = true;
    }
  }, [episodeIndex, episodes]);

  return (
    <div className="podcast-player">
      <div className="podcast-player-inner">
        <div className="episode-info">
          <img
            className="episode-poster"
            src={episodeImage}
            alt={`Poster for ${title} episode by ${channelTitle}`}
          />
          <h3 className="episode-title">{title}</h3>
          <h3 className="author-text">{channelTitle}</h3>

          <input
            type="range"
            value={episodeProgress}
            step="1"
            min="0"
            max={duration ? duration : `${duration}`}
            className="progress"
            onChange={(e) => onScrub(e.target.value)}
            onMouseUp={onScrubEnd}
            onKeyUp={onScrubEnd}
            style={{ background: trackStyling }}
          />
          <div className="runtime-display">
            <p>{remainingTime ? remainingTime : ""}</p>
            <p>{runTime}</p>
          </div>
          <AudioControls
            isPlaying={isPlaying}
            onPrevClick={toPrevEpisode}
            onNextClick={toNextEpisode}
            onPlayPauseClick={setIsPlaying}
            showNextButton={episodeIndex != 0}
            changeSpeed={setPlaybackRate}
          />
        </div>
        <div className="podcast-history-modal">
          <div className="podcast-footer">
            <Button variant="primary" onClick={handleShowHistory}>
              History
            </Button>
            <p>playback speed: {playbackRate}x</p>
            <div
              className="about-episode-button"
              onClick={handleShowAboutEpisode}
              style={{ color: "white" }}
            >
              <img className="channel-image" src={channelImage} />
              <br />
              More Info
            </div>
          </div>

          <Modal show={showHistory} onHide={handleCloseHistory}>
            <Modal.Header closeButton>
              <Modal.Title>Episode History</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {persistProgress.map(
                ({ channelTitle, title, episodeProgress, currentPercentage }) =>
                  episodeProgress > 0 ? (
                    <div>
                      <p>
                        {channelTitle} - {title} Played:{" "}
                        {new Date(episodeProgress * 1000)
                          .toISOString()
                          .slice(11, -5)}{" "}
                        {currentPercentage < 10
                          ? currentPercentage.slice(0, 3)
                          : currentPercentage.slice(0, 4)}
                        %
                      </p>
                    </div>
                  ) : (
                    ""
                  )
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseHistory}>
                Close History
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
      <Offcanvas show={showAboutEpisode} onHide={handleCloseAboutEpisode}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>About This Episode</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <h4>{title}</h4>
          <p>Published: {pubDate.toString()}</p>
          <br />
          <br />
          <div dangerouslySetInnerHTML={{ __html: description }}></div>
          <br />
          <br />
          <a href={channelLink} target="_blank">
            {channelLink}
          </a>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default AudioPlayer;
