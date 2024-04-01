import Link from "next/link";

const Nav = () => {
  return (
    <nav className="sticky top-0 p-3 text-white bg-black">
      <ul className="flex gap-5 p-3">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/hello">Hello</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
