<script lang="ts">
  export let name: string;
  export let spriteName: string;
  export let x: number;
  export let y: number;
  export let moveDown: boolean;

  let currentFrame = 0;
  const frames = ["forward", "walkingforward1", "walkingforward2", "backward", "walkingbackward1", "walkingbackward2", "left", "walkingleft1", "walkingleft2", "right", "walkingright1", "walkingright2"];
  const downFrames = ["walkingforward1", "walkingforward2"];
  let interval;

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
    } else {
      currentFrame = (currentFrame + 1) % frames.length;
      spriteName = frames[currentFrame];
    }
  }

</script>

<div class="sprite-container {moveDown ? 'move-down' : ''} {moveDown ? 'walking' : ''}" style="left: {x}px; --y: {y}px; background-image: url('/morales.png'); background-position: {getBackgroundPosition(spriteName)};">
  <style>
    .sprite-container {
      position: absolute;
      width: 64px;
      height: 64px;
      background-size: 192px 256px; /* Size of the entire spritesheet */
      z-index: 1000;
      transition: top 10s linear;
      top: var(--y);
    }

    .move-down {
      top: calc(var(--y) + 512px); 
    }

  </style>
</div>