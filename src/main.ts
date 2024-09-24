// Random 10 numbers
const numbers = Array.from({ length: 10 }, () =>
  Math.floor(Math.random() * 100)
);

const results: number[][] = [];
const N = 4;

const dfs = (stack: number[], idx: number) => {
  if (stack.length === N) {
    results.push([...stack]);
    return;
  }

  for (let i = idx; i < numbers.length; i++) {
    stack.push(numbers[i]);
    dfs(stack, i + 1);
    stack.pop();
  }
};

dfs([], 0);

console.log(results);
