import { initSearch } from './search.js';
import { 
  getPopularMovies, 
  getPopularSeries, 
  getDetails, 
  getCredits, 
  getSimilar, 
  IMAGE_URL 
} from './api.js';
import { createCard, clearContainer } from './ui.js';
import { 
  addFavorite, 
  removeFavorite, 
  getFavorites, 
  addComment, 
  getComments 
} from './storage.js';

/* INITIALISATION GLOBALE */
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

    clearContainer(moviesContainer);
    clearContainer(seriesContainer);

    movies.results.slice(0, 5).forEach(movie => {
      moviesContainer.appendChild(createCard(movie, 'movie'));
    });

    series.results.slice(0, 5).forEach(tv => {
      seriesContainer.appendChild(createCard(tv, 'tv'));
    });

  } catch (error) {
    console.error('Erreur accueil :', error);
  }
}

/* PAGE FILMS */
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
      console.error('Erreur films :', error);
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

/* PAGE SERIES */
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
      console.error('Erreur séries :', error);
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

/* PAGE DETAIL */
async function loadDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const type = params.get('type'); // movie ou tv

  if (!id || !type) return;

  try {
    const detail = await getDetails(type, id);
    const credits = await getCredits(type, id);
    const similar = await getSimilar(type, id);

    // Poster
    document.querySelector('#poster').innerHTML = `
      <img src="${IMAGE_URL}${detail.poster_path}" alt="${detail.title || detail.name}" class="w-full h-full object-cover rounded-lg">
    `;

    // Infos principales
    document.querySelector('#title').textContent = detail.title || detail.name;
    document.querySelector('#overview').textContent = detail.overview;
    document.querySelector('#genres').textContent = 'Genres: ' + detail.genres.map(g => g.name).join(', ');
    document.querySelector('#release-date').textContent = 'Date: ' + (detail.release_date || detail.first_air_date);
    document.querySelector('#rating').textContent = 'Note: ' + detail.vote_average;

    // Favoris
    const favoriteBtn = document.querySelector('#favorite-btn');
    favoriteBtn.addEventListener('click', () => {
      addFavorite({id: detail.id, type, title: detail.title || detail.name, poster_path: detail.poster_path});
      favoriteBtn.textContent = 'Ajouté aux favoris';
    });

    // Casting
    const castingContainer = document.querySelector('#casting');
    clearContainer(castingContainer);
    credits.cast.slice(0, 10).forEach(actor => {
      const div = document.createElement('div');
      div.className = 'text-center';
      div.innerHTML = `
        <img src="${IMAGE_URL}${actor.profile_path}" alt="${actor.name}" class="w-full h-40 object-cover rounded-lg mb-2">
        <p class="text-sm">${actor.name}</p>
        <p class="text-xs text-slate-400">${actor.character}</p>
      `;
      castingContainer.appendChild(div);
    });

    // Similaires
    const similarContainer = document.querySelector('#similar');
    clearContainer(similarContainer);
    similar.results.slice(0, 10).forEach(item => {
      similarContainer.appendChild(createCard(item, type));
    });

    // Commentaires
    const commentForm = document.querySelector('#comment-form');
    const commentInput = document.querySelector('#comment-input');
    const commentsList = document.querySelector('#comments-list');

    function renderComments() {
      commentsList.innerHTML = '';
      getComments(`${type}_${id}`).forEach(c => {
        const li = document.createElement('li');
        li.className = 'bg-slate-800 p-2 rounded';
        li.textContent = c;
        commentsList.appendChild(li);
      });
    }

    renderComments();

    commentForm.addEventListener('submit', e => {
      e.preventDefault();
      const text = commentInput.value.trim();
      if (!text) return;
      addComment(`${type}_${id}`, text);
      commentInput.value = '';
      renderComments();
    });

  } catch (error) {
    console.error('Erreur page détail :', error);
  }
}

/* PAGE FAVORIS */

function loadFavorites() {
  const container = document.querySelector('#favorites-list');
  clearContainer(container); 

  const favorites = getFavorites();
  
  if (favorites.length === 0) {
    const noFavoritesMessage = document.createElement('p');
    noFavoritesMessage.textContent = 'Aucun favori ajouté.';
    container.appendChild(noFavoritesMessage);
  } else {
    favorites.forEach(item => {
      const card = createCard(item, item.type); 
      container.appendChild(card);

      
      const btn = document.createElement('button');
      btn.textContent = 'Supprimer';
      btn.className = 'px-2 py-1 bg-red-600 rounded mt-2';
      btn.addEventListener('click', () => {
        removeFavorite(item.id, item.type); 
        loadFavorites(); 
      });
      card.appendChild(btn); 
    });
  }
}

