<script>
    import { 
        notLoading , 
        loadSelectOptionsCustomers , 
        optionIdentifier , 
        getOptionLabel , 
        getSelectionLabel
    } from '../../utilis/functions';
    import Select from 'svelte-select';
    import { createOrUpdateCallFn , getOptionsForCreateAndUpdateCallFn} from '../../Api/callApi';
    import {loading} from '../../stores';
    import { onMount } from 'svelte';
    import { push } from 'svelte-spa-router';
    import Input from '../../components/Input.svelte';
    export let issue = "";
    export let minorIssue = "";
    export let exactIssue = "";
    export let callTime = 0;
    export let callCode = "";
    export let callPrice = 0;
    export let price = 0;
    export let operatorCallTime = 0;
    export let operatorDelayTime = 0;
    export let moshaverCallTime = 0;
    export let moshaverDelayTime = 0;
    export let month = "";
    export let year = "";
    export let customerId;
    export let packageId;
    export let status = true;
    export let selectPackages = [];
    export let packages = [];
    export let errorMessages = [];
    export let isLoading = false;
    $: packageIds = () => {
        let array = [];
        packages.forEach(pack => {
            array.push(pack.id);
        })
        return array;
    };        
    onMount( async() => {
        $loading = true;
        selectPackages = await getOptionsForCreateAndUpdateCallFn();
        notLoading()
    })     
    const createCall = async () => {
        isLoading = true;
        const data = await createOrUpdateCallFn({ 
            issue , minorIssue , exactIssue , price , packageId, 
            customerId , month , year , status , callCode , callPrice , callTime ,
            operatorCallTime , operatorDelayTime , moshaverCallTime , moshaverDelayTime
         },packageIds());
        if(data.status == true){
            push('/calls/show-call/')
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
 

    const changeCustomerId = (input) => {
        customerId = parseInt(input.detail.id)
    }
    const changePackages =  (input) => {
        packages = input.detail;
    }
</script>
<style>
    @media only screen and (max-width: 767px) {
        .main-div{
            width: 100% !important;
            margin-top: 4% !important;
        }
    }
    .main-div{
      display: inline-block !important;
      width: 48%;
      vertical-align: top;
   }
   .submit-parent {
       margin-top: 3%;
   }
</style>
<svelte:head>
	<title>افزودن تماس</title>
</svelte:head>

<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
    {#if $loading}
        <progress class="progress is-small is-primary" max="100">15%</progress>
    {:else}
        <div class="p-2">
            <div class="columns is-variable is-desktop">
                <div class="column">
                    <h3 class="title text-center is-size-4">افزودن تماس</h3>
                </div>
            </div>
            <div style="margin: auto;" class="column is-12-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                <div class="box back-eee">
                    <div class="main-div">
                        <div class="field">
                            <label for="customer" class="label">انتخاب مشتری</label>
                            <Select 
                                style="height : 39px !important"
                                noOptionsMessage="نام مشتری را وارد کنید" 
                                loadOptions={loadSelectOptionsCustomers} 
                                {getSelectionLabel} 
                                {optionIdentifier} 
                                {getOptionLabel} 
                                on:select={changeCustomerId} 
                                placeholder="جستجوی مشتری..." 
                            />
                            <p class="help is-danger">{checkErrors("customerId").message}</p>
                        </div>
                        <Input label="موضوع اصلی" type="text" placeholder="موضوع اصلی مشاوره؟" bind:title={issue} icon="fa-tasks" />

                        <Input label="موضوع دقیق" type="text" placeholder="موضوع دقیق مشاوره؟" bind:title={exactIssue} icon="fa-tasks" />
                        <Input label="شماره سر خط" type="text" placeholder="شماره سر خط؟" bind:title={callCode} icon="fa-phone" />
                        <Input label="تعرفه سر خط" type="number" placeholder="تعرفه سر خط؟" bind:title={callPrice} icon="fa-money-check" />
                        <Input label="زمان مکالمه" type="number" placeholder="زمان مکالمه؟" bind:title={callTime} icon="fa-clock" />
                        <Input label="سال" type="text" placeholder="سال مکالمه؟" bind:title={year} icon="fa-calendar" />
                        <Input label="مبلغ مکالمه" type="number" placeholder="مبلغ مکالمه؟" bind:title={price} icon="fa-money-check" />
                    </div>
                    <div class="main-div">
                        
                        <div class="field">
                            <label for="package" class="label">انتخاب بسته</label>
                            <Select 
                                isMulti
                                items={selectPackages} 
                                {getSelectionLabel} 
                                {optionIdentifier} 
                                {getOptionLabel} 
                                on:select={changePackages} 
                                placeholder="جستجوی بسته..." 
                            />
                        </div>
                        <Input label="موضوع جزئی" type="text" placeholder="موضوع جزئی مشاوره؟" bind:title={minorIssue} icon="fa-tasks" />
                        <Input label="زمان مکالمه با مشاور" type="number" placeholder="زمان مکالمه با مشاور؟" bind:title={moshaverCallTime} icon="fa-clock" />
                        <Input label="زمان انتظار مکالمه با مشاور" type="number" placeholder="زمان انتظار مکالمه با مشاور؟" bind:title={moshaverDelayTime} icon="fa-clock" />
                        <Input label="زمان مکالمه با اپراتور" type="number" placeholder="زمان مکالمه با اپراتور" bind:title={operatorCallTime} icon="fa-clock" />
                        <Input label="زمان انتظار مکالمه با اپراتور" type="number" placeholder="زمان انتظار مکالمه با اپراتور" bind:title={operatorDelayTime} icon="fa-clock" />
                        <Input label="ماه" type="text" placeholder="ماه مکالمه؟" bind:title={month} icon="fa-calendar" />
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

                    <div class="field submit-parent" >
                            <button on:click={createCall} class="button is-link is-rounded" class:is-loading={isLoading}>ذخیره</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>


