import TimeParser from "/test/unit/TimeParser.test.js"
import DateParser from "/test/unit/DateParser.test.js"
import CityParser from "/test/unit/CityParser.test.js"
import QueryParser from "/test/unit/QueryParser.test.js"
import {registerTest, printResult} from "/test/TestFramework.js"

registerTest('Unit Test', () => runTests({
  DateParser,
  TimeParser,
  CityParser,
  QueryParser
}));

// --------------------------------------------------------

async function runTests(testSuites) {
  for (let suiteName in testSuites) {
    for (let testName in testSuites[suiteName]) {
      let test = testSuites[suiteName][testName];
      let result = await executeTest(test);

      printResult(`${suiteName}.${testName}`, result);
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
