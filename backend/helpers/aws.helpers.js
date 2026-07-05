// AWS S3 replaced by Cloudinary — file kept as aws.helpers.js to avoid changing all imports
import fs from 'fs';
import cloudinary from '../configs/cloudinary.config.js';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];

const isImage = (mimetype) => ALLOWED_IMAGE_TYPES.includes(mimetype);
const isVideo = (mimetype) => ALLOWED_VIDEO_TYPES.includes(mimetype);

export const upload = (files) => {
    return new Promise((resolve, reject) => {
        let file = null;
        let folder = 'auramart/images';
        let resourceType = 'image';

        if (files.image && isImage(files.image[0].mimetype)) {
            file = files.image[0];
            folder = 'auramart/images';
            resourceType = 'image';
        } else if (files.video && isVideo(files.video[0].mimetype)) {
            file = files.video[0];
            folder = 'auramart/videos';
            resourceType = 'video';
        } else if (files.document && (isImage(files.document[0].mimetype) || isVideo(files.document[0].mimetype))) {
            file = files.document[0];
            folder = 'auramart/documents';
            resourceType = isVideo(files.document[0].mimetype) ? 'video' : 'image';
        } else if (files.governmentIdImage && isImage(files.governmentIdImage[0].mimetype)) {
            file = files.governmentIdImage[0];
            folder = 'auramart/images';
            resourceType = 'image';
        }

        if (!file) {
            return reject('Invalid or unsupported file type.');
        }

        cloudinary.uploader.upload(
            file.filepath,
            {
                folder,
                resource_type: resourceType,
                use_filename: true,
                unique_filename: true,
            },
            (err, result) => {
                if (err) {
                    console.error('❌ Cloudinary Upload Error:', err);
                    return reject(new Error(err.message || 'Cloudinary upload failed'));
                }
                // Clean up temp file
                fs.unlink(file.filepath, () => {});
                resolve(result.secure_url);
            }
        );
    });
};
