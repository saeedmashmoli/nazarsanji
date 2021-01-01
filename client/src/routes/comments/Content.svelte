<script>
    import { getContext } from 'svelte';
    import CommentModal from './CommentModal.svelte';
    export let comment;
    const { open } = getContext('simple-modal');
  
    const showModal = () => {
      open(CommentModal, { comment } , {styleCloseButton: { left : "1rem !important", right : "auto" }});
    };
</script>

<button on:click={showModal(comment.id)} class="button is-small has-background-info-dark has-text-warning-light">
    <i class="fa fa-list-alt"></i>
</button>