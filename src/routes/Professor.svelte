<script lang="ts">
  export let name: string;
  export let spriteName: string;
  export let x: number;
  export let y: number;
  export let moveDown: boolean;

  // Function to get the background position based on sprite name
  function getBackgroundPosition(name: string){
    switch (name) {
      case "forward":
        return "0 0";
      case "walkingforward1":
        return "-256px 0";
      case "walkingforward2":
        return "-512px 0";
      case "backward":
        return "0 -256px";
      case "walkingbackward1":
        return "-256px -256px";
      case "walkingbackward2":
        return "-512px -256px";
      case "left":
        return "0 -512px";
      case "walkingleft1":
        return "-256px -512px";
      case "walkingleft2":
        return "-512px -512px";
      case "right":
        return "0 -768px";
      case "walkingright1":
        return "-256px -768px";
      case "walkingright2":
        return "-512px -768px";
      default:
        return "0 0"; // Default to the first frame
    }
  }
</script>

<div class="sprite-container {moveDown ? 'move-down' : ''}" style="left: {x}px; --y: {y}px; background-image: url('/morales.png'); background-position: {getBackgroundPosition(spriteName)};">
  <style>
    .sprite-container {
      position: absolute;
      width: 64px;
      height: 64px;
      background-size: 192px 256px; /* Size of the entire spritesheet */
      z-index: 1000;
    }

    .move-down {
      top: calc(var(--y) + 128px); /* Move down by 64px */
    }
  </style>
</div>