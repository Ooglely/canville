<script lang="ts">

    // for (let i = 0; i < gridSize; i++) {
    //     for (let j = 0; j < gridSize; j++) {
    //         squares.push({
    //             name: `Test ${i * gridSize + j + 1}`,
    //             x: j * spacing,
    //             y: i * spacing,
    //         });
    //     }
    // }

    let towns = $state<{ name: string; x: number; y: number; squares: { name: string; x: number; y: number }[] }[]>([]);    let towncount = 0;
    let direction = 0; // 0=start, 1 = up, 2 = left, 3 = down, 4 = right
    let directioncount = 0;
    let directionlimit = 1;
    let currentX = 0;
    let currentY = 0;
    let townSpacing = 64 *8;

    let townName = -1 // "NAME FROM CANVAS";


    function createTown() {
        if (direction == 0) {
            currentX = 0;
            currentY = 0;
            direction = 1;
        }
        else if (direction == 1) { // up
            currentY -= townSpacing;
            directioncount++;
            if (directioncount == directionlimit) {
                direction = 2;
                directioncount = 0;
            }
        }
        else if (direction == 2) { // left
            currentX -= townSpacing;
            directioncount++;
            if (directioncount == directionlimit) {
                direction = 3;
                directioncount = 0;
                directionlimit++;
            }
        }
        else if (direction == 3) { // down
            currentY += townSpacing;
            directioncount++;
            if (directioncount == directionlimit) {
                direction = 4;
                directioncount = 0;
            }
        }
        else if (direction == 4) { // right
            currentX += townSpacing;
            directioncount++;
            if (directioncount == directionlimit) {
                direction = 1;
                directioncount = 0;
                directionlimit++;
            }
        }

        const squares: { name: string; x: number; y: number }[] = [];
        const gridSize = 7;
        const spacing = 64;

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                squares.push({
                    name: `Test ${i * gridSize + j + 1}`,
                    x: currentX + j * spacing,
                    y: currentY + i * spacing,
                });
            }
        }

        townName++; // DELETE WHEN NAMES WORK
        towns.push({
            name: `${townName}'s Town'`,
            x: currentX,
            y: currentY,
            squares: squares,
        });
        towncount++;
        towns = [...towns];
        console.log(`Placing town: ${townName}`, currentX, currentY);
    }

    for (let i = 0; i < 25; i++) {
        createTown();
        
    }

    setTimeout(() => {
        towns = [...towns];
        console.log("Forced update, towns count:", towns.length);
    }, 10);


    let dragX = $state(0);
    let dragY = $state(0);
    let initX = $state(0);
    let initY = $state(0);
    let moveX = $state(0);
    let moveY = $state(0);
    let dragState = $state(false);

    function handleClickDown(event: MouseEvent) {
        initX = event.clientX;
        initY = event.clientY;
        dragState = true;
        dragX = 0;
        dragY = 0;
    }

    function handleClickUp(event: MouseEvent) {
        dragState = false;
        moveX += dragX;
        moveY += dragY;
        dragX = 0;
        dragY = 0;
        console.log("Drag ended");
    }

    function handleDrag(event: MouseEvent) {
        if (dragState) {
            dragX = event.clientX - initX;
            dragY = event.clientY - initY;
        }
    }

    $effect(() => {
        console.log(dragX, dragY, moveX, moveY);
    });
</script>

<div class="pane" role="application" onmousedown={handleClickDown} onmouseup={handleClickUp} onmousemove={handleDrag} style="left: {dragX + moveX}px; top: {dragY + moveY}px;">
    {#each towns as town, i}
    <div class="town-marker" style="left: {town.x}px; top: {town.y}px; background-color: {i === towns.length-1 ? 'red' : 'blue'};">
        {i}
    </div>
    {#each town.squares as square}
        <div class="square" style="left: {square.x}px; top: {square.y}px;"></div>
    {/each}
{/each}
</div>

<style>
    div.square {
        color: blue;
        position: absolute;
        width: 64px;
        height: 64px;
        border: 0px solid black;
        background-image: url('/grass.png');
        background-size: cover;
        }

        div.square::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('/house.png');
        background-size: contain;
        pointer-events: none;
    }

    div.pane {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: visible;
    }
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
</style>
