<script>
    import client from '../svelte-apollo';
    import { updatePassword } from '../graphql/user';
    import { push } from 'svelte-spa-router';
    import {user , userPermissions} from '../stores'
    export let mobile = '';
    export let newPassword = '';
    export let confirmPassword = '';
    export let code = '';
    export let errorMessages;
    const errorHandler = () => errorMessages = []
    async function updatePasswordHandler() {
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
      <div class="field">
        <label class="label">موبایل</label>
        <div class="control has-icons-left">
          <input autocomplete="off" class="input" type="text" bind:value={mobile}>
          <span class="icon is-small is-left">
            <i class="fa fa-mobile"></i>
          </span>
        </div>
      </div>
      <div class="field">
        <label class="label">کد پیامکی</label>
        <div class="control has-icons-left">
          <input autocomplete="off" class="input" type="password" bind:value={code}>
          <span class="icon is-small is-left">
            <i class="fas fa-sms"></i>
          </span>
        </div>
      </div>
      <div class="field">
        <label class="label">رمز عبور جدید</label>
        <div class="control has-icons-left">
          <input autocomplete="off" class="input" type="password" bind:value={newPassword}>
          <span class="icon is-small is-left">
            <i class="fa fa-key"></i>
          </span>
        </div>
      </div>
      <div class="field">
        <label class="label">تکرار رمز عبور</label>
        <div class="control has-icons-left">
          <input autocomplete="off" class="input" type="password" bind:value={confirmPassword}>
          <span class="icon is-small is-left">
            <i class="fa fa-key"></i>
          </span>
        </div>
      </div>
      <div class="has-text-centered">
        <button class="button submit is-primary" on:click={updatePasswordHandler}>تغییر رمز عبور</button>
      </div>
      <div class="has-text-centered mt-3">
        <a href="/#/">بازگشت</a>
      </div>
    </section>
  </div>
</div>