<script>
    import {  notLoading , setSelectPermissions } from '../../utilis/functions';
    import {getRoleFn , getPermissionsForCreateAndUpdateRoleFn , createOrUpdateRoleFn} from '../../Api/roleApi';
    import { onMount } from 'svelte';
    import { loading } from '../../stores';
    import { location ,replace , push} from 'svelte-spa-router';
    import Input from '../../components/Input.svelte';
    export let id = parseInt($location.split('/').slice(-1)[0]);
    export let status;
    export let title;
    export let label;
    export let permissions = [];
    export let selectPermissions = [];
    export let errorMessages = [];
    onMount(async () => {
        $loading = true;
        // if(!Number.isInteger(id)){
        //     replace('/not-found')
        // } 
        const result = await getRoleFn(id);
        const res = await getPermissionsForCreateAndUpdateRoleFn()
        selectPermissions = await setSelectPermissions(res)
        if(result.status){
            const data = result.role
            status = data.status;
            label = data.label;
            title = data.title;
            data.permissions.forEach( permit => {
                permissions.push(permit.id.toString())
            })
        }else{
            replace('/not-found')
        }
        
        notLoading()
    })
    const changePermissions =  (input) => {
     
        const permissionId = input.value
        if(permissions.includes(permissionId)){
            permissions = permissions.filter( p => p !== permissionId)
        }else{
            permissions.push(permissionId)
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
    const updateRole = async () => {
        const data = await createOrUpdateRoleFn({ title,  label , permissions , status} , id)
        if(data.status === false){
            errorMessages = data.errors
        }else{
            replace('/roles/show-role/')
        }
    }

</script>
<style>
    .back-eee{
        background: #eee
    }
    .status{
        position: relative;
        top: 7px;
    }
    .d-inlineblock {
        display : inline-block;
    }
    .submit-parent{
        direction : ltr;
    }
    :global(.text-center){
        text-align: center;
    }
</style>
<svelte:head>
	<title>ویرایش نقش</title>
</svelte:head>
<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
    {#if $loading}
        <progress class="progress is-small is-primary" max="100">15%</progress>
    {:else}
        <div class="p-2">
            <div class="columns is-variable is-desktop">
                <div class="column">
                    <h3 class="title text-center is-size-4">ویرایش نقش </h3>
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
                                                <input type="checkbox" name="permission" checked={permissions.includes(access.id.toString())}  value={access.id} on:click={e => changePermissions(e.path[0])}>
                                                {access.label}
                                            </label>
                                        </div>
                                    {/each}
                                </div>
                            {/each}
                        </div>
                    </div>
                    <div class="field is-grouped submit-parent" >
                            <button on:click={updateRole} class="button is-link">ذخیره</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>


