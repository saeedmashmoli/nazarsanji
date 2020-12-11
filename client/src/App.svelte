<script>
	import client from './svelte-apollo';
	import {wrap} from 'svelte-spa-router/wrap'
	import Router, { push } from 'svelte-spa-router';
	import {onMount} from 'svelte';
	import {user} from './stores'
	import Home from './pages/Home.svelte';
	import Dashboard from './pages/Dashboard.svelte';
	import Login from './pages/Login.svelte';
	import ForgetPassword from './pages/ForgetPassword.svelte';
	import { MeQuery } from './graphql/queries/me';
	let loading = true;
	onMount(async() => {
		await client.query({ query : MeQuery })
			.then(res => { $user = res.data.me })
			.catch(error => { console.log(error) })
		loading = false
	}); 

	const routes = {
		"/" : wrap({ asyncComponent: () => Home , userData : {reason : "authenticated"} }, () => !$user),
		"/dashboard" : wrap({ asyncComponent: () => Dashboard , userData : {reason : "unauthenticated"}}, () => $user),
		"/login" : wrap({ asyncComponent: () => Login , userData : {reason : "authenticated"}}, () => !$user),
		"/forgot-password" : wrap({ asyncComponent: () => ForgetPassword , userData : {reason : "authenticated"}}, () => !$user),
	}
	const conditionsFailed = (event) => {
		const { reason } = event.detail.userData;
		console.log(reason)
		switch (reason){
			case "unauthenticated":  
				return push("/login");
			case "authenticated": 
				return push("/dashboard");
		}
	}

</script>
{#if loading}
	<progress class="progress is-small is-primary" max="100">15%</progress>
{:else}
	<Router {routes} on:routeEvent={conditionsFailed} />
{/if}

