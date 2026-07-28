import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TweetCard } from "@/components/feed/TweetCard";
import { tweets, users } from "@/data/mockData";

describe("TweetCard", () => {
  it("keeps action clicks independent from row navigation", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    const onLike = vi.fn();
    const tweet = tweets[0]!;
    const author = users.find((candidate) => candidate.id === tweet.userId)!;

    render(
      <TweetCard
        tweet={tweet}
        author={author}
        onNavigate={onNavigate}
        onLike={onLike}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: `Like: ${tweet.likes}` }),
    );

    expect(onLike).toHaveBeenCalledWith(tweet, true);
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it("renders generated post media with useful alternative text", () => {
    const tweet = tweets[0]!;
    const author = users.find((candidate) => candidate.id === tweet.userId)!;

    render(<TweetCard tweet={tweet} author={author} />);

    expect(
      screen.getByAltText(
        "Rain-washed city street at blue hour with a cyclist and warm shop lights",
      ),
    ).toBeInTheDocument();
  });
});
