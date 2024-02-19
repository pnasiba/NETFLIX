"use strict";
movies.splice(100);

// --------------------------------- HTML elements ----------------------------
const categoryOption = $("#category");
const moviesWrapper = $(".movies");
const searchBtn = $("#searchButton");

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
                        data-like=${el.id}
                        class="grid hover:bg-red-700 hover:text-white duration-500 text-red-700 place-content-center p-4 border w-12 h-12 rounded-full">
                        <i class="bi bi-suit-heart-fill "></i>
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

renderMovies(allMovies);

// ------------------------------ Searching movies------------------------

searchBtn.addEventListener("keyup", (e) => {
  moviesWrapper.innerHTML = "";
  searchMovies(e.target.value);
});

function searchMovies(search) {
  const searchResult = movies.filter(
    // title bo'yicha qidirish
    (el) => el.title.toLowerCase().includes(search.toLowerCase())
  );
//   console.log(searchResult.map((el) => el.minImage));
  renderMovies(searchResult);
}

// --------------------------------- Dark Mode -----------------------------

const body = document.body;
const darkModeToggle = document.getElementById("darkModeToggle");

darkModeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
});
