import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-[#003366] text-white">
      <p className="text-xs">
        © 2025 Elathala. All rights reserved.
      </p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link className="text-xs hover:underline underline-offset-4" href="#">
          Terms of Service
        </Link>
        <Link className="text-xs hover:underline underline-offset-4" href="#">
          Privacy Policy
        </Link>
        <Link className="text-xs hover:underline underline-offset-4" href="#">
          Contact Us
        </Link>
      </nav>
    </footer>
  )
}
