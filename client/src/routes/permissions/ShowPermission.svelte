<script>
   import { push, replace , querystring } from 'svelte-spa-router';
   import {  notLoading , changeTabs , actveOrDeactiveFn , updateArrayFn} from '../../utilis/functions';
   import { activeOrDeactivePermissionFn , getPermissionsFn} from '../../Api/permissionApi';
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
   export let total;
   export let title;
   export let label;
   export let model;
   export let status;
   export let permissionId;
   export let roleIds;
   export let permissions = [];
   export let isLoading = false;
   $: number = (currentPage - 1) * limit;
   onMount( async () => {
      $loading = true;
      const data = qs.parse($querystring)
      currentPage = Number(data.page)
      title = data.title;
      label = data.label;
      model = data.model;
      status = Boolean(data.status);
      setPermissions()

   })
   const setPermissions = async () => {
      const input = {
         status, 
         title, 
         model, 
         label, 
         permissionId,
         roleIds
      }
      const data = await getPermissionsFn(input ,currentPage , limit);
      if(data.status){
         const res  = data.docs
         permissions = res.permissions
         currentPage = res.page
         last_page = res.pages
         total = res.total
         notLoading()
      }else{
         replace('/server-error')
      }
   }

   async function changePage(page){
      const data = `show?page=${page ? page : 1}${title ? "&title="+title : ""}${model ? "&model="+model : ""}${label ? "&label="+label : ""}${permissionId ? "&permissionId="+permissionId : ""}${status ? "&status="+status : ""}${roleIds ? "&roleIds="+roleIds : ""}`;
      push("/permissions/show-permission/" + data) ;
      if(page) {currentPage = page}else{isLoading = true};
      setPermissions();
      setTimeout(() => {
         isLoading = false
         changeTabs(0)
      },200)
   };
   const editPage = async (permissionId) => {
      push('/permissions/update-permission/' + permissionId)
   }
   const deletePermission = async(permissionId) => {
      let permit = await permissions.filter(p => p.id === permissionId)[0]
      permit.status = !permit.status
      const data = await activeOrDeactivePermissionFn(permissionId , permit.status);
      if (data.status === true) {
         permissions = await updateArrayFn(permissions , permit);
         actveOrDeactiveFn(data.status,permit.status,"دسترسی");
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
                     <a href="#/roles/show-role/" class="button is-info is-rounded">نقش ها</a>
                  {/if}
                  {#if $userPermissions.includes("create-permission")}
                     <a href="#/permissions/create-permission" class="button is-link is-rounded">افزودن دسترسی</a>
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
               {#if permissions.length}
                  <div class="box back-eee">
                     <div class="table-container">
                        <table class="table is-bordered is-striped is-hoverable is-fullwidth table-container">
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
                           </thead>
                           <tbody>
                              {#each permissions as permission , index}
                                 <tr>
                                    <td style="width: 5%;">{index + number + 1}</td>
                                    <td style="width: 5%;">{permission.id}</td>
                                    <td style="width: 30%;">{permission.title}</td>
                                    <td style="width: 15%;">{permission.model}</td>
                                    <td style="width: 30%;">{permission.label}</td>
                                    <td style="width: 5%;">
                                       {#if $userPermissions.includes("status-permission")}
                                          <button on:click={deletePermission(permission.id)} 
                                             class:is-success={permission.status} 
                                             class:is-danger={!permission.status} 
                                             class="button is-small ${ permission.status ? 'is-success' : 'is-danger'}" >
                                                <i class:fa-eye={permission.status} class:fa-eye-slash={!permission.status} class="fa"></i>
                                          </button>
                                       {/if}
                                    </td>
                                    <td style="width: 5%;">
                                       {#if $userPermissions.includes("update-permission")}
                                          <button on:click={editPage(permission.id)} class="button is-small has-background-info-dark has-text-warning-light">
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
                  <Input label="عنوان " type="text" placeholder="عنوان دسترسی؟" bind:title={title} icon="fa-heading" />
                  <Input label="شرح " type="text" placeholder="شرح دسترسی؟" bind:title={label} icon="fa-tags" />
                  <Input label="بخش " type="text" placeholder="بخش دسترسی؟" bind:title={model} icon="fa-tags" />
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
