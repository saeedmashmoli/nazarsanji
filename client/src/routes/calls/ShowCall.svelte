<script>
   import { push, replace  } from 'svelte-spa-router';
   import { Datatable, rows , ColumnFilterInputs } from 'svelte-simple-datatables';
   import {  notLoading , updateArrayFn } from '../../utilis/functions';
   import {  activeOrDeaciveCallFn, getCallsFn} from '../../Api/callApi';
   import { userPermissions , loading } from '../../stores';
   import Toast from '../../components/Toast.svelte';
   import { dataTableSettings } from '../../utilis/constants';
   import { onMount } from 'svelte';
   export let calls = [];
   onMount( async () => {
      $loading = true;
      const data = await getCallsFn(false);
      if(data.status){
         calls = data.calls
      }else{
         replace('/server-error')
      }
      notLoading()
   })
   const editPage = async (callId) => {
      push('/calls/update-call/' + callId)
   }
   const activeOrdeactiveHandler = async(callId) => {
      let call = await calls.filter(p => p.id === callId)[0]
      call.status = !call.status
      const data = await activeOrDeaciveCallFn(callId , call.status);
      if(data.status === true){
         calls = await updateArrayFn(calls , call)
         if(call.status === true){
            window.pushToast('تماس مورد نظر با موفقیت فعال شد' , "green")
         }else{
            window.pushToast('تماس مورد نظر با موفقیت غیر فعال شد' , "red")
         }
      }else{
         window.pushToast('مشکلی در تغییر وضعیت تماس بوجود آمده است' , '#000')
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
</style>
<svelte:head>
	<title>تماس ها</title>
</svelte:head>
<Toast />
<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
   {#if $loading}
      <progress class="progress is-small is-primary" max="100">15%</progress>
   {:else}
      <div class="p-2">
         <div class="columns is-variable is-desktop">
            <div class="column">
               <h1 class="title">مدیریت تماس ها</h1>
            </div>
            <div class="column navbar-end">
               <div class="buttons">
                  {#if $userPermissions.includes("show-call")}
                     <a href="#/call/show-call" class="button is-info is-rounded">بخش بسته های تماس</a>
                  {/if}
                  {#if $userPermissions.includes("create-call")}
                     <a href="#/calls/create-call" class="button is-link is-rounded">افزودن تماس</a>
                  {/if}
               </div>
            </div>
         </div> 
         <Datatable settings={dataTableSettings} data={calls}>
            <thead>
               <tr>
                  <th style="width: 5%;">ردیف</th>
                  <th style="width: 5%;" data-key="id">شناسه</th>
                  <th style="width: 10%;" data-key="(row) => row.customer.name">نام مشتری</th>
                  <th style="width: 10%;" data-key="issue">موضوع اصلی</th>
                  <th style="width: 10%;" data-key="minorIssue">موضوع جزئی</th>
                  <th style="width: 10%;" data-key="exactIssue">موضوع دقیق</th>
                  <th style="width: 10%;" data-key="callTime">مدت مکالمه</th>
                  <th style="width: 10%;" data-key="callCode">سرخط</th>
                  <th style="width: 10%;" data-key="callPrice">تعرفه</th>
                  <th style="width: 10%;" data-key="price">مبلغ مکالمه</th>
                  <th style="width: 5%;">وضعیت</th>
                  <th style="width: 5%;">ویرایش</th>
               </tr>
               <ColumnFilterInputs />
            </thead>
            <tbody>
               {#each $rows as row , index}
                  <tr>
                     <td style="width: 5%;">{index + 1}</td>
                     <td style="width: 5%;">{row.id}</td>
                     <td style="width: 10%;">{row.customer.name}</td>
                     <td style="width: 10%;">{row.issue}</td>
                     <td style="width: 10%;">{row.minorIssue}</td>
                     <td style="width: 10%;">{row.exactIssue}</td>
                     <td style="width: 10%;">{row.callTime}</td>
                     <td style="width: 10%;">{row.callCode}</td>
                     <td style="width: 10%;">{row.callPrice}</td>
                     <td style="width: 10%;">{row.price}</td>
                     <td style="width: 5%;">
                        {#if $userPermissions.includes("status-call")}
                           <button on:click={activeOrdeactiveHandler(row.id)} 
                              class:is-success={row.status} 
                              class:is-danger={!row.status} 
                              class="button is-small ${ row.status ? 'is-success' : 'is-danger'}" >
                                 <i class:fa-eye={row.status} class:fa-eye-slash={!row.status} class="fa"></i>
                           </button>
                        {/if}
                     </td>
                     <td style="width: 5%;">
                        {#if $userPermissions.includes("update-call")}
                           <button on:click={editPage(row.id)} class="button is-small has-background-info-dark has-text-warning-light">
                              <i class="fa fa-edit"></i>
                           </button>
                        {/if}
                     </td>
                  </tr>
               {/each}
            </tbody>
         </Datatable>
      </div>
   {/if}
</div>
