// Blog post data types and mock data
export type BlogPost = {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  imageUrl: string;
  link: string;
  date?: string;
  accentColor?: string; // Optional color for accents
};

// Mock blog data
export const blogPosts: BlogPost[] = [
  {
    id: '01',
    title: 'Energy from nature and efficiency with ECOTEK HEAT PUMPS',
    subtitle: 'Heating solutions',
    content: 'Space heating or hot water preparation? Yes! Efficient heating with ECOTEK heat pumps: Lower bills and higher energy efficiency in Kosovo.',
    imageUrl: '/featured/pompa-termike.jpg',
    link: '/blog/energy-from-nature',
    accentColor: 'red-600'
  },
  {
    id: '02',
    title: 'The first QLED Android TV produced in Kosovo!',
    subtitle: 'Technology innovation',
    content: 'Discover the cutting-edge technology behind the first QLED Android TV manufactured right here in Kosovo.',
    imageUrl: '/featured/tpompa-termike.jpg',
    link: '/blog/qled-android-tv',
    accentColor: 'blue-600'
  },
  {
    id: '03',
    title: 'NEW H+ Design air conditioner',
    subtitle: 'Product innovation',
    content: 'Introducing our latest air conditioner design with improved efficiency, quieter operation and smart features.',
    imageUrl: '/featured/klima.jpg',
    link: '/blog/new-design-air-conditioner',
    accentColor: 'green-600'
  },
  {
    id: '04',
    title: 'LED TV production',
    subtitle: 'Manufacturing',
    content: 'A behind-the-scenes look at how our premium LED TVs are manufactured with precision and quality control.',
    imageUrl: '/featured/bojleri.jpg',
    link: '/blog/led-tv-production',
    accentColor: 'orange-600'
  },
  {
    id: '05',
    title: 'ECOTEK air conditioners are the best in terms of quality',
    subtitle: 'Product quality',
    content: 'Learn why our air conditioners stand out in the market with superior build quality, efficiency, and reliability.',
    imageUrl: '/blog/ac-quality.jpg',
    link: '/blog/air-conditioner-quality',
    accentColor: 'purple-600'
  }
];
