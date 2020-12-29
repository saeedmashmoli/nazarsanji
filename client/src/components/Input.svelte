<script>
    export let label;
    export let status;
    export let title;
    export let icon;
    export let placeholder;
    export let type;
</script>
<style>
    .dir-left{
        direction: ltr;
    }
</style>
<div class={`field ${type == "checkbox" ? "dir-left" :""}`}>
    {#if type == "checkbox"}
        <div class="d-inlineblock status" >
            <input id="status" type="checkbox" class="switch is-rounded is-info" bind:checked={status}>
            <label for="status"></label>
        </div>
        <div class="d-inlineblock" style="position: relative; top: 5px">
            <label for class="label">وضعیت</label> 
        </div>
    {:else}
        <label for class="label">{label}</label>
        <div class="control has-icons-left has-icons-right">
            {#if type=="text"}
                <input autocomplete="off" placeholder={placeholder} class="input" type="text"  bind:value={title}>
            {:else if type=="password"}
                <input autocomplete="off" class="input" placeholder={placeholder} type="password"  bind:value={title}>
            {:else if type=="number"}
                <input autocomplete="off" class="input" type="number"  bind:value={title}>
            {:else if type=="textarea"}
                <textarea resize="off" style="height : 200px" placeholder={placeholder} class="input" bind:value={title}></textarea>
            {/if}
            <span class="icon is-small is-left">
                <i class={`fas ${icon}`}></i>
            </span>
            <span class="icon is-small is-right">
                <i class="fas fa-user"></i>
            </span>
        </div>
    {/if}
</div>  