<script>
   import { push, replace  } from 'svelte-spa-router';
   import { Datatable, rows , ColumnFilterInputs } from 'svelte-simple-datatables';
   import {  notLoading , updateArrayFn } from '../../utilis/functions';
   import {  activeOrDeaciveCustomerFn, getCustomersFn} from '../../Api/customerApi';
   import { userPermissions , loading } from '../../stores';
   import Toast from '../../components/Toast.svelte';
   import { dataTableSettings } from '../../utilis/constants';
   import { onMount } from 'svelte';
   export let customers = [];
   onMount( async () => {
      $loading = true;
      const data = await getCustomersFn(false);
      if(data.status){
         customers = data.customers
      }else{
         replace('/server-error')
      }
      notLoading()
   })
   const editPage = async (customerId) => {
      push('/customers/update-customer/' + customerId)
   }
   const activeOrdeactiveHandler = async(customerId) => {
      let customer = await customers.filter(p => p.id === customerId)[0]
      customer.status = !customer.status
      const data = await activeOrDeaciveCustomerFn(customerId);
      if(data.status === true){
         customers = await updateArrayFn(customers , customer)
         if(customer.status === true){
            window.pushToast('مشتری مورد نظر با موفقیت فعال شد' , "green")
         }else{
            window.pushToast('مشتری مورد نظر با موفقیت غیر فعال شد' , "red")
         }
      }else{
         window.pushToast('مشکلی در تغییر وضعیت مشتری بوجود آمده است' , '#000')
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
	<title>مشتری ها</title>
</svelte:head>
<Toast />
<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
   {#if $loading}
      <progress class="progress is-small is-primary" max="100">15%</progress>
   {:else}
      <div class="p-2">
         <div class="columns is-variable is-desktop">
            <div class="column">
               <h1 class="title">مدیریت مشتری ها</h1>
            </div>
            <div class="column navbar-end">
               <div class="buttons">
                  {#if $userPermissions.includes("show-data")}
                     <a href="#/data/show-data" class="button is-info is-rounded">بخش اطلاعات مشتری</a>
                  {/if}
                  {#if $userPermissions.includes("create-customer")}
                     <a href="#/customers/create-customer" class="button is-link is-rounded">افزودن مشتری</a>
                  {/if}
               </div>
            </div>
         </div> 
         <Datatable settings={dataTableSettings} data={customers}>
            <thead>
               <tr>
                  <th style="width: 5%;">ردیف</th>
                  <th style="width: 5%;" data-key="id">شناسه</th>
                  <th style="width: 30%;" data-key="name">نام مشتری</th>
                  <th style="width: 15%;" data-key="mobile">موبایل</th>
                  <th style="width: 15%;" data-key="phone">تلفن</th>
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
                     <td style="width: 30%;">{row.name}</td>
                     <td style="width: 15%;">{row.mobile}</td>
                     <td style="width: 30%;">{row.phone}</td>
                     <td style="width: 5%;">
                        <button on:click={activeOrdeactiveHandler(row.id)} 
                           class:is-success={row.status} 
                           class:is-danger={!row.status} 
                           class="button is-small ${ row.status ? 'is-success' : 'is-danger'}" >
                              <i class:fa-eye={row.status} class:fa-eye-slash={!row.status} class="fa"></i>
                        </button>
                     </td>
                     <td style="width: 5%;">
                        {#if $userPermissions.includes("update-customer")}
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
