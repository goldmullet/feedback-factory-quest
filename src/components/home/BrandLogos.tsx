
import { motion } from 'framer-motion';

const BrandLogos = () => {
  const brands = [
    {
      name: 'Legends',
      logo: '/lovable-uploads/2cde1c68-270f-4ea9-80ca-f4ae21e8f4c9.png',
      className: 'max-h-24 max-w-[200px]' // Using max-height and max-width instead of fixed height
    },
    {
      name: 'Brand 2',
      logo: 'https://placehold.co/200x80/f5f7ff/a6b4fc?text=Brand+2',
      className: 'max-h-8 max-w-[160px]'
    },
    {
      name: 'Brand 3',
      logo: 'https://placehold.co/200x80/f5f7ff/a6b4fc?text=Brand+3',
      className: 'max-h-8 max-w-[160px]'
    },
    {
      name: 'Brand 4',
      logo: 'https://placehold.co/200x80/f5f7ff/a6b4fc?text=Brand+4',
      className: 'max-h-8 max-w-[160px]'
    },
    {
      name: 'Brand 5',
      logo: 'https://placehold.co/200x80/f5f7ff/a6b4fc?text=Brand+5',
      className: 'max-h-8 max-w-[160px]'
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
      <div className="container-custom">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-500 dark:text-slate-400 text-lg">Trusted by innovative e-commerce brands</p>
        </motion.div>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
          {brands.map((brand, index) => (
            <motion.div 
              key={index} 
              className="flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <img 
                src={brand.logo} 
                alt={`${brand.name} logo`} 
                className={`${brand.className} object-contain`}
                onError={(e) => {
                  console.error(`Failed to load image: ${brand.logo}`);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandLogos;
