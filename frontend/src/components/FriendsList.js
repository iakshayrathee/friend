import React from 'react';
import api from '../services/api';

export default function FriendsList({ friends, onFriendRemoved, className }) {
  const removeFriend = async (friendId) => {
    try {
      await api.delete(`/friends/unfriend/${friendId}`);
      onFriendRemoved();
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
      <h2 className='text-xl font-semibold mb-4'>Friends</h2>
      {friends.length === 0 ? (
        <p className='text-gray-500'>No friends added yet</p>
      ) : (
        <div className='space-y-2'>
          {friends.map((friend) => (
            <div
              key={friend._id}
              className='flex justify-between items-center p-2 hover:bg-gray-50'
            >
              <span>{friend.username}</span>
              <button
                onClick={() => removeFriend(friend.id)}
                className='text-red-500 hover:text-red-600'
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
