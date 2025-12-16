const FAVORITES_KEY = 'cinetech_favorites';
const COMMENTS_KEY = 'cinetech_comments';


export function getFavorites() {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
}


export function addFavorite(item) {
    const favorites = getFavorites();
    if (!favorites.find(f => f.id === item.id && f.type === item.type)) {
    favorites.push(item);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
}

export function removeFavorite(id) {
    const favorites = getFavorites().filter(f => f.id !== id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}


export function getComments(key) {
    const comments = JSON.parse(localStorage.getItem(COMMENTS_KEY)) || {};
    return comments[key] || [];
}

export function addComment(key, comment) {
    const comments = JSON.parse(localStorage.getItem(COMMENTS_KEY)) || {};
    comments[key] = comments[key] || [];
    comments[key].push(comment);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}