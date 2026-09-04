import Header from "./Header";

import HowSection from "./HowSection";
import OpenThisWeek from "./OpenThisWeek";
import SuccessStories from "./SuccessStories";
import Testimonies from "./Testimonies";
import Faq from "./Faq";
import Cta from "../../components/Cta";
import Footer from "../../components/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <HowSection />
      <OpenThisWeek />
      <SuccessStories />
      <Testimonies />
      <Faq />
      <Cta />
      <Footer />
    </>
  );
};

export default Home;
