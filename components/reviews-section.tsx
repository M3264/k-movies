"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Star, ThumbsUp, Flag, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { getClientReviews, addClientReview } from "@/lib/firebase-client"
import { useToast } from "@/components/toast-notification"

export function ReviewsSection({ movieId, initialReviews = [] }) {
  const [reviews, setReviews] = useState(initialReviews)
  const [newReview, setNewReview] = useState("")
  const [rating, setRating] = useState(5)
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCommentForm, setShowCommentForm] = useState({})
  const [comments, setComments] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { showToast, ToastContainer } = useToast()

  // Fetch reviews on component mount
  useEffect(() => {
    async function loadReviews() {
      try {
        // Try to fetch from API first
        const response = await fetch(`/api/reviews?movieId=${movieId}`)

        if (response.ok) {
          const data = await response.json()
          setReviews(data.reviews || [])
        } else {
          // Fallback to client-side storage
          const clientReviews = getClientReviews(movieId)
          setReviews(clientReviews)
        }
      } catch (error) {
        console.error("Error loading reviews:", error)
        // Fallback to client-side storage
        const clientReviews = getClientReviews(movieId)
        setReviews(clientReviews)
      } finally {
        setIsLoading(false)
      }
    }

    loadReviews()
  }, [movieId])

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!newReview.trim() || !name.trim()) return

    setIsSubmitting(true)
    try {
      // Try to submit to API first
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId,
          name,
          content: newReview,
          rating,
        }),
      })

      let newReviewData

      if (response.ok) {
        const data = await response.json()
        newReviewData = data.review
        showToast({ message: "Review posted successfully!", type: "success" })
      } else {
        // Fallback to client-side storage
        newReviewData = addClientReview({
          movieId,
          name,
          content: newReview,
          rating,
          likes: 0,
          comments: [],
        })
        showToast({ message: "Review saved locally", type: "info" })
      }

      if (newReviewData) {
        setReviews([newReviewData, ...reviews])
      }

      setNewReview("")
      setName("")
      setRating(5)
      router.refresh()
    } catch (error) {
      console.error("Error submitting review:", error)
      showToast({ message: "Failed to post review", type: "error" })

      // Fallback to client-side storage
      const newReviewData = addClientReview({
        movieId,
        name,
        content: newReview,
        rating,
        likes: 0,
        comments: [],
      })

      if (newReviewData) {
        setReviews([newReviewData, ...reviews])
        showToast({ message: "Review saved locally", type: "info" })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLike = async (reviewId) => {
    // In a real app, this would call an API to update the like count
    setReviews(reviews.map((review) => (review.id === reviewId ? { ...review, likes: review.likes + 1 } : review)))
    showToast({ message: "Thanks for your feedback!", type: "success", duration: 2000 })
  }

  const handleAddComment = async (reviewId, comment) => {
    if (!comment.trim()) return

    // In a real app, this would call an API to add the comment
    setReviews(
      reviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              comments: [
                ...(review.comments || []),
                {
                  id: Date.now().toString(),
                  content: comment,
                  name: "You",
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : review,
      ),
    )

    setComments({ ...comments, [reviewId]: "" })
    setShowCommentForm({ ...showCommentForm, [reviewId]: false })
    showToast({ message: "Comment added", type: "success", duration: 2000 })
  }

  return (
    <section className="mt-12">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6">Reviews & Comments</h2>

      <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-800">
        <h3 className="text-xl font-bold mb-4">Write a Review</h3>
        <form onSubmit={handleSubmitReview}>
          <div className="mb-4">
            <Input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800 border-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <span className="mr-2">Rating:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                    <Star
                      className={`w-5 h-5 ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <Textarea
            placeholder="Share your thoughts about this movie..."
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            className="min-h-[120px] bg-gray-800 border-gray-700 mb-4"
            required
          />
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Post Review"}
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">{review.name}</h4>
                      <div className="flex items-center text-sm text-gray-400">
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-500"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-300">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-4 text-gray-300">{review.content}</div>

                <div className="mt-4 flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-300 flex items-center gap-1"
                    onClick={() => handleLike(review.id)}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{review.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-300 flex items-center gap-1"
                    onClick={() => setShowCommentForm({ ...showCommentForm, [review.id]: !showCommentForm[review.id] })}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>{(review.comments || []).length}</span>
                  </Button>
                </div>

                {/* Comments */}
                {(review.comments || []).length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-800 space-y-3">
                    {review.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-800/50 rounded-lg p-3">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                            {comment.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-2">
                            <span className="text-sm font-medium">{comment.name}</span>
                            <span className="ml-2 text-xs text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="mt-1 text-sm text-gray-300">{comment.content}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment form */}
                {showCommentForm[review.id] && (
                  <div className="mt-4 flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={comments[review.id] || ""}
                      onChange={(e) => setComments({ ...comments, [review.id]: e.target.value })}
                      className="bg-gray-800 border-gray-700"
                    />
                    <Button size="sm" onClick={() => handleAddComment(review.id, comments[review.id])}>
                      Post
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-900/50 rounded-lg border border-gray-800">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-600 mb-3" />
              <h3 className="text-xl font-medium mb-2">No Reviews Yet</h3>
              <p className="text-gray-400">Be the first to share your thoughts on this movie!</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
