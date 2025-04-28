import React, { useEffect, useState } from 'react';
import CommentSection from './CommentSection';
import CommentDisplay from './CommentDisplay';
import { getItemComments, submitItemComment, CommentPayload } from '../../endpoints/comments';
import LoadingSpinner from '../../components/general/LoadingSpinner';
import { useToast } from '../../contexts/ToastContext';

interface Props {
    itemId: number;
}

const ItemCommentsArea: React.FC<Props> = ({ itemId }) => {
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
    const [_submitting, setSubmitting] = useState(false);
    const { addToast } = useToast();

    const loadComments = async (page: number = 1) => {
        try {
            setLoading(true);
            const fetched = await getItemComments(itemId, page);
            setComments(fetched.results);
            setNextPageUrl(fetched.next);
        } catch (error) {
            console.error('Failed to load comments:', error);
            addToast('Failed to load comments.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const loadMoreComments = async () => {
        if (!nextPageUrl) return;

        try {
            setLoadingMore(true);

            const pageParam = new URL(nextPageUrl, window.location.origin).searchParams.get('page') || '1';
            const fetched = await getItemComments(itemId, parseInt(pageParam));

            setComments((prev) => [...prev, ...fetched.results]);
            setNextPageUrl(fetched.next);
        } catch (error) {
            console.error('Failed to load more comments:', error);
            addToast('Failed to load more comments.', 'error');
        } finally {
            setLoadingMore(false);
        }
    };

    const handleCommentSubmit = async (commentData: CommentPayload) => {
        try {
            setSubmitting(true);
            await submitItemComment(itemId, commentData);
            await loadComments(); // Refresh list after submitting
        } catch (error) {
            console.error('Failed to submit comment:', error);
            addToast('Failed to submit comment.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        loadComments();
    }, [itemId]);

    return (
        <div className="w-full max-w-5xl mx-auto space-y-12">
            {/* Comment Form */}
            <CommentSection onSubmit={handleCommentSubmit} />

            {/* Separator */}
            <hr className="w-full border-gray-300 my-8" />

            {/* Comments Title */}
            <h2 className="text-2xl font-bold text-black">Customer Reviews</h2>

            {/* Comments List */}
            {loading ? (
                <LoadingSpinner />
            ) : comments.length > 0 ? (
                <div className="flex flex-col gap-8">
                    {comments.map((comment) => (
                        <CommentDisplay
                            key={comment.id}
                            name={comment.name}
                            surname={comment.surname}
                            rating={comment.rating}
                            content={comment.content}
                            images={comment.images}
                            createdAt={comment.created_at}
                        />
                    ))}

                    {/* Load More button */}
                    {nextPageUrl && (
                        <button
                            onClick={loadMoreComments}
                            disabled={loadingMore}
                            className="mx-auto px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingMore ? 'Loading...' : 'Load More Comments'}
                        </button>
                    )}
                </div>
            ) : (
                <p className="text-gray-600 text-center">No comments yet. Be the first to review this product!</p>
            )}
        </div>
    );
};

export default ItemCommentsArea;