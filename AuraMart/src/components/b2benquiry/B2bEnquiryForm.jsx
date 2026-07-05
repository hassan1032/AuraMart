
import { useState } from "react";

const B2bEnquiryForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    code: "+44",
    contact: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
    onClose();
  };

  return (
    <div className="b2b-modal-wrapper">
      <div className="b2b-modal">
        <button className="b2b-close-btn" onClick={onClose}>×</button>
        <h3>B2B Inquiry</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" onChange={handleChange} value={formData.name} />
          <div className="b2b-input-row">
            <input type="email" name="email" placeholder="Email address" onChange={handleChange} value={formData.email} />
            <select name="code" onChange={handleChange} value={formData.code}>
              <option value="+44">+44</option>
              <option value="+91">+91</option>
            </select>
            <input type="text" name="contact" placeholder="Contact Number" onChange={handleChange} value={formData.contact} />
          </div>
          <textarea name="message" placeholder="Write your message here." onChange={handleChange} value={formData.message} />
          <div className="b2b-buttons">
            <button type="button" className="b2b-close" onClick={onClose}>Close</button>
            <button type="submit" className="b2b-submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default B2bEnquiryForm;
