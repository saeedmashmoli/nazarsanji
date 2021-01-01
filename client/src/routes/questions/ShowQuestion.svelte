<script>
   import { push, replace , querystring  } from 'svelte-spa-router';
   import {  notLoading , changeTabs , actveOrDeactiveFn , updateArrayFn} from '../../utilis/functions';
   import {  activeOrDeaciveQuestionFn, getQuestionsFn} from '../../Api/questionApi';
   import { userPermissions , loading } from '../../stores';
   import Paginate from '../../components/Paginate.svelte';
   import Toast from '../../components/Toast.svelte';
   import NoData from '../../components/NoData.svelte';
   import Input from '../../components/Input.svelte';
   import { onMount } from 'svelte';
   import qs from 'qs';
   export let currentPage = 1;
   export let limit = 10;
   export let last_page;
   export let total;
   export let title;
   export let typeId;
   export let answerId;
   export let surveyId;
   export let status;
   export let shouldBe;
   export let isLoading = false;
   $: number = (currentPage - 1) * limit;
   export let questions = [];
   onMount( async () => {
      $loading = true;
      const data = qs.parse($querystring)
      currentPage = Number(data.page)
      title = data.title;
      typeId = Number(data.typeId);
      surveyId = Number(data.surveyId);
      answerId = Number(data.answerId);
      shouldBe = Boolean(data.status);
      status = Boolean(data.status);
      setQuestions();

   })
   const setQuestions = async () => {
      const input = {
         status, 
         title, 
         shouldBe, 
         typeId,
         surveyId,
         answerId
      }
      const data = await getQuestionsFn(input ,currentPage , limit);
      if(data.status){
         const res  = data.docs
         questions = res.questions
         currentPage = res.page
         last_page = res.pages
         total = res.total
         notLoading();
      }else{
         replace('/server-error')
      }
   }
   async function changePage(page){
      const data = `show?page=${page ? page : 1}${shouldBe ? "&shouldBe="+shouldBe : ""}${typeId ? "&typeId="+typeId : ""}${answerId ? "&answerId="+answerId : ""}${surveyId ? "&surveyId="+surveyId : ""}${status ? "&status="+status : ""}${title ? "&title="+title : ""}`;
      push("/questions/show-question/" + data) ;
      if(page) {currentPage = page}else{isLoading = true};
      setQuestions();
      setTimeout(() => {
         isLoading = false
         changeTabs(0)
      },500)
   };
   const editPage = async (questionId) => {
      push('/questions/update-question/' + questionId)
   }
   const activeOrdeactiveHandler = async(questionId) => {
      let question = await questions.filter(p => p.id === questionId)[0]
      question.status = !question.status
      const data = await activeOrDeaciveQuestionFn(questionId ,question.status);
      if (data.status === true) {
         questions = await updateArrayFn(questions , question)
         actveOrDeactiveFn(data.status,question.status,"سوال");
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
	<title>سوالات</title>
</svelte:head>
<Toast />
<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
   {#if $loading}
      <progress class="progress is-small is-primary" max="100">15%</progress>
   {:else}
      <div class="p-2">
         <div class="columns is-variable is-desktop">
            <div class="column">
               <h1 class="title">سوالات نظرسنجی</h1>
            </div>
            <div class="column navbar-end">
               <div class="buttons">
                  {#if $userPermissions.includes("show-survey")}
                     <a href="#/surveys/show-survey/" class="button is-info is-rounded">بخش نظرسنجی ها</a>
                  {/if}
                  {#if $userPermissions.includes("create-question")}
                     <a href="#/questions/create-question" class="button is-link is-rounded">افزودن سوال</a>
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
               {#if questions.length}
                  <div class="box back-eee">
                     <div class="table-container">
                        <table class="table is-bordered is-striped is-hoverable is-fullwidth table-container">
                           <thead>
                              <tr>
                                 <th style="width: 5%;">ردیف</th>
                                 <th style="width: 5%;">شناسه</th>
                                 <th style="width: 30%;">عنوان</th>
                                 <th style="width: 10%;">نوع سوال</th>
                                 <th style="width: 25%;">نظرسنجی مربوطه</th>
                                 <th style="width: 10%;">نوبت نمایش</th>
                                 <th style="width: 10%;">تایید کامنت</th>
                                 <th style="width: 5%;">وضعیت</th>
                                 <th style="width: 5%;">ویرایش</th>
                              </tr>
                           </thead>
                           <tbody>
                              {#each questions as question , index}
                                 <tr>
                                    <td style="width: 5%;">{index + number + 1}</td>
                                    <td style="width: 5%;">{question.id}</td>
                                    <td style="width: 25%;">{question.title.slice(0,40)}{question.title.length > 40 ? "..." : ""}</td>
                                    <td style="width: 15%;">{question.type.title}</td>
                                    <td style="width: 25%;">{question.survey.title.slice(0,40)} {question.survey.title.length > 40 ? "..." : ""}</td>
                                    <td style="width: 10%;">{question.turn}</td>
                                    <td style="width: 10%;">
                                       <button 
                                          class:is-success={question.isUsedOk} 
                                          class:is-danger={!question.isUsedOk} 
                                          class="button disable-cursor is-small" >
                                          <i  class={question.isUsedOk ? "fas" : "fa"} class:fa-times={!question.isUsedOk} class:fa-check={question.isUsedOk}></i>
                                       </button>
                                    </td>
                                    <td style="width: 5%;">
                                       {#if $userPermissions.includes("status-question")}
                                          <button on:click={activeOrdeactiveHandler(question.id)} 
                                             class:is-success={question.status} 
                                             class:is-danger={!question.status} 
                                             class="button is-small ${ question.status ? 'is-success' : 'is-danger'}" >
                                                <i class:fa-eye={question.status} class:fa-eye-slash={!question.status} class="fa"></i>
                                          </button>
                                       {/if}
                                    </td>
                                    <td style="width: 5%;">
                                       {#if $userPermissions.includes("update-question")}
                                          <button on:click={editPage(question.id)} class="button is-small has-background-info-dark has-text-warning-light">
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
                  <Input label="عنوان" type="text" placeholder="عنوان" bind:title={title} icon="fa-heading" />
                  <Input label="شناسه سوال" type="number" placeholder="شناسه سوال؟" bind:title={answerId} icon="fa-question" />
                  <Input label="شناسه نوع سوال" type="number" placeholder="شناسه نوع سوال؟" bind:title={answerId} icon="fa-question" />
                  <Input label="شناسه نظرسنجی" type="number" placeholder="شناسه نظرسنجی؟" bind:title={answerId} icon="fa-question" />
                  <div style="display: block;" class="columns p-1 pr-2">
                     <div class="column" style="display: inline-block;"> 
                        <div class="d-inlineblock status" >
                              <input id="status" type="checkbox" class="switch is-rounded is-info" bind:checked={status}>
                              <label for="status" class="label">وضعیت</label> 
                        </div>
                     </div>
                     <div class="column" style="display: inline-block;"> 
                           <div class="d-inlineblock status" >
                              <input style="z-index: 2;width:100%" id="isDynamicLink" type="checkbox" class="switch is-rounded is-info" bind:checked={shouldBe}>
                              <label for class="label"> الزام پاسخگویی</label> 
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
