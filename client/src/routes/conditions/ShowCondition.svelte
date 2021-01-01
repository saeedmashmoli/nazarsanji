<script>
   import { push, replace , querystring } from 'svelte-spa-router';
   import {  
      notLoading,
      getSelectionLabel, 
      getOptionLabel, 
      optionIdentifier, 
      changeTabs, 
      actveOrDeactiveFn, 
      updateArrayFn
   } from '../../utilis/functions';
   import {  
      activeOrDeaciveConditionFn, 
      getOptionsForCreateConditionFn , 
      getConditionsFn
   } from '../../Api/conditionApi';
   import Select from 'svelte-select';
   import { userPermissions , loading } from '../../stores';
   import Paginate from '../../components/Paginate.svelte';
   import Toast from '../../components/Toast.svelte';
   import NoData from '../../components/NoData.svelte';
   import moment from 'moment-jalaali';
   import fa from "moment/src/locale/fa";
   moment.locale("fa", fa);
   moment.loadPersian();
   import { onMount } from 'svelte';
   import qs from 'qs';
   export let conditions = [];
   export let surveys = [];
   export let currentPage = 1;
   export let limit = 10;
   export let last_page;
   export let total;
   export let questionId;
   export let criteriaId;
   export let answerId;
   export let surveyId;
   export let status;
   export let isLoading = false;
   $: number = (currentPage - 1) * limit;
   onMount( async () => {
      $loading = true;
      const data = qs.parse($querystring)
      currentPage = parseInt(data.page)
      questionId = parseInt(data.questionId);
      criteriaId = parseInt(data.criteriaId);
      answerId = parseInt(data.answerId);
      surveyId = parseInt(data.surveyId);
      status = Boolean(data.status);
      const result = await getOptionsForCreateConditionFn(true);
      if(result.status){
         surveys = result.surveys;
      }
      setConditions()

   });
   const setConditions = async () => {
      const input = {status , surveyId}
      const data = await getConditionsFn(input ,currentPage , limit);
      if(data.status){
         const res  = data.docs
         conditions = res.conditions
         currentPage = res.page
         last_page = res.pages
         total = res.total
         notLoading()
      }else{
         replace('/server-error')
      }
   }
   const editPage = async (conditionId) => {
      push('/conditions/update-condition/' + conditionId)
   }
   async function changePage(page){
      const data = `show?page=${page ? page : 1}${status ? "&status="+status : ""}${surveyId ? "&surveyId="+surveyId : ""}`;       
      push("/conditions/show-condition/"+data) ;
      if(page) {currentPage = page}else{isLoading = true};
      setConditions();
      setTimeout(() => {
         isLoading = false
         changeTabs(0)
      },300)
   };
   const activeOrdeactiveHandler = async(conditionId) => {
      let condition = await conditions.filter(p => p.id === conditionId)[0]
      condition.status = !condition.status
      const data = await activeOrDeaciveConditionFn(conditionId , condition.status);
      if (data.status === true) {
         conditions = await updateArrayFn(conditions, condition)
         actveOrDeactiveFn(data.status,condition.status,"شرط");
      }
   }
   const changeSurveyId = (input) => {
      surveyId = parseInt(input.detail.id)
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
</style>
<svelte:head>
	<title>شروط نمایش سوالات</title>
</svelte:head>
<Toast />
<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
   {#if $loading}
      <progress class="progress is-small is-primary" max="100">15%</progress>
   {:else}
      <div class="p-2">
         <div class="columns is-variable is-desktop">
            <div class="column">
               <h1 class="title">مشاهده شروط نمایش سوالات</h1>
            </div>
            <div class="column navbar-end">
               <div class="buttons">
                  {#if $userPermissions.includes("create-condition")}
                     <a href="#/conditions/create-condition" class="button is-link is-rounded">ایجاد شرط نمایش</a>
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
               {#if conditions.length}
                  <div class="box back-eee">
                     <div class="table-container">
                        <table class="table is-bordered is-striped is-hoverable is-fullwidth table-container">
                           <thead>
                              <tr>
                                 <th style="width: 5%;">ردیف</th>
                                 <th style="width: 5%;">شناسه</th>
                                 <th style="width: 15%;">عنوان نظرسنجی</th>
                                 <th style="width: 20%;">سوال مد نظر</th>
                                 <th style="width: 20%;">سوال قبلی</th>
                                 <th style="width: 15%;">عنوان گزینه</th>
                                 <th style="width: 10%;">نوع شرط</th>
                                 <th style="width: 5%;">تغییر وضعیت</th>
                                 <th style="width: 5%;">ویرایش</th>
                              </tr>
                           </thead>
                           <tbody>
                              {#each conditions as condition , index}
                                 <tr>
                                    <td style="width: 5%;">{index + number + 1}</td>
                                    <td style="width: 5%;">{condition.id}</td>
                                    <td style="width: 15%;">{condition.consQuestion.survey.title}</td>
                                    <td style="width: 20%;">{condition.consQuestion.title}</td>
                                    <td style="width: 20%;">{condition.question.title}</td>
                                    <td style="width: 15%;">{condition.answer.title}</td>
                                    <td style="width: 10%;">{condition.criteria.title}</td>
                                    <td style="width: 5%;">
                                       {#if $userPermissions.includes("status-sms")}
                                          <button on:click={activeOrdeactiveHandler(condition.id)} 
                                             class:is-success={condition.status} 
                                             class:is-danger={!condition.status} 
                                             class="button is-small">
                                             <i class={condition.status ? "fas" : "fa"} class:fa-eye={condition.status} class:fa-eye-slash={!condition.status} ></i>
                                          </button>
                                       {/if}
                                    </td>
                                    <td style="width: 10%;">
                                       {#if $userPermissions.includes("update-condition")}
                                          <button on:click={editPage(condition.id)} class="button is-small has-background-info-dark has-text-warning-light">
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
               <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                  <div style="display : block" class="field">
                     <label for="package" class="label">انتخاب نظرسنجی</label>
                     <Select 
                        items={surveys} 
                        {getSelectionLabel} 
                        {optionIdentifier} 
                        {getOptionLabel} 
                        on:select={changeSurveyId} 
                        noOptionsMessage="هیچگونه نظرسنجی فعالی جهت نمایش ندارد"
                        placeholder="جستجوی نظرسنجی..." 
                     />
                 </div>
                  <div style="display: block;" class="columns p-1 pr-2">
                     <div class="column" style="display: inline-block;"> 
                        <div class="d-inlineblock status" >
                              <input id="status" type="checkbox" class="switch is-rounded is-info" bind:checked={status}>
                              <label for="status" class="label">وضعیت</label> 
                        </div>
                     </div>
                  </div>
                  <div style="display : block;text-align : left;">
                     <button class:is-loading={isLoading} on:click={() => changePage(null)} class="button is-link">جستجو</button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   {/if}
</div>
