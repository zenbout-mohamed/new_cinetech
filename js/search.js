import { searchMulti } from './api.js';


export function initSearch(inputSelector) {
const input = document.querySelector(inputSelector);
const list = input.nextElementSibling;


input.addEventListener('input', async () => {
const query = input.value.trim();
if (query.length < 2) {
list.classList.add('hidden');
return;
}


const data = await searchMulti(query);
list.innerHTML = '';


data.results.slice(0, 8).forEach(item => {
if (!item.media_type || item.media_type === 'person') return;
const li = document.createElement('li');
li.className = 'px-4 py-2 hover:bg-slate-100 cursor-pointer';
li.textContent = item.title || item.name;
li.onclick = () => {
window.location.href = `detail.html?id=${item.id}&type=${item.media_type}`;
};
list.appendChild(li);
});


list.classList.remove('hidden');
});
}