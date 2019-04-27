import randomize from './random';

// shamelessly stolen from: https://stackoverflow.com/a/48808401/656011
export default (min, max, exclude = []) => {
  let returnValue = 0;

  while(exclude.indexOf(returnValue = randomize(min, max)) > -1) {  }

  return returnValue;
}
