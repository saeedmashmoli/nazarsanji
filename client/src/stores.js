import { writable, readable, derived } from 'svelte/store';

export let user = writable({});
export let userPermissions = writable([]);
export let showMenu = writable(false);
export let showBackButton = writable(true);
export let currentRoute = writable(null);
export let loading = writable(true);
export let rowNumber = writable(10);
export let questions = writable([]);
export let comments = writable([]);
export let conditions = writable([]);
export let question = writable(null);
export let smsId = writable(null);
export let answers = writable([]);
export let selectAnswers = writable([]);