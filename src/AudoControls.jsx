import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import {
  BsPlayCircleFill as Play,
  BsFillPauseCircleFill as Pause,
} from "react-icons/bs";

import { BiSkipNext as Next, BiSkipPrevious as Prev } from "react-icons/bi";
import { RiSpeedFill as Speed } from "react-icons/ri";

const AudioControls = ({
  isPlaying,
  onPlayPauseClick,
  onPrevClick,
  onNextClick,
  showNextButton,
  changeSpeed,
  isReady,
}) => (
  <div className="audio-controls">
    <button
      type="button"
      className="prev"
      aria-label="Previous"
      onClick={onPrevClick}
    >
      <Prev />
    </button>
    {isPlaying ? (
      <button
        type="button"
        className="pause"
        onClick={() => onPlayPauseClick(false)}
        aria-label="Pause"
      >
        <Pause />
      </button>
    ) : (
      <button
        type="button"
        className="play"
        onClick={() => onPlayPauseClick(true)}
        aria-label="Play"
        disabled={isReady}
      >
        <Play />
      </button>
    )}
    <button
      type="button"
      className="next"
      aria-label="Next"
      onClick={onNextClick}
    >
      <Next />
    </button>
    <br />
    <br />

    <Dropdown drop="up">
      <Dropdown.Toggle variant="dark" id="speed-selector">
        <a>
          <h5 className="speed">{">>"}</h5>
        </a>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item
          onClick={(e) => changeSpeed(e.target.innerHTML)}
          value="0.5"
        >
          0.5
        </Dropdown.Item>
        <Dropdown.Item
          onClick={(e) => changeSpeed(e.target.innerHTML)}
          value="1"
        >
          1
        </Dropdown.Item>
        <Dropdown.Item
          onClick={(e) => changeSpeed(e.target.innerHTML)}
          value="1.25"
        >
          1.25
        </Dropdown.Item>
        <Dropdown.Item
          onClick={(e) => changeSpeed(e.target.innerHTML)}
          value="1.5"
        >
          1.5
        </Dropdown.Item>
        <Dropdown.Item
          onClick={(e) => changeSpeed(e.target.innerHTML)}
          value="1.75"
        >
          1.75
        </Dropdown.Item>
        <Dropdown.Item
          onClick={(e) => changeSpeed(e.target.innerHTML)}
          value="2"
        >
          2
        </Dropdown.Item>
        <Dropdown.Item
          onClick={(e) => changeSpeed(e.target.innerHTML)}
          value="2.25"
        >
          2.25
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  </div>
);
export default AudioControls;
