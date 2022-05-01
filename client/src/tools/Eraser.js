import toolState from "../store/toolState";
import Tool from "./Tool";

export default class Eraser extends Tool{
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
      figure: {
        type: 'finish_eraser',
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
      
      const style = toolState.getStyleTool();

      this.socket.send(JSON.stringify({
        method: 'draw',
        id: this.id,
        figure: {
          type: 'eraser',
          x,
          y,
          ...style
        }
      }))
    }
  }

  static draw(ctx, x, y){
    const strokeStyle = ctx.strokeStyle;
    
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    
    ctx.strokeStyle = strokeStyle;
  }
}