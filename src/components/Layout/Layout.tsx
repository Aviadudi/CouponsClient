import { BrowserRouter, Route, Routes } from "react-router-dom";
import CouponsContainer from "../CouponsContainer/CouponsContainer";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import UpperMenu from "../UpperMenu/UpperMenu";
import "./Layout.css";
import Purchases from "../Purchases/Purchases";
import AboutUs from "../About/AboutUs";
import UsersPage from "../UsersPage/UsersPage";

function Layout() {
  return (
    <section className="layout">
      <header className="header">
        <Header />
      </header>

      <menu className="menu">
        <UpperMenu />
      </menu>

      <main className="main">
        <Routes>
          <Route path="/" element={<CouponsContainer />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/users" element={<UsersPage/>}/>
          {/* <CouponsContainer /> */}
        </Routes>
      </main>

      <footer className="footer">
        <Footer />
      </footer>
    </section>
  );
}

export default Layout;
