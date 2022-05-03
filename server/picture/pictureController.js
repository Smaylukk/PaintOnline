const pictureService = require("./pictureService");
const path = require('path');
const fs = require('fs');

class PictureController {

  async errorHandler(res, err){
    res.status(500).json(err);
  }

  async savePicture(req, res, next) {
    try {
      const { session, pictureData} = req.body;
      let picture = await pictureService.getPicture(session);

      if (!picture) {
        picture = await pictureService.addPicture(session, pictureData);
      }else{
        picture = await pictureService.updatePicture(session, pictureData);
      }

      res.status(200).json(picture);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

  async getPicture(req, res, next) {
    try {
      const session = req.params.id;
      const picture = await pictureService.getPicture(session);

      res.status(200).json(picture);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
      return res;
    }
  }

  async getAllPictures(req, res, next) {
    try {
      const pictures = await pictureService.getAllPicturs();

      res.status(200).json(pictures);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
      return res;
    }
  }

  async downloadPicture(req, res, next) {
    try {
      const session = req.params.id;
      const picture = await pictureService.getPicture(session);

      if (picture) {
        let data = picture.picture;
        data = data.replace('data:image/png;base64,', '');
        let filename = path.resolve(__dirname, '..', 'files', session + '.png');
        fs.writeFileSync(filename, data, {encoding: 'base64'});
        
        res.download(filename, session + '.png');
      }else{

      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
      return res;
    }
  }

  test(req, res, next) {
    res.status(200).json({message: 'Working!'})
  }
}

module.exports = new PictureController();