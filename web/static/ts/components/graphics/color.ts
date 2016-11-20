export default class Color {
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public alpha: number = 1
  ) { }

  toString() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.alpha})`;
  }
}