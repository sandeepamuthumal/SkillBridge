// src/components/ProfessionalDetailsModal.jsx

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  MapPin,
  Badge as BadgeIcon,
  Award,
  Calendar,
  Globe,
  Linkedin,
  Github,
  ArrowRight,
} from "lucide-react";

const ProfessionalDetailsModal = ({ professional: p, onClose, backendBaseUrl }) => {
  if (!p) return null;

  const fullName =
    p?.userId?.firstName && p?.userId?.lastName
      ? `${p.userId.firstName} ${p.userId.lastName}`
      : "Professional";
  const displayName = fullName;

  const profileImageUrl =
    p.profilePictureUrl && p.profilePictureUrl.trim().length > 0
      ? `${backendBaseUrl}${p.profilePictureUrl.startsWith("/") ? "" : "/"}${p.profilePictureUrl}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=cccccc&color=ffffff`;

  const formatSkill = (skill) => {
    if (typeof skill === "string") {
      return skill;
    }
    if (typeof skill === "object" && skill !== null) {
      if ("name" in skill) {
        return skill.name;
      }
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[800px] p-0 overflow-hidden max-h-screen [&>button]:bg-red-500 [&>button]:text-white [&>button:hover]:bg-red-600 [&>button]:rounded-full [&>button]:p-2"
        style={{ borderRadius: "2rem" }}
      >
        {/* Outer div for the gradient border */}
        <div
          className="p-1.5 h-full bg-gradient-to-br from-green-400 to-blue-500 shadow-2xl"
          style={{ borderRadius: "2rem" }}
        >
          {/* Inner div for the white content area */}
          <div
            className="p-6 h-full w-full bg-white rounded-[1.8rem]"
          >
            <DialogHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <Avatar className="h-28 w-28 border-4 border-green-600 shadow-lg">
                <AvatarImage src={profileImageUrl} alt={displayName} />
                <AvatarFallback className="text-3xl font-bold bg-green-500 text-white">
                  {displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <DialogTitle className="text-3xl font-bold text-gray-900">
                  {displayName}
                </DialogTitle>
                <DialogDescription className="text-xl text-gray-600 mt-1">
                  {p.statementHeader || "Professional"}
                </DialogDescription>
                <div className="flex flex-wrap items-center justify-center sm:justify-start text-sm text-gray-600 mt-2 gap-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span>{p.cityId?.name || "Location N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                    <span>{p.university || "University N/A"}</span>
                  </div>
                </div>
                {p.availability && (
                  <p className="text-sm font-semibold text-green-700 mt-2">
                    Availability: {p.availability}
                  </p>
                )}
              </div>
            </DialogHeader>

            {/* Detailed Content Section */}
            <div className="mt-6 space-y-6">
              {/* About Me */}
              <div>
                <h4 className="text-lg font-bold mb-2">About Me</h4>
                <p className="text-gray-700 leading-relaxed">
                  {p.statement || "No detailed description provided."}
                </p>
              </div>

              {/* Skills & Achievements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skills */}
                <div>
                  <h4 className="text-lg font-bold mb-2">Skills</h4>
                  {skillsArray.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skillsArray.map((skill, i) => {
                        const label = formatSkill(skill);
                        return label ? (
                          <Badge
                            key={label + i}
                            className="bg-blue-50 text-blue-700 border border-blue-200"
                          >
                            {label}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p className="text-sm italic text-gray-500">No skills listed.</p>
                  )}
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="text-lg font-bold mb-2">Achievements</h4>
                  {achievementsArray.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {achievementsArray.map((ach) => (
                        <Badge
                          key={ach}
                          variant="outline"
                          className="border-green-300 text-green-700"
                        >
                          <Award className="h-4 w-4 mr-1" />
                          {ach}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm italic text-gray-500">No achievements listed.</p>
                  )}
                </div>
              </div>

              {/* Footer Info */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-1">
                  <BadgeIcon className="h-4 w-4 text-gray-500" />
                  <span>{getExperienceLabel(p.experience)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{p.completedProjects || 0} projects</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span>{p.languages?.length > 0 ? p.languages.join(", ") : "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Social & Contact */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <div className="flex gap-4">
                {p.socialLinks?.linkedin && (
                  <a
                    href={p.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-blue-700 transition-colors"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                )}
                {p.socialLinks?.github && (
                  <a
                    href={p.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Github className="h-6 w-6" />
                  </a>
                )}
              </div>
              <Button className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white flex items-center gap-2 px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-transform duration-300">
                Contact {p.userId?.firstName}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfessionalDetailsModal;