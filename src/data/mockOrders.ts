import { Order } from '../types';
import { PRODUCTS } from './products';

export const SEED_ORDERS: Order[] = [
  {
    id: 'BA-748291',
    orderNumber: 'BA-748291',
    customerName: 'রফিকুল ইসলাম',
    phone: '01812345678',
    address: 'বাড়ি নং ১২, রোড নং ৪, ব্লক-সি, বনশ্রী',
    city: 'ঢাকা সিটির ভেতরে',
    paymentMethod: 'cod',
    subtotal: 4100,
    deliveryFee: 0,
    discount: 410,
    total: 3690,
    status: 'ডেলিভারির জন্য বের হয়েছে',
    currentStageIndex: 3, // Out for delivery
    courierName: 'Steadfast Courier',
    consignmentId: 'SF-8829410',
    estimatedDelivery: 'আজ বিকেল ৫:০০ - ৬:০০ টা',
    riderName: 'মো: কাওসার হোসেন',
    riderPhone: '01711223344',
    createdAt: '৪ সেপ্টেম্বর ২০২৬, দুপুর ২:১৫',
    items: [
      {
        id: 'item-1',
        product: PRODUCTS[0], // Black panjabi
        selectedSize: 'L (৪২)',
        selectedColor: PRODUCTS[0].colors[0],
        quantity: 1,
      },
      {
        id: 'item-2',
        product: PRODUCTS[2], // Kurti
        selectedSize: 'M (৩৮)',
        selectedColor: PRODUCTS[2].colors[0],
        quantity: 1,
      },
    ],
    events: [
      {
        titleBn: 'অর্ডার সফলভাবে গৃহীত হয়েছে',
        descriptionBn: 'গ্রাহকের অর্ডার বৈচিত্র্য অঙ্গন সিস্টেমে নিশ্চিত হয়েছে।',
        timestamp: '৪ সেপ্টেম্বর, দুপুর ২:১৫',
        completed: true,
      },
      {
        titleBn: 'প্যাকেজিং ও কোয়ালিটি কন্ট্রোল সম্পন্ন',
        descriptionBn: 'পোশাকের গুণগত মান যাচাই শেষে সিল্ড প্যাকেজিং করা হয়েছে।',
        timestamp: '৪ সেপ্টেম্বর, বিকাল ৫:৩০',
        completed: true,
      },
      {
        titleBn: 'কুরিয়ার হাবে স্থানান্তর (In Transit)',
        descriptionBn: 'Steadfast সেন্ট্রাল হাব থেকে স্থানীয় বনশ্রী সাব-হাবে পাঠানো হয়েছে।',
        timestamp: '৫ সেপ্টেম্বর, সকাল ৮:২০',
        completed: true,
      },
      {
        titleBn: 'ডেলিভারি রাইডারের সাথে বের হয়েছে (Out for Delivery)',
        descriptionBn: 'রাইডার মো: কাওসার হোসেন আপনার পার্সেল নিয়ে বের হয়েছেন। অনুগ্রহ করে ফোন চালু রাখুন।',
        timestamp: '৫ সেপ্টেম্বর, সকাল ১১:৪৫',
        completed: true,
        current: true,
      },
      {
        titleBn: 'ডেলিভারি সম্পন্ন',
        descriptionBn: 'গ্রাহক পণ্য গ্রহণ করবেন এবং ক্যাশ অন ডেলিভারি মূল্য পরিশোধ করবেন।',
        timestamp: 'প্রত্যাশিত: আজ বিকেল',
        completed: false,
      },
    ],
  },
  {
    id: 'BA-519283',
    orderNumber: 'BA-519283',
    customerName: 'সাদিয়া সুলতানা',
    phone: '01987654321',
    address: 'ফ্ল্যাট ৪বি, গ্রিন টাওয়ার, চকবাজার',
    city: 'চট্টগ্রাম জেলা',
    paymentMethod: 'cod',
    subtotal: 5800,
    deliveryFee: 0,
    discount: 580,
    total: 5220,
    status: 'কুরিয়ারে ট্রানজিটে রয়েছে',
    currentStageIndex: 2, // Dispatched / In Transit
    courierName: 'Pathao Courier',
    consignmentId: 'PT-991204',
    estimatedDelivery: 'আগামীকাল দুপুর',
    createdAt: '৪ সেপ্টেম্বর ২০২৬, রাত ৮:৪৫',
    items: [
      {
        id: 'item-3',
        product: PRODUCTS[1], // Dhakai Jamdani
        selectedSize: 'ফ্রি সাইজ (১২ হাত)',
        selectedColor: PRODUCTS[1].colors[0],
        quantity: 1,
      },
    ],
    events: [
      {
        titleBn: 'অর্ডার নিশ্চিত হয়েছে',
        descriptionBn: 'বৈচিত্র্য অঙ্গন প্রধান কার্যালয়ে অর্ডার রিসিভ হয়েছে।',
        timestamp: '৪ সেপ্টেম্বর, রাত ৮:৪৫',
        completed: true,
      },
      {
        titleBn: 'প্যাকেজিং সম্পন্ন',
        descriptionBn: 'স্পেশাল গিফট বক্সে জামদানি শাড়ি প্যাক করা হয়েছে।',
        timestamp: '৫ সেপ্টেম্বর, সকাল ১০:০০',
        completed: true,
      },
      {
        titleBn: 'চট্টগ্রামগামী কুরিয়ার ট্রাকে প্রেরিত',
        descriptionBn: 'পাঠাও ঢাকা হাব থেকে চট্টগ্রাম সেন্ট্রাল হাবে ট্রানজিটে রয়েছে।',
        timestamp: '৫ সেপ্টেম্বর, দুপুর ১২:৩০',
        completed: true,
        current: true,
      },
      {
        titleBn: 'ডেলিভারির জন্য বের হবে',
        descriptionBn: 'স্থানীয় ডেলিভারি হিরোর মাধ্যমে গ্রাহকের ঠিকানায় পৌঁছাবে।',
        timestamp: 'অপেক্ষমাণ',
        completed: false,
      },
      {
        titleBn: 'ডেলিভারি সম্পন্ন',
        descriptionBn: 'ডেলিভারি শেষে পেমেন্ট সম্পন্ন হবে।',
        timestamp: 'অপেক্ষমাণ',
        completed: false,
      },
    ],
  },
  {
    id: 'BA-302914',
    orderNumber: 'BA-302914',
    customerName: 'তানভীর আহমেদ',
    phone: '01700112233',
    address: 'সেক্টর ৭, উত্তরা, ঢাকা',
    city: 'ঢাকা সিটির ভেতরে',
    paymentMethod: 'cod',
    subtotal: 2450,
    deliveryFee: 70,
    discount: 0,
    total: 2520,
    status: 'ডেলিভারি সম্পন্ন হয়েছে',
    currentStageIndex: 4, // Delivered
    courierName: 'RedX Delivery',
    consignmentId: 'RX-441029',
    estimatedDelivery: 'ডেলিভারি সম্পন্ন',
    createdAt: '২ সেপ্টেম্বর ২০২৬, সকাল ১১:০০',
    items: [
      {
        id: 'item-4',
        product: PRODUCTS[0],
        selectedSize: 'XL (৪৪)',
        selectedColor: PRODUCTS[0].colors[1],
        quantity: 1,
      },
    ],
    events: [
      {
        titleBn: 'অর্ডার নিশ্চিতকরণ',
        descriptionBn: 'অর্ডার সিস্টেমে গ্রহণ করা হয়েছে।',
        timestamp: '২ সেপ্টেম্বর, সকাল ১১:০০',
        completed: true,
      },
      {
        titleBn: 'প্যাকেজিং ও ডিসপ্যাচ',
        descriptionBn: 'কোয়ালিটি চেকের পর রেডএক্স কুরিয়ারে হস্তান্তর।',
        timestamp: '২ সেপ্টেম্বর, বিকাল ৩:০০',
        completed: true,
      },
      {
        titleBn: 'হাবে পৌঁছানো',
        descriptionBn: 'উত্তরা স্থানীয় সাব-হাবে পার্সেল পৌঁছেছে।',
        timestamp: '৩ সেপ্টেম্বর, সকাল ৯:০০',
        completed: true,
      },
      {
        titleBn: 'রাইডারের হাতে হস্তান্তর',
        descriptionBn: 'রাইডার গ্রাহকের সাথে যোগাযোগ করেছেন।',
        timestamp: '৩ সেপ্টেম্বর, দুপুর ১:৩০',
        completed: true,
      },
      {
        titleBn: 'ডেলিভারি সম্পন্ন',
        descriptionBn: 'গ্রাহক পণ্য গ্রহণ করেছেন এবং মূল্য পরিশোধ করেছেন।',
        timestamp: '৩ সেপ্টেম্বর, বিকাল ৩:৪৫',
        completed: true,
        current: true,
      },
    ],
  },
];

/**
 * Helper to generate initial tracking events for any newly created user order
 */
export function createTrackingForNewOrder(orderData: {
  id: string;
  orderNumber: string;
  city: string;
  createdAt: string;
}): Pick<Order, 'currentStageIndex' | 'courierName' | 'consignmentId' | 'estimatedDelivery' | 'events'> {
  const isInsideDhaka = orderData.city.includes('ঢাকা');
  const courier = isInsideDhaka ? 'Steadfast Courier' : 'Pathao Courier';
  const consignment = `BA-TRK-${Math.floor(100000 + Math.random() * 900000)}`;

  return {
    currentStageIndex: 0, // Just Placed
    courierName: courier,
    consignmentId: consignment,
    estimatedDelivery: isInsideDhaka ? '২ কার্যদিবসের মধ্যে' : '৩ কার্যদিবসের মধ্যে',
    events: [
      {
        titleBn: 'অর্ডার গৃহীত ও কনফার্মড',
        descriptionBn: 'বৈচিত্র্য অঙ্গন আপনার অর্ডারটি আনন্দের সাথে গ্রহণ করেছে। শীঘ্রই আমাদের টিম প্রস্তুতি শুরু করবে।',
        timestamp: orderData.createdAt,
        completed: true,
        current: true,
      },
      {
        titleBn: 'প্যাকেজিং ও কোয়ালিটি ইন্সপেকশন',
        descriptionBn: 'কাপড়ের ফিনিশিং এবং সাইজ নিখুঁতভাবে চেক করে প্রিমিয়াম প্যাকেজিং করা হবে।',
        timestamp: 'অপেক্ষমাণ',
        completed: false,
      },
      {
        titleBn: `কুরিয়ারে হস্তান্তর (${courier})`,
        descriptionBn: `ট্র্যাকিং কোড: ${consignment}-সহ পার্সেলটি সেন্ট্রাল হাবে পাঠানো হবে।`,
        timestamp: 'অপেক্ষমাণ',
        completed: false,
      },
      {
        titleBn: 'ডেলিভারির জন্য বের হওয়া (Out for Delivery)',
        descriptionBn: 'স্থানীয় রাইডার পার্সেল ডেলিভারির পূর্বে আপনার মোবাইল নম্বরে কল করবেন।',
        timestamp: 'অপেক্ষমাণ',
        completed: false,
      },
      {
        titleBn: 'ডেলিভারি ও ক্যাশ অন পেমেন্ট',
        descriptionBn: 'পণ্য দেখে নিয়ে ডেলিভারি পার্সনকে ক্যাশ অন ডেলিভারির টাকা বুঝিয়ে দিন।',
        timestamp: 'অপেক্ষমাণ',
        completed: false,
      },
    ],
  };
}
