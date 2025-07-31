// components/JobPreferencesForm.jsx
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Settings,
  CheckCircle,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Target,
  Home,
  Lightbulb,
} from "lucide-react";
import { toast } from "react-toastify";
import { seekerProfileAPI } from "@/services/jobseeker/seekerProfileAPI";

const JobPreferencesForm = ({ initialData, onSave, isLoading }) => {
  const [preferences, setPreferences] = useState({
    availability: "Within 1 month",
    expectedSalary: {
      min: "",
      max: "",
    },
    jobTypes: [],
    categories: [],
    remoteWork: false,
    cityId: "",
  });

  const [cities, setCities] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const citiesRes = await seekerProfileAPI.getCities();
        setCities(citiesRes.data);
        const jobTypesRes = await seekerProfileAPI.getJobTypes();
        setJobTypes(jobTypesRes.data);
        const jobCategoriesRes = await seekerProfileAPI.getJobCategories();
        setJobCategories(jobCategoriesRes.data);
      } catch (err) {
        toast.error("Failed to load data");
        console.error("City load failed", err);
      }
    })();
  }, []);

  const availabilityOptions = [
    "Immediately",
    "Within 2 weeks",
    "Within 1 month",
    "Within 3 months",
  ];

  const visibilityOptions = [
    {
      value: "Public",
      label: "Public",
      description: "Visible to all employers",
    },
    {
      value: "Limited",
      label: "Limited",
      description: "Visible to matched employers",
    },
    { value: "Private", label: "Private", description: "Only visible to you" },
  ];

  useEffect(() => {
    if (initialData) {
      setPreferences({
        availability: initialData.availability || "Within 1 month",
        profileVisibility: initialData.profileVisibility || "Public",
        expectedSalary: {
          min: initialData.expectedSalary?.min?.toString() || "",
          max: initialData.expectedSalary?.max?.toString() || "",
        },
        jobTypes:
          initialData.jobPreferences?.jobTypes?.map(
            (jt) => jt._id || jt.id || jt
          ) || [],
        categories:
          initialData.jobPreferences?.categories?.map(
            (cat) => cat._id || cat.id || cat
          ) || [],
        remoteWork: initialData.jobPreferences?.remoteWork || false,
        cityId: initialData.cityId?._id || initialData.cityId || "",
      });
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setPreferences((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setPreferences((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleJobTypeChange = (jobTypeId, checked) => {
    setPreferences((prev) => ({
      ...prev,
      jobTypes: checked
        ? [...prev.jobTypes, jobTypeId]
        : prev.jobTypes.filter((id) => id !== jobTypeId),
    }));
  };

  const handleCategoryChange = (categoryId, checked) => {
    setPreferences((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, categoryId]
        : prev.categories.filter((id) => id !== categoryId),
    }));
  };

  const validatePreferences = () => {
    const errors = [];

    // Salary validation
    if (preferences.expectedSalary.min && preferences.expectedSalary.max) {
      const min = parseFloat(preferences.expectedSalary.min);
      const max = parseFloat(preferences.expectedSalary.max);

      if (min >= max) {
        errors.push("Minimum salary must be less than maximum salary");
      }
      if (min < 0 || max < 0) {
        errors.push("Salary values must be positive");
      }
    }

    return errors;
  };

  const handleSave = async () => {
    const errors = validatePreferences();
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    try {
      const formattedPreferences = {
        ...initialData,
        availability: preferences.availability,
        profileVisibility: preferences.profileVisibility,
        expectedSalary: {
          min: preferences.expectedSalary.min
            ? parseFloat(preferences.expectedSalary.min)
            : undefined,
          max: preferences.expectedSalary.max
            ? parseFloat(preferences.expectedSalary.max)
            : undefined,
        },
        jobPreferences: {
          jobTypes: preferences.jobTypes,
          categories: preferences.categories,
          remoteWork: preferences.remoteWork,
        },
        cityId: preferences.cityId || undefined,
      };

      console.log("Saving preferences:", formattedPreferences);

      await onSave(formattedPreferences);
      toast.success("Job preferences updated successfully");
    } catch (error) {
      toast.error("Failed to update job preferences");
    }
  };

  const getCompletionCount = () => {
    let count = 0;
    if (preferences.availability) count++;
    if (preferences.expectedSalary.min && preferences.expectedSalary.max)
      count++;
    if (preferences.jobTypes.length > 0) count++;
    if (preferences.categories.length > 0) count++;
    if (preferences.cityId) count++;
    if (preferences.remoteWork !== undefined) count++;
    return count;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Settings className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              Job Preferences
              {getCompletionCount() >= 5 && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </CardTitle>
            <CardDescription>
              Set your job search preferences to get better matches
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Availability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <Label className="text-base font-medium">Availability</Label>
            </div>
            <Select
              value={preferences.availability}
              onValueChange={(value) =>
                handleInputChange("availability", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="When can you start?" />
              </SelectTrigger>
              <SelectContent>
                {availabilityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-600" />
              <Label className="text-base font-medium">
                Profile Visibility
              </Label>
            </div>
            <Select
              value={preferences.profileVisibility}
              onValueChange={(value) =>
                handleInputChange("profileVisibility", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Who can see your profile?" />
              </SelectTrigger>
              <SelectContent>
                {visibilityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Expected Salary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <Label className="text-base font-medium">
              Expected Salary (LKR)
            </Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minSalary">Minimum (per month)</Label>
              <Input
                id="minSalary"
                type="number"
                placeholder="e.g., 50000"
                value={preferences.expectedSalary.min}
                onChange={(e) =>
                  handleInputChange("expectedSalary.min", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxSalary">Maximum (per month)</Label>
              <Input
                id="maxSalary"
                type="number"
                placeholder="e.g., 100000"
                value={preferences.expectedSalary.max}
                onChange={(e) =>
                  handleInputChange("expectedSalary.max", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Job Types */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-purple-600" />
            <Label className="text-base font-medium">Preferred Job Types</Label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {jobTypes.map((jobType) => (
              <div key={jobType._id} className="flex items-center space-x-2">
                <Checkbox
                  id={`jobType-${jobType._id}`}
                  checked={preferences.jobTypes.includes(jobType._id)}
                  onCheckedChange={(checked) =>
                    handleJobTypeChange(jobType._id, checked)
                  }
                />
                <Label
                  htmlFor={`jobType-${jobType._id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {jobType.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Job Categories */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-600" />
            <Label className="text-base font-medium">
              Preferred Job Categories
            </Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {jobCategories.map((category) => (
              <div key={category._id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category._id}`}
                  checked={preferences.categories.includes(category._id)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category._id, checked)
                  }
                />
                <Label
                  htmlFor={`category-${category._id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Location Preference */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-600" />
            <Label className="text-base font-medium">Preferred Location</Label>
          </div>
          <Select
            value={preferences.cityId}
            onValueChange={(value) => handleInputChange("cityId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select preferred city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city._id} value={city._id}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Remote Work */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-teal-600" />
            <Label className="text-base font-medium">Remote Work</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Switch
              id="remoteWork"
              checked={preferences.remoteWork}
              onCheckedChange={(checked) =>
                handleInputChange("remoteWork", checked)
              }
            />
            <Label htmlFor="remoteWork" className="cursor-pointer">
              I'm open to remote work opportunities
            </Label>
          </div>
          <p className="text-xs text-gray-500">
            Enable this if you're willing to work remotely or in a hybrid setup
          </p>
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
                Save Preferences
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobPreferencesForm;
