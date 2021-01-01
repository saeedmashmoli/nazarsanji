<script>
   import { push, replace , querystring  } from 'svelte-spa-router';
   import {  
      notLoading, 
      changeTabs, 
      actveOrDeactiveFn, 
      updateArrayFn,        
      flatpickrOptions,
      flatpickrTimeOptions
   } from '../../utilis/functions';
   import {  activeOrDeaciveCallFn, getCallsFn} from '../../Api/callApi';
   import { userPermissions , loading } from '../../stores';
   import qs from 'qs';
   import { onMount  } from 'svelte';
   import Paginate from '../../components/Paginate.svelte';
   import Toast from '../../components/Toast.svelte';
   import NoData from '../../components/NoData.svelte';
   import Input from '../../components/Input.svelte';
   import Flatpickr from 'svelte-flatpickr';
   import 'flatpickr/dist/flatpickr.css';
   import 'flatpickr/dist/themes/light.css';
   export let calls = [];
   export let currentPage = 1;
   export let limit = 10;
   export let last_page;
   export let total;
   export let beginDate;
   export let endDate;
   export let beginTime;
   export let endTime;
   export let name;
   export let mobile;
   export let phone;
   export let issue;
   export let minorIssue;
   export let exactIssue;
   export let month;
   export let year;
   export let callCode;
   export let status = false;
   export let isLoading = false;
   $: number = (currentPage - 1) * limit;
   onMount( async () => {
      $loading = true;
      const data = qs.parse($querystring)
      currentPage = parseInt(data.page)
      name = data.name;
      mobile = data.mobile;
      phone = data.phone;
      year = data.year;
      callCode = data.callCode;
      status = data.status;
      minorIssue = data.minorIssue;
      exactIssue = data.exactIssue;
      issue = data.issue;
      month = data.month;
      beginTime = data.beginTime;
      endTime = data.endTime;
      endDate = data.endDate;
      beginDate = data.beginDate;
      setCalls()

   })
   const setCalls = async () => {
      const input = {
         status, 
         name, 
         mobile, 
         phone, 
         callCode, 
         year, 
         month, 
         issue, 
         minorIssue, 
         exactIssue,          
         beginDate,
         endDate,
         beginTime,
         endTime
      }
      const data = await getCallsFn(input , currentPage , limit);
      if(data.status){
         const res  = data.docs
         calls = res.calls
         currentPage = res.page
         last_page = res.pages
         total = res.total
         notLoading()
      }else{
         replace('/server-error')
      }
   }
   async function changePage(page){
      const data = `show?page=${page ? page : 1}${beginDate ? "&beginDate="+beginDate : ""}${beginTime ? "&beginTime="+beginTime : ""}${endDate ? "&endDate="+endDate : ""}${endTime ? "&endTime="+endTime : ""}${name ? "&name="+name : ""}${mobile ? "&mobile="+mobile : ""}${phone ? "&phone="+phone : ""}${callCode ? "&callCode="+callCode : ""}${month ? "&month="+month : ""}${year ? "&year="+year : ""}${issue ? "&issue="+issue : ""}${minorIssue ? "&minorIssue="+minorIssue : ""}${exactIssue ? "&exactIssue="+exactIssue : ""}${status ? "&status="+status : ""}`;
      replace("/calls/show-call/" + data) ;
      setCalls();
      currentPage = page | 1;
      if(!page){
         isLoading = true
      };
      setCalls();
      setTimeout(() => {
         isLoading = false
         changeTabs(0)
      },500)
   };
   const editPage = async (callId) => {
      push('/calls/update-call/' + callId)
   }
   const activeOrdeactiveHandler = async(callId) => {
      let call = await calls.filter(p => p.id === callId)[0]
      call.status = !call.status
      const data = await activeOrDeaciveCallFn(callId , call.status);
      if (data.status === true) {
         calls = await updateArrayFn(calls, call)
         actveOrDeactiveFn(data.status,call.status,"تماس");
      }
   }
</script>
<style>
   .buttons{
      direction: ltr;
   }
   @media only screen and (max-width: 767px) {
      .buttons{
         direction: rtl;
      }
      .search-main-div{
         width: 100% !important;
      }
      .flatpickr{
         width: 100% !important;
      }
   }
   .flatpickr{
      width: 49% ;
   }
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
   .search-main-div{
      display: inline-block !important;
      width: 48%;
      vertical-align: top;
   }
</style>
<svelte:head>
	<title>تماس ها</title>
</svelte:head>
<Toast />
<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
   {#if $loading}
      <progress class="progress is-small is-primary" max="100">15%</progress>
   {:else}
      <div class="p-2">
         <div class="columns is-variable is-desktop">
            <div class="column">
               <h1 class="title">مدیریت تماس ها</h1>
            </div>
            <div class="column navbar-end">
               <div class="buttons">
                  {#if $userPermissions.includes("show-call")}
                     <a href="#/call/show-call" class="button is-info is-rounded">بخش بسته های تماس</a>
                  {/if}
                  {#if $userPermissions.includes("create-call")}
                     <a href="#/calls/create-call" class="button is-link is-rounded">افزودن تماس</a>
                  {/if}
               </div>
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
               {#if calls.length}
                           <div class="box back-eee">
                              <div class="table-container">
                                 <table class="table is-bordered is-striped is-hoverable is-fullwidth table-container">
                                    <thead>
                                       <tr>
                                          <th style="width: 5%;">ردیف</th>
                                          <th style="width: 5%;" data-key="id">شناسه</th>
                                          <th style="width: 10%;" data-key="(row) => row.customer.name">نام مشتری</th>
                                          <th style="width: 10%;" data-key="(row) => row.customer.mobile">موبایل</th>
                                          <th style="width: 10%;" data-key="issue">موضوع اصلی</th>
                                          <th style="width: 10%;" data-key="minorIssue">موضوع جزئی</th>
                                          <th style="width: 10%;" data-key="exactIssue">موضوع دقیق</th>
                                          <th style="width: 10%;" data-key="callTime">مدت مکالمه</th>
                                          <th style="width: 10%;" data-key="callCode">سرخط</th>
                                          <th style="width: 10%;" data-key="price">مبلغ مکالمه</th>
                                          <th style="width: 5%;">وضعیت</th>
                                          <th style="width: 5%;">ویرایش</th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       {#each calls as call , index}
                                          <tr>
                                             <td style="width: 5%;">{index + number + 1}</td>
                                             <td style="width: 5%;">{call.id}</td>
                                             <td style="width: 10%;">{call.customer.name}</td>
                                             <td style="width: 10%;">{call.customer.mobile}</td>
                                             <td style="width: 10%;">{call.issue}</td>
                                             <td style="width: 10%;">{call.minorIssue}</td>
                                             <td style="width: 10%;">{call.exactIssue}</td>
                                             <td style="width: 10%;">{call.callTime}</td>
                                             <td style="width: 10%;">{call.callCode}</td>
                                             <td style="width: 10%;">{call.price}</td>
                                             <td style="width: 5%;">
                                                {#if $userPermissions.includes("status-call")}
                                                   <button on:click={activeOrdeactiveHandler(call.id)} 
                                                      class:is-success={call.status} 
                                                      class:is-danger={!call.status} 
                                                      class="button is-small ${ call.status ? 'is-success' : 'is-danger'}" >
                                                         <i class:fa-eye={call.status} class:fa-eye-slash={!call.status} class="fa"></i>
                                                   </button>
                                                {/if}
                                             </td>
                                             <td style="width: 5%;">
                                                {#if $userPermissions.includes("update-call")}
                                                   <button on:click={editPage(call.id)} class="button is-small has-background-info-dark has-text-warning-light">
                                                      <i class="fa fa-edit"></i>
                                                   </button>
                                                {/if}
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
               <div style="margin: auto;" class="back-eee box column p-3 is-12-desktop is-12-tablet is-12-mobile">
                  <div class="search-main-div">
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
                     <Input label="نام " type="text" placeholder="نام مشتری؟" bind:title={name} icon="fa-user" />
                     <Input label="موبایل " type="text" placeholder="موبایل مشتری؟" bind:title={mobile} icon="fa-mobile" />
                     <Input label="تلفن " type="text" placeholder="موبایل مشتری؟" bind:title={phone} icon="fa-phone" />
                     <Input label="موضوع اصلی" type="text" placeholder="موضوع اصلی مشاوره؟" bind:title={issue} icon="fa-tasks" />
                     <Input label="موضوع جزئی" type="text" placeholder="موضوع جزئی مشاوره؟" bind:title={minorIssue} icon="fa-tasks" />
                  </div>
                  <div class="search-main-div">
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
                     <Input label="موضوع دقیق" type="text" placeholder="موضوع دقیق مشاوره؟" bind:title={exactIssue} icon="fa-tasks" />
                     <Input label="شماره سر خط" type="text" placeholder="شماره سر خط؟" bind:title={callCode} icon="fa-phone" />
                     <Input label="ماه" type="text" placeholder="ماه مکالمه؟" bind:title={month} icon="fa-calendar" />
                     <Input label="سال" type="text" placeholder="سال مکالمه؟" bind:title={year} icon="fa-calendar" />
                     <div class="field" style="display: block">
                        <div style="display : block">
                           <label for class="label">وضعیت</label> 
                        </div>
                        <div style="display : block" class="status">
                           <input id="status" type="checkbox" class="switch is-rounded is-info" bind:checked={status}>
                           <label for="status"></label>
                        </div>
                     </div>
                  </div>
                  <div style="display : block;text-align : left;margin-top:3%">
                     <button class:is-loading={isLoading} on:click={() => changePage(null)} class="button is-link">جستجو</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   {/if}
</div>
