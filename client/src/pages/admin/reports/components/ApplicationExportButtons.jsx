import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'react-toastify';
import { utils, writeFile } from 'xlsx';
import { adminReportAPI } from '@/services/adminReportAPI';

const ApplicationExportButtons = ({ applications, filters }) => {

    const handleExportExcel = () => {
        if (!applications || applications.length === 0) {
            toast.error('No data to export.');
            return;
        }

        try {
            const data = applications.map(app => ({
                'Job Title': app.jobPostId?.title || 'N/A',
                'Job Seeker': `${app.jobSeekerId?.userId?.firstName} ${app.jobSeekerId?.userId?.lastName}`,
                'Employer': app.jobPostId?.employerId?.companyName || 'N/A',
                'Status': app.status,
                'Applied Date': new Date(app.appliedDate).toLocaleDateString(),
            }));

            const worksheet = utils.json_to_sheet(data);
            const workbook = utils.book_new();
            utils.book_append_sheet(workbook, worksheet, 'Application Report');

            writeFile(workbook, `application_report.xlsx`);
            toast.success('Report exported to Excel successfully!');
        } catch (error) {
            console.error('Excel export error:', error);
            toast.error('Failed to export report to Excel.');
        }
    };
    
    const handleExportPdf = async () => {
        toast.info('Generating PDF...');
        const result = await adminReportAPI.exportApplicationReportPdf(filters);

        if (result.success) {
            toast.success('Application report exported to PDF successfully!');
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

export default ApplicationExportButtons;