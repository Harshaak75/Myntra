export const generateBrandCode = async(brand: string) => {
    const words = brand.trim().split(/\s+/); // splits by space(s)
    if (words.length === 1) {
      // One-word brand: take first 3 letters
      return words[0].slice(0, 3).toUpperCase(); // "Roadster" => "ROA"
    } else {
      // Multi-word brand: take first letter of each word
      return words.map(w => w[0].toUpperCase()).join(""); // "Kook N Keech" => "KNK"
    }
  };

  export function generateCustomCode(length: number = 6): string {
    const chars = "ABCDEFGHJKLMNOPQRSTUVWXYZ123456789"; // Avoid I and O if needed
    let result = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
  
    return result;
  }

  export const generateNumericPacketCodes = (): number[] => {
    const codes = new Set<number>();
  
    while (codes.size < 1) {
      const code = Math.floor(1000000000 + Math.random() * 90000000); // 8-digit number
      codes.add(code);
    }
  
    return Array.from(codes);
  };