<script>
   import { userPermissions ,loading } from '../../stores';
   import { onMount } from 'svelte';
   import { push, replace  } from 'svelte-spa-router';
   import { notLoading   ,updateArrayFn  } from '../../utilis/functions';
   import {deleteRoleFn , getRolesFn} from '../../Api/permissionRoleApi';
   import {} from ''
   import Toast from '../../components/Toast.svelte';
   import Paginate from '../../components/Paginate.svelte'
   import SearchInput from '../../components/SearchInput.svelte';
   import { slide} from 'svelte/transition';
   export let currentPage = 1;
   export let limit = 2;
   export let last_page;
   export let searchBar;
   export let title;
   export let label;
   export let timer = null;
   $: number = (currentPage - 1) * limit ;


   export let roles = [];
   onMount( async () => {
      $loading = true;
      const input = {status : false,title , label}
      const data = await getRolesFn(currentPage , limit , input);
      if(data.status){
         const result = data.doc;
         roles = result.roles;
         currentPage = result.page;
         last_page = result.pages;
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
   async function changePage(page){
      currentPage = page;
      $loading = true;
      const input = {status : false,title , label}
      const data = await getRolesFn(currentPage , limit , input);
      if(data.status){
         const result = data.doc;
         roles = result.roles;
         currentPage = result.page;
         last_page = result.pages;
      }
      notLoading()
   };
   const showSearchBar = () => {
      searchBar = !searchBar
   }
   const searchSubmit  =  () => { 
      clearTimeout(timer); 
      timer = setTimeout( async () => {
         const input = {status : false,title , label}
         const data = await getRolesFn(currentPage , limit , input);
         if(data.status){
            const result = data.doc;
            roles = result.roles;
            currentPage = result.page;
            last_page = result.pages;
         }
      }, 500)
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
      .back-eee.active{
         width: 100% !important;
         background: #eee;
      }
   }
   .back-eee {
      transition: width 0.5s ease-in-out;
   }
   .back-eee.active{
      width: 50% !important;
      background: #eee;
   }
   .disabled{
      display: none;
   }
   .active{
      display: block;
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
                  <a on:click={showSearchBar} class={`button ${searchBar ? 'is-danger' : 'is-primary'} is-rounded`}>{searchBar ? "بستن فرم جستجو" : "جستجو"}</a>
               </div>
            </div>
         </div>
         <div style="margin : auto;" transition:slide 
            class:active={searchBar} 
            class:back-eee={searchBar} 
            class="column p-3 is-2-desktop is-6-mobile is-4-tablet">
            <div class:disabled={!searchBar} class:active={searchBar}>
               <SearchInput placeholder="عنوان نقش؟" bind:title={title} icon="fa-heading" on:searchSubmit={searchSubmit} />
               <SearchInput placeholder="شرح نقش؟" bind:title={label} icon="fa-tags" on:searchSubmit={searchSubmit} />
            </div>
         </div>
      </div>
      <div class="box">
         <div class="table-container">
            <table class="table is-bordered is-striped is-hoverable is-fullwidth table-container">
            <thead>
               <tr>
                  <th style="width: 5%;">ردیف</th>
                  <th style="width: 5%;">شناسه</th>
                  <th style="width: 30%;">عنوان</th>
                  <th style="width: 40%;">شرح</th>
                  <th style="width: 5%;">وضعیت</th>
                  <th style="width: 5%;">دسترسی</th>
                  <th style="width: 5%;">کاربران</th>
                  <th style="width: 5%;">ویرایش</th>
               </tr>
               </thead>
               <tbody>
                  {#each roles as role , index}
      
                     <tr>
                        <td style="width: 5%;">{index + number + 1}</td>
                        <td style="width: 5%;">{role.id}</td>
                        <td style="width: 30%;">{role.title}</td>
                        <td style="width: 40%;">{role.label}</td>
                        <td style="width: 5%;">
                           <button on:click={deleteRole(role.id)} 
                           class:is-success={role.status} 
                           class:is-danger={!role.status} 
                           class="button is-small ${ role.status ? 'is-success' : 'is-danger'}" >
                              <i class:fa-eye={role.status} class:fa-eye-slash={!role.status} class="fa"></i>
                           </button>
                        </td>
                        <td style="width: 5%;">
                           <button class="button is-small has-background-info has-text-warning-light">
                              <i class="fa fa-tasks"></i>
                           </button>
                        </td>
                        <td style="width: 5%;">
                           <button class="button is-small has-background-primary-dark has-text-warning-light">
                              <i class="fa fa-user-alt"></i>
                           </button>
                        </td>
                        {#if $userPermissions.includes("update-role")}
                           <td style="width: 5%;">
                              <button on:click={editPage(role.id)} class="button is-small has-background-info-dark has-text-warning-light">
                                 <i class="fa fa-edit"></i>
                              </button>
                           </td>
                        {/if}
                     </tr>
                  {/each}
               </tbody>
            </table>
         </div>
         {#if last_page >= currentPage}
            <Paginate
               {currentPage}
               {last_page}
               middleCount={2}
               on:changePage={(ev) => changePage(ev.detail)}
            ></Paginate>
       {/if}
      </div>
   {/if}
</div>
