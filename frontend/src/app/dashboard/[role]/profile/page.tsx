'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userAPI } from '@/utils/api';
import DashboardLayout from '@/components/common/DashboardLayout';
import { Button, Card, Input } from '@/components/common';
import toast from 'react-hot-toast';
import divisionsData from '@/data/divisionsData.json';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  division: string;
  district: string;
  address: string;
}

const ProfilePage = () => {
  const { user, updateUser: updateAuthUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    division: '',
    district: '',
    address: '',
  });
  const [districts, setDistricts] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        division: user.division || '',
        district: user.district || '',
        address: user.address || '',
      });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userAPI.updateProfile(profileData);
      
      if (response.success) {
        // Update auth context with new user data
        const updatedUser = { ...user, ...response.data };
        localStorage.setItem('nn_user', JSON.stringify(updatedUser));
        updateAuthUser(updatedUser);
        
        toast.success('Profile updated successfully!');
      }
    } catch (error: any) {
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
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Update your personal information</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Info Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={handleChange}
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
    </DashboardLayout>
  );
};

export default ProfilePage;
