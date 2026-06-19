import { destroyImageByPublicId, isCloudinaryConfigured, uploadImageBuffer } from "@/lib/cloudinary";

const extractCloudinaryPublicIdFromUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") return null;

  try {
    const parsed = new URL(imageUrl);
    if (parsed.hostname !== "res.cloudinary.com") return null;

    const pathParts = parsed.pathname.split("/").filter(Boolean);
    const uploadIndex = pathParts.indexOf("upload");
    if (uploadIndex === -1 || uploadIndex + 1 >= pathParts.length) return null;

    let publicIdParts = pathParts.slice(uploadIndex + 1);
    const lastVersionIndex = publicIdParts.findLastIndex((part) => /^v\d+$/.test(part));
    if (lastVersionIndex >= 0) {
      publicIdParts = publicIdParts.slice(lastVersionIndex + 1);
    }

    if (!publicIdParts.length) return null;

    const fullPath = decodeURIComponent(publicIdParts.join("/"));
    return fullPath.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
};

// `file` is a Web API File/Blob from request.formData() (Next.js Route Handler)
export const resolveUploadedImageData = async (file, folder) => {
  if (!file || typeof file.arrayBuffer !== "function") return null;

  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured — image uploads require Cloudinary in this deployment");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await uploadImageBuffer(buffer, { folder });
  return {
    image: result?.secure_url || result?.url || null,
    imagePublicId: result?.public_id || null,
  };
};

export const deleteStoredImage = async ({ image, imagePublicId }) => {
  if (!isCloudinaryConfigured()) return;

  const publicId = imagePublicId || extractCloudinaryPublicIdFromUrl(image);
  if (!publicId) return;

  try {
    await destroyImageByPublicId(publicId);
  } catch (error) {
    console.error("Failed to delete Cloudinary image", { publicId, error: error?.message });
  }
};
