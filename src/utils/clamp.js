// clamp a number between min and max
// shamelessly stolen from: https://stackoverflow.com/a/11409944/656011
export default (num, min, max) => Math.min(Math.max(num, min), max);
