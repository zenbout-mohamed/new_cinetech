import { IMAGE_URL } from './api.js';

export function createCard(item, type) {
  const div = document.createElement('div');
  div.className = 'bg-slate-800 rounded-lg overflow-hidden cursor-pointer';
  div.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.title || item.name}" class="w-full h-64 object-cover">
    <h3 class="text-sm font-bold mt-2 px-2">${item.title || item.name}</h3>
  `;
  div.addEventListener('click', () => {
    window.location.href = `detail.html?id=${item.id}&type=${type}`;
  });
  return div;
}