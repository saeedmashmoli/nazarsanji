<script>
   import { push, replace  } from 'svelte-spa-router';
   import { Datatable, rows , ColumnFilterInputs } from 'svelte-simple-datatables';
   import {  notLoading , updateArrayFn , actveOrDeactiveFn } from '../../utilis/functions';
   import {getAnswersFn , activeOrDeaciveAnswerFn} from '../../Api/answerApi'
   import { userPermissions , loading } from '../../stores';
   import Toast from '../../components/Toast.svelte';
   import { dataTableSettings } from '../../utilis/constants';
   import { onMount } from 'svelte';
   export let answers = [];
   onMount( async () => {
      $loading = true;
      const data = await getAnswersFn(false);
      if(data.status){
         answers = data.answers
      }else{
         replace('/server-error')
      }
      notLoading()
   })
   const editPage = async (answerId) => {
      push('/answers/update-answer/' + answerId)
   }
   const activeOrdeactiveHandler = async(answerId) => {
      let answer = await answers.filter(p => p.id === answerId)[0]
      answer.status = !answer.status
      const data = await activeOrDeaciveAnswerFn(answerId , answer.status);
      if (data.status === true) {
         answers = await updateArrayFn(answers , answer)
         actveOrDeactiveFn(data.status,answer.status,"گزینه");
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
	<title>گزینه ها</title>
</svelte:head>
<Toast />
<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
   {#if $loading}
      <progress class="progress is-small is-primary" max="100">15%</progress>
   {:else}
      <div class="p-2">
         <div class="columns is-variable is-desktop">
            <div class="column">
               <h1 class="title">گزینه ها</h1>
            </div>
            <div class="column navbar-end">
               <div class="buttons">
                  {#if $userPermissions.includes("show-question")}
                     <a href="#/questions/show-question/" class="button is-info is-rounded">بخش سوالات</a>
                  {/if}
                  {#if $userPermissions.includes("create-answer")}
                     <a href="#/answers/create-answer" class="button is-link is-rounded">افزودن گزینه</a>
                  {/if}
               </div>
            </div>
         </div> 
         <Datatable settings={dataTableSettings} data={answers}>
            <thead>
               <tr>
                  <th style="width: 5%;">ردیف</th>
                  <th style="width: 5%;" data-key="id">شناسه</th>
                  <th style="width: 40%;" data-key="(row) => row.title || row.link">شرح</th>
                  <th style="width: 40%;" data-key="type.title">شرح سوال</th>
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
                     <td style="width: 30%;">
                        <p>شرح: {row.title}</p>
                        <p>لینک: {row.link}</p>
                        <p>تصویر: {row.image}</p>
                     </td>
                     <td style="width: 30%;">{row.question.title}</td>
                     <td style="width: 5%;">
                        {#if $userPermissions.includes("status-answer")}
                           <button on:click={activeOrdeactiveHandler(row.id)} 
                              class:is-success={row.status} 
                              class:is-danger={!row.status} 
                              class="button is-small ${ row.status ? 'is-success' : 'is-danger'}" >
                                 <i class:fa-eye={row.status} class:fa-eye-slash={!row.status} class="fa"></i>
                           </button>
                        {/if}
                     </td>
                     <td style="width: 5%;">
                        {#if $userPermissions.includes("update-answer")}
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

