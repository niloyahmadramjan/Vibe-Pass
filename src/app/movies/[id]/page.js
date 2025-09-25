'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import LoadingSpinner from '@/app/hooks/LoadingSpiner'
import 'leaflet/dist/leaflet.css'
import { FaArrowLeft } from 'react-icons/fa'

// 📍 Map Locations in Bangladesh
const mapLocations = {
  divisions: [
    {
      name: 'Dhaka',
      districts: [
        {
          id: 'dhaka',
          coords: [23.8103, 90.4125],
          label: 'Dhaka, Bangladesh',
          description:
            'The capital and largest city of Bangladesh, Dhaka is a major hub for business, culture, and entertainment. It is home to numerous movie theaters and multiplexes.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Dhaka',
        },
        {
          id: 'faridpur',
          coords: [23.6068, 89.8429],
          label: 'Faridpur, Bangladesh',
          description:
            'Located on the banks of the Padma River, Faridpur is known for its agricultural landscape and rich history.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Faridpur',
        },
        {
          id: 'gazipur',
          coords: [23.9999, 90.4203],
          label: 'Gazipur, Bangladesh',
          description:
            'An industrial city and a key part of the Dhaka metropolitan area, Gazipur is known for its textiles and rapid development.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Gazipur',
        },
        {
          id: 'gopalganj',
          coords: [23.0033, 89.8789],
          label: 'Gopalganj, Bangladesh',
          description:
            'A district with historical significance, it is the birthplace of the Father of the Nation, Bangabandhu Sheikh Mujibur Rahman.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Gopalganj',
        },
        {
          id: 'kishoreganj',
          coords: [24.4371, 90.7712],
          label: 'Kishoreganj, Bangladesh',
          description:
            'Known for its Haor wetlands and historical mosques, Kishoreganj is a culturally significant region.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Kishoreganj',
        },
        {
          id: 'madaripur',
          coords: [23.1646, 90.1884],
          label: 'Madaripur, Bangladesh',
          description:
            'A district known for its riverine landscape and historical forts, offering a tranquil environment.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Madaripur',
        },
        {
          id: 'manikganj',
          coords: [23.8622, 90.0076],
          label: 'Manikganj, Bangladesh',
          description:
            'Situated between the Padma and Jamuna rivers, Manikganj is celebrated for its natural beauty and agricultural fields.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Manikganj',
        },
        {
          id: 'munshiganj',
          coords: [23.5597, 90.4262],
          label: 'Munshiganj, Bangladesh',
          description:
            'Known as the land of ponds and rivers, Munshiganj is historically important with ancient ruins and monuments.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Munshiganj',
        },
        {
          id: 'narayanganj',
          coords: [23.6338, 90.5054],
          label: 'Narayanganj, Bangladesh',
          description:
            "A key industrial city, often called the 'Dundee of Bangladesh' due to its jute industry, and a major river port.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Narayanganj',
        },
        {
          id: 'narsingdi',
          coords: [24.1368, 90.7966],
          label: 'Narsingdi, Bangladesh',
          description:
            'Located on the Meghna River, Narsingdi is an important agricultural and industrial district.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Narsingdi',
        },
        {
          id: 'rajbari',
          coords: [23.7554, 89.0964],
          label: 'Rajbari, Bangladesh',
          description:
            'A scenic district known for its river ports and as a major transportation hub.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Rajbari',
        },
        {
          id: 'shariatpur',
          coords: [23.2083, 90.3541],
          label: 'Shariatpur, Bangladesh',
          description:
            'A rural district rich in culture and tradition, known for its small industries and handicrafts.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Shariatpur',
        },
        {
          id: 'tangail',
          coords: [24.2562, 89.9213],
          label: 'Tangail, Bangladesh',
          description:
            'Famous for its handloom sarees and sweetmeats, Tangail is a culturally vibrant district.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Tangail',
        },
      ],
    },
    {
      name: 'Chattogram',
      districts: [
        {
          id: 'bandarban',
          coords: [22.2036, 92.2173],
          label: 'Bandarban, Bangladesh',
          description:
            'A popular tourist destination with stunning hills, waterfalls, and indigenous cultures.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Bandarban',
        },
        {
          id: 'brahmanbaria',
          coords: [23.9749, 91.1118],
          label: 'Brahmanbaria, Bangladesh',
          description:
            "Known as the 'cultural capital' of Bangladesh, with a rich heritage in music and literature.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Brahmanbaria',
        },
        {
          id: 'chandpur',
          coords: [23.2433, 90.6416],
          label: 'Chandpur, Bangladesh',
          description:
            'Located at the confluence of the Meghna and Padma rivers, Chandpur is a major trading center.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Chandpur',
        },
        {
          id: 'chattogram',
          coords: [22.3419, 91.8155],
          label: 'Chattogram, Bangladesh',
          description:
            'A major port city and the financial hub of the country, Chattogram is a bustling metropolitan area.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Chattogram',
        },
        {
          id: 'cumilla',
          coords: [23.4682, 91.1809],
          label: 'Cumilla, Bangladesh',
          description:
            'A historic district known for its ancient Buddhist ruins and archaeological sites.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Cumilla',
        },
        {
          id: 'coxs_bazar',
          coords: [21.4273, 92.0058],
          label: "Cox's Bazar, Bangladesh",
          description:
            "Home to the world's longest natural sea beach, it's a popular tourist destination.",
          img: "https://placehold.co/600x400/007a4d/ffffff?text=Cox's+Bazar",
        },
        {
          id: 'feni',
          coords: [23.0232, 91.3976],
          label: 'Feni, Bangladesh',
          description:
            "A district with a significant role in the country's history and a growing economic center.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Feni',
        },
        {
          id: 'khagrachhari',
          coords: [23.0333, 91.9833],
          label: 'Khagrachhari, Bangladesh',
          description:
            'A hilly district with beautiful landscapes, waterfalls, and rich tribal heritage.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Khagrachhari',
        },
        {
          id: 'lakshmipur',
          coords: [22.9463, 90.8436],
          label: 'Lakshmipur, Bangladesh',
          description:
            "Known for its agricultural economy and river systems, contributing significantly to the nation's food supply.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Lakshmipur',
        },
        {
          id: 'noakhali',
          coords: [22.8488, 91.1098],
          label: 'Noakhali, Bangladesh',
          description:
            'A coastal district with a large number of islands and a history of resistance movements.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Noakhali',
        },
        {
          id: 'rangamati',
          coords: [22.6953, 92.1764],
          label: 'Rangamati, Bangladesh',
          description:
            'A scenic hill district with the largest man-made lake in Bangladesh, making it a popular tourist spot.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Rangamati',
        },
      ],
    },
    {
      name: 'Khulna',
      districts: [
        {
          id: 'bagerhat',
          coords: [22.6582, 89.7891],
          label: 'Bagerhat, Bangladesh',
          description:
            'Home to the UNESCO World Heritage site of the Sixty Dome Mosque and a gateway to the Sundarbans.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Bagerhat',
        },
        {
          id: 'chuadanga',
          coords: [23.642, 88.8519],
          label: 'Chuadanga, Bangladesh',
          description:
            'A border district known for its agricultural produce, particularly sugarcane.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Chuadanga',
        },
        {
          id: 'jessore',
          coords: [23.1664, 89.2078],
          label: 'Jessore, Bangladesh',
          description:
            'A major hub for transportation and business, Jessore is known for its sweet-making industry.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Jessore',
        },
        {
          id: 'jhenaidah',
          coords: [23.4333, 89.1667],
          label: 'Jhenaidah, Bangladesh',
          description:
            'Famous for its mango orchards and historical monuments, Jhenaidah is a culturally rich district.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Jhenaidah',
        },
        {
          id: 'khulna',
          coords: [22.8184, 89.5682],
          label: 'Khulna, Bangladesh',
          description:
            'A major industrial city and a port on the Rupsa River, Khulna is a gateway to the Sundarbans.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Khulna',
        },
        {
          id: 'kushtia',
          coords: [23.9082, 89.1172],
          label: 'Kushtia, Bangladesh',
          description:
            'Known as the cultural capital of Bangladesh, with historical figures like Lalon Shah.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Kushtia',
        },
        {
          id: 'magura',
          coords: [23.4735, 89.4206],
          label: 'Magura, Bangladesh',
          description:
            'A district known for its fertile land and diverse agricultural products.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Magura',
        },
        {
          id: 'meherpur',
          coords: [23.7747, 88.6401],
          label: 'Meherpur, Bangladesh',
          description:
            'With historical significance as the first capital of Bangladesh, Meherpur is known for its mangoes.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Meherpur',
        },
        {
          id: 'narail',
          coords: [23.1118, 89.8493],
          label: 'Narail, Bangladesh',
          description:
            'A peaceful district known for its artists and the birthplace of renowned cricketer Mashrafe Bin Mortaza.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Narail',
        },
        {
          id: 'satkhira',
          coords: [22.7176, 89.0722],
          label: 'Satkhira, Bangladesh',
          description:
            'A coastal district bordering the Sundarbans, known for its shrimp and mangrove forests.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Satkhira',
        },
      ],
    },
    {
      name: 'Rajshahi',
      districts: [
        {
          id: 'bogura',
          coords: [24.8465, 89.3752],
          label: 'Bogura, Bangladesh',
          description:
            'An ancient city with a rich archaeological history, including the ancient ruins of Mahasthangarh.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Bogura',
        },
        {
          id: 'joypurhat',
          coords: [25.1051, 89.0964],
          label: 'Joypurhat, Bangladesh',
          description:
            'Primarily an agricultural district known for its sugarcane production and large sugar mills.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Joypurhat',
        },
        {
          id: 'naogaon',
          coords: [24.7891, 88.9448],
          label: 'Naogaon, Bangladesh',
          description:
            'A significant rice-producing district, Naogaon is also known for the historical Paharpur Vihara.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Naogaon',
        },
        {
          id: 'natore',
          coords: [24.4103, 89.0069],
          label: 'Natore, Bangladesh',
          description:
            'Famous for the Dighapatia Rajbari, a historical palace, and its vast mango orchards.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Natore',
        },
        {
          id: 'nawabganj',
          coords: [24.606, 88.2917],
          label: 'Nawabganj, Bangladesh',
          description:
            'Known as the mango capital of Bangladesh, with a wide variety of mangoes.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Nawabganj',
        },
        {
          id: 'pabna',
          coords: [24.0041, 89.2483],
          label: 'Pabna, Bangladesh',
          description:
            'A riverine district famous for its dairy products and textile industries.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Pabna',
        },
        {
          id: 'rajshahi',
          coords: [24.3688, 88.5836],
          label: 'Rajshahi, Bangladesh',
          description:
            "A major city known as the 'Silk City' and 'Education City' of Bangladesh, with a serene environment.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Rajshahi',
        },
        {
          id: 'sirajganj',
          coords: [24.469, 89.702],
          label: 'Sirajganj, Bangladesh',
          description:
            'Situated on the bank of the Jamuna River, it is known for its weaving industry.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Sirajganj',
        },
      ],
    },
    {
      name: 'Rangpur',
      districts: [
        {
          id: 'dinajpur',
          coords: [25.6308, 88.6387],
          label: 'Dinajpur, Bangladesh',
          description:
            "Known as the 'City of Mangoes,' Dinajpur is a major agricultural hub.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Dinajpur',
        },
        {
          id: 'gaibandha',
          coords: [25.3218, 89.5492],
          label: 'Gaibandha, Bangladesh',
          description:
            'A district with beautiful rivers and a rich history, known for its tranquil rural life.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Gaibandha',
        },
        {
          id: 'kurigram',
          coords: [25.8071, 89.6534],
          label: 'Kurigram, Bangladesh',
          description:
            "Known for its many rivers and 'Char' lands, Kurigram is a flood-prone but fertile district.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Kurigram',
        },
        {
          id: 'lalmonirhat',
          coords: [25.9923, 89.2785],
          label: 'Lalmonirhat, Bangladesh',
          description:
            'A northern border district with a strong railway history and a significant agricultural base.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Lalmonirhat',
        },
        {
          id: 'nilphamari',
          coords: [25.932, 88.8576],
          label: 'Nilphamari, Bangladesh',
          description:
            "A district known for its 'Neel' or indigo cultivation during the colonial era and a large railway workshop.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Nilphamari',
        },
        {
          id: 'panchagarh',
          coords: [26.3409, 88.5583],
          label: 'Panchagarh, Bangladesh',
          description:
            'The northernmost district of Bangladesh, famous for its scenic tea gardens.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Panchagarh',
        },
        {
          id: 'rangpur',
          coords: [25.7456, 89.2753],
          label: 'Rangpur, Bangladesh',
          description:
            'An important city in the northern region, known for its agriculture and diverse cultural heritage.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Rangpur',
        },
        {
          id: 'thakurgaon',
          coords: [26.0428, 88.4552],
          label: 'Thakurgaon, Bangladesh',
          description:
            'A district with significant agricultural production, particularly rice and sugarcane.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Thakurgaon',
        },
      ],
    },
    {
      name: 'Sylhet',
      districts: [
        {
          id: 'habiganj',
          coords: [24.3855, 91.4116],
          label: 'Habiganj, Bangladesh',
          description:
            "Known as the 'City of Tea,' Habiganj is surrounded by lush green tea gardens.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Habiganj',
        },
        {
          id: 'moulvibazar',
          coords: [24.2916, 91.7774],
          label: 'Moulvibazar, Bangladesh',
          description:
            'A popular tourist destination with breathtaking tea gardens and beautiful natural landscapes.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Moulvibazar',
        },
        {
          id: 'sunamganj',
          coords: [25.071, 91.3995],
          label: 'Sunamganj, Bangladesh',
          description:
            "A land of 'Haors' (wetlands), Sunamganj is a major source of fish and rice.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Sunamganj',
        },
        {
          id: 'sylhet',
          coords: [24.899, 91.8679],
          label: 'Sylhet, Bangladesh',
          description:
            'A spiritual and cultural hub, known for its lush tea gardens, hills, and a large expatriate community.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Sylhet',
        },
      ],
    },
    {
      name: 'Mymensingh',
      districts: [
        {
          id: 'jamalpur',
          coords: [24.9189, 89.9575],
          label: 'Jamalpur, Bangladesh',
          description:
            'A riverine district known for its rich agricultural production and handicrafts.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Jamalpur',
        },
        {
          id: 'mymensingh',
          coords: [24.7471, 90.4203],
          label: 'Mymensingh, Bangladesh',
          description:
            'The divisional headquarters, known for its educational institutions and vibrant cultural scene.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Mymensingh',
        },
        {
          id: 'netrokona',
          coords: [24.8727, 90.7289],
          label: 'Netrokona, Bangladesh',
          description:
            'Famous for its natural beauty and a significant number of lakes and rivers.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Netrokona',
        },
        {
          id: 'sherpur',
          coords: [25.0185, 90.0163],
          label: 'Sherpur, Bangladesh',
          description:
            'A district known for its hilly terrain, forests, and rich biodiversity.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Sherpur',
        },
      ],
    },
    {
      name: 'Barisal',
      districts: [
        {
          id: 'barguna',
          coords: [22.0952, 90.1245],
          label: 'Barguna, Bangladesh',
          description:
            'A coastal district with a large number of rivers and canals, known for its unique flora and fauna.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Barguna',
        },
        {
          id: 'barisal',
          coords: [22.701, 90.3535],
          label: 'Barisal, Bangladesh',
          description:
            "A major city and the divisional headquarters, often called the 'Venice of the East' due to its numerous canals.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Barisal',
        },
        {
          id: 'bhola',
          coords: [22.3168, 90.6558],
          label: 'Bhola, Bangladesh',
          description:
            'The largest island of Bangladesh, known for its tranquil beaches and unique rural life.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Bhola',
        },
        {
          id: 'jhalokati',
          coords: [22.6418, 90.1983],
          label: 'Jhalokati, Bangladesh',
          description:
            'A small district known for its river ports and the floating guava market.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Jhalokati',
        },
        {
          id: 'patuakhali',
          coords: [22.3484, 90.3346],
          label: 'Patuakhali, Bangladesh',
          description:
            'A coastal district with the famous Kuakata sea beach and a gateway to the Sundarbans.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Patuakhali',
        },
        {
          id: 'pirojpur',
          coords: [22.5833, 89.9667],
          label: 'Pirojpur, Bangladesh',
          description:
            'A district with a significant number of rivers, canals, and agricultural fields.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Pirojpur',
        },
      ],
    },
    {
      name: 'Rangpur',
      districts: [
        {
          id: 'dinajpur',
          coords: [25.6308, 88.6387],
          label: 'Dinajpur, Bangladesh',
          description:
            "Known as the 'City of Mangoes,' Dinajpur is a major agricultural hub.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Dinajpur',
        },
        {
          id: 'gaibandha',
          coords: [25.3218, 89.5492],
          label: 'Gaibandha, Bangladesh',
          description:
            'A district with beautiful rivers and a rich history, known for its tranquil rural life.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Gaibandha',
        },
        {
          id: 'kurigram',
          coords: [25.8071, 89.6534],
          label: 'Kurigram, Bangladesh',
          description:
            "Known for its many rivers and 'Char' lands, Kurigram is a flood-prone but fertile district.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Kurigram',
        },
        {
          id: 'lalmonirhat',
          coords: [25.9923, 89.2785],
          label: 'Lalmonirhat, Bangladesh',
          description:
            'A northern border district with a strong railway history and a significant agricultural base.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Lalmonirhat',
        },
        {
          id: 'nilphamari',
          coords: [25.932, 88.8576],
          label: 'Nilphamari, Bangladesh',
          description:
            "A district known for its 'Neel' or indigo cultivation during the colonial era and a large railway workshop.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Nilphamari',
        },
        {
          id: 'panchagarh',
          coords: [26.3409, 88.5583],
          label: 'Panchagarh, Bangladesh',
          description:
            'The northernmost district of Bangladesh, famous for its scenic tea gardens.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Panchagarh',
        },
        {
          id: 'rangpur',
          coords: [25.7456, 89.2753],
          label: 'Rangpur, Bangladesh',
          description:
            'An important city in the northern region, known for its agriculture and diverse cultural heritage.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Rangpur',
        },
        {
          id: 'thakurgaon',
          coords: [26.0428, 88.4552],
          label: 'Thakurgaon, Bangladesh',
          description:
            'A district with significant agricultural production, particularly rice and sugarcane.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Thakurgaon',
        },
      ],
    },
    {
      name: 'Sylhet',
      districts: [
        {
          id: 'habiganj',
          coords: [24.3855, 91.4116],
          label: 'Habiganj, Bangladesh',
          description:
            "Known as the 'City of Tea,' Habiganj is surrounded by lush green tea gardens.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Habiganj',
        },
        {
          id: 'moulvibazar',
          coords: [24.2916, 91.7774],
          label: 'Moulvibazar, Bangladesh',
          description:
            'A popular tourist destination with breathtaking tea gardens and beautiful natural landscapes.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Moulvibazar',
        },
        {
          id: 'sunamganj',
          coords: [25.071, 91.3995],
          label: 'Sunamganj, Bangladesh',
          description:
            "A land of 'Haors' (wetlands), Sunamganj is a major source of fish and rice.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Sunamganj',
        },
        {
          id: 'sylhet',
          coords: [24.899, 91.8679],
          label: 'Sylhet, Bangladesh',
          description:
            'A spiritual and cultural hub, known for its lush tea gardens, hills, and a large expatriate community.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Sylhet',
        },
      ],
    },
    {
      name: 'Khulna',
      districts: [
        {
          id: 'bagerhat',
          coords: [22.6582, 89.7891],
          label: 'Bagerhat, Bangladesh',
          description:
            'Home to the UNESCO World Heritage site of the Sixty Dome Mosque and a gateway to the Sundarbans.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Bagerhat',
        },
        {
          id: 'chuadanga',
          coords: [23.642, 88.8519],
          label: 'Chuadanga, Bangladesh',
          description:
            'A border district known for its agricultural produce, particularly sugarcane.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Chuadanga',
        },
        {
          id: 'jessore',
          coords: [23.1664, 89.2078],
          label: 'Jessore, Bangladesh',
          description:
            'A major hub for transportation and business, Jessore is known for its sweet-making industry.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Jessore',
        },
        {
          id: 'jhenaidah',
          coords: [23.4333, 89.1667],
          label: 'Jhenaidah, Bangladesh',
          description:
            'Famous for its mango orchards and historical monuments, Jhenaidah is a culturally rich district.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Jhenaidah',
        },
        {
          id: 'khulna',
          coords: [22.8184, 89.5682],
          label: 'Khulna, Bangladesh',
          description:
            'A major industrial city and a port on the Rupsa River, Khulna is a gateway to the Sundarbans.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Khulna',
        },
        {
          id: 'kushtia',
          coords: [23.9082, 89.1172],
          label: 'Kushtia, Bangladesh',
          description:
            'Known as the cultural capital of Bangladesh, with historical figures like Lalon Shah.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Kushtia',
        },
        {
          id: 'magura',
          coords: [23.4735, 89.4206],
          label: 'Magura, Bangladesh',
          description:
            'A district with fertile land and a diverse range of agricultural products.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Magura',
        },
        {
          id: 'meherpur',
          coords: [23.7747, 88.6401],
          label: 'Meherpur, Bangladesh',
          description:
            'With historical significance as the first capital of Bangladesh, Meherpur is known for its mangoes.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Meherpur',
        },
        {
          id: 'narail',
          coords: [23.1118, 89.8493],
          label: 'Narail, Bangladesh',
          description:
            'A peaceful district known for its artists and the birthplace of renowned cricketer Mashrafe Bin Mortaza.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Narail',
        },
        {
          id: 'satkhira',
          coords: [22.7176, 89.0722],
          label: 'Satkhira, Bangladesh',
          description:
            'A coastal district bordering the Sundarbans, known for its shrimp and mangrove forests.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Satkhira',
        },
      ],
    },
    {
      name: 'Rajshahi',
      districts: [
        {
          id: 'bogura',
          coords: [24.8465, 89.3752],
          label: 'Bogura, Bangladesh',
          description:
            'An ancient city with a rich archaeological history, including the ancient ruins of Mahasthangarh.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Bogura',
        },
        {
          id: 'joypurhat',
          coords: [25.1051, 89.0964],
          label: 'Joypurhat, Bangladesh',
          description:
            'Primarily an agricultural district known for its sugarcane production and large sugar mills.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Joypurhat',
        },
        {
          id: 'naogaon',
          coords: [24.7891, 88.9448],
          label: 'Naogaon, Bangladesh',
          description:
            'A significant rice-producing district, Naogaon is also known for the historical Paharpur Vihara.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Naogaon',
        },
        {
          id: 'natore',
          coords: [24.4103, 89.0069],
          label: 'Natore, Bangladesh',
          description:
            'Famous for the Dighapatia Rajbari, a historical palace, and its vast mango orchards.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Natore',
        },
        {
          id: 'nawabganj',
          coords: [24.606, 88.2917],
          label: 'Nawabganj, Bangladesh',
          description:
            'Known as the mango capital of Bangladesh, with a wide variety of mangoes.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Nawabganj',
        },
        {
          id: 'pabna',
          coords: [24.0041, 89.2483],
          label: 'Pabna, Bangladesh',
          description:
            'A riverine district famous for its dairy products and textile industries.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Pabna',
        },
        {
          id: 'rajshahi',
          coords: [24.3688, 88.5836],
          label: 'Rajshahi, Bangladesh',
          description:
            "A major city known as the 'Silk City' and 'Education City' of Bangladesh, with a serene environment.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Rajshahi',
        },
        {
          id: 'sirajganj',
          coords: [24.469, 89.702],
          label: 'Sirajganj, Bangladesh',
          description:
            'Situated on the bank of the Jamuna River, it is known for its weaving industry.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Sirajganj',
        },
      ],
    },
    {
      name: 'Rangpur',
      districts: [
        {
          id: 'dinajpur',
          coords: [25.6308, 88.6387],
          label: 'Dinajpur, Bangladesh',
          description:
            "Known as the 'City of Mangoes,' Dinajpur is a major agricultural hub.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Dinajpur',
        },
        {
          id: 'gaibandha',
          coords: [25.3218, 89.5492],
          label: 'Gaibandha, Bangladesh',
          description:
            'A district with beautiful rivers and a rich history, known for its tranquil rural life.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Gaibandha',
        },
        {
          id: 'kurigram',
          coords: [25.8071, 89.6534],
          label: 'Kurigram, Bangladesh',
          description:
            "Known for its many rivers and 'Char' lands, Kurigram is a flood-prone but fertile district.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Kurigram',
        },
        {
          id: 'lalmonirhat',
          coords: [25.9923, 89.2785],
          label: 'Lalmonirhat, Bangladesh',
          description:
            'A northern border district with a strong railway history and a significant agricultural base.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Lalmonirhat',
        },
        {
          id: 'nilphamari',
          coords: [25.932, 88.8576],
          label: 'Nilphamari, Bangladesh',
          description:
            "A district known for its 'Neel' or indigo cultivation during the colonial era and a large railway workshop.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Nilphamari',
        },
        {
          id: 'panchagarh',
          coords: [26.3409, 88.5583],
          label: 'Panchagarh, Bangladesh',
          description:
            'The northernmost district of Bangladesh, famous for its scenic tea gardens.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Panchagarh',
        },
        {
          id: 'rangpur',
          coords: [25.7456, 89.2753],
          label: 'Rangpur, Bangladesh',
          description:
            'An important city in the northern region, known for its agriculture and diverse cultural heritage.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Rangpur',
        },
        {
          id: 'thakurgaon',
          coords: [26.0428, 88.4552],
          label: 'Thakurgaon, Bangladesh',
          description:
            'A district with significant agricultural production, particularly rice and sugarcane.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Thakurgaon',
        },
      ],
    },
    {
      name: 'Sylhet',
      districts: [
        {
          id: 'habiganj',
          coords: [24.3855, 91.4116],
          label: 'Habiganj, Bangladesh',
          description:
            "Known as the 'City of Tea,' Habiganj is surrounded by lush green tea gardens.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Habiganj',
        },
        {
          id: 'moulvibazar',
          coords: [24.2916, 91.7774],
          label: 'Moulvibazar, Bangladesh',
          description:
            'A popular tourist destination with breathtaking tea gardens and beautiful natural landscapes.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Moulvibazar',
        },
        {
          id: 'sunamganj',
          coords: [25.071, 91.3995],
          label: 'Sunamganj, Bangladesh',
          description:
            "A land of 'Haors' (wetlands), Sunamganj is a major source of fish and rice.",
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Sunamganj',
        },
        {
          id: 'sylhet',
          coords: [24.899, 91.8679],
          label: 'Sylhet, Bangladesh',
          description:
            'A spiritual and cultural hub, known for its lush tea gardens, hills, and a large expatriate community.',
          img: 'https://placehold.co/600x400/007a4d/ffffff?text=Sylhet',
        },
      ],
    },
  ],
}


export default function MovieDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showTrailer, setShowTrailer] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState('dhaka')
  const mapRef = useRef(null)

  // 🎬 Fetch Movie Details from TMDB
  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true)
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&append_to_response=videos`
        )
        const data = await res.json()
        setMovie(data)
      } catch (err) {
        console.error('Error fetching movie details:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMovie()
  }, [id])

  // 🗺️ Init Leaflet Map
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!movie) return

    import('leaflet').then((leaflet) => {
      const L = leaflet
      const mapElement = document.getElementById('map')
      if (!mapElement) return

      if (mapRef.current) {
        mapRef.current.remove()
      }

      const { coords, label, img } = mapLocations[selectedPlace]
      const map = L.map(mapElement).setView(coords, 12)
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>',
      }).addTo(map)

      const customIcon = L.icon({
        iconUrl: img,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      })

      L.marker(coords, { icon: customIcon })
        .addTo(map)
        .bindPopup(label)
        .openPopup()
    })
  }, [selectedPlace, movie])

  if (loading) return <LoadingSpinner />
  if (!movie)
    return (
      <div className="p-6 text-center text-red-500">❌ Movie not found!</div>
    )

  // 🎥 Trailer from TMDB
  const trailer = movie.videos?.results?.find(
    (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
  )


    // Book Now handler function
  const handleBookNow = () => {
    // Movie er data pass kore seat booking page e jao
    router.push(`/booking/${id}`)
  }

  if (loading) return <LoadingSpinner />
  if (!movie)
    return (
      <div className="p-6 text-center text-red-500">❌ Movie not found!</div>
    )
  return (
    <div className="p-4 md:p-6 mx-auto space-y-10 text-white max-w-7xl">
      {/*  Banner */}
      <div className="relative mt-10 w-full h-72 md:h-96 rounded-xl overflow-hidden shadow-lg">
        <button
          onClick={() => router.back()}
          className="flex  absolute top-4 left-4 z-10 items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-6">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-red-500">
            {movie.title}
          </h1>
          <p className="mt-1 text-gray-200 text-sm md:text-base">
            {movie.release_date} | ⭐ {movie.vote_average} ({movie.vote_count}{' '}
            votes)
          </p>
        </div>
      </div>

      {/* 🎥 Trailer */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative bg-black rounded-xl p-4 max-w-3xl w-full">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg"
            >
              ✖ Close
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={`${movie.title} Trailer`}
              width="100%"
              height="500"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        </div>
      )}

      {/* 📖 Overview */}
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-yellow-400">
        Overview
      </h2>
      <p className="text-gray-300 mb-8 leading-relaxed">{movie.overview}</p>

      {/* 🏷️ Movie Info */}
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-blue-400">
        Movie Info
      </h2>
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-2 text-sm md:text-base">
        <p>
          <strong>Original Language:</strong> {movie.original_language}
        </p>
        <p>
          <strong>Release Date:</strong> {movie.release_date}
        </p>
        <p>
          <strong>Runtime:</strong> {movie.runtime} minutes
        </p>
        <p>
          <strong>Genres:</strong> {movie.genres?.map((g) => g.name).join(', ')}
        </p>
        <p>
          <strong>Popularity:</strong> {movie.popularity}
        </p>
        <p>
          <strong>Average Rating:</strong> ⭐ {movie.vote_average} (
          {movie.vote_count} votes)
        </p>
      </div>

      {/* Trailer Button */}
      <div className="flex gap-4 flex-wrap">
        {trailer && (
          <button
            onClick={() => setShowTrailer(true)}
            className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition flex items-center gap-2"
          >
            ▶ Watch Trailer
          </button>
        )}
        
        {/* Book Now Button */}
        <button
          onClick={handleBookNow}
          className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
        >
          🎫 Book Now
        </button>
      </div>

      {/*  Location Buttons */}
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-green-400">
        Select Location
      </h2>
      <div className="flex gap-3 flex-wrap mb-6">
        {Object.keys(mapLocations).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedPlace(key)}
            className={`px-4 py-2 rounded-lg ${
              selectedPlace === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-200'
            }`}
          >
            {mapLocations[key].label}
          </button>
        ))}
      </div>

      {/* Leaflet Map */}
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-purple-400">
        Location Map
      </h2>
      <div
        id="map"
        className="w-full md:w-3/4 lg:w-1/2 h-72 md:h-96 rounded-xl overflow-hidden shadow-lg mx-auto"
      />
    </div>
  )
}