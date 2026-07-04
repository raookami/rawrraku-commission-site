// Ganti 'YOUR_CLOUD_NAME' dengan cloud name kamu
const CLOUD_NAME = 'dvxznh0cz';

export function imgUrl(filename, width = 400) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},f_auto,q_auto/${filename}`;
}
