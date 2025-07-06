import { v2 as cloudinary } from 'cloudinary';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE_MB = 5; // Maximum allowed size (in MB)

/**
 * Uploads a file to Cloudinary after validating type and size
 * @param file - Express Multer File
 * @returns Promise<string> - secure URL of uploaded image
 */

export const uploadImageToCloudinary = (file: Express.Multer.File, maxSizeInMB: number = MAX_IMAGE_SIZE_MB, allowedMimeTypes: string[] = ALLOWED_MIME_TYPES): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Validate MIME type
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return reject(new Error('Invalid image type. Only JPEG, PNG, and WEBP are allowed.'));
        }

        // Validate file size (in bytes)
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
        if (file.size > maxSizeInBytes) {
            return reject(new Error(`Image exceeds max size of ${maxSizeInMB}MB.`));
        }

        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'image',
                folder: 'listings',
            },
            (error, result) => {
                if (error || !result) {
                    return reject(new Error('Cloudinary upload failed.'));
                }
                resolve(result.secure_url);
            }
        );

        stream.end(file.buffer);
    });
};
