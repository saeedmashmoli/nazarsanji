<script>
    import { createOrUpdateAnswerFn} from '../../Api/answerApi';
    import Input from '../../components/Input.svelte';
    import {createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    export let questionId;
    export let id;
    export let title;
    export let link;
    export let image;
    export let percent;
    export let status = true;
    export let flag = false;
    export let isLoading = false;  
    const createOrEditAnswer = async () => {
        console.log(flag)
        isLoading = true;
        const data = await createOrUpdateAnswerFn({title ,status ,link ,questionId ,flag , percent , image} ,id );
        if(data.status == true){
            dispatch('submit', {answer : data.answer , newCreate : id ? false : true});
            if(!id){
                title = undefined;
                image = undefined;
                status = true;
                flag = false;
                percent = undefined;
                link = undefined;
            }
        }
        setTimeout(() => {
            isLoading = false;
        },500)
    }
</script>
<div class="box">
    <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
        <Input label="شرح" type="textarea" placeholder="شرح؟" bind:title={title} icon="fa-heading" />
        <Input label="لینک" type="text" placeholder="لینک گزینه؟" bind:title={link} icon="fa-link" />
        <Input label="درصد" type="number" placeholder="درصد اختصاصی گزینه؟" bind:title={percent} icon="fa-percent" />
        <div class="field">
            <div class="d-inlineblock status" >
                <input id="answer-status" type="checkbox" class="switch is-rounded is-info" bind:checked={status}>
                <label for="answer-status"></label>
            </div>
            <div class="d-inlineblock" style="position: relative; top: 5px">
                <label for class="label">وضعیت</label> 
            </div>
        </div>
        <div class="field">
            <div class="d-inlineblock status" >
                <input id="answer-flag" type="checkbox" class="switch is-rounded is-info" bind:checked={flag}>
                <label for="answer-flag"></label>
            </div>
            <div class="d-inlineblock" style="position: relative; top: 5px">
                <label for class="label">پاسخ نهایی</label> 
            </div>
        </div>
    </div>
    <div class="field is-grouped submit-parent" >
        <button class:is-loading={isLoading} on:click={() => createOrEditAnswer()} class="button is-link is-rounded">{id ? "ویرایش" : "ذخیره"}</button>
    </div>
</div>