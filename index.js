//API Call = http://www.omdbapi.com/?apikey=6090af04&

const searchInput = document.getElementById('searchInput')
const btn = document.getElementById("search-btn")
const moviesSection = document.getElementById("movies-section")

let moviesArray = []


renderMovies()

document.addEventListener("click", (e) =>{
    if(e.target.dataset.add){
        handleAddClick(e.target.dataset.add)
    }else if(e.target.id === "search-btn"){
        handleSearchClick()
    }else if(e.target.classList[0] === "close-modal-btn"){
        handleCloseModal(e.target.classList[0])
    }
})

function handleCloseModal(classIdentifier){
    document.querySelector(`.${classIdentifier}`).parentElement.classList.toggle('hidden')
}

function handleAddClick(id){
    const movieToAdd = moviesArray.filter(movie => movie.imdbID === id)[0]
    
    let newWatchList = []
    
    if(localStorage.getItem("watchlist")){
        newWatchList = JSON.parse(localStorage.getItem("watchlist"))
    }
    
    if(!newWatchList.find(movie => movie.imdbID === movieToAdd.imdbID)){
        newWatchList.push(movieToAdd)
        toggleModal(`${movieToAdd.Title} has been added to your watchlist`)
        localStorage.setItem("watchlist" , JSON.stringify(newWatchList))  
    }else{
        toggleModal(`${movieToAdd.Title} is already added to your watchlist`)
    }
}

function toggleModal(message){
    const modal = document.querySelector(".modal")
    modal.classList.toggle('hidden')
    modal.children[1].textContent = message
    
}

async function handleSearchClick(){
    moviesArray = []
    if(searchInput.value){
        const res = await fetch(`https://www.omdbapi.com/?apikey=6090af04&s=${searchInput.value}&type=movie`)
        const data = await res.json()
        if(data.Response === 'True'){
            moviesArray = await getAllMovieData(data.Search)     
        }
    }
    renderMovies()  
}

async function getAllMovieData(array){
    const newArray = []
    for(const movie of array){
        const res = await fetch(`https://www.omdbapi.com/?apikey=6090af04&t=${movie.Title}&type=movie`)
        const data = await res.json()
        if(!newArray.find(movieInArray => data.imdbID === movieInArray.imdbID)){
            newArray.push(data)   
        }
    }  
    return newArray
}

function renderMovies(){
    if(!searchInput.value){
        moviesSection.innerHTML = `
        <div class="no-search-screen">
            <img src="/filmIcon.png">
            <p>Start exploring</p> 
        </div>
        `
    }else{
        if(moviesArray.length === 0){
            moviesSection.innerHTML = `
            <div class="no-results-screen">
                <p>Unable to find what you're looking for. Please try another search</p> 
            </div>
            `
        }else{
            
            let moviesHtml = ''
            moviesArray.forEach(movie =>{
                const posterAvailable = movie.Poster !== "N/A"
                moviesHtml += `
                <div class="movie" id=${movie.imdbID}>
                    ${posterAvailable ? `<img class="poster" src=${movie.Poster}>` : ''}
                    <div class="movie-info-section">
                        <div class="movie-info-top">
                            <span class="movie-title">${movie.Title}</span>
                            <span class="movie-rating">
                                <i class="fa-solid fa-star"></i>
                                ${movie.imdbRating}</span>
                        </div>
                        <div class="movie-info-middle">
                            <span class="movie-duration">${movie.Runtime}</span>
                            <span class="movie-genre">${movie.Genre}</span> 
                            <span class="add-to-watchlist-btn">
                                <i class="fa-solid fa-circle-plus"
                                    data-add=${movie.imdbID}></i>
                                Watchlist</span>

                        </div>
                        <p class="plot">${movie.Plot}</p>        
                    </div>
                </div>
                <hr>
                `
            })
            
            moviesHtml+= `            
             <div class="modal hidden">
                        <button class="close-modal-btn">X</button>
                        <p class="modal-message"></p>
            </div> 
            `
            moviesSection.innerHTML = moviesHtml          
        }
    }
}


