<script>
    import { getContext } from 'svelte';
    import LogModel from './LogModal.svelte';
    export let log;
    const { open } = getContext('simple-modal');
  
    const showModal = () => {
      open(LogModel, { log } , {styleCloseButton: { left : "1rem !important", right : "auto" }});
    };
</script>

<button on:click={showModal} class="button is-small has-background-info-dark has-text-warning-light">
    <i class="fa fa-list-alt"></i>
</button>