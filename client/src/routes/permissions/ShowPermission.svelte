<script>
   import { push, replace  } from 'svelte-spa-router';
   import { Datatable, rows , ColumnFilterInputs } from 'svelte-simple-datatables';
   import {  notLoading , updateArrayFn } from '../../utilis/functions';
   import { deletePermissionFn , getPermissionsFn} from '../../Api/permissionRoleApi';
   import { userPermissions , loading } from '../../stores';
   import Toast from '../../components/Toast.svelte';
   import { dataTableSettings } from '../../utilis/constants';
   import { onMount } from 'svelte';
   export let permissions = [];
   onMount( async () => {
      $loading = true;
      const data = await getPermissionsFn(false);
      if(data.status){
         permissions = data.permissions
      }else{
         replace('/server-error')
      }
      notLoading()
   })
   const editPage = async (permissionId) => {
      push('/permissions/update-permission/' + permissionId)
   }
   const deletePermission = async(permissionId) => {
      let permit = await permissions.filter(p => p.id === permissionId)[0]
      permit.status = !permit.status
      const data = await deletePermissionFn(permissionId);
      if(data.status === true){
         permissions = await updateArrayFn(permissions , permit)
         if(permit.status === true){
            window.pushToast('دسترسی مورد نظر با موفقیت فعال شد' , "green")
         }else{
            window.pushToast('دسترسی مورد نظر با موفقیت غیر فعال شد' , "red")
         }
      }else{
         window.pushToast('مشکلی در تغییر وضعیت دسترسی بوجود آمده است' , '#000')
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
	<title>دسترسی ها</title>
</svelte:head>
<Toast />
<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
   {#if $loading}
      <progress class="progress is-small is-primary" max="100">15%</progress>
   {:else}
      <div class="p-2">
         <div class="columns is-variable is-desktop">
            <div class="column">
               <h1 class="title">مدیریت دسترسی ها</h1>
            </div>
            <div class="column navbar-end">
               <div class="buttons">
                  {#if $userPermissions.includes("show-role")}
                     <a href="#/roles/show-role" class="button is-info is-rounded">نقش ها</a>
                  {/if}
                  {#if $userPermissions.includes("create-permission")}
                     <a href="#/permissions/create-permission" class="button is-link is-rounded">افزودن دسترسی</a>
                  {/if}
               </div>
            </div>
         </div> 
         <Datatable settings={dataTableSettings} data={permissions}>
            <thead>
               <tr>
                  <th style="width: 5%;">ردیف</th>
                  <th style="width: 5%;" data-key="id">شناسه</th>
                  <th style="width: 30%;" data-key="title">عنوان</th>
                  <th style="width: 15%;" data-key="model">بخش</th>
                  <th style="width: 30%;" data-key="label">شرح</th>
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
                     <td style="width: 15%;">{row.model}</td>
                     <td style="width: 30%;">{row.label}</td>
                     <td style="width: 5%;">
                        <button on:click={deletePermission(row.id)} 
                           class:is-success={row.status} 
                           class:is-danger={!row.status} 
                           class="button is-small ${ row.status ? 'is-success' : 'is-danger'}" >
                              <i class:fa-eye={row.status} class:fa-eye-slash={!row.status} class="fa"></i>
                        </button>
                     </td>
                     <td style="width: 5%;">
                        {#if $userPermissions.includes("update-permission")}
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
