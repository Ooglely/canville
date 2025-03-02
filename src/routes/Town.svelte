<script lang="ts">
  export let name: string;
  export let x: number;
  export let y: number;
  export let squares: { name: string; x: number; y: number }[]; //image: string; width: number; height: number; top: number; left: number
</script>

<div class="town-marker" style="left: {x}px; top: {y}px;">
  {name}
</div>
{#each squares as square}
  <div class="square" style="left: {square.x}px; top: {square.y}px;"></div>
{/each}

<style>
  .town-marker {
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
      z-index: 1000;
  }

  .square {
      color: blue;
      position: absolute;
      width: 64px;
      height: 64px;
      border: 0px solid black;
      background-image: url('/grass.png');
      background-size: cover;
  }

  .square::after {
      content: '';
      position: absolute;
      top: -64px;
      left: 0;
      width: 100%;
      height: 200%;
      background-image: url('/flowerTree.png');
      background-size: cover;
      background-position: center;

  }
</style>