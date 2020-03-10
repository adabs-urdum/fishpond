import * as PIXI from "pixi.js";
import Target from "../Target.js";

class Fish extends Target {
  constructor(setup, sizeFactor, bodyTextureName, jawTextureName) {
    super(setup);
    this.bodyTextureName = bodyTextureName ? bodyTextureName : "fishTargetBody";
    this.jawTextureName = jawTextureName ? jawTextureName : "fishTargetJaw";
    this.setup = setup;
    this.setup.debugLog("new Fish");
    const fish = new PIXI.Container();
    this.pixiObj = fish;
    this.pixiObj.scale.set((Math.random() * sizeFactor) / 2 + sizeFactor / 2);
    this.distance = 5;
    this.relDistance = 5;
    this.rotateCooldown = false;
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
    this.stats.maxHealth = Math.round(
      this.stats.maxHealth +
        this.stats.maxHealth * Math.random() * sizeFactor * 20
    );
    this.stats.health = this.stats.maxHealth;

    this.stats.loot.xp = 5;
    this.stats.speed = Math.random() * 5 + 5;

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

    const jaw = this.addJaw();
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

    this.bindEvents();
  }

  setInitialPosition = () => {
    this.pixiObj.position = this.getNewPosition(this.pixiObj.position);
    this.pixiObj.initialPosition = this.getNewPosition(this.pixiObj.position);
  };

  getNewPosition = oldPos => {
    return {
      x:
        oldPos.x +
        (Math.random() * this.setup.renderer.screen.width) / 2 -
        this.setup.renderer.screen.width / 4,
      y:
        oldPos.y +
        (Math.random() * this.setup.renderer.screen.height) / 2 -
        this.setup.renderer.screen.height / 4
    };
  };

  animateRotation = (targetAngle, speed) => {
    this.targetAngle = targetAngle;
    this.turningSpeed = speed ? speed : 120;
    setTimeout(() => {
      this.setup.ticker.add(this.runAnimateRotation, this);
    }, Math.random() * 500);
    this.originAngle = this.pixiObj.angle;
  };

  runAnimateRotation = () => {
    if (this.pixiObj) {
      this.pixiObj.angle +=
        (this.targetAngle - this.originAngle) / this.turningSpeed;

      if (
        this.pixiObj.angle < this.targetAngle + 3 &&
        this.pixiObj.angle > this.targetAngle - 3
      ) {
        this.pixiObj.angle = this.targetAngle;
        this.setup.ticker.remove(this.runAnimateRotation, this);
        this.setSpriteDirection(this.pixiObj.angle);
      }
    } else {
      this.setup.ticker.remove(this.runAnimateRotation, this);
      this.setSpriteDirection(this.pixiObj.angle);
    }
  };

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

    this.pixiObj.scale.x *= 1.1;
    this.pixiObj.scale.y *= 1.1;

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

  setFishAngle = (e, target) => {
    const p1 = this.pixiObj;
    let p2 = target;

    if (!p2) {
      p2 = {
        x: e.clientX,
        y: e.clientY
      };
    }

    const angleDeg = this.setup.getAngleBetweenPoints(p1, p2);
    this.pixiObj.angle = angleDeg;

    this.pixiObj.direction = {
      x: angleDeg > 90 || angleDeg < -90 ? -1 : 1,
      y: angleDeg > 0 ? 1 : -1
    };

    this.setSpriteDirection((angleDeg * 180) / Math.PI);
  };

  setFishSpeed = e => {
    const p1 = { x: this.pixiObj.x, y: this.pixiObj.y };
    const p2 = { x: e.clientX, y: e.clientY };
    this.distance = this.setup.getDistanceBetweenPoints(p1, p2);
    this.relDistance = (100 / (this.setup.vmin * 50)) * this.distance;
    this.relDistance = this.relDistance > 100 ? 100 : this.relDistance;

    this.pixiObj.speeds.x =
      (100 / (this.setup.vmin * 50)) *
      Math.abs(Math.abs(p2.x) - Math.abs(p1.x));
    this.pixiObj.speeds.y =
      (100 / (this.setup.vmin * 50)) *
      Math.abs(Math.abs(p2.y) - Math.abs(p1.y));

    this.pixiObj.speedsRel = {
      x:
        (this.stats.levels[this.stats.level].maxSpeeds.x / 100) *
        this.pixiObj.speeds.x,
      y:
        (this.stats.levels[this.stats.level].maxSpeeds.y / 100) *
        this.pixiObj.speeds.y
    };
  };

  addBody = () => {
    const bodyTexture = this.setup.loader.resources[
      this.bodyTextureName
    ].texture.clone();
    const body = new PIXI.Sprite(bodyTexture);
    body.anchor.x = 0.5;
    body.anchor.y = 0.5;
    body.tint = this.tint;
    this.body = body;

    const bodyFrames = [];
    for (let i = 0; i < 5; i++) {
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
    const pelvicFrames = [];
    const pelvicTexture = this.setup.loader.resources["fishTargetPelvic"]
      .texture;

    for (let i = 0; i < 8; i++) {
      pelvicFrames.push(new PIXI.Rectangle(113 * i, 0, 113, 129));
    }

    pelvicTexture.frame = pelvicFrames[0];

    const pelvicTextures = [];
    for (let i = 0; i < pelvicFrames.length; i++) {
      const texture = pelvicTexture.clone();
      texture.frame = pelvicFrames[i];
      pelvicTextures.push(texture);
    }

    const pelvic = new PIXI.AnimatedSprite(pelvicTextures);
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
    caudal.play();
    caudal.tint = this.tint;
    this.caudal = caudal;

    return caudal;
  };

  addJaw = () => {
    // load small jaw animation
    const jawFrames = [];
    const jawTexture = this.setup.loader.resources[this.jawTextureName].texture;
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

  decay = () => {
    this.jaw.alpha -= 0.015;
    this.jaw.position.x += 1;
    this.jaw.position.y += 1;

    this.pelvic.alpha -= 0.015;
    this.pelvic.position.x += 0.5;
    this.pelvic.position.y += 1;

    this.after.alpha -= 0.015;
    this.after.position.x -= 0.5;
    this.after.position.y += 1;

    this.dorsal.alpha -= 0.015;
    this.dorsal.position.x -= 1;
    this.dorsal.position.y -= 1;

    this.caudal.alpha -= 0.015;
    this.caudal.position.x -= 1;
    // this.caudal.position.y -= 1;
  };

  render = delta => {
    const step = this.stats.maxHealth / (this.bodyFrames.length - 2);
    const frameId = Math.round(
      this.bodyFrames.length - 2 - this.stats.health / step
    );

    // change body texture based on health
    if (this.stats.health >= 0) {
      this.body.texture.frame = this.bodyFrames[frameId];
    }

    if (this.stats.health > 0) {
      this.pixiObj.position.x = 100 * Math.sin(this.pixiObj.initialPosition.x);
      this.pixiObj.position.y = 100 * Math.sin(this.pixiObj.initialPosition.y);
      this.pixiObj.initialPosition.y += 0.01;
      this.pixiObj.initialPosition.x += 0.005;
    } else {
      this.body.texture.frame = this.bodyFrames[this.bodyFrames.length - 1];
      this.decay();
      this.caudal.stop();
      this.pelvic.stop();
      this.pixiObj.position.y += 2 * delta;
      this.pixiObj.angle += 0.2 * delta;

      if (
        this.pixiObj.position.y >=
        this.setup.sand.position.y + this.setup.sand.height
      ) {
        this.pixiObj.destroy();
        return false;
      }
    }

    return true;
  };
}

export default Fish;
