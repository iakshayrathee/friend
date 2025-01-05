// // src/components/InterestManager.js
// import React, { useState, useEffect } from 'react';
// import api from '../services/api';
// import Select from 'react-select';

// export default function InterestManager() {
//   const [interests, setInterests] = useState([]);
//   const [availableInterests, setAvailableInterests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     loadInitialData();
//   }, []);

//   const loadInitialData = async () => {
//     try {
//       const [profileResponse, interestsResponse] = await Promise.all([
//         api.get('/users/profile'),
//         api.get('/interests'),
//       ]);

//       setInterests(profileResponse.data.interests || []);
//       setAvailableInterests(
//         interestsResponse.data.map((interest) => ({
//           value: interest,
//           label: interest,
//         }))
//       );
//     } catch (error) {
//       console.error('Error loading data:', error);
//       setError('Failed to load interests. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInterestChange = async (selectedOptions) => {
//     const selected = selectedOptions || [];
//     if (selected.length <= 10) {
//       try {
//         const newInterests = selected.map((option) => option.value);
//         await api.patch('/users/interests', {
//           interests: newInterests,
//         });
//         setInterests(newInterests);
//         setError('');
//       } catch (error) {
//         console.error('Error updating interests:', error);
//         setError('Failed to update interests. Please try again.');
//       }
//     }
//   };

//   if (loading) {
//     return (
//       <div className='bg-white p-6 rounded-lg shadow'>
//         <div className='animate-pulse'>
//           <div className='h-4 bg-gray-200 rounded w-1/4 mb-4'></div>
//           <div className='h-10 bg-gray-200 rounded w-full'></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className='bg-white p-6 rounded-lg shadow'>
//       <h2 className='text-xl font-semibold mb-4'>Your Interests</h2>
//       {error && (
//         <div className='mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
//           {error}
//         </div>
//       )}
//       <div className='space-y-4'>
//         <div>
//           <label className='block text-sm font-medium text-gray-700'>
//             Update your interests ({10 - interests.length} remaining)
//           </label>
//           <Select
//             isMulti
//             value={interests.map((interest) => ({
//               value: interest,
//               label: interest,
//             }))}
//             options={availableInterests}
//             onChange={handleInterestChange}
//             className='mt-1'
//             isOptionDisabled={() => interests.length >= 10}
//             placeholder='Choose up to 10 interests...'
//             noOptionsMessage={() => 'No matching interests found'}
//           />
//         </div>
//         <p className='text-sm text-gray-500'>
//           You can select up to 10 interests to help us find better
//           recommendations for you.
//         </p>
//       </div>
//     </div>
//   );
// }

// src/components/InterestManager.js

// src/components/InterestManager.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function InterestManager() {
  const [userInterests, setUserInterests] = useState([]);
  const [availableInterests, setAvailableInterests] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    loadAllInterests();
  }, []);

  const loadAllInterests = async () => {
    try {
      const [availableResponse, userResponse] = await Promise.all([
        api.get('/interests'),
        api.get('/users/me'),
      ]);

      setAvailableInterests(availableResponse.data || []);
      setUserInterests(userResponse.data.interests || []);
      setError(null);
    } catch (error) {
      setError('Failed to load interests');
      console.error('Error loading interests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInterest = async (interestToAdd) => {
    if (!interestToAdd || userInterests.length >= 10) return;

    try {
      const updatedInterests = [...userInterests, interestToAdd];
      const response = await api.patch('/users/interests', {
        interests: updatedInterests,
      });

      if (response.data?.interests) {
        setUserInterests(response.data.interests);
        setSelectedInterest('');
        setIsDropdownOpen(false);
        setError(null);
      }
    } catch (error) {
      setError('Failed to add interest');
      console.error('Error adding interest:', error);
    }
  };

  const handleRemoveInterest = async (interestToRemove) => {
    try {
      const updatedInterests = userInterests.filter(
        (interest) => interest !== interestToRemove
      );

      const response = await api.patch('/users/interests', {
        interests: updatedInterests,
      });

      if (response.data?.interests) {
        setUserInterests(response.data.interests);
        setError(null);
      }
    } catch (error) {
      setError('Failed to remove interest');
      console.error('Error removing interest:', error);
    }
  };

  const remainingInterests = availableInterests.filter(
    (interest) => !userInterests.includes(interest)
  );

  if (loading) {
    return (
      <div className='flex justify-center items-center p-6'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600'></div>
      </div>
    );
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow'>
      <h2 className='text-xl font-semibold mb-4'>Your Interests</h2>
      {error && (
        <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
          {error}
        </div>
      )}

      <div className='space-y-4'>
        <div className='relative'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Add Interest ({10 - userInterests.length} remaining)
          </label>

          {/* Custom Dropdown */}
          <div className='relative'>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={userInterests.length >= 10}
              className='w-full flex justify-between items-center px-4 py-2 border rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <span className='text-gray-700'>
                {selectedInterest || 'Select an interest'}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transform transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && remainingInterests.length > 0 && (
              <div className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto'>
                {remainingInterests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => handleAddInterest(interest)}
                    className='w-full text-left px-4 py-2 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none'
                  >
                    {interest}
                  </button>
                ))}
              </div>
            )}

            {isDropdownOpen && remainingInterests.length === 0 && (
              <div className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg p-4 text-center text-gray-500'>
                No more interests available
              </div>
            )}
          </div>
        </div>

        {/* Selected Interests */}
        <div className='flex flex-wrap gap-2 mt-4'>
          {userInterests.map((interest, index) => (
            <span
              key={index}
              className='inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 group hover:bg-indigo-200 transition-colors'
            >
              {interest}
              <button
                onClick={() => handleRemoveInterest(interest)}
                className='ml-2 p-0.5 rounded-full text-indigo-600 hover:text-indigo-800 focus:outline-none'
                aria-label={`Remove ${interest}`}
              >
                <svg
                  className='w-4 h-4'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </span>
          ))}

          {userInterests.length === 0 && (
            <p className='text-gray-500 text-sm italic'>
              No interests selected yet. Add up to 10 interests from the
              dropdown above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
