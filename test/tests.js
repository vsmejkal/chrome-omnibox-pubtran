import TimeParser from "./TimeParser.test.js"
import DateParser from "./DateParser.test.js"
import CityParser from "./CityParser.test.js"
import QueryParser from "./QueryParser.test.js"

runTests({
  DateParser,
  TimeParser,
  CityParser,
  QueryParser
});

// ----------------------------------------------------

async function runTests(testSuites) {
  for (let suiteName in testSuites) {
    for (let testName in testSuites[suiteName]) {
      let test = testSuites[suiteName][testName];
      let result = await executeTest(test);

      printResult(suiteName, testName, result);
    }
  }  
}

async function executeTest(testMethod) {
  try {
    return await Promise.resolve(testMethod());
  } catch (error) {
    console.error(error);
    return false;
  }
}

function printResult(suiteName, testName, result) {
  if (result === true) {
    result = `<strong style="color:green;">OK</strong> ...`
  }
  if (result === false) {
    result = `<strong style="color:red;">FAIL</strong> .`
  }

  document.body.innerHTML += `${result} ${suiteName}.${testName}<br>`;
}