<script>
   import { onMount } from "svelte";
   import { push } from "svelte-spa-router";
   import {  notLoading } from '../utilis/functions';
   import {getDataForDashboardFn} from '../Api/dashboardApi';
   import { loading } from '../stores';
   export let commentsCount;
   export let smsCount;
   export let comments = [];
   onMount(async() => {
      $loading = true;
      const data = await getDataForDashboardFn();
      if(data.status){
         commentsCount = data.commentsCount;
         smsCount = data.smsCount;
         comments = data.comments;
         notLoading()
      }else{
         push('/server-error')
      }
   })

</script>
<svelte:head>
	<title>داشبورد</title>
</svelte:head>
<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
   {#if $loading}
      <progress class="progress is-small is-primary" max="100">15%</progress>
   {:else}
      <div class="p-2">
         <div class="columns is-variable is-desktop">
            <div class="column">
               <h1 class="title">داشبورد</h1>
            </div>
         </div> 
         <div class="columns is-variable is-desktop">
            <div class="column">
               <div class="card has-background-primary has-text-white">
                  <div class="card-header">
                     <div class="card-header-title">
                        پیامک ارسالی
                     </div>
                     <div class="card-content">
                        <div class="is-size-3">
                           {smsCount}
                        </div>
                     </div>
                  </div>
               </div>
            </div>   
            <div class="column">
               <div class="card has-background-warning">
                  <div class="card-header">
                     <div class="card-header-title">
                        کامنت های دریافتی
                     </div>
                     <div class="card-content has-text-black">
                        <div class="is-size-3">
                           {commentsCount}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div class="columns is-variable is-desktop">
            {#each comments as comment}
               <div class="column is-4-desktop is-6-tablet">
                  <article class="message is-info">
                     <div class="message-header text-center">
                        <p>
                           {comment.sms.call.customer.name ? comment.sms.call.customer.name : ""}
                        </p>
                        <p>
                           {comment.sms.call.customer.mobile}
                        </p>
                     </div>
                     <div class="message-body">
                        {comment.text}
                     </div>
                  </article>
               </div>
            {/each}
         </div>
      </div>
   {/if}
</div>
 