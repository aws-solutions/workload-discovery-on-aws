const R = require('ramda');
const util = require('util');

class GremlinMock {
    constructor() {
        this.command = "";
        this.queryOutput = [];
        this.mock = true;
        this.stack = [];
    }

    push(element) {
        this.stack.push(R.clone(element));
    }

    shift() {
        let shift = this.stack.shift();
        return shift === "--Frame--" ? "--Frame--" : this;
    }

    unshift(element) {
        if (element === "--Frame--") {
            this.queryOutput.push(element);
        }

        if (element === "--chain--") {
            this.queryOutput.push(element);
        }

        if (element === "--chainStop--") {
            this.queryOutput.push(element);
        }

        if (element === "--underscore--") {
            this.queryOutput.push(element);
        }

        this.stack.unshift(R.clone(element));
    }

    V(id) {
        this.command = `g.V${id == null ? '()' : `(${id})`}`;
        this.queryOutput.push(this.command);
        return R.clone(this);
    }

    next() {
        this.command = 'next()';
        this.queryOutput.push(this.command);
        return this.queryOutput.join(".");
    }

    has(p1, p2) {
        if (typeof (p2) === 'object') {
            this.command = `has("${p1}",p.${p2.operator}("${p2.value}"))`;
            this.queryOutput.push(`has("${p1}",p.${p2.operator}("${p2.value}"))`);
        }
        else {
            this.command = (`has("${p1}","${p2}")`);
            this.queryOutput.push(`has("${p1}","${p2}")`);
        }
        return R.clone(this);
    }

    hasNot(p1) {
        this.command = (`hasNot("${p1}")`);
        this.queryOutput.push(this.command);
        return R.clone(this);
    }

    valueMap(p1) {
        this.command = ("valueMap()");
        this.queryOutput.push("valueMap()");
        return R.clone(this);
    }

    toList() {
        this.command = ("toList()");
        this.queryOutput.push("toList()");
        return this.queryOutput.join(".");
    }

    as(p1) {
        this.command = (`as("${p1}")`);
        this.queryOutput.push(`as("${p1}")`);
        return R.clone(this)
    }

    select(p1) {
        this.command = (`select("${p1}")`);
        this.queryOutput.push(`select("${p1}")`);
        return R.clone(this);
    }

    property(k, v) {
        this.command = (`property("${k}", "${v}")`);
        this.queryOutput.push(this.command);
        return R.clone(this);
    }

    both(p1) {
        this.command = (`both("${p1}"`);
        this.queryOutput.push(`both("${p1}")`);
        return R.clone(this);
    }

    is(p1) {
        this.command = (`is(${p1})`);
        this.queryOutput.push(`is(${p1})`);
        return R.clone(this);
    }

    count(response) {
        this.command = ("count()");
        this.queryOutput.push("count()");
        return R.clone(this);
    }

    where(response, parameters) {
        this.sortFrame("where(", ")");
        return R.clone(this);
    }

    and(...parameters) {
        this.sortFrame(`and(`, `)`, `__.`);
        return R.clone(this);
    }

    or(...parameters) {
        this.sortFrame(`or(`, `)`, `__.`);
        return R.clone(this);
    }

    not(...parameters) {
        this.sortFrame(`not(`, `)`, `__.`);
        return R.clone(this);
    }

    sortFrame(start, end, startParameter = "") {
        let temp = [];
        let element;

        while ((element = this.queryOutput.pop()) !== "--Frame--") {
            temp.unshift(element);
        }

        let tokenLength = temp.length;

        let token = temp.map((element, index) => {
            if (element === "--chain--") {
                return "__."
            }
            else if (element === "--chainStop--") {
                if (tokenLength === index + 1) {
                    return "";
                }
                else {
                    return ","
                }
            }
            else if (element === "--underscore--"){
                return "__.";
            }
            else {

                if (tokenLength === index + 1) {
                    return element;
                }
                else if (temp[index + 1] === "--chainStop--") {
                    return element;
                }
                else {
                    return element + ".";
                }
            }
        });

        this.queryOutput.push(start + token.join("") + end);
    }

    clear() {
        this.command = "";
        this.queryOutput = [];
        this.mock = true;
        this.stack = [];
    }
}

module.exports = GremlinMock;
