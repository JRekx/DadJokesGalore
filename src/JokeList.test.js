import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JokeList from "./JokeList";

describe("JokeList", () => {
  test("displays loading state", () => {
    render(<JokeList />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("displays error message", async () => {
    jest
      .spyOn(global, "fetch")
      .mockRejectedValueOnce(new Error("Failed to fetch"));

    render(<JokeList />);

    expect(
      await screen.findByText(/couldn't fetch jokes/i)
    ).toBeInTheDocument();
  });

  test("displays no jokes message", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      json: async () => ({ jokes: [] }),
    });

    render(<JokeList />);

    expect(await screen.findByText(/no jokes found/i)).toBeInTheDocument();
  });

  test("calls API and displays jokes", async () => {
    const jokes = [
      { id: "1", joke: "Test joke 1" },
      { id: "2", joke: "Test joke 2" },
    ];

    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      json: async () => ({ jokes }),
    });

    render(<JokeList />);

    const jokeElements = await screen.findAllByTestId(/joke/i);
    expect(jokeElements).toHaveLength(2);
    expect(jokeElements[0]).toHaveTextContent("Test joke 1");
    expect(jokeElements[1]).toHaveTextContent("Test joke 2");
  });

  test("votes on joke", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      json: async () => ({
        jokes: [{ id: "1", joke: "Test joke" }],
      }),
    });

    render(<JokeList />);

    const joke = await screen.findByTestId("joke-1");
    userEvent.click(within(joke).getByRole("button", { name: /thumbs up/i }));
    expect(within(joke).getByText(/votes: 1/i)).toBeInTheDocument();
  });
});
