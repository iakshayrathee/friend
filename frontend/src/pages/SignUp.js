// src/pages/SignUp.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Select from 'react-select';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [interests, setInterests] = useState([]);
  const [availableInterests, setAvailableInterests] = useState([]);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadAvailableInterests();
  }, []);

  const loadAvailableInterests = async () => {
    try {
      const response = await api.get('/interests');
      setAvailableInterests(
        response.data.map((interest) => ({
          value: interest,
          label: interest,
        }))
      );
    } catch (error) {
      console.error('Error loading interests:', error);
      setError('Error loading interests. Please try again.');
    }
  };

  const handleInterestChange = (selectedOptions) => {
    const selected = selectedOptions || [];
    if (selected.length <= 4) {
      setInterests(selected.map((option) => option.value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (interests.length === 0) {
      setError('Please select at least one interest');
      return;
    }

    try {
      const response = await api.post('/auth/signup', {
        username,
        password,
        interests,
      });
      login(response.data.token, response.data.userId);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error during signup');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Create your account
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Select 1-4 interests to get started
          </p>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          {error && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
              {error}
            </div>
          )}
          <div className='rounded-md shadow-sm -space-y-px'>
            <input
              type='text'
              required
              className='appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
              placeholder='Username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type='password'
              required
              className='appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Select your interests ({4 - interests.length} remaining)
              </label>
              <Select
                isMulti
                value={interests.map((interest) => ({
                  value: interest,
                  label: interest,
                }))}
                options={availableInterests}
                onChange={handleInterestChange}
                className='mt-1'
                isOptionDisabled={() => interests.length >= 4}
                placeholder='Choose up to 4 interests...'
                noOptionsMessage={() => 'No matching interests found'}
              />
            </div>
          </div>

          <button
            type='submit'
            className='w-full rounded px-5 py-2.5 overflow-hidden group bg-indigo-500 relative hover:bg-gradient-to-r hover:from-indigo-500 hover:to-indigo-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-indigo-400 transition-all ease-out duration-300'
          >
            <span class='absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease'></span>
            <span class='relative'>Sign Up</span>
          </button>
        </form>
        <div className='text-center'>
          <Link to='/login' className='text-indigo-600 hover:text-indigo-500'>
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
