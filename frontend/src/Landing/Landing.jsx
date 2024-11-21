import Header from './Header';
import Hero from './Hero';
import About from './About';
import Steps from './Steps';
import Requirements from './Requirements';
import Testimonial from './Testimonials';
import Forms from './Forms';
import Footer from './Footer';
import Terminos from './Pages/Terminos';
import Priv from './Pages/Priv';
import FAQ from './Pages/FAQ';
import { Route, Switch } from 'react-router-dom';

function MainContent() {
  return (
    <>
      <div id="inicio"><Hero /></div>
      <div id="sobre-nosotros"><About /></div>
      <div id="caracteristicas"><Steps /></div>
      <div id="requisitos"><Requirements /></div>
      <div id="testimonial"><Testimonial /></div>
      <div id="contacto"><Forms /></div>
    </>
  );
}

function Landing() {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={MainContent} />
        <Route path="/terminos" component={Terminos} />
        <Route path="/priv" component={Priv} />
        <Route path="/FAQ" component={FAQ} />
      </Switch>
      <Footer />
    </div>
  );
}

export default Landing;