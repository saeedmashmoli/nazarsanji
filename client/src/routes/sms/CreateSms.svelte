<script>
    import { 
        notLoading ,
        optionIdentifier , 
        getOptionLabel , 
        getSelectionLabel
    } from '../../utilis/functions';
    import { createSmsFn , getPackagesAndTemplatesForCreateSmsFn } from '../../Api/smsApi';
    import {loading} from '../../stores';
    import { onMount } from 'svelte';
    import { push } from 'svelte-spa-router';
    import Select from 'svelte-select';
    export let packageId;
    export let templateId;
    export let templates = [];
    export let packages = [];
    export let errorMessages = [];
    export let isLoading = false;        
    onMount( async() => {
        $loading = true;
        const data = await getPackagesAndTemplatesForCreateSmsFn(true);
        if( data.status){
            packages = data.packages;
            templates = data.templates
        }else{
            replace('/server-error')
        }
        notLoading()
    })     
    const createSend = async () => {
        isLoading = true;
        const data = await createSmsFn({ packageId , templateId });
        console.log(data)
        if(data.status == true){
            push('/sms/show-sms/')
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
    const changeTemplateId = (input) => {
        templateId = parseInt(input.detail.id)
    }
    const changePackageId =  (input) => {
        packageId = parseInt(input.detail.id)
    }
</script>
<svelte:head>
	<title>ارسال پیامک</title>
</svelte:head>

<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
    {#if $loading}
        <progress class="progress is-small is-primary" max="100">15%</progress>
    {:else}
        <div class="p-2">
            <div class="columns is-variable is-desktop">
                <div class="column">
                    <h3 class="title text-center is-size-4">ارسال پیامک به بسته های تماس</h3>
                </div>
            </div>
            <div style="margin: auto;" class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                <div class="box">
                    <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                        <div class="field">
                            <label for="package" class="label">انتخاب بسته</label>
                            <Select 
                                items={packages} 
                                {getSelectionLabel} 
                                {optionIdentifier} 
                                {getOptionLabel} 
                                on:select={changePackageId} 
                                noOptionsMessage="هیچگونه بسته تماس فعالی جهت ارسال پیامک وجود ندارد"
                                placeholder="جستجوی بسته تماس..." 
                            />
                            <p class="help is-danger">{checkErrors("packageId").message}</p>
                        </div>
                        <div class="field">
                            <label for="template" class="label">انتخاب قالب پیامک</label>
                            <Select 
                                items={templates} 
                                {getSelectionLabel} 
                                {optionIdentifier} 
                                {getOptionLabel} 
                                noOptionsMessage="هیچگونه قالب فعالی جهت ارسال پیامک وجود ندارد"
                                on:select={changeTemplateId} 
                                placeholder="جستجوی قالب پیامک..." 
                            />
                            <p class="help is-danger">{checkErrors("templateId").message}</p>
                        </div>
                    </div>
                    <div class="field is-grouped submit-parent" >
                        <button on:click={createSend} class="button is-link" class:is-loading={isLoading}>ذخیره</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>


