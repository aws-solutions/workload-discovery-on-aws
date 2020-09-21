class RootGremlinMock {
    constructor(gremlinMock) {
      this.gremlinMock = gremlinMock;
    }

    has(p1, p2) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>H")
        this.gremlinMock.addState({ function: "_Has", parameters: [p1, p2] });
        return this.gremlinMock;
    }

    both (p1) {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>B")
        this.gremlinMock.addState({ function : "_Both", parameters: p1 });
        return this.gremlinMock;
    }

    or(...parameters){
        console.log("Calling root or");
        this.state.push({ function: "Or", parameters: _.cloneDeep(parameters) });
        return this.gremlinMock;
    }
}

module.exports = RootGremlinMock;