
<script>

    import DatePicker from "../components/datepicker/DatePicker.svelte";
    import moment from 'moment-jalaali';
    import fa from "moment/src/locale/fa";
    moment.locale("fa", fa);
    moment.loadPersian();
    let currentDate = new Date();
  
    const onDateChange = d => {
        console.log(new Date());
        console.log(moment(new Date()))
      currentDate = d.detail;
    };
    
</script>
<style>
    .field { 
        width: 20% !important;
    }
</style>
<svelte:head>
	<title>گزارشات</title>
</svelte:head>
<div class="column is-10-desktop is-offset-2-desktop is-9-tablet is-offset-3-tablet is-12-mobile main-container">
    <div class="field">
        <DatePicker
        on:datechange={onDateChange}
        selected={currentDate}
        />
    </div>
</div>

