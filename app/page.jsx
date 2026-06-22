import Banner from '@/components/Banner';
import FeaturedPrompts from '@/components/FeaturedPrompts';
import WhyChooseUs from '@/components/WhyChooseUs';
import PromptEssentials from '@/components/PromptEssentials';
import TopCreators from '@/components/TopCreators';
import Reviews from '@/components/Reviews';
import FAQ from '@/components/FAQ';
import CallToAction from '@/components/CallToAction';

export default function HomePage() {
  return (
    <>
      <Banner />
      <FeaturedPrompts />
      <WhyChooseUs />
      <PromptEssentials />
      <TopCreators />
      <Reviews />
      <FAQ />
      <CallToAction />
    </>
  );
}
