<!-- CanvasGame.vue -->
<template>
  <canvas id="myCanvas" ref="canvas" width="700" height="400" :style="canvasStyle" class="gameCanvas"></canvas>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from 'vue';

interface gameInfo {
  paddle1: number,
  paddle2: number,
  ballX: number,
  ballY: number,
};

var gcanvas: HTMLCanvasElement | null;
export default defineComponent({
  props: {
    ctx: {
      type: Object as () => gameInfo,
      required: true,
    }
  },
setup(props) {
    const canvasStyle = {
      borderRadius: '20px',
      width: '100%',
      height: '100%',
    };
    const canvasRef = ref<HTMLCanvasElement | null>(null);

    watch(
      () => props.ctx, // Watch for changes in ctx prop
      (newValue, oldValue) => {
        console.log("REFRESH");
        console.log("AFTER MOUNTED", gcanvas);
        const context = gcanvas!.getContext('2d');
        console.log("Context", context)
        if (!context) return;

        console.log("CONTEXT");
        const themeColor = localStorage.getItem('theme') || '#229964';
        const ballColor = localStorage.getItem('ball') || 'white';

        context.clearRect(0, 0, gcanvas!.width, gcanvas!.height);

        context.fillStyle = themeColor;
        context.fillRect(0, 0, gcanvas!.width, gcanvas!.height);

        context.setLineDash([5, 5]);

        const middleX = gcanvas!.width / 2;

        context.beginPath();
        context.moveTo(middleX, 0);
        context.lineTo(middleX, gcanvas!.height);
        context.strokeStyle = 'white';
        context.stroke();

        context.setLineDash([]);

        const ratio_y = gcanvas!.height / 100;
        const ratio_x = gcanvas!.width / 200;

        const p1 = (newValue.paddle1 + 50) * ratio_y;
        const p2 = (newValue.paddle2 + 50) * ratio_y;
        const ph = 20 * ratio_y;
        const pw = 3 * ratio_x;

        const bX = (newValue.ballX + 100) * ratio_x;
        const bY = (newValue.ballY + 50) * ratio_y;
        const br = 8;

        context.fillStyle = 'white';
        context.fillRect(0, p1 - ph / 2, pw, ph);

        context.fillStyle = 'white';
        context.fillRect(gcanvas!.width - pw, p2 - ph / 2, pw, ph);

        context.fillStyle = ballColor;
        context.beginPath();
        context.arc(bX, bY, br, 0, Math.PI * 2);
        context.fill();
      },
      { immediate: false } // Trigger the watcher immediately on component mount
    );

    return { canvasStyle, canvasRef };
  },
    mounted() {
    //const canvas = this.$refs.canvas;
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    const themeColor = localStorage.getItem('theme') || '#0273d4';
    const ballColor = localStorage.getItem('ball') || 'white';

    if (!context) return;

    context.fillStyle = themeColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.setLineDash([5, 5]);

    const middleX = canvas.width / 2;

    context.beginPath();
    context.moveTo(middleX, 0);
    context.lineTo(middleX, canvas.height);
    context.strokeStyle = 'white';
    context.stroke();

    context.setLineDash([]);

    const ratio_y = canvas.height / 100;
    const ratio_x = canvas.width / 200;

    const p1 = (this.ctx.paddle1 + 50) * ratio_y;
    const p2 = (this.ctx.paddle2 + 50) * ratio_y;
    const ph = 20 * ratio_y;
    const pw = 3 * ratio_x;

    const bX = (this.ctx.ballX + 100) * ratio_x;
    const bY = (this.ctx.ballY + 50) * ratio_y;
    const br = 8;

    context.fillStyle = 'white';
    context.fillRect(0, p1 - ph / 2, pw, ph);

    context.fillStyle = 'white';
    context.fillRect(canvas.width - pw, p2 - ph / 2, pw, ph);

    context.fillStyle = ballColor;
    context.beginPath();
    context.arc(bX, bY, br, 0, Math.PI * 2);
    context.fill();
    gcanvas = canvas;
        console.log("BEFORE MOUNTED", gcanvas);

  }


});
</script>

<style scoped>
.gameCanvas {
  display: block; /* Ensures the canvas behaves as a block element */
}
</style>
