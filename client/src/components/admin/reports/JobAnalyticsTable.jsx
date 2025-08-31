// client/src/components/admin/reports/JobAnalyticsTable.jsx
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const JobAnalyticsTable = ({ jobs }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job Title</TableHead>
          <TableHead>Applied</TableHead>
          <TableHead>Shortlisted</TableHead>
          <TableHead>Rejected</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job._id}>
            <TableCell className="font-medium">{job.title}</TableCell>
            <TableCell>{job.appliedCount}</TableCell>
            <TableCell>{job.shortlistedCount}</TableCell>
            <TableCell>{job.rejectedCount}</TableCell>
            <TableCell className="text-right">
              {/* Link to job details */}
              <a href={`/admin/jobs/${job._id}`} className="text-blue-600 hover:underline">View</a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default JobAnalyticsTable;