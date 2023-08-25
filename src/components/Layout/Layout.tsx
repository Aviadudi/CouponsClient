import AsideMenu from "../AsideMenu/AsideMenu";
import CouponsContainer from "../CouponsContainer/CouponsContainer";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import Login from "../Login/Login";
import "./Layout.css";

function Layout() {
  return(
  <section className="layout">
    <header className="header">
      <Header />
    </header>

    <aside className="aside">
        <AsideMenu/>
    </aside>

    <main className="main">
        <CouponsContainer/>
    </main>

    <footer className="footer">
        <Footer/>
    </footer>
  </section>
  );
}

export default Layout;