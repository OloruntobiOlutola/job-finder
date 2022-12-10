import cloudinary from "cloudinary";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET } =
  process.env;

type Image = {
  url: string;
  id: string;
};

cloudinary.v2.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET,
});

const cloudUpload = async (image: Image) => {
  const result = await cloudinary.v2.uploader.upload(image.url, {
    public_id: image.id,
  });
  return result;
};

export default cloudUpload;
