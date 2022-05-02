const pictureService = require("./pictureService");

class PictureController {

  errorHandler(res, err){
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
      this.errorHandler(res, error);
      return res;
    }
  }

  async getPicture(req, res, next) {
    try {
      const session = req.params.id;
      const picture = await pictureService.getPicture(session);

      res.status(200).json(picture);
    } catch (error) {
      console.log(error);
      return errorHandler(res, error);
    }
  }

  async getAllPictures(req, res, next) {
    try {
      const pictures = await pictureService.getAllPicturs();

      res.status(200).json(pictures);
    } catch (error) {
      console.log(error);
      return errorHandler(res, error);
    }
  }

  test(req, res, next) {
    res.status(200).json({message: 'Working!'})
  }
}

module.exports = new PictureController();