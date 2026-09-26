import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base uploads directory
const uploadBaseDir = path.join(__dirname, '..', 'uploads');
const resumeDir = path.join(uploadBaseDir, 'resumes');
const profileImageDir = path.join(uploadBaseDir, 'profile-images');
const companyLogoDir = path.join(uploadBaseDir, 'company-logos');

// Ensure upload directories exist
[uploadBaseDir, resumeDir, profileImageDir, companyLogoDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'resume') {
      cb(null, resumeDir);
    } else if (file.fieldname === 'profilePhoto' || file.fieldname === 'avatar') {
      cb(null, profileImageDir);
    } else if (file.fieldname === 'logo') {
      cb(null, companyLogoDir);
    } else {
      cb(null, uploadBaseDir);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${safeBase}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === 'resume') {
    const allowed = ['.pdf', '.doc', '.docx'];
    if (allowed.includes(ext)) {
      return cb(null, true);
    }
    return cb(new Error('Only PDF, DOC, and DOCX files are allowed for resumes!'));
  }

  if (file.fieldname === 'profilePhoto' || file.fieldname === 'avatar') {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    if (allowed.includes(ext)) {
      return cb(null, true);
    }
    return cb(new Error('Only JPG, JPEG, PNG, and WEBP image files are allowed for profile photos!'));
  }

  if (file.fieldname === 'logo') {
    const allowed = ['.png', '.jpg', '.jpeg', '.svg', '.webp'];
    if (allowed.includes(ext)) {
      return cb(null, true);
    }
    return cb(new Error('Only PNG, JPG, JPEG, SVG, and WEBP files are allowed for company logos!'));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter,
});
