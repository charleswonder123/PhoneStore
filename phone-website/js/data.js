/**
 * NEXUS PHONES - Product Catalog & Static Data
 * Realistic Demo Smartphone Inventory in Nigerian Naira (₦)
 */

// Helper to generate SVG phone graphic fallback for guaranteed zero broken images
function generatePhoneSvg(brand, name, hexColor, accentName) {
  const brandLogos = {
    'Apple': '<path d="M15.5 17c-.8 1.2-1.6 2.3-2.9 2.3s-1.7-.8-3.1-.8-3.2.8-4.4 2.4c-1.8 2.6-1.5 7.5 1.5 11.9 1.4 2 3.1 4.2 5.3 4.1 2.1-.1 2.9-1.4 5.4-1.4 2.5 0 3.2 1.4 5.4 1.3 2.3-.1 3.7-2.1 5.1-4.1 1.6-2.3 2.3-4.5 2.3-4.6-.1-.1-4.4-1.7-4.4-6.6 0-4.1 3.4-6.1 3.5-6.2-2-2.8-5-3.2-6-3.3-2.6-.3-4.9 1.6-6 1.6-1.2 0-3.1-1.5-5.3-1.5-2.7 0-5.3 1.6-6.7 4.1 0 0 .1 0 .2.1z M14.2 8.7c1.1-1.4 1.9-3.3 1.7-5.2-1.6.1-3.6 1.1-4.7 2.4-1 1.2-1.9 3.1-1.6 5 1.8.1 3.6-1 4.6-2.2z" fill="currentColor"/>',
    'Samsung': '<text x="100" y="220" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="currentColor" letter-spacing="3" text-anchor="middle">SAMSUNG</text>',
    'Google Pixel': '<path d="M100 205 a 15 15 0 0 1 15 15 v 0 a 15 15 0 0 1 -15 15 a 15 15 0 0 1 -15 -15 h 15 z" fill="#4285F4"/><path d="M100 235 a 15 15 0 0 1 -15 -15 h 15 z" fill="#34A853"/><path d="M85 220 a 15 15 0 0 1 15 -15 v 15 z" fill="#FBBC05"/><path d="M100 205 a 15 15 0 0 1 15 15 h -15 z" fill="#EA4335"/>',
    'Xiaomi': '<rect x="88" y="210" width="24" height="24" rx="5" fill="#FF6900"/><text x="100" y="227" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#fff" text-anchor="middle">mi</text>',
    'Tecno': '<text x="100" y="222" font-family="system-ui, sans-serif" font-size="18" font-weight="800" fill="currentColor" letter-spacing="2" text-anchor="middle">TECNO</text>'
  };

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="100%" height="100%">
    <defs>
      <linearGradient id="screenGrad-${hexColor.replace('#','')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="50%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="${hexColor}"/>
      </linearGradient>
      <linearGradient id="bodyGrad-${hexColor.replace('#','')}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.5"/>
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000" flood-opacity="0.25"/>
      </filter>
    </defs>
    <!-- Shadow & Phone Body Outer -->
    <rect x="55" y="25" width="190" height="350" rx="36" fill="${hexColor}" filter="url(#shadow)" stroke="#475569" stroke-width="2"/>
    <rect x="55" y="25" width="190" height="350" rx="36" fill="url(#bodyGrad-${hexColor.replace('#','')})"/>
    
    <!-- Phone Bezel / Screen -->
    <rect x="63" y="33" width="174" height="334" rx="30" fill="#030712" stroke="#1f2937" stroke-width="2"/>
    <rect x="67" y="37" width="166" height="326" rx="26" fill="url(#screenGrad-${hexColor.replace('#','')})"/>
    
    <!-- Screen Visual Glow & Artwork -->
    <circle cx="150" cy="190" r="65" fill="${hexColor}" opacity="0.35" filter="blur(20px)"/>
    <circle cx="180" cy="140" r="45" fill="#38bdf8" opacity="0.25" filter="blur(15px)"/>
    
    <!-- Dynamic Island / Notch / Camera Cutout -->
    <rect x="120" y="44" width="60" height="14" rx="7" fill="#000000"/>
    <circle cx="168" cy="51" r="3" fill="#1e293b"/>
    <circle cx="132" cy="51" r="2.5" fill="#0284c7" opacity="0.8"/>
    
    <!-- Screen Clock & UI -->
    <text x="150" y="105" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="300" fill="#ffffff" text-anchor="middle" opacity="0.95">09:41</text>
    <text x="150" y="128" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="500" fill="#94a3b8" text-anchor="middle" letter-spacing="1">WEDNESDAY, OCT 28</text>
    
    <!-- Center Brand Watermark -->
    <g transform="translate(50, 40)" opacity="0.85" fill="#ffffff">
      ${brandLogos[brand] || ''}
    </g>

    <!-- Bottom Indicator Bar -->
    <rect x="115" y="352" width="70" height="4" rx="2" fill="#ffffff" opacity="0.6"/>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

const PHONES_DATA = [
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    brand: "Apple",
    category: "flagship",
    tagline: "Titanium. So strong. So light. So Pro.",
    basePrice: 2450000,
    originalPrice: 2650000,
    discountPercent: 8,
    rating: 4.9,
    reviewsCount: 142,
    stock: 5,
    badge: "Bestseller",
    isFeatured: true,
    isFlashDeal: true,
    colors: [
      { name: "Natural Titanium", hex: "#9a9893" },
      { name: "Desert Titanium", hex: "#c5b49e" },
      { name: "White Titanium", hex: "#f2f1ed" },
      { name: "Black Titanium", hex: "#3b3a39" }
    ],
    storageOptions: [
      { size: "256GB", priceOffset: 0 },
      { size: "512GB", priceOffset: 280000 },
      { size: "1TB", priceOffset: 580000 }
    ],
    specs: {
      screen: '6.9" Super Retina XDR OLED, 120Hz ProMotion, 2000 nits',
      processor: 'Apple A18 Pro (3nm, 6-core CPU + 6-core GPU)',
      ram: '8GB Unified Memory',
      storage: '256GB / 512GB / 1TB NVMe',
      battery: '4,685 mAh, MagSafe Wireless & USB-C 3.0 Fast Charging',
      rearCamera: '48MP Fusion (f/1.78) + 48MP Ultra Wide + 12MP 5x Telephoto',
      frontCamera: '12MP TrueDepth with Autofocus & 4K60 Dolby Vision',
      os: 'iOS 18 with Apple Intelligence',
      network: '5G (Sub-6 & mmWave), Wi-Fi 7, eSIM + Physical Nano-SIM',
      weight: '227g',
      waterResistance: 'IP68 (6m depth up to 30 mins)'
    },
    description: "The iPhone 16 Pro Max features a durable and lightweight titanium design with a larger 6.9-inch Super Retina XDR display. Powered by the groundbreaking A18 Pro chip, it introduces Camera Control for instant access to camera tools, 48MP Fusion macro photography, and 4K 120 fps Dolby Vision video recording. Comes with Nigeria official 1-year warranty and free screen protection setup.",
    boxContents: [
      "iPhone 16 Pro Max with iOS 18",
      "USB-C Woven Charge Cable (1m)",
      "SIM Ejector Tool & Documentation",
      "Official Apple 1-Year Nigeria Warranty Card"
    ],
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=700&q=80",
    fallbackImage: generatePhoneSvg("Apple", "iPhone 16 Pro Max", "#9a9893", "Natural Titanium"),
    gallery: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "samsung-galaxy-s24-ultra",
    name: "Samsung Galaxy S24 Ultra 5G",
    brand: "Samsung",
    category: "flagship",
    tagline: "Galaxy AI is here. Epic in every single detail.",
    basePrice: 2150000,
    originalPrice: 2350000,
    discountPercent: 9,
    rating: 4.9,
    reviewsCount: 188,
    stock: 8,
    badge: "Hot",
    isFeatured: true,
    isFlashDeal: true,
    colors: [
      { name: "Titanium Gray", hex: "#787676" },
      { name: "Titanium Black", hex: "#2b2b2b" },
      { name: "Titanium Violet", hex: "#585268" },
      { name: "Titanium Yellow", hex: "#e8dfb8" }
    ],
    storageOptions: [
      { size: "256GB", priceOffset: 0 },
      { size: "512GB", priceOffset: 240000 },
      { size: "1TB", priceOffset: 520000 }
    ],
    specs: {
      screen: '6.8" Dynamic AMOLED 2X, QHD+, 1-120Hz LTPO, 2600 nits, Anti-Reflective Armor',
      processor: 'Snapdragon 8 Gen 3 for Galaxy (4nm)',
      ram: '12GB LPDDR5X',
      storage: '256GB / 512GB / 1TB UFS 4.0',
      battery: '5,000 mAh, 45W Fast Charging, 15W Fast Wireless',
      rearCamera: '200MP Wide OIS + 50MP Periscope (5x) + 10MP Telephoto (3x) + 12MP Ultra-Wide',
      frontCamera: '12MP Dual Pixel AF with HDR10+',
      os: 'Android 14 with One UI 6.1 (Guaranteed 7 Years OS Updates)',
      network: '5G, Wi-Fi 7, S-Pen Built-in, Dual SIM (Nano + eSIM)',
      weight: '232g',
      waterResistance: 'IP68 Water & Dust Resistant'
    },
    description: "Welcome to the era of mobile AI. With Galaxy S24 Ultra, you can circle to search with Google, translate phone calls in real-time, format your notes, and edit photos with generative AI. Wrapped in a resilient titanium frame with an integrated S-Pen stylus, 200MP quad-tele camera system, and the brightest display Samsung has ever created.",
    boxContents: [
      "Samsung Galaxy S24 Ultra",
      "Built-in S-Pen Stylus",
      "USB-C to USB-C Cable",
      "Ejection Pin & Quick Start Guide",
      "Samsung Care+ 24-Month Support Voucher"
    ],
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=700&q=80",
    fallbackImage: generatePhoneSvg("Samsung", "Galaxy S24 Ultra", "#787676", "Titanium Gray"),
    gallery: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "google-pixel-9-pro-xl",
    name: "Google Pixel 9 Pro XL",
    brand: "Google Pixel",
    category: "flagship",
    tagline: "Engineered by Google. Pro in every dimension.",
    basePrice: 1850000,
    originalPrice: 2000000,
    discountPercent: 8,
    rating: 4.8,
    reviewsCount: 96,
    stock: 4,
    badge: "New Release",
    isFeatured: true,
    isFlashDeal: false,
    colors: [
      { name: "Obsidian", hex: "#202124" },
      { name: "Porcelain", hex: "#f1f0ea" },
      { name: "Hazel", hex: "#80857b" },
      { name: "Rose Quartz", hex: "#e8c5c8" }
    ],
    storageOptions: [
      { size: "128GB", priceOffset: 0 },
      { size: "256GB", priceOffset: 150000 },
      { size: "512GB", priceOffset: 320000 }
    ],
    specs: {
      screen: '6.8" Super Actua OLED Display, 1-120Hz LTPO, 3000 nits Peak, Gorilla Glass Victus 2',
      processor: 'Google Tensor G4 with Titan M2 Security Co-processor',
      ram: '16GB LPDDR5X (Built for Gemini Nano)',
      storage: '128GB / 256GB / 512GB UFS 3.1',
      battery: '5,060 mAh, 37W Wired Fast Charge, Fast Qi Wireless',
      rearCamera: '50MP Octa PD Wide + 48MP Quad PD Ultra Wide (Macro) + 48MP 5x Telephoto (30x Super Res Zoom)',
      frontCamera: '42MP Dual PD Selfie Camera with 103° Ultrawide FOV',
      os: 'Android 15 (7 Years of Pixel Feature Drops & Security Updates)',
      network: '5G, Wi-Fi 7, Ultra-Wideband (UWB), Satellite SOS',
      weight: '221g',
      waterResistance: 'IP68'
    },
    description: "The Google Pixel 9 Pro XL is the most powerful Pixel yet. Powered by Google Tensor G4 with 16GB RAM, it runs advanced Gemini AI natively on device. Experience Add Me photo mode, Best Take, Pixel Studio, Audio Magic Eraser, and unmatched pure Android smoothness.",
    boxContents: [
      "Google Pixel 9 Pro XL",
      "1m USB-C to USB-C Cable (USB 2.0)",
      "SIM Tool & Quick Switch Adapter",
      "Google 1-Year Global Warranty Documentation"
    ],
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=80",
    fallbackImage: generatePhoneSvg("Google Pixel", "Pixel 9 Pro XL", "#202124", "Obsidian"),
    gallery: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "xiaomi-14-ultra",
    name: "Xiaomi 14 Ultra (Leica Quad-Cam)",
    brand: "Xiaomi",
    category: "flagship",
    tagline: "A pinnacle of mobile imaging with Leica optics.",
    basePrice: 1780000,
    originalPrice: 1950000,
    discountPercent: 9,
    rating: 4.8,
    reviewsCount: 74,
    stock: 6,
    badge: "Leica Co-engineered",
    isFeatured: true,
    isFlashDeal: false,
    colors: [
      { name: "Black Vegan Leather", hex: "#1c1c1c" },
      { name: "White Ceramic", hex: "#f4f4f4" }
    ],
    storageOptions: [
      { size: "512GB", priceOffset: 0 },
      { size: "1TB", priceOffset: 280000 }
    ],
    specs: {
      screen: '6.73" All Around Liquid Display, WQHD+ AMOLED, 120Hz, 3000 nits, Dolby Vision',
      processor: 'Snapdragon 8 Gen 3 (4nm)',
      ram: '16GB LPDDR5X',
      storage: '512GB / 1TB UFS 4.0',
      battery: '5,000 mAh, 90W HyperCharge, 80W Wireless Charge',
      rearCamera: '50MP 1-inch LYT-900 Variable f/1.63-f/4.0 + 50MP 3.2x Tele + 50MP 5x Periscope + 50MP Ultra Wide',
      frontCamera: '32MP 4K Front Camera',
      os: 'Xiaomi HyperOS (Android 14)',
      network: '5G Dual SIM, Wi-Fi 7, Two-way Satellite Comms',
      weight: '220g',
      waterResistance: 'IP68'
    },
    description: "Co-engineered with Leica, Xiaomi 14 Ultra redefines smartphone photography with a true 1-inch Sony LYT-900 sensor and stepless variable aperture. Equipped with Snapdragon 8 Gen 3, a quad 50MP Leica camera system, and ultra-fast 90W charging.",
    boxContents: [
      "Xiaomi 14 Ultra Smartphone",
      "90W Power Adapter (Nigeria plug included)",
      "USB Type-C Cable",
      "Protective Premium Case & Screen Film (pre-applied)"
    ],
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=700&q=80",
    fallbackImage: generatePhoneSvg("Xiaomi", "Xiaomi 14 Ultra", "#1c1c1c", "Black"),
    gallery: [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "tecno-phantom-v-fold-2",
    name: "Tecno Phantom V Fold 2 5G",
    brand: "Tecno",
    category: "foldable",
    tagline: "Fold into the extraordinary. Ultra-slim flagship folding screen.",
    basePrice: 1350000,
    originalPrice: 1480000,
    discountPercent: 9,
    rating: 4.7,
    reviewsCount: 58,
    stock: 3,
    badge: "Foldable Flagship",
    isFeatured: true,
    isFlashDeal: true,
    colors: [
      { name: "Karst Green", hex: "#2f483e" },
      { name: "Rippling Blue", hex: "#2c425e" }
    ],
    storageOptions: [
      { size: "512GB", priceOffset: 0 }
    ],
    specs: {
      screen: '7.85" 2K+ 120Hz LTPO AMOLED (Main) + 6.42" FHD+ 120Hz Cover Screen',
      processor: 'MediaTek Dimensity 9000+ 5G (4nm)',
      ram: '12GB + 12GB Extended RAM (24GB total)',
      storage: '512GB UFS 3.1',
      battery: '5,750 mAh Monster Battery, 70W Ultra Charge',
      rearCamera: '50MP Main OIS + 50MP 2x Telephoto Portrait + 50MP Ultra-Wide',
      frontCamera: '32MP Cover Camera + 32MP Inner Screen Camera',
      os: 'HiOS 14 Fold (Optimized Multitasking on Android 14)',
      network: '5G Dual SIM, Ella AI Voice Assistant',
      weight: '249g',
      waterResistance: 'Splash resistant'
    },
    description: "Tecno's flagship foldable marvel, the Phantom V Fold 2 brings dual vibrant 120Hz AMOLED screens, an enormous 5750mAh battery, and triple 50MP cameras into an aerospace-grade hinge design. Enjoy desktop-class productivity right in your pocket.",
    boxContents: [
      "Tecno Phantom V Fold 2 5G",
      "70W Fast Charger Adapter",
      "USB-C Charging Cable",
      "Aramid Fiber Kickstand Protective Case",
      "Official Carlcare 100-Day Free Screen Replacement Warranty"
    ],
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=700&q=80",
    fallbackImage: generatePhoneSvg("Tecno", "Phantom V Fold 2", "#2f483e", "Karst Green"),
    gallery: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "iphone-16",
    name: "iPhone 16",
    brand: "Apple",
    category: "midrange",
    tagline: "All-new Camera Control. 48MP Fusion camera. Five vibrant colors.",
    basePrice: 1550000,
    originalPrice: 1680000,
    discountPercent: 8,
    rating: 4.8,
    reviewsCount: 115,
    stock: 10,
    badge: "Popular",
    isFeatured: false,
    isFlashDeal: false,
    colors: [
      { name: "Ultramarine", hex: "#3c6ea6" },
      { name: "Teal", hex: "#7fa99b" },
      { name: "Pink", hex: "#dfb0b9" },
      { name: "White", hex: "#f0f1f3" },
      { name: "Black", hex: "#2e2f33" }
    ],
    storageOptions: [
      { size: "128GB", priceOffset: 0 },
      { size: "256GB", priceOffset: 180000 },
      { size: "512GB", priceOffset: 420000 }
    ],
    specs: {
      screen: '6.1" Super Retina XDR OLED, 2000 nits Peak Outdoor Brightness',
      processor: 'Apple A18 Chip with 16-core Neural Engine',
      ram: '8GB RAM',
      storage: '128GB / 256GB / 512GB',
      battery: '3,561 mAh, Up to 22 hours video playback, MagSafe',
      rearCamera: '48MP Fusion 2x optical Telephoto + 12MP Ultra Wide with Macro',
      frontCamera: '12MP TrueDepth Camera with Autofocus',
      os: 'iOS 18 with Camera Control & Action Button',
      network: '5G, Wi-Fi 7, Emergency SOS via Satellite',
      weight: '170g',
      waterResistance: 'IP68'
    },
    description: "Meet iPhone 16. Built for Apple Intelligence with the all-new A18 chip. Camera Control gives you an easier way to quickly access camera tools, like zoom or depth of field, so you can take the perfect shot in record time.",
    boxContents: [
      "iPhone 16 with iOS 18",
      "USB-C Charge Cable (1m)",
      "SIM Pin & Documentation"
    ],
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=700&q=80",
    fallbackImage: generatePhoneSvg("Apple", "iPhone 16", "#3c6ea6", "Ultramarine"),
    gallery: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "samsung-galaxy-z-fold-6",
    name: "Samsung Galaxy Z Fold 6",
    brand: "Samsung",
    category: "foldable",
    tagline: "Ultra-slim, ultra-powerful. The ultimate foldable workstation.",
    basePrice: 2650000,
    originalPrice: 2850000,
    discountPercent: 7,
    rating: 4.9,
    reviewsCount: 42,
    stock: 2,
    badge: "Limited Stock",
    isFeatured: true,
    isFlashDeal: false,
    colors: [
      { name: "Silver Shadow", hex: "#a3a6ad" },
      { name: "Navy", hex: "#1d2a44" },
      { name: "Pink", hex: "#e0b8be" }
    ],
    storageOptions: [
      { size: "256GB", priceOffset: 0 },
      { size: "512GB", priceOffset: 260000 },
      { size: "1TB", priceOffset: 580000 }
    ],
    specs: {
      screen: '7.6" QXGA+ Dynamic AMOLED 2X 120Hz (Main) + 6.3" HD+ Cover AMOLED 120Hz',
      processor: 'Snapdragon 8 Gen 3 for Galaxy (4nm)',
      ram: '12GB LPDDR5X',
      storage: '256GB / 512GB / 1TB',
      battery: '4,400 mAh, 25W Fast Charging, Wireless PowerShare',
      rearCamera: '50MP Dual Pixel OIS + 10MP 3x Telephoto + 12MP Ultra-Wide',
      frontCamera: '10MP Cover + 4MP Under Display Camera',
      os: 'Android 14, One UI 6.1.1 with Fold AI',
      network: '5G, S-Pen Fold Edition Compatible, Dual SIM',
      weight: '239g',
      waterResistance: 'IP48 Water Resistance'
    },
    description: "Thinner, lighter, and more durable than ever. Galaxy Z Fold 6 combines unmatched PC-like power with Galaxy AI in a compact folding form factor. Unfold a 7.6-inch expansive canvas for gaming, multitasking, and creative work.",
    boxContents: [
      "Samsung Galaxy Z Fold 6",
      "Type-C to Type-C Cable",
      "Eject Pin & Quick Guide",
      "Samsung Nigeria Warranty"
    ],
    image: "https://images.unsplash.com/photo-1628102491629-778571d893a3?auto=format&fit=crop&w=700&q=80",
    fallbackImage: generatePhoneSvg("Samsung", "Galaxy Z Fold 6", "#a3a6ad", "Silver Shadow"),
    gallery: [
      "https://images.unsplash.com/photo-1628102491629-778571d893a3?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "samsung-galaxy-a55-5g",
    name: "Samsung Galaxy A55 5G",
    brand: "Samsung",
    category: "midrange",
    tagline: "Metal frame, awesome cameras, stunning AMOLED display.",
    basePrice: 480000,
    originalPrice: 540000,
    discountPercent: 11,
    rating: 4.7,
    reviewsCount: 210,
    stock: 15,
    badge: "Best Value",
    isFeatured: false,
    isFlashDeal: true,
    colors: [
      { name: "Awesome Iceblue", hex: "#cde2f2" },
      { name: "Awesome Navy", hex: "#1a243b" },
      { name: "Awesome Lilac", hex: "#dfd7ea" }
    ],
    storageOptions: [
      { size: "128GB", priceOffset: 0 },
      { size: "256GB", priceOffset: 60000 }
    ],
    specs: {
      screen: '6.6" FHD+ Super AMOLED, 120Hz, 1000 nits, Vision Booster, Gorilla Glass Victus+',
      processor: 'Exynos 1480 (4nm) with AMD Xclipse 530 GPU',
      ram: '8GB RAM',
      storage: '128GB / 256GB (MicroSD expandable up to 1TB)',
      battery: '5,000 mAh, 25W Fast Charging (Up to 2 Days battery)',
      rearCamera: '50MP OIS Main + 12MP Ultra-Wide + 5MP Macro',
      frontCamera: '32MP High-Res Selfie Camera',
      os: 'Android 14 with One UI 6.1 (4 OS Updates + 5 Years Security)',
      network: '5G Dual SIM, IP67 Water & Dust Resistance',
      weight: '213g',
      waterResistance: 'IP67'
    },
    description: "The Galaxy A55 5G blends premium metal design with high performance. Enjoy vivid colors on the 6.6-inch Super AMOLED screen, shoot clear photos in low light with the 50MP OIS camera, and rest easy with Samsung Knox Vault hardware security.",
    boxContents: [
      "Samsung Galaxy A55 5G",
      "USB Type-C Cable",
      "SIM Ejector Pin",
      "Quick Start Guide"
    ],
    image: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=700&q=80",
    fallbackImage: generatePhoneSvg("Samsung", "Galaxy A55", "#cde2f2", "Awesome Iceblue"),
    gallery: [
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "google-pixel-8a",
    name: "Google Pixel 8a",
    brand: "Google Pixel",
    category: "midrange",
    tagline: "Delightful AI features, incredible camera, friendly price.",
    basePrice: 690000,
    originalPrice: 750000,
    discountPercent: 8,
    rating: 4.7,
    reviewsCount: 88,
    stock: 7,
    badge: "AI Value",
    isFeatured: false,
    isFlashDeal: false,
    colors: [
      { name: "Bay Blue", hex: "#4986ad" },
      { name: "Aloe Green", hex: "#a2d9a6" },
      { name: "Obsidian", hex: "#27282b" },
      { name: "Porcelain", hex: "#f0ece1" }
    ],
    storageOptions: [
      { size: "128GB", priceOffset: 0 },
      { size: "256GB", priceOffset: 90000 }
    ],
    specs: {
      screen: '6.1" Actua OLED 120Hz, 2000 nits Peak, HDR support',
      processor: 'Google Tensor G3 with Titan M2 security',
      ram: '8GB LPDDR5x',
      storage: '128GB / 256GB UFS 3.1',
      battery: '4,492 mAh, 24+ hour battery, Qi Wireless charging',
      rearCamera: '64MP Quad PD Wide + 13MP Ultrawide (Super Res Zoom up to 8x)',
      frontCamera: '13MP Ultrawide 96.5° FOV',
      os: 'Android 14 (7 Years of OS & Security updates)',
      network: '5G, Dual SIM (Nano + eSIM)',
      weight: '188g',
      waterResistance: 'IP67'
    },
    description: "Pixel 8a gives you the flagship Google Tensor G3 chip and industry-leading AI features at a budget-friendly price. Magic Editor, Best Take, Audio Magic Eraser, and Live Translate make everyday tasks effortless.",
    boxContents: [
      "Google Pixel 8a",
      "1m USB-C to USB-C cable (USB 2.0)",
      "Quick Switch Adapter & SIM tool"
    ],
    image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=700&q=80",
    fallbackImage: generatePhoneSvg("Google Pixel", "Pixel 8a", "#4986ad", "Bay Blue"),
    gallery: [
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "redmi-note-13-pro-plus",
    name: "Redmi Note 13 Pro+ 5G",
    brand: "Xiaomi",
    category: "midrange",
    tagline: "200MP OIS Camera with 120W HyperCharge in a curved AMOLED body.",
    basePrice: 420000,
    originalPrice: 470000,
    discountPercent: 11,
    rating: 4.8,
    reviewsCount: 175,
    stock: 14,
    badge: "120W Fast Charge",
    isFeatured: true,
    isFlashDeal: true,
    colors: [
      { name: "Midnight Black", hex: "#191919" },
      { name: "Aurora Purple", hex: "#b3a2c8" },
      { name: "Moonlight White", hex: "#eef0f2" }
    ],
    storageOptions: [
      { size: "256GB", priceOffset: 0 },
      { size: "512GB", priceOffset: 55000 }
    ],
    specs: {
      screen: '6.67" Curved 1.5K CrystalRes AMOLED, 120Hz, 1800 nits, Gorilla Glass Victus',
      processor: 'MediaTek Dimensity 7200-Ultra (4nm)',
      ram: '12GB LPDDR5',
      storage: '256GB / 512GB UFS 3.1',
      battery: '5,000 mAh, 120W HyperCharge (0 to 100% in 19 mins)',
      rearCamera: '200MP Samsung ISOCELL HP3 OIS + 8MP Ultra-Wide + 2MP Macro',
      frontCamera: '16MP Clear Selfie Camera',
      os: 'Xiaomi HyperOS, IP68 Waterproof',
      network: '5G Dual SIM, NFC, Stereo Speakers',
      weight: '204g',
      waterResistance: 'IP68 Water & Dust Resistant'
    },
    description: "The Redmi Note 13 Pro+ 5G sets a new standard for mid-range smartphones. Featuring a crystal-clear 200MP camera with OIS, groundbreaking 120W HyperCharge charging technology, and full IP68 water resistance inside a sleek curved display.",
    boxContents: [
      "Redmi Note 13 Pro+ 5G",
      "120W HyperCharge Power Brick",
      "USB-C Charging Cable",
      "Protective Case & SIM Ejector"
    ],
    image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=700&q=80",
    fallbackImage: generatePhoneSvg("Xiaomi", "Redmi Note 13 Pro+", "#191919", "Midnight Black"),
    gallery: [
      "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "tecno-camon-30-premier",
    name: "Tecno Camon 30 Premier 5G",
    brand: "Tecno",
    category: "midrange",
    tagline: "Dual flagship chips with Sony 50MP Periscope Telephoto.",
    basePrice: 460000,
    originalPrice: 510000,
    discountPercent: 10,
    rating: 4.8,
    reviewsCount: 104,
    stock: 9,
    badge: "Portrait Master",
    isFeatured: false,
    isFlashDeal: false,
    colors: [
      { name: "Alps Snowy Silver", hex: "#c7cacf" },
      { name: "Hawaii Lava Black", hex: "#282828" }
    ],
    storageOptions: [
      { size: "512GB", priceOffset: 0 }
    ],
    specs: {
      screen: '6.77" 1.5K LTPO AMOLED, 1-120Hz, 1400 nits, Always-On Display',
      processor: 'MediaTek Dimensity 8200 Ultimate 5G + Sony Imaging Chip CXD5622GG',
      ram: '12GB + 12GB Extended RAM',
      storage: '512GB ROM',
      battery: '5,000 mAh, 70W Ultra Charge (0 to 100% in 45 mins)',
      rearCamera: '50MP Sony IMX890 OIS + 50MP 3x Periscope Tele + 50MP Ultra-Wide',
      frontCamera: '50MP Eye-tracking Auto-focus Selfie',
      os: 'HiOS 14 (Android 14)',
      network: '5G Dual SIM, Dolby Atmos Stereo Speakers',
      weight: '210g',
      waterResistance: 'IP54 Splash Resistant'
    },
    description: "Designed for mobile photography creators, the Camon 30 Premier 5G features dual chips (Dimensity 8200 Ultimate + Sony Imaging chip) and four 50MP cameras. Record 4K 60fps HDR video and capture stunning low-light portraits with genuine optical zoom.",
    boxContents: [
      "Tecno Camon 30 Premier 5G",
      "70W Super Charger",
      "Type-C Cable",
      "Designer Protective Case",
      "Carlcare 1-Year Warranty"
    ],
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=700&q=80",
    fallbackImage: generatePhoneSvg("Tecno", "Camon 30 Premier", "#c7cacf", "Snowy Silver"),
    gallery: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "tecno-spark-20-pro-plus",
    name: "Tecno Spark 20 Pro+ 4G",
    brand: "Tecno",
    category: "budget",
    tagline: "Curved AMOLED screen, 108MP camera at an unbeatable price.",
    basePrice: 255000,
    originalPrice: 285000,
    discountPercent: 11,
    rating: 4.6,
    reviewsCount: 230,
    stock: 18,
    badge: "Budget Champion",
    isFeatured: false,
    isFlashDeal: true,
    colors: [
      { name: "Temporal Orbits", hex: "#181f2a" },
      { name: "Lunar Frost", hex: "#e4eaee" },
      { name: "Radiance Star", hex: "#f2d572" }
    ],
    storageOptions: [
      { size: "256GB", priceOffset: 0 }
    ],
    specs: {
      screen: '6.78" Curved FHD+ AMOLED, 120Hz, 1000 nits, Gorilla Glass 5',
      processor: 'MediaTek Helio G99 Ultimate (6nm)',
      ram: '8GB + 8GB Extended RAM (16GB Total)',
      storage: '256GB ROM',
      battery: '5,000 mAh, 33W Super Charge',
      rearCamera: '108MP Ultra-sensing Main Camera with 3x lossless zoom + Macro',
      frontCamera: '32MP Glowing Selfie with Dual Flash',
      os: 'HiOS 14 (Android 14)',
      network: '4G LTE Dual SIM, Stereo Dual Speakers with DTS',
      weight: '179g',
      waterResistance: 'IP53 Splash Resistant'
    },
    description: "The Tecno Spark 20 Pro+ brings flagship aesthetics into an accessible tier. Features a 56.5° double-curved AMOLED display, a crisp 108MP camera, dual speakers with volume boost, and Helio G99 Ultimate gaming performance.",
    boxContents: [
      "Tecno Spark 20 Pro+ Smartphone",
      "33W Fast Charger",
      "Type-C USB Cable",
      "Protective Back Cover & Screen Guard"
    ],
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=700&q=80",
    fallbackImage: generatePhoneSvg("Tecno", "Spark 20 Pro+", "#181f2a", "Temporal Orbits"),
    gallery: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "iphone-15-pro",
    name: "iPhone 15 Pro",
    brand: "Apple",
    category: "flagship",
    tagline: "Aerospace-grade titanium, Action button, A17 Pro power.",
    basePrice: 1750000,
    originalPrice: 1920000,
    discountPercent: 9,
    rating: 4.9,
    reviewsCount: 160,
    stock: 5,
    badge: "Pro Pick",
    isFeatured: false,
    isFlashDeal: false,
    colors: [
      { name: "Natural Titanium", hex: "#9b9893" },
      { name: "Blue Titanium", hex: "#3c4756" },
      { name: "Black Titanium", hex: "#323234" }
    ],
    storageOptions: [
      { size: "128GB", priceOffset: 0 },
      { size: "256GB", priceOffset: 150000 },
      { size: "512GB", priceOffset: 360000 }
    ],
    specs: {
      screen: '6.1" Super Retina XDR OLED, ProMotion 120Hz, Always-On display',
      processor: 'Apple A17 Pro (3nm)',
      ram: '8GB RAM',
      storage: '128GB / 256GB / 512GB',
      battery: '3,274 mAh, USB-C 3.0 up to 10Gbps, MagSafe',
      rearCamera: '48MP Main + 12MP Ultra Wide + 12MP 3x Telephoto',
      frontCamera: '12MP TrueDepth Camera with Autofocus',
      os: 'iOS 18 Compatible',
      network: '5G, Wi-Fi 6E, Thread Networking',
      weight: '187g',
      waterResistance: 'IP68'
    },
    description: "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and a more versatile Pro camera system. USB-C with USB 3 speeds transforms your workflow.",
    boxContents: [
      "iPhone 15 Pro",
      "USB-C Woven Charge Cable (1m)",
      "Documentation & SIM tool"
    ],
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=700&q=80",
    fallbackImage: generatePhoneSvg("Apple", "iPhone 15 Pro", "#9b9893", "Natural Titanium"),
    gallery: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "samsung-galaxy-s23-fe",
    name: "Samsung Galaxy S23 FE",
    brand: "Samsung",
    category: "midrange",
    tagline: "The epic flagship experience made accessible.",
    basePrice: 720000,
    originalPrice: 790000,
    discountPercent: 9,
    rating: 4.7,
    reviewsCount: 112,
    stock: 8,
    badge: "Fan Edition",
    isFeatured: false,
    isFlashDeal: false,
    colors: [
      { name: "Mint", hex: "#b2d8d8" },
      { name: "Graphite", hex: "#31353d" },
      { name: "Cream", hex: "#f3eee3" }
    ],
    storageOptions: [
      { size: "128GB", priceOffset: 0 },
      { size: "256GB", priceOffset: 75000 }
    ],
    specs: {
      screen: '6.4" Dynamic AMOLED 2X, 120Hz, HDR10+, 1450 nits',
      processor: 'Exynos 2200 4nm Flagship Octa-core',
      ram: '8GB RAM',
      storage: '128GB / 256GB',
      battery: '4,500 mAh, 25W Fast Charging, Wireless Charging',
      rearCamera: '50MP OIS + 12MP Ultra Wide + 8MP 3x Telephoto',
      frontCamera: '10MP Pro Selfie',
      os: 'Android 14, One UI 6.1 with Galaxy AI',
      network: '5G, IP68 Water & Dust Resistant',
      weight: '209g',
      waterResistance: 'IP68'
    },
    description: "Galaxy S23 FE opens the door for more people to experience the extraordinary. With long-lasting power, stunning nightography, and Galaxy AI capabilities, it's a fan favorite.",
    boxContents: [
      "Samsung Galaxy S23 FE",
      "Type-C to Type-C Cable",
      "Ejection Pin & Manual"
    ],
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=700&q=80",
    fallbackImage: generatePhoneSvg("Samsung", "Galaxy S23 FE", "#b2d8d8", "Mint"),
    gallery: [
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "poco-x6-pro",
    name: "Poco X6 Pro 5G",
    brand: "Xiaomi",
    category: "midrange",
    tagline: "A new SPEED-CIES. Dimensity 8300-Ultra gaming beast.",
    basePrice: 395000,
    originalPrice: 440000,
    discountPercent: 10,
    rating: 4.8,
    reviewsCount: 143,
    stock: 11,
    badge: "Gamer Choice",
    isFeatured: false,
    isFlashDeal: false,
    colors: [
      { name: "Poco Yellow", hex: "#fec200" },
      { name: "Black", hex: "#1f2022" },
      { name: "Grey", hex: "#6f7278" }
    ],
    storageOptions: [
      { size: "256GB", priceOffset: 0 },
      { size: "512GB", priceOffset: 50000 }
    ],
    specs: {
      screen: '6.67" CrystalRes 1.5K Flow AMOLED, 120Hz, 1800 nits, HDR10+',
      processor: 'MediaTek Dimensity 8300-Ultra (4nm flagship benchmark)',
      ram: '12GB LPDDR5X',
      storage: '256GB / 512GB UFS 4.0',
      battery: '5,000 mAh, 67W Turbo Charge (100% in 45 mins)',
      rearCamera: '64MP OIS Triple Camera + 8MP Ultra + 2MP Macro',
      frontCamera: '16MP Selfie Camera',
      os: 'Xiaomi HyperOS',
      network: '5G Dual SIM, NFC, Dual Speakers Dolby Atmos',
      weight: '186g',
      waterResistance: 'IP54 Splash Proof'
    },
    description: "The Poco X6 Pro is a raw gaming machine powered by Dimensity 8300-Ultra and blazing UFS 4.0 storage. Featuring LiquidCool Technology 2.0 and a 1.5K 120Hz Flow AMOLED display.",
    boxContents: [
      "Poco X6 Pro 5G",
      "67W Fast Charger",
      "USB Type-C Cable",
      "SIM Eject Tool & Protective Case"
    ],
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=700&q=80",
    fallbackImage: generatePhoneSvg("Xiaomi", "Poco X6 Pro", "#fec200", "Poco Yellow"),
    gallery: [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "iphone-13",
    name: "iPhone 13",
    brand: "Apple",
    category: "budget",
    tagline: "Superfast A15 Bionic chip. Cinematic mode. Super Retina XDR.",
    basePrice: 780000,
    originalPrice: 850000,
    discountPercent: 8,
    rating: 4.8,
    reviewsCount: 340,
    stock: 7,
    badge: "Proven Classic",
    isFeatured: false,
    isFlashDeal: false,
    colors: [
      { name: "Midnight", hex: "#1e252d" },
      { name: "Starlight", hex: "#faf7f2" },
      { name: "Blue", hex: "#2c5364" }
    ],
    storageOptions: [
      { size: "128GB", priceOffset: 0 },
      { size: "256GB", priceOffset: 95000 }
    ],
    specs: {
      screen: '6.1" Super Retina XDR OLED, 1200 nits Peak HDR, Ceramic Shield',
      processor: 'Apple A15 Bionic chip (4-core GPU)',
      ram: '4GB RAM',
      storage: '128GB / 256GB',
      battery: '3,227 mAh, Up to 19 hours video playback',
      rearCamera: 'Dual 12MP Camera system (Wide & Ultra Wide) with Sensor-shift OIS',
      frontCamera: '12MP TrueDepth Front Camera with Cinematic mode',
      os: 'iOS 18 Supported',
      network: '5G, Nano-SIM and eSIM',
      weight: '174g',
      waterResistance: 'IP68'
    },
    description: "iPhone 13 offers reliable daily performance with the A15 Bionic chip, outstanding battery life, and cinematic camera quality. Durable flat-edge design with Ceramic Shield glass.",
    boxContents: [
      "iPhone 13",
      "USB-C to Lightning Cable",
      "SIM Pin & Documentation"
    ],
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=700&q=80",
    fallbackImage: generatePhoneSvg("Apple", "iPhone 13", "#1e252d", "Midnight"),
    gallery: [
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80"
    ]
  }
];

const BRANDS_LIST = [
  { name: "All", id: "all", count: 16 },
  { name: "Apple", id: "Apple", count: 4, logoLetter: "" },
  { name: "Samsung", id: "Samsung", count: 5, logoLetter: "S" },
  { name: "Google Pixel", id: "Google Pixel", count: 2, logoLetter: "G" },
  { name: "Xiaomi", id: "Xiaomi", count: 3, logoLetter: "Mi" },
  { name: "Tecno", id: "Tecno", count: 3, logoLetter: "T" }
];

const NIGERIAN_STATES = [
  { name: "Lagos", shippingFee: 2500, deliveryDays: "1 - 2 Business Days" },
  { name: "Abuja FCT", shippingFee: 3500, deliveryDays: "2 - 3 Business Days" },
  { name: "Rivers (Port Harcourt)", shippingFee: 4000, deliveryDays: "2 - 3 Business Days" },
  { name: "Oyo (Ibadan)", shippingFee: 3000, deliveryDays: "1 - 2 Business Days" },
  { name: "Kano", shippingFee: 4500, deliveryDays: "3 - 4 Business Days" },
  { name: "Enugu", shippingFee: 4000, deliveryDays: "2 - 3 Business Days" },
  { name: "Delta (Asaba / Warri)", shippingFee: 4000, deliveryDays: "2 - 3 Business Days" },
  { name: "Ogun (Abeokuta)", shippingFee: 3000, deliveryDays: "1 - 2 Business Days" },
  { name: "Kaduna", shippingFee: 4500, deliveryDays: "3 - 4 Business Days" },
  { name: "Edo (Benin City)", shippingFee: 3800, deliveryDays: "2 - 3 Business Days" },
  { name: "Anambra (Awka / Onitsha)", shippingFee: 4000, deliveryDays: "2 - 3 Business Days" },
  { name: "Akwa Ibom (Uyo)", shippingFee: 4200, deliveryDays: "2 - 3 Business Days" },
  { name: "Cross River (Calabar)", shippingFee: 4500, deliveryDays: "3 - 4 Business Days" },
  { name: "Kwara (Ilorin)", shippingFee: 3500, deliveryDays: "2 - 3 Business Days" },
  { name: "Ondo (Akure)", shippingFee: 3500, deliveryDays: "2 - 3 Business Days" },
  { name: "Plateau (Jos)", shippingFee: 4500, deliveryDays: "3 - 4 Business Days" }
];

const PROMO_CODES = {
  "SAVE10": { type: "percent", value: 10, description: "10% off your entire order" },
  "TECH50K": { type: "fixed", value: 50000, minOrder: 500000, description: "₦50,000 discount on orders over ₦500,000" },
  "FREESHIP": { type: "free_shipping", value: 0, description: "Free Nationwide Shipping" },
  "WELCOME20": { type: "fixed", value: 20000, minOrder: 200000, description: "₦20,000 welcome voucher" }
};

const CUSTOMER_TESTIMONIALS = [
  {
    id: 1,
    name: "Emeka Okafor",
    role: "Software Architect",
    location: "Lekki Phase 1, Lagos",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "2 days ago",
    phonePurchased: "Samsung Galaxy S24 Ultra",
    text: "Ordered the S24 Ultra in the morning and had it delivered to my office in Lekki before 4 PM! Authentic seal, 1-year Samsung warranty verified via Carlcare, and the packaging was top notch. Best smartphone shopping experience in Nigeria."
  },
  {
    id: 2,
    name: "Amina Bello",
    role: "Digital Marketer",
    location: "Maitama, Abuja",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "1 week ago",
    phonePurchased: "iPhone 16 Pro Max",
    text: "I was hesitant about ordering a ₦2.4M phone online, but NEXUS exceeded all expectations. Live delivery updates, official Apple invoice, and completely seamless checkout. The Desert Titanium color is gorgeous!"
  },
  {
    id: 3,
    name: "Chinedu Eze",
    role: "Photographer & Creator",
    location: "GRA Phase 2, Port Harcourt",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "2 weeks ago",
    phonePurchased: "Tecno Camon 30 Premier",
    text: "The camera on the Camon 30 Premier is unbelievable for the price. Fast shipping to Port Harcourt within 48 hours. Customer support answered all my questions regarding warranty on WhatsApp instantly."
  },
  {
    id: 4,
    name: "Bolanle Adeleke",
    role: "Finance Manager",
    location: "Bodija, Ibadan",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    rating: 5,
    date: "3 weeks ago",
    phonePurchased: "Redmi Note 13 Pro+ 5G",
    text: "Saved ₦50,000 using the promo code! The 120W charging charges the phone from zero to full while I have breakfast. Will definitely recommend NEXUS to friends and colleagues."
  }
];

const FAQS_DATA = [
  {
    q: "Are all phones sold on NEXUS 100% brand new and authentic?",
    a: "Yes, absolutely. We source exclusively from authorized manufacturers and official national distributors (Apple Nigeria, Samsung Nigeria, Google Authorized, Xiaomi Nigeria, and Carlcare/Tecno). Every device comes factory-sealed with valid IMEI serial numbers and official 1-year manufacturer warranty."
  },
  {
    q: "How fast is delivery across Nigeria?",
    a: "Orders within Lagos and Abuja arrive in 1 to 2 business days (Same-Day Express is available for orders placed before 1:00 PM). Deliveries to other major states (Rivers, Oyo, Kano, Enugu, Delta, etc.) take 2 to 3 business days via our insured courier partners."
  },
  {
    q: "What payment methods are supported?",
    a: "We support secure card payments (Mastercard, Visa, Verve), Bank Transfers, and Cash/POS on Delivery in select locations in Lagos and Abuja. All online transactions are protected by 256-bit bank-grade encryption."
  },
  {
    q: "What is your return and warranty policy?",
    a: "We provide an instant 7-day replacement warranty for any manufacturer defects, plus full 12-month manufacturer warranty supported across official service centers nationwide (Carlcare, Apple Authorized, and Samsung Experience Centers)."
  },
  {
    q: "Can I inspect the package upon delivery?",
    a: "Yes! You may verify the factory seal, model specifications, and outer condition in the presence of our dispatch agent before confirming receipt."
  }
];
