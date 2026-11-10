import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Slider from 'react-slick'
import Header from '../Header'
import Footer from '../Footer'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './index.css'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
  ],
}

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    trendingStatus: apiStatusConstants.initial,
    originalsStatus: apiStatusConstants.initial,
    trendingMovies: [],
    originalsMovies: [],
    randomMovie: null,
  }

  componentDidMount() {
    this.getTrendingMovies()
    this.getOriginalsMovies()
  }

  getTrendingMovies = async () => {
    this.setState({trendingStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/movies-app/trending-movies'
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
          backdrop_path: movie.backdrop_path,
          overview: movie.overview,
          posterPath: movie.poster_path,
          poster_path: movie.poster_path,
          title: movie.title || movie.name,
          name: movie.name || movie.title,
        }))
        this.setState({
          trendingMovies: updatedData,
          trendingStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({trendingStatus: apiStatusConstants.failure})
      }
    } catch (e) {
      this.setState({trendingStatus: apiStatusConstants.failure})
    }
  }

  getOriginalsMovies = async () => {
    this.setState({originalsStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/movies-app/originals'
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
          backdrop_path: movie.backdrop_path,
          overview: movie.overview,
          posterPath: movie.poster_path,
          poster_path: movie.poster_path,
          title: movie.title || movie.name,
          name: movie.name || movie.title,
        }))

        const randomIndex =
          updatedData.length > 0
            ? Math.floor(Math.random() * updatedData.length)
            : 0
        const randomMovie = updatedData[randomIndex]

        this.setState({
          originalsMovies: updatedData,
          originalsStatus: apiStatusConstants.success,
          randomMovie,
        })
      } else {
        this.setState({originalsStatus: apiStatusConstants.failure})
      }
    } catch (e) {
      this.setState({originalsStatus: apiStatusConstants.failure})
    }
  }

  onClickTrendingRetry = () => {
    this.getTrendingMovies()
  }

  onClickOriginalsRetry = () => {
    this.getOriginalsMovies()
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
    </div>
  )

  renderFailureView = onRetryClick => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/movies-app/failure-view-img.png"
        alt="failure view"
        className="failure-image"
      />
      <p className="failure-text">Something went wrong. Please try again</p>
      <button type="button" className="retry-button" onClick={onRetryClick}>
        Try Again
      </button>
    </div>
  )

  renderTrendingSlider = () => {
    const {trendingStatus, trendingMovies} = this.state

    switch (trendingStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return (
          <div className="movies-slider-container">
            <Slider {...settings}>
              {trendingMovies.map(movie => (
                <div key={movie.id} className="movie-item-container">
                  <Link to={`/movies/${movie.id}`}>
                    <img
                      src={movie.poster_path || movie.posterPath}
                      alt={movie.name || movie.title}
                      className="movie-poster home-image"
                    />
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
        )
      case apiStatusConstants.failure:
        return this.renderFailureView(this.onClickTrendingRetry)
      default:
        return null
    }
  }

  renderOriginalsSlider = () => {
    const {originalsStatus, originalsMovies} = this.state

    switch (originalsStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return (
          <div className="movies-slider-container">
            <Slider {...settings}>
              {originalsMovies.map(movie => (
                <div key={movie.id} className="movie-item-container">
                  <Link to={`/movies/${movie.id}`}>
                    <img
                      src={movie.poster_path || movie.posterPath}
                      alt={movie.name || movie.title}
                      className="movie-poster home-image"
                    />
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
        )
      case apiStatusConstants.failure:
        return this.renderFailureView(this.onClickOriginalsRetry)
      default:
        return null
    }
  }

  renderBanner = () => {
    const {originalsStatus, randomMovie} = this.state

    switch (originalsStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return randomMovie ? (
          <div
            className="home-bg-container"
            style={{
              backgroundImage: `url(${
                randomMovie.backdrop_path || randomMovie.backdropPath
              })`,
            }}
          >
            <div className="home-content-container">
              <h1 className="home-movie-title">
                {randomMovie.title || randomMovie.name}
              </h1>
              <p className="home-movie-overview">{randomMovie.overview}</p>
              <button type="button" className="play-button">
                Play
              </button>
            </div>
          </div>
        ) : null
      case apiStatusConstants.failure:
        return this.renderFailureView(this.onClickOriginalsRetry)
      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-container">
        <Header />
        {this.renderBanner()}
        <div className="movies-section">
          <h1 className="movies-section-heading">Trending Now</h1>
          {this.renderTrendingSlider()}
          <h1 className="movies-section-heading">Originals</h1>
          {this.renderOriginalsSlider()}
        </div>
        <Footer />
      </div>
    )
  }
}

export default Home
