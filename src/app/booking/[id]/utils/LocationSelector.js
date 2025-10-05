'use client';

import React from 'react';
import { MapPin } from '../components/Icons';

const bdLocations = {
  'Dhaka': ['Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur', 'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail'],
  'Chattogram': ['Bandarban', 'Brahmanbaria', 'Chandpur', 'Chattogram', 'Cumilla', 'Cox\'s Bazar', 'Feni', 'Khagrachari', 'Lakshmipur', 'Noakhali', 'Rangamati'],
  'Rajshahi': ['Bogura', 'Joypurhat', 'Naogaon', 'Natore', 'Nawabganj', 'Pabna', 'Rajshahi', 'Sirajganj'],
  'Khulna': ['Bagerhat', 'Chuadanga', 'Jashore', 'Jhenaidah', 'Khulna', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira'],
  'Barishal': ['Barguna', 'Barishal', 'Bhola', 'Jhalokathi', 'Patuakhali', 'Pirojpur'],
  'Sylhet': ['Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet'],
  'Rangpur': ['Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Rangpur', 'Thakurgaon'],
  'Mymensingh': ['Jamalpur', 'Mymensingh', 'Netrokona', 'Sherpur']
};

export default function LocationSelector({
  selectedDivision,
  setSelectedDivision,
  selectedDistrict,
  setSelectedDistrict
}) {
  return (
    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700/50 shadow-xl">
      <h3 className="font-bold mb-4 text-red-500 flex items-center gap-2">
        <MapPin className="w-5 h-5" /> Select Location
      </h3>
      <div className="space-y-4">
        {/* Division Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Division</label>
          <select
            value={selectedDivision}
            onChange={(e) => {
              setSelectedDivision(e.target.value);
              setSelectedDistrict('');
            }}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Select Division</option>
            {Object.keys(bdLocations).map((division) => (
              <option key={division} value={division}>{division}</option>
            ))}
          </select>
        </div>

        {/* District Selector */}
        {selectedDivision && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select District</option>
              {bdLocations[selectedDivision].map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}