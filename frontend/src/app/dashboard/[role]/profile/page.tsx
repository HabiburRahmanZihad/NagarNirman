'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userAPI } from '@/utils/api';
import { Button, Card, Input, InlineError } from '@/components/common';
import toast from 'react-hot-toast';
import divisionsData from '@/data/divisionsData.json';
import { FaUser, FaPhone, FaMapMarkerAlt, FaCamera, FaCheck, FaClock, FaCheckCircle, FaLock, FaEdit } from 'react-icons/fa';

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
  const [uploading, setUploading] = useState(false);
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
    } catch (error: any) {
      toast.dismiss('upload');
      const errorMessage = error?.message || error?.data?.message || 'Failed to update profile';
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
    <div className="min-h-screen bg-linear-to-br from-[#F6FFF9] to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 border-b pb-4 bg-white rounded-lg shadow-sm px-6 py-4 border-accent/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-extrabold text-primary mb-2 flex items-center gap-3">
                <FaUser className="text-primary" />
                Profile Settings
              </h1>
              <p className="text-[#6B7280]">Manage your account and personal information</p>
            </div>
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="text-sm px-4 py-2 text-gray-600 hover:text-gray-900 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-3">
            <FaCheckCircle className="text-green-500 text-xl" />
            <div>
              <p className="font-semibold text-green-900">Profile Updated Successfully!</p>
              <p className="text-sm text-green-700">Your changes have been saved.</p>
            </div>
          </div>
        )}

        {/* Main Profile Card */}
        <Card className="mb-8 overflow-hidden">
          {/* Cover Background */}
          <div className="h-32 bg-linear-to-r from-primary to-[#1e5d22]"></div>

          <form onSubmit={handleSubmit} className="px-6 pb-6">
            {/* Error Display */}
            {error && <InlineError message={error} />}

            {/* Profile Picture Section */}
            <div className="relative -mt-16 mb-8">
              <div className="flex items-end gap-6">
                <div className="relative group">
                  <div className={`w-40 h-40 rounded-2xl bg-white overflow-hidden border-4 shadow-xl transition-all ${selectedFile ? 'border-primary' : 'border-white'}`}>
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary to-[#1e5d22] text-white text-6xl font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <button
                    title='camera'
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-primary text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                  >
                    <FaCamera className="text-lg" />
                  </button>
                  {selectedFile && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg">
                      <FaCheck className="text-sm" />
                    </div>
                  )}
                </div>

                <div className="flex-1 pb-2">
                  <h2 className="text-3xl font-bold text-p mb-1">{user?.name}</h2>
                  <p className="text-[#6B7280] capitalize flex items-center gap-2">
                    <span className="px-3 py-1 bg-primary bg-opacity-10 text-base-100 rounded-full text-sm font-semibold">
                      {user?.role}
                    </span>
                  </p>
                </div>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <FaEdit />
                    Edit Profile
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
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-p mb-4 flex items-center gap-2">
                    <FaUser className="text-primary" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-p mb-2">Full Name</label>
                      <input
                        title="Full Name"
                        type="text"
                        value={user?.name || ''}
                        disabled
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed flex items-center gap-2"
                      />
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <FaLock className="text-xs" /> Name cannot be changed
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-p mb-2">Email Address</label>
                      <input
                        title="Email Address"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <FaLock className="text-xs" /> Email cannot be changed
                      </p>
                    </div>
                    <div>
                      <label className=" text-sm font-semibold text-p mb-2 flex items-center gap-2">
                        <FaPhone className="text-primary text-sm" />
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
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-gray-900 transition"
                      />
                      <p className="text-xs text-gray-500 mt-1">11 digits starting with 01 (e.g., 01712345678)</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-p mb-2">Role</label>
                      <input
                        title="Role"
                        type="text"
                        value={user?.role || ''}
                        disabled
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed capitalize"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-p mb-4 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-primary" />
                    Location Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-p mb-2">Division</label>
                      <select
                        title="Division"
                        name="division"
                        value={profileData.division}
                        onChange={handleDivisionChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-gray-900 transition"
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
                      <label className="block text-sm font-semibold text-p mb-2">District</label>
                      <select
                        title="District"
                        name="district"
                        value={profileData.district}
                        onChange={handleChange}
                        disabled={!profileData.division}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        <option value="">Select District</option>
                        {districts.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-p mb-2">Full Address</label>
                      <textarea
                        name="address"
                        value={profileData.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white text-gray-900 transition resize-none"
                        placeholder="Enter your complete address (street, building, area, etc.)"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:border-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-linear-to-r from-primary to-[#1e5d22] text-white rounded-lg font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* View Mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <label className="text-sm font-semibold text-p flex items-center gap-2 mb-2">
                      <FaPhone className="text-blue-500 text-sm" />
                      Phone Number
                    </label>
                    <p className="text-lg font-semibold text-p">{profileData.phone || 'Not provided'}</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <label className="text-sm font-semibold text-p flex items-center gap-2 mb-2">
                      <FaMapMarkerAlt className="text-green-500 text-sm" />
                      Location
                    </label>
                    <p className="text-lg font-semibold text-p">{profileData.district || 'Not provided'}, {profileData.division || 'N/A'}</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500 md:col-span-2">
                    <label className="text-sm font-semibold text-p flex items-center gap-2 mb-2">
                      <FaMapMarkerAlt className="text-purple-500 text-sm" />
                      Address
                    </label>
                    <p className="text-lg font-semibold text-p">{profileData.address || 'Not provided'}</p>
                  </div>
                </div>
              </>
            )}
          </form>
        </Card>

        {/* Account Info Card */}
        <Card className="bg-linear-to-r from-slate-50 to-slate-100">
          <h2 className="text-xl font-bold text-p mb-6 flex items-center gap-2">
            <FaCheckCircle className="text-primary" />
            Account Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border-2 border-gray-100 hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-3">
                {user?.approved ? (
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <FaCheck className="text-green-600 text-lg" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <FaClock className="text-yellow-600 text-lg" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-[#6B7280]">Account Status</p>
                  <p className="text-lg font-bold text-p">{user?.approved ? '✅ Approved' : '⏳ Pending'}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border-2 border-gray-100 hover:shadow-lg transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaUser className="text-blue-600 text-lg" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#6B7280]">Member Since</p>
                  <p className="text-lg font-bold text-p">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border-2 border-gray-100 hover:shadow-lg transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 text-lg font-bold">👤</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#6B7280]">User Role</p>
                  <p className="text-lg font-bold text-p capitalize">{user?.role}</p>
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
