import multer from "multer";

// const storage = multer.diskStorage({
//    destination: function (req, file, cb) {
//       cb(null, "./public/temp")
//    },
//    filename: function (req, file, cb) {

//       cb(null, file.originalname)
//    }
// })

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      // console.log("Destination folder:", "./public/temp");
      cb(null, "./public/temp");
   },
   filename: function (req, file, cb) {
      // console.log("Uploaded file:", file);
      cb(null, file.originalname);
   },
});


export const upload = multer({
   storage,
})