export interface TweetSkeletonProps {
  media?: boolean;
  compact?: boolean;
  className?: string;
}

export function TweetSkeleton({
  media = false,
  compact = false,
  className = "",
}: TweetSkeletonProps) {
  return (
    <div
      className={[
        "tw-tweet-skeleton",
        compact ? "tw-tweet-skeleton--compact" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <span className="tw-skeleton tw-tweet-skeleton-avatar" />
      <div className="tw-tweet-skeleton-content">
        <span className="tw-skeleton tw-tweet-skeleton-name" />
        <span className="tw-skeleton tw-tweet-skeleton-line" />
        <span className="tw-skeleton tw-tweet-skeleton-line tw-tweet-skeleton-line--short" />
        {media && <span className="tw-skeleton tw-tweet-skeleton-media" />}
        <div className="tw-tweet-skeleton-actions">
          <span className="tw-skeleton" />
          <span className="tw-skeleton" />
          <span className="tw-skeleton" />
          <span className="tw-skeleton" />
        </div>
      </div>
    </div>
  );
}

export default TweetSkeleton;
