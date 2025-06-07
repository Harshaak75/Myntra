// components/ProductDetail.tsx

import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
// import {Carousel, CarouselContent, CarouselItem, type CarouselApi} from "@/Components/ui/carousel"
import useEmblaCarousel from "embla-carousel-react";
import {
  CheckCircle,
  Heart,
  MapPin,
  ReceiptText,
  Repeat2,
  Star,
  ThumbsUp,
  Truck,
} from "lucide-react";

import { useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Collapsible from "./Collapsible";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { backend_url } from "../../../config";
import { Gettoken } from "@/Utiles/Gettoken";

type ProductAttribute = {
  id: number;
  productId: number;
  attributename: string;
  attributevalue: string;
};

type ProductDataType = {
  id: number;
  name: string;
  price: string;
  productSku: string;
  productType: string;
  lotId: string;
  sellerId: number;
  sellerSku: string;
  status: string;
  approved: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productAttribute: ProductAttribute[];
};

const reviews = [
  {
    id: 1,
    rating: 5,
    images: ["/customer1.jpg", "/customer2.jpg", "/customer3.jpg"],
    review: "I love this product! The quality is great and it fits perfectly.",
    name: "Abhi",
    date: "9 June 2021",
    verified: true,
  },
  {
    id: 2,
    rating: 5,
    images: ["/customer4.jpg", "/customer5.jpg"],
    review: "Great design and super comfortable. Totally worth it!",
    name: "Riya",
    date: "5 May 2021",
    verified: true,
  },
];

const fastDeliveryImages = [
  "/fast1.jpg",
  "/fast2.jpg",
  "/fast3.jpg",
  "/fast4.jpg",
  "/fast5.jpg",
];

export default function Productshowcase() {
  const [showHighlights, setShowHighlights] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [productData, setProductData] = useState<ProductDataType | null>(null);
  const { id } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mouseY, setMouseY] = useState(0);

  const [loading, setloading] = useState(false);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addedToBag, setAddedToBag] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setloading(true);
      // const token = Gettoken();
      try {
        const response = await axios.get(`${backend_url}user/cart/${id}`, {
          // headers: {
          //   authorization: `bearer ${token}`,
          // },
          withCredentials: true,
        });
        console.log(response.data);
        setProductData(response.data?.ProductData?.[0]);
      } catch (error) {
        console.log(error);
      } finally {
        setloading(false);
      }
    };
    fetchData();
  }, []);

  const productTitle = productData?.productAttribute.find(
    (attr) => attr.attributename === "Product Title"
  )?.attributevalue;

  //   const [keyDesc, setkeyDesc] = useState([]);

  const keyDetails = productData?.productAttribute
    .filter((attr) =>
      [
        "Material",
        "Sleeve Type",
        "Neck Type",
        "Length",
        "Work Type",
        "Color",
        "Pattern",
        "Usage",
        "FashionType",
        "Wash Care",
      ].includes(attr.attributename)
    )
    .map((attr) => ({
      label: attr.attributename,
      value: attr.attributevalue,
    }));

  //   console.log("keydesc", keyDetails);

  const images =
    productData?.productAttribute
      .filter(
        (attr) =>
          attr.attributename === "Front Image" ||
          attr.attributename === "Back Image"
      )
      .map((attr) => attr.attributevalue) ?? [];

  const gender = productData?.productAttribute.find(
    (attr) => attr.attributename === "Gender"
  )?.attributevalue;

  console.log(images[0]);

  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (images.length > 0 && !selectedImage) {
      setSelectedImage(images[0]);
    }
  }, [images, selectedImage]);

  useEffect(() => {
    const fetchData = async () => {
      const token = await Gettoken();
      axios
        .get(`${backend_url}user/wishlist/check?productId=${id}`, {
          headers: {
            authorization: `bearer ${token}`,
          },
          withCredentials: true,
        })
        .then((res) => {
          setWishlist(res.data.exists); // boolean from backend
        })
        .catch((err) => console.error("Wishlist check error:", err));
    };

    fetchData();
  }, []);

  const navigate = useNavigate();

  // Check if already in cart
  useEffect(() => {
    const checkCart = async () => {
      const token = Gettoken();
      try {
        const resp = await axios.get(`${backend_url}user/cart/check/${id}`, {
          headers: { authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        if (resp.data.inCart) {
          setSelectedSize(resp.data.size);
        }
        setAddedToBag(resp.data.inCart);
      } catch (err) {
        console.error(err);
      }
    };
    if (id) checkCart();
  }, [id]);

  const handleAddToBag = async () => {
    if (!selectedSize) {
      alert("Please select the size before adding to bag.");
      return;
    }

    setloading(true);
    const token = await Gettoken();
    console.log(id);
    try {
      await axios.post(
        `${backend_url}user/cart/add`,
        { productId: Number(id), size: selectedSize },
        { headers: { authorization: `Bearer ${token}` }, withCredentials: true }
      );
      await fun(Number(id));
      setAddedToBag(true);
    } catch (error: any) {
      if (
        error.status === 403 &&
        error.response.data.message === "Invalid token"
      ) {
        navigate("/users/login");
      }
      console.error("Failed to add to bag:", error);
    } finally {
      setloading(false);
    }
  };

  const [wishlist, setWishlist] = useState(false);

  const handleToggle = async (e: any) => {
    e.stopPropagation();

    const previousState = wishlist;
    setWishlist(!wishlist);

    const token = await Gettoken();

    try {
      const res = await axios.post(
        `${backend_url}user/wishlist/toggle`,
        {
          productId: Number(id),
        },
        {
          headers: {
            authorization: `bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setWishlist(res.data.isWishlisted); // backend should return updated status
    } catch (err: any) {
      if (err.status === 403 && err.response.data.message == "Invalid token") {
        navigate("/users/login");
      }
      console.error("Wishlist toggle failed:", err);

      setWishlist(previousState);

      // alert("Failed to update wishlist. Please try again.");
    }
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    setSelectedImage(images[index]);
  }, [emblaApi, images, setSelectedImage]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect(); // Set initial state
  }, [emblaApi, onSelect]);

  const discount = 55;
  const finalPrice = Math.ceil(
    Number(productData?.price) - (Number(productData?.price) * discount) / 100
  );

  const [files, setFiles] = useState<File | null>(null);

  const handlePatternUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("use", file);
    if (file) {
      setFiles(file);
    }
  };

  const fun = async (id: any) => {
    if (!files) {
      console.warn("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", files); // ✅ Single file selected earlier
    formData.append("productid", id);
    if(selectedSize){
      formData.append("size", selectedSize);
    }
    try {
      const response = await axios.post(
        `${backend_url}user/upload_patterns`,
        formData,
        {
          headers:{
            authorization: `bearer ${await Gettoken()}`
          },
          withCredentials: true
        }
      );
      console.log("Upload success:", response.data);
    } catch (error) {
      console.error("Error in adding patterns:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      <div className="md:flex md:text-[0.85rem] md:absolute md:top-4 md:space-x-1 hidden">
        <p
          onClick={() => navigate("/")}
          className="text-gray-500 font-semibold cursor-pointer"
        >
          Home {">"}
        </p>{" "}
        <p className=" text-gray-500 font-semibold">
          {" "}
          {gender}s Clothing {">"}
        </p>{" "}
        <p className="font-semibold"> {productTitle}</p>
      </div>

      <div className="flex md:mt-20 mt-0 flex-col md:flex-row max-w-7xl mx-auto px-4 py-8 gap-8">
        {/* Left Section - Fixed Image Gallery */}
        {/* Left Section - Image Gallery */}
        <div className="md:w-1/2 md:sticky top-20 h-fit">
          {/* Desktop View */}
          <div className="hidden md:flex gap-4 mt-7">
            <div className="flex flex-col gap-2">
              {images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Thumb ${i}`}
                  onClick={() => {
                    setSelectedImage(img);
                    const index = images.findIndex((image) => image === img);
                    if (emblaApi) emblaApi.scrollTo(index); // sync carousel
                  }}
                  className={`w-16 h-20 object-cover border-2 cursor-pointer ${
                    selectedImage === img ? "border-black" : "border-gray-200"
                  }`}
                />
              ))}
            </div>
            <div
              className="relative w-full max-h-[550px] cursor-zoom-in"
              onClick={() => setIsModalOpen(true)}
            >
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Mobile View Carousel */}
          {/* Mobile View Carousel */}
          <div className="md:hidden w-[100vw] -mx-4">
            <div className="overflow-hidden w-full h-screen" ref={emblaRef}>
              <div className="flex">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="min-w-full h-screen flex justify-center items-center"
                  >
                    <img
                      src={img}
                      alt={`Slide ${i}`}
                      className="w-full h-full object-contain"
                      onClick={() => setIsModalOpen(true)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center mt-4 gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    selectedIndex === i ? "bg-black" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Product Info */}
        <div className="md:w-1/2 lg:mt-5 mt-0 space-y-6">
          <div>
            <h2 className="text-xl font-semibold">{productData?.name}</h2>
            <p className="text-gray-600">
              {/* Men's Black Kahani Graphic Printed Oversized Acid Wash T-shirt */}
              {productTitle}
            </p>
          </div>

          <div className="space-x-2 text-2xl font-bold">
            ₹{finalPrice}{" "}
            <span className="line-through text-gray-400 text-xl">
              {productData?.price}
            </span>{" "}
            <span className="text-green-600 text-xl">{discount}% OFF</span>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Select Size</h3>
            <div className="flex gap-3 flex-wrap py-2">
              {["S", "M", "L", "XL", "2XL", "3XL"].map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? undefined : "outline"}
                  className={`p-5 cursor-pointer ${
                    selectedSize === size ? "bg-gray-800 text-white" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>

          {/* add pattern */}

          <div className="border border-dashed border-gray-400 p-4 rounded-xl bg-gray-50">
            <h3 className="text-base font-medium text-gray-800 mb-2">
              Want to add your own pattern?
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Upload your preferred design pattern in PDF format. Once verified,
              it will appear in the product visuals.
            </p>

            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="application/pdf"
                className="block text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100 file:cursor-pointer"
                onChange={handlePatternUpload} // Implement this handler later
              />
              <span className="text-xs text-gray-500">PDF only, max 5MB</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {/* Add to Bag / Go to Cart Button */}
            <Button
              onClick={
                addedToBag ? () => navigate("/checkout/cart") : handleAddToBag
              }
              disabled={loading}
              className={`w-full sm:w-auto lg:h-[3rem] lg:w-[18rem] px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-lg cursor-pointer ${
                addedToBag
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-yellow-500 hover:bg-yellow-600"
              } text-white`}
            >
              <span className="text-[1rem] sm:text-[1.1rem] md:text-[1.3rem] text-gray-800">
                {addedToBag ? "Go to Cart" : "Add to Bag"}
              </span>
            </Button>

            {/* Wishlist Button */}
            <Button
              variant="outline"
              onClick={handleToggle}
              className="w-full sm:w-auto lg:w-[18rem] px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 lg:py-6 hover:bg-white text-gray-700 cursor-pointer"
            >
              <div className="flex items-center gap-2 justify-center">
                <Heart
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${
                    wishlist
                      ? "fill-red-500 text-red-500"
                      : "fill-white text-black stroke-2"
                  }`}
                />
                <span className="text-sm sm:text-base md:text-[1.2rem] text-gray-500">
                  WISHLIST
                </span>
              </div>
            </Button>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-lg">Check for Delivery Details</h4>

            <div className="relative w-full">
              <Input
                id="pincode"
                type="text"
                maxLength={6}
                placeholder="Enter Pincode"
                className="w-full pr-24"
              />
              <Button
                type="button"
                className="absolute text-[1rem] hover:bg-white cursor-pointer right-1 top-1 bottom-1 my-auto h-auto px-4 border-none shadow-none bg-white text-blue-800 "
              >
                CHECK
              </Button>
            </div>
            <Card className="p-3 flex items-center justify-center text-sm rounded-none text-blue-800 bg-[#D1EDFF] border-none shadow-none">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4" />
                <span className="text-[1rem] font-semibold">
                  This product is eligible for FREE SHIPPING
                </span>
              </div>
            </Card>

            <div>
              <h4 className="font-medium text-lg mb-2">Key Highlights</h4>
              <div className="grid grid-cols-2 gap-y-7 text-sm text-gray-700 mt-5">
                {keyDetails?.map((detail, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <span className="w-24 font-semibold text-[1rem] text-gray-400">
                      {detail.label}:
                    </span>
                    <span className="text-[1.3rem] font-semibold">
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Collapsible Sections */}
            <Collapsible
              title="Product Description"
              subtitle="Manufacture, Care and Fit"
              icon={<ReceiptText />}
            >
              <div className="mt-8 ml-5 text-sm space-y-5">
                <div className="">
                  <p className=" text-gray-700 ">{productTitle}</p>
                  <p>
                    <span className="font-semibold">Country of Origin</span> -
                    India
                  </p>
                </div>

                <div className="">
                  <p>
                    <span className="font-semibold">Manufactured By</span> -
                    Mynstars pvt ltd
                  </p>
                  <p className=" text-gray-700 ">
                    Sairaj logistic hub #A5, BMC pipeline road, Opposite all
                    saints high school, Amane, Bhiwandi, Thane, Maharashtra
                    421302
                  </p>
                </div>

                <div className="">
                  <p>
                    <span className="font-semibold">Packed By</span> - Mynstars
                    pvt ltd
                  </p>
                  <p className=" text-gray-700 ">
                    Sairaj logistic hub #A5, BMC pipeline road, Opposite all
                    saints high school, Amane, Bhiwandi, Thane, Maharashtra
                    421302
                  </p>
                </div>

                <div className="">
                  <p>
                    <span className="font-semibold">Commodity</span> -{" "}
                    {productData?.productType}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-lg">
                    Product Specifications
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="mt-2 w-1.5 h-1.5 bg-gray-700 rounded-full"></span>
                      <div>
                        <div className="font-medium">Oversized Fit</div>
                        <div className="text-sm text-gray-600">
                          Super loose on body, thoda hawa aane de
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 w-1.5 h-1.5 bg-gray-700 rounded-full"></span>
                      <div>
                        <div className="font-medium">Single Jersey</div>
                        <div className="text-sm text-gray-600">
                          Classic, lightweight jersey fabric comprising 100%
                          cotton
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </Collapsible>

            <Collapsible
              title="Return & Exchange Policy"
              subtitle="Know about return & exchange policy"
              icon={<Repeat2 />}
            >
              <p className="text-sm ml-5 text-gray-700 mt-8">
                Easy returns upto 15 days of delivery. Exchange available on
                select pincodes
              </p>
            </Collapsible>

            <div className="mt-6">
              <h4 className="font-medium text-lg mb-2">Why Shop With Us</h4>
              <div className="flex gap-4 overflow-x-auto">
                {fastDeliveryImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Benefit ${i + 1}`}
                    className="w-40 h-28 object-cover rounded-xl border"
                  />
                ))}
              </div>
            </div>

            {/* review */}

            <div className="mt-10 mb-6">
              <h3 className="text-xl font-semibold mb-3">Ratings & Reviews</h3>

              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                {/* Average Rating */}
                <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
                  <span className="text-5xl font-bold text-yellow-500">
                    4.8
                  </span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < 4.8
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 mt-1 text-center">
                    250 Ratings & 125 Reviews
                  </span>
                </div>

                {/* Rating Breakdown */}
                <div className="w-full space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2 w-full">
                      <span className="text-sm text-gray-600 w-[2rem] shrink-0">
                        {star} ★
                      </span>
                      <div className="relative flex-1 h-2 bg-gray-200 rounded">
                        <div
                          className="absolute top-0 left-0 h-2 bg-yellow-400 rounded"
                          style={{ width: `${Math.random() * 100}%` }} // Replace with real %s
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
              <div className="space-y-8">
                {reviews.map((review) => (
                  <Card
                    key={review.id}
                    className="p-5 rounded-xl border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {review.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`Customer ${i + 1}`}
                          className="w-24 h-24 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-2 text-[1rem] leading-relaxed">
                      {review.review}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mt-3">
                      <div>
                        <span className="font-semibold text-gray-800">
                          {review.name}
                        </span>{" "}
                        <span>• {review.date}</span>
                      </div>
                      {review.verified && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>Verified Purchase</span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-100 bg-[rgba(0,0,0,0.4)] bg-opacity-80 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative p-1"
            style={{ width: "400px", height: "800px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Zoomed"
              className="w-full h-full object-cover transition-transform duration-100 cursor-zoom-in"
              onMouseMove={(e) => {
                const bounds = e.currentTarget.getBoundingClientRect();
                const offsetY = e.clientY - bounds.top;
                setMouseY(offsetY / bounds.height);
              }}
              onMouseLeave={() => setMouseY(0.5)}
              style={{
                transform: `translateY(${(0.5 - mouseY) * 100}px)`, // Increased speed
              }}
            />
            <button
              className="absolute top-2 right-2 text-white text-2xl"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-70 bg-[rgba(0,0,0,0.6)]">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-2xl border-1 p-1">
            <div className="w-6 h-6 border-[3px] border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </div>
  );
}
