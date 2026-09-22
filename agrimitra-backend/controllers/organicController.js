import { sendSuccess, asyncHandler } from '../utils/helpers.js';

const organicFertilizers = [
  {
    id: 'vermicompost',
    name: 'Vermicompost & Earthworm Castings',
    category: 'Soil Enrichment & Humus',
    npk: '1.5% N - 0.5% P - 0.8% K + Micro-nutrients',
    description: 'Nutrient-rich organic manure produced by earthworms. Increases soil water retention by 30% and activates beneficial soil micro-flora.',
    baseDosagePerAcre: 2.5,
    unit: 'Tons',
    bestFor: 'Wheat, Soybean, Cotton, Vegetables & Fruit Orchards',
  },
  {
    id: 'jeevamrut',
    name: 'Jeevamrut (Fermented Bio-Liquid)',
    category: 'Microbial Bio-Booster',
    npk: 'Bio-Culture (Azotobacter + PSB + Rhizobium)',
    description: 'Traditional liquid microbial culture prepared from indigenous cow dung, cow urine, jaggery & pulse flour. Multiplies soil beneficial bacteria by 100x.',
    baseDosagePerAcre: 200,
    unit: 'Liters',
    bestFor: 'All Crops, Organic Soil Activation & Root Development',
  },
  {
    id: 'neemcake',
    name: 'Neem Cake & Neem Oil Spray',
    category: 'Bio-Fertilizer & Nematode Controller',
    npk: '5% N - 1% P - 1.5% K + Azadirachtin',
    description: 'Organic byproduct of neem seed oil extraction. Inhibits nitrogen leaching in soil and kills root-knot nematodes and white grubs.',
    baseDosagePerAcre: 125,
    unit: 'kg',
    bestFor: 'Cotton, Rice, Pulses, Tomato & Chilli',
  },
  {
    id: 'bioinoculants',
    name: 'Bio-Inoculants (Azotobacter + PSB + KSB)',
    category: 'Bacterial N-Fixer & Solubilizer',
    npk: 'Live Bacterial Spores (10^8 CFU/g)',
    description: 'Bio-fertilizers that fix atmospheric nitrogen in non-leguminous crops and solubilize fixed soil phosphorus & potash for root uptake.',
    baseDosagePerAcre: 2,
    unit: 'kg',
    bestFor: 'Wheat, Maize, Sugarcane, Potato & Mustard',
  },
  {
    id: 'greenmanure',
    name: 'Green Manure (Dhaincha / Sunn Hemp)',
    category: 'Organic Biomass & Nitrogen Fixation',
    npk: 'Adds 60-80 kg N/Acre naturally',
    description: 'Leguminous cover crop grown and plowed under soil before main crop. Adds 15-20 tons of organic biomass and improves soil structure.',
    baseDosagePerAcre: 18,
    unit: 'kg Seeds',
    bestFor: 'Paddy (Rice), Sugarcane, Wheat & Cotton fields',
  },
];

const naturalPestRecipes = [
  {
    title: 'Neemastra (नीमास्त्र)',
    target: 'Sucking pests (Aphids, Thrips, Jassids, Whitefly)',
    ingredients: 'Desi Cow Urine (5L), Cow Dung (2kg), Neem Leaves Paste (5kg) in 100L Water.',
    preparation: 'Ferment in shade for 24-48 hours. Filter and spray on affected crops.',
  },
  {
    title: 'Brahmastra (ब्रह्मास्त्र)',
    target: 'Pod Borers, Fruit Borers & Leaf Rollers',
    ingredients: 'Neem leaves, Custard apple leaves, Papaya leaves, Dhatura leaves boiled in Cow Urine.',
    preparation: 'Boil mixture, cool for 48 hours, filter. Dilute 2-3L in 100L water per acre.',
  },
  {
    title: 'Agniastra (अग्न्यास्त्र)',
    target: 'Severe Caterpillar, Stem Borer & Worm Attack',
    ingredients: 'Neem paste (2kg), Tobacco powder (1kg), Green Chilli paste (500g), Garlic paste (500g) in Cow Urine (5L).',
    preparation: 'Boil mixture 5 times, steep for 48 hours. Dilute 2L in 100L water.',
  },
];

// @route   GET /api/organic
// @access  Public
export const getOrganicInfo = asyncHandler(async (req, res) => {
  const farmSize = parseFloat(req.query.farmSize) || 2.5;
  const calculatedDosages = organicFertilizers.map((fert) => ({
    ...fert,
    calculatedQuantity: (fert.baseDosagePerAcre * farmSize).toFixed(1),
  }));

  sendSuccess(
    res,
    200,
    { farmSize, fertilizers: calculatedDosages, naturalPestRecipes },
    'Organic farming advisory fetched.'
  );
});
