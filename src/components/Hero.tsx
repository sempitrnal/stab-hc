import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative w-full max-w-5xl mx-auto lg:mt-10 aspect-[16/9] lg:rounded overflow-hidden">
      <div className="relative w-full aspect-[16/9]">
        <Image
          src="/stab-cult.jpg"
          alt="stab.cult"
          fill
          priority
          quality={75}
          className="object-cover object-[center_45%]"
        />
      </div>

      <div className="relative z-[59]">
        <div className=""></div>
      </div>
    </section>
  );
};

export default Hero;
