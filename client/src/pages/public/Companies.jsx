import React, { useState, useEffect } from "react";
import { getAllCompanies } from "@/services/api";

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
  ArrowUp, // Import ArrowUp icon for the scroll-to-top button
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
import { Link } from "react-router-dom";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [followedCompanies, setFollowedCompanies] = useState(new Set());
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  // New state for scroll-to-top button visibility
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const industries = [
    { value: "all", label: "All Industries" },
    { value: "logistics", label: "Logistics" },
    { value: "technology", label: "Technology" },
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

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const rawData = await getAllCompanies();
        console.log(rawData);

        // Map the raw data from the API to the structure the component expects
        const transformedData = rawData.map(company => ({
          id: company._id,
          name: company.companyName || "N/A",
          coverImage: company.coverImage || "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1740&auto=format&fit=crop", // Fallback cover image
          logo: company.logoUrl ? serverUrl + company.logoUrl : "https://placehold.co/100x100?text=Logo", // Fallback logo
          industry: company.industry || "N/A",
          location: company.contactInfo?.address || "N/A", // Use optional chaining
          employees: company.companySize || "N/A", // The size string
          rating: "N/A", // Placeholder
          reviews: "N/A", // Placeholder
          description: company.companyDescription || "No description provided.",
          specialties: [], // Placeholder as it doesn't exist in your data
          culture: [], // Placeholder
          founded: company.foundedYear || "N/A",
          openJobs: "0", // Placeholder
          category: company.industry?.toLowerCase() || "N/A",
        }));

        setCompanies(transformedData);
      } catch (error) {
        console.error("Error fetching companies:", error);
        setError("Failed to fetch companies. Please try again later." + error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Effect for scroll-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) { // Show button after scrolling down 300px
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll); // Add scroll event listener
    return () => {
      window.removeEventListener("scroll", handleScroll); // Clean up the event listener
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  const filteredCompanies = companies.filter((company) => {
    const lowerSearch = searchTerm.toLowerCase();

    const companyName = company.name?.toLowerCase() || "";
    const companyIndustry = company.industry?.toLowerCase() || "";

    const matchesSearch =
      companyName.includes(lowerSearch) ||
      companyIndustry.includes(lowerSearch) ||
      (company.specialties &&
        Array.isArray(company.specialties) &&
        company.specialties.some((spec) => spec?.toLowerCase().includes(lowerSearch)));

    const matchesIndustry =
      selectedIndustry === "all" || company.category === selectedIndustry;

    const matchesSize = selectedSize === "all" || company.employees === selectedSize;

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

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll animation
    });
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
        <div
          className="absolute inset-0 bg-black opacity-40"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <br></br>
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
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-black/30 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              {/* Search Input */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 transition-colors duration-300" />
                <Input
                  placeholder="Search companies, industries, or specialties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-14 h-16 text-lg text-black border-4 border-gray-400 focus:border-purple-600 focus:ring-4 hover:border-purple-600 focus:ring-purple-300 rounded-2xl shadow-sm transition-shadow duration-300"
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
                  className="h-16 border-4 border-gray-400 rounded-2xl shadow-sm hover:border-purple-600 focus:border-purple-600 focus:ring-4 focus:ring-purple-300 transition-colors duration-300 flex items-center gap-2 px-4 cursor-pointer text-black"
                  aria-label="Filter by Industry"
                  title="Filter by Industry"
                >
                  <Globe className="w-5 h-5 text-purple-500" />
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Industries</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="software">Software Development</SelectItem>
                    <SelectItem value="finance">Finance & Banking</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
              </Select>

              {/* Company Size Select */}
              <Select
                value={selectedSize}
                onValueChange={(value) => setSelectedSize(value)}
              >
                <SelectTrigger
                  className="h-16  border-4 border-gray-400 rounded-2xl shadow-sm hover:border-purple-600 focus:border-purple-600 focus:ring-4 focus:ring-purple-300 transition-colors duration-300 flex items-center gap-2 px-4 cursor-pointer text-black"
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
          {/* <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            More Filters
          </Button> */}
        </div>

        {/* Conditional Rendering based on state */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="animate-spin h-10 w-10 text-purple-600 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p>Loading companies...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>{error}</p>
          </div>
        ) : filteredCompanies.length > 0 ? (
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
                      aria-label={`${followedCompanies.has(company.id) ? "Unfollow" : "Follow"
                        } ${company.name}`}
                    >
                      <Heart
                        className={`h-4 w-4 ${followedCompanies.has(company.id)
                          ? "fill-current text-red-500"
                          : "text-gray-600"
                          }`}
                      />
                    </Button>
                    <Link to={`/companies/${company.id}`}>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white transition-colors"
                        aria-label={`View ${company.name}`}
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </Button>
                    </Link>
                  </div>
                  <Badge className="absolute top-4 left-4 bg-purple-100 text-purple-800 border-purple-200 border font-medium px-3 py-1">
                    {getSizeLabel(company.employees)}
                  </Badge>
                  {/* Company Logo and Basic Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-xl flex items-center justify-center text-xl shadow-sm">
                      {company.logo ? (
                        <img src={company.logo} alt={company.logo} className="w-10 h-10 " />
                      ) : (
                        <span className="text-3xl">{company.name.charAt(0)}</span>
                      )
                      }
                    </div>
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
                  <div className="flex items-center gap-4 mb-4 bg-gray-50 rounded-lg p-3 justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500 flex-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{company.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{getSizeLabel(company.employees)}</span>
                      </div>
                    </div>
                    {/* <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{company.rating}</span>
                      <span className="text-gray-400">({company.reviews})</span>
                    </div> */}
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
                        {company.specialties &&
                          Array.isArray(company.specialties) &&
                          company.specialties.map((specialty, index) => (
                            specialty && (
                              <Badge
                                key={specialty || index}
                                variant="secondary"
                                className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200 px-3 py-1"
                              >
                                {specialty}
                              </Badge>
                            )
                          ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-green-600" />
                        Culture & Values
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {company.culture &&
                          Array.isArray(company.culture) &&
                          company.culture.map((value, index) => (
                            value && (
                              <Badge
                                key={value || index}
                                variant="outline"
                                className="border-green-200 text-green-700 hover:bg-green-50 transition-colors px-3 py-1"
                              >
                                {value}
                              </Badge>
                            )
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
                    <Link to={`/companies/${company.id}`} >
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center gap-2 group px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all">
                        View Company
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No companies found matching your criteria.</p>
          </div>
        )}

        {/* Load More Section */}
        {/* <div className="text-center mt-16">
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 rounded-xl border-2 hover:bg-gray-50 transition-colors"
          >
            Load More Companies
          </Button>
        </div> */}
      </div>

      {/* Scroll-to-Top Button */}
      {showScrollToTop && (
        <Button
          variant="default"
          size="icon"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-110 z-50"
          style={{ width: '56px', height: '56px' }} // Explicit size for the circle
        >
          <ArrowUp className="h-6 w-6" />
          <span className="sr-only">Scroll to top</span>
        </Button>
      )}
    </div>
  );
};

export default Companies;