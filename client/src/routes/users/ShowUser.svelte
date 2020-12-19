<script>
   import { userPermissions ,loading } from '../../stores';
   import { Datatable, rows , ColumnFilterInputs } from 'svelte-simple-datatables';
   import { onMount } from 'svelte';
   import { push, replace  } from 'svelte-spa-router';
   import { dataTableSettings } from '../../utilis/constants';
   import Toast from '../../components/Toast.svelte';
   import { notLoading , updateArrayFn  } from '../../utilis/functions';
   import { getUsersFn , activeOrDeaciveUserFn } from '../../Api/userApi';
   export let users = [];
   onMount(async () =>{
      $loading = true;
      const data = await getUsersFn();
      if(data.status){
         users = data.users
      }else{
         replace('/server-error')
      }
      notLoading()
   }) 
   const editPage = async (userId) => {
      push('/users/update-user/' + userId)
   }
   const changeUser= async(userId) => {
      let user = users.filter(r => r.id === userId)[0]

      user.active = !user.active;
      
      const data = await activeOrDeaciveUserFn(userId);
      if(data.status === true){
         users = await updateArrayFn(users , user)
         if(user.active === true){
            window.pushToast('کاربر مورد نظر با موفقیت فعال شد' , "green")
         }else{
            window.pushToast('کاربر مورد نظر با موفقیت غیر فعال شد' , "red")
         }
      }else{
         window.pushToast('مشکلی در تغییر وضعیت کاربر بوجود آمده است' , '#000')
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
                     <a href="#/roles/show-role" class="button is-info is-rounded">نقش ها</a>
                  {/if}
                  {#if $userPermissions.includes("create-permission")}
                     <a href="#/users/create-user" class="button is-link is-rounded">افزودن کاربر</a>
                  {/if}
               </div>
            </div>
         </div>
         <Datatable settings={dataTableSettings} data={users}>
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
               <ColumnFilterInputs />
            </thead>
            <tbody>
               {#each $rows as row , index}
                  <tr>
                     <td style="width: 5%;">{index + 1}</td>
                     <td style="width: 5%;">{row.id}</td>
                     <td style="width: 25%;">{row.name}</td>
                     <td style="width: 15%;">{row.mobile}</td>
                     <td style="width: 25%;">{row.email}</td>
                     <td style="width: 10%;">{row.role.label}</td>
                     <td style="width: 5%;">
                        <button on:click={changeUser(row.id)} 
                           class:is-success={row.active} 
                           class:is-danger={!row.active} 
                           class="button is-small ${ row.active ? 'is-success' : 'is-danger'}" >
                              <i class:fa-eye={row.active} class:fa-eye-slash={!row.active} class="fa"></i>
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