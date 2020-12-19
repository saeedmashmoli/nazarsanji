<script>
    import client from '../svelte-apollo';
    import { loginMutation , changePasswordRequest } from '../graphql/user';
    import { push } from 'svelte-spa-router';
    import { user , userPermissions } from '../stores'
    export let username = '';
    export let password = '';
    export let errorMessages;
    const errorHandler = () => errorMessages = []
    async function loginHanldler() {
        client.mutate({ 
            mutation : loginMutation , 
            variables : { username, password }
        }).then(result => {
            const data = result.data.login;
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
    const updatePasswordRequest = () => {
      if(username.trim() === ''){
        errorMessages = [{
          field: 'mobile',
          message: 'لطفا شماره موبایل را وارد کنید'
        }]
      }else{
        client.mutate({ 
            mutation : changePasswordRequest , 
            variables : { mobile : username}
        }).then(result => {
            const data = result.data.changePasswordRequest;
            if(data.status === false){
              errorMessages = data.errors
            }else{
              push('/forget-password')
            }
          }
        )
      }
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
	<title>صفحه ورود</title>
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
          <input autocomplete="off" class="input" type="text" bind:value={username}>
          <span class="icon is-small is-left">
            <i class="fa fa-mobile"></i>
          </span>
        </div>
      </div>
      <div class="field">
        <label class="label">رمز عبور</label>
        <div class="control has-icons-left">
          <input autocomplete="off" class="input" type="password" bind:value={password}>
          <span class="icon is-small is-left">
            <i class="fa fa-key"></i>
          </span>
        </div>
      </div>
      <div class="has-text-centered">
        <button class="button submit is-primary" on:click={loginHanldler}>ورود</button>
      </div>
      <div class="has-text-centered mt-3">
        <a on:click={updatePasswordRequest}>رمز عبورم را فراموش کردم</a>
      </div>
    </section>
  </div>
</div>
