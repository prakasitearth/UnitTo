// Listen for highlight (selection) event on any webpage
document.addEventListener("mouseup", handleSelection);
document.addEventListener("mousedown", clearTooltip);

let currentTooltip = null;

const CONVERSION_RULES = [
  // Length
  { regex: /(\d+(?:\.\d+)?)\s*(?:cm|centimeters?)/i, factor: 1/2.54, targetUnit: "in", label: "inches" },
  { regex: /(\d+(?:\.\d+)?)\s*(?:in|inch|inches)/i, factor: 2.54, targetUnit: "cm", label: "cm" },
  { regex: /(\d+(?:\.\d+)?)\s*(?:m|meters?)/i, factor: 3.28084, targetUnit: "ft", label: "feet" },
  { regex: /(\d+(?:\.\d+)?)\s*(?:ft|foot|feet)/i, factor: 0.3048, targetUnit: "m", label: "meters" },
  { regex: /(\d+(?:\.\d+)?)\s*(?:km|kilometers?)/i, factor: 0.621371, targetUnit: "mi", label: "miles" },
  { regex: /(\d+(?:\.\d+)?)\s*(?:mi|miles?)/i, factor: 1.60934, targetUnit: "km", label: "km" },
  // Weight
  { regex: /(\d+(?:\.\d+)?)\s*(?:kg|kgs|kilograms?)/i, factor: 2.20462, targetUnit: "lb", label: "lbs" },
  { regex: /(\d+(?:\.\d+)?)\s*(?:lbs?|pounds?)/i, factor: 0.453592, targetUnit: "kg", label: "kg" },
  // Area
  { regex: /(\d+(?:\.\d+)?)\s*(?:rai|ไร่)/i, factor: 1600, targetUnit: "sq m", label: "sq m" },
  { regex: /(\d+(?:\.\d+)?)\s*(?:tsubo|坪)/i, factor: 3.30578, targetUnit: "sq m", label: "sq m" }
];

function handleSelection(e) {
  const selection = window.getSelection().toString().trim();
  if (!selection || selection.length > 30) return;

  for (const rule of CONVERSION_RULES) {
    const match = selection.match(rule.regex);
    if (match) {
      const val = parseFloat(match[1]);
      if (isNaN(val)) continue;

      const converted = (val * rule.factor).toFixed(2);
      showTooltip(e.pageX, e.pageY, `${val} ➔ ${parseFloat(converted)} ${rule.label}`);
      break;
    }
  }
}

function showTooltip(x, y, text) {
  clearTooltip();

  const tooltip = document.createElement("div");
  tooltip.id = "unittogo-extension-tooltip";
  tooltip.style.position = "absolute";
  tooltip.style.left = `${x + 10}px`;
  tooltip.style.top = `${y + 10}px`;
  tooltip.style.background = "#0f4c81";
  tooltip.style.color = "#ffffff";
  tooltip.style.padding = "6px 12px";
  tooltip.style.borderRadius = "8px";
  tooltip.style.fontSize = "11px";
  tooltip.style.fontWeight = "bold";
  tooltip.style.fontFamily = "sans-serif font-mono";
  tooltip.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
  tooltip.style.zIndex = "99999999";
  tooltip.style.pointerEvents = "none";
  tooltip.innerText = `🔄 ${text}`;

  document.body.appendChild(tooltip);
  currentTooltip = tooltip;
}

function clearTooltip() {
  if (currentTooltip) {
    currentTooltip.remove();
    currentTooltip = null;
  }
}
