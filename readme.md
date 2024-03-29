**Datalar o'zimizga moslashish uchun normalize qilinadi. 'movies' ichidagi objectlar bor shularni o'zimizga moshlashtiramiz. Ya'ni (el.title, el.year, el.categories, el.imdbId, el.imdbRating, el.runtime, el.language, el.youtubeId, el.summary, el.smallThumbnail, va el.bigThumbnail) valuelar 'movies' ichidegi property bilan bir-biriga ulanadi. Shunda (el.title) value 'movies' ichidagi title(property) ga teng.**

```
// ------------------- NORMALIZE DATA -------------------------

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
```


<br><br>


**category nomli bo'sh arr yaratiladi.Agar moviesList ro'yxati bo'sh bo'lmasa (moviesList.length haqiqiy (truthy) qiymatga ega bo'lsa), har bir kino obyektining category xususiyatidagi (kategoriya nomlaridagi) har bir elementni tekshirib chiqadi.Agar category ro'yxati ichida element qiymati mavjud bo'lmagan bo'lsa (!category.includes(e) shartiga binoan), category ro'yxatiga element qiymatini qo'shadi. render funksiyasi chaqiriladi va category parametr sifatida uzatiladi. getCategory(allMovies) qatorda esa, allMovies ro'yxatini funksiyaga uzatish orqali, barcha kategoriyalarni olish va render funksiyasiga uzatishni bajaradi.**

```
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

```

<br><br>

### Bu funksiya berilgan ma'lumotlar (data ro'yxati) bo'yicha categoriyalarni sahifada chiqarish uchun ishlatiladi.

**Funksiya data ro'yxatida kategoriyalarni olishi va categoryOption(htmlda id orqali tanlab olingan element) bir elementga (createElement funksiyasi orqali yaratilgan) kategoriyalarni chiqarish uchun ishlatiladi. Agar data ro'yxati bo'sh bo'lmasa, sort metodi bilan ro'yxatni tartiblab, forEach yordamida har bir kategoriya uchun option elementini yaratadi va categoryOption elementiga qo'shadi.**


```
// ----------------------RENDER CATEGORIES ------------------------

function render(data) {
  if (data.length) {
    
    data.sort().forEach((el) => {
      const option = createElement("option", "", el);
      categoryOption.appendChild(option);
    });
  }
}

```

<br><br>


### Bu funksiya berilgan moviesList ro'yxati bo'yicha kinolar ro'yxatini sahifada chiqarish uchun ishlatiladi.
**'moviesList' ro'yxatidagi har bir kino uchun card nomli HTML elementini yaratadi va uni sahifadagi 'moviesWrapper' nomli elementga qo'shadi. Har bir card elementi kinoning rasmini, sarlavhasini, chiqish yilini, kategoriyalarini, reytingini, va tilini ko'rsatadi va har bir kino uchun "like" tugmasi va "filmni ko'rish" havolasi qo'shilgan.**


```
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
                        class="grid like hover:bg-red-700 hover:text-white duration-500 text-red-700 place-content-center p-4 border w-12 h-12 rounded-full">
                        <i class="data-like=${
                          el.id
                        } bi bi-suit-heart-fill like"></i>
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

```




<br><br>



### Bu funksiya foydalanuvchi tomonidan kiritilgan so'rovnoma (searchTerm) bo'yicha kinolarni qidirish uchun ishlatiladi

**Berilgan 'searchTerm' so'rovnoma bo'yicha 'allMovies' ro'yxatidan (filter metodi yordamida) qidiruv natijalarini (searchResult ro'yxati) olib chiqaradi.Agar qidiruv natijalari (searchResult.length) mavjud bo'lsa, 'moviesWrapper' elementini tozalab, topilgan kinolar sonini ko'rsatuvchi 'resultCount' elementiga natijalarni ko'rsatadi va 'renderMovies' funksiyasini chaqiradi.Aks holda, 'resultCount' elementini tozalab va "Natija topilmadi" xabarni chiqaradi.Qidirish oynasida Enter tugmasi bosilganda (keyup hodisasi), qidirishni boshlash uchun 'loader' animatsiyasini chiqaradi va qidirishni bajarish uchun 'searchMovies' funksiyasini chaqiradi.**


```
// ----------------------- Searching movies------------------------

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
  <a href='./index.html' class='px-[12px] py-[12px] bg-green-600 text-white rounded-lg my-4'>Home</a>
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
```




<br><br>


### Bu funksiya sahifada "dark mode"ni yoqish yoki o'chirish uchun ishlatiladi. "Dark mode" ni yoqish uchun body, header, aside, footer, va boshqa elementlarga dark-mode klassini qo'shadi yoki o'chiradi. "dark mode" ni saqlab qo'yish uchun localStorage dan foydalaniladi.


```
// --------------------- Dark Mode -----------------------

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
```


<br><br>


### Bu funksiya sayt yangilanganida(refresh bo'lganida) "dark mode"ni saqlangan holatini qaytaradi.

**'localStorage' dan "dark-mode" qiymatini olib, agar qiymat "true" bo'lsa, sahifadagi kerakli elementlarga "dark-mode" klassini qo'shadi va "dark-mode" tugmasini "🌞" belgisi bilan o'zgartiradi, aks holda klasslarni o'chiradi va tugmani "🌙" belgisi bilan o'zgartiradi.**


```
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
```

<br><br>


### Foydalanuvchi tomonidan kiritilgan parametrlar (name, rating, category) bo'yicha kinolar ro'yxatini qidiradi va natijalarni sahifada chiqaradi.

**Bu funksiya 'searchName', 'filmRating', va 'categoryOption' elementlaridan qiymatlarni oladi va 'allMovies' ro'yxatidan foydalanib, kiritilgan qiymatlarga mos keladigan kinolarni qidiradi. Qidiruv natijalarini sahifada chiqarish uchun 'renderMovies' funksiyasidan foydalaniladi. Qidiruv natijasi bo'sh bo'lsa "Natija topilmadi" degan xabarni chiqaradi. 'formFilter' elementi submit bo'lib yuborilganda (submit hodisasi), qidirishni boshlash uchun loader animatsiyasini chiqaradi va qidirishni bajarish uchun 'multiSearch' funksiyasini chaqiradi.**

```
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
  <a href='./index.html' class='px-[12px] py-[12px] bg-green-600 text-white rounded-lg my-4'>Home</a>
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
```


<br><br>




```
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

  } 
  else if (type === "error") {
    toastElement.classList.remove("hide");
    toastElement.classList.add("show-error");

    setTimeout(() => {
      toastElement.classList.remove("show-error");
      toastElement.classList.add("hide");
    }, timeout);
  }
}
```

<br><br>



### 'saveToLocalStorage' funksiyasi 'movieID' ni qabul qilib, agar 'movieID' mavjud bo'lsa, wishlist ro'yxatida bu 'movieID' mavjudligini tekshiradi. Agar wishlist ro'yxati ichida 'movieID' mavjud bo'lmasa, wishlist ro'yxatiga 'movieID' ni qo'shadi va yangilangan wishlist ro'yxatini 'localStorage' ga saqlab qo'yadi.

```
// ------------------Save to local storage----------------------

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
```