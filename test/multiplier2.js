const chai = require("chai");
const path = require("path");
const wasm_tester = require("./../index").wasm;
const c_tester = require("./../index").c;
const fs = require("fs")

const F1Field = require("ffjavascript").F1Field;
const Scalar = require("ffjavascript").Scalar;
exports.p = Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617");
const Fr = new F1Field(exports.p);

const assert = chai.assert;

describe("Simple Wasm tester", function() {
    this.timeout(100000);

    this.afterAll(() => {
        fs.rmSync(path.join(__dirname, "Multiplier2_js"), {recursive: true, force: true});
        fs.rmSync(path.join(__dirname, "Multiplier2.r1cs"), {recursive: true, force: true});
        fs.rmSync(path.join(__dirname, "Multiplier2.sym"), {recursive: true, force: true});
    })

    it("Checking the compilation of a simple circuit generating wasm", async () => {
        const circuit = await wasm_tester(path.join(__dirname, "Multiplier2.circom"));
        const w = await circuit.calculateWitness({a: 2, b: 4});
        await circuit.checkConstraints(w);
    });

    it("Checking the compilation of a simple circuit generating wasm in a given folder", async () => {
        const circuit = await wasm_tester(
            path.join(__dirname, "Multiplier2.circom"), { output: path.join(__dirname) });
        const w = await circuit.calculateWitness({a: 2, b: 4});
        await circuit.checkConstraints(w);
    });

    it("Checking the compilation of a simple circuit generating wasm in a given folder without recompiling", async () => {
        const circuit = await wasm_tester(
            path.join(__dirname, "Multiplier2.circom"), {output: path.join(__dirname), recompile: false});
        const w = await circuit.calculateWitness({a: 6, b: 3});
        await circuit.checkConstraints(w);
    });
});

describe("Simple Cpp tester", function() {
    this.timeout(100000);

    this.afterAll(() => {
        fs.rmSync(path.join(__dirname, "Multiplier2_cpp"), {recursive: true, force: true});
        fs.rmSync(path.join(__dirname, "Multiplier2.r1cs"), {recursive: true, force: true});
        fs.rmSync(path.join(__dirname, "Multiplier2.sym"), {recursive: true, force: true});
    })

    it("Checking the compilation of a simple circuit generating C", async () => {
        const circuit = await c_tester(path.join(__dirname, "Multiplier2.circom"));
        const w = await circuit.calculateWitness({a: 2, b: 4});
        await circuit.checkConstraints(w);
    });

    it("Checking the compilation of a simple circuit generating C in a given folder", async () => {
        const circuit = await c_tester(
            path.join(__dirname, "Multiplier2.circom"), {output: path.join(__dirname)});
        const w = await circuit.calculateWitness({a: 2, b: 4});
        await circuit.checkConstraints(w);
    });

    it("Checking the compilation of a simple circuit generating wasm in a given folder without recompiling", async () => {
        const circuit = await c_tester(
            path.join(__dirname, "Multiplier2.circom"), {output: path.join(__dirname), recompile: false});
        const w = await circuit.calculateWitness({a: 6, b: 3});
        await circuit.checkConstraints(w);
    });
});
