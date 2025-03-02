<script lang="ts">
    import type { StoredBuilding } from "$lib/server/db/city";

    export let name: string;
    export let x: number;
    export let y: number;
    export let neighbors: { top: boolean; left: boolean; bottom: boolean; right: boolean; topLeft: boolean; topRight: boolean; bottomLeft: boolean; bottomRight: boolean };
    export let squares: {
        name: string;
        x: number;
        y: number;
        border: boolean;
        backgroundImage: string;
        rotateDeg: number;
        gridCoords: [number, number];
        image: string;
        width: number;
        height: number;
        top: number;
        left: number;
    }[];
    export let buildings: StoredBuilding[];

    squares.forEach((square) => {
        if (square.border) {
            let cornerType = "";
            let neighborCount = 0;
            if (
                (square.gridCoords[0] === 0 && square.gridCoords[1] === 0) || // top left
                (square.gridCoords[0] === 8 && square.gridCoords[1] === 0) || // top right
                (square.gridCoords[0] === 0 && square.gridCoords[1] === 8) || // bottom left
                (square.gridCoords[0] === 8 && square.gridCoords[1] === 8) // bottom right
            ) {
                if (square.gridCoords[0] === 0 && square.gridCoords[1] === 0) {
                    cornerType = "top left";
                    if (neighbors.top) {
                        neighborCount++;
                    }
                    if (neighbors.left) {
                        neighborCount++;
                    }
                    if (neighbors.topLeft) {
                        neighborCount++;
                    }
                } else if (square.gridCoords[0] === 8 && square.gridCoords[1] === 0) {
                    cornerType = "bottom left";
                    if (neighbors.bottom) {
                        neighborCount++;
                    }
                    if (neighbors.left) {
                        neighborCount++;
                    }
                    if (neighbors.bottomLeft) {
                        neighborCount++;
                    }
                } else if (square.gridCoords[0] === 0 && square.gridCoords[1] === 8) {
                    cornerType = "top right";
                    if (neighbors.top) {
                        neighborCount++;
                    }
                    if (neighbors.right) {
                        neighborCount++;
                    }
                    if (neighbors.topRight) {
                        neighborCount++;
                    }
                } else if (square.gridCoords[0] === 8 && square.gridCoords[1] === 8) {
                    cornerType = "bottom right";
                    if (neighbors.bottom) {
                        neighborCount++;
                    }
                    if (neighbors.right) {
                        neighborCount++;
                    }
                    if (neighbors.bottomRight) {
                        neighborCount++;
                    }
                }
                console.log(`Town: ${name}, Corner Type: ${cornerType}, Neighbors: ${JSON.stringify(neighbors)}, Neighbor Count: ${neighborCount}`);
                let imagePath = "/pathCorner.png";
                if (neighborCount === 1) {
                    imagePath = "/pathThreeway.png";
                } else if (neighborCount >= 2) {
                    imagePath = "/pathIntersection.png";
                }

                // if (cornerType === "bottom left"){
                //   imagePath = "/coin.png";
                // }

                if (neighborCount < 2) {
                    switch (`${square.gridCoords[0]},${square.gridCoords[1]}`) {
                        case "8,0":
                            square.rotateDeg = 270;
                            break;
                        case "8,8":
                            square.rotateDeg = 180;
                            break;
                        case "0,8":
                            square.rotateDeg = 90;
                            break;
                        default:
                            square.rotateDeg = 0;
                    }
                }
                square.backgroundImage = imagePath;
            } else if (square.gridCoords[0] === 0 || square.gridCoords[0] === 8) {
                square.backgroundImage = "/pathHorizontal.png";
            } else if (square.gridCoords[1] === 8 || square.gridCoords[1] === 0) {
                square.backgroundImage = "/pathVertical.png";
            }
        } else {
            square.image = "";
        }
    });
</script>

<div class="town" style="left: {x}px; top: {y}px;">
    {#each buildings as building}
        <img src={building.sprite} alt="building" width={building.width} style="left: {building.x + 64}px; bottom: {448 - building.y}px; z-index: {100 + building.y}" />
    {/each}
    {#each squares as square}
        <div class="square" style="left: {square.x - x}px; top: {square.y - y}px; background-image: url({square.backgroundImage}); transform: rotate({square.rotateDeg}deg);">
            <div style="top: {square.top}px; left: {square.left}px; width: {square.width}px; height: {square.height}px; background-image: url({square.image});"></div>
        </div>
    {/each}
    <div class="town-marker" style="">
        {name}
    </div>
</div>

<style>
    .town {
        position: absolute;
        width: 576px;
        height: 576px;
        background-image: url("/grass.png");
        background-size: 64px 64px;
        border: 0px black solid;
    }

    .town img {
        position: absolute;
    }

    .town-marker {
        position: relative;
        border: 2px black solid;
        border-radius: 5px;
        background: wheat;
        left: 50%;
        top: calc(100% - 64px);
        width: fit-content;
        transform: translate(-50%, -50%);
        height: 84px;
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
        background-size: cover;
    }

    .square::after {
        content: "";
        position: absolute;
        background-size: cover;
        background-position: center;
    }
</style>
