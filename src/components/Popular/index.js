import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Popular extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    popularMovies: [],
  }

  componentDidMount() {
    this.getPopularMovies()
  }

  getPopularMovies = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/movies-app/popular-movies'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.results.map(movie => ({
        id: movie.id,
        posterPath: movie.poster_path,
        title: movie.title,
        backdropPath: movie.backdrop_path,
      }))
      this.setState({
        popularMovies: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
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
        src="https://assets.ccbp.in/frontend/react-js/failure-view-img.png"
        alt="failure view"
        className="failure-image"
      />
      <p className="failure-text">Something went wrong. Please try again</p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getPopularMovies}
      >
        Try Again
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {popularMovies} = this.state
    return (
      <ul className="popular-movies-list ">
        {popularMovies.map(movie => (
          <li key={movie.id} className="popular-movie-item">
            <Link to={`/movies/${movie.id}`}>
              <img
                src={movie.posterPath}
                alt={movie.title}
                className="popular-movie-poster popular-movie-image"
              />
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  renderPopularMovies = () => {
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
      <div className="popular-container">
        <Header />
        <div className="popular-content">{this.renderPopularMovies()}</div>
        <Footer />
      </div>
    )
  }
}

export default Popular
