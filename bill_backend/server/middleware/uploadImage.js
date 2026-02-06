import multer, { memoryStorage } from "multer";
export const upload = multer({ storage: multer.memoryStorage() });

// when i want to save in diskstorage

//  const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "upload/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// export const upload = multer({ storage});
