import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import './index.css'

const Footer = () => (
  <div className="footer-container">
    <div className="social-icons-container">
      <FaGoogle />
      <FaTwitter />
      <FaInstagram />
      <FaYoutube />
    </div>
    <p className="contact-us-text">Contact us</p>
  </div>
)

export default Footer
