import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/no-drag.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

interface CarouselImage {
  url: string;
  alt: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const storageUrl = `${supabaseUrl}/storage/v1/object/public/wine-labels`;

const images: CarouselImage[] = [
  { url: `${storageUrl}/Billaud-Simon_Chablis.jpg`, alt: 'Billaud-Simon Chablis' },
  { url: `${storageUrl}/Domaine_de_la_Cote_Pinot_Noir_La_Cote_Sta._Rita_Hills.jpg`, alt: 'Domaine de la Cote Pinot Noir' },
  { url: `${storageUrl}/Dom_Perignon_Champagne_Brut_Oenotheque.jpg`, alt: 'Dom Perignon Champagne Brut Oenotheque' },
  { url: `${storageUrl}/Dujac_Clos_Saint-Denis_Grand_Cru.jpg`, alt: 'Dujac Clos Saint-Denis' },
  { url: `${storageUrl}/Dunn_Cabernet_Sauvignon_Howell_Mountain.jpg`, alt: 'Dunn Cabernet Sauvignon Howell Mountain' },
  { url: `${storageUrl}/Egly-Ouriet_Coteaux_Champenois_Rouge_Ambonnay.jpg`, alt: 'Egly-Ouriet Coteaux Champenois' },
  { url: `${storageUrl}/Felsina_Fattoria_di_Chianti_Classico_Riserva_Rancia.jpg`, alt: 'Felsina Chianti Classico Riserva Rancia' },
  { url: `${storageUrl}/Gaja_Barbaresco.jpg`, alt: 'Gaja Barbaresco' },
  { url: `${storageUrl}/Gunderloch_Riesling_Grosses_Gewachs_Rothenberg.jpg`, alt: 'Gunderloch Riesling Rothenberg' },
  { url: `${storageUrl}/Hope_Austin_Cabernet_Sauvignon_Paso_Robles.jpg`, alt: 'Hope Austin Cabernet Sauvignon' },
  { url: `${storageUrl}/Hourglass_Sauvignon_Blanc_Napa_Valley.jpg`, alt: 'Hourglass Sauvignon Blanc' },
  { url: `${storageUrl}/Keenan_Blend_Mernet_Napa_Valley.jpg`, alt: 'Keenan Blend Mernet' },
  { url: `${storageUrl}/Keller_Franz_Pinot_Noir_Oberrotweiler_Eichberg.jpg`, alt: 'Keller Franz Pinot Noir' },
  { url: `${storageUrl}/Pataille_Sylvain_Marsannay_LAncestrale.jpg`, alt: 'Pataille Marsannay' },
  { url: `${storageUrl}/Verite_Red_Blend_La_Muse_Sonoma_County.jpg`, alt: 'Verite Red Blend La Muse' },
  { url: `${storageUrl}/Anne_Gros_Richebourg_Grand_Cru.jpg`, alt: 'Anne Gros Richebourg Grand Cru' },
  { url: `${storageUrl}/Arnoux-Lachaux_Nuits-Saint-Georges_Les_Poisets.jpg`, alt: 'Arnoux-Lachaux Nuits-Saint-Georges Les Poisets' },
  { url: `${storageUrl}/Bollinger_Champagne_Brut_Special_Cuvee.jpg`, alt: 'Bollinger Champagne Brut Special Cuvee' },
  { url: `${storageUrl}/Catena_Zapata_Malbec_Argentino_San_Carlos_Mendoza.jpg`, alt: 'Catena Zapata Malbec Argentino' },
  { url: `${storageUrl}/Chateau_dYquem_Sauternes.jpg`, alt: 'Chateau dYquem Sauternes' },
  { url: `${storageUrl}/Chezeaux_Jerome_Clos_de_Vougeot_Grand_Cru.jpg`, alt: 'Chezeaux Jerome Clos de Vougeot Grand Cru' },
  { url: `${storageUrl}/Clair_Bruno_Chambertin_Clos_de_Beze_Grand_Cru.jpg`, alt: 'Clair Bruno Chambertin Clos de Beze Grand Cru' }
];

const ImageCarousel: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollImages = () => {
      if (carouselRef.current) {
        carouselRef.current.scrollLeft += 1; // Adjust speed here if needed
        if (carouselRef.current.scrollLeft >= carouselRef.current.scrollWidth / 2) {
          carouselRef.current.scrollLeft = 0;
        }
      }
    };

    const intervalId = setInterval(scrollImages, 20); // Adjust timing here for smoothness
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative overflow-hidden py-8" style={{ backgroundColor: isDark ? '#000' : '#fff' }}>
      {/* Left Blur */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10" style={{
        background: `linear-gradient(to right, ${isDark ? '#000' : '#fff'} 0%, transparent 100%)`
      }} />

      {/* Carousel */}
      <div
        ref={carouselRef}
        className="flex space-x-4"
        style={{
          display: 'flex',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {[...images, ...images].map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-32 h-48 rounded-lg overflow-hidden shadow-lg"
            style={{ backgroundColor: isDark ? 'black' : 'white' }}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-contain no-drag-img"
            />
          </div>
        ))}
      </div>

      {/* Right Blur */}
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10" style={{
        background: `linear-gradient(to left, ${isDark ? '#000' : '#fff'} 0%, transparent 100%)`
      }} />
    </div>
  );
};

export default ImageCarousel;