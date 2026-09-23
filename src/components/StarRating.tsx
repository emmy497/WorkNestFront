import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  value: number; // 0-5
  max?: number;
  // Omit to render a read-only display (e.g. inside a candidate-facing
  // summary). Pass it to make the stars clickable.
  onChange?: (value: number) => void;
  size?: number; // px
}

// A row of 5 stars, filled up to `value`. Used both as a read-only display
// and, when `onChange` is given, as the actual rating input on the review
// screen — one component instead of two so they can never visually drift
// apart.
const StarRating = ({ value, max = 5, onChange, size = 16 }: StarRatingProps) => {
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  const interactive = Boolean(onChange);

  return (
    <div className="flex items-center gap-[3px]" role={interactive ? "radiogroup" : undefined}>
      {stars.map((star) => {
        const filled = star <= value;

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(star)}
            aria-label={`${star} out of ${max}`}
            aria-pressed={interactive ? filled : undefined}
            className={interactive ? "cursor-pointer" : "cursor-default"}
          >
            <FaStar
              style={{ width: size, height: size }}
              className={filled ? "text-[#FFC93C]" : "text-[#ECEBF0]"}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
