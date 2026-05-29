export const CONFIG = {
    vatRate: 0.07,
    shippingCost: 50,
    currency: '฿'
};

export const formatPrice = (price) => {
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 0
    }).format(price);
};

export const products = [
    {
        id: 1,
        name: "Paracetamol 500mg",
        price: 35,
        category: "Medicines",
        image: "/images/paracetamol_500mg.png",
        description: "Standard Paracetamol 500mg tablets for fast and effective relief of headaches, body aches, muscle pain, and fever reduction. Gentle on the stomach.",
        specs: ["1 blister x 10 tablets", "500mg per tablet", "Relieves fever & pain"]
    },
    {
        id: 2,
        name: "Ibuprofen 400mg",
        price: 90,
        category: "Medicines",
        image: "/images/ibuprofen_blister.png",
        description: "Ibuprofen 400mg tablets to relieve acute inflammatory pain, toothaches, menstrual pain, muscular strains, and reduce fever.",
        specs: ["1 blister x 10 tablets", "400mg per tablet", "Anti-inflammatory NSAID"]
    },
    {
        id: 3,
        name: "Amoxicillin 500mg",
        price: 180,
        category: "Medicines",
        image: "/images/amoxicillin_capsules.png",
        description: "Amoxicillin 500mg capsules, a broad-spectrum penicillin antibiotic used to treat bacterial infections of the respiratory tract, skin, and urinary tract.",
        specs: ["1 blister x 10 capsules", "500mg per capsule", "Prescription antibiotic"]
    },
    {
        id: 4,
        name: "Cetirizine 10mg",
        price: 70,
        category: "Medicines",
        image: "/images/cetirizine_blister.png",
        description: "Cetirizine hydrochloride 10mg tablets for highly effective 24-hour relief of allergy symptoms like sneezing, runny nose, watery eyes, and hives.",
        specs: ["1 blister x 10 tablets", "10mg per tablet", "Antihistamine / Allergy relief"]
    },
    {
        id: 5,
        name: "Loratadine 10mg",
        price: 85,
        category: "Medicines",
        image: "/images/loratadine_blister.png",
        description: "Loratadine 10mg tablets providing 24-hour non-drowsy relief from allergic rhinitis, hay fever, sneezing, runny nose, and skin itching.",
        specs: ["1 blister x 10 tablets", "10mg per tablet", "24-Hour Non-Drowsy Allergy"]
    },
    {
        id: 6,
        name: "Omeprazole 20mg",
        price: 110,
        category: "Medicines",
        image: "/images/omeprazole_capsules.png",
        description: "Omeprazole 20mg capsules. Reduces excess acid production in the stomach to treat acid reflux (GERD), heartburn, and gastric ulcers.",
        specs: ["1 blister x 14 capsules", "20mg per capsule", "Proton Pump Inhibitor"]
    },
    {
        id: 7,
        name: "Metformin 500mg",
        price: 150,
        category: "Medicines",
        image: "/images/metformin_tablets.png",
        description: "Metformin hydrochloride 500mg tablets, used to control and manage high blood glucose levels in patients with type 2 diabetes mellitus.",
        specs: ["1 blister x 10 tablets", "500mg per tablet", "Oral antidiabetic medication"]
    },
    {
        id: 8,
        name: "Amlodipine 5mg",
        price: 120,
        category: "Medicines",
        image: "/images/amlodipine_tablets.png",
        description: "Amlodipine 5mg tablets. Relaxes blood vessels to lower blood pressure, improve blood circulation, and prevent angina (chest pain).",
        specs: ["1 blister x 10 tablets", "5mg per tablet", "Calcium channel blocker"]
    },
    {
        id: 9,
        name: "Simvastatin 20mg",
        price: 140,
        category: "Medicines",
        image: "/images/simvastatin_tablets.png",
        description: "Simvastatin 20mg tablets to lower high blood levels of cholesterol and triglycerides, reducing the risk of cardiovascular events.",
        specs: ["1 blister x 10 tablets", "20mg per tablet", "HMG-CoA Reductase Statin"]
    },
    {
        id: 10,
        name: "Bromhexine 8mg",
        price: 50,
        category: "Medicines",
        image: "/images/bromhexine_tablets.png",
        description: "Bromhexine hydrochloride 8mg tablets to dissolve, thin, and break up thick sticky mucus in the airways during chesty coughs.",
        specs: ["1 blister x 10 tablets", "8mg per tablet", "Mucolytic / Cough relief"]
    },
    {
        id: 11,
        name: "Whey Protein Isolate",
        price: 950,
        category: "Supplements",
        image: "/images/whey_protein.png",
        description: "Ultra-pure grass-fed whey protein isolate designed for rapid muscle recovery, lean muscle growth, and optimal post-workout nutrition.",
        specs: ["1 tub x 900g", "25g protein per scoop", "Zero sugar & low fat"]
    },
    {
        id: 12,
        name: "Collagen Peptide Powder",
        price: 680,
        category: "Supplements",
        image: "/images/collagen_peptide.png",
        description: "Hydrolyzed Type I & III collagen peptides to boost skin elasticity, reduce deep wrinkles, hydrate skin cells, and support joint health.",
        specs: ["1 tub x 250g", "Premium marine source", "Unflavored dietary powder"]
    },
    {
        id: 13,
        name: "Multivitamin Complex",
        price: 260,
        category: "Supplements",
        image: "/images/pill_bottle_white.png",
        description: "Comprehensive multivitamin and mineral complex tablets to prevent vitamin deficiencies, boost overall health, and relieve daily fatigue.",
        specs: ["1 bottle x 30 tablets", "Complete daily nutrition", "Dietary supplement"]
    },
    {
        id: 14,
        name: "Vitamin C 1000mg",
        price: 320,
        category: "Supplements",
        image: "/images/pill_bottle_white.png",
        description: "High-absorption medical-grade Vitamin C (Ascorbic Acid) 1000mg to strengthen daily immunity defenses, prevent common colds, and support collagen.",
        specs: ["1 bottle x 30 tablets", "1000mg per tablet", "Immune support antioxidant"]
    },
    {
        id: 15,
        name: "Fish Oil Omega-3 1000mg",
        price: 340,
        category: "Supplements",
        image: "/images/pill_bottle_white.png",
        description: "Premium omega-3 fish oil softgels containing rich EPA and DHA fatty acids. Promotes cardiovascular health, brain function, and joint elasticity.",
        specs: ["1 bottle x 30 softgels", "1000mg per softgel", "Omega-3 dietary supplement"]
    },
    {
        id: 16,
        name: "Calcium + Vitamin D3",
        price: 290,
        category: "Supplements",
        image: "/images/pill_bottle_white.png",
        description: "High-strength Calcium carbonate combined with active Vitamin D3 to maximize calcium absorption, supporting healthy bones, teeth, and muscles.",
        specs: ["1 bottle x 60 tablets", "Enhanced calcium absorption", "Supports strong bones & joints"]
    },
    {
        id: 17,
        name: "Coenzyme Q10 100mg",
        price: 450,
        category: "Supplements",
        image: "/images/pill_bottle_white.png",
        description: "Coenzyme Q10 softgels. Powerhouse cellular energy promoter and cardiovascular antioxidant supporting active heart health and vitality.",
        specs: ["1 bottle x 30 softgels", "100mg active CoQ10", "Heart health & energy booster"]
    },
    {
        id: 18,
        name: "Zinc Glycinate 15mg",
        price: 210,
        category: "Supplements",
        image: "/images/pill_bottle_white.png",
        description: "Highly bioavailable zinc amino acid chelate (glycinate) for superior immune defense, skin barrier healing, acne control, and hormonal balance.",
        specs: ["1 bottle x 60 tablets", "15mg elemental Zinc", "Superior absorption chelate"]
    },
    {
        id: 19,
        name: "Probiotics 10 Billion",
        price: 520,
        category: "Supplements",
        image: "/images/pill_bottle_white.png",
        description: "Daily gut health optimizer with 10 billion CFU active organisms from 5 clinically-studied probiotic strains to relieve bloating and support digestion.",
        specs: ["1 bottle x 30 capsules", "10 Billion CFU guaranteed", "Acid-resistant capsules"]
    },
    {
        id: 20,
        name: "Lutein + Zeaxanthin",
        price: 390,
        category: "Supplements",
        image: "/images/pill_bottle_white.png",
        description: "Advanced eye strain protection formula containing standardized lutein and zeaxanthin to filter harmful blue light and protect macular health.",
        specs: ["1 bottle x 30 softgels", "Blue light filter protection", "Supports vision & macular health"]
    }
];
;
