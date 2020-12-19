<script>
    import { createEventDispatcher } from 'svelte';
    export let title;
    export let icon;
    export let placeholder;
    const dispatch = createEventDispatcher();
    const change = () => {
        dispatch('searchSubmit', title);
    }
</script>

<div class="field">
    <div class="control has-icons-left has-icons-right">
        <input on:keydown={() => change()} placeholder={placeholder} class="input" type="text"  bind:value={title}>
        <span class="icon is-small is-left">
            <i class={`fas ${icon}`}></i>
        </span>
        <span class="icon is-small is-right">
            <i class="fas fa-user"></i>
        </span>
    </div>
</div>  