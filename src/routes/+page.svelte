<script lang="ts">
    import type { PageProps } from "./$types";
    import type { StoredBuilding } from "$lib/server/db/city";
    import { enhance, applyAction } from "$app/forms";
    import Town from "./Town.svelte";
    import Professor from "./Professor.svelte";

    let { data, form }: PageProps = $props();

    let logged_in = $derived(data?.user);
    let log_loading = $state(false);
    let window_width = $state(0);
    let window_height = $state(0);
    console.log(data);

    let towns = $state<
        {
            name: string;
            x: number;
            y: number;
            squares: {
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
            neighbors: {
                top: boolean;
                left: boolean;
                bottom: boolean;
                right: boolean;
                topLeft: boolean;
                topRight: boolean;
                bottomLeft: boolean;
                bottomRight: boolean;
            };
            professors: {
                name: string;
                spriteName: string;
                x: number;
                y: number;
            }[];
        }[]
    >([]);
    let towncount = 0;
    let direction = 0; // 0=start, 1 = up, 2 = left, 3 = down, 4 = right
    let directioncount = 0;
    let directionlimit = 1;
    let currentX = 0;
    let currentY = 0;
    let townSpacing = 64 * 8;

    function checkNeighbors(town: {
        name: string;
        x: number;
        y: number;
        squares: {
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
    }) {
        const neighbors = {
            top: false,
            left: false,
            bottom: false,
            right: false,
            topLeft: false,
            topRight: false,
            bottomLeft: false,
            bottomRight: false,
        };

        for (const otherTown of towns) {
            if (otherTown === town) continue;

            if (otherTown.x === town.x && otherTown.y === town.y - townSpacing) {
                neighbors.top = true;
            }
            if (otherTown.x === town.x - townSpacing && otherTown.y === town.y) {
                neighbors.left = true;
            }
            if (otherTown.x === town.x && otherTown.y === town.y + townSpacing) {
                neighbors.bottom = true;
            }
            if (otherTown.x === town.x + townSpacing && otherTown.y === town.y) {
                neighbors.right = true;
            }
            if (otherTown.x === town.x - townSpacing && otherTown.y === town.y - townSpacing) {
                neighbors.topLeft = true;
            }
            if (otherTown.x === town.x + townSpacing && otherTown.y === town.y - townSpacing) {
                neighbors.topRight = true;
            }
            if (otherTown.x === town.x - townSpacing && otherTown.y === town.y + townSpacing) {
                neighbors.bottomLeft = true;
            }
            if (otherTown.x === town.x + townSpacing && otherTown.y === town.y + townSpacing) {
                neighbors.bottomRight = true;
            }
        }

        return neighbors;
    }

    function updateAllNeighbors() {
        for (const town of towns) {
            town.neighbors = checkNeighbors(town);
            console.log(`Town: ${town.name}, Neighbors: ${JSON.stringify(town.neighbors)}`);
        }
    }

    function createTown(name: string, buildings: StoredBuilding[]) {
        if (direction == 0) {
            currentX = 0;
            currentY = 0;
            direction = 1;
        } else if (direction == 1) {
            // up
            currentY -= townSpacing;
            directioncount++;
            if (directioncount == directionlimit) {
                direction = 2;
                directioncount = 0;
            }
        } else if (direction == 2) {
            // left
            currentX -= townSpacing;
            directioncount++;
            if (directioncount == directionlimit) {
                direction = 3;
                directioncount = 0;
                directionlimit++;
            }
        } else if (direction == 3) {
            // down
            currentY += townSpacing;
            directioncount++;
            if (directioncount == directionlimit) {
                direction = 4;
                directioncount = 0;
            }
        } else if (direction == 4) {
            // right
            currentX += townSpacing;
            directioncount++;
            if (directioncount == directionlimit) {
                direction = 1;
                directioncount = 0;
                directionlimit++;
            }
        }

        const squares: {
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
        }[] = [];
        const gridSize = 9;
        const spacing = 64;

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const isBorder = i === 0 || i === gridSize - 1 || j === 0 || j === gridSize - 1;
                squares.push({
                    name: isBorder ? `Border ${i * gridSize + j + 1}` : `Test ${i * gridSize + j + 1}`,
                    x: currentX + j * spacing,
                    y: currentY + i * spacing,
                    gridCoords: [i, j],
                    border: isBorder,
                    backgroundImage: "/grass.png",
                    rotateDeg: 0,
                    image: "",
                    width: 64,
                    height: 64,
                    top: 0,
                    left: 0,
                });
            }
        }

        const professors: {
            name: string;
            spriteName: string;
            x: number;
            y: number;
        }[] = [];
        for (let i = 0; i < 3; i++) {
            professors.push({
                name: `Professor ${i + 1}`,
                spriteName: "forward",
                x: 0,
                y: 0,
            });
        }

        const newTown = {
            name: `${name}'s Town`,
            x: currentX,
            y: currentY,
            squares: squares,
            neighbors: checkNeighbors({ name: `${name}'s Town`, x: currentX, y: currentY, squares: squares }),
            buildings: buildings,
            professors: professors,
        };

        towns.push(newTown);
        towncount++;
        towns = [...towns];
        console.log(`Placing town: ${name}`, currentX, currentY);

        updateAllNeighbors();
    }

    if (data.all_cities) {
        for (const city of data.all_cities) {
            createTown(city.owner.data.name.split(" ")[0], city.buildings);
        }
    }

    function addManualTown(name: string) {
        createTown(name, []);
    }

    function getAllOwnerIds() {
        return data.all_cities.map((town) => town.ownerId);
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

    function handleWindowLoad(event: Event) {
        moveX = window_width / 2 - 288;
        moveY = window_height / 2 - 288;
    }
</script>

<svelte:window onload={handleWindowLoad} bind:innerWidth={window_width} bind:innerHeight={window_height} />
<div class="pane" role="application" onmousedown={handleClickDown} onmouseup={handleClickUp} onmousemove={handleDrag} onmouseleave={handleClickUp}>
    <div class="container" style="left: {moveX + dragX}px; top: {moveY + dragY}px;">
        {#each towns as town, i}
            <Town name={town.name} x={town.x} y={town.y} squares={town.squares} neighbors={town.neighbors} buildings={town.buildings} professors={town.professors} />
        {/each}
    </div>
</div>
<div class="info">
    <span class="title-text">
        <img class="logo" src="/canvilleLogo.png" alt="Canville" />
        <h2>pickhacks 2025</h2>
    </span>
    <br />
    <h4>
        <a href="https://github.com/Ooglely/canville">github repo</a>
    </h4>
    <hr />
    {#if logged_in}
        <p>Hello {data.user?.data.name.split(" ")[0]}!</p>
    {:else}
        <p>
            you seem to be lost...<br />
            to get your own city, enter your canvas access token below.<br />
            you can go <a href="https://umsystem.instructure.com/profile/settings">here</a> to get your access token.
            <br />
        </p>
        <form
            method="POST"
            action="?/login"
            use:enhance={() => {
                log_loading = true;

                return async ({ result, update }) => {
                    log_loading = false;
                    if (result.type == "success") {
                        await applyAction(result);
                        if (form?.user) {
                            if (!getAllOwnerIds().includes(form.user.id)) {
                                addManualTown(form.user.data.name.split(" ")[0]);
                            }
                        }
                    }
                    update();
                };
            }}
        >
            <input name="token" type="text" placeholder="Canvas Access Token" />
        </form>
        {#if log_loading}
            <p>loading...</p>
        {/if}
        {#if form?.failure}
            <p>{form.error}</p>
        {/if}
    {/if}
</div>

<style>
    @font-face {
        font-family: "pgothic";
        src:
            local("ms pgothic"),
            url("/fonts/PGothic.ttf") format("truetype");
        font-display: swap;
        font-weight: lighter;
    }

    div.info {
        position: absolute;
        border: 2px black solid;
        border-radius: 5px;
        background: wheat;
        padding: 10px;
        margin: 10px;
        text-size-adjust: none;
        font-smooth: never;
        font-synthesis: none;
        font-family: "pgothic";
        z-index: 20000;
    }

    img.logo {
        height: 50px;
    }

    span.title-text {
        vertical-align: middle;
        height: 100%;
        display: inline-flex;
        align-items: flex-end;
        gap: 5px;
    }

    h1 {
        margin: 0px;
        font-size: 48px;
        display: inline;
    }

    h2 {
        margin: 0px;
        display: inline;
        padding: auto;
    }

    h4 {
        margin: 3px;
    }

    hr {
        margin: 10px 0px;
    }

    p {
        margin: 0px;
    }

    div.pane {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    div.container {
        position: absolute;
    }

    :global(body) {
        background-image: url("/void.png");
        background-size: auto;
        background-repeat: repeat;
    }
</style>
