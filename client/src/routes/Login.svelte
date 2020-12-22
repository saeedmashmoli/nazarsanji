<script>
    import client from '../svelte-apollo';
    import { loginMutation , changePasswordRequest } from '../graphql/user';
    import { push } from 'svelte-spa-router';
    import { user , userPermissions } from '../stores';
    import Input from '../components/Input.svelte';
    export let username = '';
    export let password = '';
    export let errorMessages;
    export let isLoading = false;
    const errorHandler = () => {
      isLoading = false;
      errorMessages = []
    }
    async function loginHanldler() {
      isLoading = true
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
            isLoading = false;
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
      <Input label="موبایل" type="text" bind:title={username} icon="fa-mobile" />
      <Input label="رمز عبور" type="password" bind:title={password} icon="fa-key" />
      <div class="has-text-centered">
        <button class="button submit is-primary" class:is-loading={isLoading} on:click={loginHanldler}>ورود</button>
      </div>
      <div class="has-text-centered mt-3">
         <!-- svelte-ignore a11y-missing-attribute -->
        <a on:click={updatePasswordRequest}>رمز عبورم را فراموش کردم</a>
      </div>
    </section>
  </div>
</div>
