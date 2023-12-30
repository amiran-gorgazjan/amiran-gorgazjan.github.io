function renderCreatures(world, indexName, ctx) {
    const index = world[indexName];
    const len = index.length;

    const imageData = ctx.getImageData(0, 0, world.width, world.height, );

    for (let i = 0; i < len; i = i + 1) {
        const creature = index[i];
        const color = creature.color;
        // const pixel = creature.y * (world.width * 4) + creature.x * 4;
        const pixel = 4 * (creature.y * world.width + creature.x);

        let opacity = creature.energy / 2 * 255;

        if (opacity <= 255) {
            // float -> int
            opacity = Math.max(100, ~~opacity);
        } else {
            opacity = 255;
        }

        imageData.data[pixel] = color.r;
        imageData.data[pixel + 1] = color.g;
        imageData.data[pixel + 2] = color.b;
        imageData.data[pixel + 3] = opacity;
    }

   ctx.putImageData(imageData, 0, 0);
}