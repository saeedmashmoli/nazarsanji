<script>
   import { push, replace , querystring  } from 'svelte-spa-router';
   import Modal from 'svelte-simple-modal';
   import {  notLoading , changeTabs , actveOrDeactiveFn , updateArrayFn } from '../../utilis/functions';
   import { activeOrDeaciveCommentFn , getCommentsFn} from '../../Api/commentApi';
   import { userPermissions , loading } from '../../stores';
   import Paginate from '../../components/Paginate.svelte';
   import Toast from '../../components/Toast.svelte';
   import NoData from '../../components/NoData.svelte';
   import Input from '../../components/Input.svelte';
   import { onMount } from 'svelte';
   import qs from 'qs';
   import Content from './Content.svelte';
   export let currentPage = 1;
   export let limit = 10;
   export let last_page;
   export let total;
   export let questionId;
   export let smsId;
   export let callId;
   export let customerId;
   export let answerId;
   export let typeId;
   export let status;
   export let text;
   export let comments = [];
   export let isLoading = false;
   $: number = (currentPage - 1) * limit;
   onMount( async () => {
      $loading = true;
      const data = qs.parse($querystring)
      currentPage = Number(data.page)
      text = data.title;
      customerId = Number(data.customerId);
      smsId = Number(data.smsId);
      questionId = Number(data.questionId);
      callId = Number(data.callId);
      answerId = Number(data.answerId);
      typeId = Number(data.typeId);
      status = Boolean(data.status);
      setComments()
   })
   const setComments = async () => {
      const input = {
         status, 
         text,
         customerId,
         smsId,
         customerId,
         questionId,
         callId,
         answerId,
         typeId
      }
      const data = await getCommentsFn(input ,currentPage , limit);
      if(data.status){
         const res  = data.docs
         comments = res.comments
         currentPage = res.page
         last_page = res.pages
         total = res.total
         notLoading()
      }else{
         replace('/server-error')
      }
   }
   async function changePage(page){
      const data = `show?page=${page ? page : 1}${smsId ? "&smsId="+smsId : ""}${typeId ? "&typeId="+typeId : ""}${callId ? "&callId="+callId : ""}${answerId ? "&answerId="+answerId : ""}${customerId ? "&customerId="+customerId : ""}${questionId ? "&questionId="+questionId : ""}${status ? "&status="+status : ""}${text ? "&text="+text : ""}`;
      push("/comments/show-comment/" + data) ;
      if(page) {currentPage = page}else{isLoading = true};
      setComments();
      setTimeout(() => {
         isLoading = false
         changeTabs(0)
      },500)
   };
   const activeOrDeactiveHandler = async(commentId) => {
      let comment = await comments.filter(s => s.id === commentId)[0]
      comment.status = !comment.status
      const data = await activeOrDeaciveCommentFn(commentId , comment.status);
      if (data.status === true) {
         comments = await updateArrayFn(comments , comment)
         actveOrDeactiveFn(data.status,comment.status,"کامنت");
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
	<title>کامنت ها</title>
</svelte:head>
<Toast />

<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
   {#if $loading}
      <progress class="progress is-small is-primary" max="100">15%</progress>
   {:else}
      <div class="p-2">
         <div class="columns is-variable is-desktop">
            <div class="column">
               <h1 class="title">مدیریت کامنت ها</h1>
            </div>
            <div class="column navbar-end">
               <div class="buttons">
                  {#if $userPermissions.includes("show-sms")}
                     <a href="#/sms/show-sms/" class="button is-info is-rounded">بخش پیامک ها</a>
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
               {#if comments.length}
                  <div class="box back-eee">
                     <div class="table-container">
                        <table class="table is-bordered is-striped is-hoverable is-fullwidth table-container">
                           <thead>
                              <tr>
                                 <th style="width: 5%;">ردیف</th>
                                 <th style="width: 5%;">شناسه</th>
                                 <th style="width: 20%;">شرح نظرسنجی</th>
                                 <th style="width: 20%;">شرح سوال</th>
                                 <th style="width: 20%;">گزینه انتخابی</th>
                                 <th style="width: 20%;">متن کامنت</th>
                                 <th style="width: 5%;">وضعیت</th>
                                 <th style="width: 5%;">مشاهده</th>
                              </tr>
                           </thead>
                           <tbody>
                              {#each comments as comment , index}
                                 <tr>
                                    <td style="width: 5%;">{index + number + 1}</td>
                                    <td style="width: 5%;">{comment.id}</td>
                                    <td style="width: 20%;">{comment.sms.survey.title.slice(0,30)}{comment.sms.survey.title.length > 30 ? "..." : ""}</td>
                                    <td style="width: 20%;">{comment.question.title.slice(0,30)}{comment.question.title.length > 30 ? "..." : ""}</td>
                                    <td style="width: 20%;">{comment.answer.title.slice(0,30)}{comment.answer.title.length > 30 ? "..." : ""}</td>
                                    <td style="width: 20%;">{comment?.text ? `${comment?.text.length > 30  ? `${comment?.text.slice(0,30)}...` : `${comment?.text}`}` : ""}</td>
                                    <td style="width: 5%;">
                                       {#if $userPermissions.includes("status-comment")}
                                          <button on:click={activeOrDeactiveHandler(comment.id)} 
                                             class:is-success={comment.status} 
                                             class:is-danger={!comment.status} 
                                             class="button is-small ${ comment.status ? 'is-success' : 'is-danger'}" >
                                                <i class:fa-eye={comment.status} class:fa-eye-slash={!comment.status} class="fa"></i>
                                          </button>
                                       {/if}
                                    </td>
                                    <td style="width: 5%;">
                                       <Modal>
                                          <Content {comment} />
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
                  <Input label="شرح" type="text" placeholder="شرح کامنت" bind:title={text} icon="fa-heading" />
                  <Input label="شناسه تماس" type="number" placeholder="شناسه تماس؟" bind:title={questionId} icon="fa-phone" />
                  <div style="display: block;" class="field">
                     <div class="d-inlineblock"> 
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