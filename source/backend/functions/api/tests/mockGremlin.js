const R = require('ramda');

class GremlinMock {
    constructor() {
      this.state = [];
    }

    addState(data) {
        this.state.push(data);
    }
  
    V() {
      this.state.push({ function: "Vertex", parameters: undefined });
      return this;
    }

    has(p1, p2) {
        this.state.push({ function: "Has", parameters: [p1, p2] });
        return this;
    }

    hasNot(p1) {
        this.state.push({ function: "HasNot", parameters: [p1] });
        return this;
    }

    valueMap(p1){
        this.state.push({ function: "ValueMap", parameters: p1 });
        return this;
    }

    toList(){
        return this.state;
    }

    as(p1) {
        this.state.push({ function: "As", parameters: p1 });
        return this;
    }
    
    select (p1){
        this.state.push({ function: "Select", parameters: p1 });
        return this;
    }
    
    both (p1) {
        this.state.push({ function : "Both", parameters: p1 });
        return this;
    }
    
    is (response, p1) {
        this.state.push({ function: "Is", parameters : p1 });
        return this;
    }
    
    count (response){
        this.state.push({ function: "Count", parameters : undefined });
        return this;
    }
    
    where  (response, parameters) {
        this.state.push({ function: "Where", parameters : R.clone(parameters)});
        return this;
    }

    and(...parameters){
        this.state.push({ function: "And", parameters: R.clone(parameters) });
        return this;
    }

    or(...parameters){
        this.state.push({ function: "Or", parameters: R.clone(parameters) });
        return this;
    }

    not(...parameters){
        this.state.push({ function: "Not", parameters: R.clone(parameters) });
        return this;
    }
}

module.exports = GremlinMock;
