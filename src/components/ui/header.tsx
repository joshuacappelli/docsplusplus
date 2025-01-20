"use client";

import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Header1() {
    const navigationItems = [
      {
        title: "Information",
        description: "Here you'll find information about Docs++ and how it works.",
        items: [
          {
            title: "Docs++",
            href: "/documentation",
          },
        ],
      },
      {
        title: "Reach me",
        description: "Here you'll find where to learn more about me and how to contact me.",
        items: [
          {
            title: "About me",
            href: "https://joshuacappelli.com",
          },
          {
            title: "Contact me",
            href: "mailto:joshua@cappelliconnect.com",
          },
        ],
      },
    ];
  
    // Track the dropdown visibility for each menu item
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
    const toggleDropdown = (title: string) => {
      setOpenDropdown((prev) => (prev === title ? null : title));
    };
  
    return (
      <header className="w-[90%] z-40 fixed top-4 left-1/2 transform -translate-x-1/2 bg-sageGreen bg-opacity-80 rounded-2xl shadow-lg mx-4 p-4">
        <div className="container relative mx-auto flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center rounded-2xl">
          {/* Navigation Menu */}
          <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
            <nav>
              <ul className="flex justify-start gap-4">
                {navigationItems.map((item) => (
                  <li key={item.title} className="relative group">
                    {/* Trigger Button */}
                    <button
                      onClick={() => toggleDropdown(item.title)}
                      className="font-medium text-sm px-4 py-2 bg-white rounded-full hover:bg-muted focus:outline-none"
                    >
                      {item.title}
                    </button>
  
                    {/* Dropdown Content */}
                    {openDropdown === item.title && (
                      <div className="absolute top-full mt-2 bg-white shadow-lg rounded-2xl p-4 w-64">
                        <p className="text-base font-semibold">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <ul className="mt-2 space-y-2">
                          {item.items.map((subItem) => (
                            <li key={subItem.title}>
                              <Link
                                href={subItem.href}
                                className="block hover:bg-muted py-2 px-4 rounded-lg"
                              >
                                {subItem.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
  
          {/* Centered Title */}
          <div className="flex lg:justify-center">
            <p className="font-semibold text-lg">Docs++</p>
          </div>
  
          {/* Right Section */}
          <div className="flex justify-end w-full gap-4">
            <Link href="/auth/login">
              <button className="bg-white border border-gray-300 text-black rounded-full px-6 py-2 hover:bg-gray-100">
                Sign in
              </button>
            </Link>
            <Link href="/auth/signup">
              <button className="bg-white text-black rounded-full px-6 py-2 hover:bg-opacity-90">
                Get started
              </button>
            </Link>
          </div>
        </div>
      </header>
    );
  }


  function Header2() {
    const navigationItems = [
      {
        title: "Home",
        href: "/dashboard",
        description: "Go to your dashboard",
      },
    ];
  
    const [isOpen, setOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  
    const toggleDropdown = (title: string) => {
      setOpenDropdown((prev) => (prev === title ? null : title));
    };
  
    const handleLogout = async () => {
      await signOut({ callbackUrl: "/" });
    };
  
    return (
        <header className="w-[90%] z-40 relative top-4 left-1/2 transform -translate-x-1/2 bg-sageGreen bg-opacity-80 rounded-3xl shadow-lg mx-4 p-4 mb-8">
        <div className="container relative mx-auto flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center rounded-2xl">
          {/* Navigation Menu */}
          <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
            <nav>
              <ul className="flex justify-start gap-4">
                {navigationItems.map((item) => (
                  <li key={item.title} className="relative group">
                    {item.href ? (
                      <Link href={item.href}>
                        <Button variant="ghost" className="rounded-full">
                          {item.title}
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleDropdown(item.title)}
                          className="font-medium text-sm px-4 py-2 bg-white rounded-full hover:bg-muted focus:outline-none"
                        >
                          {item.title}
                        </button>
                        {openDropdown === item.title && (
                          <div className="absolute top-full mt-2 bg-white shadow-lg rounded-2xl p-4 w-64">
                            <p className="text-base font-semibold">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>
  
          {/* Centered Title */}
          <div className="flex lg:justify-center">
            <p className="font-semibold text-lg">Docs++</p>
          </div>
  
          {/* Right Section */}
          <div className="flex justify-end w-full gap-4">
            <Button onClick={handleLogout} className="rounded-full bg-mutedCharcoal text-white px-6 py-2 hover:bg-mutedCharcoal/90  ">
              Logout
            </Button>
          </div>
  
          {/* Mobile Menu */}
          <div className="flex w-12 shrink lg:hidden items-end justify-end">
            <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
              {isOpen ? <span className="w-5 h-5">✕</span> : <span className="w-5 h-5">☰</span>}
            </Button>
            {isOpen && (
              <div className="absolute top-full mt-2 border-t flex flex-col w-full right-0 bg-white shadow-lg py-4 container gap-8 rounded-2xl">
                {navigationItems.map((item) => (
                  <div key={item.title}>
                    <div className="flex flex-col gap-2">
                      {item.href ? (
                        <Link
                          href={item.href}
                          className="flex justify-between items-center py-2 px-4 hover:bg-gray-100 rounded-lg"
                        >
                          <span className="text-lg">{item.title}</span>
                        </Link>
                      ) : (
                        <>
                          <button
                            onClick={() => toggleDropdown(item.title)}
                            className="text-lg flex items-center justify-between w-full"
                          >
                            {item.title}
                          </button>
                          {openDropdown === item.title && (
                            <div className="mt-2 bg-white rounded-lg shadow-md px-4 py-2">
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  function Header3 () {
    const navigationItems = [
      { title: "Home", href: "/" },
      { title: "Headings", href: "#heading" },
      { title: "Text Format", href: "#text-format" },
      { title: "Images", href: "#image" },
      { title: "Quotes", href: "#quote" },
      { title: "Tables", href: "#table" },
      { title: "AI", href: "#ai" },
    ];
  
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <header className="w-[90%] z-40 relative top-4 left-1/2 transform -translate-x-1/2 bg-sageGreen bg-opacity-80 rounded-3xl shadow-lg mx-4 p-4 mb-8">
        <div className="container mx-auto flex items-center justify-between">
          {/* Home Button */}
          <Link href="/" className="text-lg font-semibold text-black hover:underline">
            Docs++
          </Link>
  
          {/* Navigation Menu */}
          <nav className="hidden lg:flex gap-6">
            <ul className="flex items-center gap-6">
              {navigationItems.map((item) => (
                <li key={item.title}>
                  <a
                    href={item.href}
                    className="text-black text-sm font-medium px-3 py-2 rounded-full hover:bg-white hover:text-sageGreen transition-colors"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
  
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-white text-2xl focus:outline-none"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>
  
        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-4 bg-white shadow-md rounded-lg p-4 space-y-4">
            {navigationItems.map((item) => (
              <div key={item.title}>
                <a
                  href={item.href}
                  className="block text-sageGreen text-sm font-medium py-2 px-4 rounded hover:bg-gray-100 transition-colors"
                >
                  {item.title}
                </a>
              </div>
            ))}
          </div>
        )}
      </header>
    );
  };


export { Header1, Header2, Header3 };