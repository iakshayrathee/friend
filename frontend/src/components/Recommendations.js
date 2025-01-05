import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Recommendations({ onFriendRequest }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      const response = await api.get('/users/recommendations');
      setRecommendations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setLoading(false);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      await api.post(`/friends/request/${userId}`);
      onFriendRequest();
      setRecommendations(recommendations.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  return (
    <div className='bg-white p-6 rounded-lg shadow'>
      <h2 className='text-xl font-semibold mb-4'>Recommended Friends</h2>
      {loading ? (
        <p className='text-gray-500'>Loading recommendations...</p>
      ) : recommendations.length === 0 ? (
        <p className='text-gray-500'>No recommendations available</p>
      ) : (
        <div className='space-y-2'>
          {recommendations.map((user) => (
            <div
              key={user._id}
              className='flex justify-between items-center p-2 hover:bg-gray-50'
            >
              <div>
                <span className='font-medium'>{user.username}</span>
                {user.mutualCount && (
                  <span className='text-sm text-gray-500 ml-2'>
                    {user.mutualCount} mutual friend
                    {user.mutualCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <button
                onClick={() => sendFriendRequest(user._id)}
                className='px-5 py-2 relative rounded group overflow-hidden font-medium bg-indigo-50 text-indigo-600 inline-block'
              >
                <span class='absolute top-0 left-0 flex w-full h-0 mb-0 transition-all duration-200 ease-out transform translate-y-0 bg-indigo-600 group-hover:h-full opacity-90'></span>
                <span class='relative group-hover:text-white text-sm'>
                  Add Friend
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
