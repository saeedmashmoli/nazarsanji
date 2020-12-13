<script>
    import client from '../svelte-apollo';
    import { loginMutation } from '../graphql/user';
    import { push } from 'svelte-spa-router';
    import {user} from '../stores'
    export let username = '';
    export let password = '';
    export let errorMessages;
    const errorHandler = () => errorMessages = []
    async function loginHanldler() {
        client.mutate({ 
            mutation : loginMutation , 
            variables : { username, password}
        }).then(result => {
            const data = result.data.login;
            if(data.status === false){
              errorMessages = data.errors
            }else{
              $user = data.user
              push('/')
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
    margin: auto;
    height: 100vh;
  }
  .section {
    background: #eee;
    border-radius: 8px;
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
<div class="is-full main is-vcentered">
  <div class="column is-4 is-vcentered">
    <section class="section is-vcentered">
      <div class="has-text-centered">
          <img width="240" height="240" src="images/logo.jpg">
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
          <input class="input" type="text" bind:value={username}>
          <span class="icon is-small is-left">
            <i class="fa fa-mobile"></i>
          </span>
        </div>
      </div>
      <div class="field">
        <label class="label">رمز عبور</label>
        <div class="control has-icons-left">
          <input class="input" type="password" bind:value={password}>
          <span class="icon is-small is-left">
            <i class="fa fa-key"></i>
          </span>
        </div>
      </div>
      <div class="has-text-centered">
        <a class="button submit is-primary" on:click={loginHanldler}>ورود</a>
      </div>
      <div class="has-text-centered mt-3">
        <a href="/#/forgot-password">رمز عبورم را فراموش کردم</a>
      </div>
    </section>
  </div>
</div>
