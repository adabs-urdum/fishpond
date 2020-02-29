"use strict";

import "babel-polyfill";
import WebFont from "webfontloader";
import * as PIXI from "pixi.js";
import Fish from "./Characters/Fish.js";

Array.prototype.getRandomValue = inputArray => {
  return inputArray[Math.floor(Math.random() * inputArray.length)];
};

document.addEventListener("DOMContentLoaded", function() {
  const fontFamily = "Schoolbell";

  const debug = true;
  const setup = {
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
      setup.loader = new PIXI.Loader();
      this.preloadAssets();
    }

    bindEvents = () => {
      window.addEventListener("resize", this.onResize);
      window.addEventListener("click", this.biteAnimtion);
    };

    onResize = () => {
      setup.debugLog("triggered onResize");
    };

    biteAnimtion = e => {
      this.fish.jaw.play();
    };

    preloadReady = () => {
      this.fish = new Fish(setup);

      this.ticker = new PIXI.Ticker();
      this.ticker.add(this.animate);
      this.ticker.start();

      this.ticker.add(this.test);

      this.bindEvents();
    };

    test = () => {
      // Its the same thing, but in milliseconds. If you want "300 pixels per second" you use "0.3 * elapsedMs" , and if you want "5 pixels per frame" you use "5 * deltaTime"
      // if (this.fpsText) {
      //   this.fpsText.x -= (window.innerWidth / 1000) * this.ticker.elapsedMS;
      // }
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
        .load();

      // throughout the process multiple signals can be dispatched.
      setup.loader.onProgress.add(() => {}); // called once per loaded/errored file
      setup.loader.onError.add(() => {}); // called once per errored file
      setup.loader.onLoad.add((a, resource, c) => {
        setup.debugLog("Done Loading: " + resource.name);
      }); // called once per loaded file
      setup.loader.onComplete.add(this.preloadReady); // called once when the queued resources all load.
    };

    animate = () => {
      if (debug) {
        this.updateFpsText();
      }

      this.fish.render();

      setup.renderer.render(setup.stage);
    };
  }

  new Game();
});
