<script>
   import { push, replace , querystring } from 'svelte-spa-router';
   import {  notLoading , changeTabs , actveOrDeactiveFn , updateArrayFn} from '../../utilis/functions';
   import {  activeOrDeacivePackageFn , getPackagesFn} from '../../Api/packageApi';
   import { userPermissions , loading } from '../../stores';
   import Paginate from '../../components/Paginate.svelte';
   import Toast from '../../components/Toast.svelte';
   import NoData from '../../components/NoData.svelte';
   import Input from '../../components/Input.svelte';
   import { onMount } from 'svelte';
   import qs from 'qs';
   export let currentPage = 1;
   export let limit = 10;
   export let last_page;
   export let callId;
   export let total;
   export let title;
   export let status;
   export let packages = [];
   export let isLoading = false;
   $: number = (currentPage - 1) * limit;
   onMount( async () => {
      $loading = true;
      const data = qs.parse($querystring)
      currentPage = Number(data.page)
      callId = parseInt(data.callId)
      title = data.title;
      status = Boolean(data.status);
      setPackages()

   })
   const setPackages = async () => {
      const input = { status, title, callId }
      const data = await getPackagesFn(input ,currentPage , limit);
      if(data.status){
         const res  = data.docs
         packages = res.packages
         currentPage = res.page
         last_page = res.pages
         total = res.total
         notLoading()
      }
   }
   async function changePage(page){
      const data = `show?page=${page ? page : 1}${title ? "&title="+title : ""}${callId ? "&callId="+callId : ""}${status ? "&status="+status : ""}`;
      push("/packages/show-package/" + data) ;
      if(page) {currentPage = page}else{isLoading = true};
      setPackages();
      setTimeout(() => {
         isLoading = false
         changeTabs(0)
      },500)
   };
   const editPage = async (packageId) => {
      push('/packages/update-package/' + packageId)
   }
   const activeOrDeactiveHandler = async(packageId) => {
      let p = await packages.filter(s => s.id === packageId)[0]
      p.status = !p.status
      const data = await activeOrDeacivePackageFn(packageId , p.status);
      if (data.status === true) {
         packages = await updateArrayFn(packages, p)
         actveOrDeactiveFn(data.status,p.status,"بسته");
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
	<title>بسته ها</title>
</svelte:head>
<Toast />
<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
   {#if $loading}
      <progress class="progress is-small is-primary" max="100">15%</progress>
   {:else}
      <div class="p-2">
         <div class="columns is-variable is-desktop">
            <div class="column">
               <h1 class="title">مدیریت بسته ها</h1>
            </div>
            <div class="column navbar-end">
               <div class="buttons">
                  {#if $userPermissions.includes("show-data")}
                     <a href="#/data/show-data" class="button is-info is-rounded">بخش اطلاعات مشتری</a>
                  {/if}
                  {#if $userPermissions.includes("create-package")}
                     <a href="#/packages/create-package" class="button is-link is-rounded">افزودن بسته</a>
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
               {#if packages.length}
                  <div class="box back-eee">
                     <div class="table-container">
                        <table class="table is-bordered is-striped is-hoverable is-fullwidth table-container">
                           <thead>
                              <tr>
                                 <th style="width: 5%;">ردیف</th>
                                 <th style="width: 10%;" data-key="id">شناسه</th>
                                 <th style="width: 50%;" data-key="title">عنوان</th>
                                 <th style="width: 10%;">وضعیت</th>
                                 <th style="width: 10%;">ویرایش</th>
                              </tr>
                           </thead>
                           <tbody>
                              {#each packages as row , index}
                                 <tr>
                                    <td style="width: 5%;">{index + number + 1}</td>
                                    <td style="width: 5%;">{row.id}</td>
                                    <td style="width: 30%;">{row.title}</td>
                                    <td style="width: 5%;">
                                       {#if $userPermissions.includes("status-package")}
                                          <button on:click={activeOrDeactiveHandler(row.id)} 
                                             class:is-success={row.status} 
                                             class:is-danger={!row.status} 
                                             class="button is-small ${ row.status ? 'is-success' : 'is-danger'}" >
                                                <i class:fa-eye={row.status} class:fa-eye-slash={!row.status} class="fa"></i>
                                          </button>
                                       {/if}
                                    </td>
                                    <td style="width: 5%;">
                                       {#if $userPermissions.includes("update-package")}
                                          <button on:click={editPage(row.id)} class="button is-small has-background-info-dark has-text-warning-light">
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
                  <Input label="شرح" type="text" placeholder="شرح؟" bind:title={title} icon="fa-heading" />
                  <Input label="شناسه تماس" type="number" placeholder="شناسه سوال؟" bind:title={callId} icon="fa-phone" />
                  <div style="display: block;" class="field">
                     <div class="d-inlineblock"> 
                        <div class="d-inlineblock status" >
                              <input id="status" type="checkbox" class="switch is-rounded is-info" bind:checked={status}>
                              <label for="status" class="label">وضعیت</label> 
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