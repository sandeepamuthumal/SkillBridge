import React, { useState } from "react";
import {
  Search,
  MapPin,
  Users,
  Star,
  Building,
  ArrowRight,
  Filter,
  Trophy,
  Zap,
  Heart,
  Eye,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [followedCompanies, setFollowedCompanies] = useState(new Set());

  const industries = [
    { value: "all", label: "All Industries" },
    { value: "tech", label: "Technology" },
    { value: "fintech", label: "Fintech" },
    { value: "ecommerce", label: "E-commerce" },
    { value: "healthtech", label: "Healthcare" },
    { value: "edtech", label: "Education" },
    { value: "design", label: "Design & Creative" },
    { value: "data", label: "Data Analytics" },
    { value: "green", label: "Green Technology" },
  ];

  const companySizes = [
    { value: "all", label: "All Sizes" },
    { value: "startup", label: "Startup (1-10)" },
    { value: "small", label: "Small (11-50)" },
    { value: "medium", label: "Medium (51-200)" },
    { value: "large", label: "Large (200+)" },
  ];

  const companies = [
    {
      id: 1,
      name: "TechStart Lanka",
      industry: "Technology",
      size: "startup",
      location: "Colombo",
      rating: 4.8,
      reviews: 24,
      openJobs: 5,
      description:
        "Building the next generation of web applications with cutting-edge technology and innovative solutions.",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=80&h=80&fit=crop",
      coverImage:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=300&fit=crop",
      founded: "2020",
      employees: "8-15",
      website: "techstart.lk",
      specialties: ["Web Development", "Mobile Apps", "AI/ML"],
      culture: ["Innovation", "Work-Life Balance", "Growth Opportunities"],
      category: "tech",
    },
    {
      id: 2,
      name: "Creative Studio",
      industry: "Design & Creative",
      size: "small",
      location: "Kandy",
      rating: 4.9,
      reviews: 18,
      openJobs: 3,
      description:
        "Award-winning design studio creating beautiful digital experiences for startups and enterprises.",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=80&h=80&fit=crop",
      coverImage:
        "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&h=300&fit=crop",
      founded: "2019",
      employees: "12-25",
      website: "creativestudio.lk",
      specialties: ["UI/UX Design", "Branding", "Digital Marketing"],
      culture: ["Creativity", "Collaboration", "Remote-Friendly"],
      category: "design",
    },
    {
      id: 3,
      name: "DataInsights",
      industry: "Data Analytics",
      size: "medium",
      location: "Colombo",
      rating: 4.7,
      reviews: 31,
      openJobs: 8,
      description:
        "Empowering businesses with data-driven insights and advanced analytics solutions.",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=80&h=80&fit=crop",
      coverImage:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop",
      founded: "2018",
      employees: "45-70",
      website: "datainsights.lk",
      specialties: [
        "Data Science",
        "Business Intelligence",
        "Machine Learning",
      ],
      culture: ["Data-Driven", "Learning Culture", "Flexible Hours"],
      category: "tech",
    },
    {
      id: 4,
      name: "EcoTech Solutions",
      industry: "Green Technology",
      size: "startup",
      location: "Galle",
      rating: 4.6,
      reviews: 12,
      openJobs: 4,
      description:
        "Sustainable technology solutions for a greener future, focusing on renewable energy and waste management.",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=80&h=80&fit=crop",
      coverImage:
        "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=300&fit=crop",
      founded: "2021",
      employees: "6-12",
      website: "ecotech.lk",
      specialties: ["Renewable Energy", "IoT", "Sustainability"],
      culture: ["Environmental Impact", "Innovation", "Team Spirit"],
      category: "tech",
    },
    {
      id: 5,
      name: "FinanceFlow",
      industry: "Fintech",
      size: "small",
      location: "Colombo",
      rating: 4.5,
      reviews: 28,
      openJobs: 6,
      description:
        "Revolutionary fintech startup making financial services accessible to everyone in Sri Lanka.",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=80&h=80&fit=crop",
      coverImage:
        "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=300&fit=crop",
      founded: "2020",
      employees: "15-30",
      website: "financeflow.lk",
      specialties: ["Mobile Banking", "Payments", "Financial Analytics"],
      culture: ["Fast-Paced", "Customer-Centric", "Growth Mindset"],
      category: "fintech",
    },
    {
      id: 6,
      name: "EduTech Hub",
      industry: "Education Technology",
      size: "medium",
      location: "Remote",
      rating: 4.8,
      reviews: 45,
      openJobs: 7,
      description:
        "Transforming education through technology with innovative learning platforms and digital solutions.",
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=80&h=80&fit=crop",
      coverImage:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=300&fit=crop",
      founded: "2017",
      employees: "35-60",
      website: "edutechhub.lk",
      specialties: ["E-Learning", "Educational Apps", "Content Creation"],
      culture: ["Education First", "Remote Work", "Continuous Learning"],
      category: "edtech",
    },
  ];

  const filteredCompanies = companies.filter((company) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      company.name.toLowerCase().includes(lowerSearch) ||
      company.industry.toLowerCase().includes(lowerSearch) ||
      company.specialties.some((spec) =>
        spec.toLowerCase().includes(lowerSearch)
      );
    const matchesIndustry =
      selectedIndustry === "all" || company.category === selectedIndustry;
    const matchesSize = selectedSize === "all" || company.size === selectedSize;

    return matchesSearch && matchesIndustry && matchesSize;
  });

  const getSizeLabel = (size) => {
    switch (size) {
      case "startup":
        return "Startup";
      case "small":
        return "Small";
      case "medium":
        return "Medium";
      case "large":
        return "Large";
      default:
        return size;
    }
  };

  const toggleFollow = (companyId) => {
    const newFollowed = new Set(followedCompanies);
    if (newFollowed.has(companyId)) {
      newFollowed.delete(companyId);
    } else {
      newFollowed.add(companyId);
    }
    setFollowedCompanies(newFollowed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop')] bg-cover bg-center bg-blend-overlay"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">
              Discover Amazing{" "}
              <span className="text-yellow-300">Companies</span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Explore innovative startups and companies that are shaping the
              future of work in Sri Lanka
            </p>
          </div>

          {/* Enhanced Search Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-black/30 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              {/* Search Input */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 transition-colors duration-300" />
                <Input
                  placeholder="Search companies, industries, or specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-14 h-16 text-lg text-black border-gray-300 focus:border-purple-600 focus:ring-4 focus:ring-purple-300 rounded-2xl shadow-sm transition-shadow duration-300"
                  aria-label="Search companies, industries, or specialties"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                    aria-label="Clear search"
                    type="button"
                  >
                    &#x2715;
                  </button>
                )}
              </div>

              {/* Industry Select */}
              <Select
                value={selectedIndustry}
                onValueChange={(value) => setSelectedIndustry(value)}
              >
                <SelectTrigger
                  className="h-16 border-gray-300 rounded-2xl shadow-sm hover:border-purple-600 focus:border-purple-600 focus:ring-4 focus:ring-purple-300 transition-colors duration-300 flex items-center gap-2 px-4 cursor-pointer text-black"
                  aria-label="Filter by Industry"
                  title="Filter by Industry"
                >
                  <Globe className="w-5 h-5 text-purple-500" />
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Company Size Select */}
              <Select
                value={selectedSize}
                onValueChange={(value) => setSelectedSize(value)}
              >
                <SelectTrigger
                  className="h-16 border-gray-300 rounded-2xl shadow-sm hover:border-purple-600 focus:border-purple-600 focus:ring-4 focus:ring-purple-300 transition-colors duration-300 flex items-center gap-2 px-4 cursor-pointer text-black"
                  aria-label="Filter by Company Size"
                  title="Filter by Company Size"
                >
                  <Users className="w-5 h-5 text-purple-500" />
                  <SelectValue placeholder="Company Size" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Reset Filters Button */}
              {(searchTerm !== "" ||
                selectedIndustry !== "all" ||
                selectedSize !== "all") && (
                <div className="md:col-span-4 flex justify-end mt-4 md:mt-0">
                  <Button
                    variant="ghost"
                    className="text-purple-600 hover:text-purple-800 font-semibold"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedIndustry("all");
                      setSelectedSize("all");
                    }}
                    aria-label="Reset all filters"
                    title="Reset all filters"
                  >
                    Clear Filters &#x2715;
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {filteredCompanies.length} Companies Found
          </h2>
          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>

        {/* Enhanced Company Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCompanies.map((company) => (
            <Card
              key={company.id}
              className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white overflow-hidden transform hover:-translate-y-2"
            >
              {/* Company Cover Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={company.coverImage}
                  alt={company.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white transition-colors"
                    onClick={() => toggleFollow(company.id)}
                    aria-label={`${
                      followedCompanies.has(company.id) ? "Unfollow" : "Follow"
                    } ${company.name}`}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        followedCompanies.has(company.id)
                          ? "fill-current text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white transition-colors"
                    aria-label={`View ${company.name}`}
                  >
                    <Eye className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
                <Badge className="absolute top-4 left-4 bg-purple-100 text-purple-800 border-purple-200 border font-medium px-3 py-1">
                  {getSizeLabel(company.size)}
                </Badge>

                {/* Company Logo and Basic Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4">
                  <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                    <AvatarImage src={company.logo} alt={company.name} />
                    <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                      {company.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-white text-xl font-bold mb-1 group-hover:text-yellow-300 transition-colors">
                      {company.name}
                    </h3>
                    <p className="text-white/90 font-medium">
                      {company.industry}
                    </p>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-4 text-sm text-gray-500 flex-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{company.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{company.employees}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{company.rating}</span>
                    <span className="text-gray-400">({company.reviews})</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                  {company.description}
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-600" />
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {company.specialties.map((specialty) => (
                        <Badge
                          key={specialty}
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200 px-3 py-1"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-green-600" />
                      Culture & Values
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {company.culture.map((value) => (
                        <Badge
                          key={value}
                          variant="outline"
                          className="border-green-200 text-green-700 hover:bg-green-50 transition-colors px-3 py-1"
                        >
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      <span>Founded {company.founded}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full">
                      <Trophy className="h-3 w-3" />
                      <span className="font-medium">
                        {company.openJobs} open positions
                      </span>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center gap-2 group px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all">
                    View Company
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Section */}
        <div className="text-center mt-16">
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 rounded-xl border-2 hover:bg-gray-50 transition-colors"
          >
            Load More Companies
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Companies;
