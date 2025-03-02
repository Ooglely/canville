<script lang="ts">
    import type { PageProps } from "./$types";
    import { enhance } from "$app/forms";

    let { data, form }: PageProps = $props();

    let logged_in = $derived(data?.user);
    let log_loading = $state(false);

    const mock_cities = [
        {
            name: "Test A",
            x: 0,
            y: 0,
        },
        {
            name: "Test B",
            x: 100,
            y: 100,
        },
        {
            name: "Test C",
            x: 100,
            y: 0,
        },
    ];

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

<div class="pane" role="application" onmousedown={handleClickDown} onmouseup={handleClickUp} onmousemove={handleDrag} onmouseleave={handleClickUp}>
    {#each mock_cities as city}
        <div class="city" style="background-color: lightblue; left: {city.x + dragX + moveX}px; top: {city.y + dragY + moveY}px; "></div>
    {/each}
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

    div.city {
        color: blue;
        position: absolute;
        width: 98px;
        height: 98px;
        border: 1px solid black;
    }

    div.pane {
        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>
