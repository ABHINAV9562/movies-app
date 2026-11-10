import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

class Account extends Component {
  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  render() {
    return (
      <div className="account-container">
        <Header />
        <div className="account-body">
          <h1 className="account-heading">Account</h1>
          <div className="account-details-section">
            <p className="account-section-label">Member ship</p>
            <p className="account-text">user@gmail.com</p>
          </div>
          <hr className="divider" />
          <div className="account-details-section">
            <p className="account-section-label">Password</p>
            <p className="account-text">**********</p>
          </div>
          <hr className="divider" />
          <div className="plan-details-section">
            <p className="account-section-label">Plan details </p>
            <div className="plan-type-container">
              <p className="plan-type">Premium</p>
              <p className="plan-quality">Ultra HD</p>
            </div>
          </div>
          <hr className="divider" />
          <button
            type="button"
            className="logout-button"
            onClick={this.onClickLogout}
          >
            Logout
          </button>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Account
