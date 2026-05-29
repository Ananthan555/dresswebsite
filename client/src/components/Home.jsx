import { useFashionData } from "../hooks/useFashionData";
import { useEffect, useMemo, useRef, useState } from "react";
import BrandNavbar from "./Navbar";
import AuthModal from "./AuthModal";
import HeroSection from "./HeroSection";
import CollectionCarousel from "./CollectionCarousel";
import TrendingProducts from "./TrendingProducts";
import EarringsSection from "./EarringsSection";
import LookbookSection from "./LookbookSection";
import OfferBanner from "./OfferBanner";
import Newsletter from "./Newsletter";
import ProductPage from "./ProductPage";
import ProductDetailPage from "./ProductDetailPage";
import { JewelleryCategoryPage, JewelleryLanding } from "./JewellerySectionPage";
import { KurtiCategoryPage, WomenDressCategoryPage, WomenDressLanding } from "./WomenDressSection";
import "./Home.css";
import shopping from "../assets/shopping.jpg";
import { materialSectionImages } from "../data/materialSectionImages";
import { topwearSectionImages } from "../data/topwearSectionImages";
import { pantSectionImages } from "../data/pantSectionImages";
import { palazzoSectionImages } from "../data/palazzoSectionImages";
import { jewellerySectionImages } from "../data/jewellerySectionImages";
const getUserStorageKey = (userId) => `dress_website_store_${userId}`;
const getCartItemKey = (product) => `${product.id}-${product.selectedSize || "default"}`;

const readUserStore = (userId) => {
  if (!userId) {
    return { likedItems: [], cartItems: [] };
  }

  try {
    const savedStore = window.localStorage.getItem(getUserStorageKey(userId));
    if (!savedStore) {
      return { likedItems: [], cartItems: [] };
    }

    const parsedStore = JSON.parse(savedStore);
    return {
      likedItems: Array.isArray(parsedStore.likedItems) ? parsedStore.likedItems : [],
      cartItems: Array.isArray(parsedStore.cartItems) ? parsedStore.cartItems : [],
    };
  } catch {
    return { likedItems: [], cartItems: [] };
  }
};

const readSavedSession = () => {
  try {
    const savedUser = window.localStorage.getItem("dress_website_user");
    if (!savedUser) {
      return { authUser: null, likedItems: [], cartItems: [] };
    }

    const parsedUser = JSON.parse(savedUser);
    const userStore = readUserStore(parsedUser.id);
    return {
      authUser: parsedUser,
      likedItems: userStore.likedItems,
      cartItems: userStore.cartItems,
    };
  } catch {
    return { authUser: null, likedItems: [], cartItems: [] };
  }
};

const extraTrendingProducts = [
  {
    id: 306,
    name: "Ivory Cotton Kurti",
    category: "Cotton kurti",
    badge: "Fresh",
    price: "Rs 799",
    image: "https://images.pexels.com/photos/26973350/pexels-photo-26973350.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 307,
    name: "Emerald Festive Suit",
    category: "Trending wear",
    badge: "Hot",
    price: "Rs 999",
    image: "https://images.pexels.com/photos/12752064/pexels-photo-12752064.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 308,
    name: "Mustard Printed Top",
    category: "Stylish top",
    badge: "New",
    price: "Rs 899",
    image: "https://images.pexels.com/photos/13584944/pexels-photo-13584944.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 309,
    name: "Blue Campus Kurti",
    category: "College wear",
    badge: "Limited",
    price: "Rs 1,299",
    image: "https://images.unsplash.com/photo-1632826727346-43a7ac6bcb1b?auto=format&fit=crop&q=80&w=900",
  },
];

const earringProducts = [
  {
    id: 501,
    name: "Gold Jhumka Earrings",
    category: "Jhumka",
    badge: "Best seller",
    price: "Rs 499",
    image: "https://images.pexels.com/photos/7016794/pexels-photo-7016794.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 502,
    name: "Pearl Hoop Earrings",
    category: "Hoops",
    badge: "New",
    price: "Rs 399",
    image: "https://images.pexels.com/photos/2422291/pexels-photo-2422291.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 503,
    name: "Stone Drop Earrings",
    category: "Drop & dangle",
    badge: "Trending",
    price: "Rs 599",
    image: "https://images.pexels.com/photos/4584443/pexels-photo-4584443.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 504,
    name: "Diamond Stud Earrings",
    category: "Studs",
    badge: "Hot",
    price: "Rs 349",
    image: "https://images.pexels.com/photos/30442521/pexels-photo-30442521.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 505,
    name: "Chandbali Earrings",
    category: "Chandbali",
    badge: "Limited",
    price: "Rs 529",
    image: "https://images.pexels.com/photos/14811629/pexels-photo-14811629.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 506,
    name: "Oxidised Dangle Earrings",
    category: "Drop & dangle",
    badge: "Fresh",
    price: "Rs 279",
    image: "https://images.pexels.com/photos/16439628/pexels-photo-16439628.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 507,
    name: "Kundan Jhumka",
    category: "Jhumka",
    badge: "Premium",
    price: "Rs 599",
    image: "https://images.pexels.com/photos/18678165/pexels-photo-18678165.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
  {
    id: 508,
    name: "Gold Hoop Earrings",
    category: "Hoops",
    badge: "Classic",
    price: "Rs 449",
    image: "https://images.pexels.com/photos/2422291/pexels-photo-2422291.jpeg?auto=compress&cs=tinysrgb&w=900",
  },
];

const productImages = [
  "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=700",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=700",
  "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=700",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=700",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=700",
  "https://images.pexels.com/photos/13584939/pexels-photo-13584939.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/26973350/pexels-photo-26973350.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.unsplash.com/photo-1632826727346-43a7ac6bcb1b?auto=format&fit=crop&q=80&w=900",
  "https://images.pexels.com/photos/12752064/pexels-photo-12752064.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/13584944/pexels-photo-13584944.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/13039870/pexels-photo-13039870.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/12579919/pexels-photo-12579919.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/6739340/pexels-photo-6739340.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/34767007/pexels-photo-34767007.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.pexels.com/photos/12327758/pexels-photo-12327758.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=700",
  "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80&w=700",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=700",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=700",
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=700",
  "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&q=80&w=700",
  "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?auto=format&fit=crop&q=80&w=700",
  "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&q=80&w=700",
  "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&q=80&w=700",
  "https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&q=80&w=700",
];

const imagePools = {
  kurti: [
    shopping,
    "https://images.pexels.com/photos/13584939/pexels-photo-13584939.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/26973350/pexels-photo-26973350.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1632826727346-43a7ac6bcb1b?auto=format&fit=crop&q=80&w=900",
    "https://images.pexels.com/photos/13584944/pexels-photo-13584944.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12327758/pexels-photo-12327758.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?auto=format&fit=crop&q=80&w=900",
  ],
  kurta: [
    "https://images.pexels.com/photos/12752064/pexels-photo-12752064.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/13039870/pexels-photo-13039870.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12579919/pexels-photo-12579919.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/34767007/pexels-photo-34767007.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12327758/pexels-photo-12327758.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/26973350/pexels-photo-26973350.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1632826727346-43a7ac6bcb1b?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=900",
  ],
  pant: [
    "https://images.pexels.com/photos/7716958/pexels-photo-7716958.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/7716953/pexels-photo-7716953.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/7716960/pexels-photo-7716960.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/5253944/pexels-photo-5253944.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&q=80&w=900",
  ],
  palazzo: [
    "https://images.pexels.com/photos/7716960/pexels-photo-7716960.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/7716958/pexels-photo-7716958.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=900",
    "https://images.pexels.com/photos/5253944/pexels-photo-5253944.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/7716953/pexels-photo-7716953.jpeg?auto=compress&cs=tinysrgb&w=900",
  ],
  material: [
    "https://images.pexels.com/photos/6739340/pexels-photo-6739340.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/6603535/pexels-photo-6603535.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/7679855/pexels-photo-7679855.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/6069552/pexels-photo-6069552.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1583846783214-7229a91b20ed?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1594734415578-00fc9540929b?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1601366533287-5ee4c763ae4e?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?auto=format&fit=crop&q=80&w=900",
  ],
  top: [
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&q=80&w=900",
    "https://images.pexels.com/photos/13584944/pexels-photo-13584944.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12752064/pexels-photo-12752064.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/26973350/pexels-photo-26973350.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12327758/pexels-photo-12327758.jpeg?auto=compress&cs=tinysrgb&w=900",
  ],
};

const getPoolName = (text) => {
  const value = String(text).toLowerCase();
  if (/kurti|kurtis/.test(value)) return "kurti";
  if (/palazzo/.test(value)) return "palazzo";
  if (/pant|trouser|pyjama|cigarette|wide leg|formal/.test(value)) return "pant";
  if (/material|fabric|banarasi|patiala|pakistani/.test(value)) return "material";
  if (/top|tunic|dress|shirt|gown|jumpsuit|t-shirt/.test(value)) return "top";
  return "kurta";
};

const getCategoryImage = (text, seed = 0) => {
  const pool = imagePools[getPoolName(text)] || imagePools.kurti;
  return pool[Math.abs(seed) % pool.length];
};

const createKurtiProducts = (baseId, category, names, images, prices) => (
  names.map((name, index) => ({
    id: baseId + index,
    name,
    category,
    badge: index % 3 === 0 ? "Best seller" : index % 3 === 1 ? "New" : "Trending",
    price: `Rs ${prices[index].toLocaleString("en-IN")}`,
    image: images[index % images.length],
    fallbackImage: images[(index + 1) % images.length],
  }))
);

const sectionPrices = {
  kurti: {
    all: [330, 426, 598, 720, 849, 999, 1199, 1399, 1599, 1799],
    anarkali: [699, 849, 999, 1199, 1299, 1399, 1499, 1599, 1749, 1899],
    rayon: [399, 449, 499, 549, 599, 649, 699, 749, 799, 899],
    cotton: [330, 399, 449, 499, 549, 599, 649, 699, 799, 899],
    straight: [499, 549, 599, 649, 699, 749, 849, 949, 1049, 1199],
    long: [599, 699, 799, 899, 999, 1099, 1199, 1299, 1399, 1499],
  },
  kurtaSet: {
    all: [999, 1199, 1399, 1499, 1599, 1699, 1799, 1899, 2099, 2299],
    palazzo: [1099, 1299, 1499, 1599, 1699, 1799, 1999, 2199, 2399, 2599],
    pant: [999, 1199, 1399, 1499, 1599, 1749, 1899, 1999, 2199, 2399],
    sharara: [1299, 1499, 1699, 1899, 2099, 2299, 2499, 2699, 2899, 3199],
    anarkali: [1199, 1399, 1599, 1799, 1999, 2199, 2399, 2599, 2799, 2999],
    cotton: [899, 999, 1199, 1299, 1399, 1499, 1599, 1699, 1799, 1999],
  },
  material: {
    all: [399, 499, 599, 699, 799, 899, 999, 1099, 1199, 1299],
    pakistani: [699, 799, 899, 999, 1099, 1199, 1299, 1399, 1499, 1699],
    cotton: [349, 399, 449, 499, 599, 699, 799, 899, 999, 1099],
    patiala: [499, 599, 699, 799, 899, 999, 1099, 1199, 1299, 1399],
    banarasi: [899, 999, 1199, 1399, 1599, 1799, 1999, 2199, 2399, 2599],
    party: [799, 999, 1199, 1399, 1499, 1699, 1899, 2099, 2299, 2499],
  },
  topwear: {
    all: [299, 399, 499, 599, 699, 799, 899, 999, 1099, 1199],
    tunics: [399, 499, 599, 699, 799, 899, 999, 1099, 1199, 1299],
    dresses: [599, 699, 799, 899, 999, 1199, 1399, 1599, 1799, 1999],
    tshirts: [249, 299, 349, 399, 449, 499, 549, 599, 699, 799],
    gowns: [999, 1199, 1399, 1599, 1799, 1999, 2299, 2499, 2799, 2999],
    sets: [799, 899, 999, 1199, 1399, 1499, 1699, 1899, 2099, 2299],
    shirts: [399, 499, 599, 699, 799, 899, 999, 1099, 1199, 1299],
    jumpsuits: [799, 899, 999, 1199, 1399, 1599, 1799, 1999, 2199, 2399],
    trends: [599, 699, 899, 999, 1199, 1399, 1599, 1799, 1999, 2199],
  },
  pant: {
    all: [399, 499, 599, 699, 799, 899, 999, 1099, 1199, 1299],
    trousers: [499, 599, 699, 799, 899, 999, 1099, 1199, 1299, 1399],
    wide: [599, 699, 799, 899, 999, 1099, 1199, 1299, 1399, 1499],
    straight: [449, 549, 649, 749, 849, 949, 1049, 1149, 1249, 1349],
    cigarette: [499, 599, 699, 799, 899, 999, 1099, 1199, 1299, 1399],
    pyjamas: [299, 349, 399, 449, 499, 549, 599, 649, 699, 799],
    formal: [699, 799, 899, 999, 1099, 1199, 1299, 1499, 1699, 1899],
  },
  palazzo: {
    all: [399, 499, 599, 699, 799, 899, 999, 1099, 1199, 1299],
    printed: [449, 549, 649, 749, 849, 949, 1049, 1149, 1249, 1349],
    cotton: [399, 499, 599, 699, 799, 899, 999, 1099, 1199, 1299],
    wide: [599, 699, 799, 899, 999, 1099, 1199, 1299, 1399, 1499],
    party: [799, 899, 999, 1199, 1399, 1599, 1799, 1999, 2199, 2399],
    kurta: [699, 799, 899, 999, 1099, 1199, 1399, 1599, 1799, 1999],
  },
};

const kurtiSectionImages = {
  all: [
    shopping,
    "https://images.pexels.com/photos/13584939/pexels-photo-13584939.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/26973350/pexels-photo-26973350.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1632826727346-43a7ac6bcb1b?auto=format&fit=crop&q=80&w=900",
    "https://images.pexels.com/photos/13584944/pexels-photo-13584944.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12327758/pexels-photo-12327758.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12752064/pexels-photo-12752064.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/13039870/pexels-photo-13039870.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12579919/pexels-photo-12579919.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/34767007/pexels-photo-34767007.jpeg?auto=compress&cs=tinysrgb&w=900",
  ],
  anarkali: [
    "https://images.pexels.com/photos/13039870/pexels-photo-13039870.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/34767007/pexels-photo-34767007.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12752064/pexels-photo-12752064.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12579919/pexels-photo-12579919.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1632826727346-43a7ac6bcb1b?auto=format&fit=crop&q=80&w=900",
    "https://images.pexels.com/photos/12327758/pexels-photo-12327758.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/13584939/pexels-photo-13584939.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/26973350/pexels-photo-26973350.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=900",
  ],
  rayon: [
    "https://images.pexels.com/photos/26973350/pexels-photo-26973350.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/13584944/pexels-photo-13584944.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12327758/pexels-photo-12327758.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=900",
    "https://images.pexels.com/photos/12752064/pexels-photo-12752064.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/13039870/pexels-photo-13039870.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1632826727346-43a7ac6bcb1b?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=900",
  ],
  cotton: [
    shopping,
    "https://images.pexels.com/photos/13584939/pexels-photo-13584939.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/26973350/pexels-photo-26973350.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12327758/pexels-photo-12327758.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1632826727346-43a7ac6bcb1b?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=900",
    "https://images.pexels.com/photos/13584944/pexels-photo-13584944.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12752064/pexels-photo-12752064.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/34767007/pexels-photo-34767007.jpeg?auto=compress&cs=tinysrgb&w=900",
  ],
  straight: [
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80&w=900",
    "https://images.pexels.com/photos/26973350/pexels-photo-26973350.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/13584944/pexels-photo-13584944.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12327758/pexels-photo-12327758.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12752064/pexels-photo-12752064.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/13584939/pexels-photo-13584939.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1632826727346-43a7ac6bcb1b?auto=format&fit=crop&q=80&w=900",
  ],
  long: [
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=900",
    "https://images.pexels.com/photos/13039870/pexels-photo-13039870.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/34767007/pexels-photo-34767007.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12579919/pexels-photo-12579919.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12327758/pexels-photo-12327758.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/13584944/pexels-photo-13584944.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1632826727346-43a7ac6bcb1b?auto=format&fit=crop&q=80&w=900",
  ],
};

const womensCategories = [
  { id: "kurti", label: "Kurti Sets", image: getCategoryImage("kurti set", 0) },
  { id: "kurta-set", label: "Kurta Set", image: getCategoryImage("kurta set", 1) },
  { id: "materials", label: "Materials", image: getCategoryImage("dress material fabric", 2) },
  { id: "short-top", label: "Short Top", image: getCategoryImage("top tunic", 3) },
  { id: "pant", label: "Pant", image: getCategoryImage("women pants trousers", 0) },
  { id: "palazzo", label: "Palazzo Pant", image: getCategoryImage("women palazzo pants", 3) },
];

const jewelleryCategories = [
  { id: "earrings", label: "Earrings", image: jewellerySectionImages.earrings[0] },
  { id: "jewelleries", label: "Jewelleries", image: jewellerySectionImages.jewelleries[0] },
  { id: "nailPolishes", label: "Nail Polishes", image: jewellerySectionImages.nailPolishes[0] },
  { id: "hairClips", label: "Hair Clips", image: jewellerySectionImages.hairClips[0] },
  { id: "bracelets", label: "Bracelets", image: jewellerySectionImages.bracelets[0] },
  { id: "hairBowClips", label: "Hair Bow Clips", image: jewellerySectionImages.hairBowClips[0] },
];

const kurtiSections = [
  { id: "all", label: "All Kurtis" },
  { id: "anarkali", label: "Anarkali Kurtis" },
  { id: "rayon", label: "Rayon Kurtis" },
  { id: "cotton", label: "Cotton Kurtis" },
  { id: "straight", label: "Straight Kurtis" },
  { id: "long", label: "Long Kurtis" },
];

const kurtiProductMap = {
  all: createKurtiProducts(600, "Kurtis", [
    "Cotton Cambric Kurti", "Rayon Pretty Kurti", "Rayon Kashvi Suit Kurti", "Georgette Trend Kurti", "Rayon Anarkali Kurti",
    "Crepe Polyester Kurti", "Black Banita Kurti", "Cotton Blend A-Line Kurti", "Poly Crepe Kurti", "Long Trendy Kurti",
  ], kurtiSectionImages.all, sectionPrices.kurti.all),
  anarkali: createKurtiProducts(630, "Anarkali Kurtis", [
    "Pink Rayon Anarkali Kurti", "Blue Festive Anarkali", "Yellow Printed Anarkali", "Wine Flared Anarkali", "Teal Party Anarkali",
    "Black Cotton Anarkali", "Green Yoke Anarkali", "Ivory Embroidered Anarkali", "Peach Daily Anarkali", "Navy Floral Anarkali",
  ], kurtiSectionImages.anarkali, sectionPrices.kurti.anarkali),
  rayon: createKurtiProducts(660, "Rayon Kurtis", [
    "Rayon Pretty Morning Kurti", "Rayon Kashvi Suit Kurti", "Rayon Myra Printed Kurti", "Rayon A-Line Kurti", "Rayon Office Kurti",
    "Rayon Daily Wear Kurti", "Rayon Pink Straight Kurti", "Rayon Black Work Kurti", "Rayon Teal Long Kurti", "Rayon Floral Kurti",
  ], kurtiSectionImages.rayon, sectionPrices.kurti.rayon),
  cotton: createKurtiProducts(690, "Cotton Kurtis", [
    "Cotton Cambric Printed Kurti", "Cotton Blend A-Line Kurti", "Cotton Office Kurti", "Cotton Yellow Daily Kurti", "Cotton Black Kurti",
    "Cotton Pink Floral Kurti", "Cotton Straight Kurti", "Cotton Blue Kurti", "Cotton Ivory Kurti", "Cotton Casual Kurti",
  ], kurtiSectionImages.cotton, sectionPrices.kurti.cotton),
  straight: createKurtiProducts(860, "Straight Kurtis", [
    "Black Straight Kurti", "Ivory Straight Kurti", "Pink Straight Kurti", "Rayon Straight Kurti", "Blue Straight Office Kurti",
    "Green Straight Kurti", "Wine Straight Kurti", "Cotton Straight Work Kurti", "Printed Straight Kurti", "Long Straight Kurti",
  ], kurtiSectionImages.straight, sectionPrices.kurti.straight),
  long: createKurtiProducts(890, "Long Kurtis", [
    "Teal Long Kurti", "Black Long Kurti", "Pink Long Rayon Kurti", "Blue Long Printed Kurti", "Yellow Long Cotton Kurti",
    "Green Long A-Line Kurti", "Wine Long Work Kurti", "Ivory Long Festive Kurti", "Navy Long Kurti", "Peach Long Daily Kurti",
  ], kurtiSectionImages.long, sectionPrices.kurti.long),
};

const kurtaSetSections = [
  { id: "all", label: "All Kurta Sets" },
  { id: "palazzo", label: "Kurta Palazzo Sets" },
  { id: "pant", label: "Kurta Pant Sets" },
  { id: "sharara", label: "Sharara Sets" },
  { id: "anarkali", label: "Anarkali Kurta Sets" },
  { id: "cotton", label: "Cotton Kurta Sets" },
];

const kurtaSetSectionImages = {
  all: [
    "https://images.pexels.com/photos/12752064/pexels-photo-12752064.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/13039870/pexels-photo-13039870.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12579919/pexels-photo-12579919.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/34767007/pexels-photo-34767007.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/26973350/pexels-photo-26973350.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1632826727346-43a7ac6bcb1b?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=900",
    "https://images.pexels.com/photos/12327758/pexels-photo-12327758.jpeg?auto=compress&cs=tinysrgb&w=900",
  ],
  palazzo: [
    "https://images.pexels.com/photos/7716960/pexels-photo-7716960.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/7716958/pexels-photo-7716958.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/13039870/pexels-photo-13039870.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/34767007/pexels-photo-34767007.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&q=80&w=900",
    "https://images.pexels.com/photos/26973350/pexels-photo-26973350.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1632826727346-43a7ac6bcb1b?auto=format&fit=crop&q=80&w=900",
  ],
  pant: [
    "https://images.pexels.com/photos/7716958/pexels-photo-7716958.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/7716953/pexels-photo-7716953.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/7716960/pexels-photo-7716960.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/5253944/pexels-photo-5253944.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=900",
    "https://images.pexels.com/photos/26973350/pexels-photo-26973350.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12752064/pexels-photo-12752064.jpeg?auto=compress&cs=tinysrgb&w=900",
  ],
  sharara: [
    "https://images.pexels.com/photos/13039870/pexels-photo-13039870.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12579919/pexels-photo-12579919.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/34767007/pexels-photo-34767007.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12752064/pexels-photo-12752064.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12327758/pexels-photo-12327758.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1632826727346-43a7ac6bcb1b?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=900",
    "https://images.pexels.com/photos/13584939/pexels-photo-13584939.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/26973350/pexels-photo-26973350.jpeg?auto=compress&cs=tinysrgb&w=900",
  ],
  anarkali: [
    "https://images.pexels.com/photos/34767007/pexels-photo-34767007.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12752064/pexels-photo-12752064.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/13039870/pexels-photo-13039870.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12579919/pexels-photo-12579919.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1632826727346-43a7ac6bcb1b?auto=format&fit=crop&q=80&w=900",
    "https://images.pexels.com/photos/12327758/pexels-photo-12327758.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=900",
    "https://images.pexels.com/photos/26973350/pexels-photo-26973350.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/13584939/pexels-photo-13584939.jpeg?auto=compress&cs=tinysrgb&w=900",
  ],
  cotton: [
    shopping,
    "https://images.pexels.com/photos/13584939/pexels-photo-13584939.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/26973350/pexels-photo-26973350.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12327758/pexels-photo-12327758.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.unsplash.com/photo-1632826727346-43a7ac6bcb1b?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=900",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=900",
    "https://images.pexels.com/photos/13584944/pexels-photo-13584944.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/12752064/pexels-photo-12752064.jpeg?auto=compress&cs=tinysrgb&w=900",
    "https://images.pexels.com/photos/34767007/pexels-photo-34767007.jpeg?auto=compress&cs=tinysrgb&w=900",
  ],
};

const kurtaSetProductMap = {
  all: createKurtiProducts(10000, "All Kurta Sets", [
    "Premium All Kurta Sets", "Classic All Kurta Sets", "Trendy All Kurta Sets", "Daily All Kurta Sets", "Festive All Kurta Sets",
    "Soft Cotton All Kurta Sets", "Printed All Kurta Sets", "Designer All Kurta Sets", "Office All Kurta Sets", "Party Wear All Kurta Sets",
  ], kurtaSetSectionImages.all, sectionPrices.kurtaSet.all),
  palazzo: createKurtiProducts(10030, "Kurta Palazzo Sets", [
    "Printed Kurta Palazzo Set", "Aqua Rayon Palazzo Set", "Ivory Work Palazzo Set", "Pink Floral Palazzo Set", "Navy Kurta Palazzo Set",
    "Green Cotton Palazzo Set", "Anarkali Palazzo Set", "Office Kurta Palazzo Set", "Festive Dupatta Palazzo Set", "Black Straight Palazzo Set",
  ], kurtaSetSectionImages.palazzo, sectionPrices.kurtaSet.palazzo),
  pant: createKurtiProducts(10060, "Kurta Pant Sets", [
    "Straight Kurta Pant Set", "Cotton Kurta Trouser Set", "Printed Kurta Pant Set", "Peach Office Pant Set", "Blue Daily Pant Set",
    "Black Work Kurta Pant Set", "Ivory Slim Pant Set", "Rayon Kurta Pant Set", "Maroon Festive Pant Set", "Green Comfort Pant Set",
  ], kurtaSetSectionImages.pant, sectionPrices.kurtaSet.pant),
  sharara: createKurtiProducts(10090, "Sharara Sets", [
    "Pink Sharara Kurta Set", "Ivory Festive Sharara", "Green Party Sharara Set", "Black Embroidered Sharara", "Blue Georgette Sharara",
    "Yellow Wedding Sharara", "Maroon Silk Sharara", "Floral Daily Sharara", "Peach Dupatta Sharara", "Navy Work Sharara",
  ], kurtaSetSectionImages.sharara, sectionPrices.kurtaSet.sharara),
  anarkali: createKurtiProducts(10120, "Anarkali Kurta Sets", [
    "Flared Anarkali Kurta Set", "Pink Anarkali Pant Set", "Blue Printed Anarkali Set", "Ivory Festive Anarkali", "Black Work Anarkali Set",
    "Green Long Anarkali Set", "Yellow Rayon Anarkali", "Maroon Wedding Anarkali", "Peach Cotton Anarkali", "Navy Embroidered Anarkali",
  ], kurtaSetSectionImages.anarkali, sectionPrices.kurtaSet.anarkali),
  cotton: createKurtiProducts(10150, "Cotton Kurta Sets", [
    "Cotton Block Print Kurta Set", "Summer Cotton Kurta Set", "Office Cotton Kurta Pant", "Pink Cotton Kurta Set", "Blue Cotton Kurta Set",
    "Ivory Cotton Palazzo Set", "Green Daily Cotton Set", "Straight Cotton Kurta Set", "Floral Cotton Suit Set", "Black Cotton Kurta Set",
  ], kurtaSetSectionImages.cotton, sectionPrices.kurtaSet.cotton),
};

const materialSections = [
  { id: "all", label: "All Dress Materials" },
  { id: "pakistani", label: "Pakistani Dress Materials" },
  { id: "cotton", label: "Cotton Dress Materials" },
  { id: "patiala", label: "Patiala Dress Materials" },
  { id: "banarasi", label: "Banarasi Dress Materials" },
  { id: "party", label: "Party Wear Dress Materials" },
];

const topwearSections = [
  { id: "all", label: "All Topwear" },
  { id: "tunics", label: "Tops & Tunics" },
  { id: "dresses", label: "Dresses" },
  { id: "tshirts", label: "T-shirts" },
  { id: "gowns", label: "Gowns" },
  { id: "sets", label: "Tops & Bottom Sets" },
  { id: "shirts", label: "Shirts" },
  { id: "jumpsuits", label: "Jumpsuits" },
  { id: "trends", label: "New Trends" },
];

const pantSections = [
  { id: "all", label: "All Pants" },
  { id: "trousers", label: "Trousers & Pants" },
  { id: "wide", label: "Wide Leg Pants" },
  { id: "straight", label: "Straight Pants" },
  { id: "cigarette", label: "Cigarette Pants" },
  { id: "pyjamas", label: "Pyjamas" },
  { id: "formal", label: "Formal Pants" },
];

const palazzoSections = [
  { id: "all", label: "All Palazzo Pants" },
  { id: "printed", label: "Printed Palazzo Pants" },
  { id: "cotton", label: "Cotton Palazzo Pants" },
  { id: "wide", label: "Wide Leg Palazzo" },
  { id: "party", label: "Party Wear Palazzo" },
  { id: "kurta", label: "Kurta Palazzo Pants" },
];

const materialProductMap = {
  all: createKurtiProducts(10200, "All Dress Materials", [
    "Premium All Dress Materials", "Classic All Dress Materials", "Trendy All Dress Materials", "Daily All Dress Materials", "Festive All Dress Materials",
    "Soft Cotton All Dress Materials", "Printed All Dress Materials", "Designer All Dress Materials", "Office All Dress Materials", "Party Wear All Dress Materials",
  ], materialSectionImages.all, sectionPrices.material.all),
  pakistani: createKurtiProducts(10230, "Pakistani Dress Materials", [
    "Premium Pakistani Dress Material", "Classic Pakistani Lawn Suit", "Trendy Pakistani Dress Material", "Daily Pakistani Suit Fabric", "Festive Pakistani Dress Material",
    "Soft Cotton Pakistani Material", "Printed Pakistani Dress Material", "Designer Pakistani Suit Fabric", "Office Pakistani Dress Material", "Party Wear Pakistani Material",
  ], materialSectionImages.pakistani, sectionPrices.material.pakistani),
  cotton: createKurtiProducts(10260, "Cotton Dress Materials", [
    "Cotton Block Print Material", "Summer Cotton Dress Material", "Office Cotton Suit Fabric", "Pink Cotton Dress Material", "Blue Cotton Dress Material",
    "Ivory Cotton Suit Material", "Green Daily Cotton Material", "Straight Cotton Dress Material", "Floral Cotton Suit Fabric", "Black Cotton Dress Material",
  ], materialSectionImages.cotton, sectionPrices.material.cotton),
  patiala: createKurtiProducts(10290, "Patiala Dress Materials", [
    "Punjabi Patiala Dress Material", "Cotton Patiala Suit Fabric", "Printed Patiala Dress Material", "Pink Patiala Suit Material", "Blue Patiala Dress Material",
    "Green Patiala Suit Fabric", "Festive Patiala Dress Material", "Daily Patiala Suit Material", "Floral Patiala Dress Material", "Black Patiala Suit Fabric",
  ], materialSectionImages.patiala, sectionPrices.material.patiala),
  banarasi: createKurtiProducts(10320, "Banarasi Dress Materials", [
    "Banarasi Silk Dress Material", "Gold Work Banarasi Material", "Classic Banarasi Suit Fabric", "Pink Banarasi Dress Material", "Navy Banarasi Suit Material",
    "Green Banarasi Silk Fabric", "Festive Banarasi Material", "Designer Banarasi Suit Fabric", "Maroon Banarasi Dress Material", "Black Banarasi Suit Material",
  ], materialSectionImages.banarasi, sectionPrices.material.banarasi),
  party: createKurtiProducts(10350, "Party Wear Dress Materials", [
    "Embroidered Party Dress Material", "Sequins Party Suit Fabric", "Designer Party Dress Material", "Pink Party Wear Material", "Blue Party Suit Fabric",
    "Green Festive Dress Material", "Maroon Party Wear Suit", "Floral Party Dress Material", "Peach Party Suit Fabric", "Black Party Wear Material",
  ], materialSectionImages.party, sectionPrices.material.party),
};

const topwearProductMap = {
  all: createKurtiProducts(10400, "All Topwear", [
    "Premium All Topwear", "Classic All Topwear", "Trendy All Topwear", "Daily All Topwear", "Festive All Topwear",
    "Soft Cotton All Topwear", "Printed All Topwear", "Designer All Topwear", "Office All Topwear", "Party Wear All Topwear",
  ], topwearSectionImages.all, sectionPrices.topwear.all),
  tunics: createKurtiProducts(10430, "Tops & Tunics", [
    "Printed Tunic Top", "Aqua Rayon Tunic", "Ivory Work Tunic", "Pink Floral Top", "Navy Casual Tunic",
    "Green Cotton Top", "Longline Tunic Top", "Office Tunic Top", "Festive Embroidered Tunic", "Black Straight Tunic",
  ], topwearSectionImages.tunics, sectionPrices.topwear.tunics),
  dresses: createKurtiProducts(10460, "Dresses", [
    "Floral Midi Dress", "Pink Casual Dress", "Blue Printed Dress", "Ivory Festive Dress", "Black Party Dress",
    "Green Long Dress", "Yellow Rayon Dress", "Maroon Evening Dress", "Peach Cotton Dress", "Navy Embroidered Dress",
  ], topwearSectionImages.dresses, sectionPrices.topwear.dresses),
  tshirts: createKurtiProducts(10490, "T-shirts", [
    "Classic Cotton T-shirt", "Printed Daily T-shirt", "Black Casual T-shirt", "Pink Relaxed T-shirt", "Blue Soft T-shirt",
    "Green Weekend T-shirt", "White Basic T-shirt", "Office Casual T-shirt", "Graphic Trend T-shirt", "Navy Comfort T-shirt",
  ], topwearSectionImages.tshirts, sectionPrices.topwear.tshirts),
  gowns: createKurtiProducts(10520, "Gowns", [
    "Party Wear Gown", "Pink Festive Gown", "Blue Designer Gown", "Ivory Embroidered Gown", "Black Evening Gown",
    "Green Long Gown", "Yellow Georgette Gown", "Maroon Wedding Gown", "Peach Net Gown", "Navy Work Gown",
  ], topwearSectionImages.gowns, sectionPrices.topwear.gowns),
  sets: createKurtiProducts(10550, "Tops & Bottom Sets", [
    "Printed Top Bottom Set", "Aqua Co-ord Set", "Ivory Work Top Set", "Pink Floral Co-ord", "Navy Casual Set",
    "Green Cotton Top Set", "Office Top Bottom Set", "Festive Co-ord Set", "Black Straight Top Set", "Peach Daily Co-ord",
  ], topwearSectionImages.sets, sectionPrices.topwear.sets),
  shirts: createKurtiProducts(10580, "Shirts", [
    "Classic Cotton Shirt", "Printed Casual Shirt", "White Office Shirt", "Pink Relaxed Shirt", "Blue Daily Shirt",
    "Green Weekend Shirt", "Black Work Shirt", "Ivory Formal Shirt", "Striped Trend Shirt", "Navy Comfort Shirt",
  ], topwearSectionImages.shirts, sectionPrices.topwear.shirts),
  jumpsuits: createKurtiProducts(10610, "Jumpsuits", [
    "Black Casual Jumpsuit", "Printed Daily Jumpsuit", "Blue Denim Jumpsuit", "Pink Party Jumpsuit", "Green Cotton Jumpsuit",
    "Ivory Work Jumpsuit", "Maroon Evening Jumpsuit", "Wide Leg Jumpsuit", "Peach Summer Jumpsuit", "Navy Trend Jumpsuit",
  ], topwearSectionImages.jumpsuits, sectionPrices.topwear.jumpsuits),
  trends: createKurtiProducts(10640, "New Trends", [
    "Trending Statement Top", "New Season Dress", "Modern Tunic Top", "Fashion Co-ord Set", "Party Trend Gown",
    "Soft Cotton Trend Top", "Printed Trend Shirt", "Designer Jumpsuit", "Office Trend Top", "Weekend Trend Wear",
  ], topwearSectionImages.trends, sectionPrices.topwear.trends),
};

const pantProductMap = {
  all: createKurtiProducts(10700, "All Pants", [
    "Premium All Pants", "Classic All Pants", "Trendy All Pants", "Daily All Pants", "Festive All Pants",
    "Soft Cotton All Pants", "Printed All Pants", "Designer All Pants", "Office All Pants", "Party Wear All Pants",
  ], pantSectionImages.all, sectionPrices.pant.all),
  trousers: createKurtiProducts(10730, "Trousers & Pants", [
    "Classic Trouser Pant", "Aqua Office Trouser", "Ivory Work Pant", "Pink Casual Trouser", "Navy Formal Pant",
    "Green Cotton Trouser", "Black Slim Pant", "Daily Comfort Trouser", "Festive Straight Pant", "Wide Waist Trouser",
  ], pantSectionImages.trousers, sectionPrices.pant.trousers),
  wide: createKurtiProducts(10760, "Wide Leg Pants", [
    "Wide Leg Cotton Pant", "Black Wide Leg Pant", "Printed Wide Leg Pant", "Peach Office Wide Pant", "Blue Daily Wide Pant",
    "Ivory Comfort Wide Pant", "Green Rayon Wide Pant", "Maroon Festive Wide Pant", "Formal Wide Leg Trouser", "Navy Wide Leg Pant",
  ], pantSectionImages.wide, sectionPrices.pant.wide),
  straight: createKurtiProducts(10790, "Straight Pants", [
    "Black Straight Pant", "Ivory Straight Pant", "Pink Straight Pant", "Rayon Straight Pant", "Blue Office Straight Pant",
    "Green Straight Pant", "Wine Straight Pant", "Cotton Straight Work Pant", "Printed Straight Pant", "Navy Straight Pant",
  ], pantSectionImages.straight, sectionPrices.pant.straight),
  cigarette: createKurtiProducts(10820, "Cigarette Pants", [
    "Black Cigarette Pant", "Ivory Cigarette Pant", "Pink Ankle Cigarette Pant", "Rayon Cigarette Pant", "Blue Office Cigarette Pant",
    "Green Slim Cigarette Pant", "Wine Cigarette Pant", "Cotton Work Cigarette Pant", "Printed Cigarette Pant", "Navy Cigarette Pant",
  ], pantSectionImages.cigarette, sectionPrices.pant.cigarette),
  pyjamas: createKurtiProducts(10850, "Pyjamas", [
    "Cotton Lounge Pyjama", "Printed Daily Pyjama", "Black Comfort Pyjama", "Pink Soft Pyjama", "Blue Night Pyjama",
    "Green Cotton Pyjama", "Ivory Relaxed Pyjama", "Rayon Lounge Pyjama", "Maroon Festive Pyjama", "Navy Comfort Pyjama",
  ], pantSectionImages.pyjamas, sectionPrices.pant.pyjamas),
  formal: createKurtiProducts(10880, "Formal Pants", [
    "Black Formal Pant", "Ivory Formal Trouser", "Navy Office Pant", "Grey Work Trouser", "Blue Formal Pant",
    "Green Office Trouser", "Slim Formal Pant", "Straight Formal Trouser", "Wide Formal Pant", "Classic Work Pant",
  ], pantSectionImages.formal, sectionPrices.pant.formal),
};

const palazzoProductMap = {
  all: createKurtiProducts(10900, "All Palazzo Pants", [
    "Premium All Palazzo Pants", "Classic All Palazzo Pants", "Trendy All Palazzo Pants", "Daily All Palazzo Pants", "Festive All Palazzo Pants",
    "Soft Cotton All Palazzo Pants", "Printed All Palazzo Pants", "Designer All Palazzo Pants", "Office All Palazzo Pants", "Party Wear All Palazzo Pants",
  ], palazzoSectionImages.all, sectionPrices.palazzo.all),
  printed: createKurtiProducts(10930, "Printed Palazzo Pants", [
    "Floral Printed Palazzo", "Aqua Printed Palazzo", "Ivory Printed Palazzo", "Pink Printed Palazzo", "Navy Printed Palazzo",
    "Green Printed Palazzo", "Block Print Palazzo", "Office Printed Palazzo", "Festive Printed Palazzo", "Black Printed Palazzo",
  ], palazzoSectionImages.printed, sectionPrices.palazzo.printed),
  cotton: createKurtiProducts(10960, "Cotton Palazzo Pants", [
    "Cotton Block Print Palazzo", "Summer Cotton Palazzo", "Office Cotton Palazzo", "Pink Cotton Palazzo", "Blue Cotton Palazzo",
    "Ivory Cotton Palazzo", "Green Daily Cotton Palazzo", "Straight Cotton Palazzo", "Floral Cotton Palazzo", "Black Cotton Palazzo",
  ], palazzoSectionImages.cotton, sectionPrices.palazzo.cotton),
  wide: createKurtiProducts(10990, "Wide Leg Palazzo", [
    "Wide Leg Palazzo Pant", "Black Wide Palazzo", "Printed Wide Palazzo", "Peach Office Palazzo", "Blue Daily Palazzo",
    "Ivory Comfort Palazzo", "Green Rayon Palazzo", "Maroon Festive Palazzo", "Formal Wide Palazzo", "Navy Wide Palazzo",
  ], palazzoSectionImages.wide, sectionPrices.palazzo.wide),
  party: createKurtiProducts(11020, "Party Wear Palazzo", [
    "Embroidered Party Palazzo", "Sequins Party Palazzo", "Designer Party Palazzo", "Pink Party Wear Palazzo", "Blue Party Palazzo",
    "Green Festive Palazzo", "Maroon Party Wear Palazzo", "Floral Party Palazzo", "Peach Party Palazzo", "Black Party Palazzo",
  ], palazzoSectionImages.party, sectionPrices.palazzo.party),
  kurta: createKurtiProducts(11050, "Kurta Palazzo Pants", [
    "Printed Kurta Palazzo Pant", "Aqua Kurta Palazzo", "Ivory Work Palazzo", "Pink Floral Kurta Palazzo", "Navy Kurta Palazzo",
    "Green Cotton Kurta Palazzo", "Anarkali Palazzo Pant", "Office Kurta Palazzo", "Festive Dupatta Palazzo", "Black Straight Kurta Palazzo",
  ], palazzoSectionImages.kurta, sectionPrices.palazzo.kurta),
};

const createJewelleryProducts = (baseId, category, names, images, prices) => (
  names.map((name, index) => ({
    id: baseId + index,
    name,
    category,
    badge: index % 3 === 0 ? "Best seller" : index % 3 === 1 ? "New" : "Trending",
    price: `Rs ${prices[index].toLocaleString("en-IN")}`,
    image: images[index % images.length],
    fallbackImage: images[(index + 1) % images.length],
  }))
);

const jewelleryProductMap = {
  earrings: createJewelleryProducts(11100, "Earrings", [
    "Princess Fusion Earrings", "Allure Glittering Earrings", "New Earrings & Studs", "Feminine Pearl Earrings", "Sizzling Graceful Earrings",
    "Allure Elegant Earrings", "Fancy Jewellery Earrings", "Twinkling Glittering Earrings", "Colorful Mangalsutra Earrings", "Unique Festival Earrings",
  ], jewellerySectionImages.earrings, [203, 97, 111, 128, 125, 137, 158, 175, 100, 451]),
  jewelleries: createJewelleryProducts(11130, "Jewelleries", [
    "Princess Fusion Jewellery Set", "Allure Glittering Women Jewellery", "New Bridal Jewellery Set", "Feminine Beautiful Jewellery", "Sizzling Graceful Jewellery",
    "Allure Elegant Jewellery Set", "Fancy Necklace Jewellery Set", "Twinkling Gold Jewellery", "Colorful Jewellery Combo", "Pendants & Lockets",
  ], jewellerySectionImages.jewelleries, [203, 97, 111, 128, 125, 137, 158, 175, 234, 108]),
  nailPolishes: createJewelleryProducts(11160, "Nail Polishes", [
    "Glossy Pink Nail Polish", "Classic Red Nail Polish", "Glitter Gold Nail Polish", "Nude Shine Nail Polish", "Party Purple Nail Polish",
    "Matte Black Nail Polish", "Pearl White Nail Polish", "Coral Daily Nail Polish", "Blue Trend Nail Polish", "Multi Shade Nail Polish",
  ], jewellerySectionImages.nailPolishes, [89, 75, 99, 120, 145, 110, 135, 155, 175, 199]),
  hairClips: createJewelleryProducts(11190, "Hair Clips", [
    "Pearl Hair Clip", "Floral Hair Clip", "Gold Claw Hair Clip", "Daily Hair Clip Set", "Crystal Hair Clip",
    "Black Hair Clip", "Pastel Hair Clip", "Designer Hair Clip", "Office Hair Clip", "Party Wear Hair Clip",
  ], jewellerySectionImages.hairClips, [69, 85, 99, 120, 145, 160, 175, 199, 220, 249]),
  bracelets: createJewelleryProducts(11220, "Bracelets", [
    "Gold Bracelet", "Pearl Bracelet", "Stone Work Bracelet", "Daily Wear Bracelet", "Charm Bracelet",
    "Designer Bracelet", "Traditional Bracelet", "Minimal Bracelet", "Party Wear Bracelet", "Layered Bracelet",
  ], jewellerySectionImages.bracelets, [149, 179, 199, 229, 249, 275, 299, 320, 349, 399]),
  hairBowClips: createJewelleryProducts(11250, "Hair Bow Clips", [
    "Satin Hair Bow Clip", "Pearl Hair Bow Clip", "Black Hair Bow Clip", "Pink Hair Bow Clip", "Floral Hair Bow Clip",
    "Designer Hair Bow Clip", "School Hair Bow Clip", "Party Hair Bow Clip", "Velvet Hair Bow Clip", "Pastel Hair Bow Clip",
  ], jewellerySectionImages.hairBowClips, [59, 75, 85, 99, 115, 130, 145, 160, 179, 199]),
};

const categoryPageConfigs = {
  kurti: {
    sidebarTitle: "Kurtis",
    sections: kurtiSections,
    productMap: kurtiProductMap,
  },
  "kurta-set": {
    sidebarTitle: "Kurta Sets",
    sections: kurtaSetSections,
    productMap: kurtaSetProductMap,
  },
  materials: {
    sidebarTitle: "Dress Materials",
    sections: materialSections,
    productMap: materialProductMap,
  },
  "short-top": {
    sidebarTitle: "Topwear",
    sections: topwearSections,
    productMap: topwearProductMap,
  },
  pant: {
    sidebarTitle: "Pants",
    sections: pantSections,
    productMap: pantProductMap,
  },
  palazzo: {
    sidebarTitle: "Palazzo Pants",
    sections: palazzoSections,
    productMap: palazzoProductMap,
  },
};

function Home() {
  const { data, loading, error } = useFashionData();
  const [initialSession] = useState(readSavedSession);
  const [view, setView] = useState("home");
  const [womensCategory, setWomensCategory] = useState(null);
  const [jewelleryCategory, setJewelleryCategory] = useState(null);
  const [kurtiSection, setKurtiSection] = useState("all");
  const [categorySection, setCategorySection] = useState("all");
  const [likedItems, setLikedItems] = useState(initialSession.likedItems);
  const [cartItems, setCartItems] = useState(initialSession.cartItems);
  const [authUser, setAuthUser] = useState(initialSession.authUser);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");
  const [pendingAction, setPendingAction] = useState(null);
  const [lastCartTarget, setLastCartTarget] = useState({ view: "home", target: "#trending" });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailReturnTarget, setDetailReturnTarget] = useState({ view: "home", target: "#trending" });
  const historyReadyRef = useRef(false);

  useEffect(() => {
    if (authUser) {
      window.localStorage.setItem("dress_website_user", JSON.stringify(authUser));
    } else {
      window.localStorage.removeItem("dress_website_user");
    }
  }, [authUser]);

  useEffect(() => {
    if (!authUser?.id) {
      return;
    }

    window.localStorage.setItem(
      getUserStorageKey(authUser.id),
      JSON.stringify({ likedItems, cartItems })
    );
  }, [authUser?.id, likedItems, cartItems]);

  const allTrendingProducts = useMemo(() => {
    if (!data?.products) {
      return [];
    }

    return [...data.products, ...extraTrendingProducts];
  }, [data]);

  const allDetailProducts = useMemo(() => {
    const products = [
      ...allTrendingProducts,
      ...earringProducts,
      ...Object.values(kurtiProductMap).flat(),
      ...Object.values(kurtaSetProductMap).flat(),
      ...Object.values(materialProductMap).flat(),
      ...Object.values(topwearProductMap).flat(),
      ...Object.values(pantProductMap).flat(),
      ...Object.values(palazzoProductMap).flat(),
      ...Object.values(jewelleryProductMap).flat(),
    ];

    return [...new Map(products.map((product) => [product.id, product])).values()];
  }, [allTrendingProducts]);

  useEffect(() => {
    const handleBrowserNavigation = (event) => {
      const nextView = event.state?.view || "home";
      const nextTarget = event.state?.target;

      if (nextView === "product-detail") {
        const nextProduct = allDetailProducts.find((product) => product.id === event.state?.productId);
        if (nextProduct) {
          setSelectedProduct(nextProduct);
        }
        if (event.state?.returnTarget) {
          setDetailReturnTarget(event.state.returnTarget);
        }
      }

      setView(nextView);
      if (event.state?.categoryId) {
        setWomensCategory(event.state.categoryId);
      }
      if (event.state?.kurtiSection) {
        setKurtiSection(event.state.kurtiSection);
      }
      if (event.state?.categorySection) {
        setCategorySection(event.state.categorySection);
      }
      if (event.state?.jewelleryCategory) {
        setJewelleryCategory(event.state.jewelleryCategory);
      }
      if (nextTarget) {
        window.setTimeout(() => {
          document.querySelector(nextTarget)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    if (!historyReadyRef.current) {
      const initialTarget = window.location.hash || undefined;
      window.history.replaceState({ view: "home", target: initialTarget }, "", initialTarget || window.location.pathname);
      historyReadyRef.current = true;
    }

    window.addEventListener("popstate", handleBrowserNavigation);
    return () => window.removeEventListener("popstate", handleBrowserNavigation);
  }, [allDetailProducts]);

  useEffect(() => {
    const isCompactViewport = window.matchMedia("(max-width: 980px)").matches;
    const revealItems = document.querySelectorAll(
      ".section-heading, .collection-carousel, .product-card, .look-card, .offer-banner, .newsletter, .cart-item-card, .order-summary-card, .empty-state"
    );

    revealItems.forEach((item, index) => {
      item.classList.add("scroll-reveal");
      item.classList.remove("is-visible");
      item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 4) * (isCompactViewport ? 45 : 70)}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: isCompactViewport ? 0.04 : 0.16,
        rootMargin: isCompactViewport ? "0px 0px -2% 0px" : "0px 0px -8% 0px",
      }
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [view, data, likedItems.length, cartItems.length]);

  const navigate = (nextView, target, options = {}) => {
    if ((nextView === "cart" || nextView === "likes") && !authUser) {
      setPendingAction(null);
      setAuthModalMode("login");
      setAuthModalOpen(true);
      return;
    }

    if (options.categoryId) {
      setWomensCategory(options.categoryId);
    }
    if (options.kurtiSection) {
      setKurtiSection(options.kurtiSection);
    }
    if (options.categorySection) {
      setCategorySection(options.categorySection);
    }
    if (options.jewelleryCategory) {
      setJewelleryCategory(options.jewelleryCategory);
    }
    setView(nextView);
    if (options.pushState !== false) {
      const nextUrl = target || (nextView === "home" ? "#home" : `#${nextView}`);
      window.history.pushState(
        {
          view: nextView,
          target,
          categoryId: options.categoryId,
          kurtiSection: options.kurtiSection,
          categorySection: options.categorySection,
          jewelleryCategory: options.jewelleryCategory,
          productId: options.productId,
          returnTarget: options.returnTarget,
        },
        "",
        nextUrl
      );
    }

    if (target) {
      window.setTimeout(() => {
        document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleLike = (product) => {
    setLikedItems((items) => (
      items.some((item) => item.id === product.id)
        ? items.filter((item) => item.id !== product.id)
        : [...items, product]
    ));
  };

  const addToCart = (product, returnTarget = { view: "home", target: "#trending" }) => {
    setLastCartTarget(returnTarget);
    setCartItems((items) => {
      const nextCartKey = getCartItemKey(product);
      const existingItem = items.find((item) => getCartItemKey(item) === nextCartKey);

      if (existingItem) {
        return items.map((item) => (
          getCartItemKey(item) === nextCartKey
            ? { ...item, quantity: item.quantity + 1, returnTarget }
            : item
        ));
      }

      return [...items, { ...product, cartKey: nextCartKey, quantity: 1, returnTarget }];
    });
  };

  const removeFromCart = (product) => {
    const cartKey = getCartItemKey(product);
    setCartItems((items) => items.filter((item) => getCartItemKey(item) !== cartKey));
  };

  const updateCartQuantity = (product, nextQuantity) => {
    if (nextQuantity < 1) {
      removeFromCart(product);
      return;
    }

    setCartItems((items) => items.map((item) => (
      getCartItemKey(item) === getCartItemKey(product) ? { ...item, quantity: nextQuantity } : item
    )));
  };

  const continueShopping = () => {
    navigate(lastCartTarget.view, lastCartTarget.target, lastCartTarget);
  };

  const handleAuthSuccess = (user) => {
    const userStore = readUserStore(user.id);
    setAuthUser(user);
    setLikedItems(userStore.likedItems);
    setCartItems(userStore.cartItems);
    setAuthModalOpen(false);

    if (!pendingAction) {
      return;
    }

    if (pendingAction.type === "addToCart") {
      addToCart(pendingAction.product, pendingAction.returnTarget);
      setView("cart");
    }

    if (pendingAction.type === "like") {
      toggleLike(pendingAction.product);
    }

    setPendingAction(null);
  };

  const handleAddToCart = (product, returnTarget = { view: "home", target: "#trending" }) => {
    if (!authUser) {
      setPendingAction({ type: "addToCart", product, returnTarget });
      setAuthModalMode("login");
      setAuthModalOpen(true);
      return;
    }

    addToCart(product, returnTarget);
  };

  const handleBuyNow = (product) => {
    // add to cart and navigate to cart view
    if (!authUser) {
      setPendingAction({ type: "addToCart", product, returnTarget: { view: "cart" } });
      setAuthModalMode("login");
      setAuthModalOpen(true);
      return;
    }

    addToCart(product, { view: "cart" });
    navigate("cart", undefined);
  };

  const openProductDetail = (product, returnTarget = { view, target: undefined }) => {
    setSelectedProduct(product);
    setDetailReturnTarget(returnTarget);
    navigate("product-detail", undefined, { productId: product.id, returnTarget });
  };

  const addDetailProductToCart = (product) => {
    handleAddToCart(product, detailReturnTarget);
    if (authUser) {
      navigate("cart", undefined, { returnTarget: detailReturnTarget });
    }
  };

  const buyDetailProductNow = (product) => {
    handleBuyNow(product);
  };

  const handleLike = (product) => {
    if (!authUser) {
      setPendingAction({ type: "like", product });
      setAuthModalMode("login");
      setAuthModalOpen(true);
      return;
    }

    toggleLike(product);
  };

  const handleAccountClick = () => {
    setAuthModalMode("login");
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    setAuthUser(null);
    setLikedItems([]);
    setCartItems([]);
    setPendingAction(null);
    navigate("home", "#home");
  };

  const handleSearch = (term) => {
    const normalizedTerm = term.trim().toLowerCase();
    if (!normalizedTerm) {
      return false;
    }

    if (["jewellery", "jewelry", "earring", "earrings", "jhumka", "bracelet", "clip", "nail"].some((word) => normalizedTerm.includes(word))) {
      navigate("jewellery");
      return true;
    }

    if (["kurti", "kurtis"].some((word) => normalizedTerm.includes(word))) {
      navigate("kurtis", undefined, { categoryId: "kurti", kurtiSection: "all" });
      return true;
    }

    if (["dress", "dresses", "style", "trending", "wear"].some((word) => normalizedTerm.includes(word))) {
      navigate("trending");
      return true;
    }

    return false;
  };

  const openWomensCategory = (categoryId) => {
    navigate("womens-category", undefined, { categoryId, categorySection: "all" });
  };

  const openJewelleryCategory = (categoryId) => {
    navigate("jewellery-category", undefined, { jewelleryCategory: categoryId });
  };

  const activeWomensCategory = womensCategories.find((category) => category.id === womensCategory) || womensCategories[1];
  const activeCategoryConfig = categoryPageConfigs[activeWomensCategory.id] || categoryPageConfigs["kurta-set"];
  const activeCategorySection = activeCategoryConfig.sections.find((section) => section.id === categorySection) || activeCategoryConfig.sections[0];
  const activeCategoryProducts = activeCategoryConfig.productMap[activeCategorySection.id] || activeCategoryConfig.productMap.all;
  const activeKurtiSection = kurtiSections.find((section) => section.id === kurtiSection) || kurtiSections[0];
  const activeKurtiProducts = kurtiProductMap[activeKurtiSection.id] || kurtiProductMap.all;
  const activeJewelleryCategory = jewelleryCategories.find((category) => category.id === jewelleryCategory) || jewelleryCategories[0];
  const activeJewelleryProducts = jewelleryProductMap[activeJewelleryCategory.id] || jewelleryProductMap.earrings;
  const similarProducts = selectedProduct
    ? [
        ...allDetailProducts.filter((product) => product.id !== selectedProduct.id && product.category === selectedProduct.category),
        ...allDetailProducts.filter((product) => product.id !== selectedProduct.id && product.category !== selectedProduct.category),
      ].slice(0, 4)
    : [];

  if (loading) {
    return (
      <main className="site-shell loading-view">
        <div className="loader-ring" />
        <p>Curating the collection...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="site-shell loading-view">
        <p>Fashion API load aagala. Please refresh once.</p>
      </main>
    );
  }

  return (
    <div className="site-shell">
      <BrandNavbar
        brand={data.brand}
        navItems={data.navItems}
        onNavigate={navigate}
        likedCount={likedItems.length}
        cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
        authUser={authUser}
        onAccount={handleAccountClick}
        onLogout={handleLogout}
        onSearch={handleSearch}
      />
      {view === "home" && (
        <>
          <HeroSection slides={data.heroSlides} stats={data.stats} />
          <CollectionCarousel collections={data.collections} />
          <TrendingProducts
            products={data.products}
            likedItems={likedItems}
            onLike={handleLike}
            onAddToCart={(product) => handleAddToCart(product, { view: "home", target: "#trending" })}
            onOpenProduct={(product) => openProductDetail(product, { view: "home", target: "#trending" })}
            onSeeAll={() => navigate("trending")}
          />
          <EarringsSection
            products={earringProducts.slice(0, 5)}
            likedItems={likedItems}
            onLike={handleLike}
            onAddToCart={(product) => handleAddToCart(product, { view: "home", target: "#earrings" })}
            onOpenProduct={(product) => openProductDetail(product, { view: "home", target: "#earrings" })}
            onShowMore={() => navigate("earrings")}
          />
          <LookbookSection looks={data.lookbook} />
          <OfferBanner offer={data.offer} />
        </>
      )}
      {view === "womens" && (
        <WomenDressLanding
          categories={womensCategories}
          productImages={productImages}
          onOpenCategory={openWomensCategory}
          onBackHome={() => navigate("home")}
        />
      )}
      {view === "womens-category" && (
        <WomenDressCategoryPage
          config={activeCategoryConfig}
          activeCategory={activeWomensCategory}
          activeSection={activeCategorySection}
          products={activeCategoryProducts}
          likedItems={likedItems}
          onSelectSection={(sectionId) => {
            setCategorySection(sectionId);
            navigate("womens-category", undefined, { categoryId: activeWomensCategory.id, categorySection: sectionId });
          }}
          onLike={handleLike}
          onAddToCart={(product) => handleAddToCart(product, { view: "womens-category", categoryId: activeWomensCategory.id, categorySection: activeCategorySection.id })}
          onBuyNow={handleBuyNow}
          onOpenProduct={(product) => openProductDetail(product, { view: "womens-category", categoryId: activeWomensCategory.id, categorySection: activeCategorySection.id })}
          onBack={() => navigate("womens")}
        />
      )}
      {view === "jewellery" && (
        <JewelleryLanding
          categories={jewelleryCategories}
          fallbackImages={Object.values(jewellerySectionImages).flat()}
          onOpenCategory={openJewelleryCategory}
          onBackHome={() => navigate("home")}
        />
      )}
      {view === "jewellery-category" && (
        <JewelleryCategoryPage
          activeCategory={activeJewelleryCategory}
          products={activeJewelleryProducts}
          likedItems={likedItems}
          onBack={() => navigate("jewellery")}
          onLike={handleLike}
          onAddToCart={(product) => handleAddToCart(product, {
            view: "jewellery-category",
            jewelleryCategory: activeJewelleryCategory.id,
          })}
          onBuyNow={handleBuyNow}
          onOpenProduct={(product) => openProductDetail(product, {
            view: "jewellery-category",
            jewelleryCategory: activeJewelleryCategory.id,
          })}
        />
      )}
      {view === "kurtis" && (
        <KurtiCategoryPage
          sections={kurtiSections}
          activeSection={activeKurtiSection}
          products={activeKurtiProducts}
          likedItems={likedItems}
          onSelectSection={(sectionId) => {
            setKurtiSection(sectionId);
            navigate("kurtis", undefined, { categoryId: "kurti", kurtiSection: sectionId });
          }}
          onBack={() => navigate("womens")}
          onLike={handleLike}
          onAddToCart={(product) => handleAddToCart(product, { view: "kurtis", categoryId: "kurti", kurtiSection })}
          onBuyNow={handleBuyNow}
          onOpenProduct={(product) => openProductDetail(product, { view: "kurtis", categoryId: "kurti", kurtiSection })}
        />
      )}
      {view === "trending" && (
        <ProductPage
          eyebrow="All trending"
          title="All trending styles"
          products={allTrendingProducts}
          likedItems={likedItems}
          onLike={handleLike}
          onAddToCart={(product) => handleAddToCart(product, { view: "trending" })}
          onBuyNow={handleBuyNow}
          onOpenProduct={(product) => openProductDetail(product, { view: "trending" })}
          onBack={() => navigate("home")}
        />
      )}
      {view === "earrings" && (
        <ProductPage
          eyebrow="More earrings"
          title="Earrings for every women's look"
          products={earringProducts}
          likedItems={likedItems}
          onLike={handleLike}
          onAddToCart={(product) => handleAddToCart(product, { view: "earrings" })}
          onBuyNow={handleBuyNow}
          onOpenProduct={(product) => openProductDetail(product, { view: "earrings" })}
          onBack={() => navigate("home")}
        />
      )}
      {view === "likes" && (
        <ProductPage
          eyebrow="My likes"
          title="Your liked styles"
          products={likedItems}
          likedItems={likedItems}
          onLike={handleLike}
          onAddToCart={(product) => handleAddToCart(product, { view: "likes" })}
          onBuyNow={handleBuyNow}
          onRemoveFromLike={(product) => toggleLike(product)}
          isLikesView
          onOpenProduct={(product) => openProductDetail(product, { view: "likes" })}
          onBack={() => navigate("home")}
        />
      )}
      {view === "product-detail" && (
        <ProductDetailPage
          product={selectedProduct}
          likedItems={likedItems}
          similarProducts={similarProducts}
          onBack={() => navigate(detailReturnTarget.view, detailReturnTarget.target, detailReturnTarget)}
          onLike={handleLike}
          onAddToCart={addDetailProductToCart}
          onBuyNow={buyDetailProductNow}
          onOpenProduct={(product) => openProductDetail(product, detailReturnTarget)}
        />
      )}
      {view === "cart" && (
        <ProductPage
          eyebrow="My cart"
          title="Your cart items"
          products={cartItems}
          likedItems={likedItems}
          onLike={handleLike}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onRemoveFromCart={removeFromCart}
          onUpdateCartQuantity={updateCartQuantity}
          isCartView
          onBack={continueShopping}
        />
      )}
      <Newsletter />
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />
    </div>
  );
}

export default Home;






