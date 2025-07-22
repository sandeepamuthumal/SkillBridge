import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Upload, 
  Award, 
  GraduationCap, 
  Briefcase, 
  FolderOpen, 
  Link, 
  Settings,
  CheckCircle,
  Circle,
  Star,
  Eye,
  AlertCircle
} from 'lucide-react';
import PersonalInfoForm from './components/PersonalInfoForm';
import { seekerProfileAPI } from '@/services/jobseeker/seekerProfileAPI';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Mock completion status for each section - replace with actual data
  const [sectionStatus, setSectionStatus] = useState({
    personal: { completed: false, items: 0, total: 8 },
    ai_upload: { completed: false, items: 0, total: 1 },
    skills: { completed: false, items: 0, total: 5 },
    education: { completed: false, items: 0, total: 3 },
    experience: { completed: false, items: 0, total: 3 },
    projects: { completed: false, items: 0, total: 4 },
    social: { completed: false, items: 0, total: 3 },
    preferences: { completed: false, items: 0, total: 7 }
  });

  const tabs = [
    {
      id: 'personal',
      label: 'Personal Info',
      icon: User,
      description: 'Basic information and profile statement'
    },
    {
      id: 'ai_upload',
      label: 'AI CV Upload',
      icon: Upload,
      description: 'Upload CV for automatic data extraction'
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: Award,
      description: 'Technical and soft skills with proficiency levels'
    },
    {
      id: 'education',
      label: 'Education',
      icon: GraduationCap,
      description: 'Academic background and qualifications'
    },
    {
      id: 'experience',
      label: 'Experience',
      icon: Briefcase,
      description: 'Work history and professional experience'
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: FolderOpen,
      description: 'Portfolio projects and achievements'
    },
    {
      id: 'social',
      label: 'Social Links',
      icon: Link,
      description: 'Professional social media profiles'
    },
    {
      id: 'preferences',
      label: 'Job Preferences',
      icon: Settings,
      description: 'Job type, salary, and availability preferences'
    }
  ];

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const result = await seekerProfileAPI.getProfile();
      console.log('Profile data:', result);
      if (result.success) {
        setProfileData(result.data);
        updateSectionStatus('personal', result.data);
      } else {
        console.error('Failed to load profile:', result.error);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSectionStatus = (section, data) => {
    if (section === 'personal') {
      const requiredFields = ['firstName', 'lastName', 'email', 'university', 'fieldOfStudy'];
      const optionalFields = ['statementHeader', 'statement', 'profilePictureUrl'];
      
      const completedRequired = requiredFields.filter(field => data?.[field]?.trim()).length;
      const completedOptional = optionalFields.filter(field => data?.[field]?.trim()).length;
      const totalCompleted = completedRequired + completedOptional;
      
      setSectionStatus(prev => ({
        ...prev,
        personal: {
          completed: completedRequired === requiredFields.length,
          items: totalCompleted,
          total: requiredFields.length + optionalFields.length
        }
      }));
    }
  };

  const handleProfileUpdate = async (formData) => {
    setSaving(true);
    try {
      const result = await seekerProfileAPI.updateProfile(formData);
      if (result.success) {
        setProfileData(result.data);
        loadProfileData();
        toast.success('Profile updated successfully');
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

  const calculateOverallCompletion = () => {
    const sections = Object.values(sectionStatus);
    const totalItems = sections.reduce((sum, section) => sum + section.total, 0);
    const completedItems = sections.reduce((sum, section) => sum + section.items, 0);
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  const StatusIcon = ({ completed }) => {
    return completed ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <Circle className="h-4 w-4 text-gray-400" />
    );
  };

  const overallCompletion = calculateOverallCompletion();

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">
              Complete your profile to get better job matches
            </p>
          </div>
          <Badge variant={overallCompletion > 70 ? "default" : "secondary"} className="text-sm">
            {overallCompletion}% Complete
          </Badge>
        </div>
        
        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Profile Completion</span>
                <span className="text-muted-foreground">{overallCompletion}%</span>
              </div>
              <Progress value={overallCompletion} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Complete your profile to increase visibility to employers
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        {overallCompletion < 50 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Tip:</strong> Profiles with 70%+ completion get 3x more views from employers. 
              Start with your personal information and work experience.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Main Tabs Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Tab Navigation */}
        <div className="border-b">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 h-auto p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const status = sectionStatus[tab.id];
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center gap-2 p-3 h-auto data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  <div className="flex items-center gap-1">
                    <Icon className="h-4 w-4" />
                    <StatusIcon completed={status.completed} />
                  </div>
                  <span className="text-xs font-medium hidden sm:block">
                    {tab.label}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Tab Content Sections */}
        <TabsContent value="personal" className="space-y-6">
          <PersonalInfoForm
            initialData={profileData}
            onSave={handleProfileUpdate}
            isLoading={saving}
          />
        </TabsContent>

        {/* Placeholder for other tabs */}
        {tabs.slice(1).map((tab) => {
          const status = sectionStatus[tab.id];
          return (
            <TabsContent key={tab.id} value={tab.id} className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <tab.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{tab.label}</CardTitle>
                        <CardDescription>{tab.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={status.completed ? "default" : "secondary"}>
                        {status.items}/{status.total} Complete
                      </Badge>
                      <StatusIcon completed={status.completed} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                    <div className="text-center space-y-2">
                      <tab.icon className="h-12 w-12 text-gray-400 mx-auto" />
                      <h3 className="text-lg font-semibold">
                        {tab.label} Coming Soon
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        This section will contain the form for {tab.description.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Profile Views</p>
                <p className="text-2xl font-bold">{profileData?.profileViews || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Skills Added</p>
                <p className="text-2xl font-bold">{profileData?.skills?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FolderOpen className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Projects</p>
                <p className="text-2xl font-bold">{profileData?.projects?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Briefcase className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Experience</p>
                <p className="text-2xl font-bold">{profileData?.experiences?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;