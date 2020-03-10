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
    offset: { x: 1, y: window.innerHeight / 4 },
    fontFamily: fontFamily,
    gameStarted: false,
    stageWidthHalf: 3000,
    vmin:
      window.innerWidth > window.innerHeight
        ? window.innerHeight / 100
        : window.innerWidth / 100,
    vh: window.innerHeight / 100,
    windowRatio: window.innerWidth / window.innerHeight,
    designWidth: 1920,
    BS: window.innerWidth / 1920,
    renderer: null,
    loader: null,
    gravity: 20,
    getNewRandomPos: boundaryInit => {
      const boundary = boundaryInit
        ? boundaryInit
        : {
            x: window.innerWidth,
            y: window.innerHeight
          };
      return {
        x: Math.random() * boundary.x,
        y: Math.random() * boundary.y
      };
    },
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
    getCollidingSides: (a, b) => {
      const collisions = {
        top: false,
        bottom: false,
        left: false,
        right: false
      };

      const ab = a.getBounds();
      const bb = b.getBounds();

      const aTop = ab.top;
      const aBottom = ab.bottom;
      const aLeft = ab.left;
      const aRight = ab.right;

      const bTop = bb.top;
      const bBottom = bb.bottom;
      const bLeft = bb.left;
      const bRight = bb.right;

      const b_collision = bBottom - aTop;
      const t_collision = aBottom - bTop;
      const l_collision = aRight - bLeft;
      const r_collision = bRight - aLeft;

      if (
        t_collision < b_collision &&
        t_collision < l_collision &&
        t_collision < r_collision
      ) {
        //Top collision
        collisions.top = true;
      }
      if (
        b_collision < t_collision &&
        b_collision < l_collision &&
        b_collision < r_collision
      ) {
        //bottom collision
        collisions.bottom = true;
      }
      if (
        l_collision < r_collision &&
        l_collision < t_collision &&
        l_collision < b_collision
      ) {
        //Left collision
        collisions.left = true;
      }
      if (
        r_collision < l_collision &&
        r_collision < t_collision &&
        r_collision < b_collision
      ) {
        //Right collision
        collisions.right = true;
      }

      return collisions;
    },
    getAngleBetweenPoints: (p1, p2) => {
      return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
    },
    getRotationBetweenPoints: (p1, p2) => {
      return Math.atan2(p2.y - p1.y, p2.x - p1.x);
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
    moveToPosition: (object, distance, rotation, initSpeed) => {
      let speed = initSpeed;
      if (!speed) {
        speed = 5;
      }
      speed /= 100;

      object.x = object.x + distance * Math.cos(rotation) * speed;
      object.y = object.y + distance * Math.sin(rotation) * speed;
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
      window.addEventListener("keypress", this.fullscreen);
    };

    fullscreen = e => {
      if (e.code == "KeyF") {
        console.log(e);
        const ele = document.documentElement;
        if (ele.requestFullscreen) {
          ele.requestFullscreen();
        } else if (ele.webkitRequestFullscreen) {
          ele.webkitRequestFullscreen();
        } else if (ele.mozRequestFullScreen) {
          ele.mozRequestFullScreen();
        } else if (ele.msRequestFullscreen) {
          ele.msRequestFullscreen();
        } else {
          console.log("Fullscreen API is not supported.");
        }
      }
    };

    onResize = () => {
      setup.debugLog("triggered onResize");
      setup.renderer.resize(window.innerWidth, window.innerHeight);
    };

    bite = e => {
      const foodGenerator = setup.background.foodGenerator;
      const bloodworms = foodGenerator.bloodworms;
      const fishes = [];

      foodGenerator.schools.forEach(school => {
        school.fishes.forEach(fish => {
          fishes.push(fish);
        });
      });

      const targets = bloodworms.concat(fishes).concat(foodGenerator.sharks);

      targets.forEach((target, targetKey) => {
        const hit = setup.getCollision(this.fish.jaw, target.pixiObj);
        if (hit && target.stats.health > 0) {
          target.addBloodSplatter(target.pixiObj);
          target.takeDamage(this.fish);
          if (target.stats.health <= 0) {
            this.fish.stats.xp += target.stats.loot.xp;
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
        // Main Fish
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
        .add("mainFishbone", "./dist/img/fish/main/fishbone.png")
        .add(
          "mainJawMediumLarge",
          "./dist/img/fish/main/mainJawMediumLarge.png"
        )
        .add("mainCaudalSmall", "./dist/img/fish/main/mainCaudalSmall.png")
        .add("fishMainDorsalFin", "./dist/img/fish/main/dorsalFin.svg")
        .add("fishMainAfterFin", "./dist/img/fish/main/afterFin.svg")
        // environment
        .add("backgroundSand", "./dist/img/background/sand.svg")
        .add("backgroundClouds_1", "./dist/img/background/bgClouds_1.png")
        .add("backgroundClouds_2", "./dist/img/background/bgClouds_2.png")
        .add("waterSurface", "./dist/img/background/waterSurface.png")
        .add("bubble", "./dist/img/environment/bubble.png")
        .add("fern", "./dist/img/environment/fern.png")
        .add("splash", "./dist/img/environment/splash.png")
        .add("island", "./dist/img/environment/land/island.svg")
        .add("pillar", "./dist/img/environment/land/pillar.png")
        .add("boulder", "./dist/img/environment/land/boulder.svg")
        .add("boulder2", "./dist/img/environment/land/boulder2.svg")
        .add("boulder3", "./dist/img/environment/land/boulder3.png")
        // filters
        .add("displacement", "./dist/img/filters/displacement.png")
        // targets
        .add("bloodworm", "./dist/img/food/bloodworm.svg")
        .add("bloodSplatter", "./dist/img/food/bloodSplatter.png")
        // fish 1
        .add("fishTargetAfter", "./dist/img/fish/enemy/1/after.svg")
        .add("fishTargetBody", "./dist/img/fish/enemy/1/body.svg")
        .add("fishTargetCaudal", "./dist/img/fish/enemy/1/caudal.svg")
        .add("fishTargetDorsal", "./dist/img/fish/enemy/1/dorsal.svg")
        .add("fishTargetJaw", "./dist/img/fish/enemy/1/jaw.png")
        .add("fishTargetPelvic", "./dist/img/fish/enemy/1/pelvic.svg")
        //fish 2
        .add("fishTargetBody2", "./dist/img/fish/enemy/2/body.svg")
        .add("fishTargetJaw2", "./dist/img/fish/enemy/2/jaw.png")
        // shark
        .add("sharkBody", "./dist/img/fish/enemy/shark/body.png")
        .add("sharkDorsal", "./dist/img/fish/enemy/shark/dorsal.svg")
        .add("sharkAfter", "./dist/img/fish/enemy/shark/after.svg")
        .add("sharkJaw", "./dist/img/fish/enemy/shark/jaw.png")
        .add("sharkPelvicLeft", "./dist/img/fish/enemy/shark/pelvicLeft.svg")
        .add("sharkPelvicRight", "./dist/img/fish/enemy/shark/pelvicRight.png")
        .add("sharkCaudal", "./dist/img/fish/enemy/shark/caudal.png")
        // UI
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

      // if fish is under water
      if (setup.checkIsUnderWater) {
        setup.isUnderWater = true;
        if (this.fish.pixiObj.direction.x == -1) {
          setup.isUnderWater =
            setup.background.waterSurface.y <=
            setup.offset.y +
              setup.renderer.screen.height / 2 -
              (this.fish.pixiObj.height / 3) *
                2 *
                this.fish.pixiObj.direction.y;
        } else {
          setup.isUnderWater =
            setup.background.waterSurface.y <=
            setup.offset.y +
              setup.renderer.screen.height / 2 -
              (this.fish.pixiObj.height / 3) *
                2 *
                this.fish.pixiObj.direction.y *
                -1;
        }
      }

      // console.log(setup.background.landGenerator.landmasses);
      let moveOffsetXLeft = true;
      let moveOffsetXRight = true;
      let moveOffsetYTop = true;
      let moveOffsetYBottom = true;
      let collidingSides;

      setup.background.landGenerator.landmasses.forEach(landmass => {
        const relPosition = {
          x: landmass.position.x - setup.offset.x,
          y: landmass.position.y - setup.offset.y
        };
        const distance = setup.getDistanceBetweenPoints(
          this.fish.pixiObj.position,
          relPosition
        );
        const collided = setup.getCollision(this.fish.body, landmass);
        if (collided) {
          collidingSides = setup.getCollidingSides(this.fish.body, landmass);
          if (collidingSides.top) {
            moveOffsetYTop = false;
          }
          if (collidingSides.bottom) {
            moveOffsetYBottom = false;
          }
          if (collidingSides.left) {
            moveOffsetXLeft = false;
          }
          if (collidingSides.right) {
            moveOffsetXRight = false;
          }
        }
      });

      if (this.fish.pixiObj.direction.x == -1 && moveOffsetXRight) {
        setup.offset.x +=
          this.fish.pixiObj.speedsRel.x * delta * this.fish.pixiObj.direction.x;
        setup.environment.position.x = setup.offset.x * -1;
      }

      if (this.fish.pixiObj.direction.x == 1 && moveOffsetXLeft) {
        setup.offset.x +=
          this.fish.pixiObj.speedsRel.x * delta * this.fish.pixiObj.direction.x;
        setup.environment.position.x = setup.offset.x * -1;
      }

      const collisionFishGround = setup.getCollision(
        setup.fish.body,
        setup.background.sand
      );
      const collisionFishWatersurface = setup.getCollision(
        setup.fish.body,
        setup.background.waterSurface
      );
      if (
        this.fish.pixiObj.direction.y == -1 &&
        moveOffsetYBottom &&
        !collisionFishWatersurface
      ) {
        setup.offset.y +=
          this.fish.pixiObj.speedsRel.y * delta * this.fish.pixiObj.direction.y;
        setup.environment.position.y = setup.offset.y * -1;
      }

      if (
        this.fish.pixiObj.direction.y == 1 &&
        moveOffsetYTop &&
        !collisionFishGround
      ) {
        setup.offset.y +=
          this.fish.pixiObj.speedsRel.y * delta * this.fish.pixiObj.direction.y;
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

      // wave movement
      setup.background.waterSurface.tilePosition.x +=
        delta * Math.random() * 10;

      if (setup.isUnderWater) {
        let runContinue = true;
        if (collidingSides) {
          if (collidingSides.left || collidingSides.right) {
            runContinue = false;
          }
        }

        if (runContinue) {
          // background movements
          setup.background.sand.tilePosition.x +=
            this.fish.pixiObj.speedsRel.x *
            delta *
            this.fish.pixiObj.direction.x *
            -1;

          setup.background.clouds1.tilePosition.x +=
            ((this.fish.pixiObj.speedsRel.x *
              delta *
              this.fish.pixiObj.direction.x) /
              3) *
            2 *
            -1;

          setup.background.clouds2.tilePosition.x +=
            ((this.fish.pixiObj.speedsRel.x *
              delta *
              this.fish.pixiObj.direction.x) /
              3) *
            1 *
            -1;
        }
      }

      // jump to other side of stage if reached limit
      // should not happen if pillars are in place
      if (
        setup.offset.x >
        setup.stageWidthHalf + setup.renderer.screen.width / 2
      ) {
        setup.offset.x *= -1;
      } else if (
        setup.offset.x <
        -setup.stageWidthHalf - setup.renderer.screen.width / 2
      ) {
        setup.offset.x *= -1;
      }

      setup.background.render(delta);

      setup.renderer.render(setup.stage);
    };
  }

  new Game();
});
