// src/pages/ProfessionalsPage.jsx

import React, { useState } from 'react';
import {
  Search, MapPin, Briefcase, Star, Users, Filter,
  ArrowRight, Badge as BadgeIcon, Award, Globe, MessageCircle,
  Calendar, Video
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProfessionalsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');

  const roles = [
    { value: 'all', label: 'All Roles' },
    { value: 'developer', label: 'Developer' },
    { value: 'designer', label: 'Designer' },
    { value: 'manager', label: 'Manager' },
    { value: 'analyst', label: 'Analyst' },
    { value: 'consultant', label: 'Consultant' }
  ];

  const experienceLevels = [
    { value: 'all', label: 'All Levels' },
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior Level (6+ years)' },
    { value: 'expert', label: 'Expert Level (10+ years)' }
  ];

  const professionals = [
  {
    id: 1,
    name: 'Saman Perera',
    title: 'Senior Full Stack Developer',
    company: 'TechStart Lanka',
    location: 'Colombo',
    experience: 'senior',
    rating: 4.9,
    reviews: 28,
    hourlyRate: 'LKR 2,500/hr',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=300&fit=crop',
    bio: 'Experienced full-stack developer with expertise in React, Node.js, and cloud technologies. Passionate about building scalable web applications.',
    skills: ['React', 'Node.js', 'Python', 'AWS', 'MongoDB'],
    achievements: ['AWS Certified', 'Top Rated Freelancer', '50+ Projects'],
    availability: 'Available',
    languages: ['English', 'Sinhala'],
    category: 'developer',
    responseTime: '< 2 hours',
    completedProjects: 47
  },
  {
    id: 2,
    name: 'Priya Rajapaksa',
    title: 'UX/UI Designer',
    company: 'Creative Studio',
    location: 'Kandy',
    experience: 'mid',
    rating: 4.8,
    reviews: 22,
    hourlyRate: 'LKR 2,000/hr',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b9c84c8a?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&h=300&fit=crop',
    bio: 'Creative UX/UI designer with a passion for creating intuitive and beautiful user experiences. Specialized in mobile and web design.',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
    achievements: ['Design Award Winner', 'Top 10 Designer', '30+ Apps Designed'],
    availability: 'Available',
    languages: ['English', 'Sinhala', 'Tamil'],
    category: 'designer',
    responseTime: '< 1 hour',
    completedProjects: 32
  },
  {
    id: 3,
    name: 'Kasun Silva',
    title: 'Data Scientist',
    company: 'DataInsights',
    location: 'Colombo',
    experience: 'mid',
    rating: 4.7,
    reviews: 19,
    hourlyRate: 'LKR 3,000/hr',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop',
    bio: 'Data scientist with expertise in machine learning, statistical analysis, and business intelligence. Helping companies make data-driven decisions.',
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Tableau'],
    achievements: ['PhD in Statistics', 'Published Researcher', '15+ ML Models'],
    availability: 'Busy',
    languages: ['English', 'Sinhala'],
    category: 'analyst',
    responseTime: '< 4 hours',
    completedProjects: 23
  },
  {
    id: 4,
    name: 'Nimal Fernando',
    title: 'Project Manager',
    company: 'Startup Accelerator',
    location: 'Galle',
    experience: 'senior',
    rating: 4.6,
    reviews: 35,
    hourlyRate: 'LKR 2,200/hr',
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=300&fit=crop',
    bio: 'Experienced project manager with a track record of delivering complex projects on time and within budget. Agile and Scrum certified.',
    skills: ['Project Management', 'Agile', 'Scrum', 'Team Leadership', 'Strategy'],
    achievements: ['PMP Certified', 'Agile Master', '100+ Projects'],
    availability: 'Available',
    languages: ['English', 'Sinhala'],
    category: 'manager',
    responseTime: '< 3 hours',
    completedProjects: 89
  },
  {
    id: 5,
    name: 'Amara Wickramasinghe',
    title: 'Digital Marketing Specialist',
    company: 'Growth Hub',
    location: 'Remote',
    experience: 'mid',
    rating: 4.8,
    reviews: 24,
    hourlyRate: 'LKR 1,800/hr',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop',
    bio: 'Digital marketing expert specializing in SEO, social media marketing, and content strategy. Helping startups grow their online presence.',
    skills: ['SEO', 'Social Media', 'Content Marketing', 'Google Ads', 'Analytics'],
    achievements: ['Google Certified', 'Marketing Expert', '200% Growth Average'],
    availability: 'Available',
    languages: ['English', 'Sinhala'],
    category: 'consultant',
    responseTime: '< 1 hour',
    completedProjects: 56
  },
  {
    id: 6,
    name: 'Ruwan Jayawardena',
    title: 'Mobile App Developer',
    company: 'InnovateGlobal',
    location: 'Colombo',
    experience: 'senior',
    rating: 4.9,
    reviews: 31,
    hourlyRate: 'LKR 2,800/hr',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=300&fit=crop',
    bio: 'Mobile app developer with expertise in React Native and Flutter. Built 40+ mobile applications with millions of downloads.',
    skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Firebase'],
    achievements: ['App Store Featured', 'Mobile Expert', '40+ Apps Published'],
    availability: 'Available',
    languages: ['English', 'Sinhala'],
    category: 'developer',
    responseTime: '< 2 hours',
    completedProjects: 64
  }
];



  const filteredProfessionals = professionals.filter(professional => {
    const matchesSearch = professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = selectedRole === 'all' || professional.category === selectedRole;
    const matchesExperience = selectedExperience === 'all' || professional.experience === selectedExperience;

    return matchesSearch && matchesRole && matchesExperience;
  });

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'Available': return 'bg-green-100 text-green-800 border-green-200';
      case 'Busy': return 'bg-red-100 text-red-800 border-red-200';
      case 'Part-time': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getExperienceLabel = (experience) => {
    switch (experience) {
      case 'entry': return 'Entry Level';
      case 'mid': return 'Mid Level';
      case 'senior': return 'Senior Level';
      case 'expert': return 'Expert Level';
      default: return experience;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-teal-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=400&fit=crop')] bg-cover bg-center bg-blend-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <br></br>
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">
              Connect with Top <span className="text-yellow-300">Professionals</span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Find experienced professionals and mentors to help your startup grow and succeed
            </p>
          </div>

          {/* Search */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search professionals, skills, or expertise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 text-lg border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl text-black"
                  />
                </div>
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="h-14 border-gray-200 rounded-xl text-black">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                <SelectTrigger className="h-14 border-gray-200 rounded-xl text-black">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {filteredProfessionals.length} Professionals Found
          </h2>
          <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProfessionals.map((p) => (
            <Card key={p.id} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white overflow-hidden transform hover:-translate-y-2">
              {/* Card top */}
              <div className="relative h-48 overflow-hidden">
                <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <Badge className={`absolute top-4 left-4 ${getAvailabilityColor(p.availability)} border font-medium px-3 py-1`}>
                  {p.availability}
                </Badge>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white transition-colors">
                    <MessageCircle className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white transition-colors">
                    <Video className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4">
                  <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                    <AvatarImage src={p.profileImage} alt={p.name} />
                    <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-green-500 to-teal-500 text-white">
                      {p.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-white text-xl font-bold mb-1 group-hover:text-yellow-300 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-white/90 font-medium">{p.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-white font-medium">{p.rating}</span>
                      <span className="text-white/70">({p.reviews})</span>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-4 text-sm text-gray-500 flex-1">
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{p.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{p.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{p.hourlyRate}</div>
                    <div className="text-sm text-gray-500">Response: {p.responseTime}</div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{p.bio}</p>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                      Skills & Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {p.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200 px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4 text-green-600" />
                      Achievements
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {p.achievements.map((ach) => (
                        <Badge key={ach} variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 transition-colors px-3 py-1">
                          <Award className="h-3 w-3 mr-1" />
                          {ach}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <BadgeIcon className="h-4 w-4" />
                      <span>{getExperienceLabel(p.experience)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{p.completedProjects} projects</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <span>{p.languages.join(', ')}</span>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white flex items-center gap-2 group px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all">
                    Contact
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button variant="outline" size="lg" className="px-8 py-3 rounded-xl border-2 hover:bg-gray-50 transition-colors">
            Load More Professionals
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalsPage;
