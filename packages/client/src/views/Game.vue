<template>
  <div class="home">
    <button @click="addPlayer">Add Player</button>
    <canvas id="game" :width="width" :height="height" />
  </div>
</template>

<script lang="ts">
import { Service } from "mobx-store-model/lib";
import { Options, Vue } from "vue-class-component";
Service.setBaseUrl("http://localhost:5000");

@Options({})
export default class Home extends Vue {
  public width = 800;
  public height = 500;
  public game: any = {};
  public canvas: any;
  public ctx: any;
  async mounted() {
    this.canvas = document.getElementById("game");
    this.ctx = this.canvas.getContext("2d");
    const g = await Service.get("/");
    this.game = g;
    console.log(g);

    this.width = this.game.w;
    this.height = this.game.h;
    setTimeout(() => {
      this.ctx.fillStyle = "white";
      this.ctx.beginPath();
      for (let i = 1; i < this.game.rows; i++) {
        this.ctx.moveTo(i * this.game.segmentSize, 0);
        this.ctx.lineTo(i * this.game.segmentSize, this.height);
      }
      for (let j = 1; j < this.game.cols; j++) {
        this.ctx.moveTo(0, j * this.game.segmentSize);
        this.ctx.lineTo(this.width, j * this.game.segmentSize);
      }
      this.ctx.strokeStyle = "white";
      this.ctx.stroke();
      this.start();
    }, 100);
  }

  async addPlayer() {
    const player = await Service.get("/create-player");
    console.log(player);

    this.game.players.push(player);
  }

  start() {
    setInterval(() => {
      this.game.players.forEach((v: any) => {
        this.ctx.fillRect(v.x, v.y, v.w, v.h);
      });
    }, 1000 / 60);
  }
}
</script>
<style lang="scss">
.home {
  background: #222;
}
canvas {
  background: black;
}
</style>
