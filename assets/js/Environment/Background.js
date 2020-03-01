import * as PIXI from "pixi.js";

class Background {
  constructor(setup) {
    this.setup = setup;
    this.setup.debugLog("new Background");
    const tint = 0xe8fbff;

    this.belowGround = new PIXI.Graphics();
    this.belowGround.beginFill("0xffe0a4");
    this.belowGround.drawRect(
      0,
      this.setup.renderer.height / 2 - 5,
      this.setup.renderer.width,
      this.setup.renderer.height
    );
    this.belowGround.endFill();
    this.belowGround.tint = tint;
    this.setup.environment.addChildAt(this.belowGround, 0);

    this.seaGraphics = new PIXI.Graphics();
    this.seaGraphics.beginFill("0xC4EAFF");
    this.seaGraphics.drawRect(
      0,
      0,
      this.setup.renderer.width,
      this.setup.renderer.height
    );
    this.seaGraphics.endFill();
    this.seaTexture = PIXI.RenderTexture.create(
      this.seaGraphics.width,
      this.seaGraphics.height
    );
    this.setup.renderer.render(this.seaGraphics, this.seaTexture);
    this.sea = new PIXI.Sprite(
      this.seaTexture,
      this.setup.renderer.screen.width,
      this.setup.renderer.screen.height
    );
    this.sea.x = 0;
    this.sea.y = 0;
    this.setup.environment.addChildAt(this.sea, 0);

    this.sea2 = new PIXI.Sprite(
      this.seaTexture.clone(),
      this.setup.renderer.screen.width,
      this.setup.renderer.screen.height
    );
    this.sea2.x = 0;
    this.sea2.y = 0 - this.setup.renderer.screen.height;
    this.setup.environment.addChildAt(this.sea2, 1);

    const clouds2Texture = this.setup.loader.resources[
      "backgroundClouds_2"
    ].texture.clone();
    this.clouds2 = new PIXI.TilingSprite(
      clouds2Texture,
      this.setup.renderer.screen.width,
      450
    );
    this.clouds2.y = window.innerHeight - this.clouds2.height;
    this.clouds2.tint = tint;
    this.setup.environment.addChildAt(this.clouds2, 2);

    const clouds1Texture = this.setup.loader.resources[
      "backgroundClouds_1"
    ].texture.clone();
    this.clouds1 = new PIXI.TilingSprite(
      clouds1Texture,
      this.setup.renderer.screen.width,
      300
    );
    this.clouds1.y = window.innerHeight - this.clouds1.height;
    this.clouds1.tint = tint;
    this.setup.environment.addChildAt(this.clouds1, 3);

    const sandTexture = this.setup.loader.resources[
      "backgroundSand"
    ].texture.clone();
    this.sand = new PIXI.TilingSprite(
      sandTexture,
      this.setup.renderer.screen.width,
      128
    );
    this.sand.y = window.innerHeight - this.sand.height;
    this.sand.tint = tint;
    this.setup.environment.addChildAt(this.sand, 4);

    const waterSurfaceTexture = this.setup.loader.resources[
      "waterSurface"
    ].texture.clone();
    this.waterSurface = new PIXI.TilingSprite(
      waterSurfaceTexture,
      this.setup.renderer.screen.width,
      59
    );
    this.waterSurface.y =
      0 - this.setup.renderer.screen.height - this.waterSurface.height;
    this.setup.environment.addChildAt(this.waterSurface, 5);
  }
}

export default Background;
