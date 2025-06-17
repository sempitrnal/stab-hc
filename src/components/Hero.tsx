import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative w-full max-w-5xl mx-auto lg:mt-10 aspect-[16/9] lg:rounded overflow-hidden">
      <Image
        src="/stab-cult.jpg"
        alt="stab.cult"
        quality={100}
        fill
        priority
        className="object-cover object-[center_45%]"
      />

      <div className="relative z-[59]">
        <div className=""></div>
      </div>
    </section>
  );
};

export default Hero;
