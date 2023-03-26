const container = document.getElementById('card-container');
const loadMoreButton = document.getElementById('load-more');
const loader = document.getElementById('loader');
const searchDiv = document.getElementById('search-value');
const search= document.querySelector('input');
const searchBtn= document.querySelector('.searchBtn');
const searchValue= document.querySelector('#value');

//  search.value = '';

let startIndex = 0;
let endIndex = 8;

function showLoader() {
  loader.style.display = 'block';
 
}

function hideLoader() {
  loader.style.display = 'none';
}

function loadBooks(start, end) {
  showLoader();
  fetch(`https://openlibrary.org/search.json?q=javascript&limit=${end}&offset=${start}`)
    .then(response => response.json())
    .then(data => {
      const books = data.docs;
      const html = books.map(book => `
        <div class="card">
          <div class="card-image">
          <img src="${book.cover_i ? `http://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : './img/default_cover.jpg'}" alt="">     </div>
          <div class="card-body">
            <h4 class="card-title" id="card-title">${book.title}</h4>
            <p class="card-subtitle text-muted" id="card-subtitle">$${book.publisher && book.publisher[0]}</p>
          </div>
          <div class="card-body2">
            <p class="card-text" id="year">${book.first_publish_year}</p>
            <a href="http://openlibrary.org${book.key}" class="card-link">Read</a>
          </div>
        </div>`
      ).join('');

      container.innerHTML = html;

      if (end >= data.numFound) {
        loadMoreButton.style.display = 'none'; // hide the load more button
      } else {
        loadMoreButton.style.display = 'block'; // show the load more button
      }

    })
    .catch(err => console.error(err))
    .finally(() => {
      hideLoader();
    });
}

loadBooks(startIndex, endIndex);


function searchBooks(query, start, end) {
    showLoader();
    const url = `https://openlibrary.org/search.json?q=${query}&limit=${end}&offset=${start}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const books = data.docs;
        const html = books.map(book => `
          <div class="card">
            <div class="card-image">
            <img src="${book.cover_i ? `http://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : './img/default_cover.jpg'}" alt="">    
            </div>
            <div class="card-body">
              <h4 class="card-title" id="card-title">${book.title}</h4>
              <p class="card-subtitle text-muted" id="card-subtitle">${book.publisher && book.publisher[0].replace(/\$/g, '') }</p>
            </div>
            <div class="card-body2">
              <p class="card-text" id="year">${book.first_publish_year}</p>
              <a href="http://openlibrary.org${book.key}" class="card-link">Read</a>
            </div>
          </div>`
        ).join('');

       
  
        container.innerHTML = html;
  
        if (end >= data.numFound) {
            loadMoreButton.style.display = 'none'; // hide the load more button
          } else {
            loadMoreButton.style.display = 'block'; // show the load more button
          }
  

          localStorage.setItem('searchQuery', '');
          if (query.trim() !== '') {
            localStorage.setItem('searchQuery', query.trim());
          }

        
       
       search.value = '';
      })
      
      .catch(err => console.error(err))
      .finally(() => {
        hideLoader();
      });
  }


  


  loadMoreButton.addEventListener('click', () => {
    startIndex += 8;
    endIndex += 8;
    const query = localStorage.getItem('searchQuery');

    if (query) {
      searchBooks(query, startIndex, endIndex);
    } else {
      loadBooks(startIndex, endIndex);
    }
  });
  
  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
  
    const query = search.value.trim();
  
    if (query) {
      
      searchDiv.style.display = 'block';
      searchValue.innerHTML = query;
      startIndex = 0;
      endIndex = 8;
      searchBooks(query, startIndex, endIndex);
    } else {
      
      searchDiv.style.display = 'none';
      startIndex = 0;
      endIndex = 8;
      loadBooks(startIndex, endIndex);
    }

  
  });


  const filters = document.querySelectorAll('.filter a');

  filters.forEach(filter => {

    filter.addEventListener('click', (event) => {
      event.preventDefault();
      
      // remove active class from all filters
      filters.forEach(filter => {
        filter.classList.remove('active');
      });
  
      // add active class to clicked filter
      event.target.classList.add('active');
      
      // perform filtering logic here

      
const checkers = filter.innerHTML;
       if( checkers == 'All') {
        startIndex = 0;
        endIndex = 8;
         loadBooks(startIndex, endIndex); 
      } else  {
        
        startIndex = 0;
        endIndex = 8;
      
        searchBooks(checkers, startIndex, endIndex);
      }
    });
  });