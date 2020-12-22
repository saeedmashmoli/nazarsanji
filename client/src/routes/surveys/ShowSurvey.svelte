<script>
   import { push, replace  } from 'svelte-spa-router';
   import { Datatable, rows , ColumnFilterInputs } from 'svelte-simple-datatables';
   import { notLoading , updateArrayFn , actveOrDeactiveFn } from '../../utilis/functions';
   import { activeOrDeaciveSurveyFn , getSurveysFn} from '../../Api/surveyApi';
   import { userPermissions , loading } from '../../stores';
   import Toast from '../../components/Toast.svelte';
   import { dataTableSettings } from '../../utilis/constants';
   import { onMount } from 'svelte';
   export let surveys = [];
   onMount( async () => {
      $loading = true;
      const data = await getSurveysFn(false);
      if(data.status){
         surveys = data.surveys
      }else{
         replace('/server-error')
      }
      notLoading()
   })
   const editPage = async (surveyId) => {
      push('/surveys/update-survey/' + surveyId)
   }
   const activeOrDeactiveHandler = async(surveyId) => {
      let survey = await surveys.filter(s => s.id === surveyId)[0]
      survey.status = !survey.status
      const data = await activeOrDeaciveSurveyFn(surveyId , survey.status);
      if (data.status === true) {
         surveys = await updateArrayFn(surveys , survey)
         actveOrDeactiveFn(data.status,survey.status,"نظرسنجی");
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
	<title>نظرسنجی ها</title>
</svelte:head>
<Toast />
<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
   {#if $loading}
      <progress class="progress is-small is-primary" max="100">15%</progress>
   {:else}
      <div class="p-2">
         <div class="columns is-variable is-desktop">
            <div class="column">
               <h1 class="title">مدیریت نظرسنجی ها</h1>
            </div>
            <div class="column navbar-end">
               <div class="buttons">
                  {#if $userPermissions.includes("show-question")}
                     <a href="#/questions/show-question/" class="button is-info is-rounded">بخش سوالات</a>
                  {/if}
                  {#if $userPermissions.includes("create-survey")}
                     <a href="#/surveys/create-survey" class="button is-link is-rounded">افزودن نظرسنجی</a>
                  {/if}
               </div>
            </div>
         </div>
         <Datatable settings={dataTableSettings} data={surveys}>
            <thead>
               <tr>
                  <th style="width: 5%;">ردیف</th>
                  <th style="width: 5%;" data-key="id">شناسه</th>
                  <th style="width: 30%;" data-key="title">عنوان</th>
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
                     <td style="width: 5%;">
                        {#if $userPermissions.includes("status-survey")}
                           <button on:click={activeOrDeactiveHandler(row.id)} 
                              class:is-success={row.status} 
                              class:is-danger={!row.status} 
                              class="button is-small ${ row.status ? 'is-success' : 'is-danger'}" >
                                 <i class:fa-eye={row.status} class:fa-eye-slash={!row.status} class="fa"></i>
                           </button>
                        {/if}
                     </td>
                     <td style="width: 5%;">
                        {#if $userPermissions.includes("update-survey")}
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