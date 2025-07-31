// Updated ProfilePage.jsx with AI CV Upload integration
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
import AICVUpload from './components/AICVUpload';
import { seekerProfileAPI } from '@/services/jobseeker/seekerProfileAPI';
import { toast } from 'react-toastify';
import SkillsForm from './components/SkillsForm';
import EducationForm from './components/EducationForm';
import ExperienceForm from './components/ExperienceForm';
import ProjectsForm from './components/ProjectsForm';
import SocialLinksForm from './components/SocialLinksForm';
import JobPreferencesForm from './components/JobPreferencesForm';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Enhanced section status tracking
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
        updateAllSectionStatus(result.data);
      } else {
        console.error('Failed to load profile:', result.error);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAllSectionStatus = (data) => {
    setSectionStatus(prev => ({
      ...prev,
      personal: calculatePersonalStatus(data),
      ai_upload: calculateAIUploadStatus(data),
      skills: calculateSkillsStatus(data),
      education: calculateEducationStatus(data),
      experience: calculateExperienceStatus(data),
      projects: calculateProjectsStatus(data),
      social: calculateSocialStatus(data),
      preferences: calculatePreferencesStatus(data)
    }));
  };

  const calculatePersonalStatus = (data) => {
    const requiredFields = ['firstName', 'lastName', 'email', 'university', 'fieldOfStudy'];
    const optionalFields = ['statementHeader', 'statement', 'profilePictureUrl'];
    
    const completedRequired = requiredFields.filter(field => data?.[field]?.trim()).length;
    const completedOptional = optionalFields.filter(field => data?.[field]?.trim()).length;
    const totalCompleted = completedRequired + completedOptional;
    
    return {
      completed: completedRequired === requiredFields.length,
      items: totalCompleted,
      total: requiredFields.length + optionalFields.length
    };
  };

  const calculateAIUploadStatus = (data) => {
    const hasCV = data?.resumeUrl?.trim();
    return {
      completed: !!hasCV,
      items: hasCV ? 1 : 0,
      total: 1
    };
  };

  const calculateSkillsStatus = (data) => {
    const skillsCount = data?.skills?.length || 0;
    return {
      completed: skillsCount >= 5,
      items: Math.min(skillsCount, 5),
      total: 5
    };
  };

  const calculateEducationStatus = (data) => {
    const educationCount = data?.educations?.length || 0;
    return {
      completed: educationCount >= 1,
      items: Math.min(educationCount, 3),
      total: 3
    };
  };

  const calculateExperienceStatus = (data) => {
    const experienceCount = data?.experiences?.length || 0;
    return {
      completed: experienceCount >= 1,
      items: Math.min(experienceCount, 3),
      total: 3
    };
  };

  const calculateProjectsStatus = (data) => {
    const projectsCount = data?.projects?.length || 0;
    return {
      completed: projectsCount >= 2,
      items: Math.min(projectsCount, 4),
      total: 4
    };
  };

  const calculateSocialStatus = (data) => {
    const socialFields = ['linkedin', 'github', 'portfolio'];
    const completedSocial = socialFields.filter(field => 
      data?.socialLinks?.[field]?.trim()
    ).length;
    
    return {
      completed: completedSocial >= 2,
      items: completedSocial,
      total: 3
    };
  };

  const calculatePreferencesStatus = (data) => {
    const preferenceFields = [
      'availability',
      'expectedSalary',
      'jobPreferences.jobTypes',
      'jobPreferences.categories',
      'jobPreferences.remoteWork'
    ];
    
    let completedPreferences = 0;
    if (data?.availability) completedPreferences++;
    if (data?.expectedSalary?.min && data?.expectedSalary?.max) completedPreferences++;
    if (data?.jobPreferences?.jobTypes?.length > 0) completedPreferences++;
    if (data?.jobPreferences?.categories?.length > 0) completedPreferences++;
    if (data?.jobPreferences?.remoteWork !== undefined) completedPreferences++;
    if (data?.cityId) completedPreferences++;
    
    return {
      completed: completedPreferences >= 5,
      items: completedPreferences,
      total: 7
    };
  };

  const handleProfileUpdate = async (formData) => {
    setSaving(true);
    try {
      const result = await seekerProfileAPI.updateProfile(formData);
      if (result.success) {
        setProfileData(result.data);
        await loadProfileData(); // Reload to get updated completion status
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

  const handleMoveToNextSection = (sectionId) => {
    setActiveTab(sectionId);
  };

  const StatusIcon = ({ completed }) => {
    return completed ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <Circle className="h-4 w-4 text-gray-400" />
    );
  };

  const overallCompletion = profileData ? profileData.profileCompleteness : 0;

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
              Start with uploading your CV using AI extraction for quick profile completion.
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

        <TabsContent value="ai_upload" className="space-y-6">
          <AICVUpload
            profileData={profileData}
            onProfileUpdate={handleProfileUpdate}
            onMoveToNextSection={handleMoveToNextSection}
            loadProfileData={loadProfileData}
          />
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <SkillsForm
            initialData={profileData}
            onSave={handleProfileUpdate}
            isLoading={saving}
          />
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <EducationForm
            initialData={profileData}
            onSave={handleProfileUpdate}
            isLoading={saving}
          />
        </TabsContent>

        <TabsContent value="experience" className="space-y-6">
          <ExperienceForm
            initialData={profileData}
            onSave={handleProfileUpdate}
            isLoading={saving}
          />
        </TabsContent>
        <TabsContent value="projects" className="space-y-6">
          <ProjectsForm
            initialData={profileData}
            onSave={handleProfileUpdate}
            isLoading={saving}
          />
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <SocialLinksForm
            initialData={profileData}
            onSave={handleProfileUpdate}
            isLoading={saving}
          />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <JobPreferencesForm
            initialData={profileData}
            onSave={handleProfileUpdate}
            isLoading={saving}
          />
        </TabsContent>
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