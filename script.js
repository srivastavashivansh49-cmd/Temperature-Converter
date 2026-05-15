const units = {
  celsius: { name: 'Celsius', symbol: '°C' },
  fahrenheit: { name: 'Fahrenheit', symbol: '°F' },
  kelvin: { name: 'Kelvin', symbol: 'K' },
  rankine: { name: 'Rankine', symbol: '°R' },
  reaumur: { name: 'Réaumur', symbol: '°Ré' },
  delisle: { name: 'Delisle', symbol: '°De' },
  newton: { name: 'Newton', symbol: '°N' },
  romer: { name: 'Rømer', symbol: '°Rø' }
};

const toCelsius = {
  celsius: value => value,
  fahrenheit: value => (value - 32) * 5 / 9,
  kelvin: value => value - 273.15,
  rankine: value => (value - 491.67) * 5 / 9,
  reaumur: value => value * 5 / 4,
  delisle: value => 100 - value * 2 / 3,
  newton: value => value * 100 / 33,
  romer: value => (value - 7.5) * 40 / 21
};

const fromCelsius = {
  celsius: value => value,
  fahrenheit: value => value * 9 / 5 + 32,
  kelvin: value => value + 273.15,
  rankine: value => (value + 273.15) * 9 / 5,
  reaumur: value => value * 4 / 5,
  delisle: value => (100 - value) * 3 / 2,
  newton: value => value * 33 / 100,
  romer: value => value * 21 / 40 + 7.5
};

const formulas = {
  celsius: 'Convert selected value to Celsius first, then to the target unit.',
  fahrenheit: '°F = (°C × 9/5) + 32',
  kelvin: 'K = °C + 273.15',
  rankine: '°R = (°C + 273.15) × 9/5',
  reaumur: '°Ré = °C × 4/5',
  delisle: '°De = (100 - °C) × 3/2',
  newton: '°N = °C × 33/100',
  romer: '°Rø = °C × 21/40 + 7.5'
};

const form = document.getElementById('converterForm');
const temperatureInput = document.getElementById('temperature');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');
const result = document.getElementById('result');
const formula = document.getElementById('formula');
const swapBtn = document.getElementById('swapBtn');
const freezingPoint = document.getElementById('freezingPoint');
const boilingPoint = document.getElementById('boilingPoint');

function fillUnitOptions() {
  Object.entries(units).forEach(([key, unit]) => {
    fromUnit.add(new Option(`${unit.name} (${unit.symbol})`, key));
    toUnit.add(new Option(`${unit.name} (${unit.symbol})`, key));
  });

  fromUnit.value = 'celsius';
  toUnit.value = 'fahrenheit';
}

function formatNumber(value) {
  return Number.parseFloat(value.toFixed(4)).toLocaleString(undefined, {
    maximumFractionDigits: 4
  });
}

function convert(value, from, to) {
  const celsiusValue = toCelsius[from](value);
  return fromCelsius[to](celsiusValue);
}

function updateReferencePoints() {
  const target = toUnit.value;
  freezingPoint.textContent = `${formatNumber(fromCelsius[target](0))} ${units[target].symbol}`;
  boilingPoint.textContent = `${formatNumber(fromCelsius[target](100))} ${units[target].symbol}`;
}

function handleConvert(event) {
  event.preventDefault();

  const value = Number(temperatureInput.value);
  const from = fromUnit.value;
  const to = toUnit.value;

  if (!Number.isFinite(value)) {
    result.textContent = 'Please enter a valid number.';
    formula.textContent = 'Only numeric values can be converted.';
    return;
  }

  const convertedValue = convert(value, from, to);
  result.textContent = `${formatNumber(value)} ${units[from].symbol} = ${formatNumber(convertedValue)} ${units[to].symbol}`;
  formula.textContent = from === to ? 'Same unit selected, so the value stays unchanged.' : formulas[to];
  updateReferencePoints();
}

swapBtn.addEventListener('click', () => {
  const currentFrom = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value = currentFrom;
  if (temperatureInput.value !== '') form.requestSubmit();
  updateReferencePoints();
});

fromUnit.addEventListener('change', () => temperatureInput.value !== '' && form.requestSubmit());
toUnit.addEventListener('change', () => temperatureInput.value !== '' && form.requestSubmit());
form.addEventListener('submit', handleConvert);

fillUnitOptions();
updateReferencePoints();
