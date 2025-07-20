import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
  Eye
} from 'lucide-react';

const SeekerProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [profileCompleteness] = useState(65); // This would come from your backend

  // Mock completion status for each section
  const sectionStatus = {
    personal: { completed: true, items: 5, total: 6 },
    ai_upload: { completed: false, items: 0, total: 1 },
    skills: { completed: true, items: 8, total: 10 },
    education: { completed: true, items: 2, total: 2 },
    experience: { completed: false, items: 1, total: 3 },
    projects: { completed: false, items: 2, total: 4 },
    social: { completed: true, items: 3, total: 3 },
    preferences: { completed: false, items: 4, total: 7 }
  };

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

  const StatusIcon = ({ completed }) => {
    return completed ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <Circle className="h-4 w-4 text-gray-400" />
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary-600">Profile</h1>
            <p className="text-muted-foreground">
              Complete your profile to get better job matches
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {profileCompleteness}% Complete
          </Badge>
        </div>
        
        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Profile Completion</span>
                <span className="text-muted-foreground">{profileCompleteness}%</span>
              </div>
              <Progress value={profileCompleteness} className="h-2 " />
              <p className="text-xs text-muted-foreground">
                Complete your profile to increase visibility to employers
              </p>
            </div>
          </CardContent>
        </Card>
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
                  className="flex flex-col items-center gap-2 p-3 h-auto data-[state=active]:bg-gradient-to-r from-blue-600 to-purple-600  data-[state=active]:text-primary-foreground"
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
        {tabs.map((tab) => {
          const status = sectionStatus[tab.id];
          return (
            <TabsContent key={tab.id} value={tab.id} className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <tab.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-purple-600">{tab.label}</CardTitle>
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
                  {/* This is where your actual form components will go */}
                  <div className="min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                    <div className="text-center space-y-2">
                      <tab.icon className="h-12 w-12 text-gray-400 mx-auto" />
                      <h3 className="text-lg font-semibold">
                        {tab.label} Form Component
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

      {/* Quick Stats Cards (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Profile Views</p>
                <p className="text-2xl font-bold">124</p>
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
                <p className="text-2xl font-bold">8</p>
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
                <p className="text-2xl font-bold">2</p>
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
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeekerProfile;
