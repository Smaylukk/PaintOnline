import {makeAutoObservable} from 'mobx'
import Brush from '../tools/Brush';
import Circle from '../tools/Circle';
import Clear from '../tools/Clear';
import Eraser from '../tools/Eraser';
import Line from '../tools/Line';
import Rect from '../tools/Rect';

class ToolState  {
  tool = null;
  widthCanvas = 1000;
  heightCanvas = 700;
  constructor() {
    makeAutoObservable(this);
  }

  setTool(tool){
    this.tool = tool;
  }

  setFillColor(color) {
    this.tool.fillColor = color;
  }

  setStrokeColor(color) {
    this.tool.strokeColor= color;
  }

  setLineWidth(width) {
    this.tool.lineWidth = width;
  }

  getFillColor() {
    return this.tool.fillColor;
  }

  getStrokeColor() {
    return this.tool.strokeColor;
  }

  getLineWidth() {
    return this.tool.lineWidth;
  }

  getContext() {
    return this.tool.context;
  }

  getStyleTool() {
    const style = {
      strokeColor: this.getStrokeColor(),
      fillColor: this.getFillColor(),
      lineWidth: this.getLineWidth()
    }

    return style;
  }

  drawHandler(figure) {
    //const ctx = canvasRef.current.getContext('2d');
    const ctx = this.getContext();

    //збергіаємо стилі поточного сеанcу
    const curFillColor = this.getFillColor();
    const curStrokeColor = this.getStrokeColor();
    const curLineWidth = this.getLineWidth();

    //встановлюємо стилі, які прийшли
    this.setFillColor(figure.fillColor);
    this.setStrokeColor(figure.strokeColor);
    this.setLineWidth(figure.lineWidth);

    switch (figure.type) {
      case 'brush':
        Brush.draw(ctx, figure.x, figure.y);
        break;

      case 'finish_brush':
        ctx.beginPath();
        break;

      case 'rect':
        Rect.drawRect(ctx, figure.x, figure.y, figure.w, figure.h);
        break;

      case 'circle':
        Circle.drawCircle(ctx, figure.x, figure.y, figure.r);
        break;

      case 'line':
        Line.drawLine(ctx, figure.startX, figure.startY, figure.x, figure.y);
        break;

      case 'eraser':
        Eraser.draw(ctx, figure.x, figure.y);
        break;

      case 'finish_eraser':
        ctx.beginPath();
        break;

      case 'clearCanvas':
        Clear.clearCanvas(ctx);
        break;

      default:
        break;
    }
    //повертаємо поточні стилі
    this.setFillColor(curFillColor);
    this.setStrokeColor(curStrokeColor);
    this.setLineWidth(curLineWidth);
  }
}

export default new ToolState()