import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay } from "swiper/modules";

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/autoplay';












export default function Category() {
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  const handleCategoryClick = (catName: string) => {
    if (!isAuthenticated) {
      navigate("/login")
    } else {
      navigate(`/category/${catName.toLowerCase()}`)
    }
  }

  return (
    <section className='py-16 px-6 md:px-20'>
      <div className="flex items-center gap-4 mb-10">
        <h2 className='text-3xl font-black text-white tracking-tight uppercase'>
          Explore <span className="text-[#fbbf24]">Categories</span>
        </h2>
        <div className="h-px flex-grow bg-white/10"></div>
      </div>

      <Swiper
        slidesPerView={4}
        spaceBetween={30}
        freeMode={true}
        grabCursor={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false
        }}
        breakpoints={{
          320: { slidesPerView: 2, spaceBetween: 15 },
          640: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 5, spaceBetween: 25 },
          1280: { slidesPerView: 7, spaceBetween: 30 },
        }}
        modules={[FreeMode, Autoplay]}
        className="mySwiper py-4"
      >
        {categories.map((cat, index) => (
          <SwiperSlide
            key={index}
            onClick={() => handleCategoryClick(cat.name)}
          >
            <div className='group flex flex-col items-center justify-center cursor-pointer w-full transition-all duration-300'>
              <div className="relative">
                <div className="absolute inset-0 bg-[#fbbf24] rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                <img
                  src={cat.image}
                  alt={cat.name}
                  className='relative z-10 mx-auto w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-white/10 group-hover:border-[#fbbf24] shadow-2xl transition-all duration-500 group-hover:scale-110'
                />
              </div>
              <p className='mt-4 text-center text-sm font-bold text-gray-400 group-hover:text-white uppercase tracking-widest transition-colors duration-300'>
                {cat.name}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}