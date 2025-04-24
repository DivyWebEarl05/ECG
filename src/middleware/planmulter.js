import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/plans');
  },
  filename: (req, file, cb) => {
    cb(null, `plan_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const isValid = allowed.test(file.mimetype) && allowed.test(path.extname(file.originalname).toLowerCase());
  cb(isValid ? null : new Error('Only image files allowed'), isValid);
};

const planupload = multer({ storage, fileFilter });

export default planupload; 