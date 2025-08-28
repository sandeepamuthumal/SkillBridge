import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import EmployerInfoForm from './components/EmployerInfoForm.jsx';
import { employerProfileAPI } from '@/services/employer/employerProfileAPI.js';
import { toast } from 'react-toastify';

const ProfileManagementPage = () => {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [saving, setSaving] = useState(false);

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const result = await employerProfileAPI.getProfile();
      console.log('Profile data:', result);
      if (result.success) {
        setProfileData(result.data);
      } else {
        console.error('Failed to load profile:', result.error);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (formData) => {
    setSaving(true);
    try {
      const result = await employerProfileAPI.updateProfile(formData);
      if (result.success) {
        setProfileData(result.data);
        await loadProfileData(); 
        console.log('Profile updated successfully:', result.data);
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update Profile');
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">
              A complete profile helps you hire faster and smarter.
            </p>
          </div>
          {/* BADGE */}
            {!profileData?.verified ? (
              <Badge className="bg-green-600 text-white pointer-events-none hover:bg-green-600">
                VERIFIED
              </Badge>
            ) : (
              <Badge className="bg-red-600 text-white pointer-events-none hover:bg-red-600">
                NOT VERIFIED
              </Badge>
            )}
        </div>

        <EmployerInfoForm
          initialData={profileData || {}}
          onSave={handleProfileUpdate}
          isLoading={saving}
        />
        </div>
    </div>
  )
}

export default ProfileManagementPage
