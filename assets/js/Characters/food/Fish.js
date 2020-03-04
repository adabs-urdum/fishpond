import * as PIXI from "pixi.js";
import Target from "../Target.js";

class Fish extends Target {
  constructor(setup) {
    super(setup);
    this.setup = setup;
    this.setup.debugLog("new Fish");
    const fish = new PIXI.Container();
    this.fish = fish;
    this.pixiObj = fish;
    this.fish.scale.set(0.12);
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

    this.stats.level = 1;
    this.stats.levels = levels;
    this.stats.xp = 0;
    this.stats.attack = 5;
    this.stats.health = 20;
    this.stats.maxHealth = 20;
    this.stats.loot.xp = 100;

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

    const body = this.addBody();
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

    this.setup.foodContainer.addChildAt(fish, 0);

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
    // window.addEventListener("mousemove", this.setFishSpeed);
    // window.addEventListener("mousemove", this.setFishAngle);
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
    this.jaw.position.x = 0;
    this.jaw.position.y = 40;
    this.after.position.x = -320;
    this.after.position.y = 90;
    this.dorsal.position.x = -200;
    this.dorsal.position.y = -200;
    this.caudal.position.x = -325;
    this.caudal.position.y = 24;
    this.pelvic.position.x = 10;
    this.pelvic.position.y = 50;
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

  addBody = () => {
    const bodyTexture = this.setup.loader.resources[
      "fishTargetBody"
    ].texture.clone();
    const body = new PIXI.Sprite(bodyTexture);
    body.anchor.x = 0.5;
    body.anchor.y = 0.5;
    body.tint = this.tint;
    this.body = body;

    const bodyFrames = [];
    for (let i = 0; i < 8; i++) {
      bodyFrames.push(new PIXI.Rectangle(0, 309 * i, 703, 309));
    }
    this.bodyFrames = bodyFrames;
    bodyTexture.frame = bodyFrames[0];

    return body;
  };

  addAfter = () => {
    const afterTexture = this.setup.loader.resources[
      "fishTargetAfter"
    ].texture.clone();
    const after = new PIXI.Sprite(afterTexture);
    after.anchor.x = 0;
    after.anchor.y = 0;
    after.tint = this.tint;
    this.after = after;
    return after;
  };

  addDorsal = () => {
    const dorsalTexture = this.setup.loader.resources[
      "fishTargetDorsal"
    ].texture.clone();
    const dorsal = new PIXI.Sprite(dorsalTexture);
    dorsal.anchor.x = 0;
    dorsal.anchor.y = 0;
    dorsal.tint = this.tint;
    this.dorsal = dorsal;
  };

  addPelvic = () => {
    // load small animation
    const pelvicFrames = [];
    const pelvicTexture = this.setup.loader.resources["fishTargetPelvic"]
      .texture;

    for (let i = 0; i < 8; i++) {
      pelvicFrames.push(new PIXI.Rectangle(113 * i, 0, 113, 129));
    }

    pelvicTexture.frame = pelvicFrames[0];

    const caudalTextures = [];
    for (let i = 0; i < pelvicFrames.length; i++) {
      const texture = pelvicTexture.clone();
      texture.frame = pelvicFrames[i];
      caudalTextures.push(texture);
    }

    const pelvic = new PIXI.AnimatedSprite(caudalTextures);
    pelvic.anchor.set(1, 0);
    pelvic.animationSpeed = 1;
    pelvic.first = true;
    pelvic.play();
    pelvic.tint = this.tint;
    this.pelvic = pelvic;
  };

  addCaudal = () => {
    const caudalFrames = [];
    const caudalTexture = this.setup.loader.resources["fishTargetCaudal"]
      .texture;

    for (let i = 0; i < 8; i++) {
      caudalFrames.push(new PIXI.Rectangle(113 * i, 0, 113, 279.5));
    }
    caudalTexture.frame = caudalFrames[0];

    const caudalTextures = [];
    for (let i = 0; i < caudalFrames.length; i++) {
      const texture = caudalTexture.clone();
      texture.frame = caudalFrames[i];
      caudalTextures.push(texture);
    }

    const caudal = new PIXI.AnimatedSprite(caudalTextures);
    caudal.anchor.set(1, 0.5);
    caudal.animationSpeed = 1;
    caudal.first = true;
    caudal.play();
    caudal.tint = this.tint;
    this.caudal = caudal;

    return caudal;
  };

  addFishMainJaw = () => {
    // load small jaw animation
    const jawFrames = [];
    const jawTexture = this.setup.loader.resources["fishTargetJaw"].texture;
    for (let i = 0; i < 5; i++) {
      jawFrames.push(new PIXI.Rectangle(351 * i, 0, 351, 220));
    }
    jawTexture.frame = jawFrames[0];
    const jawTextures = [];
    for (let i = 0; i < jawFrames.length; i++) {
      const texture = jawTexture.clone();
      texture.frame = jawFrames[i];
      jawTextures.push(texture);
    }

    const jaw = new PIXI.AnimatedSprite(jawTextures);
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
    jaw.tint = this.tint;
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
