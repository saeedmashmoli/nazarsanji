<script>
     import { pop } from 'svelte-spa-router';
</script>
<svelte:head>
	<title>عدم دسترسی</title>
</svelte:head>
<div id="notfound">
    <div class="notfound">
        <div class="notfound-404">
            <h1>401!</h1>
        </div>
        <h2>401 - عدم دسترسی</h2>
        <p>متاسفانه شما اجازه دسترسی به این صفحه را ندارید</p>
        <a on:click={() => pop()}>بازگشت</a>
    </div>
</div>