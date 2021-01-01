<script>
    import {getJalaliDate} from '../../utilis/functions'
    export let log;
</script>
<style>
    .main-log {
        text-align: right;
        background: #d4f1f6;
    }
    .log-text {
        width: 90%;
        word-wrap: break-word;
    }
</style>
<div class="main-log box">
    <p class="log-text">
        نام کاربر: {log.user.name}
    </p>
    <p class="log-text">
        موبایل: {log.user.mobile}
    </p>
    <p class="log-text">
        تاریخ: {getJalaliDate(log.createdAt)}
    </p>
    <p class="log-text">
        عملیات مربوط به بخش: {log.model.label}
    </p>
    <p class="log-text">
        نوع عملیات: {log.operation}
    </p>
    <p class="log-text">
        شناسه: {log.rowId}
    </p>
    <p class="log-text">
        ردیف آپدیت شده: {log.data}
    </p>
</div>
