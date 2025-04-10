'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle, // Re-add this import
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
// No longer using Lucide icons directly
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Navigation Menu Data ---
// Type definition updated: icon is now string (path to SVG)
const produkteCategories: { title: string; icon: string; items: { title: string; href: string; description: string; icon: string }[] }[] = [
  {
    title: "Ngrohje Qendrore",
    icon: 'icons/heat-pump.svg',
    items: [
      { title: "Pompa Termike", href: "/kategori/pompa-termike", description: "Ngrohje dhe ftohje efikase.", icon: 'icons/heat-pump.svg' },
      { title: "Kalldaja Elektrike", href: "/kategori/kalldaja-elektrike", description: "Ngrohje e pastër dhe e thjeshtë.", icon: 'icons/kalldaj.svg' },
      { title: "Radiator", href: "/kategori/radiator", description: "Shpërndarje nxehtësie.", icon: 'icons/radiator.svg' },
      { title: "Fancoiler", href: "/kategori/fancoiler", description: "Ngrohje dhe ftohje e shpejtë.", icon: 'icons/fancoiler.svg' },
    ]
  },
  {
    title: "Klimatizim & Ventilim",
    icon: 'icons/hvac.svg',
    items: [
      { title: "Kondicioner", href: "/kategori/kondicioner", description: "Freski optimale për ambientin tuaj.", icon: 'icons/air-conditioner.svg' },
      { title: "Pompa Termike", href: "/kategori/pompa-termike", description: "Zgjidhje e integruar ftohje.", icon: 'icons/heat-pump.svg' },
      { title: "Fancoiler", href: "/kategori/fancoiler", description: "Ftohje dhe ngrohje e shpejtë.", icon: 'icons/fancoiler.svg' }
    ]
  },
  {
    title: "Solar", // New category
    icon: 'icons/solar-cell.svg',
    items: [
      { title: "Panela Solar", href: "/kategori/panele-solare", description: "Gjeneroni energji të pastër.", icon: 'icons/solar-cell.svg' },
      { title: "Inverter", href: "/kategori/inverter-solar", description: "Konversoni energjinë diellore.", icon: 'icons/solar-inverter.svg' },
    ]
  },
  {
    title: "Sanitari", // New category
    icon: 'icons/boiler.svg', // Using a generic icon
    items: [
       { title: "Bojler", href: "/kategori/bojler", description: "Ujë i ngrohtë sanitar.", icon: 'icons/boiler.svg' },
       { title: "Akumules", href: "/kategori/akumules", description: "Rezervuar uji.", icon: 'icons/boiler.svg' },
    ]
  },
  {
    title: "Servisim & Instalim", // Renamed
    icon: 'icons/service.svg', // Using a generic icon
    items: [
      // Example item - adjust as needed
      { title: "Shërbime Profesionale", href: "/kategori/sherbime", description: "Instalim dhe mirëmbajtje.", icon: 'icons/service.svg' },
    ]
  }
];

// --- ListItem Helper Component (from shadcn/ui docs) ---
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: string } // Updated icon type to string
>(({ className, title, children, icon, ...props }, ref) => { // Fixed syntax with proper parentheses
  return (
    <li> {/* Removed flex items-center from li */}
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block w-full text-left p-3 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50", // Adjusted padding and hover
            className
          )}
          {...props}
        >
          <div className="flex items-start gap-3"> {/* Changed to items-start */} 
            {icon && (
              <Image 
                src={`/${icon}`} 
                alt="Icon" 
                width={16} 
                height={16} 
                className="mt-0.5 flex-shrink-0"
                unoptimized
              />
            )}
            <div className="flex flex-col">
              <div className="font-medium text-foreground leading-tight">{title}</div>
              <p className="text-xs text-muted-foreground leading-snug">{children}</p>
            </div>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

// --- Kompania Menu Data ---
const kompaniaItems: { title: string; href: string; description: string; icon: string }[] = [ // Updated icon type to string
  { title: "Rreth Nesh", href: "/rreth-nesh", description: "Mësoni më shumë për misionin dhe vlerat tona.", icon: 'icons/info.svg' },
  { title: "Dokumente", href: "/dokumente", description: "Shkarkoni katalogët dhe certifikatat tona.", icon: 'icons/document.svg' },
  { title: "Blog", href: "/blog", description: "Lexoni artikujt dhe këshillat më të fundit.", icon: 'icons/blogger.svg' },
];

// Define prop types for the Header
interface HeaderProps {
  variant?: 'transparent' | 'solid';
}

// --- Header Component ---
const Header = ({ variant = 'transparent' }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [kompaniaOpen, setKompaniaOpen] = useState(false);
  // State for the active category in the Produkte dropdown
  const [activeCategory, setActiveCategory] = useState(produkteCategories[0].title);

  return (
    <header className={cn(
      "left-0 right-0 z-50",
      variant === 'transparent'
        ? "absolute top-0 bg-transparent"
        : "relative bg-background border-b border-border"
    )}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Navigation on the left */}
        <nav className="hidden md:flex items-center gap-1"> {/* Reduced gap for menu list styling */}
          <NavigationMenu>
            <NavigationMenuList className="gap-4"> {/* Added gap for spacing between items */}
              {/* Produkte Navigation Item */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                    "bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent",
                    variant === 'transparent' ? "text-white hover:text-white/80" : "text-foreground hover:text-foreground/80"
                  )}>
                  Produkte
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex w-[650px] p-4 md:w-[700px]">
                    {/* Left Column: Category Triggers */}
                    <div className="w-[200px] flex-grow flex flex-col justify-between pr-4 border-r border-muted"> {/* Replaced h-full with flex-grow */}
                      {produkteCategories.map((category) => (
                        <button
                          key={category.title}
                          onMouseEnter={() => setActiveCategory(category.title)}
                          className={cn(
                            "flex items-center gap-2 w-full text-left p-2 rounded text-sm font-medium transition-colors", // Added flex, items-center, gap-2
                            activeCategory === category.title
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent/50"
                          )}
                        >
                          <Image src={`/${category.icon}`} alt="Category Icon" width={16} height={16} className="flex-shrink-0" unoptimized />
                          <span>{category.title}</span>
                        </button>
                      ))}
                    </div>

                    {/* Right Column: Items for Active Category */}
                    <div className="w-[calc(100%-200px)] pl-4">
                      <ul className={cn(
                        "gap-x-4", // Horizontal gap for grid
                        (produkteCategories.find((cat) => cat.title === activeCategory)?.items.length ?? 0) > 3
                          ? "grid grid-cols-2" // Apply 2-column grid if more than 3 items
                          : "space-y-1" // Otherwise, use vertical spacing
                      )}>
                        {produkteCategories
                          .find((cat) => cat.title === activeCategory)?.items.map((item) => (
                            <ListItem key={item.title} title={item.title} href={item.href} icon={item.icon}>{item.description}</ListItem> // Re-added children
                          ))}
                      </ul>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Kompania Navigation Item */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                    "bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent",
                    variant === 'transparent' ? "text-white hover:text-white/80" : "text-foreground hover:text-foreground/80"
                  )}>
                  Kompania
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[600px]">
                    {kompaniaItems.map((item) => (
                      <ListItem key={item.title} title={item.title} href={item.href} icon={item.icon}> {/* Pass icon prop */}
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Kontakti Navigation Item */}
          <NavigationMenuItem>
             <Link href="/kontakti" legacyBehavior passHref>
               <NavigationMenuLink className={cn(
                    navigationMenuTriggerStyle(),
                    "bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent",
                    variant === 'transparent' ? "text-white hover:text-white/80" : "text-foreground hover:text-foreground/80"
                  )}>
                  Kontakti
               </NavigationMenuLink>
             </Link>
          </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Logo on the right */}
        <div className="flex-none ml-auto pl-4"> {/* Use ml-auto to push logo right, pl-4 for padding */}
          <Link href="/">
            <Image
              src={variant === 'transparent' ? "/logo-white.png" : "/logo.png"} // Assuming logo.svg exists in public folder
              alt="ECOTEK Logo"
              width={120}
              height={40}
              className="h-10 w-auto filter" /* Force logo to be white */
            
            />
          </Link>
        </div>

        {/* Mobile Menu Button (kept on the far right after logo) */}
        <div className="md:hidden ml-4"> {/* Added ml-4 for spacing */}
          <Button
            variant="ghost"
            className={cn(variant === 'transparent' ? "text-white hover:text-white/80" : "text-foreground hover:text-foreground/80")}
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isOpen ? (
                <path d="M18 6 6 18M6 6l12 12"/>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </>
              )}
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background border-t"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link
                href="/products"
                className="py-2 text-white hover:text-white/80"
                onClick={() => setIsOpen(false)}
              >
                Produkte
              </Link>
              <div className="py-2">
                <button
                  onClick={() => setKompaniaOpen(!kompaniaOpen)}
                  className="flex items-center gap-1 text-white hover:text-white/80 w-full justify-between"
                >
                  <span>Kompania</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform ${kompaniaOpen ? 'rotate-180' : ''}`}
                  >
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>

                <AnimatePresence>
                  {kompaniaOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-3 pl-6 py-2 border-l border-white/20 space-y-1"
                    >
                      <Link
                        href="/rreth-nesh"
                        className="block py-2.5 px-2 text-white/70 hover:text-white transition-colors rounded-r-md hover:bg-white/5"
                        onClick={() => setIsOpen(false)}
                      >
                        Rreth Nesh
                      </Link>
                      <Link
                        href="/dokumente"
                        className="block py-2.5 px-2 text-white/70 hover:text-white transition-colors rounded-r-md hover:bg-white/5"
                        onClick={() => setIsOpen(false)}
                      >
                        Dokumente
                      </Link>
                      <Link
                        href="/blog"
                        className="block py-2.5 px-2 text-white/70 hover:text-white transition-colors rounded-r-md hover:bg-white/5"
                        onClick={() => setIsOpen(false)}
                      >
                        Blog
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* Mobile Kontakti Link */}
              <Link
                href="/kontakti"
                className="py-2 text-white hover:text-white/80"
                onClick={() => setIsOpen(false)}
              >
                Kontakti
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
