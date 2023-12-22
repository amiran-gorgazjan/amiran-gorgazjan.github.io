function printGrid(arr, rows, cols) {
    for (let i = 0; i < rows; i++) {
      let row = '';
      for (let j = 0; j < cols; j++) {
        row += arr[i * cols + j] + ' ';
      }
      console.log(row);
    }

    console.log('-------------------');
}

const WIDTH = 5
const HEIGHT = 5

function getValueAt(level, x, y) {
    if (isOutOfBounds(x, y)) {
        return undefined
    }

    return level[y * WIDTH + x]
}

function setValueAt(level, x, y, value) {
    if (isOutOfBounds(x, y)) {
        return
    }

    level[y * WIDTH + x] = value
}

function isOutOfBounds(x, y) {
    return x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT
}

const input = [
    1, 1, 0, 0, 0,
    1, 1, 0, 0, 1,
    1, 1, 0, 1, 1,
    1, 1, 0, 1, 0,
    1, 1, 1, 0, 0,
];

const x = 4;
const y = 0;

printGrid(input, 5, 5);
const output = replaceDisconnectedOnes(input, x, y);

printGrid(output, 5, 5);
