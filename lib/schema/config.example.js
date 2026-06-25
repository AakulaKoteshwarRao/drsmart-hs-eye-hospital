/**
 * CLINIC CONFIG — Single source of truth
 *
 * N1:  procedure.type now uses valid schema.org MedicalProcedureType enum name
 * N13: doctor.honorificPrefix added
 * N6:  guide.imageWidth / guide.imageHeight support added
 */

export const config = {

  site: {
    url:       "https://www.yourwebsite.com",
    blogPath:  "/blog",
    searchUrl: "/search?q={search_term_string}",
  },

  clinic: {
    name:           "Dr. Rajesh Kumar Dermatology Clinic",
    alternateName:  "Kumar Skin Care",
    logo:           "https://www.yourwebsite.com/images/logo.png",
    logoWidth:      600,
    logoHeight:     60,
    image:          "https://www.yourwebsite.com/images/clinic-photo.jpg",
    imageWidth:     1200,
    imageHeight:    800,
    description:    "Leading dermatology clinic in Bangalore providing expert skin care treatments with 15+ years of experience",
    email:          "contact@yourwebsite.com",
    telephone:      "+91-98765-43210",
    foundingDate:   "2009",
    priceRange:     "$$",
    specialty:      "Dermatology",
    serviceType:    "Dermatology Service",
    mapUrl:         "https://goo.gl/maps/yourmap",
    bookingUrl:     "https://www.yourwebsite.com/book-appointment",
    currenciesAccepted: "INR",
    paymentAccepted:    "Cash, Credit Card, Debit Card, UPI",
    languages: [
      { name: "English", code: "en" },
      { name: "Hindi",   code: "hi" },
      { name: "Kannada", code: "kn" },
    ],
    address: {
      street:  "123, 5th Block, Koramangala",
      city:    "Bangalore",
      state:   "Karnataka",
      pincode: "560095",
      country: "IN",
    },
    geo: {
      latitude:  12.9352,   // Number, not string — N8
      longitude: 77.6245,   // Number, not string — N8
    },
    hours: [
      { days: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "09:00", closes: "18:00" },
      { days: ["Saturday"], opens: "09:00", closes: "14:00" },
    ],
    social: {
      facebook:  "https://www.facebook.com/yourdoctorpage",
      instagram: "https://www.instagram.com/yourdoctorpage",
      linkedin:  "https://www.linkedin.com/in/yourprofile",
      twitter:   "https://twitter.com/yourdoctor",
      practo:    "https://www.practo.com/bangalore/doctor/your-profile",
    },
    rating: {
      value: 4.8,    // Number — N22
      count: 150,    // Number — N22
      best:  5,      // Number — N22
      worst: 1,      // Number — N22
    },
    faq: [
      { q: "Where is the clinic located?",      a: "123, 5th Block, Koramangala, Bangalore - 560095." },
      { q: "What are the clinic timings?",       a: "Monday to Friday 9AM–6PM, Saturday 9AM–2PM." },
      { q: "How do I book an appointment?",     a: "Call +91-98765-43210 or book online at our website." },
      { q: "What skin conditions are treated?", a: "Acne, eczema, psoriasis, hair loss, anti-aging, and laser treatments." },
    ],
  },

  doctor: {
    name:             "Dr. Rajesh Kumar",
    honorificPrefix:  "Dr.",              // N13
    image:            "https://www.yourwebsite.com/images/dr-rajesh-kumar.jpg",
    imageWidth:       800,
    imageHeight:      800,
    jobTitle:         "Dermatologist",
    gender:           "Male",
    description:      "Board-certified dermatologist with 15 years of experience specializing in acne, anti-aging, and laser procedures",
    email:            "dr.rajesh@yourwebsite.com",
    profilePath:      "/about",
    registrationNumber: "KMC-12345",
    degrees: [
      { name: "MBBS",                           institution: "AIIMS", level: "Medical Degree" },
      { name: "MD Dermatology",                 institution: "AIIMS", level: "Postgraduate"   },
      { name: "Board Certified in Dermatology", institution: "NBE",   level: "Certification" },
    ],
    awards: [
      "Best Dermatologist Award 2023 - Bangalore Medical Association",
      "Excellence in Cosmetic Dermatology 2022",
    ],
    memberships: ["Indian Medical Association", "IADVL"],
    knowsAbout:  ["Acne Treatment", "Anti-Aging Treatments", "Laser Hair Removal", "Chemical Peels"],
    languages: [
      { name: "English", code: "en" },
      { name: "Hindi",   code: "hi" },
      { name: "Kannada", code: "kn" },
    ],
  },

  reviews: [
    { author: "Priya Sharma", rating: 5, text: "Dr. Rajesh is extremely professional. My skin cleared up completely after 3 months.", date: "2024-01-15" },
    { author: "Amit Patel",   rating: 5, text: "Very knowledgeable and caring. Best dermatologist in Bangalore!", date: "2024-02-01" },
  ],

  services: [
    {
      slug:        "acne-treatment-program",
      name:        "Comprehensive Acne Treatment Program",
      description: "Complete acne treatment including diagnosis, medication plan, and follow-up care",
      output:      "Clear, acne-free skin with improved texture",
      areas:       ["Bangalore", "Koramangala", "Indiranagar"],
      offer: {
        price:       5000,    // Number — consistent with schema.org Offer.price
        description: "Includes consultation, medications, and 3 follow-up visits",
      },
      faq: [
        { q: "How long does the acne treatment program last?", a: "Typically 3–6 months depending on severity." },
        { q: "Are the medications included in the package?",   a: "Yes, basic medications are included in the package price." },
      ],
    },
  ],

  procedures: [
    {
      slug:              "chemical-peel",
      name:              "Chemical Peel for Acne Scars",
      alternateName:     "Glycolic Acid Peel",
      description:       "Glycolic acid peel to exfoliate skin, reduce acne scars, and improve texture",
      // N1: valid schema.org MedicalProcedureType enum value
      // Valid options: NoninvasiveProcedure | PercutaneousProcedure | SurgicalProcedure
      type:              "NoninvasiveProcedure",
      bodyLocation:      "Facial Skin",
      preparation:       "Avoid sun exposure for 2 weeks. Stop retinoids 1 week prior.",
      followup:          "Apply moisturizer and sunscreen. Avoid sun for 2 weeks.",
      howPerformed:      "Skin cleaned, glycolic acid applied for 5–10 minutes, neutralised, soothing mask applied.",
      prognosis:         "Visible improvement within 1–2 weeks. Best results after 3–6 sessions.",
      contraindications: ["Active skin infection", "Pregnancy", "Recent sun exposure"],
      cost: {
        price:    3000,    // Number
        minPrice: 2500,
        maxPrice: 4000,
      },
      faq: [
        { q: "Is chemical peel painful?",     a: "You may feel mild tingling but it is not painful." },
        { q: "How many sessions are needed?", a: "3–6 sessions spaced 4 weeks apart for best results." },
      ],
    },
  ],

  conditions: [
    {
      slug:          "acne-vulgaris",
      name:          "Acne Vulgaris",
      alternateName: "Acne",
      description:   "Common skin condition with pimples, blackheads, and whiteheads",
      icdCode:       "L70.0",
      anatomy:       "Skin",
      symptoms:      ["Pimples", "Blackheads", "Whiteheads", "Cysts", "Oily skin"],
      treatments:    ["Topical Retinoids", "Benzoyl Peroxide", "Chemical Peel for Acne Scars", "Laser Therapy"],
      risks:         ["Hormonal changes", "Family history", "Stress"],
      complications: ["Acne scars", "Hyperpigmentation"],
      epidemiology:  "Affects 80–90% of teenagers and 40–50% of adults",
      prognosis:     "Most cases controlled within 3–6 months with proper treatment",
      faq: [
        { q: "Is acne curable?",        a: "Acne can be effectively controlled and managed with the right treatment." },
        { q: "What causes adult acne?", a: "Hormonal changes, stress, diet, and certain medications." },
      ],
    },
  ],

  locations: [
    {
      slug:        "koramangala",
      name:        "Dr. Rajesh Kumar - Dermatologist in Koramangala",
      area:        "Koramangala",
      areasServed: ["Koramangala", "Indiranagar", "HSR Layout"],
      url:         "https://www.yourwebsite.com/locations/koramangala",
      faq: [
        { q: "Is the Koramangala clinic accepting new patients?", a: "Yes, we welcome new patients. Book online or call us." },
        { q: "What is the nearest landmark?",                     a: "Near 5th Block bus stop, opposite Forum Mall." },
      ],
    },
  ],

}
