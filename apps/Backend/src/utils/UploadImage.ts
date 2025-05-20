import axios from "axios";
import supabase1 from "./Supabase.connect.image";

export const uploadImageToBucket = async (imageUrl: string, productSku: string) => {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    const cleanFileName = productSku.replace(/\s+/g, "_") + ".jpg";
    const storagePath = `products/${Date.now()}_${cleanFileName}`;

    const { data, error } = await supabase1.storage
      .from("product-images")
      .upload(storagePath, response.data, {
        contentType: "image/jpeg",
        upsert: true, // optional: overwrite if exists
      });

    if (error) {
      console.error("❌ Supabase upload error:", error);
      return null;
    }

    const { publicUrl } = supabase1.storage
      .from("product-images")
      .getPublicUrl(storagePath).data;

    if (!publicUrl) {
      console.warn("⚠️ Failed to get public URL for:", storagePath);
      return null;
    }

    return publicUrl;
  } catch (err) {
    console.error("❌ Image download error:", err);
    return null;
  }
};


  // export function getDirectDownloadUrl(driveUrl: string): string | null {
  //   const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)\//);
  //   if (match && match[1]) {
  //     return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  //   }
  //   return null;
  // }

  export function getDirectDownloadUrl(driveUrl: string): string | null {
  const match = driveUrl.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return null;
}


//   export function getDirectDownloadUrl(driveUrl: string): string | null {
//   const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
//   if (match && match[1]) {
//     return `https://drive.google.com/uc?export=download&id=${match[1]}`;
//   }
//   return null;
// }
