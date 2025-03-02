<script lang="ts">
    import { onMount } from "svelte";
    import type { PageProps } from "./$types";
    import Item from "./Item.svelte";

    let { data }: PageProps = $props();

    let selection = $state("none");
    let selectedX = $state(-1);
    let selectedY = $state(-1);
    let selectedWidth = $state(-1);
    let selectedHeight = $state(-1);
    let buildings = $state(data.buildings);
    let occupied = $derived.by(() => {
        let points: Set<[number, number]> = new Set();
        for (let building of buildings) {
            for (let point of calculatePoints(building.x, building.y, building.width, building.height, true)) {
                points.add(point);
            }
        }
        return points;
    });
    let gold = $state(data.user?.cities.citymoney);
    let updating = $state(false);
    let grid: HTMLElement;

    function pointCheck(occupied: Set<[number, number]>, points: Set<[number, number]>) {
        for (let point of points) {
            for (let occupiedPoint of occupied) {
                if (occupiedPoint[0] == point[0] && occupiedPoint[1] == point[1]) return false;
            }
        }
        return true;
    }

    function handlePlacement(event: MouseEvent) {
        if (event.target == grid) {
            const chosenX = Math.floor(event.layerX / 64) * 64;
            const chosenY = Math.floor(event.layerY / 64) * 64;
            console.log(chosenX, chosenY);
            if (selection != "none") {
                let selected_item = data.store.find((item) => item.itemname === selection);
                if (selected_item) {
                    let placement_points = calculatePoints(chosenX, chosenY, selected_item.width, selected_item.height, false);
                    console.log(placement_points, occupied);
                    if (!pointCheck(occupied, placement_points)) return;
                    for (let point of placement_points) {
                        if (point[0] > 384 || point[1] > 384) return;
                        if (point[0] < 0 || point[1] < 0) return;
                    }
                    selectedX = chosenX;
                    selectedY = chosenY;
                    selectedWidth = selected_item.width;
                    selectedHeight = selected_item.height;
                }
            }
        }
    }

    function calculatePoints(x: number, y: number, width: number, height: number, inverted: boolean) {
        let points: Set<[number, number]> = new Set();
        if (inverted) {
            for (let i = 0; i < width; i += 64) {
                for (let j = 0; j < height; j += 64) {
                    points.add([x + i, y - j]);
                }
            }
        } else {
            for (let i = 0; i < width; i += 64) {
                for (let j = 0; j < height; j += 64) {
                    points.add([x + i, y + j]);
                }
            }
        }
        return points;
    }

    async function submit() {
        if (selection == "none" || selectedX == -1 || selectedY == -1 || !data.user) {
            return;
        }
        let selected_item = data.store.find((item) => item.itemname === selection);
        if (selected_item && selected_item.cost > gold) {
            alert("Not enough gold!");
            return;
        }
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
        selectedX = -1;
        selectedY = -1;
        console.log(result);
        if (buildings) {
            buildings.push(result);
        }
        if (selected_item) {
            gold -= selected_item.cost;
        }
    }

    async function updateGold(city_id: number) {
        console.log("calling");
        updating = true;
        const response = await fetch("/api/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                city_id: city_id,
            }),
        });
        const data = await response.json();
        console.log(data);
        updating = false;
        gold = data.cash;
    }

    onMount(() => {
        console.log(data);
        if (!data.user.token.startsWith("dummy_")) {
            updateGold(data.user.cities.cityid);
        }
    });
</script>

<div class="edit">
    <div class="grid">
        <button class="town" aria-label="Town" onclick={handlePlacement} bind:this={grid}>
            {#if selectedX > -1}
                <div class="box" style="left: {selectedX - 2}px; top: {selectedY - 2}px; z-index: 1000; width: {selectedWidth}px; height: {selectedHeight}px;"></div>
            {/if}
            {#each buildings as building}
                <img src={building.sprite} alt="building" width={building.width} style="left: {building.x}px; bottom: {448 - building.y}px; z-index: {100 + building.y}" />
            {/each}
        </button>
        <div class="selection">
            selection: {selection} gold: {gold}
            <button onclick={submit}>Place</button>
            {#if updating}
                checking for new assignments...
            {/if}
        </div>
    </div>
    <div class="store">
        {#each data.store as item}
            <Item {...item} bind:selection />
        {/each}
    </div>
</div>

<button class="top-left-button" onclick={() => window.location.href = '/'}>
    <img src="/xIcon.png" alt="Close" />
</button>



<style>
    .top-left-button {
        position: absolute;
        top: 10px;
        left: 10px;
        background: none;
        border: none;
        cursor: pointer;
    }

    .top-left-button img {
        width: 48px;
        height: 48px;
    }
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
