import React from "react";
import {
  Briefcase,
  MapPin,
  Badge as BadgeIcon,
  Award,
  Calendar,
  Globe,
  ArrowRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ProfessionalCard = ({ professional: p }) => {
  const backendBaseUrl = "http://localhost:5000";

  const getExperienceLabel = (experience) => {
    switch (experience) {
      case "entry":
        return "Entry Level";
      case "mid":
        return "Mid Level";
      case "senior":
        return "Senior Level";
      case "expert":
        return "Expert Level";
      default:
        return "N/A";
    }
  };

  const profileImageUrl = p.profilePictureUrl
    ? backendBaseUrl + p.profilePictureUrl
    : "https://via.placeholder.com/150?text=No+Image";

  return (
    <Card
      className="group hover:shadow-2xl transition-transform duration-300 border border-gray-200 rounded-xl shadow-md bg-white overflow-hidden transform hover:-translate-y-2"
      role="article"
      aria-label={`Professional card for ${p.statementHeader || "Professional"}`}
    >
      <CardContent className="p-6 flex flex-col gap-6">
        {/* ===== HEADER ===== */}
        <div className="flex items-center gap-5">
          <img
            src={profileImageUrl}
            alt={`${p.statementHeader || "Professional"} profile`}
            className="h-20 w-20 rounded-full object-cover border-4 border-green-600 shadow-md flex-shrink-0"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image";
            }}
          />

          <div className="flex flex-col flex-grow min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 truncate">
              {p.statementHeader || p.statement || "Professional"}
            </h3>

            <div className="flex flex-wrap text-sm text-gray-600 mt-1 gap-x-4 gap-y-1">
              <div className="flex items-center gap-1 min-w-[120px]">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="truncate">{p.cityId?.name || "Location N/A"}</span>
              </div>
              <div className="flex items-center gap-1 min-w-[160px]">
                <Briefcase className="h-4 w-4 text-blue-600" />
                <span className="truncate">{p.university || "University N/A"}</span>
              </div>
              <div className="min-w-[140px]">
                <span className="font-semibold text-green-700">Availability:</span>{" "}
                {p.availability || "N/A"}
              </div>
            </div>
          </div>

          <div className="text-right text-sm text-gray-500 whitespace-nowrap min-w-[90px]">
            <p>
              <span className="font-semibold">Profile Views:</span> {p.profileViews || 0}
            </p>
          </div>
        </div>

        {/* ===== BIO ===== */}
        <p className="text-gray-700 leading-relaxed line-clamp-3">
          {p.statement || "No additional details provided."}
        </p>

        {/* ===== SKILLS & ACHIEVEMENTS ===== */}
        <div className="flex flex-col md:flex-row gap-6">
          {p.skills?.length > 0 && (
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Skills & Expertise
              </h4>
              <div className="flex flex-wrap gap-2">
                {p.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-1 cursor-default"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {p.achievements?.length > 0 && (
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                Achievements
              </h4>
              <div className="flex flex-wrap gap-2">
                {p.achievements.map((ach) => (
                  <Badge
                    key={ach}
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50 px-3 py-1 cursor-default"
                  >
                    <Award className="h-4 w-4 mr-1 inline" />
                    {ach}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===== FOOTER ===== */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 flex-wrap gap-4">
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 flex-grow min-w-[200px]">
            <div className="flex items-center gap-1 whitespace-nowrap">
              <BadgeIcon className="h-4 w-4" />
              <span>{getExperienceLabel(p.experience)}</span>
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <Calendar className="h-4 w-4" />
              <span>{p.completedProjects || 0} projects</span>
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <Globe className="h-4 w-4" />
              <span>{p.languages?.join(", ") || "N/A"}</span>
            </div>
          </div>

          <Button
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white flex items-center gap-2 px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-transform duration-300 transform group whitespace-nowrap"
            aria-label={`Contact ${p.statementHeader || "professional"}`}
          >
            Contact
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfessionalCard;
