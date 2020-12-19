<script>
    import {getMiddleArray} from '../utilis/global';
    import { createEventDispatcher, onMount } from 'svelte';
    $: checkDevice = false;
    export let currentPage;
    export let last_page;
    export let middleCount = 3;
    export let middle;
    export let pagesArray = [];
    onMount(() => {
        if(document.documentElement.clientWidth < 767){
            checkDevice = true;
        }
        if ((middleCount % 2) !== 0) {
            middle = (middleCount - 1) / 2;
        } else {
            middle = middleCount / 2
        }
        pagesArray = getMiddleArray(last_page , middle , currentPage)
    })
    const dispatch = createEventDispatcher();
    function changePage(page){
        if (page !== currentPage) {
            dispatch('changePage', page);
        }
        pagesArray = getMiddleArray(last_page , middle , page)
    }

</script>
<style>

</style>
<nav class:is-small={checkDevice} class="pagination is-rounded is-centered" role="navigation" aria-label="pagination">
    <ul class="pagination-list">
        {#if currentPage !== 1}
            <!-- svelte-ignore a11y-missing-attribute -->
            <li><a on:click={() => changePage(currentPage - 1)} class="pagination-previous">«</a></li>
        {/if}
            <!-- svelte-ignore a11y-missing-attribute -->
            <li><a on:click={() => changePage(1)} class="pagination-link" class:is-current={currentPage == 1}>1</a></li>
        {#if (currentPage - middle) > (middle) }
            <li><span>...</span></li>
        {/if}
        {#each pagesArray as page}
            <!-- svelte-ignore a11y-missing-attribute -->
            <li><a on:click={() => changePage(page)} class="pagination-link" class:is-current={page == currentPage}>{page}</a></li>
        {/each}
        {#if (last_page - currentPage) > (middle + 1) }
            <li><span>...</span></li>
        {/if}
        <!-- svelte-ignore a11y-missing-attribute -->
        <li><a on:click={() => changePage(last_page)} class="pagination-link" class:is-current={currentPage == last_page}>{last_page}</a></li>
        {#if currentPage !== last_page}
            <!-- svelte-ignore a11y-missing-attribute -->
            <li><a on:click={() => changePage(currentPage + 1)} class="pagination-next">»</a></li>
        {/if}
    </ul>
</nav>