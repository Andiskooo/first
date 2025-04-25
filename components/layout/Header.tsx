'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { categories } from '@/app/categories/[id]/data';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
// No longer using Lucide icons directly
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react'; // Import icons for accordion

// --- Navigation Menu Data ---
// Convert the categories data to the format needed for the navigation menu
const produkteCategories = categories.map(category => {
  return {
    title: category.title,
    icon: category.icon,
    items: category.subcategories.map(subcategory => ({
      title: subcategory.title,
      href: subcategory.href,
      description: subcategory.description,
      icon: subcategory.icon
    }))
  };
});

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
            "block w-full text-left p-4 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50", // Increased padding
            className
          )}
          {...props}
        >
          <div className="flex items-start gap-4"> {/* Increased gap */}
            {icon && (
              <Image 
                src={`/${icon}`} 
                alt="Icon" 
                width={24} // Increased icon size to 24px
                height={24} 
                className="mt-0.5 flex-shrink-0"
                unoptimized
              />
            )}
            <div className="flex flex-col">
              <div className="font-medium text-base text-foreground leading-tight">{title}</div> {/* Increased font size */}
              <p className="text-sm text-muted-foreground leading-snug">{children}</p> {/* Increased font size */}
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
  { title: "Blog", href: "/blog", description: "Lexoni artikujt dhe këshillat më të fundit.", icon: 'icons/blogger.svg' },
  { title: "Kontakto", href: "/contact-us", description: "Na kontaktoni për çdo pyetje ose kërkesë.", icon: 'icons/phone.svg' },
];

// Define prop types for the Header
interface HeaderProps {
  variant?: 'transparent' | 'solid';
}

// --- Header Component ---
const Header = ({ variant = 'transparent' }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // State for the active category in the Produkte dropdown
  const [openAccordionCategory, setOpenAccordionCategory] = useState<string | null>(null); // State for mobile accordion
  const [activeCategory, setActiveCategory] = useState(produkteCategories[0].title);

  return (
    <header className={cn(
      "left-0 right-0 z-50",
      variant === 'transparent'
        ? "absolute top-0 bg-transparent"
        : "relative bg-background border-b border-border"
    )}>
      <div className="container mx-auto px-4 py-4">
        {/* Mobile: Logo left, burger right */}
        <div className="flex w-full items-center justify-between md:hidden">
          <div className="flex-none">
            <Link href="/">
              <Image
                src={variant === 'transparent' ? "/logo-white.png" : "/logo.png"}
                alt="ECOTEK Logo"
                width={120}
                height={40}
                className="h-10 w-auto filter"
              />
            </Link>
          </div>
          <div className="flex-none">
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
        {/* Desktop: Logo left, nav right */}
        <div className="hidden md:flex items-center w-full">
          <div className="flex-none mr-6">
            <Link href="/">
              <Image
                src={variant === 'transparent' ? "/logo-white.png" : "/logo.png"}
                alt="ECOTEK Logo"
                width={120}
                height={40}
                className="h-10 w-auto filter"
              />
            </Link>
          </div>
          <nav className="flex items-center gap-1 w-full">
            <NavigationMenu>
              <NavigationMenuList className="gap-4">
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
                              "flex items-center gap-3 w-full text-left p-3 rounded text-base font-medium transition-colors", // Increased gap, padding, font size
                              activeCategory === category.title
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-accent/50"
                            )}
                          >
                            <Image src={`/${category.icon}`} alt="Category Icon" width={24} height={24} className="flex-shrink-0" unoptimized /> {/* Increased icon size to 24px */}
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

                {/* Removed standalone Kontakto item as it's now in the Kompania dropdown */}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setIsOpen(false)} // Close menu when overlay is clicked
              />
              {/* Menu Content */}
              <motion.div
                key="mobile-menu"
                initial={{ y: "-100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-x-0 top-full mt-0 flex flex-col bg-background shadow-lg md:hidden max-h-[calc(100vh-80px)] overflow-y-auto z-50" // Added max-height, scroll, and higher z-index
              >
                {/* Accordion for Produkte Categories */}
                <div className="border-b border-border">
                  <div className="p-4 font-semibold text-lg text-foreground">Produkte</div> {/* Section Title */}
                  {produkteCategories.map((category) => (
                    <div key={category.title} className="border-t border-border">
                      <button
                        className="flex w-full items-center justify-between p-4 text-left font-medium text-foreground hover:bg-accent"
                        onClick={() => setOpenAccordionCategory(openAccordionCategory === category.title ? null : category.title)}
                      >
                        <span className="flex items-center gap-2">
                           <Image src={`/${category.icon}`} alt="" width={20} height={20} unoptimized className="flex-shrink-0" />
                           {category.title}
                        </span>
                        {openAccordionCategory === category.title ? <ChevronUp className="h-5 w-5 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 flex-shrink-0" />}
                      </button>
                      <AnimatePresence>
                        {openAccordionCategory === category.title && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="overflow-hidden bg-muted/50"
                          >
                             <ul className="py-2 pl-8">
                              {category.items.map((item) => (
                                <li key={item.href}>
                                  <Link
                                    href={item.href}
                                    className="block py-1.5 pl-3 text-sm text-muted-foreground hover:text-foreground"
                                    onClick={() => setIsOpen(false)} // Close menu on link click
                                  >
                                    {item.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Links for Kompania */}
                <div className="border-b border-border p-4">
                   <div className="mb-2 font-semibold text-lg text-foreground">Kompania</div>
                   {kompaniaItems.map((item) => (
                     <Link key={item.href} href={item.href} className="block py-1.5 text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}> {item.title} </Link>
                   ))}
                </div>

                 {/* Other potential top-level links if needed, e.g., Home */}
                 {/* <Link href="/" className="block p-4 text-sm font-medium text-foreground hover:bg-accent border-b border-border" onClick={() => setIsOpen(false)}>
                   Ballina
                 </Link> */}
                 {/* Kontakto is now part of Kompania in mobile view too */}

               </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
