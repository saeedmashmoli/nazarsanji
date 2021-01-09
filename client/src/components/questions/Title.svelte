<script>
    import { onMount } from 'svelte';
    import {call } from '../../stores';
    export let object;
    let title = object.title;
    onMount(async () => {
        if(title.includes("[callTime]")){
            if(object.percent !== 0){
                title = await title.replace("[callTime]",$call.callTime * object.percent / 100);
            }else{
                title = await title.replace("[callTime]",$call.callTime);
            }
        }
        if(title.includes("[name]")){

            title = await title.replace("[name]",$call.customer.name);
        }
        if(title.includes("[mobile]")){
            title = await title.replace("[mobile]",$call.customer.mobile);
        }
        if(title.includes("[phone]")){
            title = await title.replace("[phone]",$call.customer.phone);
        }
        if(title.includes("[issue]")){
            title = await title.replace("[issue]",$call.issue);
        }
        if(title.includes("[minorIssue]")){
            title = await title.replace("[minorIssue]",$call.minorIssue);
        }
        if(title.includes("[exactIssue]")){
            title = await title.replace("[exactIssue]",$call.exactIssue);
        }
        if(title.includes("[callPrice]")){
            title = await title.replace("[callPrice]",$call.callPrice);
        }
    })
</script>

{title}

