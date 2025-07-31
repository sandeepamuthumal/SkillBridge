// src/components/ProfessionalCard.jsx

import React, { useState } from "react";
import {
  Briefcase,
  MapPin,
  Badge as BadgeIcon,
  Award,
  Calendar,
  Globe,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProfessionalDetailsModal from "./ProfessionalDetailsModal";

const ProfessionalCard = ({ professional: p }) => {
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showFullStatement, setShowFullStatement] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const backendBaseUrl = "http://localhost:5000";

  const fullName =
    p?.userId?.firstName && p?.userId?.lastName
      ? `${p.userId.firstName} ${p.userId.lastName}`
      : p.statementHeader || "Professional";
  const displayName = fullName;

  const profileImageUrl =
    p.profilePictureUrl && p.profilePictureUrl.trim().length > 0
      ? `${backendBaseUrl}${p.profilePictureUrl.startsWith("/") ? "" : "/"}${p.profilePictureUrl}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=cccccc&color=ffffff`;

  const formatSkill = (skill) => {
    if (typeof skill === "string") return skill;
    if (typeof skill === "object" && skill !== null) {
      if ("name" in skill) return skill.name;
      const keys = Object.keys(skill).filter((k) => !isNaN(k)).sort((a, b) => a - b);
      const skillStr = keys.map((k) => skill[k]).join("");
      return skillStr || "";
    }
    return "";
  };

  const getExperienceLabel = (experience) => {
    switch (experience) {
      case "entry": return "Entry Level";
      case "mid": return "Mid Level";
      case "senior": return "Senior Level";
      case "expert": return "Expert Level";
      default: return "N/A";
    }
  };

  const skillsArray = p.skills || [];
  const achievementsArray = p.achievements || [];

  const skillsToShow = showAllSkills ? skillsArray : skillsArray.slice(0, 5);
  const hasMoreSkills = skillsArray.length > 5;
  const hasLongStatement = (p.statement || "").length > 150;

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Determine if achievements section should be rendered at all
  const shouldShowAchievements = achievementsArray.length > 0;

  return (
    <>
      <Card
        className="group hover:shadow-2xl transition-transform duration-300 border border-gray-200 rounded-xl shadow-md bg-white overflow-hidden transform hover:-translate-y-2 h-full cursor-pointer"
        role="article"
        aria-label={`Professional card for ${displayName}`}
        onClick={handleCardClick}
      >
        <CardContent className="p-6 flex flex-col h-full">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
              src={profileImageUrl}
              alt={`${displayName} profile`}
              className="h-24 w-24 rounded-full object-cover border-4 border-green-600 shadow-md flex-shrink-0"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=cccccc&color=ffffff`;
              }}
            />
            <div className="flex flex-col text-center sm:text-left flex-grow min-w-0">
              <h3 className="text-lg font-semibold">
                {p.userId?.firstName || "Professional"} {p.userId?.lastName}
              </h3>
              {p.statementHeader && (
                <p className="text-sm text-gray-500 truncate">
                  {p.statementHeader}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-center sm:justify-start text-sm text-gray-600 mt-1 gap-x-4 gap-y-1">
                <div className="flex items-center gap-1 min-w-[120px]">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="truncate">
                    {p.cityId?.name || "Location N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-1 min-w-[160px]">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  <span className="truncate">
                    {p.university || "University N/A"}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500 whitespace-nowrap min-w-[90px] self-start sm:self-center">
              <p>
                <span className="font-semibold">Profile Views:</span>{" "}
                {p.profileViews || 0}
              </p>
            </div>
          </div>

          {/* BIO SECTION */}
          <p className="text-gray-700 leading-relaxed mt-3 flex-grow" style={{
            display: '-webkit-box',
            WebkitLineClamp: showFullStatement ? 'none' : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {p.statement || "No additional details provided."}
          </p>
          {hasLongStatement && (
            <Button
              variant="link"
              className="mt-1 text-sm text-blue-600 hover:text-blue-800 p-0 h-auto self-start"
              onClick={(e) => {
                e.stopPropagation();
                setShowFullStatement(!showFullStatement);
              }}
            >
              {showFullStatement ? "Show Less" : "Show More..."}
            </Button>
          )}

          {/* SKILLS & ACHIEVEMENTS */}
          {/* Changed flex-col md:flex-row to flex-wrap and adjusted flex-1 classes */}
          <div className="flex flex-wrap gap-6 mt-4">
            {/* Skills */}
            <div className={shouldShowAchievements ? "flex-1 min-w-[45%]" : "w-full"}>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">
                Skills:
              </h4>
              {skillsArray.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-2">
                    {skillsToShow.map((skill, i) => {
                      const label = formatSkill(skill);
                      return label ? (
                        <Badge
                          key={label + i}
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-1 cursor-default"
                        >
                          {label}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                  {hasMoreSkills && (
                    <Button
                      variant="ghost"
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800 p-0 h-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAllSkills(!showAllSkills);
                      }}
                    >
                      {showAllSkills ? (
                        <>
                          Show Less <ChevronUp className="h-4 w-4 ml-1" />
                        </>
                      ) : (
                        <>
                          Show More <ChevronDown className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                  )}
                </>
              ) : (
                <p className="text-sm italic text-gray-400">No skills listed.</p>
              )}
            </div>

            {/* Achievements - Only render if there are achievements */}
            {shouldShowAchievements && (
              <div className="flex-1 min-w-[45%]">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Achievements:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {achievementsArray.map((ach) => (
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
        </CardContent>
      </Card>
      {isModalOpen && (
        <ProfessionalDetailsModal
          professional={p}
          onClose={handleCloseModal}
          backendBaseUrl={backendBaseUrl}
        />
      )}
    </>
  );
};

export default ProfessionalCard;