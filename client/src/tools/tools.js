class Tools{

  getNewId(){
    return new Date().getTime().toString(16);
  }
}

export default new Tools();