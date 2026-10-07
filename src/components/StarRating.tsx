import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  size?: number;
}

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
