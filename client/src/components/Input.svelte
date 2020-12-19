<script>
    import { createEventDispatcher } from 'svelte';
    export let label;
    export let title;
    export let icon;
    export let placeholder;
    export let type;
</script>

<div class="field">
    <label class="label">{label}</label>
    <div class="control has-icons-left has-icons-right">
        {#if type=="text"}
            <input placeholder={placeholder} class="input" type="text"  bind:value={title}>
        {:else if type=="number"}
            <input class="input" type="number"  bind:value={title}>
        {:else if type=="textarea"}
            <textarea placeholder={placeholder} class="input" bind:value={title}></textarea>
        {/if}
        <span class="icon is-small is-left">
            <i class={`fas ${icon}`}></i>
        </span>
        <span class="icon is-small is-right">
            <i class="fas fa-user"></i>
        </span>
    </div>
</div>  