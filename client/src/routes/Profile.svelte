<script>
   import { onMount } from 'svelte';
   import {user , loading} from '../stores';
   import { createOrUpdateUserFn } from '../Api/userApi';
   import { notLoading } from '../utilis/functions';
   import Input from '../components/Input.svelte';
   import Toast from '../components/Toast.svelte';
   export let name;
   export let mobile;
   export let email;
   export let roleId;
   export let id;
   export let active;
   export let password = "";
   export let errorMessages = [];
   export let isLoading = false;       
   onMount(() => {
      $loading = true;
      name = $user.name;
      mobile = $user.mobile;
      email = $user.email;
      roleId = $user.roleId;
      active = $user.active;
      id = $user.id;
      notLoading();
   });
   const updateUser = async () => {
      isLoading = true;
      const data = await createOrUpdateUserFn({ name , email , roleId , mobile , active , password} , id);
      if(data.status == true){
         $user = data.user;
         window.pushToast(`اطلاعات شما با موفقیت آپدیت شد`, "green");
      }else{
         errorMessages = data.errors;
      }
      isLoading = false;
   }
   $: checkErrors = (field) => {
      let i = {status : false ,message : ""};
      errorMessages.forEach(err => {
         if(err.field === field){
               i.status = true;
               i.message = err.message;
         }
      })
      return i;
   }
 </script>
 <style>

 </style>
<svelte:head>
   <title>پروفایل</title>
</svelte:head>
<Toast />
<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
   {#if $loading}
      <progress class="progress is-small is-primary" max="100">15%</progress>
   {:else}
      <div class="p-2">
         <div class="columns is-variable is-desktop">
            <div class="column">
               <h1 class="title">پروفایل</h1>
            </div>
         </div>
         <div style="margin: auto;" class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
            <div class="box">
               <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                  <Input errorClass={checkErrors("name").status} label="نام" placeholder="نام کاربر؟" type="text" bind:title={name} icon="fa-heading" />
                  <p class="help is-danger">{checkErrors("name").message}</p>
                  <Input errorClass={checkErrors("mobile").status} label="موبایل" placeholder="موبایل کاربر؟" type="text" bind:title={mobile} icon="fa-phone" />
                  <p class="help is-danger">{checkErrors("mobile").message}</p>
                  <Input errorClass={checkErrors("email").status} label="ایمیل" placeholder="ایمیل کاربر؟" type="text" bind:title={email} icon="fa-envelope" />
                  <p class="help is-danger">{checkErrors("email").message}</p>
                  <Input errorClass={checkErrors("password").status} label="تغییر رمز عبور" placeholder="رمز عبور جدید؟" type="password" bind:title={password} icon="fa-key" />
                  <p class="help is-danger">{checkErrors("password").message}</p>
                  <div class="field is-grouped submit-parent" >
                     <button on:click={updateUser} class="button is-link" class:is-loading={isLoading}>اعمال تغییرات</button>
                  </div>
               </div>
            </div>
         </div> 
      </div>
   {/if}
</div>
