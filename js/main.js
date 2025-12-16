import { initSearch } from './search.js';
import { getPopularMovies, getPopularSeries } from './api.js';
import { createCard, clearContainer } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
initSearch('header input[type="text"]');

const page = document.body.dataset.page;

switch (page) {
case 'home':
loadHome();
break;
case 'films':
loadMovies();
break;
case 'series':
loadSeries();
break;
case 'detail':
loadDetail();
break;
case 'favorites':
loadFavorites();
break;
}
});

/* PAGE ACCUEIL */
async function loadHome() {
const moviesContainer = document.querySelector('#popular-movies');
const seriesContainer = document.querySelector('#popular-series');

try {
const movies = await getPopularMovies();
const series = await getPopularSeries();

```
clearContainer(moviesContainer);
clearContainer(seriesContainer);

movies.results.slice(0, 5).forEach(movie => {
  moviesContainer.appendChild(createCard(movie, 'movie'));
});

series.results.slice(0, 5).forEach(tv => {
  seriesContainer.appendChild(createCard(tv, 'tv'));
});
```

} catch (error) {
console.error(error);
}
}

/* PAGE SÉRIES */
let seriesPage = 1;

async function loadSeries() {
  const container = document.querySelector('#series-list');
  const nextBtn = document.querySelector('#next');
  const prevBtn = document.querySelector('#prev');

  async function render() {
    try {
      const data = await getPopularSeries(seriesPage);
      clearContainer(container);

      data.results.forEach(series => {
        container.appendChild(createCard(series, 'tv'));
      });
    } catch (error) {
      console.error('Erreur lors du chargement des séries :', error);
    }
  }

  nextBtn.addEventListener('click', () => {
    seriesPage++;
    render();
  });

  prevBtn.addEventListener('click', () => {
    if (seriesPage > 1) seriesPage--;
    render();
  });

  render();
}

// PAGE FILMS

let moviePage = 1;

async function loadMovies() {
  const container = document.querySelector('#movies-list');
  const nextBtn = document.querySelector('#next');
  const prevBtn = document.querySelector('#prev');

  async function render() {
    try {
      const data = await getPopularMovies(moviePage);
      clearContainer(container);

      data.results.forEach(movie => {
        container.appendChild(createCard(movie, 'movie'));
      });
    } catch (error) {
      console.error('Erreur lors du chargement des films :', error);
    }
  }

  nextBtn.addEventListener('click', () => {
    moviePage++;
    render();
  });

  prevBtn.addEventListener('click', () => {
    if (moviePage > 1) moviePage--;
    render();
  });

  render();
}

/* PAGE DÉTAIL */
function loadDetail() {
console.log('Page détail chargée');
}

/* PAGE FAVORIS */
function loadFavorites() {
console.log('Page favoris chargée');
}
