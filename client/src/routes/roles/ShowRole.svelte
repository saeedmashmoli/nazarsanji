<script>
   import { userPermissions ,loading } from '../../stores';
   import { Datatable, rows , ColumnFilterInputs } from 'svelte-simple-datatables';
   import { onMount } from 'svelte';
   import { push, replace  } from 'svelte-spa-router';
   import { notLoading   ,updateArrayFn  } from '../../utilis/functions';
   import {getRolesFn , deleteRoleFn} from '../../Api/permissionRoleApi';
   import { dataTableSettings } from '../../utilis/constants';
   import Toast from '../../components/Toast.svelte';
   export let roles = [];
   onMount( async () => {
      $loading = true;
      const data = await getRolesFn(false);
      if(data.status){
         roles = data.roles;
      }else{
         replace('/server-error')
      }
      notLoading()
   })
   const editPage = async (roleId) => {
      push('/roles/update-role/'+roleId)
   }
   const deleteRole= async(roleId) => {
      let role = roles.filter(r => r.id === roleId)[0]

      role.status = !role.status;
      
      const data = await deleteRoleFn(roleId);
      if(data.status === true){
         roles = await updateArrayFn(roles , role)
         if(role.status === true){
            window.pushToast('نقش مورد نظر با موفقیت فعال شد' , "green")
         }else{
            window.pushToast('نقش مورد نظر با موفقیت غیر فعال شد' , "red")
         }
      }else{
         window.pushToast('مشکلی در تغییر وضعیت نقش بوجود آمده است' , '#000')
      }
   }

</script>
<style>
   .buttons{
      direction: ltr;
   }

</style>
<svelte:head>
	<title>نقش ها</title>
</svelte:head>
<Toast />
<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
   {#if $loading}
      <progress class="progress is-small is-primary" max="100">15%</progress>
   {:else}
   <div class="p-2">
      <div class="columns is-variable is-desktop">
         <div class="column">
            <h1 class="title">مدیریت نقش ها</h1>
         </div>
         <div class="column navbar-end">
            <div class="buttons">
               {#if $userPermissions.includes("show-permission")}
                  <a href="#/permissions/show-permission" class="button is-info is-rounded">دسترسی ها</a>
               {/if}
               {#if $userPermissions.includes("create-role")}
                  <a href="#/roles/create-role" class="button is-link is-rounded">افزودن نقش</a>
               {/if}
            </div>
         </div>
      </div>
      <Datatable settings={dataTableSettings} bind:data={roles}>
         <thead>
            <tr>
               <th style="width: 5%;">ردیف</th>
               <th style="width: 5%;" data-key="id">شناسه</th>
               <th style="width: 40%;" data-key="title">عنوان</th>
               <th style="width: 40%;" data-key="label">شرح</th>
               <th style="width: 5%;" >وضعیت</th>
               <th style="width: 5%;" >ویرایش</th>
            </tr>
            <ColumnFilterInputs />
         </thead>
         <tbody>
            {#each $rows as row , index}
               <tr>
                  <td style="width: 5%;">{index + 1}</td>
                  <td style="width: 5%;">{row.id}</td>
                  <td style="width: 40%;">{row.title}</td>
                  <td style="width: 40%;">{row.label}</td>
                  <td style="width: 5%;">
                     <button on:click={deleteRole(row.id)} 
                     class:is-success={row.status} 
                     class:is-danger={!row.status} 
                     class="button is-small ${ row.status ? 'is-success' : 'is-danger'}" >
                        <i class:fa-eye={row.status} class:fa-eye-slash={!row.status} class="fa"></i>
                     </button>
                  </td>
                  {#if $userPermissions.includes("update-role")}
                     <td style="width: 5%;">
                        <button on:click={editPage(row.id)} class="button is-small has-background-info-dark has-text-warning-light">
                           <i class="fa fa-edit"></i>
                        </button>
                     </td>
                  {/if}
               </tr>
            {/each}
         </tbody>
     </Datatable>   
   </div>
   {/if}
</div>
