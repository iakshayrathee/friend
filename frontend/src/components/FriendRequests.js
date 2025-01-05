import React from 'react';
import api from '../services/api';

export default function FriendRequests({ requests, onRequestUpdate }) {
  const handleRequest = async (requestId, status) => {
    try {
      await api.post(`/friends/respond/${requestId}`, { status });
      onRequestUpdate();
    } catch (error) {
      console.error('Error handling friend request:', error);
    }
  };

  const pendingRequests = requests.filter((req) => req.status === 'pending');

  return (
    <div className='bg-white p-6 rounded-lg shadow'>
      <h2 className='text-xl font-semibold mb-4'>Friend Requests</h2>
      {pendingRequests.length === 0 ? (
        <p className='text-gray-500'>No pending friend requests</p>
      ) : (
        <div className='space-y-3'>
          {pendingRequests.map((request) => (
            <div
              key={request._id}
              className='flex items-center justify-between p-3 bg-gray-50 rounded'
            >
              <span className='font-medium'>{request.from.username}</span>
              <div className='space-x-2'>
                <button
                  onClick={() => handleRequest(request._id, 'accepted')}
                  className='bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors'
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRequest(request._id, 'rejected')}
                  className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors'
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
