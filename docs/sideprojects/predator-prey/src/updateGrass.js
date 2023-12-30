function updateGrass(grass, settings) {
    const width = grass.length;
    const height = grass[0].length;
    const maxEnergy = settings.maxVegetationEnergy.value;
    const growthRate = settings.grassGrowthRate.value * 0.01;

    for (let x = 0; x < width; x = x + 1) {
        for (let y = 0; y < height; y = y + 1) {
            if (grass[x][y] < maxEnergy) {
                grass[x][y] += growthRate;

                if (grass[x][y] > maxEnergy) {
                    grass[x][y] = maxEnergy;
                }
            }
        }
    }
}