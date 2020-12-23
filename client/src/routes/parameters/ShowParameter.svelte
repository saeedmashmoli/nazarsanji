<script>
   import { push, replace , querystring } from 'svelte-spa-router';
   import {  notLoading , changeTabs , actveOrDeactiveFn , updateArrayFn} from '../../utilis/functions';
   import {  activeOrDeaciveParameterFn, getParametersFn} from '../../Api/parameterApi';
   import { userPermissions , loading } from '../../stores';
   import Paginate from '../../components/Paginate.svelte';
   import Toast from '../../components/Toast.svelte';
   import NoData from '../../components/NoData.svelte';
   import Input from '../../components/Input.svelte';
   import { onMount } from 'svelte';
   import qs from 'qs';
   export let parameters = [];
   export let currentPage = 1;
   export let limit = 10;
   export let last_page;
   export let total;
   export let title;
   export let label;
   export let status = false;
   export let isLoading = false;
   $: number = (currentPage - 1) * limit;
   onMount( async () => {
      $loading = true;
      const data = qs.parse($querystring)
      currentPage = parseInt(data.page)
      title = data.title;
      label = data.mobile;
      status = data.status;
      setParameters()
      notLoading()
   });
   const setParameters = async () => {
      const input = {status : false, title , label}
      const data = await getParametersFn(input ,currentPage , limit);
      if(data.status){
         const res  = data.docs
         parameters = res.parameters
         currentPage = res.page
         last_page = res.pages
         total = res.total
      }else{
         replace('/server-error')
      }
   }

   async function changePage(page){
      const data = `show?page=${page ? page : 1}&title=${title ? title : ""}&label=${label ? label : ""}&status=${status ? status : ""}`;
      push("/parameters/show-parameter/" + data) ;
      if(page) {currentPage = page}else{isLoading = true};
      setParameters();
      setTimeout(() => {
         isLoading = false
         changeTabs(0)
      },500)
   };
   const editPage = async (parameterId) => {
      push('/parameters/update-parameter/' + parameterId)
   }
   const activeOrdeactiveHandler = async(parameterId) => {
      let parameter = await parameters.filter(p => p.id === parameterId)[0]
      parameter.status = !parameter.status
      const data = await activeOrDeaciveParameterFn(parameterId , parameter.status);
      if (data.status === true) {
         parameters = await updateArrayFn(parameters, parameter)
         actveOrDeactiveFn(data.status,parameter.status,"پارامتر");
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
	<title>پارامتر ها</title>
</svelte:head>
<Toast />
<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
   {#if $loading}
      <progress class="progress is-small is-primary" max="100">15%</progress>
   {:else}
      <div class="p-2">
         <div class="columns is-variable is-desktop">
            <div class="column">
               <h1 class="title">مدیریت پارامتر ها</h1>
            </div>
            <div class="column navbar-end">
               <div class="buttons">
                  {#if $userPermissions.includes("show-data")}
                     <a href="#/tempaltes/show-tempalte" class="button is-info is-rounded">بخش قالب ها</a>
                  {/if}
                  {#if $userPermissions.includes("create-parameter")}
                     <a href="#/parameters/create-parameter" class="button is-link is-rounded">افزودن پارامتر</a>
                  {/if}
               </div>
            </div>
         </div>
         {#if parameters.length}
               <div class="tabs">
                  <ul>
                     <!-- svelte-ignore a11y-missing-attribute -->
                     <li value=0 on:click={(e) => changeTabs(e.path[0].parentElement.value)} class="is-active"><a>نتایج</a></li>
                     <!-- svelte-ignore a11y-missing-attribute -->
                     <li value=1 on:click={(e) => changeTabs(e.path[0].parentElement.value)}><a>جستجو</a></li>
                  </ul>
               <div class="tab-content">
                  <div value=0>
                     <div class="box back-eee">
                        <div class="table-container">
                           <table class="table is-bordered is-striped is-hoverable is-fullwidth table-container">
                              <thead>
                                 <tr>
                                    <th style="width: 5%;">ردیف</th>
                                    <th style="width: 10%;" data-key="id">شناسه</th>
                                    <th style="width: 25%;" data-key="title">عنوان</th>
                                    <th style="width: 40%;" data-key="label">شرح</th>
                                    <th style="width: 10%;">وضعیت</th>
                                    <th style="width: 10%;">ویرایش</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {#each parameters as parameter , index}
                                    <tr>
                                       <td style="width: 5%;">{index + number + 1}</td>
                                       <td style="width: 10%;">{parameter.id}</td>
                                       <td style="width: 25%;">{parameter.title}</td>
                                       <td style="width: 40%;">{parameter.label}</td>
                                       <td style="width: 10%;">
                                          {#if $userPermissions.includes("status-parameter")}
                                             <button on:click={activeOrdeactiveHandler(parameter.id)} 
                                                class:is-success={parameter.status} 
                                                class:is-danger={!parameter.status} 
                                                class="button is-small ${ parameter.status ? 'is-success' : 'is-danger'}" >
                                                   <i class:fa-eye={parameter.status} class:fa-eye-slash={!parameter.status} class="fa"></i>
                                             </button>
                                          {/if}
                                       </td>
                                       <td style="width: 10%;">
                                          {#if $userPermissions.includes("update-parameter")}
                                             <button on:click={editPage(parameter.id)} class="button is-small has-background-info-dark has-text-warning-light">
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
                  </div>
                  <div value=1>
                     <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                        <Input label="عنوان " type="text" placeholder="عنوان پارامتر؟" bind:title={title} icon="fa-heading" />
                        <Input label="شرح" type="text" placeholder="شرح پارامتر؟" bind:title={label} icon="fa-tags" />
                        <div style="display : block;text-align : left;">
                           <button class:is-loading={isLoading} on:click={() => changePage(null)} class="button is-link">جستجو</button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         {:else}
            <NoData />
         {/if} 
         
      </div>
   {/if}
</div>
