import React, { useEffect, useMemo, useState } from 'react'
import { jobPostAPI } from '@/services/jobPostAPI';
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
    Edit,
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
import { useNavigate } from "react-router-dom";
import StatusFilter from "./Components/StatusFilter.jsx";
import { useAuth } from "@/context/AuthContext";
import { format } from 'date-fns';

const ManageJob = () => {
    const [loading, setLoading] = useState(true);
    const [jobPosts, setJobPosts] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const serverUrl = import.meta.env.VITE_SERVER_URL;
    const navigate = useNavigate();
    const { user } = useAuth();


    // const handleJobPostView = (jobId) => {
    //     navigate(`http://localhost:5173/employer/jobs/${jobId}`);
    // };

    const filteredJobs = useMemo(() => {
        return jobPosts.filter(job =>
            statusFilter === "All" ? true : job.status === statusFilter
        );
    }, [jobPosts, statusFilter]);

    useEffect(() => {
        loadJobPosts();
    }, []);

    const loadJobPosts = async () => {
        setLoading(true);
        try {
            const result = await jobPostAPI.getEmployerJobPosts();
            console.log("Job Post response : ", result);
            if (result.success) {
                setJobPosts(result.data);
            } else {
                console.error("Failed to load jobs:", result.error);
            }
        } catch (error) {
            console.error("Error loading jobs:", error);
        } finally {
            setLoading(false);
        }
    };


    const columns = [
        {
            accessorKey: "title",
            header: "Job Title",
            cell: ({ row }) => (
                <div className="font-medium text-gray-900">{row.original.title}</div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs ${row.original.status === "Published"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                        }`}
                >
                    {row.original.status}
                </span>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Posted On",
            cell: ({ row }) => (
                <div className="font-medium text-gray-900">{format(row.original.createdAt, "PPP")}</div>
            ),
        },
        {
            accessorKey: "deadline",
            header: "Deadline",
            cell: ({ row }) => (
                <div className="font-medium text-gray-900">{format(new Date(row.original.deadline), "PPP")}</div>
            ),
        },
        {
            accessorKey: "applicationCount",
            header: "Applications",
            cell: ({ row }) => <span>{row.original.applicationCount}</span>,
        },
        {
            accessorKey: "viewCount",
            header: "Views",
            cell: ({ row }) => <span>{row.original.viewCount}</span>,
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            onClick={() => navigate(`/employer/jobs/view/${row.original._id}`)}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Job Post
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigate(`/employer/jobs/seekers/suggestions/${row.original._id}`)}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Seeker Suggestions
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigate(`/employer/jobs/edit/${row.original._id}`)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Job Post
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleDeleteJobPost(row.original._id)}
                            className="text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Job Post
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const table = useReactTable({
        data: filteredJobs,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        globalFilterFn: (row, columnId, filterValue) => {
            return (
                row.original.title.toLowerCase().includes(filterValue.toLowerCase()) ||
                row.original.status.toLowerCase().includes(filterValue.toLowerCase())
            );
        },
        initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
    });


    const handleDeleteJobPost = (jobPostId) => {
        Swal.fire({
            title: "Are you sure you want to delete this job post?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                jobPostAPI.inactiveJobPost(jobPostId)
                    .then((response) => {
                        if (response.success) {
                            setJobPosts((prev) =>
                                prev.filter((job) => job._id !== jobPostId)
                            );
                            Swal.fire(
                                "Deleted!",
                                "Job post deleted successfully.",
                                "success"
                            );
                        } else {
                            console.error("Error deleting job post:", response.error);
                            toast.error("Failed to delete job post. Please try again.");
                        }
                    })
                    .catch((error) => {
                        console.error("Error deleting job post:", error);
                        toast.error("Failed to delete job post. Please try again.");
                    });
            }
        });
    };



    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading job post...</p>
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
                                My Job Posts
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Track your job posts
                            </p>
                        </div>
                        <div className="text-sm text-gray-500">
                            {filteredJobs.length} of {jobPosts.length} Jobs
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                        {/* Search */}
                        <div className="flex-1 max-w-xl relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="Search by job title..."
                                value={globalFilter ?? ""}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="right top-1/2 transform -translate-y-1/2 text-gray-400 h-5">
                            <StatusFilter onFilterChange={setStatusFilter} />
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
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
                                                                className={`w-3 h-3 ${header.column.getIsSorted() === "asc"
                                                                    ? "text-blue-600"
                                                                    : "text-gray-400"
                                                                    }`}
                                                            />
                                                            <ChevronDown
                                                                className={`w-3 h-3 -mt-1 ${header.column.getIsSorted() === "desc"
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
                </div>
                {/* Pagination */}
                {table.getPageCount() > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                            Showing{" "}
                            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}{" "}
                            to{" "}
                            {Math.min(
                                (table.getState().pagination.pageIndex + 1) *
                                table.getState().pagination.pageSize,
                                table.getRowModel().rows.length
                            )}{" "}
                            of {jobPosts.length} job posts
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

                            {Array.from({ length: table.getPageCount() }, (_, i) => (
                                <Button
                                    key={i}
                                    variant={table.getState().pagination.pageIndex === i ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => table.setPageIndex(i)}
                                    className="w-8 h-8"
                                >
                                    {i + 1}
                                </Button>
                            ))}

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
        </div>

    )
}

export default ManageJob