"use strict";
movies.splice(100);

// --------------------------------- HTML elements ----------------------------
const categoryOption = $("#category");
const moviesWrapper = $(".wishlist");
const searchInput = $("#search");
const resultCount = $("#search-result");
const body = $("body");
const header = $("header");
const aside = $("aside");
const footer = $("footer");
const input = $$("input");
const select = $("select");

const darkModeBtn = $(".dark-btn");

let formFilter = $("#filter-form");
let searchName = $("#name");
let filmRating = $("#number");

let toastElement = $(".toast");
let toastMessage = $(".toast-text");

// --------------------------------- GLOBAL VARIABLES ----------------------------

let wishlists = JSON.parse(localStorage.getItem("movies"));






// --------------------------------- NORMALIZE DATA ----------------------------

const allMovies = movies.map((el) => {
  return {
    title: el.title,
    year: el.year,
    category: el.categories,
    id: el.imdbId,
    rating: el.imdbRating,
    time: `${Math.trunc(el.runtime / 60)} H , ${Math.trunc(el.runtime % 60)} m`,
    language: el.language,
    youtube: `https://www.youtube.com/embed/${el.youtubeId}`,
    summary: el.summary,
    minImage: el.smallThumbnail,
    maxImage: el.bigThumbnail,
  };
});

function getCategory(moviesList) {
  let category = [];

  if (moviesList.length) {
    moviesList.forEach((el) => {
      el.category.forEach((e) => {
        if (!category.includes(e)) {
          category.push(e);
        }
      });
    });
  }

  render(category);
}

getCategory(allMovies);

// -----------------------------RENDER CATEGORIES ---------------------------

function render(data) {
  if (data.length) {
    // const option = createElement("option", "", 'select film category');
    // categoryOption.appendChild(option);

    data.sort().forEach((el) => {
      const option = createElement("option", "", el);
      categoryOption.appendChild(option);
    });
  }
}

// ------------------------------ Render Movies ----------------------
function renderMovies(moviesList) {
  if (moviesList.length) {
    moviesList.forEach((el) => {
      const card = createElement(
        "div",
        "card",
        `
            
            <img src="${el.minImage}" alt="smth">
            <div class="card-body h-[310px]">
                <h2>${
                  el.title.length > 26
                    ? el.title.substring(0, 23) + "..."
                    : el.title
                }</h2>
                <ul>
                    <li><strong>Year:</strong> ${el.year}</li>
                    <li><strong>Categories:</strong>${el.category}</li>
                    <li><strong>Rating:</strong> ${el.rating}</li>
                    <li><strong>Language:</strong> ${el.language}</li>
                </ul>

                <div class="flex btn-wrappeer items-center gap-x-3">
                   
                    <button 
                        data-del=${el.id}
                        class="grid del hover:bg-red-700 hover:text-white duration-500 text-red-700 place-content-center p-4 border w-12 h-12 rounded-full">
                        <i class="data-del=${
                          el.id
                        } bi bi-trash-fill del"></i>
                    </button>

                    <a href="${
                      el.youtube
                    }" target="_blank" class="flex hover:bg-black hover:text-white duration-500  justify-center gap-x-2 text-xl items-center border min-w-24 px-3 h-12 rounded-full"> 
                        <i class="bi bi-play-circle-fill"></i>
                        <span>watch movie</span>
                    </a>
                </div>

            </div>`
      );
      moviesWrapper.appendChild(card);
    });
  }
}


// ------------------------------ Searching movies------------------------

function searchMovies(searchTerm) {
  const searchResult = allMovies.filter(
    // title bo'yicha qidirish
    (el) => el.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (searchResult.length) {
    moviesWrapper.innerHTML = "";
    resultCount.innerHTML = `Result: ${searchResult.length} movies`;
    renderMovies(searchResult);
  } else {
    resultCount.innerHTML = "";
    moviesWrapper.innerHTML = `<div class='not-found'>
  <h1 class='text-red-600 text-center font-bold text-3xl'>No result found</h1>
  <a href='./movies.html' class='px-[12px] py-[12px] bg-green-600 text-white rounded-lg my-4'>Home</a>
  </div>`;
  }
}

searchInput.addEventListener("keyup", (e) => {
  if (e.keyCode == 13) {
    moviesWrapper.innerHTML = "<span class='loader'></span>";

    setTimeout(() => {
      searchMovies(e.target.value);
    }, 2000);
  }
});

// --------------------------------- Dark Mode -----------------------------

function darkMode() {
  body.classList.toggle("dark-mode");
  header.classList.toggle("dark-mode");
  aside.classList.toggle("dark-mode");
  footer.classList.toggle("dark-mode");

  input.forEach((el) => {
    el.classList.toggle("dark-mode");
  });

  select.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    darkModeBtn.innerHTML = ' <i class = "bi bi-sun text-xl"></i>';
    localStorage.setItem("dark-mode", true);
  } else {
    localStorage.setItem("dark-mode", false);
    darkModeBtn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
  }
}

darkModeBtn.addEventListener("click", () => {
  darkMode();
});

// ----------------- Refresh paytidagi dark mode ---------------------

function dark() {
  let isDark = localStorage.getItem("dark-mode");

  if (isDark == "true") {
    body.classList.add("dark-mode");
    header.classList.add("dark-mode");
    aside.classList.add("dark-mode");
    footer.classList.add("dark-mode");

    input.forEach((el) => {
      el.classList.add("dark-mode");
    });

    select.classList.add("dark-mode");
    darkModeBtn.innerHTML = ' <i class = "bi bi-sun text-xl"></i>';
  } else {
    body.classList.remove("dark-mode");
    header.classList.remove("dark-mode");
    aside.classList.remove("dark-mode");
    footer.classList.remove("dark-mode");

    input.forEach((el) => {
      el.classList.remove("dark-mode");
    });

    select.classList.remove("dark-mode");
    darkModeBtn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
  }
}

dark();

// -------------------- Multi Search function -----------------------

function multiSearch() {
  let name = searchName.value;
  let rating = filmRating.value;
  let category = categoryOption.value;

  const searchResult = allMovies.filter((el) => {
    return (
      el.title.toLowerCase().includes(name.toLowerCase()) &&
      el.category.includes(category) &&
      el.rating >= rating
    );
  });

  if (searchResult.length) {
    moviesWrapper.innerHTML = "";
    resultCount.innerHTML = `Result: ${searchResult.length} movies`;
    renderMovies(searchResult);
  } else {
    resultCount.innerHTML = "";
    moviesWrapper.innerHTML = `<div class='not-found'>
  <h1 class='text-red-600 text-center font-bold text-3xl'>No result found</h1>
  <a href='./movies.html' class='px-[12px] py-[12px] bg-green-600 text-white rounded-lg my-4'>Home</a>
  </div>`;
  }
}

formFilter.addEventListener("submit", (e) => {
  e.preventDefault();
  moviesWrapper.innerHTML = "<span class='loader'></span>";

  setTimeout(() => {
    multiSearch();
  }, 2000);
});

// ----------------------add to wishlist --------------------------

moviesWrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("like")) {
    let id = e.target.getAttribute("data-like");
    let film = allMovies.filter((movie) => movie.id === id)[0];

    toast(
      "success",
      `${
        film.title.length > 6 ? film.title.substring(0, 16) + "..." : film.title
      } film added`,
      2000
    );

    saveToLocalStorage(film.id);
  }
});

function toast(type, message, timeout) {
  toastMessage.innerHTML = message;
  if (type === "success") {
    toastElement.classList.remove("hide");
    toastElement.classList.add("show");
    setTimeout(() => {
      toastElement.classList.remove("show");
      toastElement.classList.add("hide");
    }, timeout);
  } else if (type === "error") {
    toastElement.classList.remove("hide");
    toastElement.classList.add("show-error");
    setTimeout(() => {
      toastElement.classList.remove("show-error");
      toastElement.classList.add("hide");
    }, timeout);
  }
}

// -----------------------Save to local storage----------------------------

let wishlist = JSON.parse(localStorage.getItem("movies")) || [];

function saveToLocalStorage(movieID) {
  if (movieID) {
    if (wishlist.includes(movieID)) {
      wishlist.push(movieID);
      localStorage.setItem("movies", JSON.stringify(wishlist));
    } else {
      toast("error", "Movie already in wishlist", 2000);
    }
  }
}


// -------------------Get wishlist movies -------------------

function getWishlist(){
    let result = allMovies.filter((el)=> JSON.parse(localStorage.getItem('movies')).includes(el.id))

    renderMovies(result)
}

getWishlist()