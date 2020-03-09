import * as PIXI from "pixi.js";
import BubbleGenerator from "./BubbleGenerator.js";
import FernGenerator from "./FernGenerator.js";
import FoodGenerator from "./FoodGenerator.js";
import UiGenerator from "../UI/UiGenerator.js";
import LandGenerator from "./LandGenerator.js";

class Background {
  constructor(setup) {
    this.setup = setup;
    this.setup.debugLog("new Background");
    this.zIndex = 0;
    this.tint = 0xe8fbff;

    this.addSky();
    this.addSea();
    this.addClouds2();
    this.addWaterSurface();
    this.addBubbleContainer();
    this.addLandContainer();
    this.addFoodContainer();
    this.addClouds1();
    this.addSand();
    this.addBelowGround();
    this.addFernContainer();
    this.addUiContainer();
  }

  addLandContainer = () => {
    this.landGenerator = new LandGenerator(this.setup);

    this.landGenerator.islands.forEach(island => {
      island.position.y = this.waterSurface.y;
    });
  };

  addSky = () => {
    this.sky = new PIXI.Graphics();
    this.sky.beginFill("0x3BD0FF");
    this.sky.drawRect(
      0,
      this.setup.renderer.screen.height * -2,
      this.setup.renderer.screen.width,
      this.setup.renderer.screen.height
    );
    this.sky.endFill();
    this.setup.environment.addChildAt(this.sky, this.zIndex);
    this.zIndex += 1;
  };

  addSea = () => {
    this.seaGraphics = new PIXI.Graphics();
    this.seaGraphics.beginFill("0xC4EAFF");
    this.seaGraphics.drawRect(
      0,
      0,
      this.setup.renderer.screen.width,
      this.setup.renderer.screen.height
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
    this.setup.environment.addChildAt(this.sea, this.zIndex);
    this.zIndex += 1;

    this.sea2 = new PIXI.Sprite(
      this.seaTexture.clone(),
      this.setup.renderer.screen.width,
      this.setup.renderer.screen.height
    );
    this.sea2.x = 0;
    this.sea2.y = 0 - this.setup.renderer.screen.height;
    this.setup.environment.addChildAt(this.sea2, this.zIndex);
    this.zIndex += 1;
  };

  addClouds2 = () => {
    const clouds2Texture = this.setup.loader.resources[
      "backgroundClouds_2"
    ].texture.clone();
    this.clouds2 = new PIXI.TilingSprite(
      clouds2Texture,
      this.setup.renderer.screen.width,
      450
    );
    this.clouds2.y = window.innerHeight - this.clouds2.height;
    this.clouds2.tint = this.tint;
    this.setup.environment.addChildAt(this.clouds2, this.zIndex);
    this.zIndex += 1;
    const blurFilter = new PIXI.filters.BlurFilter();
    this.clouds2.filters = [blurFilter];
    blurFilter.blur = 4;
  };

  addWaterSurface = () => {
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
    this.setup.environment.addChildAt(this.waterSurface, this.zIndex);
    this.setup.waterSurface = this.waterSurface;
    this.zIndex += 1;
  };

  addBubbleContainer = () => {
    this.setup.bubbleContainer = new PIXI.Container();
    this.setup.environment.addChildAt(this.setup.bubbleContainer, 4);
    this.bubbleGenerator = new BubbleGenerator(this.setup);
    this.zIndex += 1;
  };

  addFoodContainer = () => {
    this.setup.foodContainer = new PIXI.Container();
    this.setup.environment.addChildAt(this.setup.foodContainer, this.zIndex);
    this.foodGenerator = new FoodGenerator(this.setup);
    this.zIndex += 1;
  };

  addClouds1 = () => {
    const clouds1Texture = this.setup.loader.resources[
      "backgroundClouds_1"
    ].texture.clone();
    this.clouds1 = new PIXI.TilingSprite(
      clouds1Texture,
      this.setup.renderer.screen.width,
      300
    );
    this.clouds1.y = window.innerHeight - this.clouds1.height;
    this.clouds1.tint = this.tint;
    this.setup.environment.addChildAt(this.clouds1, this.zIndex);
    this.zIndex += 1;
  };

  addSand = () => {
    const sandTexture = this.setup.loader.resources[
      "backgroundSand"
    ].texture.clone();
    this.sand = new PIXI.TilingSprite(
      sandTexture,
      this.setup.renderer.screen.width,
      128
    );
    this.sand.y = this.setup.renderer.screen.height - this.sand.height;
    this.sand.tint = this.tint;
    this.setup.sand = this.sand;
    this.setup.environment.addChildAt(this.sand, this.zIndex);
    this.zIndex += 1;
  };

  addUiContainer = () => {
    this.uiGenerator = new UiGenerator(this.setup);
    this.setup.environment.addChildAt(this.uiGenerator.pixiObj, 12);
    this.zIndex += 1;
  };

  addBelowGround = () => {
    this.belowGround = new PIXI.Graphics();
    this.belowGround.beginFill("0xffe0a4");
    this.belowGround.drawRect(
      0,
      this.setup.renderer.screen.height,
      this.setup.renderer.screen.width,
      this.setup.renderer.screen.height
    );
    this.belowGround.endFill();
    this.belowGround.tint = this.tint;
    this.setup.environment.addChildAt(this.belowGround, this.zIndex);
    this.zIndex += 1;
  };

  addFernContainer = () => {
    this.setup.fernContainer = new PIXI.Container();
    this.setup.environment.addChildAt(this.setup.fernContainer, this.zIndex);
    this.fernGenerator = new FernGenerator(this.setup);
    this.zIndex += 1;
  };

  render = delta => {
    this.sand.position.x = this.setup.offset.x;
    this.sky.position.x = this.setup.offset.x;
    this.clouds1.position.x = this.setup.offset.x;
    this.clouds2.position.x = this.setup.offset.x;
    this.belowGround.position.x = this.setup.offset.x;
    this.sea.position.x = this.setup.offset.x;
    this.sea2.position.x = this.setup.offset.x;
    this.waterSurface.position.x = this.setup.offset.x;
    this.bubbleGenerator.render(delta, this.waterSurface);
    this.fernGenerator.render(delta);
    this.foodGenerator.render(delta);
    this.uiGenerator.render(delta);
  };
}

export default Background;
