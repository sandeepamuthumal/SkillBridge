import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @param {string} subDir - directory under /uploads/
 * @param {string} filenamePrefix - filename prefix
 * @param {RegExp} allowedTypes - allowed file types regex
 */
export function createMulterUpload(subDir, filenamePrefix = 'file', allowedTypes = /jpeg|jpg|png|gif|webp/) {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, `../../uploads/${subDir}`);
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, `${filenamePrefix}-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
        }
    });

    const upload = multer({
        storage,
        limits: {
            fileSize: 5 * 1024 * 1024, // 5 MB
        },
        fileFilter: (req, file, cb) => {
            const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = allowedTypes.test(file.mimetype);

            if (extname && mimetype) {
                cb(null, true);
            } else {
                cb(new Error(`Invalid file type. Allowed: ${allowedTypes}`));
            }
        }
    });

    return upload;
}