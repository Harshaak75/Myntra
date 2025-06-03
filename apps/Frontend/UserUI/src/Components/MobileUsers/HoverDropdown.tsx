import { motion } from "framer-motion";


type Category = "Men" | "WomenEthnic" | "genz" | "Kids";

const menuData: Record<Category, { title: string; items: string[] }[]> = {
  Men: [
    {
      title: "Top Wear",
      items: [
        "All Top Wear",
        "Tshirts",
        "Shirts",
        "Winter Wear",
        "Jackets",
        "Sweater and Sweatshirts",
      ],
    },
    {
      title: "Bottom Wear",
      items: ["Track Pants", "All Bottomwear", "Jeans", "Trousers", "Shorts"],
    },
    {
      title: "Ethnic Wear",
      items: ["Kurtas Sets", "Ethnic Jackets", "Bottomwear"],
    },
    {
      title: "Inner & Sleep Wear",
      items: ["All Inner & Sleep Wear", "Boxers", "Underwears"],
    },
  ],
  WomenEthnic:[
  {
    title: "Sarees",
    items: [
      "All Sarees",
      "Silk Sarees",
      "Banarasi Silk Sarees",
      "Cotton Sarees",
      "Georgette Sarees",
      "Chiffon Sarees",
      "Heavy Work Sarees",
      "Net Sarees",
    ],
  },
  {
    title: "Kurtis",
    items: [
      "All Kurtis",
      "Anarkali Kurtis",
      "Rayon Kurtis",
      "Cotton Kurtis",
      "Chikankari Kurtis",
    ],
  },
  {
    title: "Kurta Sets",
    items: [
      "All Kurta Sets",
      "Kurta Palazzo Sets",
      "Rayon Kurta Sets",
      "Kurta Pant Sets",
      "Cotton Kurta Sets",
      "Sharara Sets",
    ],
  },
  {
    title: "Dupatta Sets",
    items: [
      "Cotton Sets",
      "Rayon Sets",
      "Printed Sets",
    ],
  },
  {
    title: "Suits & Dress Material",
    items: [
      "All Suits & Dress Material",
      "Cotton Suits",
      "Embroidered Suits",
      "Crepe Suits",
      "Silk Suits",
      "Patiala Suits",
    ],
  },
  {
    title: "Other Ethnic",
    items: [
      "Blouses",
      "Dupattas",
      "Lehanga",
      "Gown",
      "Skirts & Bottomwear",
      "Islamic Fashion",
      "Petticoats",
    ],
  },
],
genz: [
  {
    title: "Women's Western Wear",
    items: [
      "Dresses Under ₹599",
      "Tops Under ₹399",
      "Jeans Under ₹599",
      "T-shirts Under ₹299",
      "Trousers Under ₹699",
      "Shorts Under ₹699",
      "Shirts Under ₹499",
      "skirts Under ₹499",
      "Jackets Under ₹899",
      "Sweatshirts Under ₹699",
      "Sweaters Under ₹899"
    ],
  },
  {
    title: "Men's Casual Wear",
    items: [
      "T-shirts Under ₹299",
      "Shirts Under ₹499",
      "Jeans Under ₹599",
      "Trousers Under ₹699",
      "Shorts Under ₹599",
      "Jackets Under ₹899",
      "Sweatshirts Under ₹699",
      "Sweaters Under ₹999",
      "Co-ords Under ₹999"
    ],
  },
  {
    title: "Women's Ethnic Wear",
    items: [
      "Kurtas Under ₹399",
      "Kurtis Under ₹499",
      "Kurta sets Under ₹499",
      "Ethnic Dresses Under ₹999",
      "Palazzos Under ₹799"
    ],
  },
  {
    title: "Lingerie & Loungewear",
    items: [
      "Bras Under ₹399",
      "Night suits Under ₹799",
      "Nightdresses Under ₹999",
      "Lounge pants Under ₹999",
      "Briefs Under ₹599"
    ],
  },
  {
    title: "Men's Occassion Wear",
    items: [
      "Kurtas Under ₹799",
      "Kurta Sets Under ₹999",
    ],
  }
],
  Kids: [
  {
    title: "Boys & Girls 2+ Years",
    items: [
      "Dresses",
      "Boys Sets",
      "Girls Sets",
      "Ethnicwear",
      "Nightwear",
      "Winter Wear",
      "Top Wear",
      "Bottomwear",
    ],
  },
  {
    title: "Infant 0-2 Years",
    items: [
      "Rompers",
      "Baby Sets",
      "Ethnicwear",
    ],
  },
  {
    title: "Baby Care",
    items: [
      "All Baby Care",
      "Newborn Care",
    ],
  },
],
};

interface HoverDropdownProps {
  selectedCategory: Category;
}

export const HoverDropdown: React.FC<HoverDropdownProps> = ({
  selectedCategory
}) => {
  const sections = menuData[selectedCategory] || [];
return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-15 z-50 flex text-sm text-gray-700 shadow-xl border border-gray-200"
    >
      {sections.map((section, index) => (
        <div
          key={index}
          className={`p-6 w-[15rem] flex-1 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
        >
          <h4 className="font-bold text-pink-600 mb-5 text-[0.98rem]">
            {section.title}
          </h4>
          <ul className="space-y-3 text-[0.93rem] text-gray-500">
            {section.items.map((item, i) => (
              <li key={i} className="hover:text-pink-600 cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </motion.div>
  );
};