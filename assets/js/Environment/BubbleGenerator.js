import * as PIXI from "pixi.js";

class BubbleGenerator {
  constructor(setup) {
    this.setup = setup;
    setup.debugLog("new BubbleGenerator");
    this.bubbles = [];
    this.addBubble(), this.addBubble(), this.addBubble(), this.addBubble();

    this.bubbleInterval = setInterval(() => {
      this.addBubble();
      this.addBubble();
      this.addBubble();
    }, 2500);
  }

  addBubble = () => {
    const bubbleFrames = [];
    const bubbleTexture = this.setup.loader.resources["bubble"].texture;
    for (let i = 0; i < 6; i++) {
      bubbleFrames.push(new PIXI.Rectangle(512 * i, 0, 512, 512));
    }
    bubbleTexture.frame = bubbleFrames[0];
    const bubbleTextures = [];
    for (let i = 0; i < bubbleFrames.length; i++) {
      const texture = bubbleTexture.clone();
      texture.frame = bubbleFrames[i];
      bubbleTextures.push(texture);
    }

    const bubble = new PIXI.AnimatedSprite(bubbleTextures);
    bubble.anchor.set(0.5);
    bubble.activeMovement = true;
    bubble.first = true;
    const randomFactor = Math.random();
    bubble.scale.set(randomFactor * 0.05 + 0.05);
    bubble.speed = 5 * randomFactor;
    bubble.onFrameChange = () => {};

    bubble.animationSpeed = 0.5;
    bubble.loop = false;

    // random whithin viewportX
    bubble.randomSpawnPointX =
      (this.setup.offset.x +
        this.setup.renderer.screen.width -
        this.setup.offset.x) *
        Math.random() +
      this.setup.offset.x;
    bubble.position.x = bubble.randomSpawnPointX;

    bubble.y = this.setup.renderer.screen.height - bubble.height;
    this.setup.bubbleContainer.addChild(bubble);

    bubble.onComplete = () => {
      const key = this.bubbles.filter((loopBubble, loopBubbleKey) => {
        if (loopBubble == bubble) {
          this.bubbles.splice(loopBubbleKey, 1);
          return true;
        }
      });

      bubble.destroy();
    };

    this.bubbles.push(bubble);
  };

  render = (delta, waterSurface) => {
    const time = this.setup.ticker.lastTime - this.lastTime;
    this.lastTime = this.setup.ticker.lastTime;

    this.bubbles.map((bubble, bubbleKey) => {
      if (bubble.activeMovement) {
        bubble.position.y -= bubble.speed * delta;
        bubble.position.x =
          bubble.randomSpawnPointX +
          100 * Math.sin(this.lastTime / 1000) * delta;
      }

      const touchedSurface =
        bubble.y <= waterSurface.y + waterSurface.height / 3;
      if (touchedSurface) {
        bubble.play();
        bubble.activeMovement = false;
      }
    });
  };
}

export default BubbleGenerator;
