'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userAPI } from '@/utils/api';
import { Card, InlineError } from '@/components/common';
import toast from 'react-hot-toast';
import divisionsData from '@/data/divisionsData.json';
import { FaUser, FaPhone, FaMapMarkerAlt, FaCamera, FaCheck, FaClock, FaCheckCircle, FaLock, FaEdit } from 'react-icons/fa';
import Image from 'next/image';

interface ProfileData {
  phone: string;
  division: string;
  district: string;
  address: string;
}

const ProfilePage = () => {
  const { user, updateUser: updateAuthUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    phone: '',
    division: '',
    district: '',
    address: '',
  });
  const [districts, setDistricts] = useState<string[]>([]);
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        phone: user.phone || '',
        division: user.division || '',
        district: user.district || '',
        address: user.address || '',
      });

      if (user.profilePicture) {
        setProfilePicture(user.profilePicture);
      }

      if (user.division) {
        const divisionData = divisionsData.find((d) => d.division === user.division);
        if (divisionData) {
          setDistricts(divisionData.districts.map(d => d.name));
        }
      }
    }
  }, [user]);

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDivision = e.target.value;
    setProfileData((prev) => ({ ...prev, division: selectedDivision, district: '' }));

    const divisionData = divisionsData.find((d) => d.division === selectedDivision);
    if (divisionData) {
      setDistricts(divisionData.districts.map(d => d.name));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (profileData.phone) {
      const phoneRegex = /^01[0-9]{9}$/;
      if (!phoneRegex.test(profileData.phone)) {
        setError('Phone number must be 11 digits starting with 01');
        toast.error('Phone number must be 11 digits starting with 01');
        return;
      }
    }

    setLoading(true);

    try {
      if (selectedFile) {
        toast.loading('Uploading image...', { id: 'upload' });
      }

      const updateData = {
        ...profileData,
        ...(selectedFile && { profilePicture: profilePicture }),
      };

      const response = await userAPI.updateProfile(updateData);

      if (response && response.success) {
        if (selectedFile) {
          toast.dismiss('upload');
        }

        const updatedUser = { ...user, ...response.data };
        localStorage.setItem('nn_user', JSON.stringify(updatedUser));
        updateAuthUser(updatedUser);

        setSelectedFile(null);
        setError(null);
        setSuccess(true);
        setIsEditing(false);

        toast.success('Profile updated successfully!');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(response?.message || 'Failed to update profile');
      }
    } catch (error: unknown) {
      toast.dismiss('upload');
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#F6FFF9] to-white py-6 xs:py-7 sm:py-8 md:py-10 lg:py-12 px-3 xs:px-4 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 xs:mb-7 sm:mb-8 md:mb-10 border-b pb-3 xs:pb-4 sm:pb-5 md:pb-6 bg-white rounded-lg shadow-sm px-4 xs:px-5 sm:px-6 md:px-8 py-4 xs:py-5 sm:py-6 md:py-8 border-accent/80">
          <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4 mb-3 xs:mb-4">
            <div>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold text-primary mb-1 xs:mb-2 flex items-center gap-2 xs:gap-3">
                <FaUser className="text-base xs:text-lg sm:text-xl md:text-2xl text-primary" />
                Profile Settings
              </h1>
              <p className="text-xs xs:text-sm sm:text-base text-[#6B7280]">Manage your account and personal information</p>
            </div>
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs xs:text-sm px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 text-gray-600 hover:text-gray-900 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-8 p-3 xs:p-4 sm:p-5 md:p-6 bg-green-50 border-l-4 border-green-500 rounded-lg flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3">
            <FaCheckCircle className="text-green-500 text-lg xs:text-xl md:text-2xl flex-shrink-0" />
            <div>
              <p className="font-semibold text-xs xs:text-sm sm:text-base text-green-900">Profile Updated Successfully!</p>
              <p className="text-xs text-green-700 mt-0.5 xs:mt-1">Your changes have been saved.</p>
            </div>
          </div>
        )}

        {/* Main Profile Card */}
        <Card className="mb-6 xs:mb-7 sm:mb-8 md:mb-10 overflow-hidden">
          {/* Cover Background */}
          <div className="h-24 xs:h-28 sm:h-32 md:h-40 lg:h-48 bg-linear-to-r from-primary to-[#1e5d22]"></div>

          <form onSubmit={handleSubmit} className="px-4 xs:px-5 sm:px-6 md:px-8 pb-4 xs:pb-5 sm:pb-6 md:pb-8">
            {/* Error Display */}
            {error && <InlineError message={error} />}

            {/* Profile Picture Section */}
            <div className="relative -mt-12 xs:-mt-14 sm:-mt-16 md:-mt-20 mb-6 xs:mb-8 sm:mb-10 md:mb-12">
              <div className="flex flex-col xs:flex-row items-center xs:items-end gap-4 xs:gap-6 md:gap-8">
                <div className="relative group">
                  <div className={`w-28 xs:w-32 sm:w-36 md:w-40 h-28 xs:h-32 sm:h-36 md:h-40 rounded-xl xs:rounded-2xl bg-white overflow-hidden border-4 shadow-xl transition-all ${selectedFile ? 'border-primary' : 'border-white'}`}>
                    {profilePicture ? (
                      <Image
                        src={profilePicture}
                        alt="Profile"
                        fill
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary to-[#1e5d22] text-white text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <button
                    title='camera'
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-primary text-white p-2 xs:p-2.5 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                  >
                    <FaCamera className="text-base xs:text-lg md:text-xl" />
                  </button>
                  {selectedFile && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1.5 xs:p-2 shadow-lg">
                      <FaCheck className="text-xs xs:text-sm" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center xs:text-left pb-2">
                  <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 xs:mb-2">{user?.name}</h2>
                  <p className="text-xs xs:text-sm sm:text-base text-[#6B7280] capitalize flex flex-col xs:flex-row items-center xs:items-start gap-1 xs:gap-2 justify-center xs:justify-start">
                    <span className="px-2 xs:px-3 py-1 bg-primary bg-opacity-10 text-accent rounded-full text-xs sm:text-sm font-semibold">
                      {user?.role}
                    </span>
                  </p>
                </div>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 xs:px-5 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 bg-primary text-white text-sm xs:text-base rounded-lg font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-2 flex-shrink-0"
                  >
                    <FaEdit className="text-sm xs:text-base" />
                    <span className="hidden xs:inline">Edit Profile</span>
                    <span className="xs:hidden">Edit</span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                aria-label="Upload profile picture"
              />
            </div>

            {/* Edit/View Mode Toggle */}
            {isEditing ? (
              <>
                {/* Personal Information Section */}
                <div className="mb-6 xs:mb-8 sm:mb-10 md:mb-12">
                  <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-primary mb-3 xs:mb-4 sm:mb-5 md:mb-6 flex items-center gap-2 xs:gap-3">
                    <FaUser className="text-base xs:text-lg sm:text-xl text-primary" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
                    <div>
                      <label className="block text-xs xs:text-sm font-semibold text-primary mb-2">Full Name</label>
                      <input
                        title="Full Name"
                        type="text"
                        value={user?.name || ''}
                        disabled
                        className="w-full px-3 xs:px-4 py-2 xs:py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-xs xs:text-sm flex items-center gap-2"
                      />
                      <p className="text-[10px] xs:text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <FaLock className="text-[10px]" /> Name cannot be changed
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs xs:text-sm font-semibold text-primary mb-2">Email Address</label>
                      <input
                        title="Email Address"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-3 xs:px-4 py-2 xs:py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed text-xs xs:text-sm"
                      />
                      <p className="text-[10px] xs:text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <FaLock className="text-[10px]" /> Email cannot be changed
                      </p>
                    </div>
                    <div>
                      <label className="text-xs xs:text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                        <FaPhone className="text-primary text-xs" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleChange}
                        placeholder="01XXXXXXXXX"
                        maxLength={11}
                        pattern="^01[0-9]{9}$"
                        className="w-full px-3 xs:px-4 py-2 xs:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-gray-900 text-xs xs:text-sm transition"
                      />
                      <p className="text-[10px] xs:text-xs text-gray-500 mt-1">11 digits starting with 01 (e.g., 01712345678)</p>
                    </div>
                    <div>
                      <label className="block text-xs xs:text-sm font-semibold text-primary mb-2">Role</label>
                      <input
                        title="Role"
                        type="text"
                        value={user?.role || ''}
                        disabled
                        className="w-full px-3 xs:px-4 py-2 xs:py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed capitalize text-xs xs:text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                <div className="mb-6 xs:mb-8 sm:mb-10 md:mb-12">
                  <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-primary mb-3 xs:mb-4 sm:mb-5 md:mb-6 flex items-center gap-2 xs:gap-3">
                    <FaMapMarkerAlt className="text-base xs:text-lg sm:text-xl text-primary" />
                    Location Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
                    <div>
                      <label className="block text-xs xs:text-sm font-semibold text-primary mb-2">Division</label>
                      <select
                        title="Division"
                        name="division"
                        value={profileData.division}
                        onChange={handleDivisionChange}
                        className="w-full px-3 xs:px-4 py-2 xs:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-gray-900 text-xs xs:text-sm transition"
                      >
                        <option value="">Select Division</option>
                        {divisionsData.map((division) => (
                          <option key={division.division} value={division.division}>
                            {division.division}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs xs:text-sm font-semibold text-primary mb-2">District</label>
                      <select
                        title="District"
                        name="district"
                        value={profileData.district}
                        onChange={handleChange}
                        disabled={!profileData.division}
                        className="w-full px-3 xs:px-4 py-2 xs:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-xs xs:text-sm transition"
                      >
                        <option value="">Select District</option>
                        {districts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs xs:text-sm font-semibold text-primary mb-2">Full Address</label>
                      <textarea
                        name="address"
                        value={profileData.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 xs:px-4 py-2 xs:py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-gray-900 text-xs xs:text-sm transition resize-none"
                        placeholder="Enter your complete address (street, building, area, etc.)"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col xs:flex-row justify-end gap-2 xs:gap-3 sm:gap-4 pt-4 xs:pt-5 sm:pt-6 md:pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 xs:px-5 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold text-xs xs:text-sm hover:border-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 xs:px-7 sm:px-8 md:px-10 py-2 xs:py-2.5 sm:py-3 bg-linear-to-r from-primary to-[#1e5d22] text-white text-xs xs:text-sm rounded-lg font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* View Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4 sm:gap-5 md:gap-6 mt-6 xs:mt-8 sm:mt-10 md:mt-12">
                  <div className="p-3 xs:p-4 sm:p-5 md:p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <label className="text-xs xs:text-sm font-semibold text-primary flex items-center gap-2 mb-2">
                      <FaPhone className="text-blue-500 text-xs xs:text-sm" />
                      Phone Number
                    </label>
                    <p className="text-base xs:text-lg sm:text-xl font-semibold text-primary">{profileData.phone || 'Not provided'}</p>
                  </div>

                  <div className="p-3 xs:p-4 sm:p-5 md:p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <label className="text-xs xs:text-sm font-semibold text-primary flex items-center gap-2 mb-2">
                      <FaMapMarkerAlt className="text-green-500 text-xs xs:text-sm" />
                      Location
                    </label>
                    <p className="text-base xs:text-lg sm:text-xl font-semibold text-primary">{profileData.district || 'Not provided'}, {profileData.division || 'N/A'}</p>
                  </div>

                  <div className="p-3 xs:p-4 sm:p-5 md:p-6 bg-purple-50 rounded-lg border-l-4 border-purple-500 sm:col-span-2">
                    <label className="text-xs xs:text-sm font-semibold text-primary flex items-center gap-2 mb-2">
                      <FaMapMarkerAlt className="text-purple-500 text-xs xs:text-sm" />
                      Address
                    </label>
                    <p className="text-base xs:text-lg sm:text-xl font-semibold text-primary">{profileData.address || 'Not provided'}</p>
                  </div>
                </div>
              </>
            )}
          </form>
        </Card>

        {/* Account Info Card */}
        <Card className="bg-linear-to-r from-slate-50 to-slate-100">
          <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-primary mb-4 xs:mb-5 sm:mb-6 md:mb-8 flex items-center gap-2 xs:gap-3">
            <FaCheckCircle className="text-base xs:text-lg sm:text-xl text-primary" />
            Account Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
            <div className="p-3 xs:p-4 sm:p-5 md:p-6 bg-white rounded-lg border-2 border-gray-100 hover:shadow-lg transition">
              <div className="flex items-center gap-2 xs:gap-3 mb-3">
                {user?.approved ? (
                  <div className="w-8 xs:w-10 h-8 xs:h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <FaCheck className="text-green-600 text-base xs:text-lg" />
                  </div>
                ) : (
                  <div className="w-8 xs:w-10 h-8 xs:h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <FaClock className="text-yellow-600 text-base xs:text-lg" />
                  </div>
                )}
                <div>
                  <p className="text-xs xs:text-sm font-medium text-[#6B7280]">Account Status</p>
                  <p className="text-base xs:text-lg font-bold text-primary flex items-center gap-1.5">
                    {user?.approved ? (
                      <>
                        <FaCheck className="text-green-600 text-sm" /> Approved
                      </>
                    ) : (
                      <>
                        <FaClock className="text-yellow-600 text-sm" /> Pending
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 xs:p-4 sm:p-5 md:p-6 bg-white rounded-lg border-2 border-gray-100 hover:shadow-lg transition">
              <div className="flex items-center gap-2 xs:gap-3">
                <div className="w-8 xs:w-10 h-8 xs:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FaUser className="text-blue-600 text-base xs:text-lg" />
                </div>
                <div>
                  <p className="text-xs xs:text-sm font-medium text-[#6B7280]">Member Since</p>
                  <p className="text-base xs:text-lg font-bold text-primary">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="p-3 xs:p-4 sm:p-5 md:p-6 bg-white rounded-lg border-2 border-gray-100 hover:shadow-lg transition">
              <div className="flex items-center gap-2 xs:gap-3">
                <div className="w-8 xs:w-10 h-8 xs:h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <FaUser className="text-purple-600 text-base xs:text-lg" />
                </div>
                <div>
                  <p className="text-xs xs:text-sm font-medium text-[#6B7280]">User Role</p>
                  <p className="text-base xs:text-lg font-bold text-primary capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
