// global variables

const figs = document.querySelectorAll(".fig");
const button = document.querySelector(".movie__button");
const figOne = document.querySelector(".board__figure--one");
const figTwo = document.querySelector(".board__figure--two");
const figThree = document.querySelector(".board__figure--three");
const figFour = document.querySelector(".board__figure--four");
const boardCapOne = document.querySelector(".board__caption--one");
const boardCapTwo = document.querySelector(".board__caption--two");
const boardCapThree = document.querySelector(".board__caption--three");
const boardCapFour = document.querySelector(".board__caption--four");
const gifText = document.querySelector(".movie__title--text");
const gifOverlay = document.querySelector(".movie__title__overlay");



// API URL's
let movieDB_URL = "https://api.themoviedb.org/3/movie/";
let giphy_URL = "https://api.giphy.com/v1/gifs/search?api_key=";

// lbwQZXxYMqPh2DpvV8nXbGlqHNm8kJ9h&q=basic-instinct&limit=1&offset=0&rating=G&lang=en

// hide an API key
let movieDB_key = "?api_key=bedab68d23f1d5afb18624ada51a697e";
let giphy_key = "lbwQZXxYMqPh2DpvV8nXbGlqHNm8kJ9h";
// create a random number between 100-500 to limit database results ( arbitrarily )

let answerIndex;

gifText.textContent = "";

gifOverlay.style.display ="none";

function generateRandomNumber(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// initialize empty movie array to push movie object to
let movieArray = [];
// initialize accumulator array
let idArray = [];

// generate 4 random movie objects and push the into an array

async function generateMovies() {
  movieArray = [];
  idArray = [];
  gifText.textContent = "";
  gifOverlay.style.opacity = "0";


  // fetch movies until array has 4 objects
  while (movieArray.length < 4) {
    let movieObj = {};
    let movieId = generateRandomNumber(500, 100);
    // create new url on each iteration
    let requestURL = `${movieDB_URL}${movieId}${movieDB_key}`;
    // use try to catch API call errors
    try {
      // fetch movie using generated url
      let response = await fetch(requestURL);
      let movie = await response.json();
      
      if (
        // check if movie exists in the database ( checking response status code )
        movie.status_code !== 34 &&
        // make sure movie has a poster image
        movie.poster_path !== null &&
        // make sure there are no duplicates in the accumulator array (idArray)
        !idArray.includes(movie.id)
      ) {
        // create a movie object with specified keys
        idArray.push(movie.id);
        movieObj.id = movie.id;
        movieObj.img = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
        movieObj.title = movie.title;
        // push movieObj into moviearray
        movieArray.push(movieObj);
      }
    } catch (err) {
      // catches errors both in fetch and response.json
      alert("Something's gone wrong, please try again");
    }
  }
  figOne.style.backgroundImage = `url(${movieArray[0].img})`;
  figTwo.style.backgroundImage = `url(${movieArray[1].img})`;
  figThree.style.backgroundImage = `url(${movieArray[2].img})`;
  figFour.style.backgroundImage = `url(${movieArray[3].img})`;
  boardCapOne.textContent = movieArray[0].title.toString();
  boardCapTwo.textContent = movieArray[1].title.toString();
  boardCapThree.textContent = movieArray[2].title.toString();
  boardCapFour.textContent = movieArray[3].title.toString();
}

// choose random movie from the array and replace white spaces in the title with hyphen
function gifURLgenerator() {
  let randomIndex = generateRandomNumber(3, 0);
  let movieTitle = movieArray[randomIndex].title;

  answerIndex = randomIndex;
  movieTitle = movieTitle.replace(/[.,\/#!$%\^&\*;:{}=\_`~(),\s ]/g, " ");
  movieTitle = movieTitle.replace(/ /g, "-").toLowerCase();

  // generate request URL
  let requestURL = `${giphy_URL}${giphy_key}&q=${movieTitle}&limit=1&offset=0&rating=G&lang=en`;

  return requestURL;
}

async function generateGif() {
  // fetch gif with a specic title
  let requestURL = gifURLgenerator();
  let gifURL;
  try {
    // fetch movie using generated url
    let response = await fetch(requestURL);
    let gif = await response.json();
    gifURL = gif.data[0].images.downsized_large.url;
  } catch (err) {
    // catches errors both in fetch and response.json
    alert("Something's gone wrong, please try again");
  }
  document.querySelector(
    ".movie__title"
  ).style.backgroundImage = `url(${gifURL})`;
}

figs.forEach(fig => {
  fig.onclick = function() {
    console.log(answerIndex);
    if (fig.dataset.index == answerIndex) {
      gifOverlay.style.display = "block";
      gifOverlay.style.backgroundColor = "hsl(129, 100%, 40%)";
      gifOverlay.style.opacity = "0.8";
      document.querySelector(".movie__title--text").textContent = "Correct!";

    } else {
      gifOverlay.style.display = "block";
      gifOverlay.style.backgroundColor = "hsl(13, 100%, 40%)";
      gifOverlay.style.opacity = "0.8";
      document.querySelector(".movie__title--text").textContent = "Incorrect!";
    }
  };
});

// call functions with a click on button
button.addEventListener("click", () => {
    // generateGif function needs to be called AFTER generateMovies
  generateMovies().then(generateGif);
});

// call the functions as page opens for first time
generateMovies().then(generateGif);

