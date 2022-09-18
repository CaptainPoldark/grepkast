import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import React, { useState } from "react";
import PodcastPlayer from "./PodcastPlayer";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function App() {
  const [rssFeed, setRssFeed] = useState(
    "https://anchor.fm/s/2fa50a94/podcast/rss"
  );
  const [rssList, setRssList] = useState({
    feeds: [
      { name: "The WAN Show", url: "https://anchor.fm/s/3cbbb3b8/podcast/rss" },
      {
        name: "Valuetainment",
        url: "https://anchor.fm/s/2714310c/podcast/rss",
      },
      { name: "PBD Podcast", url: "https://anchor.fm/s/2fa50a94/podcast/rss" },
      {
        name: "Darknet Diaries",
        url: "https://feeds.megaphone.fm/darknetdiaries",
      },
      {
        name: "Political Theory 101",
        url: "https://feeds.soundcloud.com/users/soundcloud:users:607750389/sounds.rss",
      },
    ],
  });
  const [tempRSSName, setTempRSSName] = useState();
  const [tempRSSURL, setTempRSSURL] = useState();
  const [showRSSInput, setShowRSSInput] = useState(false);
  const [showSavedPodcasts, setShowSavedPodcasts] = useState(false);

  const handleCloseRSSInput = () => setShowRSSInput(false);
  const handleShowRSSInput = () => setShowRSSInput(true);
  const handleCloseSaved = () => setShowSavedPodcasts(false);
  const handleShowSaved = () => setShowSavedPodcasts(true);

  const handleAddFeed = (event) => {
    event.preventDefault();
    const newRssList = rssList;
    newRssList.feeds = [
      ...newRssList.feeds,
      { name: tempRSSName, url: tempRSSURL },
    ];
    setRssList(newRssList);
  };

  const handleLoadFeedClick = (inputRssFeed) => {
    setRssFeed(inputRssFeed);
  };

  const handleInputChange = (event) => {
    if (event.target.id == "rssFeedName") {
      setTempRSSName(event.target.value);
      console.log(tempRSSName);
    }
    if (event.target.id == "rssFeedUrl") {
      setTempRSSURL(event.target.value);
      console.log(tempRSSURL);
    }
  };

  return (
    <div className="App">
      <div className="main-controller">
        <Button variant="primary" onClick={handleShowRSSInput}>
          Add New Podcast
        </Button>
        <Modal show={showRSSInput} onHide={handleCloseRSSInput}>
          <Modal.Header closeButton>
            <Modal.Title>Add A Podcast</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={(e) => handleAddFeed(e)}>
              <label htmlFor="rssFeedUrl">RSS Feed Name:</label>
              <input
                type="text"
                id="rssFeedName"
                name="rssFeedUrl"
                style={{ width: "80%" }}
                value={tempRSSName}
                onChange={(e) => handleInputChange(e)}
              />
              <label htmlFor="rssFeedUrl">RSS Feed URL:</label>
              <input
                type="text"
                id="rssFeedUrl"
                name="rssFeedUrl"
                style={{ width: "80%" }}
                value={tempRSSURL}
                onChange={(e) => setTempRSSURL(e.target.value)}
              />
              <Button
                variant="secondary"
                type="submit"
                value="Add Feed"
                onClick={handleCloseRSSInput}
              >
                Add Feed
              </Button>
            </form>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>

        <Button variant="primary" onClick={handleShowSaved}>
          Saved Podcasts
        </Button>
        <Modal show={showSavedPodcasts} onHide={handleCloseSaved}>
          <Modal.Header closeButton>
            <Modal.Title>Saved Podcasts</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="saved-podcasts">
              {rssList.feeds.map(({ name, url }) => (
                <Button
                  className="saved-podcast-button"
                  variant="primary"
                  value={url}
                  onClick={(e) => {
                    handleLoadFeedClick(e.target.value);
                    handleCloseSaved();
                  }}
                >
                  {name}
                </Button>
              ))}
            </div>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </div>

      {
        // <PodcastGrid rssfeed={rssFeed} height="50vh" weight="100%"></PodcastGrid>
      }
      <PodcastPlayer rssfeed={rssFeed}></PodcastPlayer>
    </div>
  );
}

export default App;
