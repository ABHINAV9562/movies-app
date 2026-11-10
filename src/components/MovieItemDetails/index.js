import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {format} from 'date-fns'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class MovieItemDetails extends Component {
  state = {apiStatus: apiStatusConstants.initial, movieData: {}}

  componentDidMount() {
    this.getMovieDetails()
  }

  componentDidUpdate(prevProps) {
    const {match} = this.props
    if (prevProps.match.params.id !== match.params.id) {
      this.getMovieDetails()
    }
  }

  getMovieDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/movies-app/movies/${id}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        const m = data.movie_details
        const updatedData = {
          adult: m.adult,
          backdropPath: m.backdrop_path,
          budget: m.budget,
          genres: m.genres,
          id: m.id,
          overview: m.overview,
          posterPath: m.poster_path,
          releaseDate: m.release_date,
          runtime: m.runtime,
          similarMovies: m.similar_movies.map(item => ({
            id: item.id,
            title: item.title || item.name,
            posterPath: item.poster_path,
            backdropPath: item.backdrop_path,
          })),
          spokenLanguages: m.spoken_languages,
          title: m.title || m.name,
          voteAverage: m.vote_average,
          voteCount: m.vote_count,
        }
        this.setState({
          movieData: updatedData,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (e) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/movies-app/failure-view-img.png"
        alt="failure view"
        className="failure-image"
      />
      <p className="failure-text">Something went wrong. Please try again</p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getMovieDetails}
      >
        Try Again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {movieData} = this.state
    const {
      backdropPath,
      title,
      runtime,
      adult,
      releaseDate,
      overview,
      genres,
      spokenLanguages,
      voteCount,
      voteAverage,
      budget,
      similarMovies,
    } = movieData

    const hours = Math.floor(runtime / 60)
    const minutes = runtime % 60
    const formattedRuntime = `${hours}h ${minutes}m`
    const censorRating = adult ? 'A' : 'U/A'
    const releaseYear = releaseDate ? format(new Date(releaseDate), 'yyyy') : ''

    return (
      <div className="movie-details-success-container">
        <div
          className="movie-banner"
          style={{backgroundImage: `url(${backdropPath})`}}
        >
          <Header />
          <div className="banner-content">
            <h1 className="movie-title">{title}</h1>
            <div className="meta-info">
              <p className="meta-text">{formattedRuntime}</p>
              <p className="censor-box">{censorRating}</p>
              <p className="meta-text">{releaseYear}</p>
            </div>
            <p className="overview">{overview}</p>
            <button type="button" className="play-button">
              Play
            </button>
          </div>
        </div>
        <div className="detailed-info-container">
          <div className="info-column">
            <h1 className="column-heading">Genres</h1>
            {genres &&
              genres.map(g => (
                <p key={g.id} className="column-value">
                  {g.name}
                </p>
              ))}
          </div>
          <div className="info-column">
            <h1 className="column-heading">Audio Available</h1>
            {spokenLanguages &&
              spokenLanguages.map((lang, index) => (
                <p key={lang.id || index} className="column-value">
                  {lang.english_name}
                </p>
              ))}
          </div>
          <div className="info-column">
            <h1 className="column-heading">Rating Count</h1>
            <p className="column-value">{voteCount}</p>
            <h1 className="column-heading">Rating Average</h1>
            <p className="column-value">{voteAverage}</p>
          </div>
          <div className="info-column">
            <h1 className="column-heading">Budget</h1>
            <p className="column-value">{budget}</p>
            <h1 className="column-heading">Release Date</h1>
            <p className="column-value">
              {releaseDate ? format(new Date(releaseDate), 'do MMMM yyyy') : ''}
            </p>
          </div>
        </div>
        <div className="similar-movies-section">
          <h1 className="similar-heading">More like this</h1>
          <ul className="similar-list">
            {similarMovies &&
              similarMovies.map(movie => (
                <li key={movie.id} className="similar-item">
                  <Link to={`/movies/${movie.id}`}>
                    <img
                      src={movie.posterPath}
                      alt={movie.title}
                      className="similar-poster"
                    />
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    )
  }

  renderDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="movie-details-container">
        {this.renderDetails()}
        <Footer />
      </div>
    )
  }
}

export default MovieItemDetails
