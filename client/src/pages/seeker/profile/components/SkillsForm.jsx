// components/SkillsForm.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Award, Plus, X, Search, CheckCircle, Lightbulb } from "lucide-react";
import { toast } from "react-toastify";

const SkillsForm = ({ initialData, onSave, isLoading }) => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (initialData?.skills) {
      setSkills([...initialData.skills]);
    }
  }, [initialData]);

  const addSkill = () => {
    const trimmedSkill = newSkill.trim();
    if (!trimmedSkill) return;

    if (skills.includes(trimmedSkill)) {
      toast.error("Skill already exists");
      return;
    }

    setSkills([...skills, trimmedSkill]);
    setNewSkill("");
    toast.success("Skill added");
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
    toast.success("Skill removed");
  };

  const handleSave = async () => {
    try {
      await onSave({ skills });
      toast.success("Skills updated successfully");
    } catch (error) {
      console.error("Error updating skills:", error);
      toast.error("Failed to update skills");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Award className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Skills & Technologies</CardTitle>
            <CardDescription>
              Add your technical and soft skills to help employers find you
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Skills */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            Your Skills ({skills.length})
            {skills.length >= 5 && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </h4>

          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1 flex items-center gap-2 hover:bg-red-50 group transition-colors"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-gray-500 hover:text-red-500 group-hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertDescription>
                No skills added yet. Add skills to improve your profile
                visibility.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Add New Skill */}
        <div className="space-y-3">
          <h4 className="font-medium">Add New Skill</h4>
          <div className="flex gap-2">
            <Input
              placeholder="Type a skill (e.g., JavaScript, Project Management)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={addSkill}
              disabled={!newSkill.trim()}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="gap-2"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Save Skills
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsForm;
