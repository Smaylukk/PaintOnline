import {makeAutoObservable} from 'mobx'

class ToolState  {
  tool = null;
  widthCanvas = 1400;
  heightCanvas = 800;
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

  clearCanvas(){

  }
}

export default new ToolState()