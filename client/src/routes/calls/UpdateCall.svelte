<script>
        import { 
        notLoading , 
        loadSelectOptionsCustomers , 
        optionIdentifier , 
        getOptionLabel , 
        getSelectionLabel
    } from '../../utilis/functions';
    import Select from 'svelte-select';
    import {getPackagesFn} from '../../Api/packageApi';
    import { createOrUpdateCallFn , getCallFn} from '../../Api/callApi';
    import {loading} from '../../stores';
    import { onMount } from 'svelte';
    import { push , location} from 'svelte-spa-router';
    import Input from '../../components/Input.svelte';
    export let id = parseInt($location.split('/').slice(-1)[0]);
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
    export let customer;
    export let status = true;
    export let packageIds = [];
    export let packages = [];
    export let errorMessages = [];
    export let isLoading = false;        
    onMount( async() => {
        $loading = true;
        if(!Number.isInteger(id)){
            replace('/not-found')
        } 
        const c = await getCallFn(id)
        const p = await getPackagesFn(true);
        if(p.status && c.status ){
            const call =  c.call
            issue = call.issue;
            minorIssue = call.minorIssue;
            exactIssue = call.exactIssue;
            callTime = call.callTime;
            callCode = call.callCode;
            callPrice = call.callPrice;
            price = call.price;
            operatorCallTime = call.operatorCallTime;
            operatorDelayTime = call.operatorDelayTime;
            moshaverCallTime = call.moshaverCallTime;
            moshaverDelayTime = call.moshaverDelayTime;
            month = call.month;
            year = call.year;
            customer = call.customer
            customerId = call.customerId;
            packageIds = call.packages;
            status = call.status;
            packages = p.packages;
        }else{
            replace('/not-found')
        }
        notLoading()
    })     
    const updateCall = async () => {
        isLoading = true;
        const data = await createOrUpdateCallFn({ 
            issue , minorIssue , exactIssue , price ,  
            customerId , month , year , status , callCode , callPrice , callTime ,
            operatorCallTime , operatorDelayTime , moshaverCallTime , moshaverDelayTime
         },packageIds, id);
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
    const changePackageId =  (input) => {
        packageId = parseInt(input.detail.id)
    }
</script>
<svelte:head>
	<title>ویرایش تماس</title>
</svelte:head>

<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
    {#if $loading}
        <progress class="progress is-small is-primary" max="100">15%</progress>
    {:else}
        <div class="p-2">
            <div class="columns is-variable is-desktop">
                <div class="column">
                    <h3 class="title text-center is-size-4">ویرایش تماس</h3>
                </div>
            </div>
            <div style="margin: auto;" class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                <div class="box">
                    <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                        <Input label="موضوع اصلی" type="text" placeholder="موضوع اصلی مشاوره؟" bind:title={issue} icon="fa-tasks" />
                        <Input label="موضوع جزئی" type="text" placeholder="موضوع جزئی مشاوره؟" bind:title={minorIssue} icon="fa-tasks" />
                        <Input label="موضوع دقیق" type="text" placeholder="موضوع دقیق مشاوره؟" bind:title={exactIssue} icon="fa-tasks" />
                        <div class="field">
                            <label for="customer" class="label column">
                                <div class="columns pr-3 pl-3">
                                    <div class="column">نام : {customer?.name ? customer.name : ""}</div>
                                    <div class="column">موبایل : {customer?.mobile ? customer.mobile : ""}</div>
                                    <div class="column">تلفن : {customer?.phone ? customer.phone : ""}</div>
                                </div>
                            </label>
                            <Select noOptionsMessage="برای تغییر نام مشتری را جستجو کنید" 
                                loadOptions={loadSelectOptionsCustomers} 
                                {getSelectionLabel} 
                                {optionIdentifier} 
                                {getOptionLabel} 
                                on:select={changeCustomerId} 
                                placeholder="نام مشتری را وارد کنید" 
                            />
                            <p class="help is-danger">{checkErrors("customerId").message}</p>
                        </div>
                        <div class="field">
                            <label for="package" class="label">انتخاب بسته</label>
                            <Select 
                                items={packages} 
                                {getSelectionLabel} 
                                {optionIdentifier} 
                                {getOptionLabel} 
                                on:select={changePackageId} 
                                placeholder="جستجوی بسته..." 
                            />
                            <p class="help is-danger">{checkErrors("packageId").message}</p>
                        </div>
                        <Input label="شماره سر خط" type="text" placeholder="شماره سر خط؟" bind:title={callCode} icon="fa-phone" />
                        <Input label="تعرفه سر خط" type="number" placeholder="تعرفه سر خط؟" bind:title={callPrice} icon="fa-money-check" />
                        <Input label="زمان مکالمه" type="number" placeholder="زمان مکالمه؟" bind:title={callTime} icon="fa-clock" />
                        <Input label="مبلغ مکالمه" type="number" placeholder="مبلغ مکالمه؟" bind:title={price} icon="fa-money-check" />
                        <Input label="ماه" type="text" placeholder="ماه مکالمه؟" bind:title={month} icon="fa-calendar" />
                        <Input label="سال" type="text" placeholder="سال مکالمه؟" bind:title={year} icon="fa-calendar" />
                        <Input label="زمان مکالمه با مشاور" type="number" placeholder="زمان مکالمه با مشاور؟" bind:title={moshaverCallTime} icon="fa-clock" />
                        <Input label="زمان انتظار مکالمه با مشاور" type="number" placeholder="زمان انتظار مکالمه با مشاور؟" bind:title={moshaverDelayTime} icon="fa-clock" />
                        <Input label="زمان مکالمه با اپراتور" type="number" placeholder="زمان مکالمه با اپراتور" bind:title={operatorCallTime} icon="fa-clock" />
                        <Input label="زمان انتظار مکالمه با اپراتور" type="number" placeholder="زمان انتظار مکالمه با اپراتور" bind:title={operatorDelayTime} icon="fa-clock" />
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
                        <button on:click={updateCall} class="button is-link" class:is-loading={isLoading}>ذخیره</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>


