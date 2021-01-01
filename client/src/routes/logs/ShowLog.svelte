<script>
   import { 
        notLoading ,
        optionIdentifier , 
        getOptionLabel , 
        getSelectionLabel,
        changeTabs,
        flatpickrOptions,
        flatpickrTimeOptions,
        getJalaliDate
   } from '../../utilis/functions';
   import Select from 'svelte-select';
   import Content from './Content.svelte';
   import Modal from 'svelte-simple-modal';
   import { push, replace , querystring  } from 'svelte-spa-router';
   import {  getLogsFn , getModelsAndUsersForShowLogFn} from '../../Api/logApi';
   import { loading } from '../../stores';
   import Paginate from '../../components/Paginate.svelte';
   import Toast from '../../components/Toast.svelte';
   import NoData from '../../components/NoData.svelte';
   import Input from '../../components/Input.svelte';
   import { onMount } from 'svelte';
   import Flatpickr from 'svelte-flatpickr';
   import 'flatpickr/dist/flatpickr.css';
   import 'flatpickr/dist/themes/light.css';
   import qs from 'qs';
   export let currentPage = 1;
   export let limit = 10;
   export let last_page;
   export let total;
   export let userId;
   export let beginDate;
   export let endDate;
   export let beginTime;
   export let endTime;
   export let rowId;
   export let modelId;
   export let operation;
   export let models = [];
   export let users = [];
   export let logs = [];
   export let isLoading = false;

   $: number = (currentPage - 1) * limit;
   onMount( async () => {

      $loading = true;
      const result = await getModelsAndUsersForShowLogFn();
      if(result.status){
         models = result.models;
         users = result.users;
      }
      const data = qs.parse($querystring)
      currentPage = Number(data.page)
      modelId = Number(data.typeId);
      userId = Number(data.surveyId);
      rowId = Number(data.answerId);
      operation = data.operation;
      beginTime = data.beginTime;
      endTime = data.endTime;
      endDate = data.endDate;
      beginDate = data.beginDate;
      setLogs();

   });
   const setLogs = async () => {
      const input = {
         modelId,
         userId,
         rowId,
         operation,
         beginDate,
         endDate,
         beginTime,
         endTime
      }
      const data = await getLogsFn(input ,currentPage, limit);
      
      if(data.status){
         const res  = data.docs
         logs = res.logs
         currentPage = res.page || 1;
         last_page = res.pages
         total = res.total
         notLoading();
      }else{
         replace('/server-error')
      }

   }
   const searchSubmit = async () => {
      isLoading = true
      const data = `show?page=1${beginDate ? "&beginDate="+beginDate : ""}${beginTime ? "&beginTime="+beginTime : ""}${endDate ? "&endDate="+endDate : ""}${endTime ? "&endTime="+endTime : ""}${modelId ? "&modelId="+modelId : ""}${userId ? "&userId="+userId : ""}${rowId ? "&rowId="+rowId : ""}${operation ? "&operation="+operation : ""}`;
      push("/logs/show-log/" + data) ;
      setLogs();
      changePage();
      setTimeout(() => {
         isLoading = false
         changeTabs(0);
      },500)
   }
   const changePage = async (page) => {
      currentPage = page || 1;
      await setLogs();
   };
   const changeModelId = (input) => {
      modelId = parseInt(input.detail.id)
   }
   const changeUserId =  (input) => {
      userId = parseInt(input.detail.id)
   }

</script>
<style>
   .tabs {
    display: flex;
    flex-direction: column;
   }

   .tab-content div {
      display: none;
   }

   .tab-content div:first-child {
      display: block;
   }

   .tab-content {
      padding: 1em;
   }
   .flatpickr{
      width: 49% ;
   }
   @media only screen and (max-width: 767px) {
      .flatpickr{
         width: 100% !important;
      }
   }
</style>
<svelte:head>
	<title>لاگ ها</title>
</svelte:head>
<Toast />
<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
   {#if $loading}
      <progress class="progress is-small is-primary" max="100">15%</progress>
   {:else}
      <div class="p-2">
         <div class="columns is-variable is-desktop">
            <div class="column">
               <h1 class="title">مشاهده لاگ ها</h1>
            </div>
         </div> 
         <div class="tabs">
            <ul>
               <!-- svelte-ignore a11y-missing-attribute -->
               <li value=0 on:click={(e) => changeTabs(e.path[0].parentElement.value)} class="is-active"><a>نتایج</a></li>
               <!-- svelte-ignore a11y-missing-attribute -->
               <li value=1 on:click={(e) => changeTabs(e.path[0].parentElement.value)}><a>جستجو</a></li>
            </ul>
         </div>
         <div class="tab-content">
            <div value=0>
               {#if logs.length}
                  <div class="box back-eee">
                     <div class="table-container">
                        <table class="table is-bordered is-striped is-hoverable is-fullwidth table-container">
                           <thead>
                              <tr>
                                 <th style="width: 5%;">ردیف</th>
                                 <th style="width: 5%;" data-key="id">شناسه</th>
                                 <th style="width: 20%;">نام کاربر</th>
                                 <th style="width: 25%;">عملیات مربوط به بخش</th>
                                 <th style="width: 15%;">نوع عملیات</th>
                                 <th style="width: 10%;">شناسه مربوطه</th>
                                 <th style="width: 15%;">تاریخ</th>
                                 <th style="width: 5%;">جزئیات</th>
                              </tr>
                           </thead>
                           <tbody>
                              {#each logs as log , index}
                                 <tr>
                                    <td style="width: 5%;">{index + number + 1}</td>
                                    <td style="width: 5%;">{log.id}</td>
                                    <td style="width: 20%;">{log.user.name+" "+log.user.mobile}</td>
                                    <td style="width: 25%;">{log.model.label}</td>
                                    <td style="width: 15%;">{log.operation}</td>
                                    <td style="width: 10%;">{log.rowId}</td>
                                    <td style="width: 15%;">{getJalaliDate(log.createdAt)}</td>
                                    <td style="width: 5%;">
                                       <Modal>
                                          <Content {log} />
                                        </Modal>
                                    </td>
                                 </tr>
                              {/each}
                           </tbody>
                        </table> 
                     </div>
                  </div>
                  {#if last_page > 1}
                     <Paginate
                        {currentPage}
                        {last_page}
                        middleCount={2}
                        on:changePage={(ev) => changePage(ev.detail)}
                     ></Paginate>
                  {/if}

               {:else}
                  <NoData />
               {/if} 
            </div> 
            <div value=1>
               <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                  <div style="display:block" class="field">
                     <Flatpickr options="{ flatpickrOptions }" element="#beginDate">
                           <div style="display:inline-block;width:49%" class="control flatpickr my-picker" id="beginDate">
                              <label for class="label">از تاریخ</label>
                              <input autocomplete="off" class="input" bind:value={beginDate} type="text" placeholder="از تاریخ..." data-input>
                           </div>
                     </Flatpickr>
                     <Flatpickr options="{ flatpickrTimeOptions }" element="#beginTime">
                           <div style="display:inline-block;width:49%" class="control flatpickr my-picker" id="beginTime">
                              <label for class="label">از ساعت</label>
                              <input autocomplete="off" class="input" type="text" bind:value={beginTime}  placeholder="از ساعت..." data-input>
                           </div>
                     </Flatpickr>
                  </div>
                  <div style="display:block" class="field">
                     <Flatpickr options="{ flatpickrOptions }" element="#endDate">
                           <div style="display:inline-block;width:49%" class="control flatpickr my-picker" id="endDate">
                              <label for class="label">تا تاریخ</label>
                              <input autocomplete="off" class="input" bind:value={endDate} type="text" placeholder="تا تاریخ..." data-input>
                           </div>
                     </Flatpickr>
                     <Flatpickr options="{ flatpickrTimeOptions }" element="#endTime">
                           <div style="display:inline-block;width:49%" class="control flatpickr my-picker" id="endTime">
                              <label for class="label">تا ساعت</label>
                              <input autocomplete="off" class="input" type="text" bind:value={endTime}  placeholder="تا ساعت..." data-input>
                           </div>
                     </Flatpickr>
                  </div>
                  <Input label="شناسه مربوطه" type="number" placeholder="شناسه مربوطه؟" bind:title={rowId} icon="fa-tags" />
                  <Input label="نوع عملیات" type="text" placeholder="نوع عملیات؟" bind:title={operation} icon="fa-question" />
                  <div style="display : block;" class="field">
                     <label for="customer" class="label">انتخاب کاربر</label>
                     <Select 
                        items={users}
                        {getSelectionLabel} 
                        {optionIdentifier} 
                        {getOptionLabel} 
                        on:select={changeUserId} 
                        placeholder="جستجوی کاربر..." 
                     />
                 </div>
                 <div style="display : block;" class="field">
                     <label for="customer" class="label">عملیات مربوطه به بخش</label>
                     <Select 
                        items={models}
                        {getSelectionLabel} 
                        {optionIdentifier} 
                        {getOptionLabel} 
                        on:select={changeModelId} 
                        placeholder="جستجوی عملیات مربوطه..." 
                     />
                  </div>

                  <div style="display : block;text-align : left;">
                     <button class:is-loading={isLoading} on:click={() => searchSubmit()} class="button is-link">جستجو</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   {/if}
</div>
