
import JobPost from '../models/JobPost.js';
import Application from '../models/Application.js';
import User from '../models/User.js'; 
import JobSeeker from '../models/JobSeeker.js'; 
import mongoose from 'mongoose';
import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { NotFoundError } from '../errors/not-found-error.js';
import Employer from '../models/Employer.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../uploads/applications');

export const getJobAnalytics = async (req, res, next) => {
  try {
    const { dateRange, jobCategory, jobType, status } = req.query;

    const pipeline = [];

    if (dateRange && dateRange !== 'all') {
      const date = new Date();
      if (dateRange === 'last30days') date.setDate(date.getDate() - 30);
      if (dateRange === 'last6months') date.setMonth(date.getMonth() - 6);
      if (dateRange === 'lastyear') date.setFullYear(date.getFullYear() - 1);
      pipeline.push({ $match: { createdAt: { $gte: date } } });
    }

    if (jobCategory && jobCategory !== 'all') {
      pipeline.push({ $match: { categoryId: new mongoose.Types.ObjectId(jobCategory) } });
    }

    if (jobType && jobType !== 'all') {
      pipeline.push({ $match: { typeId: new mongoose.Types.ObjectId(jobType) } });
    }

    if (status && status !== 'all') {
      pipeline.push({ $match: { status } });
    }

    pipeline.push(
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'jobPostId',
          as: 'applications',
        },
      },
      {
        $lookup: {
          from: 'employers',
          localField: 'employerId',
          foreignField: '_id',
          as: 'employerDetails',
        },
      },
      {
        $unwind: {
          path: '$employerDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'jobcategories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $unwind: {
          path: '$categoryDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'jobtypes',
          localField: 'typeId',
          foreignField: '_id',
          as: 'typeDetails',
        },
      },
      {
        $unwind: {
          path: '$typeDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          status: 1,
          viewCount: 1,
          appliedCount: { $size: '$applications' },
          shortlistedCount: {
            $size: {
              $filter: {
                input: '$applications',
                as: 'app',
                cond: { $eq: ['$$app.status', 'Shortlisted'] },
              },
            },
          },
          rejectedCount: {
            $size: {
              $filter: {
                input: '$applications',
                as: 'app',
                cond: { $eq: ['$$app.status', 'Rejected'] },
              },
            },
          },
          employerName: '$employerDetails.companyName',
          categoryName: '$categoryDetails.name',
          typeName: '$typeDetails.name',
        },
      },
      {
        $sort: { appliedCount: -1 },
      }
    );

    const jobPostMetrics = await JobPost.aggregate(pipeline);

    res.status(200).json({
      success: true,
      message: 'Job analytics fetched successfully',
      jobPostMetrics,
      jobStatusCounts: jobPostMetrics,
    });
  } catch (error) {
    next(error);
  }
};

export const exportJobAnalyticsPdf = async (req, res, next) => {
    try {
        const { dateRange, jobCategory, jobType, status } = req.query;

        const pipeline = [];

        if (dateRange && dateRange !== 'all') {
            const date = new Date();
            if (dateRange === 'last30days') date.setDate(date.getDate() - 30);
            if (dateRange === 'last6months') date.setMonth(date.getMonth() - 6);
            if (dateRange === 'lastyear') date.setFullYear(date.getFullYear() - 1);
            pipeline.push({ $match: { createdAt: { $gte: date } } });
        }

        if (jobCategory && jobCategory !== 'all') {
            pipeline.push({ $match: { categoryId: new mongoose.Types.ObjectId(jobCategory) } });
        }

        if (jobType && jobType !== 'all') {
            pipeline.push({ $match: { typeId: new mongoose.Types.ObjectId(jobType) } });
        }

        if (status && status !== 'all') {
            pipeline.push({ $match: { status } });
        }
    
        pipeline.push(
            {
                $lookup: {
                    from: 'applications',
                    localField: '_id',
                    foreignField: 'jobPostId',
                    as: 'applications',
                },
            },
            {
                $lookup: {
                    from: 'employers',
                    localField: 'employerId',
                    foreignField: '_id',
                    as: 'employerDetails',
                },
            },
            {
                $unwind: {
                    path: '$employerDetails',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'jobcategories',
                    localField: 'categoryId',
                    foreignField: '_id',
                    as: 'categoryDetails',
                },
            },
            {
                $unwind: {
                    path: '$categoryDetails',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'jobtypes',
                    localField: 'typeId',
                    foreignField: '_id',
                    as: 'typeDetails',
                },
            },
            {
                $unwind: {
                    path: '$typeDetails',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    status: 1,
                    viewCount: 1,
                    appliedCount: { $size: '$applications' },
                    shortlistedCount: {
                        $size: {
                            $filter: {
                                input: '$applications',
                                as: 'app',
                                cond: { $eq: ['$$app.status', 'Shortlisted'] },
                            },
                        },
                    },
                    rejectedCount: {
                        $size: {
                            $filter: {
                                input: '$applications',
                                as: 'app',
                                cond: { $eq: ['$$app.status', 'Rejected'] },
                            },
                        },
                    },
                    employerName: '$employerDetails.companyName',
                    categoryName: '$categoryDetails.name',
                    typeName: '$typeDetails.name',
                },
            },
            {
                $sort: { appliedCount: -1 },
            }
        );

        const jobPostMetrics = await JobPost.aggregate(pipeline);

        const doc = new PDFDocument({ margin: 30 });
        const filename = `job_analytics_${Date.now()}.pdf`;
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');
        doc.pipe(res);

        doc.fontSize(18).text('SkillBridge Job Analytics Report', { align: 'center' }).moveDown();
        doc.fontSize(12).text(`Report Date: ${new Date().toLocaleDateString()}`).moveDown();

        const stats = jobPostMetrics.reduce((acc, job) => ({
            totalJobs: acc.totalJobs + 1,
            totalApplications: acc.totalApplications + (job.appliedCount || 0),
            totalShortlisted: acc.totalShortlisted + (job.shortlistedCount || 0),
            totalRejected: acc.totalRejected + (job.rejectedCount || 0),
        }), { totalJobs: 0, totalApplications: 0, totalShortlisted: 0, totalRejected: 0 });

        doc.fontSize(14).text('Key Metrics Overview', { underline: true }).moveDown();
        doc.text(`Total Jobs: ${stats.totalJobs}`);
        doc.text(`Total Applications: ${stats.totalApplications}`);
        doc.text(`Total Shortlisted: ${stats.totalShortlisted}`);
        doc.text(`Total Rejected: ${stats.totalRejected}`).moveDown();
        
        doc.fontSize(14).text('Detailed Job Analytics', { underline: true }).moveDown();

        const tableHeaders = ['Job Title', 'Employer', 'Applied', 'Shortlisted', 'Rejected'];
        const tableTop = doc.y;
        const tableLeft = 30;
        const tableWidth = 550;
        const columnWidth = tableWidth / tableHeaders.length;

        doc.font('Helvetica-Bold');
        tableHeaders.forEach((header, i) => {
            doc.text(header, tableLeft + i * columnWidth, tableTop, { width: columnWidth, align: 'left' });
        });
        doc.moveDown(0.5);
        doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(tableLeft, doc.y).lineTo(tableLeft + tableWidth, doc.y).stroke();
        doc.font('Helvetica');

        jobPostMetrics.forEach(job => {
            doc.y += 10;
            const y = doc.y;
            doc.text(job.title, tableLeft, y, { width: columnWidth, align: 'left' });
            doc.text(job.employerName, tableLeft + 1 * columnWidth, y, { width: columnWidth, align: 'left' });
            doc.text(job.appliedCount, tableLeft + 2 * columnWidth, y, { width: columnWidth, align: 'left' });
            doc.text(job.shortlistedCount, tableLeft + 3 * columnWidth, y, { width: columnWidth, align: 'left' });
            doc.text(job.rejectedCount, tableLeft + 4 * columnWidth, y, { width: columnWidth, align: 'left' });
            doc.moveDown(1.5);
            doc.strokeColor('#eeeeee').lineWidth(0.5).moveTo(tableLeft, doc.y).lineTo(tableLeft + tableWidth, doc.y).stroke();
        });

        doc.end();

    } catch (error) {
        next(error);
    }
};

export const getApplicationReport = async (req, res, next) => {
    try {
        const { dateRange, status, searchTerm } = req.query;

        const filter = {};
        if (dateRange && dateRange !== 'all') {
            const date = new Date();
            if (dateRange === 'last30days') date.setDate(date.getDate() - 30);
            if (dateRange === 'last6months') date.setMonth(date.getMonth() - 6);
            if (dateRange === 'lastyear') date.setFullYear(date.getFullYear() - 1);
            filter.appliedDate = { $gte: date };
        }

        if (status && status !== 'all') {
            filter.status = status;
        }

        let searchFilter = {};
        if (searchTerm) {
            const searchRegex = new RegExp(searchTerm, 'i');
            
          
            const userIds = await User.find({
                $or: [
                    { firstName: searchRegex },
                    { lastName: searchRegex },
                ]
            }).distinct('_id');

            // Find JobSeeker IDs associated with those User IDs
            const jobSeekerIds = await JobSeeker.find({ userId: { $in: userIds } }).distinct('_id');

            // Find JobPost IDs with matching titles
            const jobPostIds = await JobPost.find({ title: searchRegex }).distinct('_id');

            searchFilter = {
                $or: [
                    { jobSeekerId: { $in: jobSeekerIds } },
                    { jobPostId: { $in: jobPostIds } },
                ]
            };
        }

        const finalFilter = { ...filter, ...searchFilter };
        console.log("Final Filter used in query:", finalFilter);

        const applications = await Application.find(finalFilter)
            .populate({
                path: 'jobSeekerId',
                populate: {
                    path: 'userId',
                    select: 'firstName lastName'
                }
            })
            .populate({
                path: 'jobPostId',
                select: 'title employerId',
                populate: {
                    path: 'employerId',
                    select: 'companyName'
                }
            })
            .sort({ appliedDate: -1 })
            .limit(50);
            console.log("Number of applications found:", applications.length);

        const stats = await Application.aggregate([
            { $match: finalFilter },
            {
                $group: {
                    _id: null,
                    totalApplications: { $sum: 1 },
                    shortlistedCount: { $sum: { $cond: [{ $eq: ['$status', 'Shortlisted'] }, 1, 0] } },
                    rejectedCount: { $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] } },
                    underReviewCount: { $sum: { $cond: [{ $eq: ['$status', 'Under Review'] }, 1, 0] } },
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                applications,
                stats: stats[0] || {}
            }
        });
    } catch (error) {
        next(error);
    }
};



export const downloadApplicationFile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const application = await Application.findById(id);

        if (!application || !application.resumeUrl) {
            throw new NotFoundError('Application file not found.');
        }

        const fileName = path.basename(application.resumeUrl);
        const filePath = path.join(uploadDir, fileName);

        console.log("Attempting to download file from:", filePath);
        const fileExists = fs.existsSync(filePath);
        console.log("File exists:", fileExists);

        if (!fs.existsSync(filePath)) {
            throw new NotFoundError('Application file not found on server.');
        }

        res.download(filePath, fileName);

    } catch (error) {
        next(error);
    }
};

export const exportApplicationReportPdf = async (req, res, next) => {
    try {
        const { dateRange, status, searchTerm } = req.query;

        const filter = {};
        if (dateRange && dateRange !== 'all') {
            const date = new Date();
            if (dateRange === 'last30days') date.setDate(date.getDate() - 30);
            if (dateRange === 'last6months') date.setMonth(date.getMonth() - 6);
            if (dateRange === 'lastyear') date.setFullYear(date.getFullYear() - 1);
            filter.appliedDate = { $gte: date };
        }

        if (status && status !== 'all') {
            filter.status = status;
        }

        let searchFilter = {};
        if (searchTerm) {
            const searchRegex = new RegExp(searchTerm, 'i');
            
            const userIds = await User.find({
                $or: [
                    { firstName: searchRegex },
                    { lastName: searchRegex },
                ]
            }).distinct('_id');

            const jobSeekerIds = await JobSeeker.find({ userId: { $in: userIds } }).distinct('_id');

            const jobPostIds = await JobPost.find({ title: searchRegex }).distinct('_id');

            searchFilter = {
                $or: [
                    { jobSeekerId: { $in: jobSeekerIds } },
                    { jobPostId: { $in: jobPostIds } },
                ]
            };
        }

        const finalFilter = { ...filter, ...searchFilter };

        const applications = await Application.find(finalFilter)
            .populate({
                path: 'jobSeekerId',
                populate: {
                    path: 'userId',
                    select: 'firstName lastName'
                }
            })
            .populate({
                path: 'jobPostId',
                select: 'title employerId',
                populate: {
                    path: 'employerId',
                    select: 'companyName'
                }
            })
            .sort({ appliedDate: -1 })
            .lean(); // Use lean() for faster retrieval

        const doc = new PDFDocument({ margin: 30 });
        const filename = `application_report_${Date.now()}.pdf`;
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');
        doc.pipe(res);

        doc.fontSize(18).text('SkillBridge Application Report', { align: 'center' }).moveDown();
        doc.fontSize(12).text(`Report Date: ${new Date().toLocaleDateString()}`).moveDown();

        const stats = applications.reduce((acc, app) => ({
            totalApplications: acc.totalApplications + 1,
            shortlistedCount: acc.shortlistedCount + (app.status === 'Shortlisted' ? 1 : 0),
            rejectedCount: acc.rejectedCount + (app.status === 'Rejected' ? 1 : 0),
            underReviewCount: acc.underReviewCount + (app.status === 'Under Review' ? 1 : 0),
        }), { totalApplications: 0, shortlistedCount: 0, rejectedCount: 0, underReviewCount: 0 });

        doc.fontSize(14).text('Key Metrics Overview', { underline: true }).moveDown();
        doc.text(`Total Applications: ${stats.totalApplications}`);
        doc.text(`Total Shortlisted: ${stats.shortlistedCount}`);
        doc.text(`Total Rejected: ${stats.rejectedCount}`);
        doc.text(`Under Review: ${stats.underReviewCount}`).moveDown();
        
        doc.fontSize(14).text('Detailed Application List', { underline: true }).moveDown();

        const tableHeaders = ['Job Seeker', 'Job Title', 'Employer', 'Status', 'Applied Date'];
        const tableTop = doc.y;
        const tableLeft = 30;
        const tableWidth = 550;
        const columnWidth = tableWidth / tableHeaders.length;

        doc.font('Helvetica-Bold');
        tableHeaders.forEach((header, i) => {
            doc.text(header, tableLeft + i * columnWidth, tableTop, { width: columnWidth, align: 'left' });
        });
        doc.moveDown(0.5);
        doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(tableLeft, doc.y).lineTo(tableLeft + tableWidth, doc.y).stroke();
        doc.font('Helvetica');

        applications.forEach(app => {
            doc.y += 10;
            const y = doc.y;
            doc.text(`${app.jobSeekerId?.userId?.firstName} ${app.jobSeekerId?.userId?.lastName || ''}`, tableLeft, y, { width: columnWidth, align: 'left' });
            doc.text(app.jobPostId?.title || 'N/A', tableLeft + 1 * columnWidth, y, { width: columnWidth, align: 'left' });
            doc.text(app.jobPostId?.employerId?.companyName || 'N/A', tableLeft + 2 * columnWidth, y, { width: columnWidth, align: 'left' });
            doc.text(app.status, tableLeft + 3 * columnWidth, y, { width: columnWidth, align: 'left' });
            doc.text(new Date(app.appliedDate).toLocaleDateString(), tableLeft + 4 * columnWidth, y, { width: columnWidth, align: 'left' });
            doc.moveDown(1.5);
            doc.strokeColor('#eeeeee').lineWidth(0.5).moveTo(tableLeft, doc.y).lineTo(tableLeft + tableWidth, doc.y).stroke();
        });

        doc.end();

    } catch (error) {
        next(error);
    }
};