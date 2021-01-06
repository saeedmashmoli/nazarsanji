<script>
   import { push, replace , querystring } from 'svelte-spa-router';
   import {  notLoading , changeTabs , actveOrDeactiveFn , updateArrayFn} from '../../utilis/functions';
   import {  activeOrDeaciveCustomerFn, getCustomersFn} from '../../Api/customerApi';
   import { userPermissions , loading } from '../../stores';
   import Paginate from '../../components/Paginate.svelte';
   import Toast from '../../components/Toast.svelte';
   import NoData from '../../components/NoData.svelte';
   import Input from '../../components/Input.svelte';
   import { onMount } from 'svelte';
   import qs from 'qs';
   export let customers = [];
   export let currentPage = 1;
   export let limit = 10;
   export let last_page;
   export let total;
   export let name;
   export let mobile;
   export let phone;
   export let isLoading = false;
   $: number = (currentPage - 1) * limit;
   onMount( async () => {
      $loading = true;
      const data = qs.parse($querystring)
      currentPage = parseInt(data.page)
      name = data.name;
      mobile = data.mobile;
      phone = data.phone;
      setCustomers()

   });
   const setCustomers = async () => {
      const input = {status : false, name , mobile , phone}
      const data = await getCustomersFn(input ,currentPage , limit);
      if(data.status){
         const res  = data.docs
         customers = res.customers
         currentPage = res.page
         last_page = res.pages
         total = res.total
         notLoading()
      }else{
         replace('/server-error')
      }
   }

   async function changePage(page){
      const data = `show?page=${page ? page : 1}${name ? "&name="+name : ""}${mobile ? "&mobile="+mobile : ""}${phone ? "&phone="+phone : ""}`;
       push("/customers/show-customer/"+data) ;
      if(page) {currentPage = page}else{isLoading = true};
      setCustomers();
      setTimeout(() => {
         isLoading = false
         changeTabs(0)
      },500)
   };
   const editPage = async (customerId) => {
      push('/customers/update-customer/' + customerId)
   }
   const activeOrdeactiveHandler = async(customerId) => {
      let customer = await customers.filter(p => p.id === customerId)[0]
      customer.status = !customer.status
      const data = await activeOrDeaciveCustomerFn(customerId , customer.status);
      if (data.status === true) {
         customers = await updateArrayFn(customers, customer)
         actveOrDeactiveFn(data.status,customer.status,"مشتری");
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
                     <a href="#/calls/show-call/" class="button is-info is-rounded">بخش تماس ها</a>
                  {/if}
                  {#if $userPermissions.includes("create-customer")}
                     <a href="#/customers/create-customer" class="button is-link is-rounded">افزودن مشتری</a>
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
               {#if customers.length}
                  <div class="box back-eee">
                     <div class="table-container">
                        <table class="table is-bordered is-striped is-hoverable is-fullwidth table-container">
                           <thead>
                              <tr>
                                 <th style="width: 5%;">ردیف</th>
                                 <th style="width: 10%;" data-key="id">شناسه</th>
                                 <th style="width: 35%;" data-key="name">نام مشتری</th>
                                 <th style="width: 15%;" data-key="mobile">موبایل</th>
                                 <th style="width: 15%;" data-key="phone">تلفن</th>
                                 <th style="width: 10%;">وضعیت</th>
                                 <th style="width: 10%;">ویرایش</th>
                              </tr>
                           </thead>
                           <tbody>
                              {#each customers as customer , index}
                                 <tr>
                                    <td style="width: 5%;">{index + number + 1}</td>
                                    <td style="width: 10%;">{customer.id}</td>
                                    <td style="width: 35%;">{customer.name ? customer.name : ""}</td>
                                    <td style="width: 15%;">{customer.mobile ? customer.mobile : ""}</td>
                                    <td style="width: 15%;">{customer.phone ? customer.phone : ""}</td>
                                    <td style="width: 10%;">
                                       {#if $userPermissions.includes("status-customer")}
                                          <button on:click={activeOrdeactiveHandler(customer.id)} 
                                             class:is-success={customer.status} 
                                             class:is-danger={!customer.status} 
                                             class="button is-small ${ customer.status ? 'is-success' : 'is-danger'}" >
                                                <i class:fa-eye={customer.status} class:fa-eye-slash={!customer.status} class="fa"></i>
                                          </button>
                                       {/if}
                                    </td>
                                    <td style="width: 10%;">
                                       {#if $userPermissions.includes("update-customer")}
                                          <button on:click={editPage(customer.id)} class="button is-small has-background-info-dark has-text-warning-light">
                                             <i class="fa fa-edit"></i>
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
                  <Input label="تلفن " type="text" placeholder="موبایل مشتری؟" bind:title={phone} icon="fa-phone" />
                  <div style="display : block;text-align : left;">
                     <button class:is-loading={isLoading} on:click={() => changePage(null)} class="button is-link">جستجو</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   {/if}
</div>
