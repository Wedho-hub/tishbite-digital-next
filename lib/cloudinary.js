import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const cloudinaryEnabled = Boolean(cloudName && apiKey && apiSecret);

if (cloudinaryEnabled) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export const isCloudinaryConfigured = () => cloudinaryEnabled;

export const uploadImageBuffer = (buffer, options = {}) => {
  if (!cloudinaryEnabled) {
    throw new Error("Cloudinary is not configured");
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "tishbite-digital",
        resource_type: "image",
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

export const destroyImageByPublicId = async (publicId) => {
  if (!cloudinaryEnabled || !publicId) return null;
  return cloudinary.uploader.destroy(publicId, { resource_type: "image" });
};
