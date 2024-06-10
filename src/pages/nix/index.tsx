import Head from "next/head";
import Image from "next/image";

const Nix = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 p-10 font-mono text-2xl">
      <Head>
        <title>ihatenikdiores</title>
        <meta name="description" content="i hate nikdiores so much" />
        <meta property="og:title" content="ihatenikdiores" />
        <meta property="og:description" content="i hate nikdiores so much" />
        <meta property="og:image" content="/lol.png" />
        <link rel="shortcut icon" href="knife.ico" type="image/x-icon" />
      </Head>
      <Image src={"/lol.png"} width={500} height={500} alt="lol"></Image>
      <p> ihatenikdiores😩😩😩</p>
    </div>
  );
};

export default Nix;
