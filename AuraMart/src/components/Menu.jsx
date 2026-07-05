

import {
  FaTimes,
  FaInstagram,
  FaPinterest,
  FaYoutube,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import B2bEnquiryForm from "./b2benquiry/B2bEnquiryForm";
import { useState } from "react";

const Menu = ({ onClose }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  function enquiryForm() {
    navigate("/contact-b2b");
  }

  // Function to apply active styles
  const linkStyle = ({ isActive }) => ({
    color: isActive ? "#B1852E" : "#000",
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: "none",
  });

  return (
    <div className="menu-overlay">
      <div className="menu-container">
        <div className="menu-header">
          <div className="logo" style={{ marginLeft: "-20px" }}>
            <NavLink to="/" className="logo-link">
              <img
                src="https://www.nickimacfarlane.com/wp-content/themes/nickimacfarlane-2014/images/logo.png"
                style={{ height: "80px" }}
                alt="logo"
              />
            </NavLink>
          </div>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <ul className="menu-links">
          <li>
            <NavLink to="/" onClick={onClose} style={linkStyle}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/collections" onClick={onClose} style={linkStyle}>
              <strong>Collections</strong>
            </NavLink>
          </li>
          <hr />
          <li>
            <NavLink to="/flower-girls" onClick={onClose} style={linkStyle}>
              Flower Girls &amp; Bridesmaids
            </NavLink>
          </li>
          <li>
            <NavLink to="/boutique" onClick={onClose} style={linkStyle}>
              Boutique Collection
            </NavLink>
          </li>
          <li>
            <NavLink to="/party" onClick={onClose} style={linkStyle}>
              Party Collection
            </NavLink>
          </li>
          <li>
            <NavLink to="/communion" onClick={onClose} style={linkStyle}>
              First Holy Communion
            </NavLink>
          </li>
          <li>
            <NavLink to="/pageboys" onClick={onClose} style={linkStyle}>
              Ready to Wear Pageboys
            </NavLink>
          </li>
          <li>
            <NavLink to="/adult-bridesmaids" onClick={onClose} style={linkStyle}>
              Adult Bridesmaid Dresses
            </NavLink>
          </li>
          <li>
            <NavLink to="/bespoke" onClick={onClose} style={linkStyle}>
              Bespoke Service
            </NavLink>
          </li>
          <li>
            <NavLink to="/christening" onClick={onClose} style={linkStyle}>
              Christening
            </NavLink>
          </li>

          <hr />
          <li>
            <NavLink to="/accessories" onClick={onClose} style={linkStyle}>
              Accessories
            </NavLink>
          </li>
          <li>
            <NavLink to="/events" onClick={onClose} style={linkStyle}>
              Events
            </NavLink>
          </li>
          <li>
            <NavLink to="/stockist" onClick={onClose} style={linkStyle}>
              Stockist
            </NavLink>
          </li>
        </ul>

        <button className="b2b-button" onClick={() => setShowModal(true)}>
          Contact for B2B Inquiry
        </button>

        {showModal && <B2bEnquiryForm onClose={() => setShowModal(false)} />}

        <div className="menu-footer">
          <div className="footer-links">
            <NavLink to="/about" onClick={onClose} style={linkStyle}>
              About Us
            </NavLink>{" "}
            |{" "}
            <NavLink to="/careers" onClick={onClose} style={linkStyle}>
              Careers
            </NavLink>{" "}
            |{" "}
            <NavLink to="/blogs" onClick={onClose} style={linkStyle}>
              Blogs
            </NavLink>{" "}
            |{" "}
            <NavLink to="/media" onClick={onClose} style={linkStyle}>
              Media
            </NavLink>{" "}
            |{" "}
            <NavLink to="/videos" onClick={onClose} style={linkStyle}>
              Videos
            </NavLink>{" "}
            |{" "}
            <NavLink to="/track-orders" onClick={onClose} style={linkStyle}>
              Track Orders
            </NavLink>
          </div>
          <div className="footer-links">
            <NavLink to="/testimonials" onClick={onClose} style={linkStyle}>
              Testimonials
            </NavLink>{" "}
            |{" "}
            <NavLink to="/contact" onClick={onClose} style={linkStyle}>
              Contact Us
            </NavLink>{" "}
            |{" "}
            <NavLink to="/privacy-policy" onClick={onClose} style={linkStyle}>
              Privacy Policy
            </NavLink>{" "}
            |{" "}
            <NavLink to="/terms" onClick={onClose} style={linkStyle}>
              Terms & Conditions
            </NavLink>
          </div>

          <div className="socials">
            <FaInstagram />
            <FaPinterest />
            <FaTwitter />
            <FaFacebook />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
