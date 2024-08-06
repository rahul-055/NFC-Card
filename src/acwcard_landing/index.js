import React, { Component } from 'react'
import AOS from 'aos';
import "aos/dist/aos.css";
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import Header from "./layouts/header";
import Footer from "./layouts/footer";
import Banner from './components/banner';
import KeyFeature from './components/keyfeature';
import Work from './components/work';
import Shop from './components/shop';
import Customer from './components/customer';
import Enquiry from './components/enquiry';

class Index extends Component {
  componentDidMount() {
    document.title = 'ACW CARD - A new-gen versatile digital card'
    document.description = 'ACW Card enables you to share your business and personal profiles along with digital uploads of key documents to strengthen your portfolio.'
    AOS.init();
  }
  render() {
    return (
      <div style={{ background: '#fff' }}>
        <Header />
        <Banner />
        <KeyFeature />
        <Work />
        <Shop />
        <Customer />
        <Enquiry />
        <Footer />
      </div>
    );
  }
}

export default Index;
