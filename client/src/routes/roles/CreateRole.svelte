<script>
    import {  notLoading , setSelectPermissions  } from '../../utilis/functions';
    import {getPermissionsFn , createOrUpdateRoleFn } from '../../Api/permissionRoleApi';
    import {loading} from '../../stores';
    import { onMount } from 'svelte';
    import { push } from 'svelte-spa-router';
    import Input from '../../components/Input.svelte';
    export let title = "";
    export let label = "";
    export let status = true;
    export let permissions = [];
    export let selectPermissions = [];
    export let errorMessages = [];
    onMount(async () => {
        $loading = true;
        const data = await getPermissionsFn(false);
        if(data.status){
            selectPermissions = await setSelectPermissions(data.permissions)
        }else{
            replace('/server-error')
        }
        notLoading()
    })
    const changePermissions =  (input) => {
        const permissionId = input.value
        if(permissions.includes(input.value)){
            permissions = permissions.filter( p => p !== permissionId)
        }else{
            permissions.push(permissionId)
        }
    }
        
    const createRole = async () => {
        const data = await createOrUpdateRoleFn({title , label,permissions,status});
        if(data.status == true){
            push('/roles/show-role/')
        }else{
            errorMessages = data.errors
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
</script>
<svelte:head>
	<title>افزودن نقش</title>
</svelte:head>

<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
    {#if $loading}
        <progress class="progress is-small is-primary" max="100">15%</progress>
    {:else}
        <div class="p-2">
            <div class="columns is-variable is-desktop">
                <div class="column">
                    <h3 class="title text-center is-size-4">افزودن نقش</h3>
                </div>
            </div>
            <div style="margin: auto;" class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                <div class="box">
                    <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                        <Input errorClass={checkErrors("title").status} label="عنوان" placeholder="عنوان دسترسی؟" type="text" bind:title={title} icon="fa-heading" />
                        <p class="help is-danger">{checkErrors("title").message}</p>
                        <Input errorClass={checkErrors("label").status} label="شرح" placeholder="شرح دسترسی؟" type="text" bind:title={label} icon="fa-heading" />
                        <p class="help is-danger">{checkErrors("label").message}</p>
                        <div class="field" style="direction: ltr;">
                            <div class="d-inlineblock status" >
                                <input id="status" type="checkbox" class="switch is-rounded is-info" bind:checked={status}>
                                <label for="status"></label>
                            </div>
                            <div class="d-inlineblock" style="position: relative; top: 5px">
                                <label for class="label">وضعیت</label> 
                            </div>
                        </div>
                    </div>
                    <div class="field mt-3">
                        <label for class="label">دسترسی ها</label>
                        <div class="box columns mt-3 mb-5 is-multiline is-tablet back-eee">
                            {#each selectPermissions as permit}
                                <div class="column is-one-quarter">
                                    {#each permit as access}
                                        <div class="">
                                            <label class="checkbox">
                                                <input type="checkbox" name="permission"  value={access.id} on:click={e => changePermissions(e.path[0])}>
                                                {access.label}
                                            </label>
                                        </div>
                                    {/each}
                                </div>
                            {/each}
                        </div>
                    </div>
                    <div class="field is-grouped submit-parent" >
                            <button on:click={createRole} class="button is-link">ذخیره</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>


