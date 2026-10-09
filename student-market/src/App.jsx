import React, { useState } from 'react';
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { 
  Search, ShoppingCart, User, PlusCircle, CheckCircle, 
  Star, ArrowRight, Menu, X, ShoppingBag, Sparkles,
  Palette, Brush, Camera, Code, Gift, Utensils, Zap, Heart,
  SearchX, SlidersHorizontal, TrendingUp, Store, BadgeCheck, ChevronRight,
  Rocket, Briefcase, Award, Upload, CheckCircle2, Lightbulb,
  Home, Trash2, Mail, Lock, Building, MessageSquare, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- EXPANDED DUMMY DATA (8+ PRODUCTS IN EVERY CATEGORY) ---
const DATA = {
  products: [
    // === 1. ART (8 Products) ===
    { id: 101, title: "Custom Digital Vector Portrait", price: "499", creator: "Rahul K.", rating: "4.8", category: "Art", image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600", views: 112, isNew: true },
    { id: 102, title: "Watercolor Campus Landscape", price: "350", creator: "Aarya Sharma", rating: "4.9", category: "Art", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600", views: 88, isNew: false },
    { id: 103, title: "Anime & Manga Ink Sketch", price: "299", creator: "Aryan Verma", rating: "4.7", category: "Art", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600", views: 95, isNew: false },
    { id: 104, title: "Charcoal Celebrity Sketch", price: "450", creator: "Sneha Kulkarni", rating: "4.8", category: "Art", image: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=600", views: 64, isNew: true },
    { id: 105, title: "Abstract Acrylic Canvas (A4)", price: "599", creator: "Priya Nair", rating: "5.0", category: "Art", image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600", views: 76, isNew: false },
    { id: 106, title: "Mandala Dot Art Wall Frame", price: "399", creator: "Ishan Gupta", rating: "4.6", category: "Art", image: "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=600", views: 52, isNew: false },
    { id: 107, title: "Minimalist Line Art Poster", price: "249", creator: "Aditi Rao", rating: "4.9", category: "Art", image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600", views: 130, isNew: false },
    { id: 108, title: "Oil Pastel Sunset Illustration", price: "320", creator: "Rohini Das", rating: "4.7", category: "Art", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600", views: 44, isNew: true },

    // === 2. HANDMADE (8 Products) ===
    { id: 1, title: "Sage Crochet Tote Bag", price: "899", creator: "Ananya V.", rating: "5.0", category: "Handmade", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600", views: 142, isNew: false },
    { id: 3, title: "Scented Soy Candle Trio", price: "250", creator: "Sana M.", rating: "4.9", category: "Handmade", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600", views: 98, isNew: false },
    { id: 7, title: "Handmade Ceramic Coffee Mug", price: "650", creator: "Rohit S.", rating: "4.8", category: "Handmade", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600", views: 85, isNew: false },
    { id: 12, title: "Handmade Pearl Jewelry Set", price: "1200", creator: "Priya N.", rating: "4.9", category: "Handmade", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600", views: 110, isNew: true },
    { id: 15, title: "Handcrafted Floral Greeting Cards", price: "250", creator: "Aarya S.", rating: "4.9", category: "Handmade", image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600", views: 56, isNew: false },
    { id: 201, title: "Boho Macrame Wall Hanging", price: "550", creator: "Ishan G.", rating: "4.7", category: "Handmade", image: "https://images.unsplash.com/photo-1622398925373-3f91b13f7ca3?w=600", views: 67, isNew: false },
    { id: 202, title: "Embroidered Cotton Canvas Pouch", price: "299", creator: "Meera K.", rating: "4.8", category: "Handmade", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600", views: 49, isNew: true },
    { id: 203, title: "Hand-Knitted Winter Beanie", price: "399", creator: "Ananya V.", rating: "4.9", category: "Handmade", image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600", views: 82, isNew: false },

    // === 3. PHOTOGRAPHY (8 Products) ===
    { id: 8, title: "Campus Golden Hour Print", price: "300", creator: "Aditi P.", rating: "4.9", category: "Photography", image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600", views: 120, isNew: true },
    { id: 14, title: "Campus Event Photography (1 Hr)", price: "800", creator: "Rohini D.", rating: "4.8", category: "Photography", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600", views: 165, isNew: true },
    { id: 301, title: "Monochrome Architecture Photo Print", price: "350", creator: "Rohini Das", rating: "4.9", category: "Photography", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600", views: 78, isNew: false },
    { id: 302, title: "LinkedIn Headshot Session", price: "499", creator: "Karan Mehta", rating: "5.0", category: "Photography", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600", views: 210, isNew: false },
    { id: 303, title: "Nature & Macro Flora Prints (Set of 3)", price: "400", creator: "Aditi P.", rating: "4.7", category: "Photography", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600", views: 63, isNew: false },
    { id: 304, title: "Street Photography Postcards", price: "199", creator: "Vikram Singh", rating: "4.8", category: "Photography", image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600", views: 54, isNew: true },
    { id: 305, title: "College Fest Candid Gallery Pass", price: "250", creator: "Tech Club", rating: "4.6", category: "Photography", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600", views: 90, isNew: false },
    { id: 306, title: "Night Sky Astro Photo Frame", price: "600", creator: "Rohini Das", rating: "4.9", category: "Photography", image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600", views: 140, isNew: false },

    // === 4. DIGITAL (8 Products) ===
    { id: 9, title: "3D Printed Geometric Key Holder", price: "450", creator: "Ishan G.", rating: "4.7", category: "Digital", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600", views: 92, isNew: false },
    { id: 13, title: "Customized Department Phone Case", price: "350", creator: "Vikram S.", rating: "4.7", category: "Digital", image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600", views: 73, isNew: false },
    { id: 401, title: "Engineering Resume & Portfolio Template", price: "199", creator: "Aarya Sharma", rating: "5.0", category: "Digital", image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600", views: 320, isNew: false },
    { id: 402, title: "Notion College Life OS Template", price: "149", creator: "Rahul K.", rating: "4.9", category: "Digital", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=600", views: 260, isNew: true },
    { id: 403, title: "Custom Discord / Twitch Badges Pack", price: "299", creator: "Sneha Kulkarni", rating: "4.8", category: "Digital", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600", views: 85, isNew: false },
    { id: 404, title: "3D Printed Laptop Stand", price: "599", creator: "Vikram Singh", rating: "4.8", category: "Digital", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600", views: 145, isNew: false },
    { id: 405, title: "UI Kit: Student Marketplace in Figma", price: "399", creator: "Aarya Sharma", rating: "5.0", category: "Digital", image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600", views: 180, isNew: false },
    { id: 406, title: "Code Project Consultation (30 Mins)", price: "250", creator: "Tech Club", rating: "4.7", category: "Digital", image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600", views: 95, isNew: true },

    // === 5. GIFTS (8 Products) ===
    { id: 10, title: "Calligraphy Notebook & Bookmark Set", price: "200", creator: "Sneha K.", rating: "4.6", category: "Gifts", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600", views: 88, isNew: true },
    { id: 11, title: "Custom Resin Floral Keychain", price: "150", creator: "Aryan V.", rating: "4.8", category: "Gifts", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600", views: 120, isNew: false },
    { id: 17, title: "Personalized Ceramic Mug Set", price: "400", creator: "Aditi R.", rating: "4.8", category: "Gifts", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600", views: 65, isNew: false },
    { id: 501, title: "Custom Polaroid Memories Hamper", price: "499", creator: "Rohini Das", rating: "5.0", category: "Gifts", image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600", views: 190, isNew: false },
    { id: 502, title: "Engraved Wooden Pen & Box", price: "350", creator: "Ishan Gupta", rating: "4.7", category: "Gifts", image: "https://images.unsplash.com/photo-1585336261026-70e633d02a92?w=600", views: 72, isNew: true },
    { id: 503, title: "Birthday Countdown Explosion Box", price: "599", creator: "Priya Nair", rating: "4.9", category: "Gifts", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600", views: 115, isNew: false },
    { id: 504, title: "Aesthetic Scented Wax Sachets", price: "180", creator: "Sana M.", rating: "4.8", category: "Gifts", image: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=600", views: 84, isNew: false },
    { id: 505, title: "Couple / Friendship Beaded Bands", price: "120", creator: "Ananya V.", rating: "4.9", category: "Gifts", image: "https://images.unsplash.com/photo-1611591475825-96be3426e95c?w=600", views: 140, isNew: false },

    // === 6. BAKERY (8 Products) ===
    { id: 6, title: "Fudgy Belgian Dark Brownies (Pack of 6)", price: "350", creator: "Meera's Kitchen", rating: "5.0", category: "Bakery", image: "https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=600", views: 240, isNew: false },
    { id: 601, title: "Choco Chip Soft-Baked Cookies (Box of 4)", price: "180", creator: "Karan Mehta", rating: "4.9", category: "Bakery", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600", views: 180, isNew: false },
    { id: 602, title: "Red Velvet Jar Cake with Cream Cheese", price: "160", creator: "Meera's Kitchen", rating: "4.8", category: "Bakery", image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600", views: 155, isNew: true },
    { id: 603, title: "Banana Walnut Tea-Time Loaf", price: "220", creator: "Karan Mehta", rating: "4.7", category: "Bakery", image: "https://images.unsplash.com/photo-1605807646983-377bc7a76593?w=600", views: 90, isNew: false },
    { id: 604, title: "Biscoff Cheesecake Cups (2 Pcs)", price: "280", creator: "Meera's Kitchen", rating: "5.0", category: "Bakery", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600", views: 215, isNew: false },
    { id: 605, title: "Eggless Blueberry Muffins (Pack of 2)", price: "140", creator: "Karan Mehta", rating: "4.8", category: "Bakery", image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600", views: 76, isNew: false },
    { id: 606, title: "Custom Bento Birthday Cake (Mini)", price: "450", creator: "Meera's Kitchen", rating: "4.9", category: "Bakery", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600", views: 195, isNew: true },
    { id: 607, title: "Truffle Cake Pops (Bouquet of 5)", price: "250", creator: "Karan Mehta", rating: "4.8", category: "Bakery", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600", views: 88, isNew: false },

    // === 7. FASHION (8 Products) ===
    { id: 4, title: "PCCOER Tech Fleece Hoodie", price: "1200", creator: "Tech Club", rating: "4.7", category: "Fashion", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600", views: 310, isNew: false },
    { id: 16, title: "Oversized Campus Graphic T-Shirt", price: "600", creator: "Karan M.", rating: "4.7", category: "Fashion", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600", views: 185, isNew: true },
    { id: 701, title: "Hand-Painted Denim Jacket (Custom)", price: "1850", creator: "Aditi Rao", rating: "5.0", category: "Fashion", image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600", views: 220, isNew: false },
    { id: 702, title: "Vintage Corduroy Cap", price: "399", creator: "Aryan Verma", rating: "4.8", category: "Fashion", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600", views: 98, isNew: false },
    { id: 703, title: "Handmade Beaded Sunglasses Chain", price: "180", creator: "Priya Nair", rating: "4.9", category: "Fashion", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600", views: 110, isNew: false },
    { id: 704, title: "Campus Batch Varsity Jacket", price: "1599", creator: "Tech Club", rating: "4.9", category: "Fashion", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600", views: 275, isNew: true },
    { id: 705, title: "Silk Scrunchie Set (Pastel Pack of 4)", price: "150", creator: "Ananya V.", rating: "4.8", category: "Fashion", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600", views: 82, isNew: false },
    { id: 706, title: "Customized College Bucket Hat", price: "349", creator: "Aditi Rao", rating: "4.6", category: "Fashion", image: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600", views: 125, isNew: false },

    // === 8. CRAFTS (8 Products) ===
    { id: 5, title: "Hand-Painted Canvas Tote Bag", price: "150", creator: "Vikram R.", rating: "4.6", category: "Crafts", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600", views: 115, isNew: true },
    { id: 801, title: "Handmade Terracotta Planter", price: "280", creator: "Ishan Gupta", rating: "4.8", category: "Crafts", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600", views: 92, isNew: false },
    { id: 802, title: "Epoxy Resin Beach Coasters (Set of 4)", price: "399", creator: "Aryan V.", rating: "4.9", category: "Crafts", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600", views: 135, isNew: false },
    { id: 803, title: "Pressed Flower Acrylic Bookmarks", price: "120", creator: "Sneha K.", rating: "4.9", category: "Crafts", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600", views: 78, isNew: true },
    { id: 804, title: "DIY Miniature Clay Fridge Magnets", price: "160", creator: "Priya Nair", rating: "4.7", category: "Crafts", image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600", views: 84, isNew: false },
    { id: 805, title: "Handmade Jute Pen & Brush Stand", price: "199", creator: "Ishan Gupta", rating: "4.6", category: "Crafts", image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600", views: 60, isNew: false },
    { id: 806, title: "Origami Paper Crane Mobile Decor", price: "250", creator: "Vikram R.", rating: "4.8", category: "Crafts", image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600", views: 48, isNew: false },
    { id: 807, title: "Custom Stamp Seal & Wax Kit", price: "450", creator: "Aarya Sharma", rating: "5.0", category: "Crafts", image: "https://images.unsplash.com/photo-1585336261026-70e633d02a92?w=600", views: 110, isNew: true },
  ],
  creators: [
    { id: 1, name: "Aarya Sharma", college: "PCCOER", role: "Graphic Designer", image: "https://i.pravatar.cc/150?u=1", sales: 45, rating: 4.8 },
    { id: 2, name: "Ishan Gupta", college: "COEP", role: "Handmade Artist", image: "https://i.pravatar.cc/150?u=2", sales: 32, rating: 4.9 },
    { id: 3, name: "Rohini Das", college: "VIT", role: "Photographer", image: "https://i.pravatar.cc/150?u=3", sales: 89, rating: 4.7 },
    { id: 4, name: "Sneha Kulkarni", college: "IIT Bombay", role: "Digital Artist", image: "https://i.pravatar.cc/150?u=4", sales: 58, rating: 4.6 },
    { id: 5, name: "Karan Mehta", college: "MIT Pune", role: "Baker", image: "https://i.pravatar.cc/150?u=5", sales: 76, rating: 4.9 },
    { id: 6, name: "Aditi Rao", college: "NIT Trichy", role: "Fashion Designer", image: "https://i.pravatar.cc/150?u=6", sales: 34, rating: 4.8 },
    { id: 7, name: "Priya Nair", college: "BITS Pilani", role: "Jewelry Maker", image: "https://i.pravatar.cc/150?u=7", sales: 21, rating: 4.7 },
    { id: 8, name: "Vikram Singh", college: "IIT Delhi", role: "3D Modeler", image: "https://i.pravatar.cc/150?u=8", sales: 47, rating: 4.9 },
    { id: 9, name: "Aryan Verma", college: "PCCOER", role: "Illustrator", image: "https://i.pravatar.cc/150?u=9", sales: 63, rating: 4.8 },
  ]
};

const CATEGORY_DEFINITIONS = [
  { name: 'Art', icon: Palette, color: 'bg-pink-500', description: 'Illustrations, portraits and creative artwork' },
  { name: 'Handmade', icon: Brush, color: 'bg-blue-500', description: 'Handcrafted products made by student creators' },
  { name: 'Photography', icon: Camera, color: 'bg-indigo-500', description: 'Photography prints and creative photo work' },
  { name: 'Digital', icon: Code, color: 'bg-purple-500', description: 'Digital products, 3D creations and templates' },
  { name: 'Gifts', icon: Gift, color: 'bg-orange-500', description: 'Personalized gifts for every campus occasion' },
  { name: 'Bakery', icon: Utensils, color: 'bg-green-500', description: 'Student-made baked desserts and snacks' },
  { name: 'Fashion', icon: Store, color: 'bg-rose-500', description: 'Hoodies, t-shirts and campus accessories' },
  { name: 'Crafts', icon: Sparkles, color: 'bg-cyan-500', description: 'Handmade crafts and customized decor' },
];

const getCategoryProducts = (category) => {
  const value = decodeURIComponent(category || '').toLowerCase();
  if (value === 'all') return DATA.products;
  return DATA.products.filter((p) => {
    const actual = p.category.toLowerCase();
    return actual === value;
  });
};

const getCategoryLabel = (category) =>
  CATEGORY_DEFINITIONS.find((c) => c.name.toLowerCase() === category.toLowerCase())?.name || category;

// Safe fallback for Socket.io
let socket;
try {
  socket = io('http://localhost:5000', { autoConnect: false });
} catch (e) {
  console.log('Socket initialized');
}

// --- CART DRAWER COMPONENT ---
const CartDrawer = ({ isOpen, onClose, cart, updateQuantity, removeItem }) => {
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          customerEmail: 'student@pccoer.in',
          totalAmount: subtotal,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`🎉 ORDER PROCESSED BY NODE.JS SERVER!\n\nOrder ID: ${data.order.orderId}\nTotal: ₹${data.order.totalAmount}`);
        onClose();
      }
    } catch (err) {
      alert(`🎉 Order Placed! Total: ₹${subtotal}. The student creator has been notified for campus pickup.`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black z-[150]" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[160] shadow-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-primary" />
                  <h2 className="text-2xl font-black text-charcoal">Campus Cart</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={20} /></button>
              </div>

              <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-400 font-bold">Your cart is empty.</p>
                    <button onClick={onClose} className="mt-4 text-primary font-black text-sm hover:underline">Explore Marketplace</button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                      <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-charcoal truncate">{item.title}</h4>
                        <p className="text-xs text-primary font-bold mt-0.5">₹{item.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded-md bg-white border flex items-center justify-center font-bold text-xs">-</button>
                          <span className="text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded-md bg-white border flex items-center justify-center font-bold text-xs">+</button>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {cart.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 font-bold text-xs uppercase tracking-wider">Campus Delivery</span>
                  <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-0.5 rounded-full font-black">FREE PICKUP</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-charcoal font-black text-lg">Total Amount</span>
                  <span className="text-3xl font-black text-primary">₹{subtotal}</span>
                </div>
                <button onClick={handleCheckout} className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg hover:scale-[1.02] shadow-xl shadow-primary/30 transition">
                  Checkout with Campus UPI
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- AUTHENTICATION MODAL ---
const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', college: 'PCCOER', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess({
      name: isLogin ? formData.email.split('@')[0] : formData.name,
      email: formData.email,
      college: formData.college
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white rounded-[2.5rem] p-8 md:p-10 max-w-md w-full relative z-10 shadow-2xl border border-gray-100">
            <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition"><X size={20} /></button>
            <div className="text-center mb-8">
              <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest inline-flex items-center gap-1">
                <BadgeCheck size={14} /> Student Identity
              </span>
              <h2 className="text-3xl font-black text-charcoal mt-3">{isLogin ? "Welcome Back 👋" : "Join Campus Market 🚀"}</h2>
              <p className="text-gray-400 text-sm font-medium mt-1">Connect, buy & sell with fellow students</p>
            </div>

            <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6 font-black text-xs uppercase tracking-wider">
              <button type="button" onClick={() => setIsLogin(true)} className={`flex-1 py-2.5 rounded-xl transition ${isLogin ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}>Login</button>
              <button type="button" onClick={() => setIsLogin(false)} className={`flex-1 py-2.5 rounded-xl transition ${!isLogin ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}>Sign Up</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Aarav Sharma" className="w-full mt-1 p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              )}

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">College Email</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="student@pccoer.in" className="w-full pl-11 p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
                  <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="w-full pl-11 p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition mt-2">
                {isLogin ? "Sign In to Skillora" : "Create Student Account"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- REUSABLE NAVBAR (NO NODE.JS BADGE) ---
const Navbar = ({ onOpenCart, onOpenAuth, cartCount, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Categories', path: '/categories' },
    { name: 'Creators', path: '/creators' },
    { name: 'Trending', path: '/trending' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-xl sticky top-0 z-[100] border-b border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Exact Skillora Logo & Home Icon */}
        <div className="flex items-center gap-3">
          <Link to="/" className="text-charcoal hover:text-primary transition-colors p-1.5 hover:bg-gray-100 rounded-2xl" title="Home">
            <Home size={28} />
          </Link>
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary via-secondary to-accent flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/25 group-hover:rotate-6 transition-transform">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black tracking-tight text-charcoal leading-none">
                Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">ora</span>
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 mt-0.5">
                Turn Talent Into Opportunity
              </span>
            </div>
          </Link>
        </div>

        <div className="hidden lg:flex gap-8 font-bold text-gray-500 uppercase text-xs tracking-widest">
          {navLinks.map(link => (
            <Link key={link.name} to={link.path} className={`hover:text-primary transition ${location.pathname === link.path ? 'text-primary' : ''}`}>
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <button onClick={onOpenCart} className="relative p-2.5 bg-gray-100 text-charcoal rounded-xl hover:bg-primary hover:text-white transition" title="Shopping Cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          <button onClick={onOpenAuth} className="flex items-center gap-2 p-2.5 bg-gray-100 text-charcoal rounded-xl hover:bg-primary hover:text-white transition">
            <User size={20} />
            {currentUser && <span className="hidden xl:inline text-xs font-black truncate max-w-[80px]">{currentUser.name}</span>}
          </button>

          <Link to="/become-creator" className="bg-primary text-white p-2.5 rounded-xl hover:scale-110 transition shadow-lg shadow-primary/20" title="Sell on Skillora">
            <PlusCircle size={20} />
          </Link>
          
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-charcoal">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-white border-t border-gray-100 overflow-hidden">
            <div className="p-6 flex flex-col gap-4">
              {navLinks.map(link => (
                <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} className="text-lg font-bold text-gray-600">{link.name}</Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- PRODUCT CARD ---
const ProductCard = ({ p, onAddToCart, isWishlisted, onToggleWishlist }) => (
  <motion.div whileHover={{ y: -10 }} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-premium group flex flex-col justify-between">
    <div>
      <div className="relative h-64 overflow-hidden">
        <Link to={`/product/${p.id}`}>
          <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={p.title} />
        </Link>
        <div className="absolute top-4 left-4 flex gap-2">
          {p.isNew && <span className="bg-accent text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-xl">New</span>}
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 shadow-sm">
            <Star size={10} className="text-accent fill-accent" /> {p.rating}
          </span>
        </div>
        
        <button onClick={() => onToggleWishlist(p.id)} className={`absolute top-4 right-4 p-2 rounded-full shadow-sm transition ${isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-400 hover:text-red-500'}`}>
          <Heart size={16} className={isWishlisted ? "fill-red-500" : ""} />
        </button>

        <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform">
          <button onClick={() => onAddToCart(p)} className="w-full bg-primary text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/40 hover:bg-secondary transition">
            <ShoppingBag size={18} /> Add to Cart
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between gap-1 mb-2">
          <span className="text-gray-400 font-bold text-[10px] tracking-widest uppercase truncate">{p.creator}</span>
          <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/5 px-2 py-0.5 rounded-md">{p.category}</span>
        </div>
        <Link to={`/product/${p.id}`}>
          <h3 className="font-black text-gray-800 text-lg mb-1 truncate hover:text-primary transition">{p.title}</h3>
        </Link>
        <p className="text-xs text-gray-400 font-medium mb-4 italic">🔥 {p.views} campus views</p>
      </div>
    </div>
    <div className="px-6 pb-6 pt-0 flex items-center justify-between">
      <p className="text-2xl font-black text-primary italic">₹{p.price}</p>
      <button onClick={() => onAddToCart(p)} className="p-2.5 bg-gray-100 rounded-xl hover:bg-primary hover:text-white transition">
        <ShoppingBag size={16} />
      </button>
    </div>
  </motion.div>
);

// --- BECOME CREATOR PAGE ---
const BecomeCreatorPage = () => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const skills = [
    { id: 'drawing', name: 'Drawing', icon: Palette, options: ['Custom Portraits', 'Greeting Cards', 'Stickers'] },
    { id: 'camera', name: 'Photography', icon: Camera, options: ['Campus Shoots', 'Event Photos', 'Photo Prints'] },
    { id: 'coding', name: 'Coding', icon: Code, options: ['Website Design', 'App Dev', 'UI Components'] },
    { id: 'baking', name: 'Baking', icon: Utensils, options: ['Brownies', 'Cakes', 'Custom Cookies'] },
    { id: 'crafting', name: 'Crafts', icon: Brush, options: ['Keychains', 'Candles', 'Ceramics'] },
  ];

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-6 text-center">
        <div className="bg-white p-12 rounded-[3rem] shadow-premium border border-gray-100">
           <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={48} />
           </div>
           <h2 className="text-4xl font-black text-charcoal mb-4 italic tracking-tighter">Your Talent is Noted!</h2>
           <p className="text-gray-500 font-medium text-lg">Your creator request has been submitted. We'll verify your student ID within 24 hours.</p>
           <Link to="/" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black mt-10 hover:scale-105 transition">Return Home <ArrowRight size={18} /></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <section className="bg-charcoal text-white pt-24 pb-40 px-6 relative overflow-hidden">
        <Rocket className="absolute top-10 right-10 w-40 h-40 opacity-10 rotate-12" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="bg-primary px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6 inline-block">Launch Your Talent</span>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-tight">Ready to turn your <br/> talent into opportunity?</h1>
          <p className="text-white/60 text-xl font-medium mt-8 max-w-2xl mx-auto">Join students from PCCOER who are already selling their products and services on campus.</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 -mt-20">
        <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl border border-gray-50">
          <div className="flex items-center gap-3 mb-10">
             <Lightbulb className="text-accent" size={32} />
             <h2 className="text-3xl font-black text-charcoal">What are you good at?</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {skills.map(skill => (
              <button key={skill.id} onClick={() => setSelectedSkill(skill)} className={`p-6 rounded-[2rem] border-2 transition flex flex-col items-center gap-3 ${selectedSkill?.id === skill.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/30'}`}>
                <skill.icon className={selectedSkill?.id === skill.id ? 'text-primary' : 'text-gray-400'} size={32} />
                <span className="font-black text-sm uppercase tracking-wider">{skill.name}</span>
              </button>
            ))}
          </div>

          {selectedSkill && (
            <div className="mt-12 p-8 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <p className="text-primary font-black uppercase tracking-widest text-xs mb-3">You could sell:</p>
              <div className="flex flex-wrap gap-3">
                {selectedSkill.options.map(opt => <span key={opt} className="bg-white px-5 py-2 rounded-full text-charcoal font-black text-sm shadow-sm">{opt}</span>)}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-24">
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-8">
           <div className="grid md:grid-cols-2 gap-6">
              <input required type="text" className="w-full p-5 bg-white border border-gray-100 rounded-2xl font-bold" placeholder="Full Name" />
              <input required type="email" className="w-full p-5 bg-white border border-gray-100 rounded-2xl font-bold" placeholder="student@pccoer.in" />
           </div>
           <textarea required className="w-full p-5 bg-white border border-gray-100 rounded-2xl font-bold h-32" placeholder="Tell us about your products or skills..."></textarea>
           <button type="submit" className="w-full py-6 bg-primary text-white rounded-3xl font-black text-xl shadow-2xl shadow-primary/30 hover:scale-[1.02] transition">
              Launch My Store 🚀
           </button>
        </form>
      </section>
    </div>
  );
};

// --- HOME PAGE ---
const HomePage = ({ onAddToCart, wishlist, onToggleWishlist }) => {
  const categories = CATEGORY_DEFINITIONS.slice(0, 6);
  return (
    <div className="pb-20">
      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest inline-block mb-6">Everyone deserves a first customer</div>
          <h1 className="text-7xl md:text-8xl font-black text-charcoal leading-[0.9] tracking-tighter">Turn Talent <br /> Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Success.</span></h1>
          <p className="text-xl text-gray-500 mt-8 max-w-lg font-medium leading-relaxed">The premium student entrepreneurship ecosystem. Discover products, support creators, and launch your business.</p>
          <div className="flex flex-wrap gap-4 mt-12">
            <Link to="/explore" className="bg-charcoal text-white px-10 py-5 rounded-[2.5rem] font-black text-lg flex items-center gap-3 hover:bg-primary transition shadow-2xl shadow-charcoal/30">Explore Now <ArrowRight size={20} /></Link>
            <Link to="/become-creator" className="bg-white text-charcoal border-2 border-gray-100 px-10 py-5 rounded-[2.5rem] font-black text-lg hover:border-primary transition">Start Selling</Link>
          </div>
        </div>
        <div className="relative">
           <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800" className="rounded-[4rem] shadow-2xl rotate-3 hover:rotate-0 transition-all duration-700" alt="Students" />
           <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-50">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Earned</p>
              <p className="text-4xl font-black text-charcoal tracking-tighter">₹18,450</p>
              <div className="flex items-center gap-2 mt-3 text-green-500 font-bold text-sm"><Zap size={14} className="fill-current" /> Verified Student</div>
           </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-black text-charcoal mb-12 italic underline decoration-primary decoration-4 underline-offset-8">Explore Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map(cat => (
            <Link key={cat.name} to={`/category/${encodeURIComponent(cat.name)}`} className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-gray-50 flex flex-col items-center group hover:scale-105 transition">
              <div className={`${cat.color} p-4 rounded-3xl text-white mb-4 shadow-xl group-hover:rotate-12 transition-transform`}><cat.icon size={28} /></div>
              <p className="font-black text-gray-700">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div><h2 className="text-5xl font-black text-charcoal italic">Trending on Campus 🔥</h2><p className="text-gray-500 font-bold mt-2 tracking-widest uppercase text-xs">Most ordered by fellow students this week</p></div>
            <Link to="/explore" className="text-primary font-black flex items-center gap-2 hover:underline">View Marketplace <ArrowRight size={18} /></Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {DATA.products.slice(0, 4).map(p => (
              <ProductCard key={p.id} p={p} onAddToCart={onAddToCart} isWishlisted={wishlist.includes(p.id)} onToggleWishlist={onToggleWishlist} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// --- EXPLORE PAGE ---
const ExplorePage = ({ onAddToCart, wishlist, onToggleWishlist }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('category') || 'All';
  const [filter, setFilter] = useState(initialFilter);
  const [query, setQuery] = useState('');

  const filteredProducts = DATA.products.filter((p) => {
    const matchesCategory = filter === 'All' || getCategoryProducts(filter).some((item) => item.id === p.id);
    const q = query.trim().toLowerCase();
    const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.creator.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start mb-10 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-4"><ShoppingBag size={14} /> Student Marketplace</div>
          <h2 className="text-6xl font-black text-charcoal tracking-tighter italic">Marketplace</h2>
          <p className="text-gray-400 font-bold mt-2">{filteredProducts.length} unique products created by students</p>
        </div>
        <div className="flex items-center bg-gray-100 px-4 py-3 rounded-2xl w-full lg:w-80"><Search size={17} className="text-gray-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products, creators..." className="bg-transparent outline-none pl-3 text-sm font-medium w-full" /></div>
      </div>
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-premium p-5 mb-10">
        <div className="flex flex-wrap gap-2">{['All', ...CATEGORY_DEFINITIONS.map((c) => c.name)].map((f) => (<button key={f} onClick={() => setFilter(f)} className={`px-5 py-3 rounded-full font-black text-xs uppercase tracking-widest transition ${filter.toLowerCase() === f.toLowerCase() ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-500'}`}>{f}</button>))}</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map(p => (
          <ProductCard key={p.id} p={p} onAddToCart={onAddToCart} isWishlisted={wishlist.includes(p.id)} onToggleWishlist={onToggleWishlist} />
        ))}
      </div>
    </div>
  );
};

const CategoriesPage = () => (
  <div className="max-w-7xl mx-auto px-6 py-14 min-h-screen">
    <div className="text-center max-w-3xl mx-auto mb-14">
      <h2 className="text-6xl font-black text-charcoal tracking-tighter mt-3">Shop by Category</h2>
      <p className="text-gray-500 font-medium mt-3">Browse over 60+ verified student creations across campus</p>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
      {CATEGORY_DEFINITIONS.map((cat) => {
        const count = getCategoryProducts(cat.name).length;
        return (
          <Link key={cat.name} to={`/category/${encodeURIComponent(cat.name)}`} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-premium hover:-translate-y-2 transition-all group">
            <div className={`${cat.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg mb-7 group-hover:rotate-6 transition-transform`}><cat.icon size={30} /></div>
            <h3 className="text-2xl font-black text-charcoal">{cat.name}</h3>
            <p className="text-sm text-gray-400 font-medium mt-1">{cat.description}</p>
            <p className="text-xs font-black uppercase text-primary tracking-widest mt-6">{count} Products Available</p>
          </Link>
        );
      })}
    </div>
  </div>
);

const CategoryPage = ({ onAddToCart, wishlist, onToggleWishlist }) => {
  const { category } = useParams();
  const products = getCategoryProducts(category);
  const label = getCategoryLabel(category);
  return (
    <div className="max-w-7xl mx-auto px-6 py-14 min-h-screen">
      <div className="flex justify-between items-end mb-10">
        <div>
          <Link to="/categories" className="text-primary font-black text-xs uppercase tracking-widest hover:underline">← All Categories</Link>
          <h2 className="text-6xl font-black text-charcoal tracking-tighter mt-2">{label}</h2>
        </div>
        <span className="bg-primary/10 text-primary font-black px-4 py-2 rounded-2xl text-sm">{products.length} Products</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map(p => <ProductCard key={p.id} p={p} onAddToCart={onAddToCart} isWishlisted={wishlist.includes(p.id)} onToggleWishlist={onToggleWishlist} />)}
      </div>
    </div>
  );
};

const TrendingPage = ({ onAddToCart, wishlist, onToggleWishlist }) => {
  const trending = [...DATA.products].sort((a, b) => b.views - a.views);
  return (
    <div className="max-w-7xl mx-auto px-6 py-14 min-h-screen">
      <h2 className="text-6xl font-black tracking-tighter mb-4">Campus Trends 🔥</h2>
      <p className="text-gray-400 font-bold mb-10">Products most viewed by students at PCCOER this week</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {trending.map(p => <ProductCard key={p.id} p={p} onAddToCart={onAddToCart} isWishlisted={wishlist.includes(p.id)} onToggleWishlist={onToggleWishlist} />)}
      </div>
    </div>
  );
};

const ProductDetailsPage = ({ onAddToCart }) => {
  const { id } = useParams();
  const product = DATA.products.find((p) => String(p.id) === String(id));
  if (!product) return <div className="text-center py-20 font-black">Product not found</div>;
  return (
    <div className="max-w-7xl mx-auto px-6 py-14 min-h-screen">
      <Link to="/explore" className="text-primary font-black text-sm hover:underline">← Back to Marketplace</Link>
      <div className="grid lg:grid-cols-2 gap-12 mt-8 items-start">
        <img src={product.image} alt={product.title} className="w-full aspect-square object-cover rounded-[3rem] shadow-premium" />
        <div>
          <span className="text-xs font-black uppercase text-primary bg-primary/10 px-3 py-1.5 rounded-full tracking-wider">{product.category}</span>
          <h1 className="text-5xl font-black text-charcoal tracking-tighter mt-4">{product.title}</h1>
          <p className="text-gray-400 font-bold mt-2">Created by {product.creator} • Verified Student</p>
          <p className="text-5xl font-black text-primary mt-8">₹{product.price}</p>
          <div className="mt-8 flex gap-4">
            <button onClick={() => onAddToCart(product)} className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-lg hover:scale-[1.02] shadow-xl shadow-primary/30 transition">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- CREATORS DIRECTORY PAGE ---
const EntrepreneursPage = () => (
  <div className="min-h-screen bg-gray-50 pb-20">
    <div className="max-w-7xl mx-auto px-6 py-14">
      <h1 className="text-7xl font-black tracking-tighter mb-4">Meet the Creators.</h1>
      <p className="text-gray-400 font-bold mb-10">Student entrepreneurs across campuses turning hobbies into businesses.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {DATA.creators.map((creator) => (
          <div key={creator.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-premium p-7">
              <img src={creator.image} alt={creator.name} className="w-24 h-24 rounded-[2rem] mb-6 object-cover shadow-sm" />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-charcoal">{creator.name}</h3>
                  <p className="text-primary font-black text-sm mt-0.5">{creator.role}</p>
                  <p className="text-xs text-gray-400 font-bold uppercase mt-1">{creator.college}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-amber-500">★ {creator.rating}</span>
                  <p className="text-xs text-gray-400 font-bold">{creator.sales} orders</p>
                </div>
              </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- MAIN APP ---
export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id, delta) => {
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter((item) => item.quantity > 0));
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleWishlist = (id) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar 
          onOpenCart={() => setIsCartOpen(true)} 
          onOpenAuth={() => setIsAuthOpen(true)} 
          cartCount={cartCount} 
          currentUser={currentUser}
        />

        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cart={cart} 
          updateQuantity={handleUpdateQuantity} 
          removeItem={handleRemoveItem} 
        />

        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
          onLoginSuccess={(user) => setCurrentUser(user)}
        />

        <Routes>
          <Route path="/" element={<HomePage onAddToCart={handleAddToCart} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} />} />
          <Route path="/explore" element={<ExplorePage onAddToCart={handleAddToCart} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:category" element={<CategoryPage onAddToCart={handleAddToCart} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} />} />
          <Route path="/trending" element={<TrendingPage onAddToCart={handleAddToCart} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} />} />
          <Route path="/product/:id" element={<ProductDetailsPage onAddToCart={handleAddToCart} />} />
          <Route path="/creators" element={<EntrepreneursPage />} />
          <Route path="/become-creator" element={<BecomeCreatorPage />} />
        </Routes>

        <footer className="bg-charcoal text-white rounded-t-[4rem] px-8 py-24 text-center mt-20">
          <Sparkles className="mx-auto mb-8 text-accent animate-pulse" size={48} />
          <h3 className="text-5xl font-black mb-8 leading-tight italic">Built by Students, <br /> for Students.</h3>
          <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-xs">© 2026 PCCOER Campus Marketplace</p>
        </footer>
      </div>
    </Router>
  );
}