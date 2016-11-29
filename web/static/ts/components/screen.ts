import PaperElement from "./graphics/paper";
import MapElement from "./graphics/map";

export default class Screen {
  private $canvas: JQuery;
  private stage: createjs.Stage;
  private map: MapElement;

  private background: createjs.Shape;
  private elements: PaperElement[];
  private deviceSprite: createjs.Bitmap;

  constructor(element: JQuery) {
    this.$canvas = element;
    this.elements = [];

    this.stage = new createjs.Stage(element.get(0));
    this.stage.enableMouseOver();

    this.map = new MapElement();
    this.background = new createjs.Shape();
    this.stage.addChild(this.background, this.map);

    $(window).resize(() => this.onWindowResize());
    this.onWindowResize();
    
    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", this.stage);
  }

  public onWindowResize() : void {
    const width = this.$canvas.width(),
          height = this.$canvas.height();

    this.$canvas.attr("width", width);
    this.$canvas.attr("height", height);

    this.background.graphics.beginFill("#fff").drawRect(0, 0, width, height);

    this.stage.update();
  }

  public add(...elements: PaperElement[]) : void {
    for (const element of elements) {
      const y = element.y;

      element.y = -element.height;

      this.stage.addChild(element);

      element.asTween()
        .to({
          x: element.x,
          y: y
        }, 500);
    }

    this.elements = this.elements.concat(elements);
  }

  public clear() : void {
    for (let element of this.elements) {
      element.asTween()
        .to({
          x: -element.width,
          y: -element.height
        }, 500);
    }

    setTimeout(() => {
      this.stage.removeChild.apply(this.stage, this.elements);
      this.elements = [];
    }, 500);
  }

  public showMap() : Promise<MapElement> {
    this.clear();
    
    const width = this.$canvas.width(),
          height = this.$canvas.height();

    return this.map.show(width, height);
  }

  public hideMap() : Promise<MapElement> {
    return this.map.hide();
  }

  public addDevice(image: string, animationDuration: number = 300) : Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const width = this.$canvas.width(),
            height = this.$canvas.height(),
            imageWidth = 512,
            imageHeight = 512;

      this.deviceSprite = new createjs.Bitmap(image);
      this.deviceSprite.shadow = new createjs.Shadow("rgba(0, 0, 0, 0.3)", 3, 3, 10);

      this.deviceSprite.scaleX = this.deviceSprite.scaleY = 0.5;

      this.deviceSprite.x = height / 2;
      this.deviceSprite.y = -100;
      this.deviceSprite.rotation = 30;

      this.stage.addChild(this.deviceSprite);

      createjs.Tween.get(this.deviceSprite).to({
        y: height / 2 - 128,
        rotation: 0
      }, animationDuration * 0.9, createjs.Ease.bounceOut);

      setTimeout(() => {
        resolve();
      }, animationDuration);
    });
  }

  public shakeDevice(shakeCount: number = 10, animationDuration: number = 500) : void {
    const x = this.deviceSprite.x,
          tween = createjs.Tween.get(this.deviceSprite);

    for (let i = 0; i < shakeCount; i++) {
      const sign = i % 2 == 0 ? -1 : 1;

      tween.to({
        x: x + 5 * sign * Math.random(),
        rotation: 10 * sign * Math.random()
      }, animationDuration / shakeCount);
    }

    tween.to({
      x: x,
      rotation: 0
    }, animationDuration / shakeCount);
  }

  public removeDevice(animationDuration: number = 400) : Promise<void> {
    return new Promise<void>((resolve, reject) => {
      createjs.Tween.get(this.deviceSprite).to({
        y: this.$canvas.height() + 200
      }, animationDuration * 0.9, createjs.Ease.circIn);

      setTimeout(() => {
        this.stage.removeChild(this.deviceSprite);
        resolve();
      }, animationDuration);
    });
  }
}