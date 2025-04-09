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
import { ThermometerSun, Wind, Zap, Snowflake, Info, FileText, Newspaper } from 'lucide-react'; // Example Icons
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Navigation Menu Data ---
const produkteCategories: { title: string; icon: React.ElementType; items: { title: string; href: string; description: string; icon: React.ElementType }[] }[] = [
  {
    title: "Ngrohje Qendrore",
    icon: ThermometerSun, // Category Icon
    items: [
      { title: "Pompa Nxehtësie", href: "/produkte/pompa-nxehtesie", description: "Efikasitet i lartë për ngrohje dhe ftohje.", icon: ThermometerSun },
      { title: "Kaldaja me Pelet", href: "/produkte/kaldaja-pelet", description: "Zgjidhje ekologjike për ngrohje.", icon: ThermometerSun }, // Placeholder icon
      { title: "Radiatorë", href: "/produkte/radiatore", description: "Shpërndarje uniforme e nxehtësisë.", icon: ThermometerSun }, // Placeholder icon
    ]
  },
  {
    title: "Klimatizim & Ventilim",
    icon: Snowflake, // Category Icon
    items: [
      { title: "Kondicionerë Inverter", href: "/produkte/kondicioner", description: "Freski dhe kursim energjie.", icon: Snowflake },
      { title: "Sisteme Ventilimi", href: "/produkte/ventilim", description: "Ajër i pastër dhe i shëndetshëm.", icon: Wind },
    ]
  },
  {
    title: "Energji Solare",
    icon: Zap, // Category Icon
    items: [
      { title: "Panele Solare", href: "/produkte/panele-solare", description: "Gjeneroni energji të pastër.", icon: Zap },
      { title: "Inverterë Solarë", href: "/produkte/invertere-solare", description: "Konvertoni energjinë diellore.", icon: Zap }, // Placeholder icon
    ]
  }
];

// --- ListItem Helper Component (from shadcn/ui docs) ---
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ElementType }
>(({ className, title, children, icon: Icon, ...props }, ref) => { // Re-added children prop
  return (
    <li> {/* Removed flex items-center from li */}
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block w-full text-left p-2 rounded text-sm font-medium transition-colors hover:bg-accent/50", // Reverted to block, width, padding etc.
            className
          )}
          {...props}
        >
          {/* Inner div for flex layout */}
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />}
            <div className="flex flex-col">
              <span className="font-medium">{title}</span>
              <p className="text-xs text-muted-foreground line-clamp-1">{children}</p> {/* Added description */} 
            </div>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

// --- Kompania Menu Data ---
const kompaniaItems: { title: string; href: string; description: string; icon: React.ElementType }[] = [ // Added icon type
  { title: "Rreth Nesh", href: "/rreth-nesh", description: "Mësoni më shumë për misionin dhe vlerat tona.", icon: Info },
  { title: "Dokumente", href: "/dokumente", description: "Shkarkoni katalogët dhe certifikatat tona.", icon: FileText },
  { title: "Blog", href: "/blog", description: "Lexoni artikujt dhe këshillat më të fundit.", icon: Newspaper },
];

// --- Header Component ---
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [kompaniaOpen, setKompaniaOpen] = useState(false);
  // State for the active category in the Produkte dropdown
  const [activeCategory, setActiveCategory] = useState(produkteCategories[0].title);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Navigation on the left */}
        <nav className="hidden md:flex items-center gap-1"> {/* Reduced gap for menu list styling */}
          <NavigationMenu>
            <NavigationMenuList className="gap-4"> {/* Added gap for spacing between items */}
              {/* Produkte Navigation Item */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-white hover:text-white/80 hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
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
                          <category.icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                          <span>{category.title}</span>
                        </button>
                      ))}
                    </div>

                    {/* Right Column: Items for Active Category */}
                    <div className="w-[calc(100%-200px)] pl-4">
                      <ul className="space-y-1">
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
                <NavigationMenuTrigger className="bg-transparent text-white hover:text-white/80 hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
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
               <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "bg-transparent text-white hover:text-white/80 hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent")}>
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
              src="/logo-white.png" // Assuming logo.svg exists in public folder
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
            className="text-white hover:text-white/80"
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
