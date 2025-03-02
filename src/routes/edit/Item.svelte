<script lang="ts">
    interface Props {
        itemname: string;
        sprite: string;
        cost: number;
        description: string;
        width: number;
        height: number;
        selection: string;
    }

    let { itemname, sprite, cost, description, width, height, selection = $bindable() }: Props = $props();
</script>

<div class="item">
    <div class="info">
        <img src={sprite} alt={itemname} />
        <div class="name">
            <h1>{itemname}</h1>
            <p>{description}</p>
        </div>
    </div>
    <div class="details">
        <p>Cost: {cost}</p>
    </div>
    <button class="select" onclick={() => (selection = itemname)}> Select </button>
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

    .item {
        height: 100px;
        max-height: 100px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        font-family: "pgothic";
    }

    .item .info {
        margin-left: 16px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .item h1 {
        margin: 0px;
    }

    .item p {
        margin: 0px;
    }

    .item img {
        width: 100px;
    }

    .item .info {
        margin-left: 16px;
        display: flex;
        flex-direction: row;
    }
</style>
