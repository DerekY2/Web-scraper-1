function fahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function bug(fahrenheit){
  return fahrenheit - 32 * 5 / 9
}

// Example usage:
const fahrenheit = 100;
const celsius = fahrenheitToCelsius(fahrenheit);
const bugged = bug(fahrenheit)
console.log(`${fahrenheit}°F is equal to ${celsius.toFixed(2)}°C`);
console.log(`${fahrenheit}°F is equal to ${bugged.toFixed(2)}°C`);