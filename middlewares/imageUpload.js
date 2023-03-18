// const sharp = require('sharp');
// const multer = require('multer');

// const multerStorage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null,path.join(__dirname, '../public/uploads'))
//     },
//     filename: function (req, file, cb) {
//       const name =Date.now()+'-'+file.originalname;
//       cb(null, name);
//     }
//   })


// const multerFilter = (req,file,cb) => {
//      if(file.mimetype.startWith('image')) {
//         cb(null, true);
//      } else {
//         cb('Please upload only images!!! ', false);
//      }
// };


// const upload = multer({
//     storage: multerStorage,
//     fileFilter: multerFilter
// });


// const uploadFiles = upload.array('images', 4);



// const sharp = require("sharp");

// const resizeImages = async (req, res, next) => {
//   if (!req.files) return next();

//   req.body.images = [];
//   await Promise.all(
//     req.files.map(async file => {
//       const newFilename = ...;

//       await sharp(file.buffer)
//         .resize(640, 320)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(`upload/${newFilename}`);

//       req.body.images.push(newFilename);
//     })
//   );

//   next();
// };



// module.exports = {
//     uploadFiles,
//     uploadImages,

    
// }