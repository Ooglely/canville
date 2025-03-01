<script lang="ts">
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

<div class="pane" role="application" onmousedown={handleClickDown} onmouseup={handleClickUp} onmousemove={handleDrag}>
    {#each mock_cities as city}
        <div class="city" style="background-color: lightblue; left: {city.x + dragX + moveX}px; top: {city.y + dragY + moveY}px; "></div>
    {/each}
</div>

<style>
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
