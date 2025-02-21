const fs = require('fs');

// Function to parse a string in a given base to BigInt
function parseBigInt(str, base) {
    const baseBig = BigInt(base);
    let total = 0n;
    for (let char of str) {
        total = total * baseBig + BigInt(/[0-9]/.test(char) ? char - '0' : 10 + char.charCodeAt(0) - 'a'.charCodeAt(0));
    }
    return total;
}

// Compute constant term 'c' using Lagrange interpolation
function findConstantTerm(points) {
    const k = points.length, num = [], den = [];
    for (let i = 0; i < k; i++) {
        let num_i = 1n, den_i = 1n;
        for (let j = 0; j < k; j++) if (i !== j) {
            num_i *= -points[j][0];
            den_i *= points[i][0] - points[j][0];
        }
        num.push(num_i);
        den.push(den_i);
    }
    const P = den.reduce((p, d) => p * d, 1n);
    const numerator = num.reduce((sum, n, i) => sum + points[i][1] * n * (P / den[i]), 0n);
    return numerator / P;
}

// Process a test case from a JSON file
function processTestCase(filePath) {
    try {
        // Read the JSON file as a string
        const jsonStr = fs.readFileSync(filePath, 'utf8');
        // Parse the string into a JavaScript object
        const json = JSON.parse(jsonStr);
        const k = json.keys.k;
        const points = [];
        // Extract points from the JSON object
        for (let key in json) {
            if (key !== "keys") {
                points.push([BigInt(key), parseBigInt(json[key].value, parseInt(json[key].base, 10))]);
            }
        }
        // Compute the secret using the first k points
        return findConstantTerm(points.slice(0, k));
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
        return null;
    }
}

// Paths to the test case files
const testcase1Path = 'testcase1.json';
const testcase2Path = 'testcase2.json';

// Compute and print secrets
const secret1 = processTestCase(testcase1Path);
if (secret1 !== null) {
    console.log("Secret for testcase1:", secret1.toString());
}

const secret2 = processTestCase(testcase2Path);
if (secret2 !== null) {
    console.log("Secret for testcase2:", secret2.toString());
}