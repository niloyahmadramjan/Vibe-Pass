// mockData.js

export const userProfileData = {
  profileImage: 'https://i.ibb.co/wFjxs8XF/IMG-9196.jpg', // Replace with an actual image URL
  name: 'MD RAMJAN ALI',
  welcomeMessage: 'Welcome Back!',
  qrCodeValue: 'https://vibepass.com/user/niloyahmadramjan', // The value for the QR code
  contact: {
    mobile: '+60 113 545 1398',
    email: 'niloyahmadramjan@gmail.com',
  },
  profileInfo: {
    name: 'niloyahmadramjan',
    dob: 'Not set',
    state: 'Not set',
    district: 'Not set',
    gender: 'Not set',
  },
  communication: {
    updates: true,
    surveys: false,
  },
}

// =========================================================================
// Backend API function (commented out for now)
// =========================================================================

/**
 * // This is an example of a function to fetch data from a backend API.
 * // You would uncomment and implement this once your backend is ready.
 * export async function fetchUserProfile() {
 * try {
 * // const response = await fetch('/api/user/profile');
 * // if (!response.ok) {
 * //   throw new Error('Failed to fetch user data');
 * // }
 * // const data = await response.json();
 * // return data;
 * } catch (error) {
 * console.error('Error fetching user data:', error);
 * return null;
 * }
 * }
 */
