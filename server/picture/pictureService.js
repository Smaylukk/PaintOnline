const Picture = require('./pictureModel');

class PictureService {

  async addPicture(session, pictureData) {
    const picture = await Picture.create({
      session,
      picture: pictureData
    })

    return picture;    
  }

  async updatePicture(session, pictureData) {
    const picture = await Picture.findOneAndUpdate({session}, {
      picture: pictureData
    }, {new: true})

    return picture;
  }

  async getPicture(session) {
    console.log(session);
    const picture = await Picture.findOne({session})

    return picture;
  }

  async getAllPicturs() {
    const picturs = await Picture.find();

    return picturs;
  }
}

module.exports = new PictureService();