<script>
    import {  notLoading  } from '../../utilis/functions';
    import { getTypesFn , createOrUpdateQuestionFn  , getQuestionFn } from '../../Api/questionApi';
    import { getSurveysFn } from '../../Api/surveyApi';
    import {loading} from '../../stores';
    import { onMount } from 'svelte';
    import { push , location } from 'svelte-spa-router';
    export let id = parseInt($location.split('/').slice(-1)[0]);
    export let title = "";
    export let typeId ;
    export let surveyId ;
    export let status = true;
    export let shouldBe = true;
    export let surveys = [];
    export let types = [];
    export let errorMessages = [];
    onMount(async () => {
        $loading = true;
        const d = await getSurveysFn(true);
        const t = await getTypesFn();
        const q = await getQuestionFn(id);
        if(q.status && d.status && t.status){
            title = q.question.title;
            status = q.question.status;
            shouldBe = q.question.shouldBe;
            surveyId = q.question.surveyId;
            typeId = q.question.typeId;
            surveys = d.surveys;
            types = t.types
        }else{
            replace('/server-error')
        }
        notLoading()
    })
        
    const updateQuestion = async () => {
        const data = await createOrUpdateQuestionFn({title ,status ,shouldBe ,typeId ,surveyId} , id);
        if(data.status == true){
            push('/questions/show-question')
        }else{
            errorMessages = data.errors
        }
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
    const changeTypeId =  (input) => {
        typeId = parseInt(input.path[0].value)
    }
    const changeSurveyId =  (input) => {
        surveyId = parseInt(input.path[0].value)
    }
</script>
<svelte:head>
	<title>ویرایش سوال</title>
</svelte:head>

<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
    {#if $loading}
        <progress class="progress is-small is-primary" max="100">15%</progress>
    {:else}
        <div class="p-2">
            <div class="columns is-variable is-desktop">
                <div class="column">
                    <h3 class="title text-center is-size-4">ویرایش سوال</h3>
                </div>
            </div>
            <div style="margin: auto;" class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                <div class="box">
                    <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                        <div class="field">
                            <label class="label">عنوان</label>
                            <div class="control has-icons-left has-icons-right">
                                <input class:is-danger={checkErrors("title").status} class="input" type="text" placeholder="عنوان سوال را وارد نمائید" bind:value={title}>
                                <span class="icon is-small is-left">
                                    <i class="fas fa-heading"></i>
                                </span>
                                <span class="icon is-small is-right">
                                    <i class="fas fa-user"></i>
                                </span>
                            </div>

                            <p class="help is-danger">{checkErrors("title").message}</p>
                        </div>
                        <div class="field" style="direction: ltr;">
                            <div class="d-inlineblock"> 
                                <div class="d-inlineblock status" >
                                    <input id="status" type="checkbox" class="switch is-rounded is-info" bind:checked={status}>
                                    <label for="status"></label>
                                </div>
                                <div class="d-inlineblock" style="position: relative; top: 5px">
                                    <label class="label">وضعیت</label> 
                                </div>
                            </div>
                            <div class="d-inlineblock" style="float: right"> 
                                <div class="d-inlineblock status" >
                                <input id="shouldBe" type="checkbox" class="switch is-rounded is-info" bind:checked={shouldBe}>
                                <label for="shouldBe"></label>
                                </div>
                                <div class="d-inlineblock" style="position: relative; top: 5px">
                                    <label class="label">الزام پاسخگویی</label> 
                                </div>
                            </div>
                            
                        </div>

                    </div>
                    <div class="field mt-3">
                        <label class="label">انتخاب نوع سوال</label>
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
                    <div class="field mt-3">
                        <label class="label">انتخاب نظرسنجی</label>
                        <div class="box columns mt-3 mb-5 is-multiline is-tablet back-eee">
                            {#each surveys as survey}
                                <div class="column">
                                    <div class="">
                                        <label class="checkbox">
                                            <input type="radio" name="surveyId" checked={surveyId == survey.id}  value={survey.id} on:click={e => changeSurveyId(e)}>
                                            {survey.title}
                                        </label>
                                    </div>
                                </div>
                               
                            {/each}   
                            <p class="help is-danger">{checkErrors("surveyId").message}</p>                   
                        </div>
                    </div>

                    <div class="field is-grouped submit-parent" >
                            <button on:click={updateQuestion} class="button is-link">اعمال تغییرات</button>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</div>


