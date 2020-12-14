<script>
    import { onMount } from "svelte";
    import { showMenu , permissions } from "../stores";
    $: document.documentElement.style.setProperty('--height', y + 'px')
    $: y = 0;
    $: marginTop = 0;
    $: document.documentElement.style.setProperty('--marginTop', marginTop + 'px')
    const setContext = () => {
        marginTop = document.getElementsByClassName("navbar")[0].offsetHeight;
        y = (document.documentElement.clientHeight - marginTop);
    }
    onMount( () => {
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
        height: var(--height);
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

                    <li><a href="#/dashboard"> <i class="fas fa-tachometer-alt icon"></i> داشبورد</a></li>
                    {#if $permissions.includes("show-role")}
                        <li><a href="#/roles/show-role"> <i class="fa fa-tasks icon" aria-hidden="true"></i> نقش و دسترسی ها</a></li>
                    {/if}
                    {#if $permissions.includes("show-user")}
                        <li><a href="#/users/show-user"> <i class="fa fa-user icon" aria-hidden="true"></i>کاربران</a></li>
                    {/if}
                    {#if $permissions.includes("show-user")}
                        <li><a href="#/data/show-data"> <i class="fas fa-database icon" aria-hidden="true"></i>اطلاعات مشتری</a></li>
                    {/if}
                    {#if $permissions.includes("show-report")}
                        <li><a href="#/reports/show-report"> <i class="fa fa-file icon" aria-hidden="true"></i>گزارشات</a></li>
                    {/if}  
                    {#if $permissions.includes("show-survey")}
                        <li><a href="#/surveys/show-survey"> <i class="fas fa-poll icon" ></i> نظرسنجی ها</a></li>
                    {/if} 
                    {#if $permissions.includes("show-question")}
                        <li><a href="#/questions/show-question"> <i class="fas fa-question icon"></i>سوالات</a></li>
                    {/if} 
                    {#if $permissions.includes("show-answer")}
                        <li><a href="#/answers/show-answer"> <i class="fas fa-reply icon"></i>گزینه ها</a></li>
                    {/if} 
                </ul>
            </aside>
        </div>
    </div>
</div>