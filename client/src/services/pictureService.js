import axios from 'axios';

class PictureService {
  URL_SERVER = process.env.URL_HTTP || 'http://localhost:5000/';

  async getAllPictures(){
    const pictures = await axios.get(`${this.URL_SERVER}picture/getAll`);

    //console.log(pictures.data);
    return pictures.data;
  }

  async getPicture(id) {
    const picture = await axios.get(`${this.URL_SERVER}picture/get/${id}`);

    //console.log(picture.data);
    return picture.data;
  }

  async savePicture(data) {
    const picture = await axios.post(`${this.URL_SERVER}picture/save`, data);

    //console.log(picture.data);
    return picture.data;
  }
}

export default new PictureService();