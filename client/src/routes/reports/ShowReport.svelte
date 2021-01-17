<script>
   import FusionCharts from 'fusioncharts';
   import Charts from 'fusioncharts/fusioncharts.charts';
   import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
   import SvelteFC,{ fcRoot } from 'svelte-fusioncharts';
   import {  
      notLoading,   
      flatpickrOptions,
      flatpickrTimeOptions
   } from '../../utilis/functions';
   import moment from 'moment-jalaali';
   import { onMount } from 'svelte';
   import { loading } from '../../stores';
   import {getDataForCommentReportFn , getSurveysForReportsFn} from '../../Api/reportApi';
   import Flatpickr from 'svelte-flatpickr';
   import 'flatpickr/dist/flatpickr.css';
   import 'flatpickr/dist/themes/light.css';
   export let beginDate = moment(new Date()).format('jYYYY-jM-jD');
   export let beginTime = "00:00";
   export let endDate = moment(new Date()).format('jYYYY-jM-jD');
   export let endTime = "23:59";
   export let surveyId;
   export let questionId;
   export let chartType ="pie3d";
   export let surveys = [];
   export let questions = [];
   export let data = [];
   export let dataSource;   
   fcRoot(FusionCharts, Charts ,FusionTheme);
   onMount(async() => {
      $loading = true;
      surveys = await getSurveysForReportsFn();
      surveyId = surveys[surveys.length - 1].id;
      questions = surveys[surveys.length - 1].questions.filter(q => (q.typeId === 1 || q.typeId === 2 || q.typeId === 4));
      questionId = questions[questions.length - 1].id;
      getReport()
   })
   const getReport = async () => {
      const result = await getDataForCommentReportFn({
         questionId, 
         surveyId, 
         beginDate, 
         endDate, 
         beginTime,
         endTime
      });
      if(!result.data.length){
         data = [];
      }else {
         data = [];
         result.data.forEach( res => {
            data.push({label : res.label , value : res.value})
         });
      }
      dataSource = {
         "chart": {
            baseFont: "Vazir",
            "caption": "گزارش کامنت ها",
            "subCaption": "تا تاریخ: " + endDate +"  ساعت: "+endTime+"<br>" + "از تاریخ: " + beginDate +"  ساعت: "+beginTime ,
            "showValues": "1",
            "showPercentInTooltip": "0",
            "enableMultiSlicing": "1",
            "theme": "fusion"
         },
         data
      };
      notLoading();
   }
   const changeQuestions = () => {
      questions = surveys.filter(s => s.id === surveyId)[0].questions.filter(q => (q.typeId === 1 || q.typeId === 2 || q.typeId === 4));
      getReport()
   }
   const changeChartType = () => { 
      getReport()
   }

</script>
<style>
   .select {
       width: 100%;
   }
</style>
<svelte:head>
	<title>گزارشات</title>
</svelte:head>
<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
   {#if $loading}
      <progress class="progress is-small is-primary" max="100">15%</progress>
   {:else}
      <div class="p-2">
         <div class="columns is-variable is-desktop">
            <div class="column">
               <h1 class="title">گزارشات</h1>
            </div>
         </div> 
         <div class="columns is-variable is-desktop">
            <div class="column back-eee">
               <div style="display:inline-block;width:49%" class="field">
                  <label for="survey" class="label">نظرسنجی</label>
                  <div class="control has-icons-left">
                      <div class="select">
                          <!-- svelte-ignore a11y-no-onchange -->
                          <select style="width:100%" bind:value={surveyId} on:change={changeQuestions}>
                              {#each surveys as survey}
                                 <option value={survey.id} selected={surveyId === survey.id}>{survey.title}</option>
                              {/each}
                          </select>
                      </div>
                      <div class="icon is-small is-left">
                          <i class="fas fa-poll"></i>
                      </div>
                  </div>
               </div>
               <div style="display:inline-block;width:49%" class="field">
                  <label for="survey" class="label">نوع نمودار</label>
                  <div class="control has-icons-left">
                      <div class="select">
                          <!-- svelte-ignore a11y-no-onchange -->
                          <select style="width:100%" bind:value={chartType} on:change={changeChartType}>
                              <option value="">نوع نمودار را انتخاب کنید</option>
                              <option value="pie3d">دایره ای</option>
                              <option value="column3d">مستطیلی</option>
                          </select>
                      </div>
                      <div class="icon is-small is-left">
                          <i class="fas fa-poll"></i>
                      </div>
                  </div>
               </div>
               <div class="field">
                  <label for="survey" class="label">سوال</label>
                  <div class="control has-icons-left">
                     <div class="select">
                       <!-- svelte-ignore a11y-no-onchange -->
                        <select style="width:100%" bind:value={questionId} on:change={getReport}>
                           {#each questions as question}
                               <option value={question.id} selected={questionId === question.id}>{question.title}</option>
                           {/each}
                        </select>
                     </div>
                     <div class="icon is-small is-left">
                       <i class="fas fa-question"></i>
                     </div>
                  </div>
               </div>
               <div class="field">
                  <Flatpickr options="{ flatpickrOptions }" element="#beginDate">
                        <div style="display:inline-block;width:49%" class="control flatpickr my-picker" id="beginDate">
                           <label for class="label">از تاریخ</label>
                           <input autocomplete="off" class="input" bind:value={beginDate} on:input={getReport} type="text" placeholder="از تاریخ..." data-input>
                        </div>
                  </Flatpickr>
                  <Flatpickr options="{ flatpickrTimeOptions }" element="#beginTime">
                        <div style="display:inline-block;width:49%" class="control flatpickr my-picker" id="beginTime">
                           <label for class="label">از ساعت</label>
                           <input autocomplete="off" class="input" type="text" bind:value={beginTime} on:input={getReport} placeholder="از ساعت..." data-input>
                        </div>
                  </Flatpickr>
               </div>
               <div class="field">
                  <Flatpickr options="{ flatpickrOptions }" element="#endDate">
                        <div style="display:inline-block;width:49%" class="control flatpickr my-picker" id="endDate">
                           <label for class="label">تا تاریخ</label>
                           <input autocomplete="off" class="input" bind:value={endDate} on:input={getReport} type="text" placeholder="تا تاریخ..." data-input>
                        </div>
                  </Flatpickr>
                  <Flatpickr options="{ flatpickrTimeOptions }" element="#endTime">
                        <div style="display:inline-block;width:49%" class="control flatpickr my-picker" id="endTime">
                           <label for class="label">تا ساعت</label>
                           <input autocomplete="off" class="input" type="text" bind:value={endTime} on:input={getReport} placeholder="تا ساعت..." data-input>
                        </div>
                  </Flatpickr>
               </div>
            </div>
            <div class="column back-eee">
               {#if dataSource}
                  <SvelteFC 
                  type={chartType}
                  width='100%'
                  bind:dataSource={dataSource} 
                  />
               {/if}
            </div>
         </div>
      </div>
   {/if}
</div>