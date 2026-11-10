import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {HiOutlineSearch} from 'react-icons/hi'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
  noResults: 'NO_RESULTS',
}

class Search extends Component {
  state = {
    searchInput: '',
    moviesList: [],
    apiStatus: apiStatusConstants.initial,
    searchedQuery: '',
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  getSearchMovies = async () => {
    const {searchInput} = this.state
    if (searchInput.trim() === '') return

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
      searchedQuery: searchInput,
    })

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/movies-app/movies-search?search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    try {
      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        const updatedData = fetchedData.results.map(movie => ({
          id: movie.id,
          backdropPath: movie.backdrop_path,
          overview: movie.overview,
          posterPath: movie.poster_path,
          title: movie.title,
        }))

        if (updatedData.length === 0) {
          this.setState({
            apiStatus: apiStatusConstants.noResults,
            moviesList: [],
          })
        } else {
          this.setState({
            moviesList: updatedData,
            apiStatus: apiStatusConstants.success,
          })
        }
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (e) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getSearchMovies()
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/movies-app/failure-view-img.png"
        alt="failure view"
        className="failure-image"
      />
      <p className="failure-text">Something went wrong. Please try again</p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getSearchMovies}
      >
        Try Again
      </button>
    </div>
  )

  renderNoResultsView = () => {
    const {searchedQuery} = this.state
    return (
      <div className="no-results-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/movies-app/no-search-results-view.png"
          alt="no movies"
          className="no-movies-image"
        />
        <p className="no-movies-text">
          Your search for {searchedQuery} did not find any matches.
        </p>
      </div>
    )
  }

  renderSuccessView = () => {
    const {moviesList} = this.state
    return (
      <ul className="search-movies-list">
        {moviesList.map(movie => (
          <li key={movie.id} className="search-movie-item">
            <Link to={`/movies/${movie.id}`}>
              <img
                src={movie.posterPath}
                alt={movie.title}
                className="search-movie-poster"
              />
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  renderSearchContent = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.noResults:
        return this.renderNoResultsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <div className="search-route-container">
        <Header />
        <div className="search-body-container">
          <div className="search-input-container">
            <input
              type="search"
              className="search-input"
              value={searchInput}
              onChange={this.onChangeSearchInput}
              onKeyDown={this.onEnterSearchInput}
              placeholder="Search"
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-button"
              onClick={this.getSearchMovies}
            >
              <HiOutlineSearch size={20} color="#ffffff" />
            </button>
          </div>
          {this.renderSearchContent()}
        </div>
        <Footer />
      </div>
    )
  }
}

export default Search
