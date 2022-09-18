import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import AudioPlayer from "./AudioPlayer";

function PodcastPlayer(props) {
  const [playerState, setPlayerState] = useState([]);
  const [metaData, setMetaData] = useState({});

  useEffect(() => {
    fetch(props.rssfeed)
      .then((response) => response.text())
      .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
      .then((data) => {
        const tempMetaData = {};
        tempMetaData.channelImage = data.querySelector("image").children[0]
          ? (tempMetaData.channelImage =
              data.querySelector("image").children[0].innerHTML)
          : (tempMetaData.channelImage =
              data.querySelector("image").attributes.href.value);
        tempMetaData.channelTitle = data.querySelector("image").children[1]
          ? data.querySelector("image").children[1].innerHTML
          : data.querySelector("title").innerHTML;
        tempMetaData.channelLink = data.querySelector("link").attributes.href
          ? data.querySelector("link").attributes.href.value
          : data.querySelector("image").children[2].innerHTML;

        const itemList = data.querySelectorAll("item");
        let html = ``;
        const items = [];
        itemList.forEach((e) => {
          items.push({
            pubDate: new Date(e.querySelector("pubDate").textContent),
            title: e.querySelector("title").textContent,
            sourceAudio: e.querySelector("enclosure").getAttribute("url"),
            description: e.querySelector("description").textContent,
            episodeImage: e.querySelector("image").attributes.href.value,
          });
        });
        setMetaData(tempMetaData);
        setPlayerState(items);
      });
  }, [props.rssfeed]);

  return playerState.length >= 1 ? (
    <AudioPlayer episodes={playerState} metaData={metaData} />
  ) : (
    "Player loading"
  );
}

export default PodcastPlayer;
