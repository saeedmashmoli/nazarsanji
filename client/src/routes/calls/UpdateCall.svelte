<script>
        import { 
        notLoading , 
        loadSelectOptionsCustomers,
        optionIdentifier , 
        getOptionLabel , 
        getSelectionLabel
    } from '../../utilis/functions';
    import Select from 'svelte-select';
    import { createOrUpdateCallFn , getCallFn , getOptionsForCreateAndUpdateCallFn} from '../../Api/callApi';
    import {loading} from '../../stores';
    import { onMount } from 'svelte';
    import { push , location , replace} from 'svelte-spa-router';
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
    export let customer;
    export let status = true;
    export let packages = [];
    export let selectPackages = [];
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
        if(!Number.isInteger(id)){
            replace('/not-found')
        } 
        const c = await getCallFn(id)
        const p = await getOptionsForCreateAndUpdateCallFn();
        selectPackages = p;
        if(c.status){
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
            status = call.status;
            packages = call.packages;
        }else{
            replace('/not-found')
        }
        notLoading()
    });
         
    const updateCall = async () => {
        isLoading = true;
        const data = await createOrUpdateCallFn({ 
            issue , minorIssue , exactIssue , price ,  
            customerId , month , year , status , callCode , callPrice , callTime ,
            operatorCallTime , operatorDelayTime , moshaverCallTime , moshaverDelayTime,
         },packageIds(),id);
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
            <div style="margin: auto;" class="column is-12-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                <div class="box back-eee">
                    <div class="main-div">
                        <div class="field">
                            <label for="customer" class="label">
                                نام : {customer?.name ? customer.name+" | " : ""}
                                موبایل : {customer?.mobile ? customer.mobile+" | " : ""}
                                تلفن : {customer?.phone ? customer.phone : ""}
                            </label>
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
                            <label for="package" class="label"> بسته ها: 
                                {#each packages as pack ,index}
                                {#if index !== 0}
                                     | 
                                {/if}
                                    {" " + pack.title + " " } 
                                {/each}
                            </label>
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
                    <div class="field is-grouped submit-parent" >
                        <button on:click={updateCall} class="button is-link is-rounded" class:is-loading={isLoading}>ویرایش</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>


