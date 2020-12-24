<script>
   import { push, replace , querystring  } from 'svelte-spa-router';
   import {  
      notLoading,
      getSelectionLabel, 
      getOptionLabel, 
      optionIdentifier, 
      changeTabs, 
      actveOrDeactiveFn, 
      updateArrayFn
   } from '../../utilis/functions';
   import Select from 'svelte-select';
   import qs from 'qs';
   import { getUsersFn , activeOrDeaciveUserFn , getRolesForCreateOrUpdateUserFn } from '../../Api/userApi';
   import { userPermissions , loading } from '../../stores';
   import Paginate from '../../components/Paginate.svelte';
   import Toast from '../../components/Toast.svelte';
   import NoData from '../../components/NoData.svelte';
   import Input from '../../components/Input.svelte';
   import { onMount } from 'svelte';
   export let currentPage = 1;
   export let limit = 10;
   export let last_page;
   export let total;
   export let name;
   export let mobile;
   export let email;
   export let roleId;
   export let active;
   export let roles = [];
   export let users = [];
   export let isLoading = false;
   $: number = (currentPage - 1) * limit;
   onMount(async () =>{
      $loading = true;
      const data = qs.parse($querystring)
      currentPage = Number(data.page)
      name = data.name;
      mobile = data.mobile;
      email = data.email;
      roleId = Number(data.roleId);
      active = Boolean(data.active);
      const result = await getRolesForCreateOrUpdateUserFn();
      if(result){
         roles = result
      }
      setUsers()
      notLoading()
   }) 
   const setUsers = async () => {
      const input = {
         name, 
         mobile , 
         email, 
         roleId,
         active
      }
      const data = await getUsersFn(input ,currentPage , limit);
      if(data.status){
         const res  = data.docs
         users = res.users
         currentPage = res.page
         last_page = res.pages
         total = res.total
      }else{
         replace('/server-error')
      }
   }
   async function changePage(page){
      const data = `show?page=${page ? page : 1}${active ? "&active="+active : ""}${roleId ? "&roleId="+roleId : ""}${email ? "&email="+email : ""}${mobile ? "&mobile="+mobile : ""}${name ? "&name="+name : ""}`;
      push("/users/show-user/" + data) ;
      if(page) {currentPage = page}else{isLoading = true};
      setUsers();
      setTimeout(() => {
         isLoading = false
         changeTabs(0)
      },500)
   };
   const editPage = async (userId) => {
      push('/users/update-user/' + userId)
   }
   const changeUser= async(userId) => {
      let user = users.filter(r => r.id === userId)[0]
      user.active = !user.active;
      const data = await activeOrDeaciveUserFn(userId , user.active);
      if (data.status === true) {
         users = await updateArrayFn(users , user)
         actveOrDeactiveFn(data.status,user.active,"کاربر");
      }
   }
   const changeRoleId = (input) => {
      roleId = parseInt(input.detail.id)
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
	<title>کاربران</title>
</svelte:head>
<Toast />
<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
   {#if $loading}
      <progress class="progress is-small is-primary" max="100">15%</progress>
   {:else}
      <div class="p-2">
         <div class="columns is-variable is-desktop">
            <div class="column">
               <h1 class="title">مدیریت کاربران</h1>
            </div>
            <div class="column navbar-end">
               <div class="buttons">
                  {#if $userPermissions.includes("show-role")}
                     <a href="#/roles/show-role/" class="button is-info is-rounded">نقش ها</a>
                  {/if}
                  {#if $userPermissions.includes("create-user")}
                     <a href="#/users/create-user" class="button is-link is-rounded">افزودن کاربر</a>
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
               {#if users.length}
                  <div class="box back-eee">
                     <div class="table-container">
                        <table class="table is-bordered is-striped is-hoverable is-fullwidth table-container">
                           <thead>
                              <tr>
                                 <th style="width: 5%;">ردیف</th>
                                 <th style="width: 5%;" data-key="id">شناسه</th>
                                 <th style="width: 30%;" data-key="name">نام</th>
                                 <th style="width: 15%;" data-key="mobile">موبایل</th>
                                 <th style="width: 25%;" data-key="email">ایمیل</th>
                                 <th style="width: 10%;" data-key="role.label">نقش</th>
                                 <th style="width: 5%;">وضعیت</th>
                                 <th style="width: 5%;">ویرایش</th>
                              </tr>
                           </thead>
                           <tbody>
                              {#each users as user , index}
                                 <tr>
                                    <td style="width: 5%;">{index + 1}</td>
                                    <td style="width: 5%;">{user.id}</td>
                                    <td style="width: 25%;">{user.name}</td>
                                    <td style="width: 15%;">{user.mobile}</td>
                                    <td style="width: 25%;">{user.email}</td>
                                    <td style="width: 10%;">{user.role.label}</td>
                                    <td style="width: 5%;">
                                       {#if $userPermissions.includes("status-user")}
                                          <button on:click={changeUser(user.id)} 
                                             class:is-success={user.active} 
                                             class:is-danger={!user.active} 
                                             class="button is-small ${ user.active ? 'is-success' : 'is-danger'}" >
                                                <i class:fa-eye={user.active} class:fa-eye-slash={!user.active} class="fa"></i>
                                          </button>
                                       {/if}
                                    </td>
                                    <td style="width: 5%;">
                                       {#if $userPermissions.includes("update-user")}
                                          <button on:click={editPage(user.id)} class="button is-small has-background-info-dark has-text-warning-light">
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
                  <Input label="شناسه کاربر" type="text" bind:title={name} icon="fa-heading" />
                  <Input label="نام" type="text" bind:title={name} icon="fa-heading" />
                  <Input label="موبایل" type="text" bind:title={mobile} icon="fa-phone" />
                  <Input label="ایمیل" type="text" bind:title={email} icon="fa-envelope" />
                  <div style="display : block" class="field">
                     <label for="package" class="label">انتخاب نقش</label>
                     <Select 
                        items={roles} 
                        {getSelectionLabel} 
                        {optionIdentifier} 
                        {getOptionLabel} 
                        on:select={changeRoleId} 
                        noOptionsMessage="هیچگونه نقش فعالی جهت نمایش ندارد"
                        placeholder="جستجوی نقش..." 
                     />
                 </div>
                  <div style="display: block;" class="field">
                     <div class="d-inlineblock"> 
                        <div class="d-inlineblock status" >
                              <input id="status" type="checkbox" class="switch is-rounded is-info" bind:checked={active}>
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