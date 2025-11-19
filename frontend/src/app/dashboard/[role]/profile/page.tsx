'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userAPI } from '@/utils/api';
import { Button, Card, Input } from '@/components/common';
import toast from 'react-hot-toast';
import divisionsData from '@/data/divisionsData.json';

interface ProfileData {
  phone: string;
  division: string;
  district: string;
  address: string;
}

const ProfilePage = () => {
  const { user, updateUser: updateAuthUser } = useAuth();
  const [loading, setLoading] = useState(false);
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setProfileData({
        phone: user.phone || '',
        division: user.division || '',
        district: user.district || '',
        address: user.address || '',
      });

      // Load profile picture from database if exists
      if (user.profilePicture) {
        setProfilePicture(user.profilePicture);
      }

      // Set districts based on division
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
    setLoading(true);

    try {
      // Show uploading toast if image is selected
      if (selectedFile) {
        toast.loading('Uploading image...', { id: 'upload' });
      }

      // Prepare update data
      const updateData = {
        ...profileData,
        ...(selectedFile && { profilePicture: profilePicture }), // Include base64 image if selected
      };

      const response = await userAPI.updateProfile(updateData);

      if (response.success) {
        // Dismiss uploading toast
        if (selectedFile) {
          toast.dismiss('upload');
        }

        // Update auth context with new user data
        const updatedUser = { ...user, ...response.data };
        localStorage.setItem('nn_user', JSON.stringify(updatedUser));
        updateAuthUser(updatedUser);

        // Reset selected file after successful upload
        setSelectedFile(null);

        toast.success('Profile updated successfully!');
      }
    } catch (error: any) {
      toast.dismiss('upload');
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Update your personal information</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Profile Picture</h2>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className={`w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-4 shadow-lg ${selectedFile ? 'border-primary' : 'border-white'}`}>
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary text-white text-4xl font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  {selectedFile && (
                    <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full px-3 py-1 text-xs font-medium">
                      New
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    aria-label="Upload profile picture"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose Photo
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* User Info Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    disabled
                    aria-label="Full Name (Read-only)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Name cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    aria-label="Email Address (Read-only)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={handleChange}
                  placeholder="+880 1XXX-XXXXXX"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={user?.role || ''}
                    disabled
                    aria-label="User Role"
                    placeholder="Role"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed capitalize"
                  />
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Division
                  </label>
                  <select
                    name="division"
                    value={profileData.division}
                    onChange={handleDivisionChange}
                    aria-label="Select Division"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District
                  </label>
                  <select
                    name="district"
                    value={profileData.district}
                    onChange={handleChange}
                    disabled={!profileData.division}
                    aria-label="Select District"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900"
                    placeholder="Enter your full address"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading} className="min-w-[150px]">
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Account Info Card */}
        <Card className="mt-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Account Status</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {user?.approved ? '✅ Approved' : '⏳ Pending'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="text-lg font-semibold text-gray-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ProfilePage;
