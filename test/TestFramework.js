export function registerTest(title, callback) {
  let button = document.createElement("button");
  button.innerText = title;
  button.onclick = callback;

  document.body.appendChild(button);
}

export function printResult(testName, result, color = 'black') {
  let wrapper = document.createElement('div');
  
  if (result === true) {
    result = `<strong style="color:green;">OK</strong> ...`
  } else if (result === false) {
    result = `<strong style="color:red;">FAIL</strong> .`
  } else {
    result = `<strong style="color:${color};">${result}</strong>`
  }

  wrapper.innerHTML = `${result} ${testName}`;
  document.body.appendChild(wrapper);
}