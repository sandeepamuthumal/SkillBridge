import React, { useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Search,
  Filter,
  Eye,
  Trash2,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Calendar,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Timer,
  TrendingUp,
  User,
  FileText,
  Target,
  Star,
  ArrowLeft,
  ArrowDownFromLine,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SelectValue } from "@radix-ui/react-select";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ApplicationDetailView from "@/pages/seeker/applications/ApplicationDetailView";
import { applicationAPI } from "@/services/employer/applicationAPI";

const EmployerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  // Load all job applications on component mount
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const result = await applicationAPI.getEmployerJobApplications();
      console.log("Application response : ", result);
      if (result.success) {
        setApplications(result.data);
      } else {
        console.error("Failed to load jobs:", result.error);
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    Applied: "bg-blue-100 text-blue-800",
    "Under Review": "bg-yellow-100 text-yellow-800",
    Shortlisted: "bg-green-100 text-green-800",
    "Interview Scheduled": "bg-purple-100 text-purple-800",
    "Interview Completed": "bg-indigo-100 text-indigo-800",
    "Assessment Pending": "bg-orange-100 text-orange-800",
    "Reference Check": "bg-cyan-100 text-cyan-800",
    "Offer Extended": "bg-emerald-100 text-emerald-800",
    "Offer Accepted": "bg-green-200 text-green-900",
    "Offer Declined": "bg-gray-100 text-gray-800",
    Rejected: "bg-red-100 text-red-800",
    Withdrawn: "bg-gray-100 text-gray-800",
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Applied":
      case "Under Review":
        return <Clock className="w-4 h-4" />;
      case "Shortlisted":
      case "Interview Scheduled":
      case "Interview Completed":
      case "Offer Extended":
      case "Offer Accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "Rejected":
      case "Offer Declined":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewApplication = (applicationId) => {
    const application = applications.find((app) => app._id === applicationId);
    setSelectedApplication(application);
  };

  const handleDownloadResume = (resumeUrl) => {
    const url = serverUrl + resumeUrl;
    window.open(url, "_blank");
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "jobSeekerId.userId.firstName",
        header: "Job Seeker",
        cell: ({ row }) => {
          const seeker = row.original.jobSeekerId;
          return (
            <Link to={`/seeker-profile/${seeker.userId._id}`} target="_blank">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-lg flex items-center justify-center text-lg">
                  {seeker.profilePictureUrl ? (
                    <img
                      src={serverUrl + seeker.profilePictureUrl}
                      alt={seeker.userId.firstName}
                      className="w-8 h-8"
                    />
                  ) : (
                    seeker.userId.firstName.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {seeker.userId.firstName + " " + seeker.userId.lastName}
                  </div>

                  <div className="text-sm text-gray-600">
                    {seeker.statementHeader}
                  </div>

                  <Badge variant="secondary" className="mt-1">
                    {row.original.jobSeekerId.university}
                  </Badge>
                </div>
              </div>
            </Link>
          );
        },
      },
      {
        accessorKey: "jobPostId.title",
        header: "Job Title",
        cell: ({ row }) => {
          const job = row.original.jobPostId;
          return (
            <Link to={`/jobs/${job._id}`} target="_blank">
              <div className="flex items-center space-x-3">
                <div>
                  <div className="font-semibold text-gray-900">{job.title}</div>
                  <div className="text-sm text-gray-600">
                    #{job._id.slice(-6).toUpperCase()}
                  </div>
                </div>
              </div>
            </Link>
          );
        },
      },
      {
        accessorKey: "appliedDate",
        header: "Applied Date",
        cell: ({ row }) => (
          <div className="flex items-center space-x-1 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(row.original.appliedDate)}</span>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <Badge
            className={`${
              statusColors[row.original.status]
            } flex items-center space-x-1`}
          >
            {getStatusIcon(row.original.status)}
            <span>{row.original.status}</span>
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              title="View Application"
              onClick={() => handleViewApplication(row.original._id)}
            >
              <Eye className="w-4 h-4 text-warning-500" />
            </Button>
            <Button
              variant="outline"
              title="Download Resume"
              size="sm"
              onClick={() => handleDownloadResume(row.original.resumeUrl)}
            >
              <ArrowDownFromLine />
            </Button>
          </div>
        ),
      },
    ],
    [applications]
  );

  const filteredData = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        globalFilter === "" ||
        app.jobPostId.title
          .toLowerCase()
          .includes(globalFilter.toLowerCase()) ||
        app.jobSeekerId.userId.firstName
          .toLowerCase()
          .includes(globalFilter.toLowerCase()) ||
        app.jobSeekerId.university
          .toLowerCase()
          .includes(globalFilter.toLowerCase()) ||
        app.status.toLowerCase().includes(globalFilter.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, globalFilter, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (selectedApplication) {
    return (
      <ApplicationDetailView
        application={selectedApplication}
        onBack={() => setSelectedApplication(null)}
        loadData={loadApplications}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                All Job Applications
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and review applications for your job postings
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {filteredData.length} of {applications.length} applications
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search seekers, jobs, universities, or status..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="Interview Scheduled">
                    Interview Scheduled
                  </SelectItem>
                  <SelectItem value="Interview Completed">
                    Interview Completed
                  </SelectItem>
                  <SelectItem value="Offer Extended">Offer Extended</SelectItem>
                  <SelectItem value="Offer Accepted">Offer Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                        onClick={
                          header.column.getCanSort()
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                      >
                        <div className="flex items-center space-x-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <div className="flex flex-col">
                              <ChevronUp
                                className={`w-3 h-3 ${
                                  header.column.getIsSorted() === "asc"
                                    ? "text-blue-600"
                                    : "text-gray-400"
                                }`}
                              />
                              <ChevronDown
                                className={`w-3 h-3 -mt-1 ${
                                  header.column.getIsSorted() === "desc"
                                    ? "text-blue-600"
                                    : "text-gray-400"
                                }`}
                              />
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {table.getPageCount() > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Showing{" "}
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}{" "}
                to{" "}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{" "}
                of {table.getFilteredRowModel().rows.length} applications
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: table.getPageCount() }, (_, i) => (
                    <Button
                      key={i}
                      variant={
                        table.getState().pagination.pageIndex === i
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => table.setPageIndex(i)}
                      className="w-8 h-8"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Applications Found
            </h3>
            <p className="text-gray-600">
              {globalFilter || statusFilter !== "All"
                ? "Try adjusting your search or filter criteria"
                : "You have no job applications yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerApplications;
