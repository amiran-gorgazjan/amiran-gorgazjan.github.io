function create2dArray(defaultValue, width, heigth) {
    const field = [];

    for (let x = 0; x < width; x = x + 1) {
        field[x] = [];
    
        for (let y = 0; y < heigth; y = y + 1) {
            field[x][y] = defaultValue;
        }
    }

    return field;
}