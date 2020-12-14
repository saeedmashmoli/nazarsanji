<script>
	import client from './svelte-apollo';
	import Router , { push, replace } from 'svelte-spa-router';
	import {wrap} from 'svelte-spa-router/wrap';
	import { onMount } from 'svelte';
	import { permissions , user  } from './stores';
	import { MeQuery } from './graphql/user';

	// import routes
	import Home from './routes/Home.svelte';
	import Dashboard from './routes/Dashboard.svelte';
	import Login from './routes/Login.svelte';
	import ForgetPassword from './routes/ForgetPassword.svelte';
	import ShowRole from './routes/roles/ShowRole.svelte';
	import CreateRole from './routes/roles/CreateRole.svelte';
	import UpdateRole from './routes/roles/UpdateRole.svelte';
	import ShowPermission from './routes/permissions/ShowPermission.svelte';
	import CreatePermission from './routes/permissions/CreatePermission.svelte';
	import UpdatePermission from './routes/permissions/UpdatePermission.svelte';
	import ShowQuestion from './routes/questions/ShowQuestion.svelte';
	import CreateQuestion from './routes/questions/CreateQuestion.svelte';
	import UpdateQuestion from './routes/questions/UpdateQuestion.svelte';
	import ShowSurvey from './routes/surveys/ShowSurvey.svelte';
	import CreateSurvey from './routes/surveys/CreateSurvey.svelte';
	import UpdateSurvey from './routes/surveys/UpdateSurvey.svelte';
	import ShowAnswer from './routes/answers/ShowAnswer.svelte';
	import CreateAnswer from './routes/answers/CreateAnswer.svelte';
	import UpdateAnswer from './routes/answers/UpdateAnswer.svelte';
	import ShowUser from './routes/users/ShowUser.svelte';
	import CreateUser from './routes/users/CreateUser.svelte';
	import UpdateUser from './routes/users/UpdateUser.svelte';
	import ShowData from './routes/data/ShowData.svelte';
	import CreateData from './routes/data/CreateData.svelte';
	import UpdateData from './routes/data/UpdateData.svelte';
	import ShowReport from './routes/reports/ShowReport.svelte';
	import Profile from './routes/Profile.svelte';
	import Notfound from './routes/Notfound.svelte';
	import Error401 from './routes/Error.svelte';

	let loading = true;
	onMount(async() => {
		await client.query({ query : MeQuery })
			.then(res => { 
				if(res.data.me){
					$user = res.data.me
					res.data.me.role.permissions.map(permit => {
						$permissions.push(permit.title)
					})
				}else{
					push('/')
				}
			 })
			.catch(error => {})
		loading = false
	}); 

	const routeLoaded = (event) => {
		if(event.detail.userData){
			if( event.detail.userData.isAuth && !$user.mobile){
				replace('/')
			}else if(event.detail.userData.permit && !$permissions.includes(event.detail.userData.permit)) {
				replace('/error')
			}else{
				return true
			}
		}else{
			return true
		}
	}
	const routes = {
		"/" : wrap({ asyncComponent : () => Login }),
		"/profile" : wrap({ asyncComponent : () => Profile , userData : { isAuth : true } }),
		"/dashboard" :  wrap({ asyncComponent : () => Dashboard , userData : { isAuth : true } }),
		"/roles/show-role" : wrap({ asyncComponent : () => ShowRole , userData : { permit : "show-role" , isAuth : true } }),
		"/roles/create-role" : wrap({ asyncComponent : () => CreateRole , userData : { permit : "create-role" , isAuth : true } }),
		"/roles/update-role" : wrap({ asyncComponent : () => UpdateRole , userData : { permit : "update-role" , isAuth : true } }),
		"/permissions/show-Permission" : wrap({ asyncComponent : () => ShowPermission , userData : { permit : "show-permission" , isAuth : true } }),
		"/permissions/create-Permission" : wrap({ asyncComponent : () => CreatePermission , userData : { permit : "create-permission" , isAuth : true } }),
		"/permissions/update-Permission" : wrap({ asyncComponent : () => UpdatePermission , userData : { permit : "update-permission" , isAuth : true } }),
		"/users/show-user" : wrap({ asyncComponent : () => ShowUser , userData : { permit : "show-user" , isAuth : true } }),
		"/users/create-user" : wrap({ asyncComponent : () => CreateUser , userData : { permit : "create-user" , isAuth : true } }),
		"/users/update-user" : wrap({ asyncComponent : () => UpdateUser , userData : { permit : "update-user" , isAuth : true } }),
		"/questions/show-question" : wrap({ asyncComponent : () => ShowQuestion , userData : { permit : "show-question" , isAuth : true } }),
		"/questions/create-question" : wrap({ asyncComponent : () => CreateQuestion , userData : { permit : "create-question" , isAuth : true } }),
		"/questions/update-question" : wrap({ asyncComponent : () => UpdateQuestion ,  userData : { permit : "update-question" , isAuth : true } }),
		"/data/show-data" : wrap({ asyncComponent : () => ShowData , userData : { permit : "show-data" , isAuth : true }  }),
		"/data/create-data" : wrap({ asyncComponent : () => CreateData , userData : { permit : "create-data" , isAuth : true } }),
		"/data/update-data" : wrap({ asyncComponent : () => UpdateData , userData : { permit : "update-data" , isAuth : true } }),
		"/answers/show-answer" : wrap({ asyncComponent : () => ShowAnswer , userData : { permit : "show-answer" , isAuth : true } }),
		"/answers/create-answer" : wrap({ asyncComponent : () => CreateAnswer , userData : { permit : "create-answer" , isAuth : true } }),
		"/answers/update-answer" : wrap({ asyncComponent : () => UpdateAnswer , userData : { permit : "update-answer" , isAuth : true } }),
		"/surveys/show-survey" : wrap({ asyncComponent : () => ShowSurvey , userData : { permit : "show-survey" , isAuth : true } }),
		"/surveys/create-survey" : wrap({ asyncComponent : () => CreateSurvey , userData : { permit : "create-survey" , isAuth : true } }),
		"/surveys/update-survey" : wrap({ asyncComponent : () => UpdateSurvey , userData : { permit : "update-survey" , isAuth : true } }),
		"/[token]" : wrap({ asyncComponent : () => Home }) ,
		"/forget-password" : wrap({ asyncComponent : () => ForgetPassword }),
		"/reports/show-report" : wrap({ asyncComponent : () => ShowReport , userData : { permit : "show-report" , isAuth : true } }),
		"/error" : wrap({ asyncComponent : () => Error401 }),
		"*" : wrap({ asyncComponent : () => Notfound }),
	}

</script>


{#if loading}
	<progress class="progress is-small is-primary" max="100">15%</progress>
{:else}
	<Router {routes} on:routeLoaded={routeLoaded}  />
{/if}

