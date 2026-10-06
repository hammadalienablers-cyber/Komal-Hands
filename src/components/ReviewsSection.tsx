import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus, ThumbsUp, Sparkles, X } from 'lucide-react';
import { REVIEWS } from '../data/reviews';
import { ReviewItem } from '../types';

export const ReviewsSection: React.FC = () => {
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(REVIEWS);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);

  // New review form state
  const [newAuthor, setNewAuthor] = useState('');
  const [newCity, setNewCity] = useState('Lahore');
  const [newRating, setNewRating] = useState(5);
  const [newItem, setNewItem] = useState('Pastel Butterfly Hair Clips');
  const [newComment, setNewComment] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  const filteredReviews = reviewsList.filter((rev) => {
    if (filterRating === 'all') return true;
    return rev.rating === filterRating;
  });

  const handleHelpfulClick = (id: string) => {
    setReviewsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: newAuthor,
      rating: newRating,
      date: 'Just now',
      city: newCity,
      comment: newComment,
      verified: true,
      itemPurchased: newItem,
      helpfulCount: 1,
    };

    setReviewsList([newRev, ...reviewsList]);
    setSubmittedFeedback(true);
    setTimeout(() => {
      setSubmittedFeedback(false);
      setIsWriteReviewOpen(false);
      setNewAuthor('');
      setNewComment('');
    }, 1500);
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FBF9F5] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-stone-200">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-800">
              Real Customer Stories
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-medium tracking-tight mt-1">
              Loved by Thousands Across Pakistan
            </h2>
            <p className="text-sm text-stone-500 mt-1 max-w-xl">
              Authentic feedback from teen fashion lovers, young professionals, and caring moms.
            </p>
          </div>

          {/* Aggregate Rating Stat & Write Review Button */}
          <div className="flex items-center gap-4">
            <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-2xs flex items-center gap-3">
              <div className="text-2xl font-serif font-bold text-stone-900 font-mono tabular-nums">
                4.9
              </div>
              <div>
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">840+ verified reviews</p>
              </div>
            </div>

            <button
              onClick={() => setIsWriteReviewOpen(true)}
              className="px-4 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-98"
            >
              <MessageSquarePlus className="w-4 h-4 text-rose-300" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="py-6 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-stone-500 mr-1">Filter:</span>
          {(['all', 5, 4] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilterRating(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                filterRating === r
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {r === 'all' ? 'All Reviews' : `${r} Stars Only`}
            </button>
          ))}
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-2xs flex flex-col justify-between space-y-4 transition-all hover:shadow-md"
            >
              <div className="space-y-3">
                {/* Rating & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">{rev.date}</span>
                </div>

                {/* Comment Prose */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Product metadata */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-stone-900">{rev.author}</span>
                    {rev.verified && (
                      <span className="text-emerald-700 flex items-center gap-0.5 text-[10px] font-medium">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    {rev.city} · Purchased: {rev.itemPurchased}
                  </div>
                </div>

                <button
                  onClick={() => handleHelpfulClick(rev.id)}
                  className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-700 transition-colors p-1"
                  title="Mark as helpful"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span className="font-mono tabular-nums">{rev.helpfulCount}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Write a Review Modal */}
      {isWriteReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs"
            onClick={() => setIsWriteReviewOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-stone-200 p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-lg font-medium text-stone-900">
                Share Your Komal Accessories Experience
              </h3>
              <button
                onClick={() => setIsWriteReviewOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedFeedback ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-base font-medium text-stone-900">
                  Thank You for Your Review!
                </h4>
                <p className="text-xs text-stone-500">
                  Your feedback helps other girls find the perfect accessories.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Your Rating *
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 text-stone-300 hover:text-amber-400 focus:outline-none cursor-pointer"
                      >
                        <Star 
                          className={`w-6 h-6 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} 
                        />
                      </button>
                    ))}
                    <span className="text-xs text-stone-500 ml-2 font-medium">
                      {newRating} / 5 Stars
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="e.g. Sara Ali"
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg outline-none focus:border-stone-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Your City *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="e.g. Lahore, Karachi"
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg outline-none focus:border-stone-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Item Purchased
                  </label>
                  <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="e.g. Butterfly Hair Clips or Clover Pendant"
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg outline-none focus:border-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Your Review Feedback *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share how the packaging was, clip grip, quality, or delivery speed..."
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg outline-none focus:border-stone-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  Submit Verified Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
