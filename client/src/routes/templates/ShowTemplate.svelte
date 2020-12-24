<script>
   import { push, replace , querystring } from 'svelte-spa-router';
   import {  notLoading , changeTabs , actveOrDeactiveFn , updateArrayFn} from '../../utilis/functions';
   import {  activeOrDeaciveTemplateFn, getTemplatesFn} from '../../Api/templateApi';
   import { userPermissions , loading } from '../../stores';
   import Paginate from '../../components/Paginate.svelte';
   import Toast from '../../components/Toast.svelte';
   import NoData from '../../components/NoData.svelte';
   import Input from '../../components/Input.svelte';
   import { onMount } from 'svelte';
   import qs from 'qs';
   export let templates = [];
   export let currentPage = 1;
   export let limit = 10;
   export let last_page;
   export let total;
   export let title;
   export let tempNumber;
   export let isDynamicLink;
   export let link;
   export let status = false;
   export let isLoading = false;
   $: number = (currentPage - 1) * limit;
   onMount( async () => {
      $loading = true;
      const data = qs.parse($querystring)
      currentPage = Number(data.page)
      title = data.title;
      tempNumber = Number(data.tempNumber);
      isDynamicLink = Boolean(data.isDynamicLink);
      link = data.link;
      status = Boolean(data.status);
      setTemplates()
      notLoading()
   });
   const setTemplates = async () => {
      const input = {
         status, 
         title , 
         tempNumber, 
         link,
         isDynamicLink
      }
      const data = await getTemplatesFn(input ,currentPage , limit);
      if(data.status){
         const res  = data.docs
         templates = res.templates
         currentPage = res.page
         last_page = res.pages
         total = res.total
      }else{
         replace('/server-error')
      }
   }

   async function changePage(page){
      const data = `show?page=${page ? page : 1}${title ? "&title="+title : ""}${tempNumber ? "&tempNumber="+tempNumber : ""}${link ? "&link="+link : ""}${status ? "&status="+status : ""}${isDynamicLink ? "&isDynamicLink="+isDynamicLink : ""}`;
      push("/templates/show-template/" + data) ;
      if(page) {currentPage = page}else{isLoading = true};
      setTemplates();
      setTimeout(() => {
         isLoading = false
         changeTabs(0)
      },500)
   };
   const editPage = async (templateId) => {
      push('/templates/update-template/' + templateId)
   }
   const activeOrdeactiveHandler = async(templateId) => {
      let template = await templates.filter(p => p.id === templateId)[0]
      template.status = !template.status
      const data = await activeOrDeaciveTemplateFn(templateId , template.status);
      if (data.status === true) {
         templates = await updateArrayFn(templates, template)
         actveOrDeactiveFn(data.status,template.status,"قالب");
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
	<title>قالب ها</title>
</svelte:head>
<Toast />
<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-tempNumber main-container">
   {#if $loading}
      <progress class="progress is-small is-primary" max="100">15%</progress>
   {:else}
      <div class="p-2">
         <div class="columns is-variable is-desktop">
            <div class="column">
               <h1 class="title">مدیریت قالب ها</h1>
            </div>
            <div class="column navbar-end">
               <div class="buttons">
                  {#if $userPermissions.includes("show-parameter")}
                     <a href="#/parameters/show-parameter" class="button is-info is-rounded">بخش پارامتر قالب</a>
                  {/if}
                  {#if $userPermissions.includes("create-template")}
                     <a href="#/templates/create-template" class="button is-link is-rounded">افزودن قالب</a>
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
               {#if templates.length}
                  <div class="box back-eee">
                     <div class="table-container">
                        <table class="table is-bordered is-striped is-hoverable is-fullwidth table-container">
                           <thead>
                              <tr>
                                 <th style="width: 5%;">ردیف</th>
                                 <th style="width: 10%;" data-key="id">شناسه</th>
                                 <th style="width: 35%;" data-key="title">نام قالب</th>
                                 <th style="width: 15%;" data-key="tempNumber">کد سامانه پیامکی</th>
                                 <th style="width: 15%;" data-key="link">لینک</th>
                                 <th style="width: 10%;" data-key="isDynamicLink">لینک داینامیک</th>
                                 <th style="width: 10%;">وضعیت</th>
                                 <th style="width: 10%;">ویرایش</th>
                              </tr>
                           </thead>
                           <tbody>
                              {#each templates as template , index}
                                 <tr>
                                    <td style="width: 5%;">{index + number + 1}</td>
                                    <td style="width: 10%;">{template.id}</td>
                                    <td style="width: 25%;">{template.title}</td>
                                    <td style="width: 15%;">{template.tempNumber}</td>
                                    <td style="width: 15%;">{template.link}</td>
                                    <td style="width: 10%;">{template.isDynamicLink == true ? "بله" : "خیر"}</td>
                                    <td style="width: 10%;">
                                       {#if $userPermissions.includes("status-template")}
                                          <button on:click={activeOrdeactiveHandler(template.id)} 
                                             class:is-success={template.status} 
                                             class:is-danger={!template.status} 
                                             class="button is-small ${ template.status ? 'is-success' : 'is-danger'}" >
                                                <i class:fa-eye={template.status} class:fa-eye-slash={!template.status} class="fa"></i>
                                          </button>
                                       {/if}
                                    </td>
                                    <td style="width: 10%;">
                                       {#if $userPermissions.includes("update-template")}
                                          <button on:click={editPage(template.id)} class="button is-small has-background-info-dark has-text-warning-light">
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
               {:else}
                  <NoData />
               {/if} 
            </div> 
            <div value=1>
               <div style="margin: auto;" class="back-eee box column p-3 is-6-desktop is-offset-6-desktop is-9-tablet is-offset-3-tablet is-12-mobile">
                  <Input label="نام " type="text" placeholder="نام قالب؟" bind:title={title} icon="fa-heading" />
                  <Input label="کد سامانه پیامکی " type="number" placeholder="کد سامانه پیامکی قالب؟" bind:title={tempNumber} icon="fa-key" />
                  <Input label="لینک " type="text" placeholder="لینک؟" bind:title={link} icon="fa-tags" />
                  <div style="display: block;" class="field">
                     <div class="d-inlineblock"> 
                        <div class="d-inlineblock status" >
                              <input id="status" type="checkbox" class="switch is-rounded is-info" bind:checked={status}>
                              <label for="status" class="label">وضعیت</label> 
                        </div>
                     </div>
                     <div style="display: block;"> 
                           <div class="d-inlineblock status" >
                              <input style="z-index: 2;width:100%" id="isDynamicLink" type="checkbox" class="switch is-rounded is-info" bind:checked={isDynamicLink}>
                              <label for class="label">ارسال توکن همراه لینک پیامک</label> 
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
