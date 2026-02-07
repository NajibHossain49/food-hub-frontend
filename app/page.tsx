import AppStatistics from "./Components/AppStatistics";
import CTA from "./Components/CTA";
import FeaturedMeals from "./Components/FeaturedMeals";
import Features from "./Components/Features";
import Footer from "./Components/Footer";
import Hero from "./Components/Hero";
import HowItWorks from "./Components/HowItWorks";
import Navigation from "./Components/Navigation";
import TopProviders from "./Components/TopProviders";

export default function Home() {
  return (
    <main>
      <Navigation />
      <Hero />
      <Features />
      <HowItWorks />
      <FeaturedMeals />
      {/* <Menu /> */}
      <TopProviders />
      <AppStatistics />
      {/* <Testimonials /> */}
      <CTA />
      <Footer />
    </main>
  );
}
