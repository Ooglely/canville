<script lang="ts">
    export let name: string;
    export let x: number;
    export let y: number;
    export let squares: { name: string; x: number; y: number }[]; //image: string; width: number; height: number; top: number; left: number
</script>

<div class="town" style="left: {x}px; top: {y}px;">
    {#each squares as square}
        <div class="square" style="left: {square.x - x}px; top: {square.y - y}px;"></div>
    {/each}
    <div class="town-marker" style="">
        {name}
    </div>
</div>

<style>
    .town {
        position: absolute;
        width: 448px;
        height: 448px;
        background-image: url("/grass.png");
        background-size: cover;
        border: 2px black solid;
    }

    .town-marker {
        position: relative;
        border: 2px black solid;
        border-radius: 5px;
        background: wheat;
        left: 50%;
        top: 100%;
        width: fit-content;
        transform: translate(-50%, -50%);
        height: 20px;
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: black;
        font-size: 10px;
        z-index: 10;
        font-family: "pgothic";
        font-size: 14px;
        padding: 2px 5px;
    }

    .square {
        color: blue;
        position: absolute;
        width: 64px;
        height: 64px;
        border: 0px solid black;
        background-image: url("/grass.png");
        background-size: cover;
    }

    .square::after {
        content: "";
        position: absolute;
        top: -64px;
        left: 0;
        width: 100%;
        height: 200%;
        background-image: url("/flowerTree.png");
        background-size: cover;
        background-position: center;
    }
</style>
