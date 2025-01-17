import multer, { diskStorage } from 'multer';
export const fileTypes = {
    image: ["image/png", "image/jpg", "image/jpeg"],
    video: ["video/mp4"]
}
export const fileUpload = (fileTypes) => {
    const fileFilter = (req, file, cb) => {
        if (!fileTypes.includes(file.mimetype)) {
            return cb(new Error("invalid file format !"), false)
        }
        return cb(null, true)
    }
    return multer({ storage: diskStorage({}, fileFilter) })
}