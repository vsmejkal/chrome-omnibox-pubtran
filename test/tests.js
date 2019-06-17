import TimeParser from "./TimeParser.test.js"
import DateParser from "./DateParser.test.js"

runTests({
  DateParser,
  TimeParser
});

// ---

async function runTests(testSuites) {
  for (let suiteName in testSuites) {
    for (let testName in testSuites[suiteName]) {
      const test = testSuites[suiteName][testName];
      const result = await executeTest(test);

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
    result = `<strong style="color:green;">OK</strong>`
  }
  if (result === false) {
    result = `<strong style="color:red;">FAIL</strong>`
  }

  document.body.innerHTML += `${suiteName} . ${testName} ... ${result}<br>`;
}