<script>
    import client from '../svelte-apollo';
    import { userPermissions, showMenu , user } from '../stores';
    import { push } from 'svelte-spa-router';
    import { LogoutQuery } from '../graphql/user';
    $:showNavMenu = false;
    const changeShowMenu = () => {
        $showMenu = !$showMenu
    }
    const changeShowNavMenu = () => {
        showNavMenu = !showNavMenu
    }
    const logoutHanldler = () => {
        client.query({ 
            query : LogoutQuery , 
        }).then(result => {
            if(result.data.logout === true){
                $user = {}
                $userPermissions = []
                push('/')
            }
          }
        )
    }
</script>
<style>
    .is-active {
        background: rgb(148, 228, 208) !important;
    }
    nav {
        direction: rtl;
    }
    .icon {
        width: 30px;
        height: 30px;
        vertical-align: baseline;
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }
    .navbar-start , .navbar-burger , .navbar-end{
        margin: 0;
    }
    .navbar-end{
        margin-right: auto;
    }
    .box-shadow-y{
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
    }
    .navbar-burger {
        border: none;
        background: white;
    }
</style>
<nav class="navbar is-fixed-top box-shadow-y">
    <div class="navbar-brand">
        <button type="button" class="navbar-burger toggler" on:click={changeShowMenu}>
            <span></span>
            <span></span>
            <span></span>
        </button>
        <a href="/" class="navbar-item has-text-weight-bold has-text-black">
            <img src="images/logo.jpeg" alt="logo" width="35" height="35">
        </a>
        <button href="/" class="navbar-burger nav-toggler navbar-end" on:click={changeShowNavMenu}>
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
    <div class="navbar-menu has-background-white" class:is-active={showNavMenu}>
        <div class="navbar-start">
            <a href="#/" class="navbar-item">
                <i class="fas fa-home icon ml-2"></i> صفحه اصلی
            </a>
            <!-- <a href="#/" class="navbar-item">درباره ما</a> -->
        </div>
        <div class="navbar-end">
            <!-- <a href="/" class="navbar-item">اعلانات</a> -->
            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">{$user.name ? $user.name : $user.mobile}</a>
                <div class="navbar-dropdown">
                    <a href="/#/profile" class="navbar-item">پروفایل</a>
                    <!-- <a href="/" class="navbar-item">تنظیمات</a> -->
                    <hr class="navbar-divider" />
                    <a class="navbar-item" on:click={logoutHanldler}>خروج</a>
                </div>
            </div>
        </div>
    </div>
</nav>