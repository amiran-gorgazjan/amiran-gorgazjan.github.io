var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);

// src/modules/games/koobas/enums.ts
var WIDTH, HEIGHT, TRANSPARENT, CAVE, MOUNTAIN, START, END, PLAYER, APPLE, MONSTER, GOLD, FOG, SHOP;
var init_enums = __esm(() => {
  WIDTH = 80;
  HEIGHT = 24;
  TRANSPARENT = -1;
  CAVE = 0;
  MOUNTAIN = 1;
  START = 2;
  END = 3;
  PLAYER = 4;
  APPLE = 5;
  MONSTER = 6;
  GOLD = 7;
  FOG = 8;
  SHOP = 9;
});

// src/modules/games/koobas/layers.ts
function createLayer(fillValue = TRANSPARENT) {
  return Array.from({ length: HEIGHT * WIDTH }, () => fillValue);
}
function isOutOfBounds(x, y) {
  return x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT;
}
function getValueAt(layer, x, y) {
  if (isOutOfBounds(x, y)) {
    return;
  }
  return layer[y * WIDTH + x];
}
function setValueAt(layer, x, y, value) {
  if (isOutOfBounds(x, y)) {
    return;
  }
  layer[y * WIDTH + x] = value;
}
function mergeLayers(layers = []) {
  if (layers.length === 0) {
    console.warn("No layers to merge");
    return [];
  }
  const merged = createLayer();
  for (const layer of layers) {
    for (let i = 0;i < layer.length; i++) {
      if (layer[i] !== TRANSPARENT) {
        merged[i] = layer[i];
      }
    }
  }
  return merged;
}
var init_layers = __esm(() => {
  init_enums();
});

// src/modules/games/koobas/graphics.ts
function STYLE(glyph, color, opacity = 1) {
  return { "@type": "style", glyph, color, opacity };
}
function isGraphicName(name) {
  if (typeof name !== "string" && typeof name !== "number") {
    return false;
  }
  return name in graphics;
}
function getGraphic(value) {
  if (isStyle(value)) {
    return value;
  }
  if (!isGraphicName(value)) {
    return getGraphic("UNKNOWN");
  }
  return graphics[value];
}
function illuminate(fogLayer, caveLayer, position, visibility = 5) {
  for (let angle = 0;angle < 360; angle += 1) {
    const rayDirX = Math.cos(angle * Math.PI / 180);
    const rayDirY = Math.sin(angle * Math.PI / 180);
    let rayX = position.x + 0.5;
    let rayY = position.y + 0.5;
    for (let distance = 0;distance < visibility; distance += 0.1) {
      rayX += rayDirX * 0.1;
      rayY += rayDirY * 0.1;
      const mapX = Math.floor(rayX);
      const mapY = Math.floor(rayY);
      if (mapX >= 0 && mapX < WIDTH && mapY >= 0 && mapY < HEIGHT && getValueAt(caveLayer, mapX, mapY) === MOUNTAIN) {
        setValueAt(fogLayer, mapX, mapY, TRANSPARENT);
        break;
      }
      if (mapX >= 0 && mapX < WIDTH && mapY >= 0 && mapY < HEIGHT) {
        setValueAt(fogLayer, mapX, mapY, TRANSPARENT);
      }
    }
  }
}
function renderLayersAsLines(layers2 = [], visibilityLayer = null) {
  const mergedLayers = mergeLayers(layers2);
  let lines = [];
  for (let y = 0;y < HEIGHT; y++) {
    let line = "";
    let previousColor = null;
    let previousOpacity = null;
    for (let x = 0;x < WIDTH; x++) {
      const value = getValueAt(mergedLayers, x, y);
      if (value === undefined) {
        throw new Error(`Value at ${x}, ${y} is undefined`);
      }
      let styleOnLayer = getGraphic(value);
      const visibility = visibilityLayer ? getValueAt(visibilityLayer, x, y) : TRANSPARENT;
      const style = {
        opacity: visibility === FOG ? 0.2 : 1,
        ...styleOnLayer
      };
      if (!style) {
        throw new Error(`Unknown graphic: ${value}`);
      }
      if (style.color !== previousColor || style.opacity !== previousOpacity) {
        if (previousColor !== null) {
          line += "</span>";
        }
        line += `<span style="color: ${style.color}; opacity: ${style.opacity}">`;
      }
      previousColor = style.color;
      previousOpacity = style.opacity;
      line += style.glyph;
    }
    if (previousColor !== null) {
      line += "</span>";
    }
    lines.push(line);
  }
  return lines;
}
var isStyle, graphics;
var init_graphics = __esm(() => {
  init_enums();
  init_layers();
  isStyle = function(value) {
    return typeof value === "object" && value !== null && ("@type" in value) && value["@type"] === "style";
  };
  graphics = {
    UNKNOWN: STYLE("\uFFFD", "#fff"),
    [TRANSPARENT]: STYLE(" ", "transparent"),
    [CAVE]: STYLE("\u2591", "#333"),
    [MOUNTAIN]: STYLE("\u2588", "#ccc"),
    [START]: STYLE("\u2193", "#777"),
    [END]: STYLE("\u2191", "#ff0"),
    [PLAYER]: STYLE("\u263A", "#ff0"),
    [APPLE]: STYLE("\u10E2", "#f00"),
    [MONSTER]: STYLE("\u03A8", "#f00"),
    [GOLD]: STYLE("$", "#ff0"),
    [FOG]: STYLE(" ", "#222"),
    [SHOP]: STYLE("S", "#0ff"),
    "\u25AB": STYLE("\u2588", "#ccc"),
    "\u2554": STYLE("\u2554", "#ccc"),
    "\u2557": STYLE("\u2557", "#ccc"),
    "\u255A": STYLE("\u255A", "#ccc"),
    "\u255D": STYLE("\u255D", "#ccc"),
    "\u2566": STYLE("\u2566", "#ccc"),
    "\u2569": STYLE("\u2569", "#ccc"),
    "\u2560": STYLE("\u2560", "#ccc"),
    "\u2563": STYLE("\u2563", "#ccc"),
    "\u256C": STYLE("\u256C", "#ccc"),
    "\u2550": STYLE("\u2550", "#ccc"),
    "\u2551": STYLE("\u2551", "#ccc"),
    "\u2568": STYLE("\u2568", "#ccc"),
    "\u2565": STYLE("\u2565", "#ccc"),
    "\u255E": STYLE("\u255E", "#ccc"),
    "\u2561": STYLE("\u2561", "#ccc")
  };
});

// src/modules/games/koobas/items.ts
function isItemName(name) {
  return name in items;
}
var ATK, ITEM, items;
var init_items = __esm(() => {
  ATK = (damage = 1, radius = 1, props = {}) => {
    const onAttack = {
      hp: damage,
      radius,
      sound: null,
      ...props
    };
    return { onAttack };
  };
  ITEM = (glyph, name, description, props = {}) => ({
    ...props,
    glyph,
    name,
    description
  });
  items = {
    apple: ITEM("\uD83C\uDF4E", "Apple", "A delicious apple", {
      onUse: { hp: 1, sound: "apple-bite-1" },
      ...ATK(1)
    }),
    "health-potion": ITEM("\uD83E\uDDEA", "Health potion", "A potion that heals you", {
      onUse: { hp: 5, sound: "apple-bite-1" }
    }),
    "gold-coin": ITEM("\uD83D\uDCB0", "Gold coin", "A shiny gold coin", { ...ATK(0.5) }),
    "wooden-sword": ITEM("\uD83D\uDDE1", "Wooden sword", "A dull wooden sword that does not look very dangerous", { ...ATK(3) }),
    bomb: ITEM("\uD83D\uDCA3", "Bomb", "A dangerous bomb", { ...ATK(10, 3) })
  };
});

// src/modules/games/koobas/entities.ts
var INVENTORY, createPlayer, createMonster, setPosition, attemptMove, attemptAttack, canEntitySeeTarget, getAdjacentDirectionFromTowards;
var init_entities = __esm(() => {
  init_layers();
  init_enums();
  init_items();
  init_graphics();
  INVENTORY = function(props = {}) {
    return Object.assign(Object.fromEntries(Object.keys(items).map((key) => {
      return [key, 0];
    })), props);
  };
  createPlayer = function() {
    return {
      position: { x: 0, y: 0 },
      health: 10,
      maxHealth: 10,
      damage: 1,
      luck: 0.2,
      visibility: 8,
      inventory: INVENTORY(),
      style: STYLE("\u263A", "#ff0")
    };
  };
  createMonster = function() {
    return {
      ...createPlayer(),
      health: 3,
      maxHealth: 3,
      damage: 1,
      visibility: 7,
      inventory: INVENTORY({
        "gold-coin": 1 + Math.floor(Math.random() * 4),
        apple: Math.floor(Math.random() * 3)
      }),
      style: STYLE("\u03A8", "#f00")
    };
  };
  setPosition = function(entity, position) {
    entity.position.x = position.x;
    entity.position.y = position.y;
  };
  attemptMove = function(caveLayer, anyEntity, direction) {
    const newX = anyEntity.position.x + direction.x;
    const newY = anyEntity.position.y + direction.y;
    const value = getValueAt(caveLayer, newX, newY);
    if (value !== CAVE) {
      return false;
    }
    setPosition(anyEntity, { x: newX, y: newY });
    return true;
  };
  attemptAttack = function(targets, attacker, direction) {
    const newX = attacker.position.x + direction.x;
    const newY = attacker.position.y + direction.y;
    for (const target of targets) {
      if (target.position.x === newX && target.position.y === newY) {
        target.health -= attacker.damage;
        if (target.health <= 0) {
          target.health = 0;
          console.log("killed", target);
          console.log("inventory", target.inventory);
          Object.entries(target.inventory).forEach(([key, amount]) => {
            if (isItemName(key)) {
              if (attacker.inventory[key] === undefined) {
                attacker.inventory[key] = 0;
              }
              attacker.inventory[key] += amount;
            }
          });
        }
        return true;
      }
    }
    return false;
  };
  canEntitySeeTarget = function(entity, target, caveLayer) {
    const distance = Math.sqrt(Math.pow(target.position.x - entity.position.x, 2) + Math.pow(target.position.y - entity.position.y, 2));
    if (distance > entity.visibility) {
      return false;
    }
    const deltaX = target.position.x - entity.position.x;
    const deltaY = target.position.y - entity.position.y;
    const angle = Math.atan2(deltaY, deltaX);
    for (let i = 0;i < distance; i += 0.1) {
      const x = Math.floor(entity.position.x + Math.cos(angle) * i);
      const y = Math.floor(entity.position.y + Math.sin(angle) * i);
      const value = getValueAt(caveLayer, x, y);
      if (value !== CAVE) {
        return false;
      }
    }
    return true;
  };
  getAdjacentDirectionFromTowards = function(anyEntity, target) {
    const deltaX = target.position.x - anyEntity.position.x;
    const deltaY = target.position.y - anyEntity.position.y;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return {
        x: Math.sign(deltaX),
        y: 0
      };
    } else {
      return {
        x: 0,
        y: Math.sign(deltaY)
      };
    }
  };
});

// src/modules/games/koobas/procedural.ts
function createCaveLayer() {
  const layer = createLayer(MOUNTAIN);
  let startX = Math.floor(Math.random() * WIDTH);
  let startY = Math.floor(Math.random() * HEIGHT);
  let x = startX;
  let y = startY;
  setValueAt(layer, x, y, CAVE);
  let steps = 0;
  let maxSteps = 1000;
  let prevDirection = null;
  const straightness = Math.random();
  while (true) {
    const direction = getRandomDirection(prevDirection, straightness);
    const newX = x + direction.x;
    const newY = y + direction.y;
    if (newX >= 1 && newX < WIDTH - 1 && newY >= 1 && newY < HEIGHT - 1) {
      x = newX;
      y = newY;
      setValueAt(layer, x, y, CAVE);
      if (++steps >= maxSteps) {
        break;
      }
      if (Math.abs(x - startX) >= WIDTH * 0.8) {
        break;
      }
    }
    prevDirection = direction;
  }
  while (removeSingleWalls(layer) > 0) {
    continue;
  }
  return { layer, start: { x: startX, y: startY }, end: { x, y } };
}
function removeSingleWalls(layer) {
  let numRemoved = 0;
  for (let x = 1;x < WIDTH - 1; x++) {
    for (let y = 1;y < HEIGHT - 1; y++) {
      const value = getValueAt(layer, x, y);
      if (value === MOUNTAIN) {
        const neighbors = [
          getValueAt(layer, x, y - 1),
          getValueAt(layer, x, y + 1),
          getValueAt(layer, x - 1, y),
          getValueAt(layer, x + 1, y)
        ];
        if (neighbors.filter((neighbor) => neighbor === MOUNTAIN).length <= 1) {
          setValueAt(layer, x, y, CAVE);
          numRemoved++;
        }
      }
    }
  }
  return numRemoved;
}
function getRandomDirection(prevDirection, straightness = 0.5) {
  if (prevDirection && Math.random() > straightness) {
    return prevDirection;
  }
  let availableDirections = directions.filter((direction) => {
    if (!prevDirection)
      return true;
    return direction.x !== -prevDirection.x && direction.y !== -prevDirection.y;
  });
  return availableDirections[Math.floor(Math.random() * availableDirections.length)];
}
var directions, calculateDistance, createMonsters;
var init_procedural = __esm(() => {
  init_entities();
  init_layers();
  init_enums();
  directions = [
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: 0, y: 1 }
  ];
  calculateDistance = (x1, y1, x2, y2) => Math.abs(x2 - x1) + Math.abs(y2 - y1);
  createMonsters = function(caveLayerResult, currentLevel = 1) {
    const MIN_DISTANCE = 5;
    const MIN_DISTANCE_TO_START = 10;
    const MAX_MONSTERS = 50;
    const monsters = [];
    for (let i = 0;i < MAX_MONSTERS; i++) {
      const x = Math.floor(Math.random() * WIDTH);
      const y = Math.floor(Math.random() * HEIGHT);
      if (getValueAt(caveLayerResult.layer, x, y) === CAVE) {
        const distToStart = calculateDistance(x, y, caveLayerResult.start.x, caveLayerResult.start.y);
        let valid = true;
        for (const monster of monsters) {
          const distToMonster = calculateDistance(x, y, monster.position.x, monster.position.y);
          if (distToMonster < MIN_DISTANCE || distToStart < MIN_DISTANCE_TO_START) {
            valid = false;
            break;
          }
        }
        if (valid) {
          const monster = createMonster();
          setPosition(monster, { x, y });
          monsters.push(monster);
        }
      }
    }
    return monsters;
  };
});

// src/modules/games/koobas/procedural-cleanup.ts
function replaceDeepWallsWithPathTiles(layer, x, y, { pathTile = CAVE, wallTile = MOUNTAIN } = {}) {
  const layerCopy = [...layer];
  visitAndMark(layerCopy, x, y);
  for (let i = 0;i < layerCopy.length; i++) {
    if (layerCopy[i] === wallTile) {
      layerCopy[i] = pathTile;
    }
  }
  for (let i = 0;i < layerCopy.length; i++) {
    if (layerCopy[i] === "VISITED") {
      layerCopy[i] = layer[i];
    }
  }
  return layerCopy;
}
var visitAndMark;
var init_procedural_cleanup = __esm(() => {
  init_enums();
  init_layers();
  visitAndMark = function(layer, x, y, { pathTile = CAVE, wallTile = MOUNTAIN } = {}) {
    if (isOutOfBounds(x, y)) {
      return;
    }
    setValueAt(layer, x, y, "VISITED");
    const top = getValueAt(layer, x, y - 1);
    const right = getValueAt(layer, x + 1, y);
    const bottom = getValueAt(layer, x, y + 1);
    const left = getValueAt(layer, x - 1, y);
    const topLeft = getValueAt(layer, x - 1, y - 1);
    const topRight = getValueAt(layer, x + 1, y - 1);
    const bottomRight = getValueAt(layer, x + 1, y + 1);
    const bottomLeft = getValueAt(layer, x - 1, y + 1);
    if (top === wallTile) {
      setValueAt(layer, x, y - 1, "VISITED");
    }
    if (right === wallTile) {
      setValueAt(layer, x + 1, y, "VISITED");
    }
    if (bottom === wallTile) {
      setValueAt(layer, x, y + 1, "VISITED");
    }
    if (left === wallTile) {
      setValueAt(layer, x - 1, y, "VISITED");
    }
    if (topLeft === wallTile) {
      setValueAt(layer, x - 1, y - 1, "VISITED");
    }
    if (topRight === wallTile) {
      setValueAt(layer, x + 1, y - 1, "VISITED");
    }
    if (bottomRight === wallTile) {
      setValueAt(layer, x + 1, y + 1, "VISITED");
    }
    if (bottomLeft === wallTile) {
      setValueAt(layer, x - 1, y + 1, "VISITED");
    }
    if (top === pathTile) {
      visitAndMark(layer, x, y - 1);
    }
    if (right === pathTile) {
      visitAndMark(layer, x + 1, y);
    }
    if (bottom === pathTile) {
      visitAndMark(layer, x, y + 1);
    }
    if (left === pathTile) {
      visitAndMark(layer, x - 1, y);
    }
  };
});

// src/modules/games/koobas/graphics-cave-to-walls.ts
function caveToWalls(caveLayer) {
  const wallLayer = createLayer(TRANSPARENT);
  for (let y = 0;y < HEIGHT; y++) {
    for (let x = 0;x < WIDTH; x++) {
      const symbolMiddle = getValueAt(caveLayer, x, y);
      if (symbolMiddle !== MOUNTAIN) {
        continue;
      }
      const top = getValueAt(caveLayer, x, y - 1);
      const bottom = getValueAt(caveLayer, x, y + 1);
      const left = getValueAt(caveLayer, x - 1, y);
      const right = getValueAt(caveLayer, x + 1, y);
      const key = [top, left, right, bottom].join("");
      const symbol = caveToSymbol[key];
      if (symbol) {
        setValueAt(wallLayer, x, y, `${symbol}`);
      } else {
        setValueAt(wallLayer, x, y, `${defaultWallSymbol}`);
      }
    }
  }
  return wallLayer;
}
var defaultWallSymbol, M, C, symbolToCave, caveToSymbol;
var init_graphics_cave_to_walls = __esm(() => {
  init_enums();
  init_layers();
  defaultWallSymbol = "\u25AB";
  M = MOUNTAIN;
  C = CAVE;
  symbolToCave = {
    "\u2554": [
      C,
      C,
      M,
      M
    ],
    "\u2557": [
      C,
      M,
      C,
      M
    ],
    "\u255A": [
      M,
      C,
      M,
      C
    ],
    "\u255D": [
      M,
      M,
      C,
      C
    ],
    "\u2566": [
      C,
      M,
      M,
      M
    ],
    "\u2569": [
      M,
      M,
      M,
      C
    ],
    "\u2560": [
      M,
      C,
      M,
      M
    ],
    "\u2563": [
      M,
      M,
      C,
      M
    ],
    "\u256C": [
      M,
      M,
      M,
      M
    ],
    "\u2550": [
      C,
      M,
      M,
      C
    ],
    "\u2551": [
      M,
      C,
      C,
      M
    ],
    "\u2568": [
      M,
      C,
      C,
      C
    ],
    "\u2565": [
      C,
      C,
      C,
      M
    ],
    "\u255E": [
      C,
      C,
      M,
      C
    ],
    "\u2561": [
      C,
      M,
      C,
      C
    ]
  };
  caveToSymbol = Object.fromEntries(Object.entries(symbolToCave).map(([symbol, pattern]) => [pattern.join(""), symbol]));
});

// src/modules/games/koobas/audio-player/audio-player.ts
function loadAllSounds() {
  return Promise.all(Object.values(sounds).map((sound) => {
    return loadSound(sound.url).then((buffer) => {
      sound.buffer = buffer;
    });
  }));
}
function playAudio(name) {
  const sound = sounds[name];
  if (!sound) {
    console.warn(`Sound ${name} not found`);
    return;
  }
  const source = context.createBufferSource();
  source.buffer = sound.buffer;
  source.connect(context.destination);
  source.loop = false;
  source.start(source.context.currentTime);
}
var SOUND, loadSound, sounds, context;
var init_audio_player = __esm(() => {
  SOUND = function(soundName, extension) {
    return {
      url: `/modules/games/koobas/audio-player/files/${soundName}.${extension}`,
      buffer: null
    };
  };
  loadSound = function(url) {
    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest;
      request.open("GET", url, true);
      request.responseType = "arraybuffer";
      request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
          resolve(buffer);
        }, reject);
      };
      request.onerror = reject;
      request.send();
    });
  };
  sounds = {
    punch1: SOUND("punch1", "wav"),
    "apple-bite-1": SOUND("apple-bite-1", "mp3"),
    "player-death": SOUND("player-death", "wav"),
    step: SOUND("step", "wav"),
    ascend: SOUND("ascend", "wav")
  };
  context = new AudioContext;
});

// src/modules/games/koobas/koobas.ts
var exports_koobas = {};
__export(exports_koobas, {
  main: () => {
    {
      return main;
    }
  }
});
function main(execParams) {
  return new Promise(async (resolve, reject) => {
    const { print, clear } = execParams;
    print("Loading...");
    clear();
    await loadAllSounds();
    player = createPlayer();
    currentLevel = 0;
    startNewLevel({ ...execParams, resolve, reject });
  });
}
var getPlayerStats, startNewLevel, legendMap, legend, player, currentLevel;
var init_koobas = __esm(() => {
  init_graphics();
  init_entities();
  init_layers();
  init_procedural();
  init_procedural_cleanup();
  init_enums();
  init_graphics_cave_to_walls();
  init_audio_player();
  getPlayerStats = function(player) {
    return [
      `Health ${player.health}`,
      `Apples ${player.inventory.apple}`,
      `Gold ${player.inventory["gold-coin"]}`
    ].join("  ");
  };
  startNewLevel = function(asyncExecParams) {
    const { print, optimisedDangerousLinePrint, terminalEl, shake, resolve, reject } = asyncExecParams;
    const caveLayerResult = createCaveLayer();
    const staticItemsLayer = createLayer();
    let monsters = createMonsters(caveLayerResult, currentLevel);
    setPosition(player, caveLayerResult.start);
    setValueAt(staticItemsLayer, caveLayerResult.start.x, caveLayerResult.start.y, START);
    setValueAt(staticItemsLayer, caveLayerResult.end.x, caveLayerResult.end.y, END);
    const wallLayer = caveToWalls(replaceDeepWallsWithPathTiles(caveLayerResult.layer, caveLayerResult.start.x, caveLayerResult.start.y));
    const fogLayer = createLayer(FOG);
    function render() {
      if (player === null) {
        throw new Error("Player is null");
      }
      illuminate(fogLayer, caveLayerResult.layer, player.position, player.visibility);
      const visibilityLayer = createLayer(FOG);
      illuminate(visibilityLayer, caveLayerResult.layer, player.position, player.visibility);
      const entityLayer = createLayer();
      setValueAt(entityLayer, player.position.x, player.position.y, PLAYER);
      for (const monster of monsters) {
        setValueAt(entityLayer, monster.position.x, monster.position.y, monster.style ?? MONSTER);
      }
      const rendered = renderLayersAsLines([
        caveLayerResult.layer,
        wallLayer,
        staticItemsLayer,
        entityLayer,
        fogLayer
      ], visibilityLayer);
      optimisedDangerousLinePrint([
        getPlayerStats(player),
        ...rendered,
        legend
      ]);
    }
    function handlePlayerDeath() {
      player = createPlayer();
      currentLevel = 0;
      playAudio("player-death");
      cleanup();
      startNewLevel(asyncExecParams);
    }
    function ascend() {
      currentLevel += 1;
      playAudio("ascend");
      cleanup();
      startNewLevel(asyncExecParams);
    }
    function eatApple(entity) {
      entity.health = Math.min(entity.health + 3, entity.maxHealth);
      entity.inventory.apple -= 1;
      playAudio("apple-bite-1");
    }
    function handleKeyDownEvent(e) {
      if (e.key === "c" && e.ctrlKey) {
        e.preventDefault();
        print("^C");
        return exit();
      }
      let actionTaken = false;
      let direction = null;
      if (e.key === "ArrowLeft") {
        direction = { x: -1, y: 0 };
      } else if (e.key === "ArrowRight") {
        direction = { x: 1, y: 0 };
      } else if (e.key === "ArrowUp") {
        direction = { x: 0, y: -1 };
      } else if (e.key === "ArrowDown") {
        direction = { x: 0, y: 1 };
      }
      if (e.key === "a") {
        e.preventDefault();
        if (player.inventory.apple > 0) {
          actionTaken = true;
          eatApple(player);
        }
      }
      if (direction) {
        e.preventDefault();
        actionTaken = true;
        const attackedMonster = attemptAttack(monsters, player, direction);
        if (!attackedMonster) {
          attemptMove(caveLayerResult.layer, player, direction);
          playAudio("step");
        } else {
          playAudio("punch1");
          shake();
        }
        if (player.position.x === caveLayerResult.end.x && player.position.y === caveLayerResult.end.y) {
          ascend();
          return;
        }
        monsters = monsters.filter((monster) => monster.health > 0);
      }
      if (actionTaken) {
        for (const monster of monsters) {
          if (canEntitySeeTarget(monster, player, caveLayerResult.layer)) {
            monster.style = STYLE(graphics[MONSTER].glyph, "#ff0000");
            const direction2 = getAdjacentDirectionFromTowards(monster, player);
            const monsterAttackedPlayer = attemptAttack([player], monster, direction2);
            if (!monsterAttackedPlayer) {
              attemptMove(caveLayerResult.layer, monster, direction2);
            }
          } else {
            monster.style = STYLE(graphics[MONSTER].glyph, "#aa0000");
          }
        }
        if (player.health <= 0) {
          handlePlayerDeath();
          return;
        }
      }
      render();
    }
    function cleanup() {
      terminalEl.removeEventListener("keydown", handleKeyDownEvent);
    }
    function exit() {
      cleanup();
      resolve();
    }
    terminalEl.addEventListener("keydown", handleKeyDownEvent);
    render();
  };
  legendMap = {
    [END]: "Exit",
    [START]: "Entrance",
    [PLAYER]: "You",
    [APPLE]: "Apple",
    [MONSTER]: "Monster",
    [GOLD]: "Gold",
    [SHOP]: "Shop"
  };
  legend = Object.entries(legendMap).map(([value, label]) => `${getGraphic(value).glyph} ${label}`).join("  ");
  player = createPlayer();
  currentLevel = 0;
});

// src/modules/signals.ts
var cycleDetected = function() {
  throw new Error("Cycle detected");
};
var mutationDetected = function() {
  throw new Error("Computed cannot have side-effects");
};
var startBatch = function() {
  batchDepth++;
};
var endBatch = function() {
  if (batchDepth > 1) {
    batchDepth--;
    return;
  }
  let error;
  let hasError = false;
  while (batchedEffect !== undefined) {
    let effect = batchedEffect;
    batchedEffect = undefined;
    batchIteration++;
    while (effect !== undefined) {
      const next = effect._nextBatchedEffect;
      effect._nextBatchedEffect = undefined;
      effect._flags &= ~NOTIFIED;
      if (!(effect._flags & DISPOSED) && needsToRecompute(effect)) {
        try {
          effect._callback();
        } catch (err) {
          if (!hasError) {
            error = err;
            hasError = true;
          }
        }
      }
      effect = next;
    }
  }
  batchIteration = 0;
  batchDepth--;
  if (hasError) {
    throw error;
  }
};
var addDependency = function(signal) {
  if (evalContext === undefined) {
    return;
  }
  let node = signal._node;
  if (node === undefined || node._target !== evalContext) {
    node = {
      _version: 0,
      _source: signal,
      _prevSource: evalContext._sources,
      _nextSource: undefined,
      _target: evalContext,
      _prevTarget: undefined,
      _nextTarget: undefined,
      _rollbackNode: node
    };
    if (evalContext._sources !== undefined) {
      evalContext._sources._nextSource = node;
    }
    evalContext._sources = node;
    signal._node = node;
    if (evalContext._flags & TRACKING) {
      signal._subscribe(node);
    }
    return node;
  } else if (node._version === -1) {
    node._version = 0;
    if (node._nextSource !== undefined) {
      node._nextSource._prevSource = node._prevSource;
      if (node._prevSource !== undefined) {
        node._prevSource._nextSource = node._nextSource;
      }
      node._prevSource = evalContext._sources;
      node._nextSource = undefined;
      evalContext._sources._nextSource = node;
      evalContext._sources = node;
    }
    return node;
  }
  return;
};
var Signal = function(value) {
  this._value = value;
  this._version = 0;
  this._node = undefined;
  this._targets = undefined;
};
var signal = function(value) {
  return new Signal(value);
};
var needsToRecompute = function(target) {
  for (let node = target._sources;node !== undefined; node = node._nextSource) {
    if (node._source._version !== node._version || !node._source._refresh() || node._source._version !== node._version) {
      return true;
    }
  }
  return false;
};
var prepareSources = function(target) {
  for (let node = target._sources;node !== undefined; node = node._nextSource) {
    const rollbackNode = node._source._node;
    if (rollbackNode !== undefined) {
      node._rollbackNode = rollbackNode;
    }
    node._source._node = node;
    node._version = -1;
    if (node._nextSource === undefined) {
      target._sources = node;
      break;
    }
  }
};
var cleanupSources = function(target) {
  let node = target._sources;
  let head = undefined;
  while (node !== undefined) {
    const prev = node._prevSource;
    if (node._version === -1) {
      node._source._unsubscribe(node);
      if (prev !== undefined) {
        prev._nextSource = node._nextSource;
      }
      if (node._nextSource !== undefined) {
        node._nextSource._prevSource = prev;
      }
    } else {
      head = node;
    }
    node._source._node = node._rollbackNode;
    if (node._rollbackNode !== undefined) {
      node._rollbackNode = undefined;
    }
    node = prev;
  }
  target._sources = head;
};
var Computed = function(compute) {
  Signal.call(this, undefined);
  this._compute = compute;
  this._sources = undefined;
  this._globalVersion = globalVersion - 1;
  this._flags = OUTDATED;
};
var cleanupEffect = function(effect) {
  const cleanup = effect._cleanup;
  effect._cleanup = undefined;
  if (typeof cleanup === "function") {
    startBatch();
    const prevContext = evalContext;
    evalContext = undefined;
    try {
      cleanup();
    } catch (err) {
      effect._flags &= ~RUNNING;
      effect._flags |= DISPOSED;
      disposeEffect(effect);
      throw err;
    } finally {
      evalContext = prevContext;
      endBatch();
    }
  }
};
var disposeEffect = function(effect) {
  for (let node = effect._sources;node !== undefined; node = node._nextSource) {
    node._source._unsubscribe(node);
  }
  effect._compute = undefined;
  effect._sources = undefined;
  cleanupEffect(effect);
};
var endEffect = function(prevContext) {
  if (evalContext !== this) {
    throw new Error("Out-of-order effect");
  }
  cleanupSources(this);
  evalContext = prevContext;
  this._flags &= ~RUNNING;
  if (this._flags & DISPOSED) {
    disposeEffect(this);
  }
  endBatch();
};
var Effect = function(compute) {
  this._compute = compute;
  this._cleanup = undefined;
  this._sources = undefined;
  this._nextBatchedEffect = undefined;
  this._flags = TRACKING;
};
var effect = function(compute) {
  const effect2 = new Effect(compute);
  try {
    effect2._callback();
  } catch (err) {
    effect2._dispose();
    throw err;
  }
  return effect2._dispose.bind(effect2);
};
var identifier = Symbol.for("preact-signals");
var RUNNING = 1 << 0;
var NOTIFIED = 1 << 1;
var OUTDATED = 1 << 2;
var DISPOSED = 1 << 3;
var HAS_ERROR = 1 << 4;
var TRACKING = 1 << 5;
var evalContext = undefined;
var batchedEffect = undefined;
var batchDepth = 0;
var batchIteration = 0;
var globalVersion = 0;
Signal.prototype.brand = identifier;
Signal.prototype._refresh = function() {
  return true;
};
Signal.prototype._subscribe = function(node) {
  if (this._targets !== node && node._prevTarget === undefined) {
    node._nextTarget = this._targets;
    if (this._targets !== undefined) {
      this._targets._prevTarget = node;
    }
    this._targets = node;
  }
};
Signal.prototype._unsubscribe = function(node) {
  if (this._targets !== undefined) {
    const prev = node._prevTarget;
    const next = node._nextTarget;
    if (prev !== undefined) {
      prev._nextTarget = next;
      node._prevTarget = undefined;
    }
    if (next !== undefined) {
      next._prevTarget = prev;
      node._nextTarget = undefined;
    }
    if (node === this._targets) {
      this._targets = next;
    }
  }
};
Signal.prototype.subscribe = function(fn) {
  const signal2 = this;
  return effect(function() {
    const value = signal2.value;
    const flag = this._flags & TRACKING;
    this._flags &= ~TRACKING;
    try {
      fn(value);
    } finally {
      this._flags |= flag;
    }
  });
};
Signal.prototype.valueOf = function() {
  return this.value;
};
Signal.prototype.toString = function() {
  return this.value + "";
};
Signal.prototype.toJSON = function() {
  return this.value;
};
Signal.prototype.peek = function() {
  return this._value;
};
Object.defineProperty(Signal.prototype, "value", {
  get() {
    const node = addDependency(this);
    if (node !== undefined) {
      node._version = this._version;
    }
    return this._value;
  },
  set(value) {
    if (evalContext instanceof Computed) {
      mutationDetected();
    }
    if (value !== this._value) {
      if (batchIteration > 100) {
        cycleDetected();
      }
      this._value = value;
      this._version++;
      globalVersion++;
      startBatch();
      try {
        for (let node = this._targets;node !== undefined; node = node._nextTarget) {
          node._target._notify();
        }
      } finally {
        endBatch();
      }
    }
  }
});
Computed.prototype = new Signal;
Computed.prototype._refresh = function() {
  this._flags &= ~NOTIFIED;
  if (this._flags & RUNNING) {
    return false;
  }
  if ((this._flags & (OUTDATED | TRACKING)) === TRACKING) {
    return true;
  }
  this._flags &= ~OUTDATED;
  if (this._globalVersion === globalVersion) {
    return true;
  }
  this._globalVersion = globalVersion;
  this._flags |= RUNNING;
  if (this._version > 0 && !needsToRecompute(this)) {
    this._flags &= ~RUNNING;
    return true;
  }
  const prevContext = evalContext;
  try {
    prepareSources(this);
    evalContext = this;
    const value = this._compute();
    if (this._flags & HAS_ERROR || this._value !== value || this._version === 0) {
      this._value = value;
      this._flags &= ~HAS_ERROR;
      this._version++;
    }
  } catch (err) {
    this._value = err;
    this._flags |= HAS_ERROR;
    this._version++;
  }
  evalContext = prevContext;
  cleanupSources(this);
  this._flags &= ~RUNNING;
  return true;
};
Computed.prototype._subscribe = function(node) {
  if (this._targets === undefined) {
    this._flags |= OUTDATED | TRACKING;
    for (let node2 = this._sources;node2 !== undefined; node2 = node2._nextSource) {
      node2._source._subscribe(node2);
    }
  }
  Signal.prototype._subscribe.call(this, node);
};
Computed.prototype._unsubscribe = function(node) {
  if (this._targets !== undefined) {
    Signal.prototype._unsubscribe.call(this, node);
    if (this._targets === undefined) {
      this._flags &= ~TRACKING;
      for (let node2 = this._sources;node2 !== undefined; node2 = node2._nextSource) {
        node2._source._unsubscribe(node2);
      }
    }
  }
};
Computed.prototype._notify = function() {
  if (!(this._flags & NOTIFIED)) {
    this._flags |= OUTDATED | NOTIFIED;
    for (let node = this._targets;node !== undefined; node = node._nextTarget) {
      node._target._notify();
    }
  }
};
Computed.prototype.peek = function() {
  if (!this._refresh()) {
    cycleDetected();
  }
  if (this._flags & HAS_ERROR) {
    throw this._value;
  }
  return this._value;
};
Object.defineProperty(Computed.prototype, "value", {
  get() {
    if (this._flags & RUNNING) {
      cycleDetected();
    }
    const node = addDependency(this);
    this._refresh();
    if (node !== undefined) {
      node._version = this._version;
    }
    if (this._flags & HAS_ERROR) {
      throw this._value;
    }
    return this._value;
  }
});
Effect.prototype._callback = function() {
  const finish = this._start();
  try {
    if (this._flags & DISPOSED)
      return;
    if (this._compute === undefined)
      return;
    const cleanup = this._compute();
    if (typeof cleanup === "function") {
      this._cleanup = cleanup;
    }
  } finally {
    finish();
  }
};
Effect.prototype._start = function() {
  if (this._flags & RUNNING) {
    cycleDetected();
  }
  this._flags |= RUNNING;
  this._flags &= ~DISPOSED;
  cleanupEffect(this);
  prepareSources(this);
  startBatch();
  const prevContext = evalContext;
  evalContext = this;
  return endEffect.bind(this, prevContext);
};
Effect.prototype._notify = function() {
  if (!(this._flags & NOTIFIED)) {
    this._flags |= NOTIFIED;
    this._nextBatchedEffect = batchedEffect;
    batchedEffect = this;
  }
};
Effect.prototype._dispose = function() {
  this._flags |= DISPOSED;
  if (!(this._flags & RUNNING)) {
    disposeEffect(this);
  }
};

// src/modules/state.ts
var $cwd = signal("/srv/public");
var $currentMachine = signal("amiran");
var $input = signal("");
var $inputAllowed = signal(true);

// src/modules/executables/fs.ts
var folder = function(files) {
  return {
    type: "folder",
    files
  };
};
var file = function(content) {
  return {
    type: "file",
    content
  };
};
var executable = function(fn) {
  return {
    type: "executable",
    fn
  };
};
var executables = function(names) {
  const files = {};
  for (const name of names) {
    files[name] = executable(() => {
      return { error: "Access denied" };
    });
  }
  return folder(files);
};
var normalizePath = function(path) {
  path = path.trim();
  if (path.startsWith("~")) {
    path = "/home/user" + path.substring(1);
  }
  if (path.endsWith("/")) {
    path = path.substring(0, path.length - 1);
  }
  const segments = path.split("/");
  const stack = [];
  for (const segment of segments) {
    if (segment === "..") {
      if (stack.length > 0) {
        stack.pop();
      }
    } else if (segment !== "." && segment !== "") {
      stack.push(segment);
    }
  }
  const leadingSlash = path.startsWith("/") ? "/" : "";
  return leadingSlash + stack.join("/");
};
var getAbsolutePath = function(inputPath) {
  const path = inputPath.startsWith("/") ? inputPath : $cwd.value + "/" + inputPath;
  const normalizedPath = normalizePath(path);
  return normalizedPath;
};
var getByPath = function(inputPath) {
  const path = getAbsolutePath(inputPath);
  let current = network[$currentMachine.value].root;
  if (path === "/") {
    return current;
  }
  const folders = path.split("/").slice(1);
  for (const folder2 of folders) {
    if (!current.files[folder2]) {
      return null;
    }
    current = current.files[folder2];
  }
  return current;
};
var cd = function(inputPath) {
  const target = getByPath(inputPath);
  if (!target) {
    return { error: "no such file or directory: " + inputPath };
  }
  if (target.type !== "folder") {
    return { error: "not a directory: " + inputPath };
  }
  $cwd.value = getAbsolutePath(inputPath);
  return { success: true };
};
function getAutocompleteSuggestion(input) {
  const currentFolder = getByPath($cwd.value);
  if (!currentFolder) {
    return null;
  }
  const files = Object.keys(currentFolder.files).sort();
  const suggestion = files.find((name) => name.startsWith(input));
  if (!suggestion) {
    return null;
  }
  return suggestion.substring(input.length);
}
var templateFiles = {
  bin: executables([
    "cat",
    "chmod",
    "cd",
    "cp",
    "date",
    "echo",
    "ftp",
    "grep",
    "head",
    "ls",
    "lpr",
    "more",
    "mkdir",
    "mv",
    "ncftp",
    "print",
    "pwd",
    "rm",
    "rmdir",
    "rsh",
    "setenv",
    "sort",
    "tail",
    "tar",
    "telnet",
    "wc"
  ].toSorted()),
  etc: folder({
    hosts: file("")
  }),
  tmp: folder({}),
  var: folder({}),
  usr: folder({
    local: folder({
      bin: executables([
        "git",
        "node",
        "npm",
        "yarn",
        "email",
        "calendar",
        "calculator",
        "clock",
        "weather",
        "news",
        "music",
        "video",
        "image"
      ].toSorted())
    }),
    bin: executables([
      "vim",
      "nano",
      "emacs",
      "code",
      "subl"
    ])
  })
};
var amiranMachine = folder({
  ...templateFiles,
  home: folder({
    amiran: folder({
      "notes.txt": file("Hello world")
    })
  }),
  srv: folder({
    public: folder({
      "index.html": file("<h1>Hello world</h1>"),
      pages: folder({
        "projects.html": file("<h1>Projects</h1>"),
        "cv.html": file("<h1>CV</h1>")
      }),
      posts: folder({
        "uvicorn vs gunicorn.html": file("<h1>Hello world</h1>"),
        "signal based entity system.html": file("<h1>Hello world</h1>"),
        "the power of useSelector.html": file("<h1>Hello world</h1>"),
        "defeating procrastination - an essay.html": file("<h1>Hello world</h1>")
      })
    })
  })
});
var jamieMachine = folder({
  ...amiranMachine,
  home: folder({
    jamie: folder({
      "notes.txt": file("Hello world from Jamie!")
    })
  })
});
var mariaMarchine = folder({
  ...amiranMachine,
  home: folder({
    jamie: folder({
      "notes.txt": file("Hello world from Jamie!")
    })
  })
});
var network = {
  amiran: { root: amiranMachine, password: null },
  jamie: { root: jamieMachine, password: "ayylmao" },
  maria: { root: mariaMarchine, password: "ayylmao" }
};
var fs_default = {
  cwd: {
    description: "Print the current working directory",
    exec: ({ print }) => {
      print($cwd.value);
    }
  },
  ls: {
    description: "List files and directories",
    exec: ({ print }) => {
      const current = getByPath($cwd.value);
      if (!current) {
        print("Current folder does not exist.");
        return;
      }
      if (current.type !== "folder") {
        print("Path is not a folder");
        return;
      }
      print(".\n..");
      Object.keys(current.files).forEach((name) => {
        if (current.files[name].type === "folder") {
          print(name + "/");
        } else {
          print(name);
        }
      });
    }
  },
  cd: {
    description: "Change directory",
    exec: ({ print, params }) => {
      const path = params[0];
      if (!path) {
        print("cd: path missing");
        return;
      }
      const result = cd(path);
      if (result.error) {
        print("cd: " + result.error);
      }
    }
  },
  cat: {
    description: "Print file contents",
    exec: ({ print, params }) => {
      const path = params[0];
      if (!path) {
        print("cat: path missing");
        return;
      }
      const target = getByPath(path);
      if (!target) {
        print("cat: " + path + ": No such file or directory");
        return;
      }
      if (target.type !== "file") {
        print("cat: " + path + ": Is a directory");
        return;
      }
      print(target.content);
    }
  },
  telnet: {
    description: "Connect to a remote machine",
    exec: ({ print, params }) => {
      const machine = params[0];
      if (!machine) {
        print("telnet: machine missing");
        return;
      }
      if (!network[machine]) {
        print("telnet: machine not found");
        return;
      }
      $currentMachine.value = machine;
      print(`Connected to "${machine}". Type "quit" to disconnect.`);
      $cwd.value = "/";
    }
  },
  quit: {
    description: "Disconnect from the current machine",
    exec: ({ print }) => {
      if ($currentMachine.value === "amiran") {
        print("You cannot disconnect from the local machine");
        return;
      }
      print(`Disconnected from remote host "${$currentMachine.value}"`);
      $currentMachine.value = "amiran";
    }
  },
  nmap: {
    description: "List all machines on the network",
    exec: ({ print }) => {
      print(Object.entries(network).map(([name, { password }]) => {
        return name + (password ? " (password protected)" : "");
      }).join("\n"));
    }
  }
};

// src/modules/executables/email.ts
var trim = function(str) {
  return str.trim().split("\n").map((line) => line.trim()).join("\n");
};
var padLinesLeft = function(str, pad) {
  return str.split("\n").map((line) => pad + line).join("\n");
};
var leftPad = function(str, len) {
  return str + " ".repeat(Math.max(len - str.length, 0));
};
var emails = [
  {
    id: 1,
    from: "InfoSec <infosec@talesprout.com>",
    time: "2020-01-01 12:14:23",
    subject: "Password Reset",
    body: `
            Hey Amiran!

            This is Maria from InfoSec. We've recently noticed some suspicious
            activity on your account. We've reset your password to prevent any
            unauthorized access.
            
            The new password is: ayylmao123
            Please change it as soon as possible.

            I also noticed that you haven't added a password to your machine.
            Please add a password to your machine to prevent unauthorized access
            to your files.

            Thanks,
            Maria (InfoSec @ Talesprout.com)
        `,
    response: `
            Hey Maria!

            Thanks for the heads up. I'll change my password right away.

            Amiran (CEO, Talesprout.com)
        `
  },
  {
    id: 2,
    from: "Jane Doe",
    time: "2020-01-02 13:34:12",
    subject: "Hi",
    body: "Hi World"
  }
];
var email = {
  description: "Check your email",
  commands: {
    list: {
      description: "List emails",
      exec: ({ print }) => {
        const fieldMaxLengths = emails.reduce((acc, email2) => {
          const { id, from, subject } = email2;
          return {
            id: Math.max(acc.id, id.toString().length),
            from: Math.max(acc.from, from.length),
            subject: Math.max(acc.subject, subject.length)
          };
        }, { id: 0, from: 0, subject: 0 });
        const maxLengths = {
          id: Math.max(fieldMaxLengths.id, "ID".length),
          from: Math.max(fieldMaxLengths.from, "FROM".length),
          subject: Math.max(fieldMaxLengths.subject, "SUBJECT".length)
        };
        print(`${leftPad("ID", maxLengths.id)}  ${leftPad("FROM", maxLengths.from)}  SUBJECT`);
        print(`${leftPad("-".repeat(maxLengths.id), maxLengths.id)}  ${leftPad("-".repeat(maxLengths.from), maxLengths.from)}  ${"-".repeat(maxLengths.subject)}`);
        emails.forEach((email2) => {
          const { id, from, subject } = email2;
          print(`${leftPad(id, maxLengths.id)}   ${leftPad(from, maxLengths.from)}  ${subject}`);
        });
      }
    },
    show: {
      description: "Read an email",
      exec: ({ print, params }) => {
        const id = params[0];
        const email2 = emails.find((email3) => email3.id === Number(id));
        if (!email2) {
          print(`Email with ID ${id} not found`);
          return;
        }
        print(`From: ${email2.from}`);
        print(`Date: ${email2.time}`);
        print(`Subject: ${email2.subject}`);
        print(`\n${padLinesLeft(trim(email2.body), "")}`);
        if (email2.response) {
          print("");
          print(`${padLinesLeft(trim(email2.response), "> ")}`);
        }
      }
    }
  },
  exec: ({ print, params }) => {
    const subcommand = params[0];
    if (!subcommand || subcommand === "help") {
      print("Welcome to the inbox!");
      print("Available commands:\n");
      Object.entries(email.commands).forEach(([command2, { description }]) => {
        print(`    ${command2} - ${description}`);
      });
      return;
    }
    const command = email.commands[subcommand];
    if (!command) {
      print(`Command "${subcommand}" not found`);
      return;
    }
    command.exec({ print, params: params.slice(1) });
  }
};
var email_default = { email };

// src/modules/executables/koobas-cmd.ts
var koobas = {
  description: "A dungeon crawler game",
  exec: async (...args) => {
    const koobas2 = await Promise.resolve().then(() => (init_koobas(), exports_koobas));
    return await koobas2.main(...args);
  }
};
var koobas_cmd_default = { koobas };

// src/modules/terminal.ts
var isCommandName = function(name) {
  return name in commands;
};
var outputEl = document.getElementById("output");
var promptEl = document.getElementById("prompt");
var terminalEl = document.getElementById("terminal");
var cmdEl = document.getElementById("cmd");
var pathEl = document.getElementById("path");
var cliHistory = [];
var historyIndex = 0;
var safeText = (text) => {
  if (typeof text !== "string") {
    try {
      text = JSON.stringify(text);
    } catch (e) {
      text = String(text);
    }
  }
  text = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return text.split("\n").map((line) => line.slice(0, 80)).join("\n");
};
var print = (text) => {
  outputEl.innerHTML += safeText(text) + "\n";
  outputEl.scrollTop = outputEl.scrollHeight;
};
var dangerouslyPrintHTML = (html, { replace = false } = {}) => {
  if (replace) {
    outputEl.innerHTML = html;
  } else {
    outputEl.innerHTML += html;
  }
  setTimeout(() => {
    outputEl.scrollTop = outputEl.scrollHeight;
  }, 100);
};
var lastLines = [];
var optimisedDangerousLinePrint = (lines = []) => {
  lines.forEach((line, index) => {
    if (lastLines[index] === line) {
      return;
    }
    const maybeLineEl = outputEl.querySelector(`#line-${index}`);
    if (maybeLineEl) {
      maybeLineEl.innerHTML = line;
    } else {
      outputEl.innerHTML += `<div id="line-${index}">${line}</div>`;
    }
    lastLines[index] = line;
  });
};
var shake = () => {
  terminalEl.classList.add("shake");
  setTimeout(() => {
    terminalEl.classList.remove("shake");
  }, 100);
};
var clear = () => outputEl.textContent = "";
var commands = {
  help: {
    description: "List all available commands",
    exec: ({ print: print2 }) => {
      Object.keys(commands).filter(isCommandName).forEach((command) => {
        const description = commands[command].description;
        print2(`${command} - ${description}`);
      });
    }
  },
  clear: {
    description: "Clear the terminal screen",
    exec: clear
  },
  history: {
    description: "List all commands executed in this session",
    exec: ({ print: print2 }) => {
      cliHistory.forEach((command) => {
        print2(command);
      });
    }
  },
  ...fs_default,
  ...email_default,
  ...koobas_cmd_default
};
var exec = async (inputString) => {
  const args = inputString.trim().split(" ");
  const name = args[0];
  const params = args.slice(1).filter((p) => p !== "");
  if (isCommandName(name)) {
    const style = cmdEl.style.display;
    cmdEl.style.display = "none";
    $inputAllowed.value = false;
    try {
      await commands[name].exec({
        print,
        clear,
        dangerouslyPrintHTML,
        optimisedDangerousLinePrint,
        params,
        terminalEl,
        shake
      });
    } catch (e) {
      console.error(e);
      if (typeof e === "object" && e !== null && ("message" in e)) {
        print(`Process exited with error: ${e.message}`);
      }
    }
    $inputAllowed.value = true;
    cmdEl.style.display = style;
  } else {
    print(`Command not found: ${name}`);
    print(`Type 'help' to list all available commands`);
  }
};
terminalEl.addEventListener("keydown", async (e) => {
  if (!$inputAllowed.value) {
    return;
  }
  const inputValue = $input.value;
  if (e.keyCode === 13) {
    if (inputValue.trim() === "") {
      return;
    }
    print(`${pathEl.textContent} ${inputValue}`);
    cliHistory.push(inputValue);
    await exec(inputValue);
    $input.value = "";
  } else if (e.keyCode === 8) {
    $input.value = inputValue.slice(0, -1);
  } else if (e.key.length === 1) {
    $input.value += e.key;
  } else if (e.keyCode === 32) {
    $input.value += " ";
  } else if (e.keyCode === 38) {
    historyIndex = Math.min(cliHistory.length, historyIndex + 1);
    $input.value = cliHistory[cliHistory.length - historyIndex] || "";
  } else if (e.keyCode === 40) {
    historyIndex = Math.max(0, historyIndex - 1);
    $input.value = cliHistory[cliHistory.length - historyIndex] || "";
  } else if (e.keyCode === 9) {
    const inputPart = inputValue.split(" ").pop();
    e.preventDefault();
    const suggestion = getAutocompleteSuggestion(inputPart);
    if (suggestion) {
      $input.value += suggestion;
    }
  }
});
effect(() => {
  pathEl.textContent = `amiran@${$currentMachine.value}:${$cwd.value} \$`;
});
effect(() => {
  promptEl.textContent = $input.value;
});
