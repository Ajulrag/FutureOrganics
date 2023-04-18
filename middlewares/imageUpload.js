const sharp = require('sharp');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        
      cb(null,path.join(__dirname, '../public/uploads'))
    },
    filename: function (req, file, cb) {
      const name =Date.now()+'-'+file.originalname;
      cb(null, name);
    }
  })


const upload = multer({
    storage: multerStorage,
});




const resizeImages = async (req, res, next) => {
  if (!req.files) return next();
  console.log(req.files);

  req.body.images = [];
  await Promise.all(
   req.files.map(async file => {
      const newFilename = file.filename;
        const buffer = fs.readFileSync(file.path)
     return await sharp(buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(file.path)
    })
  );

  next();
};



module.exports = {
    upload,
    resizeImages


    
}