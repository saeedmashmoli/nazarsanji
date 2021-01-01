<script>
    import { notLoading } from '../../utilis/functions';
    import {createOrUpdatePermissionFn} from '../../Api/permissionApi';
    import {loading} from '../../stores';
    import { onMount } from 'svelte';
    import { push } from 'svelte-spa-router';
    import Input from '../../components/Input.svelte';
    export let title = "";
    export let label = "";
    export let model = "";
    export let status = true;
    export let errorMessages = [];        
    onMount(() => {
        notLoading()
    })     
    const createPermission = async () => {
        const data = await createOrUpdatePermissionFn({title , label , status , model});
        if(data.status == true){
            push('/permissions/show-permission/')
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
	<title>افزودن دسترسی</title>
</svelte:head>

<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
    {#if $loading}
        <progress class="progress is-small is-primary" max="100">15%</progress>
    {:else}
        <div class="p-2">
            <div class="columns is-variable is-desktop">
                <div class="column">
                    <h3 class="title text-center is-size-4">افزودن دسترسی</h3>
                </div>
            </div>
            <div style="margin: auto;" class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                <div class="box">
                    <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                        <Input errorClass={checkErrors("title").status} label="عنوان" placeholder="عنوان دسترسی؟" type="text" bind:title={title} icon="fa-heading" />
                        <p class="help is-danger">{checkErrors("title").message}</p>
                        <Input errorClass={checkErrors("label").status} label="شرح" placeholder="شرح دسترسی؟" type="text" bind:title={label} icon="fa-tags" />
                        <p class="help is-danger">{checkErrors("label").message}</p>
                        <Input errorClass={checkErrors("model").status} label="بخش" placeholder="بخش دسترسی؟" type="text" bind:title={model} icon="fa-tags" />
                        <p class="help is-danger">{checkErrors("model").message}</p>
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
                    <div class="field is-grouped submit-parent" >
                            <button on:click={createPermission} class="button is-link">ذخیره</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>


