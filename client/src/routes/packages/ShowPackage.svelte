<script>
   import { push, replace  } from 'svelte-spa-router';
   import { Datatable, rows , ColumnFilterInputs } from 'svelte-simple-datatables';
   import {  notLoading , updateArrayFn } from '../../utilis/functions';
   import {  activeOrDeacivePackageFn , getPackagesFn} from '../../Api/packageApi';
   import { userPermissions , loading } from '../../stores';
   import Toast from '../../components/Toast.svelte';
   import { dataTableSettings } from '../../utilis/constants';
   import { onMount } from 'svelte';
   export let packages = [];
   onMount( async () => {
      $loading = true;
      const data = await getPackagesFn(false);
      if(data.status){
         packages = data.packages
      }else{
         replace('/server-error')
      }
      notLoading()
   })
   const editPage = async (packageId) => {
      push('/packages/update-package/' + packageId)
   }
   const activeOrDeactiveHandler = async(packageId) => {
      let p = await packages.filter(s => s.id === packageId)[0]
      p.status = !p.status
      const data = await activeOrDeacivePackageFn(packageId);
      if(data.status === true){
         packages = await updateArrayFn(packages , p)
         if(p.status === true){
            window.pushToast('بسته مورد نظر با موفقیت فعال شد' , "green")
         }else{
            window.pushToast('بسته مورد نظر با موفقیت غیر فعال شد' , "red")
         }
      }else{
         window.pushToast('مشکلی در تغییر وضعیت بسته بوجود آمده است' , '#000')
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
         <Datatable settings={dataTableSettings} data={packages}>
            <thead>
               <tr>
                  <th style="width: 5%;">ردیف</th>
                  <th style="width: 5%;" data-key="id">شناسه</th>
                  <th style="width: 30%;" data-key="title">عنوان</th>
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
                     <td style="width: 30%;">{row.title}</td>
                     <td style="width: 5%;">
                        <button on:click={activeOrDeactiveHandler(row.id)} 
                           class:is-success={row.status} 
                           class:is-danger={!row.status} 
                           class="button is-small ${ row.status ? 'is-success' : 'is-danger'}" >
                              <i class:fa-eye={row.status} class:fa-eye-slash={!row.status} class="fa"></i>
                        </button>
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
         </Datatable>
      </div>
   {/if}
</div>