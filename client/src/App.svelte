<script>
	import client from './svelte-apollo';
	import Router , { push, replace } from 'svelte-spa-router';
	import { wrap } from 'svelte-spa-router/wrap';
	import { onMount } from 'svelte';
	import { currentRoute, userPermissions , user } from './stores';
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
	import ShowCall from './routes/calls/ShowCall.svelte';
	import CreateCall from './routes/calls/CreateCall.svelte';
	import UpdateCall from './routes/calls/UpdateCall.svelte';
	import ShowReport from './routes/reports/ShowReport.svelte';
	import ShowCustomer from './routes/customers/ShowCustomer.svelte';
	import CreateCustomer from './routes/customers/CreateCustomer.svelte';
	import UpdateCustomer from './routes/customers/UpdateCustomer.svelte';
	import ShowPackage from './routes/packages/ShowPackage.svelte';
	import CreatePackage from './routes/packages/CreatePackage.svelte';
	import UpdatePackage from './routes/packages/UpdatePackage.svelte';
	import ShowParameter from './routes/parameters/ShowParameter.svelte';
	import CreateParameter from './routes/parameters/CreateParameter.svelte';
	import UpdateParameter from './routes/parameters/UpdateParameter.svelte';
	import ShowTemplate from './routes/templates/ShowTemplate.svelte';
	import CreateTemplate from './routes/templates/CreateTemplate.svelte';
	import UpdateTemplate from './routes/templates/UpdateTemplate.svelte';
	import ShowCondition from './routes/conditions/ShowCondition.svelte';
	import CreateCondition from './routes/conditions/CreateCondition.svelte';
	import UpdateCondition from './routes/conditions/UpdateCondition.svelte';
	import ShowComment from './routes/comments/ShowComment.svelte';
	import ShowSms from './routes/sms/ShowSms.svelte';
	import CreateSms from './routes/sms/CreateSms.svelte';
	import ShowLog from './routes/logs/ShowLog.svelte';
	import Comment from './routes/Comment.svelte';
	import Profile from './routes/Profile.svelte';
	import Notfound from './routes/errors/Notfound.svelte';
	import Error401 from './routes/errors/Error.svelte';
	import ServerError from './routes/errors/ServerError.svelte';
	import Nav from './components/Nav.svelte';
   	import SideBar from './components/SideBar.svelte';






	let loading = true;
	let deleteNav = false;
	onMount(async() => {
		await client.query({ query : MeQuery })
			.then(res => { 
				if(res.data.me){
					$user = res.data.me
					res.data.me.role.permissions.map(permit => {
						$userPermissions.push(permit.title)
					})
				}else{
					push('/')
				}
			 })
			.catch(error => {})
		loading = false
	}); 

	const routeLoaded = (event) => {
		$currentRoute = event.detail.route;
		if(event.detail.userData.deleteNav){
			deleteNav = true
		}else{
			deleteNav = false
		}
		if(event.detail.userData){
			if( event.detail.userData.isAuth && !$user.mobile){
				replace('/')
			}else if(event.detail.userData.permit && !$userPermissions.includes(event.detail.userData.permit)) {
				replace('/error')
			}else{
				return true
			}
		}else{
			return true
		}
	}
	const routes = {
		"/profile" : wrap({ asyncComponent : () => Profile , userData : { isAuth : true } }),
		"/dashboard" :  wrap({ asyncComponent : () => Dashboard , userData : { isAuth : true } }),
		"/roles/show-role/*" : wrap({ asyncComponent : () => ShowRole , userData : { permit : "show-role" , isAuth : true } }),
		"/roles/create-role" : wrap({ asyncComponent : () => CreateRole , userData : { permit : "create-role" , isAuth : true } }),
		"/roles/update-role/:id" : wrap({ asyncComponent : () => UpdateRole , userData : { permit : "update-role" , isAuth : true } }),
		"/permissions/show-Permission/*" : wrap({ asyncComponent : () => ShowPermission , userData : { permit : "show-permission" , isAuth : true } }),
		"/permissions/create-Permission" : wrap({ asyncComponent : () => CreatePermission , userData : { permit : "create-permission" , isAuth : true } }),
		"/permissions/update-Permission/:id" : wrap({ asyncComponent : () => UpdatePermission , userData : { permit : "update-permission" , isAuth : true } }),
		"/users/show-user/*" : wrap({ asyncComponent : () => ShowUser , userData : { permit : "show-user" , isAuth : true } }),
		"/users/create-user" : wrap({ asyncComponent : () => CreateUser , userData : { permit : "create-user" , isAuth : true } }),
		"/users/update-user/:id" : wrap({ asyncComponent : () => UpdateUser , userData : { permit : "update-user" , isAuth : true } }),
		"/questions/show-question/*" : wrap({ asyncComponent : () => ShowQuestion , userData : { permit : "show-question" , isAuth : true } }),
		"/questions/create-question" : wrap({ asyncComponent : () => CreateQuestion , userData : { permit : "create-question" , isAuth : true } }),
		"/questions/update-question/:id" : wrap({ asyncComponent : () => UpdateQuestion ,  userData : { permit : "update-question" , isAuth : true } }),
		"/conditions/show-condition/*" : wrap({ asyncComponent : () => ShowCondition , userData : { permit : "show-condition" , isAuth : true } }),
		"/conditions/create-condition" : wrap({ asyncComponent : () => CreateCondition , userData : { permit : "create-condition" , isAuth : true } }),
		"/conditions/update-condition/:id" : wrap({ asyncComponent : () => UpdateCondition ,  userData : { permit : "update-condition" , isAuth : true } }),
		"/calls/show-call/*" : wrap({ asyncComponent : () => ShowCall , userData : { permit : "show-call" , isAuth : true }  }),
		"/calls/create-call" : wrap({ asyncComponent : () => CreateCall , userData : { permit : "create-call" , isAuth : true } }),
		"/calls/update-call/:id" : wrap({ asyncComponent : () => UpdateCall , userData : { permit : "update-call" , isAuth : true } }),
		"/customers/show-customer/*" : wrap({ asyncComponent : () => ShowCustomer , userData : { permit : "show-customer" , isAuth : true }  }),
		"/customers/create-customer" : wrap({ asyncComponent : () => CreateCustomer , userData : { permit : "create-customer" , isAuth : true } }),
		"/customers/update-customer/:id" : wrap({ asyncComponent : () => UpdateCustomer , userData : { permit : "update-customer" , isAuth : true } }),
		"/parameters/show-parameter/*" : wrap({ asyncComponent : () => ShowParameter , userData : { permit : "show-parameter" , isAuth : true }  }),
		"/parameters/create-parameter" : wrap({ asyncComponent : () => CreateParameter , userData : { permit : "create-parameter" , isAuth : true } }),
		"/parameters/update-parameter/:id" : wrap({ asyncComponent : () => UpdateParameter , userData : { permit : "update-parameter" , isAuth : true } }),
		"/templates/show-template/*" : wrap({ asyncComponent : () => ShowTemplate , userData : { permit : "show-template" , isAuth : true }  }),
		"/templates/create-template" : wrap({ asyncComponent : () => CreateTemplate , userData : { permit : "create-template" , isAuth : true } }),
		"/templates/update-template/:id" : wrap({ asyncComponent : () => UpdateTemplate , userData : { permit : "update-template" , isAuth : true } }),
		"/sms/show-sms/*" : wrap({ asyncComponent : () => ShowSms , userData : { permit : "show-sms" , isAuth : true }  }),
		"/sms/create-sms" : wrap({ asyncComponent : () => CreateSms , userData : { permit : "create-sms" , isAuth : true } }),
		"/packages/show-package/*" : wrap({ asyncComponent : () => ShowPackage , userData : { permit : "show-package" , isAuth : true }  }),
		"/packages/create-package" : wrap({ asyncComponent : () => CreatePackage , userData : { permit : "create-package" , isAuth : true } }),
		"/packages/update-package/:id" : wrap({ asyncComponent : () => UpdatePackage , userData : { permit : "update-package" , isAuth : true } }),
		"/answers/show-answer/*" : wrap({ asyncComponent : () => ShowAnswer , userData : { permit : "show-answer" , isAuth : true } }),
		"/answers/create-answer" : wrap({ asyncComponent : () => CreateAnswer , userData : { permit : "create-answer" , isAuth : true } }),
		"/answers/update-answer/:id" : wrap({ asyncComponent : () => UpdateAnswer , userData : { permit : "update-answer" , isAuth : true } }),
		"/surveys/show-survey/*" : wrap({ asyncComponent : () => ShowSurvey , userData : { permit : "show-survey" , isAuth : true } }),
		"/surveys/create-survey" : wrap({ asyncComponent : () => CreateSurvey , userData : { permit : "create-survey" , isAuth : true } }),
		"/surveys/update-survey/:id" : wrap({ asyncComponent : () => UpdateSurvey , userData : { permit : "update-survey" , isAuth : true } }),
		"/logs/show-log/*" : wrap({ asyncComponent : () => ShowLog , userData : { permit : "show-log" , isAuth : true } }),
		"/reports/show-report" : wrap({ asyncComponent : () => ShowReport , userData : { permit : "show-report" , isAuth : true } }),
		"/comments/show-comment/*" : wrap({ asyncComponent : () => ShowComment , userData : { permit : "show-comment" , isAuth : true }  }),
		"/" : wrap({ asyncComponent : () => Login , userData : { deleteNav : true } }),
		"/comment/:id" : wrap({ asyncComponent : () => Comment , userData : { deleteNav : true } }),
		"/home/:token" : wrap({ asyncComponent : () => Home , userData : { deleteNav : true } }) ,
		"/forget-password" : wrap({ asyncComponent : () => ForgetPassword , userData : { deleteNav : true } }),
		"/error" : wrap({ asyncComponent : () => Error401 , userData : { deleteNav : true } }),
		"/server-error" : wrap({ asyncComponent : () => ServerError , userData : { deleteNav : true } }),
		"*" : wrap({ asyncComponent : () => Notfound , userData : { deleteNav : true } }),
	}

</script>
<style>
    .main-columns {
         direction: rtl; 
	}
 </style>

{#if loading}
	<progress class="progress is-small is-primary" max="100">15%</progress>
{:else if !deleteNav}
	<Nav />
	<div class="columns main-columns is-variable is-0">
		<SideBar />
		<Router {routes} on:routeLoaded={routeLoaded}  />
	</div>
{:else }
	<Router {routes} on:routeLoaded={routeLoaded}  />
{/if}

