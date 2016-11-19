interface Size {
  width: number;
  height: number;
}

export default class PaperElement extends createjs.Container {
  private bitmap: createjs.Bitmap;
  private size: Size;

  public get width() {
    return this.size.width;
  }

  public get height() {
    return this.size.height;
  }

  constructor(image: string, width: number, height: number) {
    super();
    
    this.size = {
      width: width,
      height: height
    };

    this.shadow = new createjs.Shadow("rgba(0, 0, 0, 0.3)", 3, 3, 20);

    this.bitmap = new createjs.Bitmap(image);
    this.bitmap.regX = width / 2;
    this.bitmap.regY = height / 2;

    this.addChild(this.bitmap);
  }

  public asTween() : createjs.Tween {
    return createjs.Tween.get(this);
  }

  public shake(count: number = 5, fullDuration: number = 500, returnToRotation: boolean = true) : void {
    const tween = this.asTween(),
          previousRotation = this.rotation,
          duration = fullDuration / (count + (returnToRotation ? 1 : 0)),
          rotationFactor = 5;

    for (let i = 0; i < count; i++) {
      const sign = i % 2 == 0 ? 1 : -1;

      tween.to({
        rotation: rotationFactor * sign * Math.random()
      }, duration);
    }

    if (returnToRotation) {
      tween.to({
        rotation: previousRotation
      }, duration);
    }
  }
}