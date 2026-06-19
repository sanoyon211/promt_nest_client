import Banner from '@/components/Banner';
import FeaturedPrompts from '@/components/FeaturedPrompts';
import WhyChooseUs from '@/components/WhyChooseUs';
import TopCreators from '@/components/TopCreators';
import Reviews from '@/components/Reviews';
import FAQ from '@/components/FAQ';

export default function HomePage() {
  return (
    <>
      <Banner />
      <FeaturedPrompts />
      <WhyChooseUs />
      <TopCreators />
      <Reviews />
      <FAQ />
    </>
  );
}
