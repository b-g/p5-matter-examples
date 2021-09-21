class SVGBlock extends Block {

    constructor(attrs, options) {
        super(attrs, options);
    }

    addBody() {
        if (this.attrs.elem) {
            // path im SVG in der aktuellen HTML Seite
            let path = document.getElementById(this.attrs.elem);
            if (null != path) {
                this.body = Bodies.fromVertices(0, 0, Vertices.scale(Svg.pathToVertices(path, 10), this.attrs.scale, this.attrs.scale), this.options);
                Body.setPosition(this.body, this.attrs);
            }
        } else {
            // path in separater SVG Datei
            let that = this;
            httpGet(this.attrs.file, "text", false, function (response) {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(response, "image/svg+xml");
                const path = svgDoc.querySelector("path");
                that.body = Bodies.fromVertices(0, 0, Vertices.scale(Svg.pathToVertices(path, 10), that.attrs.scale, that.attrs.scale), that.options);
                Body.setPosition(that.body, that.attrs);
                World.add(engine.world, [that.body]);
            });
        }
    }

}