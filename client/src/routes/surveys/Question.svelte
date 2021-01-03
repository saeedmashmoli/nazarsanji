<script>
    import { fly ,slide } from "svelte/transition";
    import { createOrUpdateQuestionFn , getTypesForCreateOrUpdateQuestionFn } from '../../Api/questionApi';
    import Input from '../../components/Input.svelte';
    import Condition from './Condition.svelte';
    import Answer from './Answer.svelte';
    import { onMount , createEventDispatcher , tick} from 'svelte';
    import ConditionTable from "./ConditionTable.svelte";
    import AnswerTable from "./AnswerTable.svelte";
    const dispatch = createEventDispatcher();
    export let questions = [];
    export let criterias;
    export let types = [];
    export let surveyId;
    export let title;
    export let id;
    export let turn;
    export let status = true;
    export let typeId;
    export let shouldBe;
    export let isUsedOk;
    export let answer = {
        id : undefined,
        title : undefined,
        flag : undefined,
        status : undefined,
        link : undefined,
        image : undefined,
        percent : undefined
    };
    export let condition = {
        id : undefined,
        questionId : undefined,
        answerId : undefined,
        criteriaId : undefined,
        status : undefined
    };
    export let errorMessages = [];    
    export let answers = [];
    export let conditions = [];
    export let showCreateAnswerFormFlag = false;
    export let showEditAnswerFormFlag = false;
    export let showCreateConditionFormFlag = false;
    export let showEditConditionFormFlag = false;    
    export let editLoading = false; 
    export let addAnswerLoading = false;
    export let addConditionLoading = false;
    onMount(async() => {
        showEditAnswerFormFlag = false;
        showCreateAnswerFormFlag = false;
        showCreateConditionFormFlag = false;
        showEditConditionFormFlag = false;
    });

    const createOrEditQuestion = async () => {
        editLoading = true;
        const data = await createOrUpdateQuestionFn({title ,status ,shouldBe ,typeId , turn ,surveyId , isUsedOk},id);
        if(data.status == true){
            dispatch('submit', {question : data.question , newCreate : id ? false : true});
            if(!id){
                title = undefined;
                status = true;
                shouldBe = false;
                typeId = undefined;
                turn = undefined;
                isUsedOk = false;
                answers : [];
                conditions : [];
            }
        }else{
            errorMessages = data.errors
        }
        setTimeout(() => {
            editLoading = false;
        },500)
    }
    const changeTypeId =  (input) => {
        typeId = parseInt(input.path[0].value)
    }
    $: checkErrors = (field) => {
        let i = {status : false ,message : ""};
        errorMessages.forEach(err => {
            if(err.field === field){
                i.status = true;
                i.message = err.message;
            }
        })

        return i;
    }
    const onShowAnswerTable = async (e) => {
        const {newCreate} = e.detail;
        const an = e.detail.answer
        if(!newCreate){
            answers = answers.filter(a => a.id !== an.id);
        }
        answers = [...answers, an];
    }
    const onShowConditionTable = async (e) => {
        const {newCreate} = e.detail;
        const cond = e.detail.condition
        if(!newCreate){
            conditions = conditions.filter(c => c.id !== cond.id);
        }
        conditions = [...conditions, cond];
    }
    const showAnswerForm = () => {
        answer = {status : true}
        addAnswerLoading = true;
        showEditAnswerFormFlag = false;
        showCreateAnswerFormFlag = !showCreateAnswerFormFlag;
        setTimeout(() => {
            addAnswerLoading = false;
        }, 500)
    }
    const showEditAnswerForm = async (e) => {
        answer = e.detail.answer;
        showCreateAnswerFormFlag = false;
        showEditAnswerFormFlag = true
    }
    const showConditionForm = () => {
        condition = {status : true}
        addConditionLoading = true;
        showEditConditionFormFlag = false;
        showCreateConditionFormFlag = !showCreateConditionFormFlag;
        setTimeout(() => {
            addConditionLoading = false;
        }, 500)
    }
    const showEditConditionForm = (e) => {
        condition = e.detail.condition;
        showCreateConditionFormFlag = false;
        showEditConditionFormFlag = true
    }
</script>
<style>
    .margin-auto {
        margin: auto;
    }
</style>
<div class="box">
    <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
        <Input label="عنوان سوال" placeholder="عنوان سوال؟" type="textarea" bind:title={title} icon="fa-heading" />
        <p class="help is-danger">{checkErrors("title").message}</p>
        <Input errorClass={checkErrors("turn").status} label="نوبت نمایش" placeholder="نوبت نمایش سوال؟" type="number" bind:title={turn} icon="fa-arrows" />
        <p class="help is-danger">{checkErrors("turn").message}</p>
        
        <div class="field">
            <div class="d-inlineblock status" >
                <input id="question-status" type="checkbox" class="switch is-rounded is-info" bind:checked={status}>
                <label for="question-status"></label>
            </div>
            <div class="d-inlineblock" style="position: relative; top: 5px">
                <label for class="label">وضعیت</label> 
            </div>
        </div>
        <div class="field">
            <div class="d-inlineblock status" >
                <input id="shouldBe" type="checkbox" class="switch is-rounded is-info" bind:checked={shouldBe}>
                <label for="shouldBe"></label>
            </div>
            <div class="d-inlineblock" style="position: relative; top: 5px">
                <label for class="label">الزام پاسخگویی</label> 
            </div>
        </div>
        <div class="field">
            <div class="d-inlineblock status" >
                <input id="isUsedOk" type="checkbox" class="switch is-rounded is-info" bind:checked={isUsedOk}>
                <label for="isUsedOk"></label>
            </div>
            <div class="d-inlineblock" style="position: relative; top: 5px">
                <label for class="label">تایید کامنت</label> 
            </div>
        </div>
 
    </div>
    <div class="field mt-3">
        <label for class="label">انتخاب نوع سوال</label>
        <div class="box columns mt-3 mb-5 is-multiline is-tablet back-eee">
            {#each types as type}
                <div class="column">
                    <div class="">
                        <label class="checkbox">
                            <input type="radio" name="typeId" checked={typeId == type.id}  value={type.id} on:click={e => changeTypeId(e)}>
                            {type.title}
                        </label>
                    </div>
                </div>
            {/each}                      
            <p class="help is-danger">{checkErrors("typeId").message}</p>
        </div>

    </div>
    <div class="field is-grouped submit-parent" >
        <button class:is-loading={editLoading} on:click={() => createOrEditQuestion()} class="button is-link is-rounded">{id ? "ویرایش" : "ذخیره"}</button>
    </div>
    {#if id && [1,2,4].includes(typeId)  }
        <div transition:fly|local class="field is-grouped submit-parent">
            <button 
                class:is-loading={addAnswerLoading} 
                on:click={() => showAnswerForm()} 
                class={`button ${showCreateAnswerFormFlag ? "is-danger" : "is-success"} is-rounded`}
                >
                {showCreateAnswerFormFlag ? "بستن فرم گزینه" : "افزودن گزینه"}
            </button>
           
        </div>
    {/if}
    {#if answers.length > 0 }
        <div transition:slide|local={{duration : 500}}>
            <AnswerTable bind:answers={answers} on:editAnswer={ (e) => { showEditAnswerForm(e) }} /> 
        </div>
    {/if}
    {#if id && [1,2,4].includes(typeId) && (showCreateAnswerFormFlag || showEditAnswerFormFlag)}
        <div transition:slide|local={{duration : 500}}>
            <Answer 
                questionId={id}
                bind:id={answer.id}
                bind:title={answer.title} 
                bind:flag={answer.flag}
                bind:status={answer.status}
                bind:link={answer.link}
                bind:image={answer.image}
                bind:percent={answer.percent}
                on:submit={ (e) => onShowAnswerTable(e)} 
            /> 
        </div>
    {/if}
    {#if questions.length >= 2 && id}
        <div transition:fly|local class="field is-grouped submit-parent" style="margin-top : 3%">
            <button 
                class:is-loading={addConditionLoading} 
                on:click={() => showConditionForm()} 
                class={`button ${showCreateConditionFormFlag ? "is-danger" : "is-success"} is-rounded`}
            >
                {showCreateConditionFormFlag ? "بستن فرم شرط" : "افزودن شرط"}
            </button>
        </div>
    {/if}
    {#if conditions.length > 0 }
        <div transition:slide|local={{duration : 500}}>
            <ConditionTable bind:conditions={conditions} on:editCondition={ (e) => showEditConditionForm(e)} /> 
        </div>
    {/if}
    {#if showCreateConditionFormFlag || showEditConditionFormFlag }
        <div transition:slide|local={{duration : 500}}>
            <Condition 
                consQuestionId={id} 
                bind:id={condition.id}
                bind:questionId={condition.questionId}
                bind:answerId={condition.answerId}
                bind:criteriaId={condition.criteriaId}
                bind:status={condition.status}
                bind:questions={questions} 
                bind:criterias={criterias}
                on:submit={ (e) => onShowConditionTable(e)} 
            /> 
        </div>
    {/if}
</div>