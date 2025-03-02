<script lang="ts">
  import { onMount } from 'svelte';
  export let name: string;
  export let spriteName: string;
  export let x: number;
  export let y: number;
  export let moveDown: boolean;
  export let moveUp: boolean;
  export let moveLeft: boolean;
  export let moveRight: boolean;
  let currentPosition: [number, number] = [0, 0];
  let moveInProgress = false;

  let currentFrame = 0;
  const frames = ["forward", "walkingforward1", "walkingforward2", "backward", "walkingbackward1", "walkingbackward2", "left", "walkingleft1", "walkingleft2", "right", "walkingright1", "walkingright2"];
  const downFrames = ["walkingforward1", "walkingforward2"];
  const upFrames = ["walkingbackward1", "walkingbackward2"];
  const leftFrames = ["walkingleft1", "walkingleft2"];
  const rightFrames = ["walkingright1", "walkingright2"];
  let interval: number;
  let lastDirection = "down";

  // Function to get the background position based on sprite name
  function getBackgroundPosition(name: string){
    switch (name) {
      case "forward":
        return "0 0";
      case "walkingforward1":
        return "-64px 0";
      case "walkingforward2":
        return "-128px 0";
      case "backward":
        return "0 -64px";
      case "walkingbackward1":
        return "-64px -64px";
      case "walkingbackward2":
        return "-128px -64px";
      case "left":
        return "0 -128px";
      case "walkingleft1":
        return "-64px -128px";
      case "walkingleft2":
        return "-128px -128px";
      case "right":
        return "0 -192px";
      case "walkingright1":
        return "-64px -192px";
      case "walkingright2":
        return "-128px -192px";
      default:
        return "0 0"; // Default to the first frame
    }
  }

  function nextFrame(){
    if (moveDown) {
      currentFrame = (currentFrame + 1) % downFrames.length;
      spriteName = downFrames[currentFrame];
    } else if (moveUp) {
      currentFrame = (currentFrame + 1) % upFrames.length;
      spriteName = upFrames[currentFrame];
    } else if (moveLeft) {
      currentFrame = (currentFrame + 1) % leftFrames.length;
      spriteName = leftFrames[currentFrame];
    } else if (moveRight) {
      currentFrame = (currentFrame + 1) % rightFrames.length;
      spriteName = rightFrames[currentFrame];
    } else {
      currentFrame = (currentFrame + 1) % frames.length;
      spriteName = frames[currentFrame];
    }
  }

  function move_Down() {
    moveDown = true;
    moveInProgress = true;
    currentPosition = [currentPosition[0], currentPosition[1] + 1];
    setTimeout(() => {
      y+= 512;
      moveDown = false;
      moveInProgress = false;
      lastDirection = "down";
    }, 10000); // Stop the animation after 10 seconds
  }

  function move_Up() {
    moveUp = true;
    moveInProgress = true;
    currentPosition = [currentPosition[0], currentPosition[1] - 1];
    setTimeout(() => {
      y-= 512;
      moveUp = false;
      moveInProgress = false;
      lastDirection = "up";
    }, 10000); // Stop the animation after 10 seconds
  }

  function move_Left() {
    moveLeft = true;
    moveInProgress = true;
    currentPosition = [currentPosition[0] - 1, currentPosition[1]];
    setTimeout(() => {
      x-= 512;
      moveLeft = false;
      moveInProgress = false;
      lastDirection = "left";
    }, 10000); // Stop the animation after 10 seconds
  }

  function move_Right() {
    moveRight = true;
    moveInProgress = true;
    currentPosition = [currentPosition[0] + 1, currentPosition[1]];
    setTimeout(() => {
      x+= 512;
      moveRight = false;
      moveInProgress = false;
      lastDirection = "right";
    }, 10000); // Stop the animation after 10 seconds
  }

  function pickMove() {
    if (!moveInProgress) {
        if (currentPosition[0] === 0 && currentPosition[1] === 0) {
          let moves = [move_Down, move_Right];
          moves[Math.floor(Math.random() * moves.length)]();
        } else if (currentPosition[0] === 0 && currentPosition[1] === 1) {
          let moves = [move_Up, move_Right];
          moves[Math.floor(Math.random() * moves.length)]();
        } else if (currentPosition[0] === 1 && currentPosition[1] === 1) {
          let moves = [move_Up, move_Left];
          moves[Math.floor(Math.random() * moves.length)]();
        } else if (currentPosition[0] === 1 && currentPosition[1] === 0) {
          let moves = [move_Down, move_Left];
          moves[Math.floor(Math.random() * moves.length)]();
        }
      }
    }


  $: {
    clearInterval(interval);
    if (moveDown || moveUp || moveLeft || moveRight) {
      interval = setInterval(nextFrame, 333); // Switch frames every 333ms (3 frames per second)
    } else {
        if (lastDirection === "down") {
          spriteName = "forward";
        } else if (lastDirection === "up") {
          spriteName = "backward";
        } else if (lastDirection === "left") {
          spriteName = "left";
        } else if (lastDirection === "right") {
          spriteName = "right";
        }
        setTimeout(pickMove, Math.random() * 9000 + 1000); // Random time between 1 to 10 seconds
      }
    }
  
  let selectedSkin: string;

  onMount(() => {
    const skins = ['morales', 'taylor', 'gosnell'];
    selectedSkin = skins[Math.floor(Math.random() * skins.length)];
  });

</script>

<div class="sprite-container {moveDown ? 'move-down' : ''} {moveUp ? 'move-up' : ''} {moveLeft ? 'move-left' : ''} {moveRight ? 'move-right' : ''}" style=" --y: {y}px; --x: {x}px; background-image: url('/{selectedSkin}.png'); background-position: {getBackgroundPosition(spriteName)};"></div>
<style>
  .sprite-container {
    position: absolute;
    width: 64px;
    height: 64px;
    background-size: 192px 256px; /* Size of the entire spritesheet */
    z-index: 100;
    transition: top 10s linear, left 10s linear;
    top: var(--y);
    left: var(--x);
  }

  .move-down {
    top: calc(var(--y) + 512px); 
  }
  .move-up {
    top: calc(var(--y) - 512px); 
  }
  .move-left {
    left: calc(var(--x) - 512px); 
  }
  .move-right {
    left: calc(var(--x) + 512px); 
  }
</style>