import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaChevronDown, FaArrowRight } from 'react-icons/fa';
import ProductCard from '../../components/ProductCard';
import Loader from '../../components/Loader';
import RashiSection from '../Home/RashiSection';

const Rashi = () => {
  const [selectedRashi, setSelectedRashi] = useState('');
  const [rashiInfo, setRashiInfo] = useState(null);
  const [suggestedRudraksha, setSuggestedRudraksha] = useState([]);
  const [modalMukhi, setModalMukhi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allRudraksha, setAllRudraksha] = useState([]);
  const [rashiImages, setRashiImages] = useState({});
  const [mukhiImages, setMukhiImages] = useState({});
  const [imageLoading, setImageLoading] = useState(false);
  const [mukhiImagesLoaded, setMukhiImagesLoaded] = useState(() => new Set());
  const [modalImageLoading, setModalImageLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // All 12 Rashis (Zodiac Signs)
  const rashis = [
    { value: 'Aries', label: 'Aries (मेष)', english: 'Aries', hindi: 'मेष', planet: 'Mars', element: 'Fire' },
    { value: 'Taurus', label: 'Taurus (वृषभ)', english: 'Taurus', hindi: 'वृषभ', planet: 'Venus', element: 'Earth' },
    { value: 'Gemini', label: 'Gemini (मिथुन)', english: 'Gemini', hindi: 'मिथुन', planet: 'Mercury', element: 'Air' },
    { value: 'Cancer', label: 'Cancer (कर्क)', english: 'Cancer', hindi: 'कर्क', planet: 'Moon', element: 'Water' },
    { value: 'Leo', label: 'Leo (सिंह)', english: 'Leo', hindi: 'सिंह', planet: 'Sun', element: 'Fire' },
    { value: 'Virgo', label: 'Virgo (कन्या)', english: 'Virgo', hindi: 'कन्या', planet: 'Mercury', element: 'Earth' },
    { value: 'Libra', label: 'Libra (तुला)', english: 'Libra', hindi: 'तुला', planet: 'Venus', element: 'Air' },
    { value: 'Scorpio', label: 'Scorpio (वृश्चिक)', english: 'Scorpio', hindi: 'वृश्चिक', planet: 'Mars', element: 'Water' },
    { value: 'Sagittarius', label: 'Sagittarius (धनु)', english: 'Sagittarius', hindi: 'धनु', planet: 'Jupiter', element: 'Fire' },
    { value: 'Capricorn', label: 'Capricorn (मकर)', english: 'Capricorn', hindi: 'मकर', planet: 'Saturn', element: 'Earth' },
    { value: 'Aquarius', label: 'Aquarius (कुम्भ)', english: 'Aquarius', hindi: 'कुम्भ', planet: 'Saturn', element: 'Air' },
    { value: 'Pisces', label: 'Pisces (मीन)', english: 'Pisces', hindi: 'मीन', planet: 'Jupiter', element: 'Water' }
  ];

  // Rashi Information Database
  const rashiDetails = {
    'Aries': {
      name: 'Aries (मेष)',
      description: 'Aries is the first sign of the zodiac, representing new beginnings and leadership. People born under this sign are known for their courage, determination, and pioneering spirit.',
      characteristics: ['Courageous', 'Energetic', 'Independent', 'Impulsive', 'Confident'],
      rulingPlanet: 'Mars',
      element: 'Fire',
      luckyColors: ['Red', 'Orange'],
      luckyNumbers: [1, 8, 17]
    },
    'Taurus': {
      name: 'Taurus (वृषभ)',
      description: 'Taurus is an earth sign known for stability, patience, and a love for beauty and comfort. Taureans are reliable, practical, and enjoy the finer things in life.',
      characteristics: ['Stable', 'Patient', 'Reliable', 'Stubborn', 'Luxury-loving'],
      rulingPlanet: 'Venus',
      element: 'Earth',
      luckyColors: ['Green', 'Pink'],
      luckyNumbers: [2, 6, 24]
    },
    'Gemini': {
      name: 'Gemini (मिथुन)',
      description: 'Gemini is an air sign representing communication, curiosity, and adaptability. Geminis are known for their quick wit, versatility, and social nature.',
      characteristics: ['Communicative', 'Curious', 'Adaptable', 'Restless', 'Intelligent'],
      rulingPlanet: 'Mercury',
      element: 'Air',
      luckyColors: ['Yellow', 'Light Green'],
      luckyNumbers: [3, 12, 21]
    },
    'Cancer': {
      name: 'Cancer (कर्क)',
      description: 'Cancer is a water sign associated with emotions, intuition, and nurturing. Cancerians are deeply caring, protective, and have strong emotional intelligence.',
      characteristics: ['Emotional', 'Intuitive', 'Nurturing', 'Moody', 'Protective'],
      rulingPlanet: 'Moon',
      element: 'Water',
      luckyColors: ['Silver', 'White'],
      luckyNumbers: [4, 7, 28]
    },
    'Leo': {
      name: 'Leo (सिंह)',
      description: 'Leo is a fire sign representing creativity, leadership, and self-expression. Leos are confident, generous, and love being in the spotlight.',
      characteristics: ['Confident', 'Creative', 'Generous', 'Proud', 'Dramatic'],
      rulingPlanet: 'Sun',
      element: 'Fire',
      luckyColors: ['Gold', 'Orange'],
      luckyNumbers: [5, 19, 23]
    },
    'Virgo': {
      name: 'Virgo (कन्या)',
      description: 'Virgo is an earth sign known for attention to detail, practicality, and service. Virgos are analytical, organized, and strive for perfection.',
      characteristics: ['Analytical', 'Practical', 'Organized', 'Critical', 'Helpful'],
      rulingPlanet: 'Mercury',
      element: 'Earth',
      luckyColors: ['Navy Blue', 'Beige'],
      luckyNumbers: [6, 15, 24]
    },
    'Libra': {
      name: 'Libra (तुला)',
      description: 'Libra is an air sign representing balance, harmony, and relationships. Librans are diplomatic, fair-minded, and seek beauty and justice.',
      characteristics: ['Diplomatic', 'Balanced', 'Social', 'Indecisive', 'Aesthetic'],
      rulingPlanet: 'Venus',
      element: 'Air',
      luckyColors: ['Pink', 'Light Blue'],
      luckyNumbers: [7, 14, 21]
    },
    'Scorpio': {
      name: 'Scorpio (वृश्चिक)',
      description: 'Scorpio is a water sign known for intensity, passion, and transformation. Scorpios are mysterious, resourceful, and have deep emotional depth.',
      characteristics: ['Intense', 'Passionate', 'Resourceful', 'Secretive', 'Determined'],
      rulingPlanet: 'Mars',
      element: 'Water',
      luckyColors: ['Dark Red', 'Black'],
      luckyNumbers: [8, 13, 22]
    },
    'Sagittarius': {
      name: 'Sagittarius (धनु)',
      description: 'Sagittarius is a fire sign representing adventure, philosophy, and freedom. Sagittarians are optimistic, adventurous, and love exploring new horizons.',
      characteristics: ['Adventurous', 'Optimistic', 'Philosophical', 'Impatient', 'Honest'],
      rulingPlanet: 'Jupiter',
      element: 'Fire',
      luckyColors: ['Purple', 'Deep Blue'],
      luckyNumbers: [9, 12, 21]
    },
    'Capricorn': {
      name: 'Capricorn (मकर)',
      description: 'Capricorn is an earth sign known for ambition, discipline, and responsibility. Capricorns are hardworking, practical, and value tradition and structure.',
      characteristics: ['Ambitious', 'Disciplined', 'Responsible', 'Pessimistic', 'Traditional'],
      rulingPlanet: 'Saturn',
      element: 'Earth',
      luckyColors: ['Brown', 'Dark Green'],
      luckyNumbers: [10, 16, 26]
    },
    'Aquarius': {
      name: 'Aquarius (कुम्भ)',
      description: 'Aquarius is an air sign representing innovation, humanitarianism, and independence. Aquarians are original, progressive, and value freedom and equality.',
      characteristics: ['Innovative', 'Independent', 'Humanitarian', 'Detached', 'Eccentric'],
      rulingPlanet: 'Saturn',
      element: 'Air',
      luckyColors: ['Electric Blue', 'Silver'],
      luckyNumbers: [11, 22, 29]
    },
    'Pisces': {
      name: 'Pisces (मीन)',
      description: 'Pisces is a water sign associated with intuition, compassion, and spirituality. Pisceans are empathetic, artistic, and deeply connected to the spiritual realm.',
      characteristics: ['Compassionate', 'Intuitive', 'Artistic', 'Escapist', 'Dreamy'],
      rulingPlanet: 'Jupiter',
      element: 'Water',
      luckyColors: ['Sea Green', 'Lavender'],
      luckyNumbers: [12, 24, 33]
    }
  };

  // Mapping of Rashi to Suggested Rudraksha Mukhi (1-14 Mukhi)
  const rashiToRudrakshaMapping = {
    'Aries': ['1 Mukhi', '3 Mukhi', '11 Mukhi'],
    'Taurus': ['2 Mukhi', '6 Mukhi', '14 Mukhi'],
    'Gemini': ['3 Mukhi', '5 Mukhi', '12 Mukhi'],
    'Cancer': ['2 Mukhi', '4 Mukhi', '7 Mukhi'],
    'Leo': ['1 Mukhi', '5 Mukhi', '9 Mukhi'],
    'Virgo': ['6 Mukhi', '10 Mukhi', '14 Mukhi'],
    'Libra': ['2 Mukhi', '7 Mukhi', '11 Mukhi'],
    'Scorpio': ['3 Mukhi', '8 Mukhi', '13 Mukhi'],
    'Sagittarius': ['4 Mukhi', '9 Mukhi', '12 Mukhi'],
    'Capricorn': ['6 Mukhi', '10 Mukhi', '14 Mukhi'],
    'Aquarius': ['5 Mukhi', '11 Mukhi', '13 Mukhi'],
    'Pisces': ['4 Mukhi', '7 Mukhi', '12 Mukhi']
  };

  // Detailed information about each Mukhi (1-14)
  const mukhiDetails = {
    '1 Mukhi': {
      deity: 'Lord Shiva',
      planet: 'Sun',
      benefits: 'Enhances leadership qualities, removes ego, brings enlightenment, provides spiritual growth, and connects with the divine consciousness. Best for those seeking self-realization and inner peace.',
      description: 'The One Mukhi Rudraksha represents Lord Shiva himself. It is extremely rare and powerful, symbolizing unity and oneness with the universe. It helps in removing all obstacles and brings clarity of thought.',
      chakra: 'Crown Chakra (Sahasrara)',
      mantra: 'Om Namah Shivaya'
    },
    '2 Mukhi': {
      deity: 'Ardhanarishvara (Shiva-Parvati)',
      planet: 'Moon',
      benefits: 'Improves relationships, enhances harmony in partnerships, balances emotions, promotes marital bliss, and brings peace in family life. Ideal for couples and those seeking emotional stability.',
      description: 'The Two Mukhi Rudraksha represents the union of Shiva and Parvati. It symbolizes balance, harmony, and unity. It helps in maintaining healthy relationships and emotional equilibrium.',
      chakra: 'Third Eye Chakra (Ajna)',
      mantra: 'Om Namah Shivaya'
    },
    '3 Mukhi': {
      deity: 'Agni (Fire God)',
      planet: 'Mars',
      benefits: 'Removes past sins, eliminates guilt, enhances confidence, improves focus, and provides mental clarity. Helps in overcoming obstacles and negative thoughts.',
      description: 'The Three Mukhi Rudraksha is associated with Agni, the fire god. It purifies the mind and body, removes negative karma, and helps in spiritual purification.',
      chakra: 'Solar Plexus Chakra (Manipura)',
      mantra: 'Om Namah Shivaya'
    },
    '4 Mukhi': {
      deity: 'Brahma',
      planet: 'Mercury',
      benefits: 'Enhances intelligence, improves memory, increases creativity, boosts communication skills, and helps in learning. Perfect for students and professionals.',
      description: 'The Four Mukhi Rudraksha represents Lord Brahma, the creator. It enhances intellectual abilities, improves memory power, and helps in gaining knowledge and wisdom.',
      chakra: 'Throat Chakra (Vishuddha)',
      mantra: 'Om Namah Shivaya'
    },
    '5 Mukhi': {
      deity: 'Kalagni Rudra',
      planet: 'Jupiter',
      benefits: 'Provides overall health benefits, reduces stress, improves concentration, enhances meditation, and brings peace of mind. Most commonly used Rudraksha.',
      description: 'The Five Mukhi Rudraksha is the most common and versatile bead. It represents Kalagni Rudra and provides overall protection, health benefits, and spiritual growth.',
      chakra: 'Heart Chakra (Anahata)',
      mantra: 'Om Namah Shivaya'
    },
    '6 Mukhi': {
      deity: 'Kartikeya (Lord Murugan)',
      planet: 'Venus',
      benefits: 'Enhances focus, improves concentration, removes obstacles in education, helps in career growth, and provides mental clarity. Great for students and professionals.',
      description: 'The Six Mukhi Rudraksha represents Lord Kartikeya. It helps in improving focus, removing obstacles, and achieving success in education and career.',
      chakra: 'Third Eye Chakra (Ajna)',
      mantra: 'Om Namah Shivaya'
    },
    '7 Mukhi': {
      deity: 'Saptarishi (Seven Sages)',
      planet: 'Saturn',
      benefits: 'Brings wealth and prosperity, removes financial obstacles, enhances business success, provides protection from negative energies, and improves luck.',
      description: 'The Seven Mukhi Rudraksha represents the seven sages. It is known for bringing wealth, prosperity, and removing financial obstacles. It also provides protection from negative energies.',
      chakra: 'Root Chakra (Muladhara)',
      mantra: 'Om Namah Shivaya'
    },
    '8 Mukhi': {
      deity: 'Ganesha',
      planet: 'Rahu',
      benefits: 'Removes obstacles, provides success in endeavors, enhances intelligence, brings good fortune, and protects from negative influences. Ideal for new beginnings.',
      description: 'The Eight Mukhi Rudraksha represents Lord Ganesha, the remover of obstacles. It helps in overcoming challenges, achieving success, and brings good fortune.',
      chakra: 'Solar Plexus Chakra (Manipura)',
      mantra: 'Om Namah Shivaya'
    },
    '9 Mukhi': {
      deity: 'Durga (Navadurga)',
      planet: 'Ketu',
      benefits: 'Provides protection, removes fear, enhances courage, brings confidence, and protects from accidents and negative energies. Great for those facing challenges.',
      description: 'The Nine Mukhi Rudraksha represents the nine forms of Goddess Durga. It provides strong protection, removes fear, and enhances courage and confidence.',
      chakra: 'Root Chakra (Muladhara)',
      mantra: 'Om Namah Shivaya'
    },
    '10 Mukhi': {
      deity: 'Lord Vishnu',
      planet: 'Jupiter',
      benefits: 'Provides protection from all directions, removes negative karma, enhances spiritual growth, brings peace, and protects from black magic and evil eye.',
      description: 'The Ten Mukhi Rudraksha represents Lord Vishnu. It provides protection from all directions, removes negative karma, and enhances spiritual protection.',
      chakra: 'Crown Chakra (Sahasrara)',
      mantra: 'Om Namah Shivaya'
    },
    '11 Mukhi': {
      deity: 'Ekadasha Rudra (Eleven Forms of Shiva)',
      planet: 'Mars',
      benefits: 'Enhances leadership qualities, provides courage, removes obstacles, brings success in competitions, and protects from enemies. Ideal for leaders and warriors.',
      description: 'The Eleven Mukhi Rudraksha represents the eleven forms of Lord Shiva. It enhances leadership qualities, provides courage, and helps in overcoming challenges.',
      chakra: 'Solar Plexus Chakra (Manipura)',
      mantra: 'Om Namah Shivaya'
    },
    '12 Mukhi': {
      deity: 'Surya (Sun God)',
      planet: 'Sun',
      benefits: 'Enhances leadership, improves confidence, brings recognition, provides success in career, and enhances charisma. Perfect for those in leadership positions.',
      description: 'The Twelve Mukhi Rudraksha represents Lord Surya, the sun god. It enhances leadership qualities, brings recognition, and provides success in career and life.',
      chakra: 'Solar Plexus Chakra (Manipura)',
      mantra: 'Om Namah Shivaya'
    },
    '13 Mukhi': {
      deity: 'Kamadeva (God of Love)',
      planet: 'Venus',
      benefits: 'Enhances attractiveness, improves relationships, brings love and harmony, increases charm, and helps in finding a life partner. Ideal for relationship issues.',
      description: 'The Thirteen Mukhi Rudraksha represents Kamadeva, the god of love. It enhances attractiveness, improves relationships, and brings love and harmony in life.',
      chakra: 'Heart Chakra (Anahata)',
      mantra: 'Om Namah Shivaya'
    },
    '14 Mukhi': {
      deity: 'Lord Shiva (Mahadev)',
      planet: 'Saturn',
      benefits: 'Provides ultimate protection, enhances spiritual growth, brings enlightenment, removes all obstacles, and connects with divine consciousness. Most powerful Rudraksha.',
      description: 'The Fourteen Mukhi Rudraksha represents Lord Shiva in his most powerful form. It is extremely rare and provides ultimate protection, spiritual growth, and enlightenment.',
      chakra: 'Crown Chakra (Sahasrara)',
      mantra: 'Om Namah Shivaya'
    }
  };

  useEffect(() => {
    fetchAllRudraksha();
  }, []);

  const SUPABASE_STORAGE_BASE = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
  const buildImageUrl = (folder, file_name) =>
    SUPABASE_STORAGE_BASE
      ? `${SUPABASE_STORAGE_BASE}/storage/v1/object/public/GGIMG/StaticImg/${encodeURIComponent(folder)}/${encodeURIComponent(file_name)}`
      : null;

  useEffect(() => {
    const fetchZodiacImages = async () => {
      try {
        const res = await fetch(`${API_URL}/api/static-images?folder=Zodiac`);
        if (!res.ok) return;
        const data = await res.json();
        const byKey = (data || []).reduce((acc, item) => {
          const url = item.url || buildImageUrl(item.folder, item.file_name);
          if (url) acc[item.key] = url;
          return acc;
        }, {});
        setRashiImages(byKey);
      } catch (err) {
        console.error('Error fetching zodiac images:', err);
      }
    };
    fetchZodiacImages();
  }, [API_URL]);

  useEffect(() => {
    const fetchRudrakshaImages = async () => {
      try {
        const res = await fetch(`${API_URL}/api/static-images?folder=Rudrakshas`);
        if (!res.ok) return;
        const data = await res.json();
        const byKey = (data || []).reduce((acc, item) => {
          const url = item.url || buildImageUrl(item.folder, item.file_name);
          if (url) acc[item.key] = url;
          return acc;
        }, {});
        setMukhiImages(byKey);
      } catch (err) {
        console.error('Error fetching rudraksha images:', err);
      }
    };
    fetchRudrakshaImages();
  }, [API_URL]);

  useEffect(() => {
    if (selectedRashi) {
      setRashiInfo(rashiDetails[selectedRashi]);
      findSuggestedRudraksha();
      setImageLoading(true);
      setMukhiImagesLoaded(new Set());
    } else {
      setRashiInfo(null);
      setSuggestedRudraksha([]);
      setImageLoading(false);
      setMukhiImagesLoaded(new Set());
    }
  }, [selectedRashi, allRudraksha]);

  useEffect(() => {
    if (modalMukhi) setModalImageLoading(true);
    else setModalImageLoading(false);
  }, [modalMukhi]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (modalMukhi) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [modalMukhi]);

  const fetchAllRudraksha = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/products?category=Rudraksha`);
      if (!response.ok) throw new Error('Failed to fetch Rudraksha');
      const result = await response.json();
      if (result.success) {
        setAllRudraksha(result.data);
      }
    } catch (error) {
      console.error('Error fetching Rudraksha:', error);
    } finally {
      setLoading(false);
    }
  };

  const findSuggestedRudraksha = () => {
    if (!selectedRashi || !allRudraksha.length) return;

    const suggestedMukhi = rashiToRudrakshaMapping[selectedRashi] || [];
    const suggested = allRudraksha.filter(product => {
      // Check if product name or subcategory contains any of the suggested mukhi
      const productText = `${product.name} ${product.subcategory || ''}`.toLowerCase();
      return suggestedMukhi.some(mukhi => 
        productText.includes(mukhi.toLowerCase()) ||
        productText.includes(mukhi.replace(' Mukhi', '').toLowerCase() + ' mukhi') ||
        productText.includes(mukhi.replace(' Mukhi', '').toLowerCase() + 'mukhi')
      );
    });

    // If no exact match, try to find by mukhi number in subcategory
    if (suggested.length === 0) {
      const mukhiNumbers = suggestedMukhi.map(m => m.replace(' Mukhi', '').trim());
      const alternative = allRudraksha.filter(product => {
        const subcat = (product.subcategory || '').toLowerCase();
        return mukhiNumbers.some(num => 
          subcat.includes(num + ' mukhi') || 
          subcat.includes(num + 'mukhi') ||
          subcat.includes('mukhi ' + num)
        );
      });
      setSuggestedRudraksha(alternative);
    } else {
      setSuggestedRudraksha(suggested);
    }
  };

  const calculatePricing = (price) => {
    const discountPercent = 25;
    const originalPrice = price / (1 - discountPercent / 100);
    return {
      currentPrice: price,
      originalPrice: originalPrice,
      discount: discountPercent
    };
  };

  const getReviewCount = (productId) => {
    return 5 + (productId % 3);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50/30 to-white">
      <div className="w-full max-w-[1920px] mx-auto">
        {/* Rashi section – moving zodiac row only (no CTA on this page) */}
        <RashiSection hideCta />

        <div className="px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
              Find Your Rashi Rudraksha
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Discover the perfect Rudraksha beads for your zodiac sign
            </p>
          </div>

          {/* Custom Rashi dropdown */}
          <div className="mb-8 max-w-xl mx-auto" ref={dropdownRef}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Your Rashi (Zodiac Sign)
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-primary/30 bg-white text-left shadow-sm hover:border-primary hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {selectedRashi ? (
                  <>
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/30 shrink-0 bg-gray-100">
                      <img
                        src={rashiImages[selectedRashi] || `https://via.placeholder.com/40?text=${selectedRashi.slice(0, 2)}`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-gray-800">
                      {rashis.find((r) => r.value === selectedRashi)?.label || selectedRashi}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-500 font-medium">Choose your zodiac sign</span>
                )}
                <FaChevronDown className={`ml-auto w-5 h-5 text-primary shrink-0 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border-2 border-primary/20 bg-white shadow-xl z-50 overflow-hidden max-h-[320px] overflow-y-auto">
                  {rashis.map((rashi) => (
                    <button
                      key={rashi.value}
                      type="button"
                      onClick={() => {
                        setSelectedRashi(rashi.value);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-primary/10 transition-colors border-b border-gray-100 last:border-0 ${selectedRashi === rashi.value ? 'bg-primary/10' : ''}`}
                    >
                      <div className="w-9 h-9 rounded-full overflow-hidden border border-primary/20 shrink-0 bg-gray-100">
                        <img
                          src={rashiImages[rashi.value] || `https://via.placeholder.com/36?text=${rashi.value.slice(0, 2)}`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-gray-800">{rashi.label}</span>
                      {selectedRashi === rashi.value && (
                        <span className="ml-auto text-xs font-semibold text-primary">Selected</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        {/* Rashi Information with Image */}
        {rashiInfo && (
          <div className="mb-10 max-w-7xl mx-auto px-1">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-primary/20 bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[320px]">
                {/* Rashi Image */}
                <div className="lg:order-1 relative min-h-[260px] sm:min-h-[320px] bg-linear-to-br from-primary/20 to-primary/5">
                  {imageLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-primary/5">
                      <Loader size="lg" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />
                  <img
                    src={rashiImages[selectedRashi] || `https://via.placeholder.com/400x300?text=${selectedRashi || 'Rashi'}`}
                    alt={rashiInfo.name}
                    className={`w-full h-full object-cover min-h-[260px] sm:min-h-[320px] transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setImageLoading(false)}
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/400x300?text=${selectedRashi || 'Rashi'}`;
                      setImageLoading(false);
                    }}
                  />
                </div>

                {/* Rashi Details */}
                <div className="p-6 sm:p-8 lg:order-2 flex flex-col justify-center">
                  <div className="border-l-4 border-primary pl-4 mb-4">
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary mb-1">
                      {rashiInfo.name}
                    </h2>
                    <div className="h-0.5 w-12 bg-primary/60 rounded-full" />
                  </div>
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-6">
                    {rashiInfo.description}
                  </p>

                  <div className="space-y-6">
                    {/* Characteristics */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-primary mb-3">Key Characteristics</h3>
                      <div className="flex flex-wrap gap-2.5">
                        {rashiInfo.characteristics.map((char, idx) => (
                          <span
                            key={idx}
                            className="px-4 py-2 bg-primary/5 text-primary rounded-full text-base font-medium border border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-colors"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Details grid */}
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-primary mb-3">Rashi Details</h3>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="rounded-lg bg-gray-50 border border-gray-100 p-4">
                          <span className="block text-sm font-medium text-primary/90 mb-1">Ruling Planet</span>
                          <span className="text-base font-semibold text-gray-800">{rashiInfo.rulingPlanet}</span>
                        </div>
                        <div className="rounded-lg bg-gray-50 border border-gray-100 p-4">
                          <span className="block text-sm font-medium text-primary/90 mb-1">Element</span>
                          <span className="text-base font-semibold text-gray-800">{rashiInfo.element}</span>
                        </div>
                        <div className="rounded-lg bg-gray-50 border border-gray-100 p-4">
                          <span className="block text-sm font-medium text-primary/90 mb-1">Lucky Colors</span>
                          <span className="text-base font-semibold text-gray-800">{rashiInfo.luckyColors.join(', ')}</span>
                        </div>
                        <div className="rounded-lg bg-gray-50 border border-gray-100 p-4">
                          <span className="block text-sm font-medium text-primary/90 mb-1">Lucky Numbers</span>
                          <span className="text-base font-semibold text-gray-800">{rashiInfo.luckyNumbers.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Rudraksha Cards (Modal) */}
        {selectedRashi && rashiToRudrakshaMapping[selectedRashi] && (
          <div className="mb-8">
            <div className="mb-5 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-1">
                Recommended Rudraksha for {rashiInfo?.name}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-8 max-w-4xl mx-auto">
              {rashiToRudrakshaMapping[selectedRashi].map((mukhi) => {
                const mukhiInfo = mukhiDetails[mukhi];

                return (
                  <div
                    key={mukhi}
                    onClick={() => setModalMukhi(mukhi)}
                    className="bg-linear-to-br from-primary/10 to-primary/5 rounded-xl shadow-md border-2 border-primary/30 overflow-hidden hover:shadow-lg hover:border-primary transition-all duration-300 cursor-pointer"
                  >
                    <div className="aspect-square bg-primary/5 overflow-hidden relative">
                      {!mukhiImagesLoaded.has(mukhi) && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-primary/10">
                          <Loader size="sm" />
                        </div>
                      )}
                      <img
                        src={mukhiImages[mukhi] || `https://via.placeholder.com/400?text=${mukhi.replace(' ', '+')}`}
                        alt={mukhi}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${mukhiImagesLoaded.has(mukhi) ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setMukhiImagesLoaded((prev) => new Set(prev).add(mukhi))}
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/400?text=${mukhi.replace(' ', '+')}`;
                          setMukhiImagesLoaded((prev) => new Set(prev).add(mukhi));
                        }}
                      />
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-primary text-white text-xs sm:text-sm font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow">
                        {mukhi}
                      </div>
                    </div>

                    <div className="p-3 sm:p-4">
                      <h3 className="text-sm sm:text-base font-bold text-primary mb-2 line-clamp-1">{mukhi}</h3>
                      <div className="space-y-1 text-xs sm:text-sm text-gray-700">
                        <p className="truncate"><span className="font-medium text-primary">Deity:</span> {mukhiInfo.deity}</p>
                        <p className="truncate"><span className="font-medium text-primary">Planet:</span> {mukhiInfo.planet}</p>
                        <p className="hidden sm:block truncate"><span className="font-medium text-primary">Chakra:</span> {mukhiInfo.chakra}</p>
                      </div>
                      <button type="button" className="mt-3 w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-xs sm:text-sm font-semibold">
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal for Rudraksha Details */}
        {modalMukhi && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md overflow-hidden"
            onClick={() => setModalMukhi(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8 max-h-[calc(100vh-4rem)] overflow-y-auto border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const mukhiInfo = mukhiDetails[modalMukhi];
                return (
                  <>
                    {/* Hero image with title overlay */}
                    <div className="relative aspect-4/3 sm:aspect-5/3 bg-gray-100 overflow-hidden">
                      {modalImageLoading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100">
                          <Loader size="lg" />
                        </div>
                      )}
                      <img
                        src={mukhiImages[modalMukhi] || `https://via.placeholder.com/600x360?text=${modalMukhi.replace(' ', '+')}`}
                        alt={modalMukhi}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${modalImageLoading ? 'opacity-0' : 'opacity-100'}`}
                        onLoad={() => setModalImageLoading(false)}
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/600x360?text=${modalMukhi.replace(' ', '+')}`;
                          setModalImageLoading(false);
                        }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                      <h2 id="modal-title" className="absolute bottom-0 left-0 right-0 p-6 font-heading text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                        {modalMukhi} Rudraksha
                      </h2>
                      <button
                        onClick={() => setModalMukhi(null)}
                        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/95 shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:scale-105 transition-transform"
                        aria-label="Close"
                      >
                        <FaTimes className="text-lg" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8">
                      {/* Info pills - high contrast for readability */}
                      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-gray-200 text-base">
                          <span className="text-gray-700 font-bold shrink-0">Deity:</span>
                          <span className="text-gray-900 font-medium">{mukhiInfo.deity}</span>
                        </span>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-gray-200 text-base">
                          <span className="text-gray-700 font-bold shrink-0">Planet:</span>
                          <span className="text-gray-900 font-medium">{mukhiInfo.planet}</span>
                        </span>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-gray-200 text-base">
                          <span className="text-gray-700 font-bold shrink-0">Chakra:</span>
                          <span className="text-gray-900 font-medium">{mukhiInfo.chakra}</span>
                        </span>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary border-2 border-primary text-white text-base">
                          <span className="font-bold shrink-0">Mantra:</span>
                          <span className="font-medium">{mukhiInfo.mantra}</span>
                        </span>
                      </div>

                      {/* Description - clear heading and body contrast */}
                      <div className="mb-6 pl-4 border-l-4 border-primary">
                        <h3 className="font-heading text-base sm:text-lg font-bold text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-800 leading-relaxed text-base sm:text-[17px]">{mukhiInfo.description}</p>
                      </div>

                      {/* Benefits */}
                      <div className="mb-8 pl-4 border-l-4 border-primary">
                        <h3 className="font-heading text-base sm:text-lg font-bold text-gray-900 mb-2">Benefits</h3>
                        <p className="text-gray-800 leading-relaxed text-base sm:text-[17px]">{mukhiInfo.benefits}</p>
                      </div>

                      {/* Close - solid button for visibility */}
                      <button
                        onClick={() => setModalMukhi(null)}
                        className="w-full py-4 px-6 rounded-2xl bg-primary text-white font-bold text-base hover:bg-primary/90 transition-colors shadow-lg"
                      >
                        Close
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Buy Cards - Actual Products */}
        {selectedRashi && (
          <div className="mb-8">
            <div className="mb-4 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-primary mb-1">
                Available Rudraksha Products
              </h2>
              <p className="text-sm text-gray-600">
                Purchase the recommended Rudraksha beads for your rashi
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader size="lg" />
              </div>
            ) : suggestedRudraksha.length === 0 ? (
              <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-6 text-center">
                <p className="text-gray-700">
                  No Rudraksha products found matching the recommended mukhi for your rashi.
                  <br />
                  <span className="text-sm text-primary font-medium mt-2 block">
                    Recommended: {rashiToRudrakshaMapping[selectedRashi]?.join(', ')}
                  </span>
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {suggestedRudraksha.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      variant="rashi"
                      calculatePricing={calculatePricing}
                      getReviewCount={getReviewCount}
                    />
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link
                    to="/rudraksha"
                    className="inline-flex items-center gap-2 py-3 px-5 rounded-xl bg-primary/10 border-2 border-primary/30 text-primary font-semibold text-sm hover:bg-primary hover:text-white hover:border-primary transition-colors"
                  >
                    Explore more Rudraksha
                    <FaArrowRight className="text-sm animate-arrow-nudge" />
                  </Link>
                </div>
              </>
            )}
          </div>
        )}

        {/* How it works - when no rashi selected */}
        {!selectedRashi && (
          <div className="max-w-5xl mx-auto mt-14 mb-6">
            <div className="text-center mb-10">
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                How It Works
              </h3>
              <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto">
                Find your ideal Rudraksha in three simple steps
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
              {/* Connector line on desktop */}
              <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-primary/30 pointer-events-none" aria-hidden />

              <div className="relative bg-white rounded-2xl p-6 sm:p-7 shadow-lg border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-4 shadow-md">
                  1
                </div>
                <h4 className="font-heading text-lg font-bold text-gray-900 mb-2">Select Your Rashi</h4>
                <p className="text-gray-600 text-base leading-relaxed">
                  Choose your zodiac sign from the dropdown above
                </p>
              </div>

              <div className="relative bg-white rounded-2xl p-6 sm:p-7 shadow-lg border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-4 shadow-md">
                  2
                </div>
                <h4 className="font-heading text-lg font-bold text-gray-900 mb-2">Learn About Your Rashi</h4>
                <p className="text-gray-600 text-base leading-relaxed">
                  Discover detailed information about your zodiac sign
                </p>
              </div>

              <div className="relative bg-white rounded-2xl p-6 sm:p-7 shadow-lg border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-4 shadow-md">
                  3
                </div>
                <h4 className="font-heading text-lg font-bold text-gray-900 mb-2">Get Recommendations</h4>
                <p className="text-gray-600 text-base leading-relaxed">
                  Find the perfect Rudraksha beads recommended for your rashi
                </p>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Rashi;
