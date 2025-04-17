'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'next/navigation';
import Swal from 'sweetalert2';

const Comments = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/comment/${productId}`);
        setComments(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [productId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Swal.fire({
        title: 'Empty Comment',
        text: 'Please write something before submitting',
        icon: 'warning',
        timer: 1500,
        showConfirmButton: false
      });
      return;
    }

    if (!token) {
      Swal.fire({
        title: 'Login Required',
        text: 'Please login to post a comment',
        icon: 'warning',
        showConfirmButton: true
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const userId = jwtDecode(token).id;

      const response = await axios.post(
        'http://localhost:3000/api/comment',
        { content: newComment, userId, productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments([response.data, ...comments]);
      setNewComment('');
      Swal.fire({
        title: 'Success!',
        text: 'Comment added successfully',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'Failed to add comment',
        icon: 'error',
        timer: 1500,
        showConfirmButton: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Customer Reviews ({comments.length})</h2>
      
      {/* Comment Form */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts about this product..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
          rows="3"
        />
        <button
          onClick={handleAddComment}
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-lg text-white font-medium ${
            isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No comments yet. Be the first to review!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-2">
                <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 font-medium">
                  {comment.user?.name?.charAt(0) || 'U'}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-800">
                    {comment.user?.name || 'Anonymous User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;