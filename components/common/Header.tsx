import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <nav className="container flex items-center justify-between">
      <div>
        <Link href="/">Sommaire</Link>
      </div>
      <div>
        <Link href="/#pricing">Pricing</Link>
      </div>
      <div>
        <Link href="/sign-in">Sign In</Link>
      </div>
    </nav>
  );
}
