<script>
   import { push, replace , querystring } from 'svelte-spa-router';
   import {  notLoading , changeTabs , actveOrDeactiveFn , updateArrayFn} from '../../utilis/functions';
   import {  activeOrDeaciveSmsFn, getSendsFn} from '../../Api/smsApi';
   import { userPermissions , loading } from '../../stores';
   import Paginate from '../../components/Paginate.svelte';
   import Toast from '../../components/Toast.svelte';
   import NoData from '../../components/NoData.svelte';
   import Input from '../../components/Input.svelte';
   import moment from 'moment-jalaali';
   import fa from "moment/src/locale/fa";
   moment.locale("fa", fa);
   moment.loadPersian();
   import { onMount } from 'svelte';
   import qs from 'qs';
   export let sends = [];
   export let currentPage = 1;
   export let limit = 10;
   export let last_page;
   export let total;
   export let name;
   export let mobile;
   export let phone;
   export let packageId;
   export let templateId;
   export let callId;
   export let customerId;
   export let isSuccess;
   export let used;
   export let status;
   export let isLoading = false;
   $: number = (currentPage - 1) * limit;
   onMount( async () => {
      $loading = true;
      const data = qs.parse($querystring)
      currentPage = parseInt(data.page)
      name = data.name;
      mobile = data.mobile;
      phone = data.phone;
      packageId = parseInt(data.packageId);
      templateId = parseInt(data.templateId);
      customerId = parseInt(data.customerId);
      callId = parseInt(data.callId);
      isSuccess = Boolean(data.isSuccess);
      used = Boolean(data.used);
      status = Boolean(data.status)
      setSends()
      notLoading()
   });
   const setSends = async () => {
      const input = {status, name , mobile , phone , packageId , templateId , callId, customerId , isSuccess , used }
      const data = await getSendsFn(input ,currentPage , limit);
      if(data.status){
         const res  = data.docs
         sends = res.sends
         currentPage = res.page
         last_page = res.pages
         total = res.total
      }else{
         replace('/server-error')
      }
   }

   async function changePage(page){
      const data = `show?page=${page ? page : 1}${name ? "&name="+name : ""}${mobile ? "&mobile="+mobile :""}${phone ? "&phone="+phone : ""}${packageId ? "&packageId="+packageId : ""}${templateId ? "&templateId="+templateId : ""}${callId ? "&callId="+callId : ""}${customerId ? "&customerId="+customerId : ""}${used ? "&used="+used : ""}${isSuccess ? "&isSuccess="+isSuccess : ""}`;       push("/sms/show-sms/"+data) ;
      if(page) {currentPage = page}else{isLoading = true};
      setSends();
      setTimeout(() => {
         isLoading = false
         changeTabs(0)
      },300)
   };
   const activeOrdeactiveHandler = async(smsId) => {
      let send = await sends.filter(p => p.id === smsId)[0]
      send.status = !send.status
      const data = await activeOrDeaciveSmsFn(smsId , send.status);
      if (data.status === true) {
         sends = await updateArrayFn(sends, send)
         actveOrDeactiveFn(data.status,send.status,"پیامک");
      }
   }
</script>
<style>
   .buttons{
      direction: ltr;
   }
   @media only screen and (max-width: 767px) {
      .buttons{
         direction: rtl;
      }
   }
   .tabs {
    display: flex;
    flex-direction: column;
   }


   .tab-content div {
      display: none;
   }

   .tab-content div:first-child {
      display: block;
   }

   .tab-content {
      padding: 1em;
   }
</style>
<svelte:head>
	<title>پیامک ها</title>
</svelte:head>
<Toast />
<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
   {#if $loading}
      <progress class="progress is-small is-primary" max="100">15%</progress>
   {:else}
      <div class="p-2">
         <div class="columns is-variable is-desktop">
            <div class="column">
               <h1 class="title">مشاهده پیامک ها</h1>
            </div>
            <div class="column navbar-end">
               <div class="buttons">
                  {#if $userPermissions.includes("create-sms")}
                     <a href="#/sms/create-sms" class="button is-link is-rounded">ارسال پیامک</a>
                  {/if}
               </div>
            </div>
         </div>
         <div class="tabs">
            <ul>
               <!-- svelte-ignore a11y-missing-attribute -->
               <li value=0 on:click={(e) => changeTabs(e.path[0].parentElement.value)} class="is-active"><a>نتایج</a></li>
               <!-- svelte-ignore a11y-missing-attribute -->
               <li value=1 on:click={(e) => changeTabs(e.path[0].parentElement.value)}><a>جستجو</a></li>
            </ul>
         </div>
         <div class="tab-content">
            <div value=0>
               {#if sends.length}
                  <div class="box back-eee">
                     <div class="table-container">
                        <table class="table is-bordered is-striped is-hoverable is-fullwidth table-container">
                           <thead>
                              <tr>
                                 <th style="width: 5%;">ردیف</th>
                                 <th style="width: 5%;">شناسه</th>
                                 <th style="width: 10%;">توکن</th>
                                 <th style="width: 15%;">نام مشتری</th>
                                 <th style="width: 10%;">موبایل</th>
                                 <th style="width: 15%;">قالب</th>
                                 <th style="width: 10%;">زمان ارسال</th>
                                 <th style="width: 10%;">توکن / ارسال</th>
                                 <th style="width: 20%;">پیام سامانه پیامکی</th>
                                 <th style="width: 5%;">تغییر وضعیت</th>
                              </tr>
                           </thead>
                           <tbody>
                              {#each sends as send , index}
                                 <tr>
                                    <td style="width: 5%;">{index + number + 1}</td>
                                    <td style="width: 5%;">{send.id}</td>
                                    <td style="width: 10%;">{send.token}</td>
                                    <td style="width: 15%;">{send.call.customer?.name}</td>
                                    <td style="width: 10%;">{send.call.customer?.mobile}</td>
                                    <td style="width: 15%;">{send.template.title}</td>
                                    <td style="width: 10%;">{moment(parseInt(send.createdAt)).format('jYYYY/jM/jD HH:mm:ss')}</td>
                                    <td style="width: 5%;">
                                       <!-- svelte-ignore a11y-missing-attribute -->
                                       <button 
                                          class:is-success={send.used} 
                                          class:is-danger={!send.used} 
                                          class="button disable-cursor is-small" >
                                          <i  class={send.used ? "fas" : "fa"} class:fa-times={!send.used} class:fa-check={send.used}></i>
                                       </button>
                                       <button 
                                          class:is-success={send.isSuccess} 
                                          class:is-danger={!send.isSuccess} 
                                          class="button disable-cursor is-small" >
                                          <i  class={send.isSuccess ? "fas" : "fa"} class:fa-times={!send.isSuccess} class:fa-check={send.isSuccess}></i>
                                       </button>
                                    </td>
                                    <td style="width: 20%;">{send.message}</td>
                                    <td style="width: 5%;">
                                       {#if $userPermissions.includes("status-sms")}
                                          <button on:click={activeOrdeactiveHandler(send.id)} 
                                             class:is-success={send.status} 
                                             class:is-danger={!send.status} 
                                             class="button is-small">
                                             <i class={send.isSuccess ? "fas" : "fa"} class:fa-eye={send.status} class:fa-eye-slash={!send.status} ></i>
                                          </button>
                                       {/if}
                                    </td>
                                 </tr>
                              {/each}
                           </tbody>
                        </table> 
                     </div>
                  </div>
               {#if last_page > 1}
                  <Paginate
                     {currentPage}
                     {last_page}
                     middleCount={2}
                     on:changePage={(ev) => changePage(ev.detail)}
                  ></Paginate>
               {/if}
               {:else}
                  <NoData />
               {/if} 
            </div>
            <div value=1>
               <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                  <Input label="نام " type="text" placeholder="نام مشتری؟" bind:title={name} icon="fa-user" />
                  <Input label="موبایل " type="text" placeholder="موبایل مشتری؟" bind:title={mobile} icon="fa-mobile" />
                  <Input label="تلفن " type="text" placeholder="تلفن مشتری؟" bind:title={phone} icon="fa-phone" />
                  <Input label="شناسه مشتری " type="number" placeholder="شناسه مشتری؟" bind:title={customerId} icon="fa-user" />
                  <Input label="شناسه تماس " type="number" placeholder="شناسه تماس مشتری؟" bind:title={callId} icon="fa-phone" />
                  <Input label="شناسه قالب " type="number" placeholder="شناسه قالب پیامک؟" bind:title={phone} icon="fa-file" />
                  <Input label="شناسه بسته تماس " type="number" placeholder="شناسه بسته تماس؟" bind:title={phone} icon="fa-file" />
                  <div style="display: block;" class="columns p-1 pr-2">
                     <div class="column" style="display: inline-block;"> 
                        <div class="d-inlineblock status" >
                              <input id="status" type="checkbox" class="switch is-rounded is-info" bind:checked={status}>
                              <label for="status" class="label">وضعیت</label> 
                        </div>

                     </div>
                     <div class="column" style="display: inline-block;"> 
                           <div class="d-inlineblock status" >
                              <input style="z-index: 2;width:100%" id="isSuccess" type="checkbox" class="switch is-rounded is-info" bind:checked={isSuccess}>
                              <label for class="label">وضعیت ارسال پیامک</label> 
                           </div>
                     </div>
                     <div class="column" style="display: inline-block;"> 
                        <div class="d-inlineblock status" >
                           <input style="z-index: 2;width:100%" id="used" type="checkbox" class="switch is-rounded is-info" bind:checked={used}>
                           <label for class="label">وضعیت شرکت در نظرسنجی </label> 
                        </div>
                     </div>
                  </div>
                  <div style="display : block;text-align : left;">
                     <button class:is-loading={isLoading} on:click={() => changePage(null)} class="button is-link">جستجو</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   {/if}
</div>
