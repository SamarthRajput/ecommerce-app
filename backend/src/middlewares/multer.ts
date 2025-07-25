import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

// For single file
export const uploadSingleFile = upload.single('file');

// For multiple files
export const uploadMultipleFiles = upload.array('files', 5); // Max 5 files
// For multiple files
export const uploadMultipleFilesCreateListing = upload.array('images', 5); // Max 5 images
