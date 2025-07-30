import React, { useState } from "react";
import Swal from 'sweetalert2';

const JobPostForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    experienceLevel: "",
    workArrangement: "",
    deadline: "",
    experienceYears: {
      min: '',
      max: ''
    },
    responsibilities: [""],
    requirements: [""],
    preferredSkills: [""],
    benefits: [""],
    salaryRange: {
      min: '',
      max: ''
    },
    cityId: "687f36a184c4873409ab34a4",
    typeId: "688524d8c80fdf2275702f0e",
    categoryId: "688524e5719673b5574da890",
    employerId: "68808e0ed4e392aeea2de017",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleResponsibilityChange = (index, value) => {
    const updated = [...form.responsibilities];
    updated[index] = value;
    setForm({ ...form, responsibilities: updated });
  };

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      salaryRange: {
        ...prevForm.salaryRange,
        [name]: value,
      }
    }));
  };

  const addResponsibility = () => {
    setForm({ ...form, responsibilities: [...form.responsibilities, ""] });
  };

  const handleBenefitChange = (index, value) => {
    const updated = [...form.benefits];
    updated[index] = value;
    setForm({ ...form, benefits: updated });
  };

  const addBenefit = () => {
    setForm({ ...form, benefits: [...form.benefits, ""] });
  };

  const handleExperienceYearsChange = (key, value) => {
    setForm({
      ...form,
      experienceYears: {
        ...form.experienceYears,
        [key]: value ? parseInt(value) : ""
      }
    });
  };

  const handleRequirementChange = (index, value) => {
    const updated = [...form.requirements];
    updated[index] = value;
    setForm({ ...form, requirements: updated });
  };

  const addRequirement = () => {
    setForm({ ...form, requirements: [...form.requirements, ""] });
  };

  const handlePreferredSkillChange = (index, value) => {
    const updated = [...form.preferredSkills];
    updated[index] = value;
    setForm({ ...form, preferredSkills: updated });
  };

  const addPreferredSkill = () => {
    setForm({ ...form, preferredSkills: [...form.preferredSkills, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);

    try {
      const response = await fetch("http://localhost:5000/api/jobpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Job Posted!',
          text: '✅ Your job post has been successfully submitted.',
          confirmButtonColor: '#2563eb', 
        });

 
        setForm({
          title: "",
          description: "",
          experienceLevel: "",
          workArrangement: "",
          deadline: "",
          experienceYears: {
            min: '',
            max: ''
          },
          responsibilities: [""],
          requirements: [""],
          preferredSkills: [""],
          benefits: [""],
          salaryRange: {
            min: '',
            max: ''
          },
          cityId: "687f36a184c4873409ab34a4",
          typeId: "688524d8c80fdf2275702f0e",
          categoryId: "688524e5719673b5574da890",
          employerId: "68808e0ed4e392aeea2de017",
        });
      } else {
        Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: result.message || 'Something went wrong!',
        confirmButtonColor: '#dc2626', // Tailwind red-600
      });
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-lg rounded-xl mt-8">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Post a New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Employer ID */}

        {/* Job Title */}
        <div>
          <label className="block font-semibold text-gray-700">Job Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Frontend Developer"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold text-gray-700">Job Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe the role, tools, etc."
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Experience Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-700">Experience Level</label>
            <select
              name="experienceLevel"
              value={form.experienceLevel}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select experience</option>
              <option value="Entry Level">Entry</option>
              <option value="Mid Level">Mid</option>
              <option value="Senior Level">Senior</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Work Type</label>
            <select
              name="workArrangement"
              value={form.workArrangement}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose option</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Responsibilities */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">Responsibilities</label>
          {form.responsibilities.map((res, index) => (
            <input
              key={index}
              type="text"
              value={res}
              onChange={(e) => handleResponsibilityChange(index, e.target.value)}
              placeholder={`Responsibility ${index + 1}`}
              className="w-full mb-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
          <button
            type="button"
            onClick={addResponsibility}
            className="text-sm text-blue-600 hover:underline mt-1"
          >
            + Add Responsibility
          </button>
        </div>

        {/* Requirements */}
        <div>
          <label className="block font-semibold text-gray-700 mb-2">Requirements</label>
          {form.requirements.map((req, index) => (
            <input
              key={index}
              type="text"
              value={req}
              onChange={(e) => handleRequirementChange(index, e.target.value)}
              placeholder={`Requirement ${index + 1}`}
              className="w-full mb-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          ))}
          <button
            type="button"
            onClick={addRequirement}
            className="text-sm text-blue-600 hover:underline mt-1"
          >
            + Add Requirement
          </button>

        </div>

        {/* Preferred Skills */}
        <div className="mb-6">
          <label className="block font-semibold text-gray-700 mb-2">Preferred Skills</label>
          {form.preferredSkills.map((skill, index) => (
            <input
              key={index}
              type="text"
              value={skill}
              onChange={(e) => handlePreferredSkillChange(index, e.target.value)}
              placeholder={`Skill ${index + 1}`}
              className="w-full mb-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
          <button
            type="button"
            onClick={addPreferredSkill}
            className="text-sm text-blue-600 hover:underline mt-1"
          >
            + Add Preferred Skill
          </button>
        </div>

        {/* Benifits */}
        <div className="mb-6">
          <label className="block font-semibold text-gray-700">
            Benefits
          </label>

          {form.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={benefit}
                onChange={(e) => handleBenefitChange(index, e.target.value)}
                placeholder={`Benefit ${index + 1}`}
                className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addBenefit}
            className="text-sm text-blue-600 hover:underline mt-1"
          >
            + Add Benefit
          </button>
        </div>

        {/* Experience & Salary Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Job Details</h2>

          {/* Experience Years */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience (Years)
            </label>
            <div className="flex gap-4">
              <input
                type="number"
                min="0"
                max="50"
                value={form.experienceYears.min}
                onChange={(e) => handleExperienceYearsChange("min", e.target.value)}
                placeholder="Min"
                className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                min="0"
                max="50"
                value={form.experienceYears.max}
                onChange={(e) => handleExperienceYearsChange("max", e.target.value)}
                placeholder="Max"
                className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Salary Range */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salary Range (USD)
            </label>
            <div className="flex gap-4">
              <input
                type="number"
                name="min"
                min="0"
                value={form.salaryRange.min}
                onChange={handleSalaryChange}
                placeholder="Min Salary"
                className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                name="max"
                min="0"
                value={form.salaryRange.max}
                onChange={handleSalaryChange}
                placeholder="Max Salary"
                className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>


        {/* Deadline */}
        <div>
          <label className="block font-semibold text-gray-700">Application Deadline</label>
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Submit Job Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobPostForm;
