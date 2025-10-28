import { Star } from 'lucide-react';
import { getProductReviews } from '@/lib/actions/product';

interface ReviewsSectionProps {
  productId: string;
}

export async function ReviewsSection({ productId }: ReviewsSectionProps) {
  const reviews = await getProductReviews(productId);

  if (reviews.length === 0) {
    return (
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        <div className="text-center py-12 bg-light-100 rounded-lg">
          <p className="text-dark-500">No reviews yet. Be the first to review this product!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Reviews ({reviews.length})</h2>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-light-200 pb-6 last:border-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-light-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-dark-500">
                {new Date(review.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <p className="font-semibold mb-1">{review.author}</p>
            {review.title && (
              <h3 className="font-medium mb-2">{review.title}</h3>
            )}
            <p className="text-dark-700 leading-relaxed">{review.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
