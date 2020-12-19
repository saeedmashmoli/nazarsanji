<script>
    import { pop } from 'svelte-spa-router';
</script>
<svelte:head>
	<title>404</title>
</svelte:head>
<div id="notfound">
    <div class="notfound">
        <div class="notfound-404">
            <h1>404!</h1>
        </div>
        <h2>404 - صفحه مورد نظر یافت نشد</h2>
        <p>لطفا در نحوه ی وارد کردن آدرس دقت کنید</p>
        <a on:click={() => pop()} >بازگشت</a>
    </div>
</div>
