<script>
    import { notLoading } from '../../utilis/functions';
    import { createOrUpdatePackageFn , getPackageFn} from '../../Api/packageApi';
    import {loading} from '../../stores';
    import { onMount } from 'svelte';
    import { replace , location } from 'svelte-spa-router';
    import Input from '../../components/Input.svelte';
    export let id = parseInt($location.split('/').slice(-1)[0]);
    export let title = "";
    export let status = true;
    export let errorMessages = [];        
    onMount( async () => {
        $loading = true;
        if(!Number.isInteger(id)){
            replace('/not-found')
        } 
        const result = await getPackageFn(id,false)
        if(result.status){
            const data = result.package;
            status = data.status;
            title = data.title;
        }else{
            replace('/not-found')
        }
        notLoading()
    })     
    const updatePackage = async () => {
        const data = await createOrUpdatePackageFn({title , status } ,id);
        if(data.status == true){
            replace('/packages/show-package/')
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
    async function upload(target) {
        if(target.files){
            excel = target.files[0];
        }
    }
</script>
<svelte:head>
	<title>ویرایش بسته</title>
</svelte:head>

<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
    {#if $loading}
        <progress class="progress is-small is-primary" max="100">15%</progress>
    {:else}
        <div class="p-2">
            <div class="columns is-variable is-desktop">
                <div class="column">
                    <h3 class="title text-center is-size-4">ویرایش بسته</h3>
                </div>
            </div>
            <div style="margin: auto;" class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                <div class="box">
                    <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                        <Input errorClass={checkErrors("title").status} label="عنوان" placeholder="عنوان بسته؟" type="text" bind:title={title} icon="fa-heading" />
                        <p class="help is-danger">{checkErrors("title").message}</p>
                        <div class="field">
                            <label for class="label">فایل</label>
                            <div class="control has-icons-left has-icons-right">
                                <input class:is-danger={checkErrors("file").status} class="input" on:change={e => upload(e.target)} type="file">
                                <span class="icon is-small is-left">
                                    <i class="fas fa-upload"></i>
                                </span>
                                <span class="icon is-small is-right">
                                    <i class="fas fa-user"></i>
                                </span>
                            </div>
                            <p class="help is-danger">{checkErrors("file").message}</p>
                        </div>
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
                            <button on:click={updatePackage} class="button is-link">اعمال تغییرات</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>