// components/ProjectsForm.jsx
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    FolderOpen,
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    CheckCircle,
    ExternalLink,
    Github,
    Calendar,
    Code,
    Lightbulb,
} from "lucide-react";
import { toast } from "react-toastify";

const ProjectsForm = ({ initialData, onSave, isLoading }) => {
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const emptyProject = {
        title: "",
        description: "",
        technologies: [],
        projectUrl: "",
        githubUrl: "",
        startDate: "",
        endDate: "",
    };

    const [currentProject, setCurrentProject] = useState(emptyProject);
    const [newTechnology, setNewTechnology] = useState("");

    useEffect(() => {
        if (initialData?.projects) {
            const formattedProjects = initialData.projects.map((proj) => ({
                ...proj,
                id: proj._id || Date.now() + Math.random(),
                startDate: proj.startDate
                    ? new Date(proj.startDate).toISOString().split("T")[0]
                    : "",
                endDate: proj.endDate
                    ? new Date(proj.endDate).toISOString().split("T")[0]
                    : "",
            }));
            setProjects(formattedProjects);
        }
    }, [initialData]);

    const handleInputChange = (field, value) => {
        setCurrentProject((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const addTechnology = () => {
        const tech = newTechnology.trim();
        if (!tech) return;

        if (currentProject.technologies.includes(tech)) {
            toast.error("Technology already added");
            return;
        }

        setCurrentProject((prev) => ({
            ...prev,
            technologies: [...prev.technologies, tech],
        }));
        setNewTechnology("");
    };

    const removeTechnology = (techToRemove) => {
        setCurrentProject((prev) => ({
            ...prev,
            technologies: prev.technologies.filter((tech) => tech !== techToRemove),
        }));
    };

    const validateProject = (project) => {
        const errors = [];
        if (!project.title.trim()) errors.push("Project title is required");
        if (!project.description.trim())
            errors.push("Project description is required");

        if (project.startDate && project.endDate) {
            const startDate = new Date(project.startDate);
            const endDate = new Date(project.endDate);
            if (startDate > endDate) {
                errors.push("Start date cannot be after end date");
            }
        }

        // Validate URLs if provided
        if (project.projectUrl && !isValidUrl(project.projectUrl)) {
            errors.push("Invalid project URL");
        }
        if (project.githubUrl && !isValidUrl(project.githubUrl)) {
            errors.push("Invalid GitHub URL");
        }

        return errors;
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const addProject = () => {
        const errors = validateProject(currentProject);
        if (errors.length > 0) {
            toast.error(errors[0]);
            return;
        }

        const newProject = { ...currentProject, id: Date.now() };
        setProjects([...projects, newProject]);
        setCurrentProject(emptyProject);
        setShowAddForm(false);
        toast.success("Project added");
    };

    const updateProject = () => {
        const errors = validateProject(currentProject);
        if (errors.length > 0) {
            toast.error(errors[0]);
            return;
        }

        setProjects(
            projects.map((proj) => (proj.id === isEditing ? currentProject : proj))
        );
        setIsEditing(null);
        setCurrentProject(emptyProject);
        toast.success("Project updated");
    };

    const deleteProject = (id) => {
        setProjects(projects.filter((proj) => proj.id !== id));
        toast.success("Project deleted");
    };

    const startEdit = (project) => {
        setCurrentProject({ ...project });
        setIsEditing(project.id);
        setShowAddForm(false);
    };

    const cancelEdit = () => {
        setIsEditing(null);
        setShowAddForm(false);
        setCurrentProject(emptyProject);
    };

    const handleSave = async () => {
        try {
            // Convert date strings back to Date objects and remove temporary IDs
            const projectsToSave = projects.map((proj) => {
                const { id, ...projectData } = proj;
                return {
                    ...projectData,
                    startDate: projectData.startDate
                        ? new Date(projectData.startDate)
                        : undefined,
                    endDate: projectData.endDate
                        ? new Date(projectData.endDate)
                        : undefined,
                };
            });

            await onSave({ projects: projectsToSave });
            toast.success("Projects updated successfully");
        } catch (error) {
            toast.error("Failed to update projects");
        }
    };

    const ProjectCard = ({ project, index }) => (
        <Card key={project.id || index} className="relative">
            <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-lg">{project.title}</h4>
                            <div className="flex gap-2 ml-4">
                                {project.projectUrl && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(project.projectUrl, "_blank")}
                                        className="gap-1"
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                        Live
                                    </Button>
                                )}
                                {project.githubUrl && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(project.githubUrl, "_blank")}
                                        className="gap-1"
                                    >
                                        <Github className="h-3 w-3" />
                                        Code
                                    </Button>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                            {project.description}
                        </p>

                        {project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                                {project.technologies.map((tech, techIndex) => (
                                    <Badge
                                        key={techIndex}
                                        variant="secondary"
                                        className="text-xs"
                                    >
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {(project.startDate || project.endDate) && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Calendar className="h-3 w-3" />
                                {project.startDate &&
                                    new Date(project.startDate).toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "numeric",
                                    })}
                                {project.startDate && project.endDate && " - "}
                                {project.endDate &&
                                    new Date(project.endDate).toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "numeric",
                                    })}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 ml-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEdit(project)}
                            className="gap-1"
                        >
                            <Edit className="h-3 w-3" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteProject(project.id)}
                            className="gap-1 text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="h-3 w-3" />
                            Delete
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <FolderOpen className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Projects</CardTitle>
                            <CardDescription>
                                Showcase your personal projects, portfolio, and achievements
                            </CardDescription>
                        </div>
                    </div>
                    {!showAddForm && !isEditing && (
                        <Button onClick={() => setShowAddForm(true)} className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Project
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Existing Projects */}
                {projects.length > 0 ? (
                    <div className="space-y-4">
                        {projects
                            .sort(
                                (a, b) =>
                                    new Date(b.startDate || b.endDate || 0) -
                                    new Date(a.startDate || a.endDate || 0)
                            )
                            .map((project, index) => (
                                <ProjectCard
                                    key={project.id || index}
                                    project={project}
                                    index={index}
                                />
                            ))}
                    </div>
                ) : (
                    <Alert>
                        <Code className="h-4 w-4" />
                        <AlertDescription>
                            No projects added yet. Add your personal projects, portfolio
                            pieces, or significant coursework to showcase your skills.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Add New Project Form */}
                {showAddForm && !isEditing && (
                    <ProjectFormComponent
                        currentProject={currentProject}
                        handleInputChange={handleInputChange}
                        addTechnology={addTechnology}
                        removeTechnology={removeTechnology}
                        newTechnology={newTechnology}
                        setNewTechnology={setNewTechnology}
                        onSubmit={addProject}
                        onCancel={cancelEdit}
                        submitText="Add Project"
                    />
                )}

                {/* Edit Project Form */}
                {isEditing && (
                    <ProjectFormComponent
                        currentProject={currentProject}
                        handleInputChange={handleInputChange}
                        addTechnology={addTechnology}
                        removeTechnology={removeTechnology}
                        newTechnology={newTechnology}
                        setNewTechnology={setNewTechnology}
                        onSubmit={updateProject}
                        onCancel={cancelEdit}
                        submitText="Update Project"
                    />
                )}

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
                                Save Projects
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

const ProjectFormComponent = ({
    currentProject,
    handleInputChange,
    addTechnology,
    removeTechnology,
    newTechnology,
    setNewTechnology,
    onSubmit,
    onCancel,
    submitText,
}) => (
    <Card className="border-green-200">
        <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                    id="title"
                    placeholder="e.g., E-Commerce Web Application"
                    value={currentProject.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                    id="description"
                    placeholder="Describe what the project does, your role, and key features..."
                    value={currentProject.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    className="resize-none"
                />
            </div>

            <div className="space-y-3">
                <Label>Technologies Used</Label>

                {/* Current Technologies */}
                {currentProject.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {currentProject.technologies.map((tech, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="flex items-center gap-1 hover:bg-red-50 group transition-colors"
                            >
                                {tech}
                                <button
                                    onClick={() => removeTechnology(tech)}
                                    className="text-gray-500 hover:text-red-500 group-hover:text-red-500"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Add Technology */}
                <div className="flex gap-2">
                    <Input
                        placeholder="Add technology (e.g., React, Node.js)"
                        value={newTechnology}
                        onChange={(e) => setNewTechnology(e.target.value)}
                        onKeyPress={(e) =>
                            e.key === "Enter" && (e.preventDefault(), addTechnology())
                        }
                    />

                    <Button
                        type="button"
                        onClick={addTechnology}
                        disabled={!newTechnology.trim()}
                        className="gap-1"
                    >
                        <Plus className="h-4 w-4" />
                        Add
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="projectUrl">Project URL</Label>
                    <Input
                        id="projectUrl"
                        type="url"
                        placeholder="https://myproject.com"
                        value={currentProject.projectUrl}
                        onChange={(e) => handleInputChange("projectUrl", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="githubUrl">GitHub URL</Label>
                    <Input
                        id="githubUrl"
                        type="url"
                        placeholder="https://github.com/username/project"
                        value={currentProject.githubUrl}
                        onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                        id="startDate"
                        type="date"
                        value={currentProject.startDate}
                        onChange={(e) => handleInputChange("startDate", e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                        id="endDate"
                        type="date"
                        value={currentProject.endDate}
                        onChange={(e) => handleInputChange("endDate", e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-2 pt-4">
                <Button onClick={onSubmit} className="gap-2">
                    <Save className="h-4 w-4" />
                    {submitText}
                </Button>
                <Button variant="outline" onClick={onCancel} className="gap-2">
                    <X className="h-4 w-4" />
                    Cancel
                </Button>
            </div>
        </CardContent>
    </Card>
);

export default ProjectsForm;
