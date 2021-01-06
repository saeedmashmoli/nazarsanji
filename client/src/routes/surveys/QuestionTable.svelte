<script>
   import {  actveOrDeactiveFn , updateArrayFn} from '../../utilis/functions';
   import {  activeOrDeaciveQuestionFn} from '../../Api/questionApi';
   import { createEventDispatcher } from 'svelte';
   import { fly ,slide } from "svelte/transition";
   const dispatch = createEventDispatcher();
   export let questions;
   const activeOrdeactiveHandler = async(questionId) => {
      let question = await questions.filter(p => p.id === questionId)[0]
      question.status = !question.status
      const data = await activeOrDeaciveQuestionFn(questionId ,question.status);
      if (data.status === true) {
         questions = await updateArrayFn(questions , question)
         actveOrDeactiveFn(data.status,question.status,"سوال");
      }
   }
   const editQuestion = (question) => {
      dispatch('editQuestion', {question});
   }
</script>

<div class="box back-eee">
    <div class="table-container">
       <table class="table is-bordered is-striped is-hoverable is-fullwidth table-container">
          <thead>
             <tr>
                <th style="width: 5%;">ردیف</th>
                <th style="width: 25%;">عنوان</th>
                <th style="width: 15%;">نوع سوال</th>
                <th style="width: 15%;">نوبت نمایش</th>
                <th style="width: 10%;">تایید کامنت</th>
                <th style="width: 15%;">الزام پاسخگویی</th>
                <th style="width: 5%;">وضعیت</th>
                <th style="width: 10%;">تنظیمات</th>
             </tr>
          </thead>
          <tbody transition:slide|local={{duration : 500}}>
             {#each questions as question , index}
                <tr>
                   <td style="width: 5%;">{index + 1}</td>
                   <td style="width: 25%;">{question.title.slice(0,20)}{question.title.length > 20 ? "..." : ""}</td>
                   <td style="width: 15%;">{question.type.title}</td>
                   <td style="width: 15%;">{question.turn}</td>
                   <td style="width: 10%;">
                      <button 
                         class:is-success={question.isUsedOk} 
                         class:is-danger={!question.isUsedOk} 
                         class="button disable-cursor is-small" >
                         <i  class={question.isUsedOk ? "fas" : "fa"} class:fa-times={!question.isUsedOk} class:fa-check={question.isUsedOk}></i>
                      </button>
                   </td>
                   <td style="width: 10%;">
                     <button 
                        class:is-success={question.shouldBe} 
                        class:is-danger={!question.shouldBe} 
                        class="button disable-cursor is-small" >
                        <i  class={question.shouldBe ? "fas" : "fa"} class:fa-times={!question.shouldBe} class:fa-check={question.shouldBe}></i>
                     </button>
                  </td>
                   <td style="width: 5%;">
                         <button on:click={activeOrdeactiveHandler(question.id)} 
                            class:is-success={question.status} 
                            class:is-danger={!question.status} 
                            class="button is-small ${ question.status ? 'is-success' : 'is-danger'}" >
                               <i class:fa-eye={question.status} class:fa-eye-slash={!question.status} class="fa"></i>
                         </button>
                   </td>
                   <td style="width: 10%;">
                         <button on:click={() => editQuestion(question)} class="button is-small has-background-info-dark has-text-warning-light">
                            <i class="fa fa-edit"></i>
                         </button>
                   </td>
                </tr>
             {/each}
          </tbody>
       </table> 
    </div>
 </div>