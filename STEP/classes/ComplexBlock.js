class ComplexBlock extends Block {

  constructor(attrs, options) {
    super(attrs, options);
  }

  addBody() {
    this.body = Body.create(this.options);
    Body.setPosition(this.body, this.attrs);
  }

}