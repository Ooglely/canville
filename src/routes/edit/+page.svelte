<script lang="ts">
    import type { PageProps } from "./$types";
    import Item from "./Item.svelte";

    let { data }: PageProps = $props();

    let selection = $state("none");
    let selectedX = $state(-1);
    let selectedY = $state(-1);
    let buildings = $state(data.buildings);
    let grid: HTMLElement;

    if (data) {
        console.log(data.buildings);
    }

    function handlePlacement(event: MouseEvent) {
        if (event.target == grid) {
            const chosenX = Math.floor(event.layerX / 64) * 64;
            const chosenY = Math.floor(event.layerY / 64) * 64;
            console.log(chosenX, chosenY);
            selectedX = chosenX;
            selectedY = chosenY;
        }
    }

    async function submit() {
        if (selection == "none" || selectedX == -1 || selectedY == -1 || !data.user) {
            return;
        }
        // TODO: check gold and db submission
        let selected_item = data.store.find((item) => item.itemname === selection);
        console.log(selected_item);

        const response = await fetch("/api/edit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                city: data.user.cities,
                item: selected_item,
                x: selectedX,
                y: selectedY,
            }),
        });
        const result = await response.json();
        console.log(result);
        if (buildings) {
            buildings.push(result);
        }
    }
</script>

<div class="edit">
    <div class="grid">
        <button class="town" aria-label="Town" onclick={handlePlacement} bind:this={grid}>
            {#if selectedX > -1}
                <div class="box" style="left: {selectedX - 2}px; top: {selectedY - 2}px; z-index: 1000"></div>
            {/if}
            {#each buildings as building}
                <img src={building.sprite} alt="building" width={building.width} style="left: {building.x}px; bottom: {448 - building.y}px; z-index: {100 + building.y}" />
            {/each}
        </button>
        <div class="selection">
            selection: {selection}
            <button onclick={submit}>Place</button>
        </div>
    </div>
    <div class="store">
        {#each data.store as item}
            <Item {...item} bind:selection />
        {/each}
    </div>
</div>

<style>
    .edit {
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
        height: 100vh;
        align-items: center;
    }

    .grid {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .grid img {
        position: absolute;
    }

    .box {
        width: 64px;
        height: 64px;
        border: 2px solid yellow;
        position: absolute;
    }

    .selection {
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

    .town {
        flex-shrink: 0;
        width: 448px;
        height: 448px;
        border: 2px solid black;
        background-image: url("/grass.png");
        background-size: 64px 64px;
    }

    .store {
        /* position: relative; */
        border: 2px black solid;
        border-radius: 5px;
        background: wheat;
        padding: 5px;
        margin: 10px;
        text-size-adjust: none;
        font-smooth: never;
        font-synthesis: none;
        font-family: "pgothic";
        z-index: 100;
        overflow-y: scroll;
        margin: 20px;
        max-height: calc(100% - 40px);
    }

    :global(body) {
        background-image: url("/void.png");
        background-size: auto;
        background-repeat: repeat;
    }
</style>
