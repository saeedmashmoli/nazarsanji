import { writable, readable, derived } from 'svelte/store';

export let user = writable({})
export let permissions = writable([])
export let showMenu = writable(false)