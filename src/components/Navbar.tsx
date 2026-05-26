import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
  return (
    <header className="glass sticky top-0 z-50">
      <nav className="flex flex-row justify-between mx-auto container sm:px-10 px-5 py-4">
        <Link href="/" className="flex flex-row items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={24} height={24} />
          <p className="devent text-xl font-bold italic max-sm:hidden">
            Devent
          </p>
        </Link>
        <ul className="flex flex-row items-center gap-6">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/events">Events</Link>
          </li>
          <li>
            <Link href="/create-event">Create event</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
