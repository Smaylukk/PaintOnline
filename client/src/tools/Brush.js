import toolState from "../store/toolState";
import Tool from "./Tool";

export default class Brush extends Tool{
  constructor(canvas, socket, id){
    super(canvas, socket, id);
    this.listen();
  }

  listen(){
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
  }

  mouseUpHandler(e){
    this.mouseDown = false;

    const style = toolState.getStyleTool();

    this.socket.send(JSON.stringify({
        method: 'draw',
        id: this.id,
        figure:{
          type: 'finish_brush',
          x: 0,
          y: 0,
          ...style
        }
      }))
  }

  mouseDownHandler(e) {
    this.mouseDown = true;

    this.ctx.beginPath();

    const {x, y} = this.currentPos(e);
    this.ctx.moveTo(x, y)
  }

  mouseMoveHandler(e) { 
    if (this.mouseDown) {
      const { x, y } = this.currentPos(e);
      //this.draw(x, y);
      const style = toolState.getStyleTool();
      
      this.socket.send(JSON.stringify({
        method: 'draw',
        id: this.id,
        figure:{
          type: 'brush',
          x,
          y,
          ...style
        }
      }))
    }
  }

  static draw(ctx, x, y){
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}