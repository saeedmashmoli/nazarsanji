<script>
    import { notLoading } from '../../utilis/functions';
    import { getRolesFn} from '../../Api/permissionRoleApi';
    import { getUserFn , createOrUpdateUserFn} from '../../Api/userApi';
    import {loading} from '../../stores';
    import { onMount } from 'svelte';
    import { push , location } from 'svelte-spa-router';
    export let id = parseInt($location.split('/').slice(-1)[0]);
    export let name = "";
    export let mobile = "";
    export let email = "";
    export let roleId;
    export let active;
    export let roles = []
    export let errorMessages = [];
    export let isLoading = false;        
    onMount( async() => {
        $loading = true;
        const result = await getRolesFn(true);
        if(result.status){
            roles = result.roles
        }else{
            replace('/not-found')
        }
        const res = await getUserFn(id)
        if(res.status){
            const data = res.user
            active = data.active;
            name = data.name;
            roleId = data.role.id;
            email = data.email;
            mobile = data.mobile;
        }else{
            replace('/not-found')
        }
        notLoading()
    })     
    const createUser = async () => {
        isLoading = true;
        const data = await createOrUpdateUserFn({ name , email , roleId , mobile , active , password : "" } , id);
        if(data.status == true){
            push('/users/show-user')
        }else{
            errorMessages = data.errors;
            isLoading = false;
        }
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
    const changeRoleId =  (input) => {
        roleId = parseInt(input.path[0].value)
    }
</script>
<svelte:head>
	<title>ویرایش کاربر</title>
</svelte:head>

<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
    {#if $loading}
        <progress class="progress is-small is-primary" max="100">15%</progress>
    {:else}
        <div class="p-2">
            <div class="columns is-variable is-desktop">
                <div class="column">
                    <h3 class="title text-center is-size-4">ویرایش اطلاعات کاربر</h3>
                </div>
            </div>
            <div style="margin: auto;" class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                <div class="box">
                    <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                        <div class="field">
                            <label class="label">نام</label>
                            <div class="control has-icons-left has-icons-right">
                                <input class:is-danger={checkErrors("name").status} class="input" type="text" placeholder="نام کاربر را وارد نمائید" bind:value={name}>
                                <span class="icon is-small is-left">
                                    <i class="fas fa-heading"></i>
                                </span>
                                <span class="icon is-small is-right">
                                    <i class="fas fa-user"></i>
                                </span>
                            </div>

                                <p class="help is-danger">{checkErrors("title").message}</p>
                        </div>
                        <div class="field">
                            <label class="label">موبایل</label>
                            <div class="control has-icons-left has-icons-right">
                                <input class:is-danger={checkErrors("mobile").status} class="input" type="text" placeholder="موبایل کاربر را وارد نمائید" bind:value={mobile}>
                                <span class="icon is-small is-left">
                                    <i class="fas fa-phone"></i>
                                </span>
                                <span class="icon is-small is-right">
                                    <i class="fas fa-user"></i>
                                </span>
                            </div>
                            <p class="help is-danger">{checkErrors("mobile").message}</p>
                        </div>
                        <div class="field">
                            <label class="label">ایمیل</label>
                            <div class="control has-icons-left has-icons-right">
                                <input class:is-danger={checkErrors("email").status} class="input" type="text" placeholder="ایمیل کاربر را وارد نمائید" bind:value={email}>
                                <span class="icon is-small is-left">
                                    <i class="fas fa-envelope"></i>
                                </span>
                                <span class="icon is-small is-right">
                                    <i class="fas fa-user"></i>
                                </span>
                            </div>
                            <p class="help is-danger">{checkErrors("email").message}</p>
                        </div>
                        <div class="field">
                            <label class="label">نقش کاربر</label>
                            <div class="control">
                                {#each roles as role}
                                    <label class="radio">
                                        <input type="radio" value={role.id} checked={roleId == role.id}  on:click={e => changeRoleId(e)}>
                                        {role.label}
                                    </label>
                                {/each}
                            </div>
                            <p class="help is-danger">{checkErrors("roleId").message}</p>
                        </div>
                        <div class="field" style="direction: ltr;">
                            <div class="d-inlineblock status" >
                                <input id="status" type="checkbox" class="switch is-rounded is-info" bind:checked={active}>
                                <label for="status"></label>
                            </div>
                            <div class="d-inlineblock" style="position: relative; top: 5px">
                                <label class="label">وضعیت</label> 
                            </div>
                        </div>
                    </div>
                    <div class="field is-grouped submit-parent" >
                            <button on:click={createUser} class="button is-link" class:is-loading={isLoading}>اعمال تغییرات</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>


