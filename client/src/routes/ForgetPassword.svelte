<script>
    import client from '../svelte-apollo';
    import { updatePassword } from '../graphql/user';
    import { push } from 'svelte-spa-router';
    import {user , userPermissions} from '../stores';
    import Input from '../components/Input.svelte';
    export let mobile = '';
    export let newPassword = '';
    export let confirmPassword = '';
    export let code = '';
    export let errorMessages;
    export let isLoading = false;
    const errorHandler = () => {
      isLoading = false;
      errorMessages = []
    }
    async function updatePasswordHandler() {
      isLoading = true;
        client.mutate({ 
            mutation : updatePassword , 
            variables : { mobile, newPassword, confirmPassword, code }
        }).then(result => {
            const data = result.data.changePassword;
            if(data.status === false){
              errorMessages = data.errors
            }else{
                $user = data.user
                data.user.role.permissions.map(permit => {
                  $userPermissions.push(permit.title)
                })
                isLoading = false;
                push('/dashboard')
            }
          }
        )
    }
</script>
<style>
  .main {
    direction: rtl;
    background: url('/images/background-login.jpg');
    background-size: cover;
    height: 100vh;
  }
  .column {
    height: 100vh;
    margin: auto;
    align-items: center;
    display: flex;
  flex-wrap: wrap;
  align-content: center;
  }
  .section {
    background: #eee;
    border-radius: 8px;
    width: 100%;
  }
  .submit {
    width: -webkit-fill-available;
  }
  .delete{
    position: relative;
    float: left;
    top: 0;
    left: 0;
  }
</style>
<svelte:head>
	<title>تغییر رمز عبور</title>
</svelte:head>
<div class="columns main is-vcentered">
  <div class="column is-4 form-login">
    <section class="section">
      <div class="has-text-centered">
          <img width="240" height="240" alt src="images/logo.jpg">
      </div>
      {#if errorMessages}
        {#each errorMessages as errorMessage}
        <div class="notification is-danger">
          <button class="delete" on:click={errorHandler}></button>
          {errorMessage.message}
        </div>
        {/each}
      {/if}
      <Input label="موبایل" type="text" bind:title={mobile} icon="fa-mobile" />
      <Input label="کد پیامکی" type="text" bind:title={code} icon="fa-sms" />
      <Input label="رمز عبور جدید" type="password" bind:title={newPassword} icon="fa-key" />
      <Input label="تکرار رمز عبور" type="password" bind:title={confirmPassword} icon="fa-key" />
      <div class="has-text-centered">
        <button class:is-loading={isLoading} class="button submit is-primary" on:click={updatePasswordHandler}>تغییر رمز عبور</button>
      </div>
      <div class="has-text-centered mt-3">
        <a href="/#/">بازگشت</a>
      </div>
    </section>
  </div>
</div>