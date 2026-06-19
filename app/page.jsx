import Banner from '@/components/Banner';
import FeaturedPrompts from '@/components/FeaturedPrompts';
import TopCreators from '@/components/TopCreators';
import Reviews from '@/components/Reviews';

export default function HomePage() {
  return (
    <>
      <Banner />
      <FeaturedPrompts />
      <TopCreators />
      <Reviews />
    </>
  );
}
