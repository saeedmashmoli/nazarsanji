import { writable, readable, derived } from 'svelte/store';

export let user = writable({})
export let userPermissions = writable([])
export let showMenu = writable(false)
export let currentRoute = writable(null)
export let loading = writable(true)
export let rowNumber = writable(10)