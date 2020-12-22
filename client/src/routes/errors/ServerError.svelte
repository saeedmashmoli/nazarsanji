<script>
    import { pop } from 'svelte-spa-router';
</script>
<svelte:head>
   <title>خطای سرور</title>
</svelte:head>
<div id="notfound">
   <div class="notfound">
       <div class="notfound-404">
           <h1>500!</h1>
       </div>
       <h2>500 - خطای سرور</h2>
       <p>متاسفانه مشکلی در ارتباط با سرور وجود دارد لطفا بعدا مراجعه فرمائید</p>
       <label for  on:click={() => pop()}>بازگشت</label>
   </div>
</div>