import FAQAccordion from '../Home/FAQAccordion'
import Breadcrumbs, { ExploreLinks } from '../../components/Breadcrumbs'

const Faq = () => (
  <div className="bg-[#FFFAEB]">
    <div className="mx-auto w-[92%] max-w-3xl pt-6">
      <Breadcrumbs items={[{ name: 'Frequently asked questions', href: '/faq' }]} />
      <ExploreLinks />
      <h1 className="font-heading text-3xl font-bold text-stone-900 md:text-4xl">Frequently asked questions</h1>
      <p className="mt-3 text-sm leading-relaxed text-stone-700 md:text-base">
        Answers about Nepali Rudraksha, Tulsi malas, Karungali, aura sprays, cash on delivery, and returns from the Noida studio.
      </p>
    </div>
    <FAQAccordion />
  </div>
)

export default Faq
