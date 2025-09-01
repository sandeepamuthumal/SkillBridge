import JobPost from '../models/JobPost.js';
import Application from '../models/Application.js';
import mongoose from 'mongoose';
import PDFDocument from 'pdfkit';
import { NotFoundError } from '../errors/not-found-error.js';

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