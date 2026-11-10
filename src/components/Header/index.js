import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {HiOutlineSearch} from 'react-icons/hi'
import './index.css'

class Header extends Component {
  render() {
    const {match} = this.props
    const isSearchRoute = match ? match.path === '/search' : false

    return (
      <nav className="nav-header">
        <div className="nav-content">
          <div className="logo-menu-container">
            <Link to="/">
              <img
                src="https://assets.ccbp.in/frontend/react-js/movies-app-logo-img.png"
                alt="website logo"
                className="website-logo"
              />
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/popular" className="nav-link">
                  Popular
                </Link>
              </li>
            </ul>
          </div>
          <div className="search-profile-container">
            {!isSearchRoute && (
              <Link to="/search">
                <button
                  type="button"
                  className="search-button"
                  data-testid="searchButton"
                >
                  <HiOutlineSearch className="search-icon" />
                </button>
              </Link>
            )}
            <Link to="/account">
              <img
                src="https://assets.ccbp.in/frontend/react-js/profile-img.png"
                alt="profile"
                className="profile-img"
              />
            </Link>
          </div>
        </div>
      </nav>
    )
  }
}

export default withRouter(Header)
