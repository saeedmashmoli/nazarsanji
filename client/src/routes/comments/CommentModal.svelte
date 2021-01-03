<script>
    import {getJalaliDate} from '../../utilis/functions'
    export let comment;
</script>
<style>
    .main-comment {
        text-align: right;
        background: #d4f1f6;
    }
    .comment-text {
        width: 90%;
        word-wrap: break-word;
    }
</style>
<div class="main-comment box">
    <p class="comment-text">
        نام مشتری: {comment.sms.call.customer.name}
    </p>
    <p class="comment-text">
        موبایل: {comment.sms.call.customer.mobile}
    </p>
    <p class="comment-text">
        تاریخ: {getJalaliDate(comment.createdAt)}
    </p>
    <p class="comment-text">
        سوال: {comment.question.title}
    </p>
    <p class="comment-text">
        پاسخ: {comment.answerId ? comment.answer.title : ""}
    </p>
    <p class="comment-text">
        متن کامنت: {comment.text ? comment.text : ""}
    </p>
</div>
