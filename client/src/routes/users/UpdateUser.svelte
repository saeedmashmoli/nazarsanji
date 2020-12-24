<script>
    import { notLoading } from '../../utilis/functions';
    import { getUserFn , createOrUpdateUserFn , getRolesForCreateOrUpdateUserFn} from '../../Api/userApi';
    import {loading} from '../../stores';
    import { onMount } from 'svelte';
    import { push , location , replace } from 'svelte-spa-router';
    import Input from '../../components/Input.svelte';
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
        const result = await getRolesForCreateOrUpdateUserFn();
        const res = await getUserFn(id)
        if(!Number.isInteger(id)){
            replace('/not-found')
        } else if(res.status && result){
            roles = result
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
            push('/users/show-user/')
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
                        <Input errorClass={checkErrors("name").status} label="نام" placeholder="نام کاربر؟" type="text" bind:title={name} icon="fa-heading" />
                        <p class="help is-danger">{checkErrors("name").message}</p>
                        <Input errorClass={checkErrors("mobile").status} label="موبایل" placeholder="موبایل کاربر؟" type="text" bind:title={mobile} icon="fa-phone" />
                        <p class="help is-danger">{checkErrors("mobile").message}</p>
                        <Input errorClass={checkErrors("email").status} label="ایمیل" placeholder="ایمیل کاربر؟" type="text" bind:title={email} icon="fa-envelope" />
                        <p class="help is-danger">{checkErrors("email").message}</p>
                        <div class="field">
                            <label for class="label">نقش کاربر</label>
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
                                <label for class="label">وضعیت</label> 
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


