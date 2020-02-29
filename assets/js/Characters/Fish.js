import * as PIXI from "pixi.js";

class Fish {
  constructor(setup) {
    this.setup = setup;
    this.setup.debugLog("new Fish");
    const fish = new PIXI.Container();
    this.fish = fish;
    fish.speed = 0;
    fish.level = 1;

    const fishMainBodyTexture = this.setup.loader.resources[
      "fishMainBody"
    ].texture.clone();
    const fishMainBody = new PIXI.Sprite(fishMainBodyTexture);
    fishMainBody.anchor.x = 0.5;
    fishMainBody.anchor.y = 0.5;
    fishMainBody.scale.set(0.2);
    const fishRelativeWidth = 100 / fishMainBody.width;
    fish.addChildAt(fishMainBody, 0);

    const fishMainJaw = this.addFishMainJaw(fishRelativeWidth);
    fish.addChildAt(fishMainJaw, 1);

    const fishMainCaudal = this.addFishMainCaudal(fishRelativeWidth);
    fish.addChildAt(fishMainCaudal, 2);
    setup.bringToFront(fishMainCaudal);

    const fishMainDorsalTexture = this.setup.loader.resources[
      "fishMainDorsalFin"
    ].texture.clone();
    const fishMainDorsal = new PIXI.Sprite(fishMainDorsalTexture);
    fishMainDorsal.anchor.x = 0;
    fishMainDorsal.anchor.y = 0;
    fishMainDorsal.position.x = fishRelativeWidth * -75;
    fishMainDorsal.position.y = fishRelativeWidth * -90;
    fishMainDorsal.scale.set(0.2);
    fish.addChildAt(fishMainDorsal, 0);

    const fishMainPelvic = this.addFishMainPelvic(fishRelativeWidth);
    console.log(fishMainPelvic);

    fish.addChildAt(fishMainPelvic, 2);

    const fishMainAfter = this.addFishMainAfter(fishRelativeWidth);
    fish.addChildAt(fishMainAfter, 0);

    fish.x = window.innerWidth / 2;
    fish.y = window.innerHeight / 2;

    fish.speed = 0;
    fish.interactive = true;
    fish.click = this.levelUp;

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

    const caudalTextures = this.caudalTextures[this.fish.level - 1];
    this.caudal.texture = caudalTextures[0];
    this.caudal.textures = caudalTextures;
    this.caudal.play();

    const pelvicTextures = this.pelvicTextures[this.fish.level - 1];
    this.pelvic.texture = pelvicTextures[0];
    this.pelvic.textures = pelvicTextures;
    this.pelvic.play();
  };

  setFishAngle = e => {
    const p1 = this.fish;
    const p2 = {
      x: e.clientX,
      y: e.clientY
    };
    const angleDeg = this.setup.getAngleBetweenPoints(p1, p2);
    this.fish.angle = angleDeg;

    const direction = angleDeg > 90 || angleDeg < -90 ? "left" : "right";

    if (angleDeg > 90 || angleDeg < -90) {
      this.fish.scale.y = -1;
    } else {
      this.fish.scale.y = 1;
    }
  };

  setFishSpeed = e => {
    const p1 = { x: this.fish.x, y: this.fish.y };
    const p2 = { x: e.clientX, y: e.clientY };
    const distance = this.setup.getDistanceBetweenPoints(p1, p2);
    let speed = (100 / (this.setup.vmin * 50)) * distance;
    speed = speed > 100 ? 100 : Math.round(speed);
    this.fish.speed = speed;
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
    return fishMainAfter;
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

    return pelvic;
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
    const spriteFrames = [];
    const fishMainJawLargeTexture = this.setup.loader.resources["mainJawLarge"]
      .texture;

    for (let i = 0; i < 5; i++) {
      spriteFrames.push(new PIXI.Rectangle(477 * i, 0, 477, 310));
    }

    fishMainJawLargeTexture.frame = spriteFrames[0];
    const fishMainJawLarge = new PIXI.Sprite(fishMainJawLargeTexture);

    let i;
    const animationTextures = [];
    for (i = 0; i < spriteFrames.length; i++) {
      const texture = fishMainJawLargeTexture.clone();
      texture.frame = spriteFrames[i];
      animationTextures.push(texture);
    }

    const bite = new PIXI.AnimatedSprite(animationTextures);
    bite.position.x = fishRelativeWidth * -25;
    bite.position.y = fishRelativeWidth * 4;
    bite.scale.set(0.2);
    bite.animationSpeed = 1;
    bite.first = true;
    bite.onFrameChange = () => {
      if (!bite.first) {
        if (this.bite.totalFrames % this.bite.currentFrame == 0) {
          this.bite.texture.frame = this.bite.textures[0].frame;
          this.bite.stop();
        }
      }
      bite.first = false;
    };
    this.bite = bite;
    return bite;
  };

  render = () => {
    if (this.fish.speed > 10) {
      this.caudal.play();
      this.caudal.animationSpeed = 0.01 * this.fish.speed;
      this.pelvic.play();
      this.pelvic.animationSpeed = 0.015 * this.fish.speed;
    } else {
      this.caudal.stop();
      this.pelvic.stop();
    }
  };
}

export default Fish;
