import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
// Updated image list with new URLs added
const images = [
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Billaud-Simon_Chablis.jpg', alt: 'Billaud-Simon Chablis' },
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Domaine_de_la_Cote_Pinot_Noir_La_Cote_Sta._Rita_Hills.jpg', alt: 'Domaine de la Cote Pinot Noir' },
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Dom_Perignon_Champagne_Brut_Oenotheque.jpg', alt: 'Dom Perignon Champagne Brut Oenotheque' },
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Dujac_Clos_Saint-Denis_Grand_Cru.jpg', alt: 'Dujac Clos Saint-Denis' },
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Dunn_Cabernet_Sauvignon_Howell_Mountain.jpg', alt: 'Dunn Cabernet Sauvignon Howell Mountain' },
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Egly-Ouriet_Coteaux_Champenois_Rouge_Ambonnay.jpg', alt: 'Egly-Ouriet Coteaux Champenois' },
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Felsina_Fattoria_di_Chianti_Classico_Riserva_Rancia.jpg', alt: 'Felsina Chianti Classico Riserva Rancia' },
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Gaja_Barbaresco.jpg', alt: 'Gaja Barbaresco' },
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Gunderloch_Riesling_Grosses_Gewachs_Rothenberg.jpg', alt: 'Gunderloch Riesling Rothenberg' },
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Hope_Austin_Cabernet_Sauvignon_Paso_Robles.jpg', alt: 'Hope Austin Cabernet Sauvignon' },
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Hourglass_Sauvignon_Blanc_Napa_Valley.jpg', alt: 'Hourglass Sauvignon Blanc' },
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Keenan_Blend_Mernet_Napa_Valley.jpg', alt: 'Keenan Blend Mernet' },
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Keller_Franz_Pinot_Noir_Oberrotweiler_Eichberg.jpg', alt: 'Keller Franz Pinot Noir' },
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Pataille_Sylvain_Marsannay_LAncestrale.jpg', alt: 'Pataille Marsannay' },
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Verite_Red_Blend_La_Muse_Sonoma_County.jpg', alt: 'Verite Red Blend La Muse' },
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Anne_Gros_Richebourg_Grand_Cru.jpg', alt: 'Anne Gros Richebourg Grand Cru' },
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Arnoux-Lachaux_Nuits-Saint-Georges_Les_Poisets.jpg', alt: 'Arnoux-Lachaux Nuits-Saint-Georges Les Poisets' },
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Bollinger_Champagne_Brut_Special_Cuvee.jpg', alt: 'Bollinger Champagne Brut Special Cuvee' },
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Catena_Zapata_Malbec_Argentino_San_Carlos_Mendoza.jpg', alt: 'Catena Zapata Malbec Argentino' },
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Chateau_dYquem_Sauternes.jpg', alt: 'Chateau dYquem Sauternes' },
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Chezeaux_Jerome_Clos_de_Vougeot_Grand_Cru.jpg', alt: 'Chezeaux Jerome Clos de Vougeot Grand Cru' },
    { url: 'https://mygkcjoredvdkwcfcjze.supabase.co/storage/v1/object/public/wine-labels/Clair_Bruno_Chambertin_Clos_de_Beze_Grand_Cru.jpg', alt: 'Clair Bruno Chambertin Clos de Beze Grand Cru' }
];
const ImageCarousel = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const carouselRef = useRef(null);
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
    return (_jsxs("div", { className: "relative overflow-hidden py-8", style: { backgroundColor: isDark ? '#000' : '#fff' }, children: [_jsx("div", { className: "absolute left-0 top-0 bottom-0 w-16 z-10", style: {
                    background: `linear-gradient(to right, ${isDark ? '#000' : '#fff'} 0%, transparent 100%)`
                } }), _jsx("div", { ref: carouselRef, className: "flex space-x-4", style: {
                    display: 'flex',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                }, children: [...images, ...images].map((image, index) => (_jsx("div", { className: "flex-shrink-0 w-32 h-48 rounded-lg overflow-hidden shadow-lg", style: { backgroundColor: isDark ? 'black' : 'white' }, children: _jsx("img", { src: image.url, alt: image.alt, className: "w-full h-full object-contain" }) }, index))) }), _jsx("div", { className: "absolute right-0 top-0 bottom-0 w-16 z-10", style: {
                    background: `linear-gradient(to left, ${isDark ? '#000' : '#fff'} 0%, transparent 100%)`
                } })] }));
};
export default ImageCarousel;
