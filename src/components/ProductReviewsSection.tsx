import React, { useState } from 'react';
import { Star, CheckCircle, ThumbsUp, MessageSquare, Send, Sparkles } from 'lucide-react';
import { ProductReview } from '../types';

interface ProductReviewsSectionProps {
  productId: string;
  reviews: ProductReview[];
  onAddReview: (review: { userName: string; rating: number; comment: string }) => void;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId,
  reviews,
  onAddReview,
}) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [userName, setUserName] = useState('');
  const [userComment, setUserComment] = useState('');
  const [formError, setFormError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [helpfulIds, setHelpfulIds] = useState<Set<string>>(new Set());

  // Filter reviews for this product
  const productReviews = reviews.filter((r) => r.productId === productId);

  // Compute average and breakdown
  const totalReviews = productReviews.length;
  const avgRating =
    totalReviews > 0
      ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : '5.0';

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: productReviews.filter((r) => r.rating === star).length,
    percentage:
      totalReviews > 0
        ? (productReviews.filter((r) => r.rating === star).length / totalReviews) * 100
        : 0,
  }));

  const ratingLabels: Record<number, string> = {
    5: 'অসাধারণ! (Excellent)',
    4: 'খুব ভালো (Very Good)',
    3: 'মোটামুটি (Good)',
    2: 'পছন্দ হয়নি (Fair)',
    1: 'খারাপ (Poor)',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setFormError('অনুগ্রহ করে আপনার নাম লিখুন।');
      return;
    }
    if (!userComment.trim() || userComment.trim().length < 5) {
      setFormError('কমপক্ষে ৫ অক্ষরের একটি রিভিউ মন্তব্য লিখুন।');
      return;
    }

    setFormError('');
    onAddReview({
      userName: userName.trim(),
      rating: userRating,
      comment: userComment.trim(),
    });

    setUserName('');
    setUserComment('');
    setShowReviewForm(false);
    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 4000);
  };

  const toggleHelpful = (id: string) => {
    setHelpfulIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-4 pt-3 border-t border-neutral-100 font-bengali">
      {/* Header & Overall Rating */}
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm sm:text-base text-neutral-900 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-rose-600" />
          গ্রাহকদের রিভিউ ও রেটিং ({totalReviews})
        </h4>
        <button
          onClick={() => setShowReviewForm((prev) => !prev)}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          {showReviewForm ? 'ফর্ম বন্ধ করুন' : '+ রিভিউ লিখুন'}
        </button>
      </div>

      {/* Success alert */}
      {submittedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>আপনার রিভিউটি সফলভাবে প্রকাশিত হয়েছে। মূল্যবান মতামতের জন্য ধন্যবাদ!</span>
        </div>
      )}

      {/* Write a Review Form */}
      {showReviewForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900">
              আপনার রেটিং নির্বাচন করুন:
            </span>
            <span className="text-xs font-bold text-rose-600">
              {ratingLabels[hoverRating || userRating]}
            </span>
          </div>

          {/* Interactive Stars */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                onClick={() => setUserRating(star)}
                className="p-1 cursor-pointer transition-transform hover:scale-110"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= (hoverRating || userRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-neutral-300'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Name Input */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              আপনার নাম:
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="যেমন: তানভীর আহমেদ"
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-rose-600"
            />
          </div>

          {/* Comment Textarea */}
          <div>
            <label className="text-xs font-semibold text-neutral-700 block mb-1">
              আপনার মন্তব্য বা অভিজ্ঞতা:
            </label>
            <textarea
              rows={3}
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              placeholder="পোশাকের কাপড়, ফিনিশিং, আরাম এবং ডেলিভারি সম্পর্কে আপনার বিস্তারিত মতামত দিন..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 bg-white focus:outline-rose-600 resize-none"
            />
          </div>

          {formError && (
            <p className="text-xs text-rose-600 font-medium">{formError}</p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="px-3 py-2 rounded-xl text-neutral-600 hover:bg-neutral-200 text-xs font-bold cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>রিভিউ জমা দিন</span>
            </button>
          </div>
        </form>
      )}

      {/* Rating Breakdown Score Card */}
      <div className="p-3.5 sm:p-4 bg-neutral-50/80 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row items-center gap-4">
        {/* Left score */}
        <div className="text-center sm:pr-4 sm:border-r sm:border-neutral-200 shrink-0">
          <span className="text-3xl sm:text-4xl font-extrabold text-neutral-900 block font-bengali">
            {avgRating}
          </span>
          <div className="flex items-center justify-center gap-0.5 text-amber-400 my-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i <= Math.round(Number(avgRating))
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-neutral-300'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-neutral-500 font-medium">
            {totalReviews} টি মূল্যায়নের ভিত্তিতে
          </span>
        </div>

        {/* Right bars */}
        <div className="flex-1 w-full space-y-1.5">
          {ratingCounts.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-6 text-neutral-600 font-bold shrink-0">{star} ★</span>
              <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-6 text-neutral-400 text-[11px] text-right shrink-0">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {productReviews.length === 0 ? (
          <div className="p-6 text-center text-xs text-neutral-500 bg-neutral-50 rounded-2xl border border-neutral-200">
            এখনও কোনো রিভিউ দেওয়া হয়নি। আপনিই প্রথম রিভিউ দিন!
          </div>
        ) : (
          productReviews.map((rev) => {
            const isHelpful = helpfulIds.has(rev.id);
            const helpfulCount = (rev.helpfulCount || 0) + (isHelpful ? 1 : 0);

            return (
              <div
                key={rev.id}
                className="p-3.5 bg-white rounded-2xl border border-neutral-200/90 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-xs text-neutral-700">
                      {rev.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-neutral-900">
                          {rev.userName}
                        </span>
                        {rev.verifiedPurchase && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md font-semibold">
                            <CheckCircle className="w-2.5 h-2.5" /> ভেরিফাইড
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400">{rev.date}</span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-neutral-700 leading-relaxed">{rev.comment}</p>

                {/* Helpful count action */}
                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={() => toggleHelpful(rev.id)}
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                      isHelpful
                        ? 'text-rose-600 bg-rose-50'
                        : 'text-neutral-500 hover:text-neutral-800 bg-neutral-50'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>উপকারী ({helpfulCount})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
