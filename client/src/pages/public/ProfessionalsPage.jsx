import React, { useState, useEffect } from "react";
import api from "@/services/api";

import {
  Search,
  Filter,
  ArrowRight,
  ArrowUp, // Import ArrowUp icon for the scroll-to-top button
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ProfessionalCard from "@/components/cards/ProfessionalCard";

// Helper function to calculate total years of experience
const calculateTotalYears = (experiences) => {
  if (!experiences || experiences.length === 0) return 0;
  const today = new Date();
  return experiences.reduce((total, exp) => {
    const startDate = new Date(exp.startDate);
    const endDate = exp.currentlyWorking ? today : (exp.endDate ? new Date(exp.endDate) : today);
    const diffTime = Math.abs(endDate - startDate);
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return total + diffYears;
  }, 0);
};


const ProfessionalsPage = () => {
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");

  // New state for scroll-to-top button visibility
  const [showScrollToTop, setShowScrollToTop] = useState(false);


  const roles = [
    { value: "all", label: "All Roles" },
    { value: "developer", label: "Developer" },
    { value: "designer", label: "Designer" },
    { value: "manager", label: "Manager" },
    { value: "analyst", label: "Analyst" },
    { value: "consultant", label: "Consultant" },
  ];

  const experienceLevels = [
    { value: "all", label: "All Levels" },
    { value: "entry", label: "Entry Level (0-2 years)" },
    { value: "mid", label: "Mid Level (3-5 years)" },
    { value: "senior", label: "Senior Level (6+ years)" },
    { value: "expert", label: "Expert Level (10+ years)" },
  ];

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await api.get("/professionals");
        console.log("API Response:", response.data);
        setProfessionals(response.data);
      } catch (err) {
        console.error("Error fetching professionals:", err);
        setError("Failed to load professionals.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  // Effect for scroll-to-top button visibility - made more sensitive
  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 100px (adjust for sensitivity)
      if (window.scrollY > 100) {
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

  const filteredProfessionals = professionals.filter((p) => {
    const searchLower = searchTerm.toLowerCase();

    // --- Search Logic (matchesSearch) ---
    const matchesSearch =
      (p.statementHeader && p.statementHeader.toLowerCase().includes(searchLower)) ||
      (p.statement && p.statement.toLowerCase().includes(searchLower)) ||
      (p.university && p.university.toLowerCase().includes(searchLower)) ||
      (p.cityId?.name && p.cityId.name.toLowerCase().includes(searchLower)) ||
      (Array.isArray(p.skills) &&
        p.skills.some((skill) => {
          const skillText = typeof skill === "object" && skill !== null && "name" in skill
            ? skill.name
            : typeof skill === "string" ? skill : "";
          return skillText.toLowerCase().includes(searchLower);
        })
      );

    // --- Role Filter Logic (matchesRole) ---
    const matchesRole =
      selectedRole === "all" ||
      (p.jobPreferences?.categories &&
       Array.isArray(p.jobPreferences.categories) &&
       p.jobPreferences.categories.some(category => category.name?.toLowerCase() === selectedRole));

    // --- Experience Filter Logic (matchesExperience) ---
    const totalYears = calculateTotalYears(p.experiences);
    const matchesExperience =
      selectedExperience === "all" ||
      (selectedExperience === "entry" && totalYears >= 0 && totalYears <= 2) ||
      (selectedExperience === "mid" && totalYears > 2 && totalYears <= 5) ||
      (selectedExperience === "senior" && totalYears > 5 && totalYears <= 10) ||
      (selectedExperience === "expert" && totalYears > 10);

    return matchesSearch && matchesRole && matchesExperience;
  });

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll animation
    });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading professionals...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-red-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="hover:bg-red-50 hover:border-red-300"
          >
            Try Again
          </Button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-r from-green-600 to-teal-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=400&fit=crop')] bg-cover bg-center bg-blend-overlay"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <br />
            <h1 className="text-5xl font-bold mb-4 animate-fade-in">
              Connect with Top <span className="text-yellow-300">Professionals</span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Find experienced professionals and mentors to help your startup grow and succeed
            </p>
          </div>

          {/* Search & Filters */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search professionals, skills, or university..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-lg border-4 border-gray-400 hover:border-purple-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-xl text-black transition-colors duration-300"
                />
              </div>

              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="h-14 border-4 border-gray-400 rounded-xl text-gray-700 hover:border-purple-600 focus:border-purple-600 focus:ring-2 focus:ring-purple-300 transition-colors duration-300">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedExperience}
                onValueChange={setSelectedExperience}
              >
                <SelectTrigger className="h-14 border-4 border-gray-400 rounded-xl text-gray-700 hover:border-purple-600 focus:border-purple-600 focus:ring-2 focus:ring-purple-300 transition-colors duration-300">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Professionals List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {filteredProfessionals.length} Professional
            {filteredProfessionals.length !== 1 ? "s" : ""} Found
          </h2>
          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>

        {filteredProfessionals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No professionals found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or filters to find more professionals.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredProfessionals.map((p) => (
              <ProfessionalCard key={p._id} professional={p} />
            ))}
          </div>
        )}
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

export default ProfessionalsPage;