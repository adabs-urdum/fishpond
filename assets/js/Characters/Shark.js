import * as PIXI from "pixi.js";
import Target from "./Target";

class Shark extends Target {
  constructor(setup) {
    super(setup);
    this.setup = setup;
    this.setup.debugLog("new Shark");
    this.tint = 0xe8fbff;
    this.bloodFactor = 0.7;

    this.stats = {
      maxHealth: 150,
      health: 150,
      attack: 1,
      speed: 8,
      loot: {
        xp: 50
      }
    };

    this.pixiObj = new PIXI.Container();

    this.addBodyParts();

    this.pixiObj.scale.set(0.4);
    this.pixiObj.position.x =
      Math.random() * this.setup.renderer.screen.height * 2 -
      this.setup.renderer.screen.height;
    this.pixiObj.position.x =
      Math.random() * this.setup.stageWidthHalf * 2 - this.setup.stageWidthHalf;

    this.setup.foodContainer.addChild(this.pixiObj);
  }

  afterTakeDamage = () => {
    let textureKey = Math.ceil(
      ((this.bodyFrames.length - 1) / this.stats.maxHealth) * this.stats.health
    );
    this.body.texture.frame = this.bodyFrames[textureKey];

    if (this.stats.health <= 0) {
      this.stats.health = 0;
      this.pelvicLeft.stop();
      this.pelvicRight.stop();
      this.caudal.stop();
      this.explode();
    }
  };

  explode = () => {
    this.setup.ticker.add(this.runExplosion, this);
  };

  runExplosion = () => {
    const alphaStep = 0.02;

    this.caudal.position.x -= 1;
    this.caudal.alpha -= alphaStep;

    this.pelvicLeft.position.y += 2;
    this.pelvicLeft.alpha -= alphaStep;

    this.pelvicRight.position.y += 2;
    this.pelvicRight.alpha -= alphaStep;

    this.after.position.y += 2;
    this.after.alpha -= alphaStep;

    this.dorsal.position.y -= 2;
    this.dorsal.alpha -= alphaStep;

    this.jaw.position.y += 2;
    this.jaw.position.x += 2;
    this.jaw.alpha -= alphaStep;

    if (this.caudal.alpha <= 0) {
      this.setup.ticker.remove(this.runExplosion, this);
    }
  };

  addBodyParts = () => {
    this.addAfter();
    this.addBody();
    this.addCaudal();
    this.addDorsal();
    this.addPelvicLeft();
    this.addPelvicRight();
    this.addJaw();
  };

  addJaw = () => {
    const jawFrames = [];
    const jawTexture = this.setup.loader.resources["sharkJaw"].texture;
    for (let i = 0; i < 8; i++) {
      jawFrames.push(new PIXI.Rectangle(0, 217 * i, 331, 217));
    }
    jawTexture.frame = jawFrames[0];
    const jawTextures = [];
    for (let i = 0; i < jawFrames.length; i++) {
      const texture = jawTexture.clone();
      texture.frame = jawFrames[i];
      jawTextures.push(texture);
    }

    const jaw = new PIXI.AnimatedSprite(jawTextures);
    jaw.animationSpeed = 0.2;
    jaw.first = true;
    jaw.onFrameChange = () => {
      if (!jaw.first) {
        if (this.jaw.totalFrames % this.jaw.currentFrame == 0) {
          this.jaw.texture.frame = this.jaw.textures[0].frame;
          this.jaw.stop();

          const relJawPosition = {
            x: this.pixiObj.position.x - this.setup.offset.x,
            y: this.pixiObj.position.y - this.setup.offset.y
          };

          const distanceBite = this.setup.getDistanceBetweenPoints(
            relJawPosition,
            this.setup.fish.pixiObj
          );

          if (distanceBite <= 155) {
            this.setup.fish.addBloodSplatter();
            this.setup.fish.takeDamage(this);
          }
        }
      }
      jaw.first = false;
    };
    jaw.tint = this.tint;
    jaw.position.x = 8;
    jaw.position.y = -3;
    jaw.play();
    this.jaw = jaw;

    this.pixiObj.addChildAt(this.jaw, 4);
  };

  addPelvicRight = () => {
    const pelvicFrames = [];
    const pelvicTexture = this.setup.loader.resources["sharkPelvicRight"]
      .texture;

    for (let i = 0; i < 9; i++) {
      pelvicFrames.push(new PIXI.Rectangle(0, 199.2 * i, 204.28, 199.2));
    }

    pelvicTexture.frame = pelvicFrames[0];

    const pelvicTextures = [];
    for (let i = 0; i < pelvicFrames.length; i++) {
      const texture = pelvicTexture.clone();
      texture.frame = pelvicFrames[i];
      pelvicTextures.push(texture);
    }

    const pelvic = new PIXI.AnimatedSprite(pelvicTextures);
    pelvic.anchor.set(0.5, 0);
    pelvic.animationSpeed = 0.2;
    pelvic.play();
    pelvic.position.x = -50;
    pelvic.position.y = 100;
    pelvic.tint = this.tint;
    this.pelvicRight = pelvic;

    this.pixiObj.addChildAt(this.pelvicRight, 4);
  };

  addPelvicLeft = () => {
    const pelvicFrames = [];
    const pelvicTexture = this.setup.loader.resources["sharkPelvicLeft"]
      .texture;

    for (let i = 0; i < 9; i++) {
      pelvicFrames.push(new PIXI.Rectangle(0, 131.4 * i, 88, 131.4));
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
    pelvic.animationSpeed = 0.2;
    pelvic.play();
    pelvic.position.x = 100;
    pelvic.position.y = 170;
    pelvic.tint = this.tint;
    this.pelvicLeft = pelvic;

    this.pixiObj.addChildAt(this.pelvicLeft, 1);
  };

  addDorsal = () => {
    const dorsalTexture = this.setup.loader.resources[
      "sharkDorsal"
    ].texture.clone();
    const dorsal = new PIXI.Sprite(dorsalTexture);
    dorsal.anchor.x = 0.5;
    dorsal.anchor.y = 1;
    dorsal.position.x = -70;
    dorsal.position.y = -152;
    dorsal.tint = this.tint;
    this.dorsal = dorsal;

    this.pixiObj.addChildAt(this.dorsal, 0);
  };

  addCaudal = () => {
    const caudalFrames = [];
    const caudalTexture = this.setup.loader.resources["sharkCaudal"].texture;

    for (let i = 0; i < 9; i++) {
      caudalFrames.push(new PIXI.Rectangle(0, 280.5 * i, 207.14, 280.5));
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
    caudal.position.x = -410;
    caudal.position.y = -80;
    caudal.animationSpeed = 0.2;
    caudal.play();
    caudal.tint = this.tint;
    this.caudal = caudal;

    this.pixiObj.addChildAt(caudal, 2);
  };

  addBody = () => {
    const bodyTexture = this.setup.loader.resources[
      "sharkBody"
    ].texture.clone();
    const body = new PIXI.Sprite(bodyTexture);
    body.anchor.x = 0.5;
    body.anchor.y = 0.5;
    body.tint = this.tint;
    this.body = body;

    const bodyFrames = [];
    for (let i = 0; i < 6; i++) {
      bodyFrames.push(new PIXI.Rectangle(950 * i, 0, 950, 400));
    }
    bodyTexture.frame = bodyFrames[bodyFrames.length - 1];
    this.bodyFrames = bodyFrames;

    this.body = body;
    this.pixiObj.addChildAt(body, 1);

    return body;
  };

  addAfter = () => {
    const afterTexture = this.setup.loader.resources[
      "sharkAfter"
    ].texture.clone();
    const after = new PIXI.Sprite(afterTexture);
    after.anchor.x = 0.5;
    after.anchor.y = 0;
    after.tint = this.tint;
    after.position.x = -295;
    after.position.y = -10;
    this.after = after;
    this.pixiObj.addChildAt(this.after, 0);
  };

  render = delta => {
    this.stats.speed = this.setup.fish.stats.levels[
      this.setup.fish.stats.level
    ].maxSpeeds.x;
    // turn if reached stage boundaries
    if (
      this.pixiObj.position.x >
        this.setup.stageWidthHalf - this.pixiObj.width / 2 ||
      this.pixiObj.position.x <
        this.setup.stageWidthHalf * -1 - this.pixiObj.width
    ) {
      // this.stats.speed *= -1;
      // this.pixiObj.scale.x *= -1;
    }

    // if dead/alive
    if (this.stats.health <= 0) {
      this.pixiObj.y += 2 * delta;
      this.pixiObj.angle += 0.1;
      if (
        this.pixiObj.position.y >
        this.setup.background.sand.position.y + this.pixiObj.height
      ) {
        this.pixiObj.destroy();
        return false;
      }
    } else {
      // check if smelling player
      const relPosition = {
        x: this.pixiObj.position.x - this.setup.offset.x,
        y: this.pixiObj.position.y - this.setup.offset.y
      };
      const distanceFishShark = this.setup.getDistanceBetweenPoints(
        relPosition,
        this.setup.fish.pixiObj.position
      );

      if (
        distanceFishShark <= (this.setup.renderer.screen.width / 3) * 2 &&
        !this.setup.fish.hiddenInPlants
      ) {
        const angle = this.setup.getAngleBetweenPoints(
          relPosition,
          this.setup.fish.pixiObj
        );

        this.pixiObj.angle = angle;
        this.setSpriteDirection(angle);
        if (distanceFishShark < 350) {
          if (!this.jaw.playing) {
            this.jaw.play();
          }
        }

        if (distanceFishShark >= 100) {
          this.pixiObj.position.x +=
            (this.stats.speed / 100) *
            95 *
            Math.cos((angle * Math.PI) / 180) *
            delta;
          this.pixiObj.position.y +=
            (this.stats.speed / 100) *
            95 *
            Math.sin((angle * Math.PI) / 180) *
            delta;
        }
      } else {
        // this.pixiObj.position.x += (this.stats.speed / 2) * delta;
      }
    }

    return true;
  };
}

export default Shark;
