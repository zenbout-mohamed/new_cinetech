import { IMAGE_URL } from './api.js';

export function createCard(item, type) {
const div = document.createElement('div');
div.className = 'bg-slate-800 rounded-lg overflow-hidden cursor-pointer';

const title = item.title || item.name;

div.innerHTML = `
<img src="${IMAGE_URL}${item.poster_path}" alt="${title}" class="w-full h-64 object-cover">
<div class="p-2 text-sm text-center">${title}</div>
`;
div.addEventListener('click', () => {
window.location.href = `detail.html?id=${item.id}&type=${type}`;
});
return div;
}

export function clearContainer(container) {
container.innerHTML = '';
}