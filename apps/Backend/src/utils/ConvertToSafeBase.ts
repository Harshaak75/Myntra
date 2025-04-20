const SAFE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // No L, I, O, 1, 0

const convertToSafeBase = (num: any) => {

    const base = SAFE_ALPHABET.length;
    let str = '';
  
    while (num > 0) {
      str = SAFE_ALPHABET[num % base] + str;
      num = Math.floor(num / base);
    }

    return str.padStart(6, 'A'); // Ensure at least 6 characters
};

export const generateCompactPicklistCode = (userId: string) => {
    const now = Date.now();
  
    const compactTime = convertToSafeBase(now);

    const compactUser = userId.toString().slice(0, 2).toUpperCase();
    
    return `PL-${compactTime}${compactUser}`;
  };