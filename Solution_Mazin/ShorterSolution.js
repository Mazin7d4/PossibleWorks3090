const fs = require('fs');

function parseBigInt(str, base) {
    return [...str].reduce((total, char) => total * BigInt(base) + BigInt(/[0-9]/.test(char) ? char - '0' : 10 + char.charCodeAt(0) - 'a'.charCodeAt(0)), 0n);
}

function findConstantTerm(points) {
    const k = points.length, P = Array(k).fill().reduce((p, _, i) => p * Array(k).fill().reduce((d, _, j) => i !== j ? d * (points[i][0] - points[j][0]) : d, 1n), 1n);
    return points.reduce((sum, [xi, yi], i) => sum + yi * Array(k).fill().reduce((n, _, j) => i !== j ? n * -points[j][0] : n, 1n) * (P / Array(k).fill().reduce((d, _, j) => i !== j ? d * (xi - points[j][0]) : d, 1n)), 0n) / P;
}

function processTestCase(filePath) {
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8')), points = Object.entries(json).filter(([k]) => k !== "keys").map(([k, v]) => [BigInt(k), parseBigInt(v.value, parseInt(v.base, 10))]);
    return findConstantTerm(points.slice(0, json.keys.k));
}

console.log("Secret for testcase1:", processTestCase('testcase1.json').toString());
console.log("Secret for testcase2:", processTestCase('testcase2.json').toString());