<script>
    import { actveOrDeactiveFn, updateArrayFn } from '../../utilis/functions';
    import { activeOrDeaciveConditionFn} from '../../Api/conditionApi';
    import { createEventDispatcher } from 'svelte';
    import { fly ,slide } from "svelte/transition";
    const dispatch = createEventDispatcher();
    export let conditions;
    const activeOrdeactiveHandler = async(conditionId) => {
        let condition = await conditions.filter(p => p.id === conditionId)[0]
        condition.status = !condition.status
        const data = await activeOrDeaciveConditionFn(conditionId , condition.status);
        if (data.status === true) {
            conditions = await updateArrayFn(conditions, condition)
            actveOrDeactiveFn(data.status,condition.status,"شرط");
        }
    }
    const editCondition = (condition) => {
      dispatch('editCondition', {condition});
   }
</script>
<p class="subtitle is-5">شروط سوال</p>
<div class="box back-eee">
    <div class="table-container">
        <table class="table is-bordered is-striped is-hoverable is-fullwidth table-container">
            <thead>
                <tr>
                    <th style="width: 5%;">ردیف</th>
                    <th style="width: 30%;">سوال</th>
                    <th style="width: 25%;">گزینه</th>
                    <th style="width: 15%;">شرط</th>
                    <th style="width: 15%;">وضعیت</th>
                    <th style="width: 10%;">ویرایش</th>
                </tr>
            </thead>
            <tbody>
                {#each conditions as condition , index}
                    <tr>
                        <td style="width: 5%;">{index + 1}</td>
                        <td style="width: 30%;">{condition.question.title.slice(0,20)}{condition.question.title.length > 20 ? "..." : ""}</td>
                        <td style="width: 25%;">{condition.answer.title.slice(0,20)}{condition.answer.title.length > 20 ? "..." : ""}</td>
                        <td style="width: 15%;">{condition.criteria.title}</td>
                        <td style="width: 15%;">
                                <button on:click={activeOrdeactiveHandler(condition.id)} 
                                class:is-success={condition.status} 
                                class:is-danger={!condition.status} 
                                class="button is-small">
                                <i class={condition.status ? "fas" : "fa"} class:fa-eye={condition.status} class:fa-eye-slash={!condition.status} ></i>
                                </button>
                        </td>
                        <td style="width: 10%;">
                            <button on:click={editCondition(condition)} class="button is-small has-background-info-dark has-text-warning-light">
                                <i class="fa fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table> 
    </div>
    </div>