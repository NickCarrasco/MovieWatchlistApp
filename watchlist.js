const moviesSection = document.getElementById('movies-section')
checkWatchList()

document.addEventListener("click", (e) =>{
    if(e.target.dataset.remove){
        handleRemoveClick(e.target.dataset.remove)
    }
})


function handleRemoveClick(id){
    let newWatchList = JSON.parse(localStorage.getItem("watchlist"))
    
    newWatchList = newWatchList.filter(movie => movie.imdbID !== id)
    if(newWatchList.length === 0){
        localStorage.clear()
    }else{
        localStorage.setItem("watchlist" , JSON.stringify(newWatchList))    
    }
    checkWatchList()
}

function checkWatchList(){
    if(!localStorage.getItem("watchlist")){
        moviesSection.innerHTML = `
            <div class="no-results-screen">
                <p>Your watchlist is looking a little empty..</p>
                <a href="index.html" class="back-to-search-btn">
                    <i class="fa-solid fa-circle-plus"></i> 
                    Let's add some movies</a> 
            </div>
        `
    }else{
        let movieSectionHtml = ''
        
        const watchList = JSON.parse(localStorage.getItem("watchlist"))
        
        watchList.forEach(movie => {
            const posterAvailable = movie.Poster !== "N/A"
            movieSectionHtml += `
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
                                <i class="fa-solid fa-circle-minus" data-remove=${movie.imdbID}></i>
                                Remove</span>

                        </div>
                        <p class="plot">${movie.Plot}</p>        
                    </div>
                </div>
                <hr>  
            `
        })     
          
        moviesSection.innerHTML = movieSectionHtml 
    }
}
