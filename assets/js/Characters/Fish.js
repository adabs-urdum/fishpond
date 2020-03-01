import * as PIXI from "pixi.js";

class Fish {
  constructor(setup) {
    this.setup = setup;
    this.setup.debugLog("new Fish");
    const fish = new PIXI.Container();
    this.fish = fish;
    this.distance = 5;
    this.relDistance = 5;
    fish.level = 4;
    fish.direction = {
      x: 1,
      y: 1
    };
    fish.maxSpeeds = {
      1: 2,
      2: 4,
      3: 7,
      4: 10
    };
    fish.speeds = {
      x: fish.maxSpeeds[fish.level],
      y: fish.maxSpeeds[fish.level]
    };
    fish.speed = fish.maxSpeeds[fish.level];
    fish.maxSpeed = fish.maxSpeeds[fish.level];
    fish.speedsRel = {
      x: Math.round((this.fish.maxSpeed / 100) * this.fish.speeds.x),
      y: Math.round((this.fish.maxSpeed / 100) * this.fish.speeds.y)
    };

    const fishMainBodyTexture = this.setup.loader.resources[
      "fishMainBody"
    ].texture.clone();
    const fishMainBody = new PIXI.Sprite(fishMainBodyTexture);
    fishMainBody.anchor.x = 0.5;
    fishMainBody.anchor.y = 0.5;
    fishMainBody.scale.set(0.2);
    const fishRelativeWidth = 100 / fishMainBody.width;
    this.fishRelativeWidth = fishRelativeWidth;
    fish.addChildAt(fishMainBody, 0);

    const fishMainJaw = this.addFishMainJaw(fishRelativeWidth);
    fish.addChildAt(fishMainJaw, 1);

    const fishMainCaudal = this.addFishMainCaudal(fishRelativeWidth);
    fish.addChildAt(fishMainCaudal, 2);
    setup.bringToFront(fishMainCaudal);

    this.addFishMainDorsal(fishRelativeWidth);
    fish.addChildAt(this.dorsal, 0);

    this.addFishMainPelvic(fishRelativeWidth);
    fish.addChildAt(this.pelvic, 2);

    this.addFishMainAfter(fishRelativeWidth);
    fish.addChildAt(this.fishMainAfter, 0);

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

  bindEvents = () => {
    window.addEventListener("mousemove", this.setFishSpeed);
    window.addEventListener("mousemove", this.setFishAngle);
  };

  levelUp = () => {
    if (this.fish.level % 4 == 0) {
      this.fish.level = 1;
    } else {
      this.fish.level += 1;
    }

    this.fish.maxSpeed = this.fish.maxSpeeds[this.fish.level];

    const caudalTextures = this.caudalTextures[this.fish.level - 1];
    this.caudal.texture = caudalTextures[0];
    this.caudal.textures = caudalTextures;
    this.caudal.play();

    const pelvicTextures = this.pelvicTextures[this.fish.level - 1];
    this.pelvic.texture = pelvicTextures[0];
    this.pelvic.textures = pelvicTextures;
    this.pelvic.play();

    const jawTextures = this.jawTextures[this.fish.level - 1];
    this.jaw.texture = jawTextures[0];
    this.jaw.textures = jawTextures;

    this.setBodyPartPositions();
  };

  setBodyPartPositions = () => {
    if (this.fish.level == 1) {
      this.jaw.position.x = this.fishRelativeWidth * -14;
      this.jaw.position.y = this.fishRelativeWidth * -6;
      this.fishMainAfter.position.x = this.fishRelativeWidth * -86;
      this.fishMainAfter.position.y = this.fishRelativeWidth * 15;
      this.dorsal.position.x = this.fishRelativeWidth * -75;
      this.dorsal.position.y = this.fishRelativeWidth * -65;
    } else if (this.fish.level == 2) {
      this.jaw.position.x = this.fishRelativeWidth * -22;
      this.jaw.position.y = this.fishRelativeWidth * -6;
      this.fishMainAfter.position.x = this.fishRelativeWidth * -90;
      this.fishMainAfter.position.y = this.fishRelativeWidth * 20;
      this.dorsal.position.x = this.fishRelativeWidth * -75;
      this.dorsal.position.y = this.fishRelativeWidth * -72;
    } else if (this.fish.level == 3) {
      this.jaw.position.x = this.fishRelativeWidth * -22;
      this.jaw.position.y = this.fishRelativeWidth * 3;
      this.fishMainAfter.position.x = this.fishRelativeWidth * -90;
      this.fishMainAfter.position.y = this.fishRelativeWidth * 25;
      this.dorsal.position.x = this.fishRelativeWidth * -75;
      this.dorsal.position.y = this.fishRelativeWidth * -82;
    } else if (this.fish.level == 4) {
      this.jaw.position.x = this.fishRelativeWidth * -25;
      this.jaw.position.y = this.fishRelativeWidth * 4;
      this.fishMainAfter.position.x = this.fishRelativeWidth * -90;
      this.fishMainAfter.position.y = this.fishRelativeWidth * 30;
      this.dorsal.position.x = this.fishRelativeWidth * -75;
      this.dorsal.position.y = this.fishRelativeWidth * -90;
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

    if (angleDeg > 90 || angleDeg < -90) {
      this.fish.scale.y = -1;
    } else {
      this.fish.scale.y = 1;
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
      x: (this.fish.maxSpeed / 100) * this.fish.speeds.x,
      y: (this.fish.maxSpeed / 100) * this.fish.speeds.y
    };
  };

  addFishMainAfter = fishRelativeWidth => {
    const fishMainAfterTexture = this.setup.loader.resources[
      "fishMainAfterFin"
    ].texture.clone();
    const fishMainAfter = new PIXI.Sprite(fishMainAfterTexture);
    fishMainAfter.anchor.x = 0;
    fishMainAfter.anchor.y = 0;
    fishMainAfter.position.x = fishRelativeWidth * -90;
    fishMainAfter.position.y = fishRelativeWidth * 30;
    fishMainAfter.scale.set(0.2);
    this.fishMainAfter = fishMainAfter;
    return fishMainAfter;
  };

  addFishMainDorsal = fishRelativeWidth => {
    const fishMainDorsalTexture = this.setup.loader.resources[
      "fishMainDorsalFin"
    ].texture.clone();
    const fishMainDorsal = new PIXI.Sprite(fishMainDorsalTexture);
    fishMainDorsal.anchor.x = 0;
    fishMainDorsal.anchor.y = 0;
    fishMainDorsal.position.x = fishRelativeWidth * -75;
    fishMainDorsal.position.y = fishRelativeWidth * -90;
    fishMainDorsal.scale.set(0.2);
    this.dorsal = fishMainDorsal;
  };

  addFishMainPelvic = fishRelativeWidth => {
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
      this.pelvicTextures[this.fish.level - 1]
    );
    pelvic.position.x = 0;
    pelvic.position.y = fishRelativeWidth * 35;
    pelvic.anchor.set(1, 0);
    pelvic.scale.set(0.2);
    pelvic.animationSpeed = 1;
    pelvic.first = true;
    pelvic.play();
    this.pelvic = pelvic;
  };

  addFishMainCaudal = fishRelativeWidth => {
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
      this.caudalTextures[this.fish.level - 1]
    );
    caudal.position.x = fishRelativeWidth * -92;
    caudal.position.y = fishRelativeWidth * -5;
    caudal.anchor.set(1, 0.5);
    caudal.scale.set(0.2);
    caudal.animationSpeed = 1;
    caudal.first = true;
    caudal.play();
    this.caudal = caudal;

    return caudal;
  };

  addFishMainJaw = fishRelativeWidth => {
    // load small jaw animation
    const jawSmallFrames = [];
    const fishMainJawSmallTexture = this.setup.loader.resources["mainJawSmall"]
      .texture;
    for (let i = 0; i < 5; i++) {
      jawSmallFrames.push(new PIXI.Rectangle(250 * i, 0, 250, 240));
    }
    fishMainJawSmallTexture.frame = jawSmallFrames[0];
    const fishMainJawSmall = new PIXI.Sprite(fishMainJawSmallTexture);
    let i;
    const jawSmallTextures = [];
    for (i = 0; i < jawSmallFrames.length; i++) {
      const texture = fishMainJawSmallTexture.clone();
      texture.frame = jawSmallFrames[i];
      jawSmallTextures.push(texture);
    }

    // load medium small jaw animation
    const jawMediumSmallFrames = [];
    const fishMainJawMediumSmallTexture = this.setup.loader.resources[
      "mainJawMediumSmall"
    ].texture;
    for (let i = 0; i < 5; i++) {
      jawMediumSmallFrames.push(new PIXI.Rectangle(329 * i, 0, 329, 268));
    }
    fishMainJawMediumSmallTexture.frame = jawMediumSmallFrames[0];
    const fishMainJawMediumSmall = new PIXI.Sprite(
      fishMainJawMediumSmallTexture
    );
    const jawMediumSmallTextures = [];
    for (i = 0; i < jawMediumSmallFrames.length; i++) {
      const texture = fishMainJawMediumSmallTexture.clone();
      texture.frame = jawMediumSmallFrames[i];
      jawMediumSmallTextures.push(texture);
    }

    // load medium large jaw animation
    const jawMediumLargeFrames = [];
    const fishMainJawMediumLargeTexture = this.setup.loader.resources[
      "mainJawMediumLarge"
    ].texture;
    for (let i = 0; i < 5; i++) {
      jawMediumLargeFrames.push(new PIXI.Rectangle(368 * i, 0, 368, 259));
    }
    fishMainJawMediumLargeTexture.frame = jawMediumLargeFrames[0];
    const fishMainJawMediumLarge = new PIXI.Sprite(
      fishMainJawMediumLargeTexture
    );
    const jawMediumLargeTextures = [];
    for (i = 0; i < jawMediumLargeFrames.length; i++) {
      const texture = fishMainJawMediumLargeTexture.clone();
      texture.frame = jawMediumLargeFrames[i];
      jawMediumLargeTextures.push(texture);
    }

    // load large jaw animation
    const jawLargeFrames = [];
    const fishMainJawLargeTexture = this.setup.loader.resources["mainJawLarge"]
      .texture;
    for (let i = 0; i < 5; i++) {
      jawLargeFrames.push(new PIXI.Rectangle(477 * i, 0, 477, 310));
    }
    fishMainJawLargeTexture.frame = jawLargeFrames[0];
    const fishMainJawLarge = new PIXI.Sprite(fishMainJawLargeTexture);
    const jawLargeTextures = [];
    for (i = 0; i < jawLargeFrames.length; i++) {
      const texture = fishMainJawLargeTexture.clone();
      texture.frame = jawLargeFrames[i];
      jawLargeTextures.push(texture);
    }

    this.jawTextures = [
      jawSmallTextures,
      jawMediumSmallTextures,
      jawMediumLargeTextures,
      jawLargeTextures
    ];

    const jaw = new PIXI.AnimatedSprite(this.jawTextures[this.fish.level - 1]);
    jaw.position.x = fishRelativeWidth * -25;
    jaw.position.y = fishRelativeWidth * 4;
    jaw.scale.set(0.2);
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
  };
}

export default Fish;
