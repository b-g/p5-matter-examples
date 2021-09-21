class CompositeBlock extends Block {

    constructor(attrs, options) {
        super(attrs, options);
    }

    addBody() {
        this.body = Composites.stack(this.attrs.x, this.attrs.y, this.attrs.cols, this.attrs.rows, this.attrs.colGap, this.attrs.rowGap, this.attrs.create);
    }

}