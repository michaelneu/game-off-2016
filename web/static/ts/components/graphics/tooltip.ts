export default class Tooltip extends createjs.Container {
  constructor(public text: string) {
    super();
    
    const txt = new createjs.Text(text, "12px sans-serif", "white");
    txt.textAlign = "center";
    txt.textBaseline = "bottom";

    txt.x = 0;
    txt.y = -txt.getMeasuredHeight() + 5;

    const rect = new createjs.Shape(),
          width = txt.getMeasuredWidth() + 10,
          height = txt.getMeasuredHeight() + 10;

    rect.graphics.beginFill("rgba(0, 0, 0, 0.9)").drawRoundRect(-width / 2, -height - 5, width, height, 3)
                                                 .moveTo(0, 0)
                                                 .lineTo(-5, -5)
                                                 .lineTo(5, -5)
                                                 .lineTo(0, 0);

    this.addChild(rect, txt);

    this.alpha = 0;
  }

  public show(x: number, y: number) : void {
    this.alpha = 0;
    this.x = x;
    this.y = y + 10;

    createjs.Tween.get(this).to({
      alpha: 1,
      y: y
    }, 100);
  }

  public hide() : void {
    createjs.Tween.get(this).to({
      alpha: 0,
      y: this.y + 10
    }, 100);
  }
}