import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Joke from "./Joke";

describe("Joke", () => {
  const joke = {
    id: 1,
    text: "Test joke",
    votes: 0,
    vote: jest.fn(),
  };

  test("renders joke text", () => {
    render(<Joke {...joke} />);
    expect(screen.getByText(joke.text)).toBeInTheDocument();
  });

  test("calls vote when upVote clicked", () => {
    render(<Joke {...joke} />);
    const upVoteBtn = screen.getByRole("button", { name: /thumbs up/i });
    userEvent.click(upVoteBtn);
    expect(joke.vote).toHaveBeenCalledWith(joke.id, 1);
  });

  test("calls vote when downVote clicked", () => {
    render(<Joke {...joke} />);
    const downVoteBtn = screen.getByRole("button", { name: /thumbs down/i });
    userEvent.click(downVoteBtn);
    expect(joke.vote).toHaveBeenCalledWith(joke.id, -1);
  });

  test("displays vote count", () => {
    const votes = 5;
    render(<Joke {...joke} votes={votes} />);
    expect(screen.getByText(votes)).toBeInTheDocument();
  });
});
