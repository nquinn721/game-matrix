<template>
  <div class="home">
    <canvas id="game" width="800" height="600" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Main } from "../store/main";
console.log(Main.objects);

@Options({})
export default class Home extends Vue {
  mounted() {
    const canvas: any = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    Main.objects.forEach((v) => {
      ctx.fillRect(v.x, v.y, v.w, v.h);
    });
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
