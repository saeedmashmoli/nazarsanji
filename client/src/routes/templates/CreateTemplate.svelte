<script>
    import { notLoading } from '../../utilis/functions';
    import { createOrUpdateTemplateFn , getParametersForCreateOrUpdateTemplateFn} from '../../Api/templateApi';
    import {loading} from '../../stores';
    import { onMount } from 'svelte';
    import { push } from 'svelte-spa-router';
    import Input from '../../components/Input.svelte';
    export let title = "";
    export let link = "";
    export let body = "";
    export let tempNumber;
    export let isDynamicLink = true;
    export let status = true;
    export let parameters = [];
    export let selectParameters = [];
    export let errorMessages = [];

    export let isLoading = false;        
    onMount( async() => {
        $loading = true;
        const res = await getParametersForCreateOrUpdateTemplateFn()
        if(res){
            selectParameters = res
        }else{
            replace('/not-found')
        }
        notLoading()
    })   
    const changeParameters =  (parameterId) => {
        if(parameters.includes(parameterId)){
            parameters = parameters.filter( p => p !== parameterId)
        }else{
            parameters.push(parameterId)
        }
    }  
    const createTemplate = async () => {
        let value = parameters.length > 0 ? parameters : undefined;

        isLoading = true;
        const data = await createOrUpdateTemplateFn({ 
            title, 
            tempNumber, 
            parameters : value,
            isDynamicLink, 
            link, 
            status,
            body 
        });
        if(data.status == true){
            push('/templates/show-template/')
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
	<title>ایجاد قالب</title>
</svelte:head>

<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
    {#if $loading}
        <progress class="progress is-small is-primary" max="100">15%</progress>
    {:else}
        <div class="p-2">
            <div class="columns is-variable is-desktop">
                <div class="column">
                    <h3 class="title text-center is-size-4">افزودن قالب</h3>
                </div>
            </div>
            <div style="margin: auto;" class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                <div class="box">
                    <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                        <Input label="عنوان " type="text" placeholder="عنوان قالب؟" bind:title={title} icon="fa-heading" />
                        <p class="help is-danger">{checkErrors("title").message}</p>
                        <Input label="متن پیامک" type="textarea" placeholder="متن پیامک؟" bind:title={body} icon="fa-text" />
                        <Input label="کد قالب در سامانه sms.ir " type="number" placeholder="کد قالب در سامانه sms.ir" bind:title={tempNumber} icon="fa-key" />
                        <p class="help is-danger">{checkErrors("tempNumber").message}</p>
                        <Input label="لینک " type="text" placeholder="لینک ارجاع به صفحه" bind:title={link} icon="fa-tags" />
                        <p class="help is-danger">{checkErrors("phone").message}</p>
                        <div class="field" style="direction: ltr;">
                            <div class="d-inlineblock status" >
                                <input id="status" type="checkbox" class="switch is-rounded is-info" bind:checked={status}>
                                <label for="status"></label>
                            </div>
                            <div class="d-inlineblock" style="position: relative; top: 5px">
                                <label for="status" class="label">وضعیت</label> 
                            </div>
                            <div class="d-inlineblock" style="float: right"> 
                                <div class="d-inlineblock status" >
                                <input id="isDynamicLink" type="checkbox" class="switch is-rounded is-info" bind:checked={isDynamicLink}>
                                <label for="isDynamicLink"></label>
                                </div>
                                <div class="d-inlineblock" style="position: relative; top: 5px">
                                    <label for class="label">ارسال توکن</label> 
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div class="field mt-3">
                        <label for class="label">پارامتر ها</label>
                        <div class="box columns mt-3 mb-5 is-multiline is-tablet back-eee">
                            {#each selectParameters as parameter}
                                <div class="column is-one-quarter">
                                    <div class="">
                                        <label class="checkbox">
                                            <input type="checkbox" name="permission"  value={parameter.id} on:click={e => changeParameters(parameter.id)}>
                                            {parameter.label}
                                        </label>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                    <div class="field is-grouped submit-parent" >
                        <button on:click={createTemplate} class="button is-link" class:is-loading={isLoading}>ذخیره</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>


