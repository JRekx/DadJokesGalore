/**
 * Joke component renders a joke with voting buttons and vote count.
 * Accepts a joke object with id, text, votes props and vote callback.
 * Renders joke text and vote area with up/down buttons calling callbacks on click.
 */
import React from "react";
import "./Joke.css";

function Joke({ vote, votes, text, id }) {
  const upVote = () => vote(id, +1);
  const downVote = () => vote(id, -1);

  return (
    <div className="Joke">
      <div className="Joke-votearea">
        <button onClick={upVote}>
          <i className="fas fa-thumbs-up" />
        </button>

        <button onClick={downVote}>
          <i className="fas fa-thumbs-down" />
        </button>

        {votes}
      </div>

      <div className="Joke-text">{text}</div>
    </div>
  );
}

export default Joke;
