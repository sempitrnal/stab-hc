import useGlobalLoadingStore from "@/stores/loading";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Slider from "react-slick";
const ProductCarousel = ({
  products,
  setClickedProductSlug,
}: {
  products: {
    name: string;
    slug: string;
    price: number;
    images: { url: string }[];
    preorder?: boolean;
  }[];
  setClickedProductSlug: (slug: string) => void;
}) => {
  const router = useRouter();

  const settings = {
    dots: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    infinite: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 2 },
      },
    ],
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const slider = useRef<Slider>(null);
  const handleAfterChange = (current: number) => {
    setActiveIndex(current);
  };
  const totalSlides = products.length; // or dynamic if slideToShow > 1
  const slidesToShow = 3; // match this with your slider config
  const lastIndex = totalSlides - slidesToShow;
  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < lastIndex;
  const renderArrows = () => (
    <div className="">
      {/* Left Arrow */}
      <div
        onClick={() => hasPrev && slider.current?.slickPrev()}
        className={`
        absolute top-1/2 -translate-y-[40px] z-10
        ${hasPrev ? "cursor-pointer hover:opacity-50" : "cursor-default opacity-100"}
        left-[-20px] md:left-[-10px]
        transition-all duration-300 ease-in-out
      `}
      >
        <IoIosArrowBack
          className={`text-[1.5rem] ${
            hasPrev ? "text-black" : "text-neutral-400"
          } transition-all duration-300 ease-in-out`}
        />
      </div>

      {/* Right Arrow */}
      <div
        onClick={() => hasNext && slider.current?.slickNext()}
        className={`
        absolute top-1/2 -translate-y-[40px] z-10
        ${hasNext ? "cursor-pointer hover:opacity-50" : "cursor-default opacity-100"}
        right-[-20px] md:right-[-10px]
        transition-all duration-300 ease-in-out
      `}
      >
        <IoIosArrowForward
          className={`text-[1.5rem] ${
            hasNext ? "text-black" : "text-neutral-400"
          } transition-all duration-300 ease-in-out`}
        />
      </div>
    </div>
  );
  const { setLoading, loading } = useGlobalLoadingStore();
  console.log(loading);
  return (
    <>
      {products.length <= 3 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {products.map((product) => (
            <div key={product.slug} className="px-1 lg:px-2">
              <div
                className="flex flex-col gap-3 transition-all duration-300 ease-in-out cursor-pointer group"
                onClick={() => {
                  setLoading(true);

                  setClickedProductSlug(product.slug);
                  router.push(`/product/${product.slug}`, undefined, {
                    scroll: false,
                  });
                }}
              >
                <div className="relative w-full aspect-[4/4] overflow-hidden rounded">
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 1 }}
                    whileHover={{
                      opacity: product.images[1] ? 0 : 1,
                      scale: !product.images[1] ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  {product.images[1] && (
                    <motion.div
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <Image
                        src={product.images[1].url}
                        alt={`${product.name} (hover image)`}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <p className="text-lg md:text-2xl font-light tracking-tight text-[#282828] scroll-m-20 underline-offset-4 group-hover:underline">
                      {product.name.toLowerCase()}
                    </p>
                    {product.preorder && (
                      <span className="px-2 py-1 text-xs font-semibold text-white no-underline lowercase translate-y-0.5 bg-yellow-400 rounded group-hover:no-underline">
                        preorder
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-light md:text-base">
                    ₱
                    {new Intl.NumberFormat("en-PH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(product.price)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative px-2 rounded">
          {products.length > 3 && renderArrows()}

          <Slider
            ref={slider}
            afterChange={handleAfterChange}
            {...settings}
            className="rounded-md"
          >
            {products.map((product, index) => (
              <div key={product.slug} className="px-3 sm:px-3 md:px-5 lg:px-8">
                <div
                  className="flex flex-col gap-3 transition-all duration-300 ease-in-out cursor-pointer group"
                  onClick={() => {
                    setLoading(true);

                    setClickedProductSlug(product.slug);
                    router.push(`/product/${product.slug}`, undefined, {
                      scroll: false,
                    });
                  }}
                >
                  <div className="relative w-full aspect-[4/4] overflow-hidden rounded">
                    <motion.div
                      className="absolute inset-0"
                      initial={{ opacity: 1 }}
                      whileHover={{
                        opacity: product.images[1] ? 0 : 1,
                        scale: !product.images[1] ? 1.05 : 1,
                      }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </motion.div>

                    {product.images[1] && (
                      <motion.div
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <Image
                          src={product.images[1].url}
                          alt={`${product.name} (hover image)`}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <p className="text-lg md:text-2xl font-light tracking-tight text-[#282828] scroll-m-20 underline-offset-4 group-hover:underline">
                        {product.name.toLowerCase()}
                      </p>
                      {product.preorder && (
                        <span className="px-2 py-1 text-xs font-semibold text-white no-underline lowercase translate-y-0.5 bg-yellow-400 rounded group-hover:no-underline">
                          preorder
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-light md:text-base">
                      ₱
                      {new Intl.NumberFormat("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(product.price)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </>
  );
};

export default ProductCarousel;
