import "simplelightbox/dist/simple-lightbox.min.css";
import Notiflix from 'notiflix';
import pixabayApi from './pixabayApi';
import simpleLightbox from 'simplelightbox';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.classList.add('hidden');


let query;
let page = 1;
let lightbox;


form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreClick);

function onFormSubmit(event) {
  event.preventDefault();
  const {
    elements: { searchQuery },
  } = event.target;
  query = searchQuery.value;
  if (searchQuery.value !== '' && searchQuery !== query) {
    page = 1;
  }

  pixabayApi(query, page).then(response => {
    console.log(response.data.totalHits);
    if (response.data.totalHits === 0) {
      loadMoreBtn.classList.add('hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      gallery.innerHTML = '';
    } else {
      loadMoreBtn.classList.remove('hidden');
      Notiflix.Notify.success(`Hooray! ${response.data.totalHits} images found.`);
      const hits = response.data.hits;
      const markup = hits
        .map(image => {
          return `<div class='photo-card'>
        <a href='${image.largeImageURL}'><img
            src='${image.webformatURL}'
            alt='${image.tags}'
            loading='lazy'
          /></a>
        <div class='info'>
          <p class='info-item'>
            <b>Likes</b>
            ${image.likes}
          </p>
          <p class='info-item'>
            <b>Views</b>
            ${image.views}
          </p>
          <p class='info-item'>
            <b>Comments</b>
            ${image.comments}
          </p>
          <p class='info-item'>
            <b>Downloads</b>
            ${image.downloads}
          </p>
        </div>
        </div>`;
        })
        .join('');
      gallery.innerHTML = markup;
      lightbox = new SimpleLightbox('.gallery a');
      
    }
  });
}

function onLoadMoreClick() {
  page += 1;
  pixabayApi(query, page).then(response => {
    console.log(response);
    if (response.data.totalHits === 0) {
      loadMoreBtn.classList.add('hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (page === Math.ceil(response.data.totalHits / 40)) {
      loadMoreBtn.classList.add('hidden');
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
     const hits = response.data.hits;
      const markup = hits
        .map(image => {
          return `<div class='photo-card'>
            <a href='${image.largeImageURL}'><img
                src='${image.webformatURL}'
                alt='${image.tags}'
                loading='lazy'
              /></a>
            <div class='info'>
              <p class='info-item'>
                <b>Likes</b>
                ${image.likes}
              </p>
              <p class='info-item'>
                <b>Views</b>
                ${image.views}
              </p>
              <p class='info-item'>
                <b>Comments</b>
                ${image.comments}
              </p>
              <p class='info-item'>
                <b>Downloads</b>
                ${image.downloads}
              </p>
            </div>
            </div>`;
        })
        .join('');
      gallery.insertAdjacentHTML('beforeend', markup);
      lightbox.refresh();
    }
  });
}
