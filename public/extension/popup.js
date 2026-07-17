const typeSelect = document.getElementById("type-select");
const inputVal = document.getElementById("input-val");
const outputVal = document.getElementById("output-val");

function calculate() {
  const val = parseFloat(inputVal.value);
  if (isNaN(val)) {
    outputVal.innerText = "...";
    return;
  }

  const type = typeSelect.value;
  let resultText = "";

  if (type === "length") {
    resultText = `${(val * 3.28084).toFixed(2)} feet`;
  } else if (type === "weight") {
    resultText = `${(val * 2.20462).toFixed(2)} lbs`;
  } else if (type === "temp") {
    resultText = `${((val * 9/5) + 32).toFixed(1)} °F`;
  } else if (type === "thaiLand") {
    resultText = `${(val * 1600).toLocaleString()} sq m`;
  }

  outputVal.innerText = resultText;
}

typeSelect.addEventListener("change", calculate);
inputVal.addEventListener("input", calculate);

// Initial calculation
calculate();
