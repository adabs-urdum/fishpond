import * as PIXI from "pixi.js";

class Fish {
  constructor(setup) {
    this.setup = setup;
    this.setup.debugLog("new Fish");
    const fish = new PIXI.Container();
    this.fish = fish;
    this.fish.scale.set(0.15);
    this.distance = 5;
    this.relDistance = 5;
    const levels = {
      1: {
        relXp: 4,
        maxSpeeds: {
          x: 4,
          y: 4
        }
      },
      2: {
        relXp: 6,
        maxSpeeds: {
          x: 6,
          y: 6
        }
      },
      3: {
        relXp: 8,
        maxSpeeds: {
          x: 8,
          y: 8
        }
      },
      4: {
        relXp: 10,
        maxSpeeds: {
          x: 10,
          y: 10
        }
      }
    };
    this.stats = {
      // ignore first because key zero
      level: 1,
      levels: levels,
      xp: 0,
      attack: 5,
      health: 20,
      maxHealth: 20
    };

    this.setCurrentXp();

    fish.direction = {
      x: 1,
      y: 1
    };

    const currentLevel = this.stats.levels[this.stats.level];

    fish.speeds = {
      x: 0,
      y: 0
    };
    fish.speedsRel = {
      x: 0,
      y: 0
    };

    const bodyTexture = this.setup.loader.resources[
      "fishMainBody"
    ].texture.clone();
    const body = new PIXI.Sprite(bodyTexture);
    body.anchor.x = 0.5;
    body.anchor.y = 0.5;
    fish.addChildAt(body, 0);

    const jaw = this.addFishMainJaw();
    fish.addChildAt(jaw, 1);

    const caudal = this.addCaudal();
    this.caudal = caudal;
    fish.addChildAt(caudal, 2);
    setup.bringToFront(caudal);

    this.addDorsal();
    fish.addChildAt(this.dorsal, 0);

    this.addPelvic();
    fish.addChildAt(this.pelvic, 2);

    this.addAfter();
    fish.addChildAt(this.after, 0);

    this.setBodyPartPositions();

    fish.x = window.innerWidth / 2;
    fish.y = window.innerHeight / 2;

    fish.interactive = true;

    if (setup.debug) {
      // fish.click = this.levelUp;
    }

    this.setup.stage.addChildAt(fish, 0);

    this.bindEvents();
  }

  getPastLevelsXp = () => {
    let pastLevelsXp = 0;
    const pastLevels = Object.keys(this.stats.levels)
      .slice(0, this.stats.level - 1)
      .forEach(levelKey => {
        const currentLevel = this.stats.levels[levelKey];
        pastLevelsXp += currentLevel.relXp;
      });
    return pastLevelsXp;
  };

  setCurrentXp = () => {
    this.stats.xp = this.getPastLevelsXp();
  };

  bindEvents = () => {
    window.addEventListener("mousemove", this.setFishSpeed);
    window.addEventListener("mousemove", this.setFishAngle);
  };

  levelUp = () => {
    this.stats.level += 1;

    const caudalTextures = this.caudalTextures[this.stats.level - 1];
    this.caudal.texture = caudalTextures[0];
    this.caudal.textures = caudalTextures;
    this.caudal.play();

    const pelvicTextures = this.pelvicTextures[this.stats.level - 1];
    this.pelvic.texture = pelvicTextures[0];
    this.pelvic.textures = pelvicTextures;
    this.pelvic.play();

    const jawTextures = this.jawTextures[this.stats.level - 1];
    this.jaw.texture = jawTextures[0];
    this.jaw.textures = jawTextures;

    this.setBodyPartPositions();

    this.fish.scale.x *= 1.05;
    this.fish.scale.y *= 1.05;

    this.setup.debugLog("LEVEL UP");
  };

  setBodyPartPositions = () => {
    if (this.stats.level == 1) {
      this.jaw.position.x = -50;
      this.jaw.position.y = -20;
      this.after.position.x = -320;
      this.after.position.y = 50;
      this.dorsal.position.x = -240;
      this.dorsal.position.y = -240;
      this.caudal.position.x = -320;
      this.caudal.position.y = -12;
      this.pelvic.position.x = 0;
      this.pelvic.position.y = 160;
    } else if (this.stats.level == 2) {
      this.jaw.position.x = -85;
      this.jaw.position.y = -20;
      this.after.position.x = -320;
      this.after.position.y = 57;
      this.dorsal.position.x = -240;
      this.dorsal.position.y = -250;
      this.caudal.position.x = -320;
      this.caudal.position.y = 0;
      this.pelvic.position.x = 0;
      this.pelvic.position.y = 130;
    } else if (this.stats.level == 3) {
      this.jaw.position.x = -80;
      this.jaw.position.y = 15;
      this.after.position.x = -320;
      this.after.position.y = 65;
      this.dorsal.position.x = -240;
      this.dorsal.position.y = -265;
      this.caudal.position.x = -320;
      this.caudal.position.y = 0;
      this.pelvic.position.x = 0;
      this.pelvic.position.y = 130;
    } else if (this.stats.level == 4) {
      this.jaw.position.x = -90;
      this.jaw.position.y = 15;
      this.after.position.x = -320;
      this.after.position.y = 75;
      this.dorsal.position.x = -240;
      this.dorsal.position.y = -280;
      this.caudal.position.x = -320;
      this.caudal.position.y = -10;
      this.pelvic.position.x = 0;
      this.pelvic.position.y = 120;
    }
  };

  setFishAngle = e => {
    const p1 = this.fish;
    const p2 = {
      x: e.clientX,
      y: e.clientY
    };
    const angleDeg = this.setup.getAngleBetweenPoints(p1, p2);
    this.fish.angle = angleDeg;

    this.fish.direction = {
      x: angleDeg > 90 || angleDeg < -90 ? -1 : 1,
      y: angleDeg > 0 ? 1 : -1
    };

    if (angleDeg > 90 && angleDeg < 180) {
      this.fish.scale.y = Math.abs(this.fish.scale.y) * -1;
    } else if (angleDeg < 90 && angleDeg > 0) {
      if (this.fish.scale.y < 0) {
        this.fish.scale.y *= -1;
      }
    } else if (angleDeg > -90 && angleDeg < 0) {
      if (this.fish.scale.y < 0) {
        this.fish.scale.y *= -1;
      }
    } else {
      this.fish.scale.y = Math.abs(this.fish.scale.y) * -1;
    }
    if (angleDeg > 0 && angleDeg < 90) {
    }
  };

  setFishSpeed = e => {
    const p1 = { x: this.fish.x, y: this.fish.y };
    const p2 = { x: e.clientX, y: e.clientY };
    this.distance = this.setup.getDistanceBetweenPoints(p1, p2);
    this.relDistance = (100 / (this.setup.vmin * 50)) * this.distance;
    this.relDistance = this.relDistance > 100 ? 100 : this.relDistance;

    this.fish.speeds.x =
      (100 / (this.setup.vmin * 50)) *
      Math.abs(Math.abs(p2.x) - Math.abs(p1.x));
    this.fish.speeds.y =
      (100 / (this.setup.vmin * 50)) *
      Math.abs(Math.abs(p2.y) - Math.abs(p1.y));

    this.fish.speedsRel = {
      x:
        (this.stats.levels[this.stats.level].maxSpeeds.x / 100) *
        this.fish.speeds.x,
      y:
        (this.stats.levels[this.stats.level].maxSpeeds.y / 100) *
        this.fish.speeds.y
    };
  };

  addAfter = () => {
    const afterTexture = this.setup.loader.resources[
      "fishMainAfterFin"
    ].texture.clone();
    const after = new PIXI.Sprite(afterTexture);
    after.anchor.x = 0;
    after.anchor.y = 0;
    this.after = after;
    return after;
  };

  addDorsal = () => {
    const dorsalTexture = this.setup.loader.resources[
      "fishMainDorsalFin"
    ].texture.clone();
    const dorsal = new PIXI.Sprite(dorsalTexture);
    dorsal.anchor.x = 0;
    dorsal.anchor.y = 0;
    this.dorsal = dorsal;
  };

  addPelvic = () => {
    // load small animation
    const pelvicSmallFrames = [];
    const pelvicSmallTexture = this.setup.loader.resources["mainPelvicSmall"]
      .texture;

    for (let i = 0; i < 8; i++) {
      pelvicSmallFrames.push(new PIXI.Rectangle(53 * i, 0, 53, 61));
    }

    pelvicSmallTexture.frame = pelvicSmallFrames[0];
    const pelvicSmall = new PIXI.Sprite(pelvicSmallTexture);

    let i;
    const pelvicSmallTextures = [];
    for (i = 0; i < pelvicSmallFrames.length; i++) {
      const texture = pelvicSmallTexture.clone();
      texture.frame = pelvicSmallFrames[i];
      pelvicSmallTextures.push(texture);
    }

    // load medium small animation
    const pelvicMediumSmallFrames = [];
    const pelvicMediumSmallTexture = this.setup.loader.resources[
      "mainPelvicMediumSmall"
    ].texture;

    for (let i = 0; i < 8; i++) {
      pelvicMediumSmallFrames.push(new PIXI.Rectangle(83 * i, 0, 83, 95));
    }

    pelvicMediumSmallTexture.frame = pelvicMediumSmallFrames[0];
    const pelvicMediumSmall = new PIXI.Sprite(pelvicMediumSmallTexture);

    const pelvicMediumSmallTextures = [];
    for (i = 0; i < pelvicMediumSmallFrames.length; i++) {
      const texture = pelvicMediumSmallTexture.clone();
      texture.frame = pelvicMediumSmallFrames[i];
      pelvicMediumSmallTextures.push(texture);
    }

    // load medium large animation
    const pelvicMediumLargeFrames = [];
    const pelvicMediumLargeTexture = this.setup.loader.resources[
      "mainPelvicMediumLarge"
    ].texture;

    for (let i = 0; i < 8; i++) {
      pelvicMediumLargeFrames.push(new PIXI.Rectangle(125 * i, 0, 125, 143));
    }

    pelvicMediumLargeTexture.frame = pelvicMediumLargeFrames[0];
    const pelvicMediumLarge = new PIXI.Sprite(pelvicMediumLargeTexture);

    const pelvicMediumLargeTextures = [];
    for (i = 0; i < pelvicMediumLargeFrames.length; i++) {
      const texture = pelvicMediumLargeTexture.clone();
      texture.frame = pelvicMediumLargeFrames[i];
      pelvicMediumLargeTextures.push(texture);
    }

    // load large animation
    const pelvicLargeFrames = [];
    const pelvicLargeTexture = this.setup.loader.resources["mainPelvicLarge"]
      .texture;
    for (let i = 0; i < 8; i++) {
      pelvicLargeFrames.push(new PIXI.Rectangle(157 * i, 0, 157, 180));
    }
    pelvicLargeTexture.frame = pelvicLargeFrames[0];
    const pelvicLarge = new PIXI.Sprite(pelvicLargeTexture);

    const pelvicLargeTextures = [];
    for (i = 0; i < pelvicLargeFrames.length; i++) {
      const texture = pelvicLargeTexture.clone();
      texture.frame = pelvicLargeFrames[i];
      pelvicLargeTextures.push(texture);
    }

    this.pelvicTextures = [
      pelvicSmallTextures,
      pelvicMediumSmallTextures,
      pelvicMediumLargeTextures,
      pelvicLargeTextures
    ];

    const pelvic = new PIXI.AnimatedSprite(
      this.pelvicTextures[this.stats.level - 1]
    );
    pelvic.anchor.set(1, 0);
    pelvic.animationSpeed = 1;
    pelvic.first = true;
    pelvic.play();
    this.pelvic = pelvic;
  };

  addCaudal = () => {
    // load small animation
    const caudalSmallFrames = [];
    const caudalSmallTexture = this.setup.loader.resources["mainCaudalSmall"]
      .texture;

    for (let i = 0; i < 16; i++) {
      caudalSmallFrames.push(new PIXI.Rectangle(82 * i, 0, 82, 187));
    }

    caudalSmallTexture.frame = caudalSmallFrames[0];
    const caudalSmall = new PIXI.Sprite(caudalSmallTexture);

    let i;
    const caudalSmallTextures = [];
    for (i = 0; i < caudalSmallFrames.length; i++) {
      const texture = caudalSmallTexture.clone();
      texture.frame = caudalSmallFrames[i];
      caudalSmallTextures.push(texture);
    }

    // load medium small animation
    const caudalMediumSmallFrames = [];
    const caudalMediumSmallTexture = this.setup.loader.resources[
      "mainCaudalMediumSmall"
    ].texture;

    for (let i = 0; i < 16; i++) {
      caudalMediumSmallFrames.push(new PIXI.Rectangle(162 * i, 0, 162, 249));
    }

    caudalMediumSmallTexture.frame = caudalMediumSmallFrames[0];
    const caudalMediumSmall = new PIXI.Sprite(caudalMediumSmallTexture);

    const caudalMediumSmallTextures = [];
    for (i = 0; i < caudalMediumSmallFrames.length; i++) {
      const texture = caudalMediumSmallTexture.clone();
      texture.frame = caudalMediumSmallFrames[i];
      caudalMediumSmallTextures.push(texture);
    }

    // load medium large animation
    const caudalMediumLargeFrames = [];
    const caudalMediumLargeTexture = this.setup.loader.resources[
      "mainCaudalMediumLarge"
    ].texture;

    for (let i = 0; i < 16; i++) {
      caudalMediumLargeFrames.push(new PIXI.Rectangle(188 * i, 0, 188, 337));
    }

    caudalMediumLargeTexture.frame = caudalMediumLargeFrames[0];
    const caudalMediumLarge = new PIXI.Sprite(caudalMediumLargeTexture);

    const caudalMediumLargeTextures = [];
    for (i = 0; i < caudalMediumLargeFrames.length; i++) {
      const texture = caudalMediumLargeTexture.clone();
      texture.frame = caudalMediumLargeFrames[i];
      caudalMediumLargeTextures.push(texture);
    }

    // load large animation
    const caudalLargeFrames = [];
    const caudalLargeTexture = this.setup.loader.resources["mainCaudalLarge"]
      .texture;
    for (let i = 0; i < 16; i++) {
      caudalLargeFrames.push(new PIXI.Rectangle(230 * i, 0, 230, 417));
    }
    caudalLargeTexture.frame = caudalLargeFrames[0];
    const caudalLarge = new PIXI.Sprite(caudalLargeTexture);

    const caudalLargeTextures = [];
    for (i = 0; i < caudalLargeFrames.length; i++) {
      const texture = caudalLargeTexture.clone();
      texture.frame = caudalLargeFrames[i];
      caudalLargeTextures.push(texture);
    }

    this.caudalTextures = [
      caudalSmallTextures,
      caudalMediumSmallTextures,
      caudalMediumLargeTextures,
      caudalLargeTextures
    ];

    const caudal = new PIXI.AnimatedSprite(
      this.caudalTextures[this.stats.level - 1]
    );
    caudal.anchor.set(1, 0.5);
    caudal.animationSpeed = 1;
    caudal.first = true;
    caudal.play();
    this.caudal = caudal;

    return caudal;
  };

  addFishMainJaw = () => {
    // load small jaw animation
    const jawSmallFrames = [];
    const jawSmallTexture = this.setup.loader.resources["mainJawSmall"].texture;
    for (let i = 0; i < 5; i++) {
      jawSmallFrames.push(new PIXI.Rectangle(250 * i, 0, 250, 240));
    }
    jawSmallTexture.frame = jawSmallFrames[0];
    const jawSmall = new PIXI.Sprite(jawSmallTexture);
    let i;
    const jawSmallTextures = [];
    for (i = 0; i < jawSmallFrames.length; i++) {
      const texture = jawSmallTexture.clone();
      texture.frame = jawSmallFrames[i];
      jawSmallTextures.push(texture);
    }

    // load medium small jaw animation
    const jawMediumSmallFrames = [];
    const jawMediumSmallTexture = this.setup.loader.resources[
      "mainJawMediumSmall"
    ].texture;
    for (let i = 0; i < 5; i++) {
      jawMediumSmallFrames.push(new PIXI.Rectangle(329 * i, 0, 329, 268));
    }
    jawMediumSmallTexture.frame = jawMediumSmallFrames[0];
    const jawMediumSmall = new PIXI.Sprite(jawMediumSmallTexture);
    const jawMediumSmallTextures = [];
    for (i = 0; i < jawMediumSmallFrames.length; i++) {
      const texture = jawMediumSmallTexture.clone();
      texture.frame = jawMediumSmallFrames[i];
      jawMediumSmallTextures.push(texture);
    }

    // load medium large jaw animation
    const jawMediumLargeFrames = [];
    const jawMediumLargeTexture = this.setup.loader.resources[
      "mainJawMediumLarge"
    ].texture;
    for (let i = 0; i < 5; i++) {
      jawMediumLargeFrames.push(new PIXI.Rectangle(368 * i, 0, 368, 259));
    }
    jawMediumLargeTexture.frame = jawMediumLargeFrames[0];
    const jawMediumLarge = new PIXI.Sprite(jawMediumLargeTexture);
    const jawMediumLargeTextures = [];
    for (i = 0; i < jawMediumLargeFrames.length; i++) {
      const texture = jawMediumLargeTexture.clone();
      texture.frame = jawMediumLargeFrames[i];
      jawMediumLargeTextures.push(texture);
    }

    // load large jaw animation
    const jawLargeFrames = [];
    const jawLargeTexture = this.setup.loader.resources["mainJawLarge"].texture;
    for (let i = 0; i < 5; i++) {
      jawLargeFrames.push(new PIXI.Rectangle(477 * i, 0, 477, 310));
    }
    jawLargeTexture.frame = jawLargeFrames[0];
    const jawLarge = new PIXI.Sprite(jawLargeTexture);
    const jawLargeTextures = [];
    for (i = 0; i < jawLargeFrames.length; i++) {
      const texture = jawLargeTexture.clone();
      texture.frame = jawLargeFrames[i];
      jawLargeTextures.push(texture);
    }

    this.jawTextures = [
      jawSmallTextures,
      jawMediumSmallTextures,
      jawMediumLargeTextures,
      jawLargeTextures
    ];

    const jaw = new PIXI.AnimatedSprite(this.jawTextures[this.stats.level - 1]);
    jaw.animationSpeed = 1;
    jaw.first = true;
    jaw.onFrameChange = () => {
      if (!jaw.first) {
        if (this.jaw.totalFrames % this.jaw.currentFrame == 0) {
          this.jaw.texture.frame = this.jaw.textures[0].frame;
          this.jaw.stop();
        }
      }
      jaw.first = false;
    };
    this.jaw = jaw;
    return jaw;
  };

  render = () => {
    if (this.relDistance > 10) {
      this.caudal.play();
      this.caudal.animationSpeed = 0.01 * this.relDistance;
    } else {
      this.caudal.stop();
    }
    this.pelvic.play();
    this.pelvic.animationSpeed = 0.015 * this.relDistance;
    if (this.relDistance < 3) {
      this.pelvic.stop();
    }

    const pastLevelsXp = this.getPastLevelsXp();
    const currentLevel = this.stats.levels[this.stats.level];
    if (this.stats.level < Object.keys(this.stats.levels).length) {
      if (this.stats.xp >= currentLevel.relXp + pastLevelsXp) {
        this.levelUp();
      }
    }
  };
}

export default Fish;
