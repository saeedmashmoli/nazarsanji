<script>
    import { onMount } from "svelte";
    import { location } from "svelte-spa-router";
    import { showMenu , userPermissions  } from "../stores";
    $: document.documentElement.style.setProperty('--sidebarHeight', y + 'px')
    $: y = 0;
    $: marginTop = 0;
    $: document.documentElement.style.setProperty('--marginTop', marginTop + 'px');
    $: checkRoute = (checkPaths) => {
        const baseUrl = $location.split("?")[0]
        if(checkPaths.includes(baseUrl)){
            return true
        }
        return false
    }
    const setContext = () => {
        marginTop = document.getElementsByClassName("navbar")[0].offsetHeight;
        y = (document.documentElement.clientHeight - marginTop);
    }
    onMount(() => {
        setContext();
    })
</script>
<style>

    .active {
        transform: translateX(0%) !important;
    }
    .menu-list li a {
        color: rgb(221, 216, 216);
    }
    .menu-list li a:hover {
        background: rgb(109, 112, 102);
    }
    .menu-container {
        overflow-y: auto;
        height: var(--sidebarHeight);
    }
    :global(.main-container) {
        margin-top: var(--marginTop) !important;
    }
</style>
<!-- <svelte:window bind:scrollY={setHeight()}/> -->
<svelte:window on:resize={setContext} />
<div class="column is-2-desktop is-3-tablet is-0-mobile">
    <div class="menu-container px-1 has-background-dark is-white" class:active={$showMenu} >
        <div class="menu-wrapper py-1">
            <aside class="menu">
                <ul class="menu-list">
                    <li><a 
                        class:is-active={checkRoute(["/dashboard"])}
                        href="#/dashboard"
                        > <i class="fas fa-tachometer-alt icon"></i> داشبورد
                        </a>
                    </li>
                    {#if $userPermissions.includes("show-report")}
                        <li><a 
                            class:is-active={checkRoute(["/reports/show-report/"])} 
                            href="#/reports/show-report/"> <i class="fa fa-file icon" aria-hidden="true"></i>گزارشات
                            </a>
                        </li>
                    {/if}  
                    {#if $userPermissions.includes("show-log")}
                        <li><a 
                            class:is-active={checkRoute(["/logs/show-sms/"])}
                            href="#/logs/show-log/"> <i class="fas fa-history icon" ></i> لاگ ها
                            </a>
                        </li>
                    {/if} 
                    {#if $userPermissions.includes("show-role")}
                        <li><a 
                            class:is-active={checkRoute([
                                "/roles/show-role/","/roles/create-role","/roles/update-role",
                                "/permissions/show-permission/","/permissions/create-permission","/permissions/update-permission",
                                ])}
                            href="#/roles/show-role/"
                            > <i class="fa fa-tasks icon" aria-hidden="true"></i> نقش و دسترسی ها
                            </a>
                        </li>
                    {/if}
                    {#if $userPermissions.includes("show-user")}
                        <li class="is-active"><a 
                            class:is-active={checkRoute(["/users/show-user/","/users/create-user","/users/update-user"])}
                            href="#/users/show-user/"> <i class="fa fa-user icon" aria-hidden="true"></i>کاربران
                            </a>
                        </li>
                    {/if}
                    {#if $userPermissions.includes("show-survey")}
                        <li><a 
                            class:is-active={checkRoute(["/surveys/show-survey/","/surveys/create-survey","/surveys/update-survey"])}
                            href="#/surveys/show-survey/"> <i class="fas fa-poll icon" ></i> نظرسنجی ها
                            </a>
                        </li>
                    {/if} 
                    {#if $userPermissions.includes("show-question")}
                        <li><a 
                            class:is-active={checkRoute(["/questions/show-question/","/questions/create-question","/questions/update-question"])}
                            href="#/questions/show-question/"> <i class="fas fa-question icon"></i>سوالات
                            </a>
                        </li>
                    {/if} 
                    {#if $userPermissions.includes("show-answer")}
                        <li><a 
                            class:is-active={checkRoute(["/answers/show-answer/","/answers/create-answer","/answers/update-answer"])}
                            href="#/answers/show-answer/"> <i class="fas fa-reply icon"></i>گزینه ها
                            </a>
                        </li>
                    {/if} 
                    {#if $userPermissions.includes("show-condition")}
                        <li><a 
                            class:is-active={checkRoute(["/conditions/show-condition/","/conditions/create-condition","/conditions/update-condition"])}
                            href="#/conditions/show-condition/"> <i class="fas fa-disease icon"></i>شروط نمایش سوالات
                            </a>
                        </li>
                    {/if} 
                    {#if $userPermissions.includes("show-call")}
                        <li>
                            <a 
                            class:is-active={checkRoute(["/calls/show-call/","/calls/create-call","/calls/update-call"])} 
                            href="#/calls/show-call/"
                            > <i class="fas fa-database icon" aria-hidden="true"></i>تماس ها
                            </a>
                        </li>
                    {/if}
                    {#if $userPermissions.includes("show-customer")}
                        <li>
                            <a 
                            class:is-active={checkRoute(["/customers/show-customer/","/customers/create-customer","/customers/update-customer"])} 
                            href="#/customers/show-customer/"
                            > <i class="fas fa-users icon" aria-hidden="true"></i>مدیریت مشتری ها
                            </a>
                        </li>
                    {/if}
                    {#if $userPermissions.includes("show-package")}
                        <li>
                            <a 
                            class:is-active={checkRoute(["/packages/show-package/","/packages/create-package","/packages/update-package"])} 
                            href="#/packages/show-package/"
                            > <i class="fas fa-university icon" aria-hidden="true"></i>بسته تماس ها
                            </a>
                        </li>
                    {/if}

                    {#if $userPermissions.includes("show-parameter")}
                        <li><a 
                            class:is-active={checkRoute(["/parameters/show-parameter/","/parameters/create-parameter","/parameters/update-parameter"])}
                            href="#/parameters/show-parameter/"> <i class="fas fa-cog icon" ></i> پارامتر ها
                            </a>
                        </li>
                    {/if} 
                    {#if $userPermissions.includes("show-template")}
                        <li><a 
                            class:is-active={checkRoute(["/templates/show-template/","/templates/create-template","/templates/update-template"])}
                            href="#/templates/show-template/"> <i class="fas fa-columns icon" ></i> قالب ها
                            </a>
                        </li>
                    {/if} 
                    {#if $userPermissions.includes("show-sms")}
                        <li><a 
                            class:is-active={checkRoute(["/sms/show-sms/","/sms/create-sms","/sms/update-sms"])}
                            href="#/sms/show-sms/"> <i class="fas fa-sms icon" ></i> پیامک ها
                            </a>
                        </li>
                    {/if} 
                </ul>
            </aside>
        </div>
    </div>
</div>