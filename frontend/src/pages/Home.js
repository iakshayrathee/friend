import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import UserSearch from '../components/UserSearch';
import FriendsList from '../components/FriendsList';
import FriendRequests from '../components/FriendRequests';
import Recommendations from '../components/Recommendations';
import InterestManager from '../components/InterestManager';

export default function Home() {
  const { logout } = useAuth();
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadFriendData();
  }, []);

  const loadFriendData = async () => {
    try {
      const response = await api.get('/friends/list');
      setFriends(response.data.friends);
      setRequests(response.data.requests);
    } catch (error) {
      console.error('Error loading friend data:', error);
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Friend Management</h1>
        <button
          onClick={logout}
          className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
        >
          Logout
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div>
          <UserSearch onFriendRequest={loadFriendData} />
          <InterestManager className='mt-8' />
          <Recommendations className='mt-8' onFriendRequest={loadFriendData} />
        </div>
        <div>
          <FriendRequests
            requests={requests}
            onRequestUpdate={loadFriendData}
          />
          <FriendsList
            friends={friends}
            onFriendRemoved={loadFriendData}
            className='mt-8'
          />
        </div>
      </div>
    </div>
  );
}
