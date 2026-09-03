import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="h-15 w-full shadow-[inset_0_-0.1px_0_0_#000000] flex items-center px-5">
            <div className="ml-auto flex items-center gap-6 text-sm text-gray-600">
                <Link
                    href="/"
                    className="hover:text-gray-900 hover:underline transition-colors"
                >
                    Home
                </Link>

                <Link
                    href="/file-rit"
                    className="hover:text-gray-900 hover:underline transition-colors"
                >
                    File RTI
                </Link>

                <Link
                    href="/flash-rit"
                    className="hover:text-gray-900 hover:underline transition-colors"
                >
                    flash RTI
                </Link>

                <Link
                    href="/about"
                    className="hover:text-gray-900 hover:underline transition-colors"
                >
                    About
                </Link>

                <Link
                    href="/account"
                    className="hover:text-gray-900 hover:underline transition-colors"
                >
                    Account
                </Link>
            </div>
        </nav>
    );
}