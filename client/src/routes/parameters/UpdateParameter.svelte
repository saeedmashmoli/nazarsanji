<script>
    import { notLoading } from '../../utilis/functions';
    import { createOrUpdateParameterFn, getParameterFn} from '../../Api/parameterApi';
    import {loading} from '../../stores';
    import { onMount } from 'svelte';
    import { push , location} from 'svelte-spa-router';
    import Input from '../../components/Input.svelte';
    export let id = parseInt($location.split('/').slice(-1)[0]);
    export let title = "";
    export let label = "";
    export let status = true;
    export let errorMessages = [];
    export let isLoading = false;        
    onMount( async() => {
        $loading = true;
        if(!Number.isInteger(id)){
            replace('/not-found')
        }
        const data = await getParameterFn(id);
        if(data.status){
            const parameter = data.parameter;
            title = parameter.title;
            label = parameter.label;
            status = parameter.status;
        }else{
            replace('/not-found')
        }
        notLoading()
    })     
    const updateParameter = async () => {
        isLoading = true;
        const data = await createOrUpdateParameterFn({ title , label , status } , id);
        if(data.status == true){
            push('/parameters/show-parameter/')
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
</script>
<svelte:head>
	<title>ویرایش پارامتر</title>
</svelte:head>

<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
    {#if $loading}
        <progress class="progress is-small is-primary" max="100">15%</progress>
    {:else}
        <div class="p-2">
            <div class="columns is-variable is-desktop">
                <div class="column">
                    <h3 class="title text-center is-size-4">ویرایش پارامتر</h3>
                </div>
            </div>
            <div style="margin: auto;" class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                <div class="box">
                    <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                        <Input label="عنوان " type="text" placeholder="عنوان پارامتر" bind:title={title} icon="fa-user" />
                        <p class="help is-danger">{checkErrors("title").message}</p>
                        <Input label="شرح " type="text" placeholder="شرح پارامتر" bind:title={label} icon="fa-tags" />
                        <p class="help is-danger">{checkErrors("label").message}</p>
                        <div class="field" style="direction: ltr;">
                            <div class="d-inlineblock status" >
                                <input id="status" type="checkbox" class="switch is-rounded is-info" bind:checked={status}>
                                <label for="status"></label>
                            </div>
                            <div class="d-inlineblock" style="position: relative; top: 5px">
                                <label for="status" class="label">وضعیت</label> 
                            </div>
                        </div>
                    </div>
                    <div class="field is-grouped submit-parent" >
                        <button on:click={updateParameter} class="button is-link" class:is-loading={isLoading}>ذخیره</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>


