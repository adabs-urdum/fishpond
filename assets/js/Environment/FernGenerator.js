import * as PIXI from "pixi.js";

class FernGenerator {
  constructor(setup) {
    this.setup = setup;
    this.setup.debugLog("new FernGenerator");

    this.fernTexture = this.setup.loader.resources["fern"].texture.clone();
    this.petalFrames = [
      // petal horizontal 1
      new PIXI.Rectangle(392, 444, 534, 415),
      // petal horizontal 2
      new PIXI.Rectangle(0, 860, 920, 365),
      // petal vertical 1
      new PIXI.Rectangle(926, 0, 336, 1226),
      // petal vertical 2
      new PIXI.Rectangle(1268, 100, 320, 1120)
    ];

    this.ferns = [];

    for (let i = 0; i < 30; i++) {
      this.ferns.push(this.addFern());
    }
  }

  addPetal = () => {
    const petalTexture = this.fernTexture.clone();
    const frameNumber = Math.round(Math.random() * 3);
    petalTexture.frame = this.petalFrames[frameNumber];
    const fernSprite = new PIXI.Sprite(petalTexture);
    fernSprite.scale.set(Math.random() * 0.2 + 0.2);
    fernSprite.scale.x = Math.round(Math.random())
      ? fernSprite.scale.x
      : fernSprite.scale.x * -1;
    fernSprite.angle = Math.round(Math.random())
      ? Math.random() * 45
      : Math.random() * -45;
    fernSprite.startingAngle = fernSprite.angle;

    switch (frameNumber) {
      case 0:
        fernSprite.anchor.x = 1;
        fernSprite.anchor.y = 1;
        break;
      case 1:
        fernSprite.anchor.x = 1;
        fernSprite.anchor.y = 1;
        break;
      case 2:
        fernSprite.anchor.x = 0.5;
        fernSprite.anchor.y = 1;
        break;
      case 3:
        fernSprite.anchor.x = 0.5;
        fernSprite.anchor.y = 1;
        break;
    }

    return fernSprite;
  };

  addFern = () => {
    const petalsAmount = Math.ceil(Math.random() * 5 + 5);
    const fern = new PIXI.Container();
    // random whithin viewportX
    const range = 30000;
    fern.randomSpawnPointX = range * Math.random() - range / 2;
    fern.position.x = fern.randomSpawnPointX;

    for (let i = 0; i < petalsAmount; i++) {
      const petal = this.addPetal();
      fern.addChild(petal);
    }

    fern.position.y =
      this.setup.renderer.screen.height -
      ((Math.random() * this.setup.sand.height) / 3) * 2;

    this.setup.fernContainer.addChildAt(fern, 0);

    return fern;
  };

  wigglePetal = petal => {
    if (
      petal.angle >= petal.startingAngle + 10 ||
      petal.angle <= petal.startingAngle - 10
    ) {
      this.setup.ticker.remove(this.wigglePetal, this);
    } else {
      petal.angle += this.setup.fish.fish.direction.x;
    }
  };

  returnPetalRotation = petal => {
    const fishPetalCollided = this.setup.getCollision(
      this.setup.fish.fish,
      petal
    );

    if (!fishPetalCollided) {
      const difference = petal.startingAngle - petal.angle;
      petal.angle += difference / 10;

      if (
        petal.angle >= petal.startingAngle - 2 &&
        petal.angle <= petal.startingAngle + 2
      ) {
        this.setup.ticker.remove(this.returnPetalRotation, this);
      }
    }
  };

  render(delta) {
    this.ferns.map(fern => {
      const fishFernCollided = this.setup.getCollision(
        this.setup.fish.fish,
        fern
      );
      if (fishFernCollided) {
        fern.children.map(petal => {
          const fishPetalCollided = this.setup.getCollision(
            this.setup.fish.fish,
            petal
          );
          if (fishPetalCollided) {
            petal.startWiggleAngle = petal.angle;
            this.setup.ticker.add(this.wigglePetal(petal), this);
            setTimeout(() => {
              this.setup.ticker.add(this.returnPetalRotation(petal), this);
            }, 500);
          }
        });
      }
    });
  }
}

export default FernGenerator;
