import Database from "/src/Database.js";
import {registerTest, printResult} from "/test/TestFramework.js"

registerTest('Performance Test', () => runTests({
  searchCity
}));

// --------------------------------------------------------

async function runTests(tests) {
  // Preload database
  await Database.search("ce")

  for (let testName in tests) {
    let t0 = performance.now();
    await tests[testName]();
    let t1 = performance.now();

    printResult(testName, `${(t1 - t0).toFixed(2)}ms`);
  }
}

async function searchCity() {
  let prefixes = ["ce", "br", "li", "la", "lo", "mo", "ol", "ve", "st"]

  for (let i = 0; i < 1000; i++) {
    await Database.search(prefixes[i % prefixes.length])
  }
}