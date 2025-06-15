import useGlobalLoadingStore from "@/stores/loading";
import { useCartStore } from "@/stores/useCartStore";
import DefaultTemplate from "@/templates/default-template";
import type { Product } from "@/types/product";
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiArrowLeft } from "react-icons/fi";

const Product = ({ product }: { product: Product[] }) => {
  const { setLoading } = useGlobalLoadingStore();
  const item = product[0];
  console.log(item.images[0]?.url);
  const [activeImage, setActiveImage] = useState(item.images[0]?.url);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const { items } = useCartStore();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  console.log(item.color);
  console.log(selectedColor);
  const handleAddToCart = () => {
    const sizeName = item.size_chart[selectedSize]?.label;
    const colorName = item.color?.find(
      (color: any) => color.key === selectedColor
    )?.name;
    console.log(colorName);
    if (!selectedSize || !sizeName) {
      toast.error("Please select a size");
      return;
    }

    if (!selectedColor || !colorName) {
      toast.error("Please select a color");
      return;
    }

    addToCart(
      {
        id: `${item.id}-${selectedSize}-${selectedColor}`,
        name: item.name,
        price: item.price,
        image: item.images[activeImageIndex].url,
        size: sizeName,
        color: colorName,
      },
      quantity
    );

    toast.success(
      `Added ${item.name} (${sizeName}, ${colorName}) x${quantity} to cart`.toLowerCase()
    );
  };
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  if (!item || !item.images || item.images.length === 0) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen">
        <p className="text-lg">item not found</p>
      </div>
    );
  }
  const title = `${item.name.toLowerCase()} | stab.cult merch`;
  const description = `Get ${item.name.toLowerCase()} for ₱${item.price.toFixed(
    2
  )} — official stab.cult merch.`;
  const imageUrl = item.images?.[activeImageIndex]?.url
    ? item.images[activeImageIndex].url
    : "https://stabcult.com/default-image.jpg"; // fallback image

  return (
    <DefaultTemplate
      head={
        <Head>
          <title className="lowercase">{title}</title>
          <meta name="description" content={description} />

          {/* Open Graph */}
          <meta property="og:type" content="product" />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={imageUrl} />
          <meta
            property="og:url"
            content={`https://stabcult.com/product/${item.slug}`}
          />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={imageUrl} />

          <link rel="icon" href="/knife.ico" type="image/x-icon" />
        </Head>
      }
    >
      <main className="w-full max-w-5xl min-h-screen p-4 mx-auto sm:p-8 md:px-12 md:py-8">
        <div
          className="flex items-center gap-2 mb-6 text-xl cursor-pointer row hover:text-gray-600"
          onClick={() => {
            setLoading(true);
            router.push("/", undefined, { scroll: false });
          }}
        >
          <FiArrowLeft />
          <p className="-translate-y-0.5">back</p>
        </div>
        <div className="grid items-start grid-cols-1 gap-10 md:grid-cols-2 ">
          {/* Image Gallery */}
          <div className="w-full ">
            {/* Main Image */}
            <div
              className="relative w-full overflow-hidden rounded-lg cursor-zoom-in aspect-square"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setMousePos({ x, y });
              }}
            >
              <Image
                src={activeImage}
                alt={item.name}
                fill
                className={`object-cover transition-transform duration-200 ease-in-out ${
                  zoom ? "scale-150" : "scale-100"
                }`}
                style={{
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }}
                priority
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {item.images.map((img, index) => (
                <div
                  key={index}
                  className={`relative w-20 h-20 min-w-[80px]  rounded-lg overflow-hidden border-2 cursor-pointer ${
                    img.url === activeImage
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  onClick={() => setActiveImage(img.url)}
                >
                  <Image
                    src={img.url}
                    alt={`${item.name} thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-1">
            <h1 className="text-5xl leading-tight font-extralight">
              {item.name.toLowerCase()}
            </h1>
            <p className="text-xl font-light text-gray-800">
              ₱
              {new Intl.NumberFormat("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(item.price)}
            </p>
            <p className="my-5 text-base text-gray-800 md:text-lg">
              {item.description}
            </p>
            {item.color && Object.keys(item.color).length > 0 && (
              <div className="flex flex-col gap-2 mt-6">
                <span className="text-lg font-light">color</span>
                <div className="flex flex-wrap gap-2 mb-5">
                  {item.color.map((color: any, idx: any) => (
                    <button
                      key={color.key}
                      onClick={() => {
                        setSelectedColor(color.key);
                        setActiveImage(item.images[idx].url); // ← use index to set image
                        setActiveImageIndex(idx);
                      }}
                      className={`flex items-center gap-2 px-3 py-1 border rounded lowercase ${
                        selectedColor === color.key
                          ? "bg-black text-white border-black"
                          : "border-gray-300 text-gray-800 hover:border-black"
                      }`}
                    >
                      <span
                        className="w-4 h-4 border rounded-full"
                        style={{ backgroundColor: color.hex }}
                      />
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2 mt-6">
              <span className="text-lg font-light">size</span>
              <div className="flex flex-wrap gap-2 mb-5">
                {Object.entries(item.size_chart).map(([key, size]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSize(key)}
                    className={`px-2 py-1 border lowercase  rounded ${
                      selectedSize === key
                        ? "bg-black text-white border-black"
                        : "border-gray-300 text-gray-800 hover:border-black"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
            {item.size_chart &&
              Object.values(item.size_chart).some(
                (size) => size.width && size.length
              ) && (
                <table className="w-full my-5 text-sm text-left lowercase border border-collapse border-gray-300 bg-yellow-50/10">
                  <thead className="text-xs tracking-wider text-gray-700 ">
                    <tr>
                      <th className="px-4 py-2 border border-gray-300">Size</th>
                      <th className="px-4 py-2 border border-gray-300">
                        Width (in)
                      </th>
                      <th className="px-4 py-2 border border-gray-300">
                        Length (in)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(item.size_chart)
                      .filter((size) => size.width && size.length)
                      .map((size, index) => (
                        <tr key={index} className="text-gray-800">
                          <td className="px-4 py-2 border border-gray-300">
                            {size.label}
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {size.width}
                          </td>
                          <td className="px-4 py-2 border border-gray-300">
                            {size.length}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            <div className="flex items-center gap-4 my-5">
              <span className="text-lg font-light">quantity</span>
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={decrement}
                  className="flex items-center justify-center w-8 h-8 text-sm font-semibold border-r border-gray-300 hover:bg-gray-100"
                >
                  −
                </button>
                <div className="w-8 text-center">{quantity}</div>
                <button
                  onClick={increment}
                  className="flex items-center justify-center w-8 h-8 text-sm font-semibold border-l border-gray-300 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.95 }}
              className="w-full px-6 py-3 text-white transition bg-black rounded md:w-auto hover:bg-gray-800"
            >
              add to cart
            </motion.button>
          </div>
        </div>
      </main>
    </DefaultTemplate>
  );
};

export default Product;

export const getStaticPaths = async () => {
  try {
    const res = await fetch(
      `${process.env.STRAPI_URL}/api/products?fields[0]=slug`
    );

    if (!res.ok) {
      console.error("Fetch failed:", res.status, res.statusText);
      return { notFound: true };
    }

    const data = await res.json();
    const paths = data.data.map((product: { slug: string }) => ({
      params: { slug: product.slug },
    }));
    console.log(paths);
    return {
      paths,
      fallback: "blocking",
    };
  } catch (error) {
    console.error("Error fetching product slugs:", error);
    return { paths: [], fallback: "blocking" };
  }
};

export const getStaticProps = async ({
  params,
}: {
  params: { slug: string };
}) => {
  try {
    const res = await fetch(
      `${process.env.STRAPI_URL}/api/products?filters[slug][$eq]=${params.slug}&populate=*`
    );

    if (!res.ok) {
      console.error("Fetch failed:", res.status, res.statusText);
      return { notFound: true };
    }

    const data = await res.json();

    return {
      props: {
        product: data.data,
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { notFound: true };
  }
};
