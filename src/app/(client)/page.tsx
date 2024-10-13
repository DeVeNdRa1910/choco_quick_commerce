import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroImagesSlider from "./components/HeroImages";
import Products from "./components/Products";
import SpecialProducts from "./components/SpecialProducts";
import { BackgroundBeamsWithCollision } from "@/components/ui/BackgroundBeamsWithCollisionDemo";

export default function Home() {
  return (
    <>
      <Header />
      <HeroImagesSlider />
      <BackgroundBeamsWithCollision>
        <SpecialProducts />
      </BackgroundBeamsWithCollision>
      <Products />
      {/* <Coupon /> use it just before the payment */}
      <Footer />
    </>
  );
}
