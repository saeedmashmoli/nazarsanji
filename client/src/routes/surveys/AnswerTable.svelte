<script>
    import {  actveOrDeactiveFn , updateArrayFn} from '../../utilis/functions';
    import {activeOrDeaciveAnswerFn} from '../../Api/answerApi';
    import { createEventDispatcher } from 'svelte';
    import { fly ,slide } from "svelte/transition";
    const dispatch = createEventDispatcher();
    export let answers = [];
    const activeOrdeactiveHandler = async(answerId) => {
        let answer = await answers.filter(p => p.id === answerId)[0]
        answer.status = !answer.status
        const data = await activeOrDeaciveAnswerFn(answerId , answer.status);
        if (data.status === true) {
            answers = await updateArrayFn(answers , answer)
            actveOrDeactiveFn(data.status,answer.status,"گزینه");
        }
   }
   const editAnswer = (answer) => {
      dispatch('editAnswer', {answer});
   }
</script>
<p class="subtitle is-5">گزینه های سوال</p>
<div class="box back-eee">
    <div class="table-container">
       <table class="table is-bordered is-striped is-hoverable is-fullwidth table-container">
          <thead>
             <tr>
                <th style="width: 5%;">ردیف</th>
                <th style="width: 35%;">شرح</th>
                <th style="width: 20%;">لینک</th>
                <th style="width: 10%;">تصویر</th>
                <th style="width: 15%;">پاسخ نهایی</th>
                <th style="width: 10%;">وضعیت</th>
                <th style="width: 10%;">ویرایش</th>
             </tr>
          </thead>
          <tbody transition:slide|local={{duration : 500}}>
             {#each answers as answer , index}
                <tr transition:slide|local={{duration : 500}}>
                   <td style="width: 5%;">{index + 1}</td>
                   <td style="width: 30%;">{answer.title}</td>
                   <td style="width: 20%;">{answer.link}</td>
                   <td style="width: 10%;">{#if answer.image}<img alt={answer.id} src={answer.image}>{/if}</td>
                   <td style="width: 15%;">
                        <button 
                        class:is-success={answer.flag} 
                        class:is-danger={!answer.flag} 
                        class="button disable-cursor is-small" >
                        <i  class={answer.flag ? "fas" : "fa"} class:fa-times={!answer.flag} class:fa-check={answer.flag}></i>
                        </button>
                    </td>
                   <td style="width: 10%;">
                        <button on:click={activeOrdeactiveHandler(answer.id)} 
                        class:is-success={answer.status} 
                        class:is-danger={!answer.status} 
                        class="button is-small ${ answer.status ? 'is-success' : 'is-danger'}" >
                            <i class:fa-eye={answer.status} class:fa-eye-slash={!answer.status} class="fa"></i>
                        </button>
                   </td>
                   <td style="width: 10%;">
                        <button on:click={editAnswer(answer)} class="button is-small has-background-info-dark has-text-warning-light">
                            <i class="fa fa-edit"></i>
                        </button>
                   </td>
                </tr>
             {/each}
          </tbody>
       </table> 
    </div>
 </div>