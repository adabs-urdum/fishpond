"use strict";

import "babel-polyfill";
import WebFont from "webfontloader";
import * as PIXI from "pixi.js";
import Fish from "./Characters/Fish.js";
import Background from "./Environment/Background.js";
import Splash from "./Environment/Splash.js";

Array.prototype.getRandomValue = inputArray => {
  return inputArray[Math.floor(Math.random() * inputArray.length)];
};

document.addEventListener("DOMContentLoaded", function() {
  const fontFamily = "Schoolbell";

  const debug = true;
  const setup = {
    debug: debug,
    offset: { x: 1, y: 1 },
    fontFamily: fontFamily,
    gameStarted: false,
    vmin:
      window.innerWidth > window.innerHeight
        ? window.innerHeight / 100
        : window.innerWidth / 100,
    windowRatio: window.innerWidth / window.innerHeight,
    designWidth: 1920,
    BS: window.innerWidth / 1920,
    renderer: null,
    loader: null,
    gravity: 20,
    getCollision: (a, b) => {
      var ab = a.getBounds();
      var bb = b.getBounds();
      return (
        ab.x + ab.width > bb.x &&
        ab.x < bb.x + bb.width &&
        ab.y + ab.height > bb.y &&
        ab.y < bb.y + bb.height
      );
    },
    getAngleBetweenPoints: (p1, p2) => {
      return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
    },
    getDistanceBetweenPoints: (p1, p2) => {
      return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    },
    bringToFront: obj => {
      if (obj) {
        const parent = obj.parent;
        if (parent) {
          parent.removeChild(obj);
          parent.addChild(obj);
        }
      }
    },
    sendToBack: (obj, parent) => {
      const parentObj = parent || obj.parent || { children: false };
      if (parentObj.children) {
        for (var keyIndex in obj.parent.children) {
          if (obj.parent.children[keyIndex] === obj) {
            obj.parent.children.splice(keyIndex, 1);
            break;
          }
        }
        parentObj.children.splice(0, 0, obj);
      }
    },
    debugLog: str => {
      if (debug) {
        console.log(str);
      }
    }
  };

  class Game {
    constructor() {
      this.canvas = document.getElementById("fishpond");
      setup.renderer = new PIXI.Renderer({
        view: this.canvas,
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: window.devicePixelRatio,
        autoDensity: true,
        transparent: true
      });
      setup.stage = new PIXI.Container();
      setup.loader = PIXI.Loader.shared;
      setup.checkIsUnderWater = true;
      setup.loader = new PIXI.Loader();
      this.preloadAssets();
    }

    bindEvents = () => {
      window.addEventListener("resize", this.onResize);
      window.addEventListener("click", this.bite);
    };

    onResize = () => {
      setup.debugLog("triggered onResize");
    };

    bite = e => {
      const foodGenerator = setup.background.foodGenerator;
      const bloodworms = foodGenerator.bloodworms;

      bloodworms.map((bloodworm, bloodwormKey) => {
        const hit = setup.getCollision(this.fish.jaw, bloodworm.pixiObj);
        if (hit) {
          bloodworm.addBloodSplatter(bloodworm.pixiObj);
          bloodworm.takeDamage(this.fish);
          if (bloodworm.stats.health <= 0) {
            this.fish.stats.xp += bloodworm.stats.loot.xp;
          }
        }
      });

      this.fish.jaw.play();
    };

    preloadReady = () => {
      this.fish = new Fish(setup);
      setup.fish = this.fish;

      this.ticker = new PIXI.Ticker();
      setup.ticker = this.ticker;
      this.ticker.add(this.render);

      setup.environment = new PIXI.Container();
      setup.background = new Background(setup);

      setup.stage.addChildAt(setup.environment, 0);

      this.bindEvents();

      this.ticker.start();
    };

    updateFpsText = () => {
      if (!this.fpsText) {
        this.fpsText = new PIXI.Text(Math.round(this.ticker.FPS) + " FPS", {
          fontFamily: "Arial",
          fontSize: 20 * setup.BS,
          fill: 0x3d5061
        });
        this.fpsText.anchor.set(1, 0);
        this.fpsText.position.set(
          window.innerWidth - setup.BS * 20,
          setup.BS * 20
        );
        setup.stage.addChildAt(this.fpsText, 1);
      } else {
        this.fpsText.text = Math.round(this.ticker.FPS) + " FPS";
      }
    };

    preloadAssets = () => {
      setup.loader
        .add("fishMainBody", "./dist/img/fish/main/body.png")
        .add("mainPelvicLarge", "./dist/img/fish/main/mainPelvicLarge.png")
        .add(
          "mainPelvicMediumLarge",
          "./dist/img/fish/main/mainPelvicMediumLarge.png"
        )
        .add(
          "mainPelvicMediumSmall",
          "./dist/img/fish/main/mainPelvicMediumSmall.png"
        )
        .add("mainPelvicSmall", "./dist/img/fish/main/mainPelvicSmall.png")
        .add("mainCaudalLarge", "./dist/img/fish/main/mainCaudalLarge.png")
        .add(
          "mainCaudalMediumLarge",
          "./dist/img/fish/main/mainCaudalMediumLarge.png"
        )
        .add(
          "mainCaudalMediumSmall",
          "./dist/img/fish/main/mainCaudalMediumSmall.png"
        )
        .add("mainJawLarge", "./dist/img/fish/main/mainJawLarge.png")
        .add("mainJawSmall", "./dist/img/fish/main/mainJawSmall.png")
        .add(
          "mainJawMediumSmall",
          "./dist/img/fish/main/mainJawMediumSmall.png"
        )
        .add(
          "mainJawMediumLarge",
          "./dist/img/fish/main/mainJawMediumLarge.png"
        )
        .add("mainCaudalSmall", "./dist/img/fish/main/mainCaudalSmall.png")
        .add("fishMainDorsalFin", "./dist/img/fish/main/dorsalFin.svg")
        .add("fishMainAfterFin", "./dist/img/fish/main/afterFin.svg")
        .add("backgroundSand", "./dist/img/background/sand.png")
        .add("backgroundClouds_1", "./dist/img/background/bgClouds_1.png")
        .add("backgroundClouds_2", "./dist/img/background/bgClouds_2.png")
        .add("waterSurface", "./dist/img/background/waterSurface.png")
        .add("bloodworm", "./dist/img/food/bloodworm.png")
        .add("bubble", "./dist/img/environment/bubble.png")
        .add("fern", "./dist/img/environment/fern.png")
        .add("splash", "./dist/img/environment/splash.png")
        .add("bloodSplatter", "./dist/img/food/bloodSplatter.png")
        .add("statsBarLabel", "./dist/img/ui/statsBar/label.png")
        .add("statsBarBody", "./dist/img/ui/statsBar/body.png")
        .add("statsBarBar", "./dist/img/ui/statsBar/bar.png")
        .load();

      // throughout the process multiple signals can be dispatched.
      setup.loader.onProgress.add(() => {}); // called once per loaded/errored file
      setup.loader.onError.add(() => {}); // called once per errored file
      setup.loader.onLoad.add((a, resource, c) => {
        setup.debugLog("Done Loading: " + resource.name);
      }); // called once per loaded file
      setup.loader.onComplete.add(this.preloadReady); // called once when the queued resources all load.
    };

    render = delta => {
      if (debug) {
        this.updateFpsText();
      }

      this.fish.render();

      // if fish is hitting ground
      setup.collisionFishSand = setup.getCollision(
        setup.background.sand,
        this.fish.fish
      );

      // if fish is under water
      if (setup.checkIsUnderWater) {
        setup.isUnderWater = true;
        if (this.fish.fish.direction.x == -1) {
          setup.isUnderWater =
            setup.background.waterSurface.y <=
            setup.offset.y +
              setup.renderer.screen.height / 2 -
              (this.fish.fish.height / 3) * 2 * this.fish.fish.direction.y;
        } else {
          setup.isUnderWater =
            setup.background.waterSurface.y <=
            setup.offset.y +
              setup.renderer.screen.height / 2 -
              (this.fish.fish.height / 3) * 2 * this.fish.fish.direction.y * -1;
        }
      }

      if (
        (!setup.collisionFishSand || this.fish.fish.direction.y == -1) &&
        setup.isUnderWater &&
        setup.checkIsUnderWater
      ) {
        setup.offset.y +=
          this.fish.fish.speedsRel.y * delta * this.fish.fish.direction.y;
        setup.environment.position.y = setup.offset.y * -1;
      }

      if (!setup.isUnderWater) {
        this.splash = new Splash(setup);
        setup.checkIsUnderWater = false;
        setup.isUnderWater = true;
        setTimeout(() => {
          setup.checkIsUnderWater = true;
        }, 200);
      }

      setup.offset.x +=
        this.fish.fish.speedsRel.x * delta * this.fish.fish.direction.x;
      setup.environment.position.x = setup.offset.x * -1;

      setup.background.waterSurface.tilePosition.x +=
        delta * Math.random() * 10;

      setup.background.sand.tilePosition.x +=
        this.fish.fish.speedsRel.x * delta * this.fish.fish.direction.x * -1;

      setup.background.clouds1.tilePosition.x +=
        ((this.fish.fish.speedsRel.x * delta * this.fish.fish.direction.x) /
          3) *
        2 *
        -1;

      setup.background.clouds2.tilePosition.x +=
        ((this.fish.fish.speedsRel.x * delta * this.fish.fish.direction.x) /
          3) *
        1 *
        -1;

      // jump to other side of stage if reached limit
      const limit = 15000;
      if (setup.offset.x > limit + setup.renderer.screen.width) {
        setup.offset.x *= -1;
      } else if (setup.offset.x < -limit - setup.renderer.screen.width) {
        setup.offset.x *= -1;
      }

      setup.background.render(delta);

      setup.renderer.render(setup.stage);
    };
  }

  new Game();
});
