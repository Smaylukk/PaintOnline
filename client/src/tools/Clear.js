import toolState from "../store/toolState";
import Tool from "./Tool";

export default class Clear extends Tool{
  constructor(canvas, socket, id){
    super(canvas, socket, id);
    this.init();
  }

  init() {
    this.socket.send(JSON.stringify({
      method: 'draw',
      id: this.id,
      figure: {
        type: 'clearCanvas'
      }
    }))
  }

  static clearCanvas(ctx){
    ctx.clearRect(0, 0, toolState.widthCanvas, toolState.heightCanvas);
  }
}