import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke"; 
import "./JokeList.css"; 

/**
 * Fetches jokes from API and displays them in a list with voting buttons.
 * Handles loading state, errors, and empty state.
 * Allows user to refresh jokes and vote on them.
 * Sorts jokes by vote descending.
 */
function JokeList({ numJokesToGet = 5 }) {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJokes = async () => {
      try {
        setIsLoading(true);
        let j = [];
        let seenJokes = new Set();

        while (j.length < numJokesToGet) {
          console.log("Making API request...");
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" },
          });
          console.log("API Response:", res.data);

          let { ...jokeObj } = res.data;

          if (!seenJokes.has(jokeObj.id)) {
            seenJokes.add(jokeObj.id);
            j.push({ ...jokeObj, votes: 0 });
          } else {
            console.error("duplicate found!");
          }
        }

        console.log("Setting jokes:", j);
        setJokes(j);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error("Error fetching jokes:", err);
        setIsLoading(false);
        setError("Couldn't fetch jokes. Please try again later.");
      } finally {
        console.log("Fetch logic complete.");
      }
    };

    fetchJokes();
  }, [numJokesToGet]);

  function generateNewJokes() {
    setJokes([]);
    setIsLoading(true);
    setError(null);
  }

  function vote(id, delta) {
    setJokes((allJokes) =>
      allJokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  }

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  return (
    <div className="JokeList">
      <button className="JokeList-getmore" onClick={generateNewJokes}>
        Get New Jokes
      </button>

      {isLoading && <div className="JokeList-loading">Loading...</div>}

      {error && <div className="JokeList-error">{error}</div>}

      {!isLoading && jokes.length === 0 && (
        <div>No jokes found, but hey - your life might be the joke!</div>
      )}

      {sortedJokes.map(({ joke, id, votes }) => (
        <Joke text={joke} key={id} id={id} votes={votes} vote={vote} />
      ))}
    </div>
  );
}

export default JokeList;
