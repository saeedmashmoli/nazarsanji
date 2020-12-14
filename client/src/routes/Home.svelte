<script>
   import Nav from '../components/Nav.svelte';
   import SideBar from '../components/SideBar.svelte';
</script>
<style>
   .main-columns {
        direction: rtl; 
    }
</style>
<Nav />
<div class="columns main-columns is-variable is-0">
   <SideBar />
   <div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
      <div class="p-2">
         
      </div>
   </div>
</div>

