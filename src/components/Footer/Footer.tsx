import { useNavigate } from "react-router-dom";
import "./Footer.css";

function Footer() {
  let navigate = useNavigate();
  return (
    <div>
      <div className="about-us">
        <p>
          <strong>About</strong>
        </p>
        <button onClick={() => navigate("/about-us")}>About us</button> <br />
        <button>Career</button>
      </div>
      <div className="service-costumer">
        <p>
          <strong>Service Costumer</strong>
        </p>
        <button>Contact us</button>
      </div>
      <div className="how-it-works">
      <p>
          <strong>How it works?</strong>
        </p>
        <button>Guidelines </button> <br />
        <button>Blog</button>

      </div>
    </div>
  );
}

export default Footer;
