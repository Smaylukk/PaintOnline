import axios from 'axios';
import env from "react-dotenv"

class PictureService {
  URL_SERVER = env.URL_HTTP || '';

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