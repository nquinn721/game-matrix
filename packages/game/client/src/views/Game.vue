<template>
  <div class="home">
    <canvas id="game" width="800" height="600" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class Home extends Vue {
  mounted() {
    const canvas = document.getElementById("game");
    // @ts-ignore
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(100, 100, 100, 100);
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
