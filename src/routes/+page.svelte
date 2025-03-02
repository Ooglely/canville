<script lang="ts">
    import type { PageProps } from "./$types";
    import { enhance } from "$app/forms";
    import Town from "./Town.svelte";

    let { data, form }: PageProps = $props();

    let logged_in = $derived(data?.user);
    let log_loading = $state(false);

    let towns = $state<{ name: string; x: number; y: number; squares: { name: string; x: number; y: number }[] }[]>([]);
    let towncount = 0;
    let direction = 0; // 0=start, 1 = up, 2 = left, 3 = down, 4 = right
    let directioncount = 0;
    let directionlimit = 1;
    let currentX = 0;
    let currentY = 0;
    let townSpacing = 64 * 8;

    function createTown(name: string) {
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

        towns.push({
            name: `${name}'s Town`,
            x: currentX,
            y: currentY,
            squares: squares,
        });
        towncount++;
        towns = [...towns];
        console.log(`Placing town: ${name}`, currentX, currentY);
    }

    if (data.all_users) {
        for (const user of data.all_users) {
            createTown(user.data.name.split(" ")[0]);
        }
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
</script>

<div class="pane" role="application" onmousedown={handleClickDown} onmouseup={handleClickUp} onmousemove={handleDrag} onmouseleave={handleClickUp}>
    <div class="container" style="left: {moveX + dragX}px; top: {moveY + dragY}px;">
        {#each towns as town, i}
            <Town name={town.name} x={town.x} y={town.y} squares={town.squares} />
        {/each}
    </div>
</div>
<div class="info">
    <span class="title-text">
        <h1>canville</h1>
        <h2>pickhacks 2025</h2>
    </span>
    <hr />
    {#if logged_in}
        <p>hello {data.user?.data.name.split(" ")[0]}!</p>
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

                return async ({ update }) => {
                    log_loading = false;
                    update();
                };
            }}
        >
            <input name="token" type="text" placeholder="Canvas Access Token" />
        </form>
        {#if log_loading}
            <p>loading...</p>
        {/if}
    {/if}
</div>
<div class="info">
    <span class="title-text">
        <h1>canville</h1>
        <h2>pickhacks 2025</h2>
    </span>
    <hr />
    {#if logged_in}
        <p>hello {data.user?.data.name.split(" ")[0]}!</p>
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

                return async ({ update }) => {
                    log_loading = false;
                    update();
                };
            }}
        >
            <input name="token" type="text" placeholder="Canvas Access Token" />
        </form>
        {#if log_loading}
            <p>loading...</p>
        {/if}
    {/if}
</div>

<div class=""></div>

<div class=""></div>

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

    hr {
        margin: 10px 0px;
    }

    p {
        margin: 0px;
    }

    div.square {
        color: blue;
        position: absolute;
        width: 64px;
        height: 64px;
        border: 0px solid black;
        background-image: url("/grass.png");
        background-size: cover;
    }

    div.square::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url("/house.png");
        background-size: contain;
        pointer-events: none;
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
