function renderField(field, ctx) {
    const width = field.length;
    const height = field[0].length;

    const imageData = ctx.createImageData(width, height);

    for (let x = 0; x < width; x = x + 1) {
        for (let y = 0; y < height; y = y + 1) {
            const index = y * (width * 4) + x * 4;
            const value = field[x][y];

            imageData.data[index] = 70 + (value * 50);
            imageData.data[index + 1] = 255;
            imageData.data[index + 2] = 0;
            imageData.data[index + 3] = value * 255;

        }
    }

    ctx.putImageData(imageData, 0, 0);
}