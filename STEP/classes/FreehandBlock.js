class FreehandBlock extends Block {

    constructor(attrs, options) {
        super(attrs, options);
    }

    addBody() {
        let shape = Vertices.create(this.attrs.points, Body.create({}));
        this.body = Bodies.fromVertices(0, 0, shape, this.options);
        Body.setPosition(this.body, this.attrs);
    }

}