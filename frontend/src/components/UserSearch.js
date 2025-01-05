import React, { useState } from 'react';
import api from '../services/api';

export default function UserSearch({ onFriendRequest }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 2) {
      try {
        const response = await api.get(`/users/search?query=${query}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      await api.post(`/friends/request/${userId}`);
      onFriendRequest();
      setSearchResults(searchResults.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  return (
    <div className='bg-white p-6 rounded-lg shadow'>
      <h2 className='text-xl font-semibold mb-4'>Search Users</h2>
      <input
        type='text'
        placeholder='Search by username...'
        value={searchQuery}
        onChange={handleSearch}
        className='w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500'
      />
      <div className='mt-4 space-y-2'>
        {searchResults.map((user) => (
          <div
            key={user._id}
            className='flex justify-between items-center p-2 hover:bg-gray-50'
          >
            <span>{user.username}</span>
            <button
              onClick={() => sendFriendRequest(user._id)}
              className='bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600'
            >
              Add Friend
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
