<script>
    import { notLoading } from '../../utilis/functions';
    import { createOrUpdateCustomerFn} from '../../Api/customerApi';
    import {loading} from '../../stores';
    import { onMount } from 'svelte';
    import { push } from 'svelte-spa-router';
    import Input from '../../components/Input.svelte';
    export let name = "";
    export let mobile = "";
    export let phone = "";
    export let status = true;
    export let errorMessages = [];

    export let isLoading = false;        
    onMount( async() => {
        $loading = true;
        notLoading()
    })     
    const createUser = async () => {
        isLoading = true;
        const data = await createOrUpdateCustomerFn({ name , mobile , phone , status });
        if(data.status == true){
            push('/customers/show-customer/')
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
	<title>مشتری ها</title>
</svelte:head>

<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
    {#if $loading}
        <progress class="progress is-small is-primary" max="100">15%</progress>
    {:else}
        <div class="p-2">
            <div class="columns is-variable is-desktop">
                <div class="column">
                    <h3 class="title text-center is-size-4">افزودن مشتری</h3>
                </div>
            </div>
            <div style="margin: auto;" class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                <div class="box">
                    <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                        <Input label="نام " type="text" placeholder="نام مشتری؟" bind:title={name} icon="fa-user" />
                        <p class="help is-danger">{checkErrors("name").message}</p>
                        <Input label="موبایل " type="text" placeholder="موبایل مشتری؟" bind:title={mobile} icon="fa-mobile" />
                        <p class="help is-danger">{checkErrors("mobile").message}</p>
                        <Input label="تلفن " type="text" placeholder="موبایل مشتری؟" bind:title={phone} icon="fa-phone" />
                        <p class="help is-danger">{checkErrors("phone").message}</p>
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
                        <button on:click={createUser} class="button is-link" class:is-loading={isLoading}>ذخیره</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>


