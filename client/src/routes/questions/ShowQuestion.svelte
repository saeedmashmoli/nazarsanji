<script>
   import { push, replace  } from 'svelte-spa-router';
   import { Datatable, rows , ColumnFilterInputs } from 'svelte-simple-datatables';
   import {  notLoading , updateArrayFn , actveOrDeactiveFn } from '../../utilis/functions';
   import {  activeOrDeaciveQuestionFn, getQuestionsFn} from '../../Api/questionApi';
   import { userPermissions , loading } from '../../stores';
   import Toast from '../../components/Toast.svelte';
   import { dataTableSettings } from '../../utilis/constants';
   import { onMount } from 'svelte';
   export let questions = [];
   onMount( async () => {
      $loading = true;
      const data = await getQuestionsFn(false);
      if(data.status){
         questions = data.questions
      }else{
         replace('/server-error')
      }
      notLoading()
   })
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
         <Datatable settings={dataTableSettings} data={questions}>
            <thead>
               <tr>
                  <th style="width: 5%;">ردیف</th>
                  <th style="width: 5%;" data-key="id">شناسه</th>
                  <th style="width: 30%;" data-key="title">عنوان</th>
                  <th style="width: 15%;" data-key="(row) => row.type.title">نوع سوال</th>
                  <th style="width: 30%;" data-key="(row) => row.survey.title">نظرسنجی مربوطه</th>
                  <th style="width: 5%;">وضعیت</th>
                  <th style="width: 5%;">ویرایش</th>
               </tr>
               <ColumnFilterInputs />
            </thead>
            <tbody>
               {#each $rows as row , index}
                  <tr>
                     <td style="width: 5%;">{index + 1}</td>
                     <td style="width: 5%;">{row.id}</td>
                     <td style="width: 30%;">{row.title}</td>
                     <td style="width: 15%;">{row.type.title}</td>
                     <td style="width: 30%;">{row.survey.title}</td>
                     <td style="width: 5%;">
                        {#if $userPermissions.includes("status-question")}
                           <button on:click={activeOrdeactiveHandler(row.id)} 
                              class:is-success={row.status} 
                              class:is-danger={!row.status} 
                              class="button is-small ${ row.status ? 'is-success' : 'is-danger'}" >
                                 <i class:fa-eye={row.status} class:fa-eye-slash={!row.status} class="fa"></i>
                           </button>
                        {/if}
                     </td>
                     <td style="width: 5%;">
                        {#if $userPermissions.includes("update-question")}
                           <button on:click={editPage(row.id)} class="button is-small has-background-info-dark has-text-warning-light">
                              <i class="fa fa-edit"></i>
                           </button>
                        {/if}
                     </td>
                  </tr>
               {/each}
            </tbody>
         </Datatable>
      </div>
   {/if}
</div>
