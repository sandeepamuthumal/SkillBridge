import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'react-toastify';
import { utils, writeFile } from 'xlsx';
import { adminReportAPI } from '@/services/adminReportAPI';

const ExportButtons = ({ reportData, filters }) => {

    const handleExportExcel = () => {
        if (!reportData || !reportData.jobPostMetrics || reportData.jobPostMetrics.length === 0) {
        toast.error('No data to export.');
        return;
        }

        try {
        const data = reportData.jobPostMetrics.map(job => ({
            'Job Title': job.title,
            'Employer': job.employerName,
            'Applied Count': job.appliedCount,
            'Shortlisted Count': job.shortlistedCount,
            'Rejected Count': job.rejectedCount,
            'Total Views': job.viewCount,
            'Job Status': job.status,
            'Category': job.categoryName,
            'Type': job.typeName,
        }));

        const worksheet = utils.json_to_sheet(data);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, 'Job Analytics');

        writeFile(workbook, 'job_analytics.xlsx');
        toast.success('Report exported to Excel successfully!');
        } catch (error) {
        console.error('Excel export error:', error);
        toast.error('Failed to export report to Excel.');
        }
    };

    const handleExportPdf = async () => {
        toast.info('Generating PDF...');
        const result = await adminReportAPI.exportJobAnalyticsPdf(filters);
        if (result.success) {
            toast.success('Report exported to PDF successfully!');
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportExcel}>
                <Download className="mr-2 h-4 w-4" /> Export Excel
            </Button>
            <Button variant="outline" onClick={handleExportPdf}>
                <Download className="mr-2 h-4 w-4" /> Export PDF
            </Button>
        </div>
    );
};

export default ExportButtons;