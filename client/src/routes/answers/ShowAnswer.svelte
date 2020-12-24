<script>
   import { push, replace , querystring  } from 'svelte-spa-router';
   import {  notLoading , changeTabs , actveOrDeactiveFn , updateArrayFn} from '../../utilis/functions';
   import {getAnswersFn , activeOrDeaciveAnswerFn} from '../../Api/answerApi';
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
   export let link;
   export let questionId;
   export let status;
   export let flag;
   export let answers = [];
   export let isLoading = false;
   $: number = (currentPage - 1) * limit;
   onMount( async () => {
      $loading = true;
      const data = qs.parse($querystring)
      currentPage = Number(data.page)
      title = data.title;
      link = data.link;
      questionId = data.questionId;
      flag = Boolean(data.status);
      status = Boolean(data.status);
      setAnswers()
      notLoading()
   })

   const setAnswers = async () => {
      const input = {
         status, 
         title , 
         flag, 
         link,
         questionId
      }
      const data = await getAnswersFn(input ,currentPage , limit);
      if(data.status){
         const res  = data.docs
         answers = res.answers
         currentPage = res.page
         last_page = res.pages
         total = res.total
      }else{
         replace('/server-error')
      }
   }
   async function changePage(page){
      const data = `show?page=${page ? page : 1}${flag ? "&flag="+flag : ""}${questionId ? "&questionId="+questionId : ""}${link ? "&link="+link : ""}${status ? "&status="+status : ""}${title ? "&title="+title : ""}`;
      push("/answers/show-answer/" + data) ;
      if(page) {currentPage = page}else{isLoading = true};
      setAnswers();
      setTimeout(() => {
         isLoading = false
         changeTabs(0)
      },500)
   };
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
               {#if answers.length}
                  <div class="box back-eee">
                     <div class="table-container">
                        <table class="table is-bordered is-striped is-hoverable is-fullwidth table-container">
                           <thead>
                              <tr>
                                 <th style="width: 5%;">ردیف</th>
                                 <th style="width: 5%;" data-key="id">شناسه</th>
                                 <th style="width: 40%;" data-key="(row) => row.title || row.link">شرح</th>
                                 <th style="width: 40%;" data-key="type.title">شرح سوال</th>
                                 <th style="width: 5%;">وضعیت</th>
                                 <th style="width: 5%;">ویرایش</th>
                              </tr>
                           </thead>
                           <tbody>
                              {#each answers as answer , index}
                                 <tr>
                                    <td style="width: 5%;">{index + number + 1}</td>
                                    <td style="width: 5%;">{answer.id}</td>
                                    <td style="width: 30%;">
                                       <p>شرح: {answer.title}</p>
                                       <p>لینک: {answer.link}</p>
                                       <p>تصویر: {answer.image}</p>
                                    </td>
                                    <td style="width: 30%;">{answer.question.title}</td>
                                    <td style="width: 5%;">
                                       {#if $userPermissions.includes("status-answer")}
                                          <button on:click={activeOrdeactiveHandler(answer.id)} 
                                             class:is-success={answer.status} 
                                             class:is-danger={!answer.status} 
                                             class="button is-small ${ answer.status ? 'is-success' : 'is-danger'}" >
                                                <i class:fa-eye={answer.status} class:fa-eye-slash={!answer.status} class="fa"></i>
                                          </button>
                                       {/if}
                                    </td>
                                    <td style="width: 5%;">
                                       {#if $userPermissions.includes("update-answer")}
                                          <button on:click={editPage(answer.id)} class="button is-small has-background-info-dark has-text-warning-light">
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
                  <Input label="شرح" type="text" placeholder="شرح؟" bind:title={title} icon="fa-heading" />
                  <Input label="لینک" type="text" placeholder="لینک گزینه؟" bind:title={link} icon="fa-link" />
                  <Input label="شناسه سوال" type="number" placeholder="شناسه سوال؟" bind:title={questionId} icon="fa-question" />
                  <div style="display: block;" class="columns p-1 pr-2">
                     <div class="column" style="display: inline-block;"> 
                        <div class="d-inlineblock status" >
                              <input id="status" type="checkbox" class="switch is-rounded is-info" bind:checked={status}>
                              <label for="status" class="label">وضعیت</label> 
                        </div>
                     </div>
                     <div class="column" style="display: inline-block;"> 
                           <div class="d-inlineblock status" >
                              <input style="z-index: 2;width:100%" id="isDynamicLink" type="checkbox" class="switch is-rounded is-info" bind:checked={flag}>
                              <label for class="label">پاسخ نهایی</label> 
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

