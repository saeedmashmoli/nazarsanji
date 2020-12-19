import { rowNumber } from '../stores';
export const dataTableSettings = {
    sortable: true,
    pagination: true,
    rowPerPage: 10,
    columnFilter: true,
    scrollY: false,
    css: true,
    blocks: {
        searchInput: false
    },
    labels: {
        search: 'جستجو', // search input placeholer
        filter: 'جستجو', // filter inputs placeholder
        noRows: 'اطلاعاتی یافت نشد',
        info: 'نمایش {start} از {end} تعداد کل {rows} ',
        previous: 'قبلی',
        next: 'بعدی',
    }
}