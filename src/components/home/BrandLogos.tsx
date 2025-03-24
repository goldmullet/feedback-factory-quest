
const BrandLogos = () => {
  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
      <div className="container-custom">
        <div className="text-center mb-10">
          <p className="text-slate-500 dark:text-slate-400 text-lg">Trusted by innovative e-commerce brands</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
          {['Brand 1', 'Brand 2', 'Brand 3', 'Brand 4', 'Brand 5'].map((brand, index) => (
            <div key={index} className="h-8 flex items-center">
              <div className="text-slate-400 dark:text-slate-500 font-semibold">{brand}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandLogos;
