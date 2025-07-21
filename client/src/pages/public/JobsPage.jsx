// src/pages/JobsPage.jsx

import React, { useState } from 'react';
import {
  Search, MapPin, Clock, DollarSign, Filter, Briefcase,
  Users, Star, ArrowRight, Share2, Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select';

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [savedJobs, setSavedJobs] = useState(new Set());

  const jobCategories = [
    { value: 'all', label: 'All Categories' },
    { value: 'tech', label: 'Technology' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' }
  ];

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'colombo', label: 'Colombo' },
    { value: 'kandy', label: 'Kandy' },
    { value: 'galle', label: 'Galle' },
    { value: 'remote', label: 'Remote' }
  ];

  const jobListings = [
  {
    id: 1,
    title: 'Frontend Developer Intern',
    company: 'TechStart Lanka',
    location: 'Colombo',
    type: 'Internship',
    salary: 'LKR 25,000 - 35,000',
    posted: '2 days ago',
    description: 'Join our dynamic team to build cutting-edge web applications using React and modern technologies.',
    skills: ['React', 'JavaScript', 'CSS', 'HTML'],
    rating: 4.8,
    applicants: 15,
    category: 'tech',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
    companyLogo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=80&h=80&fit=crop'
  },
  {
    id: 2,
    title: 'UI/UX Design Intern',
    company: 'Creative Studio',
    location: 'Kandy',
    type: 'Part-time',
    salary: 'LKR 20,000 - 30,000',
    posted: '1 day ago',
    description: 'Create beautiful and intuitive user experiences for mobile and web applications.',
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    rating: 4.9,
    applicants: 8,
    category: 'design',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=300&fit=crop',
    companyLogo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=80&h=80&fit=crop'
  },
  {
    id: 3,
    title: 'Junior Software Engineer',
    company: 'InnovateGlobal',
    location: 'Remote',
    type: 'Full-time',
    salary: 'LKR 45,000 - 65,000',
    posted: '4 days ago',
    description: 'Build scalable software solutions for international clients.',
    skills: ['Node.js', 'MongoDB', 'API Development', 'Cloud'],
    rating: 4.9,
    applicants: 31,
    category: 'tech',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    companyLogo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=80&h=80&fit=crop'
  }
];


  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || job.location.toLowerCase() === selectedLocation;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case 'Internship': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Part-time': return 'bg-green-100 text-green-800 border-green-200';
      case 'Freelance': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Full-time': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=400&fit=crop')] bg-cover bg-center bg-blend-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
             <br></br>
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">
              Find Your Perfect <span className="text-yellow-300">Opportunity</span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Discover internships, part-time roles, and freelance opportunities with innovative startups
            </p>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl text-black"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-14 border-gray-200 rounded-xl text-gray-700">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {jobCategories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="h-14 border-gray-200 rounded-xl text-gray-700">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(loc => (
                    <SelectItem key={loc.value} value={loc.value}>{loc.label}</SelectItem>
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
            {filteredJobs.length} Opportunities Found
          </h2>
          <Button variant="outline" className="flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50 overflow-hidden transform hover:-translate-y-2">
              <div className="relative h-48 overflow-hidden">
                <img src={job.image} alt={job.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white" onClick={() => toggleSaveJob(job.id)}>
                    <Bookmark className={`h-4 w-4 ${savedJobs.has(job.id) ? 'fill-current text-blue-600' : 'text-gray-600'}`} />
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                    <Share2 className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
                <Badge className={`absolute top-4 left-4 ${getTypeColor(job.type)} border font-medium px-3 py-1`}>
                  {job.type}
                </Badge>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white text-xl font-bold mb-1 group-hover:text-yellow-300 transition-colors">
                    {job.title}
                  </h3>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <img src={job.companyLogo} alt={job.company} className="w-12 h-12 rounded-full object-cover border-2 border-gray-100" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Briefcase className="h-4 w-4" />
                      <span className="font-medium text-gray-900">{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{job.rating}</span>
                      <span className="text-sm text-gray-500">({job.applicants} reviews)</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{job.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200 px-3 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-6 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{job.salary}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{job.posted}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>{job.applicants} applicants</span>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2 group px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all">
                    Apply Now
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button variant="outline" size="lg" className="px-8 py-3 rounded-xl border-2 hover:bg-gray-50 transition-colors">
            Load More Opportunities
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;
