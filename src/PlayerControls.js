import React from "react";

function PlayerControls(props) {
  return (
    <div>
      <button onClick={() => props.SkipControl(false)}>Back</button>
      <button onClick={() => props.setIsPlaying(!props.isPlaying)}>
        Play/Pause
      </button>
      <button onClick={() => props.SkipControl()}></button>
    </div>
  );
}

export default PlayerControls;
