import "./style.css";
import Phaser from "phaser";

const sizes = {
  width: 500,
  height: 500,
};

const speedDown = 500;

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.playerSpeed = speedDown + 100;
    this.target;
    this.points = 0;
    this.textScore;
  }

  preload() {
    this.load.image("bg", "/assets/bg.png");
    this.load.image("basket", "/assets/basket.png");
    this.load.image("apple", "/assets/apple.png");
  }
  create() {
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    this.player = this.physics.add.image(0, 0, "basket").setOrigin(-2, -5);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);

    //setting the size of the player collider
    this.player.setSize(60, 15).setOffset(20, 70);

    this.target = this.physics.add.image(0, 0, "apple").setOrigin(0, 0);
    this.target.setMaxVelocity(0, speedDown);
    this.target.body.allowGravity = true;
    this.player.setCollideWorldBounds(true);

    this.physics.add.overlap(
      this.target,
      this.player,
      this.targetHit,
      null,
      this
    );

    this.cursor = this.input.keyboard.createCursorKeys();

    this.textScore = this.add.text(sizes.width - 120, 10, "Score:0", {
      font: "25px Arial",
      fill: "#000000",
    });
  }
  update() {
    if (this.target.y >= sizes.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX());
    }

    const { left, right } = this.cursor;

    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
  }

  getRandomX() {
    return Math.floor(Math.random() * 500);
  }

  targetHit() {
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.points++;
    this.textScore.setText(`Score: ${this.points}`);
  }
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: true,
    },
  },
  scene: [GameScene],
};

const game = new Phaser.Game(config);
