<script>
    import {question ,smsId , showBackButton} from '../../stores';
    import {createCommentFn} from '../../Api/commentApi'
    import { createEventDispatcher } from 'svelte';
    export let selectedItem;
    export let items = $question.answers;
    $: document.documentElement.style.setProperty('--nb-item', items.length);
    const dispatch = createEventDispatcher();

    const getNextQuestion = async () => {

        if(selectedItem === undefined && $question.shouldBe){
            window.pushToast(`پاسخگویی به این سوال الزامی است`, "red")
        }else{
            const response = await createCommentFn({smsId : $smsId , questionId : $question.id, answerIds :[selectedItem.id]});
            if(response.status){
                dispatch('next');  
            }
        }
    }
    const getPreviousQuestion = () => {
        dispatch('previous');  
    }
    const spinHandler = () => {
        if(!selectedItem){
            let rotate = []
            items.forEach(item => {
                if(item.percent > 0){
                    rotate.push(items.indexOf(item))
                }
            });
            let num =  rotate[Math.floor(Math.random() * rotate.length)];
            let itemHeight = 360 / items.length;
            let deg = Math.floor(num - num * itemHeight - (itemHeight / 8)); 
            document.getElementById('box').style.transform = `rotate(${deg}deg)`;
            let element = document.getElementById('mainbox');
            element.classList.remove('animate');
            setTimeout(() => {
                element.classList.add('animate');
                selectedItem = items[num]
            }, 5100)
        }else{
            window.pushToast(`شانستو امتحان کردی دوست عزیز`, "black")
        }
    }
</script>
<style>

    p {
        margin-bottom: 5%;
        font-weight: bold;
    }
	.right-button {
        float: right;
    }
	.left-button {
        float: left;
    }
    .buttons-div {
        margin-top: 5%;
    } 
    b {
        color: red;
    }
    @media only screen and (max-width: 767px) {
        :root {
            --wheel-size: 250px !important;
        }
        .wheel-item b {
            width: 100%;
            display: block;
            text-align: right;
            font-size: 0.5rem !important;
            padding: 3%;
        }
    }
    :root {
        --wheel-size: 400px;
        --wheel-slice-spacing: 15px;
        --wheel-border-size: 1px;
        --wheel-color: #da3768;
        --neutral-color: #eee;
        --PI: 3.14159265358979;
        --nb-item: 0;
        --item-nb: 0;
        --selected-item: 0;
        --nb-turn: 20;
        --spinning-duration: 4s;
        --reset-duration: 1s;
        }

        /* Conteneur de la roue = cercle rose extérieur */
    .wheel-container {
        display: block;
        position: relative;
        box-sizing: content-box;
        width: calc(var(--wheel-size) + 2 * var(--wheel-border-size));
        height: calc(var(--wheel-size) + 2 * var(--wheel-border-size));
        padding: 3px;
        margin: auto;
        background-color: var(--neutral-color);
        border: solid var(--wheel-color) 3px;
        border-radius: 50%;
        user-select: none;
        font-size: 0.5rem !important;
    }
    .wheel-container::before {
        content: '';
        display: block;
        position: absolute;
        background: url('/images/arrow-back.png') no-repeat;
        height: 24px;
        width: 24px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2;
        border-left-width: 0;
    }
    .wheel-container::before {
        right: -20px;
        border-right-color: var(--wheel-color);
    }
        /* Roue */
    .wheel {
        display: block;
        position: relative;
        box-sizing: content-box;
        margin: auto;
        width: var(--wheel-size);
        height: var(--wheel-size);
        overflow: hidden;
        border-radius: 50%;
        border: solid var(--wheel-color) var(--wheel-border-size);
        background-color: var(--wheel-color);
        transform: rotate(calc(var(--nb-turn) * 360deg + (-360deg * var(--selected-item) / var(--nb-item, 1))));
        cursor: pointer;
        transition: all ease 5s;
    }
    .wheel.spinning {
        transition: transform var(--spinning-duration);
        transform: rotate(calc(var(--nb-turn) * 360deg + (-360deg * var(--selected-item) / var(--nb-item, 1))));
    }

        /* Centre de la roue = rond blanc au centre */
    .wheel::after {
        display: block;
        position: absolute;
        content: '';
        background-color: var(--neutral-color);
        width: 25px;
        height: 25px;
        z-index: 2;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
    }


        /* Element sur la roue */
    .wheel-item {
        display: block;
        position: absolute;
        box-sizing: border-box;

        /* position de l'item */
        top: 50%;
        left: 50%;
        width: 50%;
        transform-origin: center left;
        transform: translateY(-50%) rotate(calc(var(--item-nb) * (360deg / var(--nb-item))));

        /* texte */
        color: var(--neutral-color);
        text-align: right;
        padding: 0 2px 0 0;
    }
    .wheel-item b {
        width: 100%;
        display: block;
        text-align: right;
        font-size: 0.7rem ;
        padding: 3%;
    }

        /* Background de l'élément = triangle rose plus clair */
    .wheel-item:before {
        content: ' ';
        display: block;
        position: absolute;
        box-sizing: border-box;
        z-index: -1;
        width: 0;
        height: 0;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding-left: 0px;
        opacity: 0.25;

        --slice-max-width: calc(var(--PI) * var(--wheel-size) + var(--wheel-size));
        --slice-width: calc((var(--slice-max-width) / var(--nb-item)) - var(--wheel-slice-spacing));
        border: solid transparent calc(var(--slice-width) / 2);
        border-left: solid transparent 0;
        border-right: solid var(--neutral-color) calc(var(--wheel-size) / 2);
    }
    .spin {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50% , -50%);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 4px solid #fff;
        background-color: #ff5722;
        color: #fff;
        box-shadow: 0 5px 20px #000;
        font-weight: bold;
        font-size: 22px;
        cursor: pointer;
    }
    .spin:active {
        width: 45px;
        height: 45px;
        font-size: 20px;
    }
    .mainbox.animate:after {
        animation: animateArrow 0.7s ease infinite;
    }
    @keyframes animateArrow {
        50% {
            right: -40px;
        }
    }
    .wheel-item b {
        width: 100%;
        color: #fff;
    }
    .wheel-result-title {
        height: 20px;
        margin: 5% 0;
        width: 100%;
        display: block;
        text-align: center;
    }
</style>

<div class="question">
    <p>
        {@html $question.title} <b>{$question.shouldBe ? "*" : ""}</b>
    </p>
    <div id="mainbox" class="wheel-container mainbox">
        <div id="box" class:spinning={selectedItem} class={`wheel`} onClick={this.selectItem}>
            {#each items as item ,index}
                <div style={`--item-nb : ${index};`} class="wheel-item" key={index}>
                    <b>{item.title}</b>
                </div>
            {/each}
        </div>
        <button class="spin" on:click={spinHandler}><i class="fas fa-hand-pointer"></i></button>
    </div>
    <p class="wheel-result-title">
        {selectedItem ? `تبریک شما برنده ${selectedItem.title} شدید.` : ""}
    </p>
	<div class="buttons-div">
		<button on:click={getNextQuestion} class="button is-success left-button">بعدی »</button>
        {#if $showBackButton}
            <button on:click={getPreviousQuestion} class="button is-danger right-button">« بازگشت</button>
        {/if}
    </div>
</div>