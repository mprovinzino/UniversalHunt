import { Star } from 'lucide-react';
import type { CompletionRating } from '../../types';

interface StarRatingProps {
  stars: CompletionRating;
  maxStars?: number;
  color?: string;
  size?: number;
}

export default function StarRating({
  stars,
  maxStars = 3,
  color = '#F59E0B',
  size = 16,
}: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < stars ? color : 'none'}
          color={i < stars ? color : '#CBD5E1'}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}
