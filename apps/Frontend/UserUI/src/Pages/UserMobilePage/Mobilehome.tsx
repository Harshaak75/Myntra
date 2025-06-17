"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useEffect, useRef, useState } from "react";
import {
  CircleCheckBig,
  Facebook,
  Heart,
  Instagram,
  Menu,
  Package,
  Search,
  ShoppingBag,
  SquarePlus,
  Twitter,
  User,
  X,
  Youtube,
} from "lucide-react";
import {
  banner1,
  category,
  coin,
  logo,
  offer,
  photo1,
  photo10,
  photo11,
  photo12,
  photo13,
  photo14,
  photo15,
  photo16,
  photo17,
  photo18,
  photo2,
  photo3,
  photo4,
  photo5,
  photo6,
  photo7,
  photo8,
  photo9,
  shipping,
  star,
} from "../../ImagesCollection";
import { useNavigate } from "react-router-dom";
import { Sidebarmobile } from "@/Components/MobileUsers/Sidebarmobile";
import { Navbarmobilt } from "@/Components/MobileUsers/Navbarmobile";
import { Footermobile } from "@/Components/MobileUsers/Footermobie";
import { useSidebar } from "@/Hooks/SidebarContsxt";
import { useDispatch, useSelector } from "react-redux";
import { closeMenu, openMenu } from "@/store/SidebarSlice";
import ProductCarousel from "@/Components/ProductCarousel";
import axios from "axios";
import { backend_url } from "../../../config";

import useSWR from "swr";

export function Mobilehome() {
  const categories = [
    "SHIRTS",
    "JEANS",
    "TSHIRTS",
    "CASUAL SHOES",
    "SPORTS SHOES",
    "KURTA SETS",
    "TOPS",
    "KURTAS",
    "JEANS",
  ];

  const navigate = useNavigate();

  const categories_image = [
    {
      menImage:
        "https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2024/8/2/af955959-e154-432a-85cf-8ba0ec5f43a51722596980603-image_png_1851545165.png",
      menCategory: "Casual",
      womenImage:
        "https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2024/8/2/8ab90130-0d13-4679-b351-82a2971b526b1722596488868-image_png_1119801902.png",
      womenCategory: "Women Activewear",
    },
    {
      menImage:
        "https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2024/8/2/99f8940e-ca70-4948-a6cc-d3c6abebeb411722596921405-image_png1367818484.png",
      menCategory: "Men Activewear",
      womenImage:
        "https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2024/7/29/d7e299ae-04f3-4b4d-b3f3-5fab02779df01722236022154-Card_46.png",
      womenCategory: "Western wear",
    },
    {
      menImage:
        "https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2024/7/29/d31abeab-0bf8-4d06-91e2-2a5a18ed08011722236020770-Card_25.png",
      menCategory: "Sportswear",
      womenImage:
        "https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2024/8/2/fc7c482c-e400-4b20-8ff9-ffdd6275888c1722596447798-image_png_230248853.png",
      womenCategory: "Western wear",
    },
    {
      menImage:
        "https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2024/7/29/84511f5f-5465-4d6c-8dff-017e2863b6e91722236021852-Card_26.png",
      menCategory: "Sportswear",
      womenImage:
        "https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2024/8/2/cee4c20e-1629-4f61-9f25-bd1bf411b7f01722596082053-image_png739596407.png",
      womenCategory: "Office wear",
    },
    // ...add as many as needed
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    mode: "snap",
    slides: { perView: 1, spacing: 10 },
    rubberband: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  const categoryPhotos = [
    { image: photo1, category: "Casual" },
    { image: photo2, category: "Men Activewear" },
    { image: photo3, category: "Women Activewear" },
    { image: photo4, category: "Western wear" },
    { image: photo5, category: "Sportswear" },
    { image: photo6, category: "Lounge wear" },
    { image: photo7, category: "Kids wear" },
    { image: photo8, category: "Office wear" },
    { image: photo9, category: "Men ethnic wear" },
    { image: photo10, category: "inclusive styles" },
    { image: photo11, category: "inclusive styles" },
    { image: photo12, category: "Sleep wear" },
    { image: photo13, category: "Office wear" },
    { image: photo14, category: "Office wear" },
    { image: photo15, category: "Casual" },
    { image: photo16, category: "Women Activewear" },
    { image: photo17, category: "Inner wear" },
    { image: photo18, category: "Lingerie" },
    // Add all 18 accordingly
  ];

  const [offerBanner, setOfferBanner] = useState([
    { key: "FirstOffer", value: "" },
    { key: "SecondOffer", value: "" },
    { key: "ThirdOffer", value: "" },
    { key: "FourthOffer", value: "" },
    { key: "FifthOffer", value: "" },
  ]);

  const [Carasoal, setCarasoal] = useState([
    { key: "Carasoal1", value: "" },
    { key: "Carasoal2", value: "" },
    { key: "Carasoal3", value: "" },
    { key: "Carasoal4", value: "" },
    { key: "Carasoal5", value: "" },
    { key: "Carasoal6", value: "" },
    { key: "Carasoal7", value: "" },
    { key: "Carasoal8", value: "" },
    { key: "Carasoal9", value: "" },
  ]);

  // images={[
  //             "https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2024/8/2/fc7c482c-e400-4b20-8ff9-ffdd6275888c1722596447798-image_png_230248853.png",
  //             "https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2024/7/29/d7e299ae-04f3-4b4d-b3f3-5fab02779df01722236022154-Card_46.png",
  //             "https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2024/8/2/99f8940e-ca70-4948-a6cc-d3c6abebeb411722596921405-image_png1367818484.png",
  //             "https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2024/7/29/d31abeab-0bf8-4d06-91e2-2a5a18ed08011722236020770-Card_25.png",
  //             "https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2024/7/29/84511f5f-5465-4d6c-8dff-017e2863b6e91722236021852-Card_26.png",
  //             "https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2024/8/2/cee4c20e-1629-4f61-9f25-bd1bf411b7f01722596082053-image_png739596407.png",
  //             "https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2024/7/29/caf08c79-22db-4d5e-ab01-86e18cc66d3e1722236021937-Card_49.png",
  //             "https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2024/7/29/566a7b6c-6121-45d0-9d17-a760a4d4e8ea1722236021456-Card_50.png",
  //             "https://assets.myntassets.com/w_163,c_limit,fl_progressive,dpr_2.0/assets/images/2024/8/2/8ab90130-0d13-4679-b351-82a2971b526b1722596488868-image_png_1119801902.png",
  //           ]}

  const isOpen = useSelector((state: any) => state.sidebar.isOpen);
  const dispatch = useDispatch();

  const banners = [
    "https://mir-s3-cdn-cf.behance.net/project_modules/fs/84e85642054547.57bea3c1858d3.png",
    "https://mir-s3-cdn-cf.behance.net/project_modules/fs/f3299f42054547.57bea3c185f64.png",
    "https://miro.medium.com/v2/resize:fit:823/1*v0kx5r8ySR1eaWXWEBHSsw.jpeg",
    "https://indian-retailer.s3.ap-south-1.amazonaws.com/s3fs-public/2024-10/Untitled%20design%20-%202024-10-09T181428.849.jpg",
    "https://i.pinimg.com/736x/4f/57/47/4f57472c0f1f93776cbfbb7e63946ec3.jpg",
    "https://images.herzindagi.info/her-zindagi-english/images/2024/09/27/article/image/myntra-sale-1727423186355.jpg",
  ];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const carousel = scrollRef.current;
        const scrollAmount = 200; // how much to scroll each time

        if (
          carousel.scrollLeft + carousel.clientWidth >=
          carousel.scrollWidth
        ) {
          // At end, go back to start
          carousel.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const [query, setquery] = useState("");

  const [offerImage, setofferImage] = useState("");

  // using useSWR

  const fetcher = async (url: any) => {
    const res = await axios.get(url);
    return res;
  };

  // const { data, error, isLoading } = useSWR(
  //     "http://localhost:1337/api/banner1s?filters[label][$eq]=Home Banner&populate=*",
  //     fetcher
  //   )

  // changing the carosoal

  const [carasoalList, setcarasoalList] = useState<any[]>([]);


  const { data: carasoalData, error: carasoalerror, isLoading: carasoalisLoading } = useSWR(
    "https://cms-7655.onrender.com/api/carasoals?populate=*",
    fetcher
  );

  // console.log("carasoal",carasoalData?.data.data)
  // console.log("carasoal",carasoalData?.data.data)

  useEffect(() =>{
    setcarasoalList(carasoalData?.data.data)
  },[carasoalData])

  useEffect(() =>{
    if(!carasoalList) return;
    console.log("len",Carasoal.length)

    const ans = Carasoal.map((category) =>{
      const matched = carasoalList.find((k) => k.CarouselValue === category.key)

      console.log("hi",matched)

      if(matched && matched?.CarouselImage[0].url){
        return {
          ...category,
          value: `https://cms-7655.onrender.com${matched?.CarouselImage[0].url}`,
        }
      }
      return category;
    });
    // console.log("ans",ans)
    setCarasoal(ans)
    // setcarasoalList(ans);
  },[carasoalList])








  // changing the offers

  const [offerbannerList, setofferBannerList] = useState<any[]>([]);

  const { data: offerData, error: offerError, isLoading: offerIsLoading } = useSWR(
    "https://cms-7655.onrender.com/api/offers?populate=*",
    fetcher
  );
  // console.log(offerData?.data.data);

  // const OfferUrl = `http://localhost:1337${data?.data.data[0].OfferBanner.formats.large.url}`

  useEffect(() => {
    setofferBannerList(offerData?.data.data);
    // setofferImage(OfferUrl)
  }, [offerData]);

  useEffect(() => {
    if (!offerbannerList) return;

    const updated = offerBanner.map((banner) => {
      const matched = offerbannerList.find(
        (val) => val.OfferList === banner.key
      );
      // console.log("m",matched)
      if (matched && matched.OfferBanner?.formats?.large?.url) {
        return {
          ...banner,
          value: `https://cms-7655.onrender.com${matched.OfferBanner.formats.large.url}`,
        };
      }
      return banner;
    });

    setOfferBanner(updated);
  }, [offerbannerList]);

  //   useEffect(() => {
  //     if (data && data.data && data.data[0]?.attributes?.MainBanner?.data?.attributes?.formats?.large?.url) {
  //       const imageUrl = `http://localhost:1337${data.data[0].attributes.MainBanner.data.attributes.formats.large.url}`
  //       setofferImage(imageUrl)
  //     }
  //   }, [data])

  //   if (error) return <div>Error fetching banner</div>
  //   if (isLoading || !offerImage) return <div>Loading...</div>

  // useEffect(() =>{
  //   const fetchData = async () =>{
  //     const response = await axios.get("http://localhost:1337/api/banner1s?filters[label][$eq]=Home Banner&populate=*",{
  //       headers:{
  //         Authorization : "038d20ad2817599dd57d6abf3adb082136b3a022fe14b628280d7cbc2cde7c9527a1cf1d5f7f6f1159ae2e2e7f86914d04980fa081dceee0d021a826fdd07639c77fd09ba531fff76e7fa63580726914c090cf9b4ccf38b94af90a7f61085670033215e37a779c50b4ee02ac5d6732a79712dcdad441712914a0ede05d621d88"
  //       }
  //     })

  //     console.log(response)
  //     console.log(response.data.data[0].MainBanner.formats.large.url)
  //     const OfferUrl = `http://localhost:1337${response.data.data[0].MainBanner.formats.large.url}`
  //     setofferImage(OfferUrl)
  //   }
  //   fetchData()
  // },[])

  // serach

  // useEffect(() => {
  //   const fetch = async () => {
  //     try {
  //       const response = await axios.get(`${backend_url}user/addDataToMellisearch`);
  //       console.log(response.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetch();
  // }, []);

  const handleClick = (cat: any) => {
    console.log(cat);
    navigate(`/user/Products/${cat}`);
  };

  return (
    <div className="flex relative flex-col h-screen bg-white overflow-hidden">
      {/* Fixed Header (Navbar + Search) */}
      <div className="fixed top-0 left-0 w-full bg-white z-20 shadow">
        {/* navbar */}
        <Navbarmobilt openMenu={() => dispatch(openMenu())} />

        {/* Search Bar */}
        <div className="p-4 lg:hidden">
          <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2">
            <Search className="text-gray-500" />
            <input
              type="text"
              placeholder="Search for Categories"
              className="flex-1 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto  lg:pt-[80px] pt-[140px] lg:pb-0 pb-[70px] overflow-hidden">
        {/* Categories (No change in your design) */}
        <div className="px-4 lg:hidden">
          <div className="overflow-x-auto whitespace-nowrap scroll-smooth snap-x snap-mandatory scrollbar-hide px-4 space-x-5 mb-5">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="inline-block w-20 text-center text-[0.7rem] font-semibold snap-start"
              >
                <div className="h-20 w-20 mx-auto mb-1 bg-blue-gradient" />
                {cat}
              </div>
            ))}
          </div>

          <div className="overflow-x-auto whitespace-nowrap scroll-smooth snap-x snap-mandatory scrollbar-hide px-4 space-x-5">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="inline-block w-20 text-center text-[0.7rem] font-semibold snap-start"
              >
                <div className="h-20 w-20 bg-pink-gradient mx-auto mb-1" />
                {cat}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop and mobile Banner (Visible only on lg and up) */}
        <div className="w-full md:p-0 lg:p-6 md:mb-0 lg:mb-4">
          {/* Offer Image: visible on all screen sizes */}
          <div className="flex items-center justify-center overflow-hidden w-full px-0 lg:px-4 py-4">
            <img
              src={offerBanner.find((k) => k.key === "FirstOffer")?.value}
              alt="Offer Banner"
              className="w-full max-w-screen-xl h-auto object-cover rounded-xl"
            />
          </div>

          {/* Secondary Banner Image: visible only on desktop/laptop */}
          <div className="hidden lg:block px-4 pt-2">
            <img
              src="https://assets.myntassets.com/w_980,c_limit,fl_progressive,dpr_2.0/assets/images/2025/4/29/3cd35a57-2175-41f3-a0c4-e5f6c99b15c41745936562672-Desktop_KV.jpg"
              alt="Desktop Banner"
              className="rounded-2xl xl:h-[400px] lg:h-[300px] w-full"
            />
          </div>
        </div>

        <div className="hidden lg:block w-full">
          <div className="flex justify-center">
            <img
              src={banner1}
              alt=""
              className="w-[91%] h-[10.2rem] rounded-2xl"
            />
          </div>
        </div>

        <div className="hidden lg:block relative px-20">
          <ProductCarousel
            images={Carasoal}
          />
        </div>

        {/* grid */}

        <div className="hidden lg:grid grid-cols-2 gap-4 h-[640px] p-6 pt-9">
          {/* Left - Big Image */}
          <div className="h-[570px] pl-14">
            <img
              src="https://i.pinimg.com/564x/01/68/30/016830ef06d08f1a50d5f17a7ab6c511.jpg"
              alt="Offer or Kids"
              className="w-full h-full object-fill rounded-xl"
            />
          </div>

          {/* Right - 2 Stacked Images */}
          <div className="flex flex-col h-full">
            {/* Top Image - Men */}
            <div className="h-[280px] pr-15">
              <img
                src="https://i.pinimg.com/736x/d7/dd/53/d7dd53f131daa04ea6ac7b1bd6e362c5.jpg"
                alt="Men"
                className="w-full h-full object-fill rounded-xl"
              />
            </div>

            {/* Bottom Image - Women */}
            <div className="h-[275px] mt-4 pr-15">
              <img
                src="https://cdn.grabon.in/gograbon/images/merchant/1622288977756.jpg"
                alt="Women"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
        {/* category */}

        <div className="w-ful pt-4 hidden lg:block">
          <div className="category-banner w-full pr-6 pl-12">
            <img src={category} alt="" className="w-full" />
          </div>
          <div className="collection-of-images flex flex-wrap w-[90%] gap-5 items-center justify-center ml-21 pt-6">
            {categoryPhotos.map((photo, index) => (
              <img
                key={index}
                src={photo.image}
                alt=""
                className="hover:shadow-lg cursor-pointer rounded-xl"
                onClick={() => handleClick(photo.category)}
              />
            ))}
          </div>
        </div>

        {/* footer */}

        <footer className="bg-[#FAFBFC] text-gray-700 text-sm mt-8 hidden lg:block">
          <div className="max-w-screen-xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* ONLINE SHOPPING */}
            <div>
              <h3 className="font-bold mb-2">ONLINE SHOPPING</h3>
              <ul className="space-y-2 mt-3 text-gray-600">
                {[
                  "Men",
                  "Women",
                  "Kids",
                  "Home",
                  "Beauty",
                  "Genz",
                  "Gift Cards",
                  "Myntra Insider",
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:underline">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* CUSTOMER POLICIES */}
            <div>
              <h3 className="font-bold mb-2">CUSTOMER POLICIES</h3>
              <ul className="space-y-2 mt-3 text-gray-600">
                {[
                  "Contact Us",
                  "FAQ",
                  "T&C",
                  "Terms Of Use",
                  "Track Orders",
                  "Shipping",
                  "Cancellation",
                  "Returns",
                  "Privacy policy",
                  "Grievance Redressal",
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:underline">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* EXPERIENCE APP */}
            <div>
              <h3 className="font-bold mb-2">
                EXPERIENCE MYNTRA APP ON MOBILE
              </h3>
              <div className="flex gap-3 mb-6">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/1280px-Google_Play_Store_badge_EN.svg.png"
                  alt="Google Play"
                  className="w-28"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Download_on_the_App_Store_RGB_blk.svg/1280px-Download_on_the_App_Store_RGB_blk.svg.png"
                  alt="App Store"
                  className="w-28"
                />
              </div>
              <h3 className="font-bold mb-2">KEEP IN TOUCH</h3>
              <div className="flex gap-4">
                <a href="#">
                  <Facebook size={20} />
                </a>
                <a href="#">
                  <Twitter size={20} />
                </a>
                <a href="#">
                  <Youtube size={20} />
                </a>
                <a href="#">
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            {/* USEFUL LINKS */}
            <div>
              <h3 className="font-bold mb-2">USEFUL LINKS</h3>
              <ul className="space-y-2 mt-3 text-gray-600">
                {[
                  "Blog",
                  "Careers",
                  "Site Map",
                  "Corporate Information",
                  "Whitehat",
                  "Cleartrip",
                ].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:underline">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* POPULAR SEARCHES */}
          <div className="border-t border-gray-300 mt-6 pt-6 px-4 max-w-screen-xl mx-auto text-xs text-gray-600">
            <h4 className="font-bold mb-2 text-[1rem]">POPULAR SEARCHES</h4>
            <div className="flex flex-wrap gap-x-2 items-center gap-y-1">
              {[
                "Dresses For Girls |",
                "T-Shirts |",
                "Blazers For Men |",
                "Boxers |",
                "Tops |",
                "Kurtis |",
                "Nike |",
                "Designer Blouse |",
                "Gowns |",
                "Punjabi Suits |",
                "Bikini |",
                "Mynstars Fashion Show |",
                "Saree |",
                "Dresses |",
                "Lehenga |",
                "Bras |",
                "Suit |",
                "Chinos |",
                "Designers Sarees |",
                "Allen Solly |",
                "Biba |",
                "Fabindia |",
                "Levis |",
                "H&M |",
                "Raymond | ",
                "Van Heusen |",
                "W |",
                "Peter England |",
                "Louis Philippe |",
                "Adidas |",
                "Pantaloons |",
                "Pepe Jeans |",
                "Mufti |",
                "Flying Machine |",
                "PUMA",
              ].map((item, i) => (
                <span
                  key={i}
                  className="whitespace-nowrap hover:underline cursor-pointer text-[0.9rem]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="border-t border-gray-300 mt-6 pt-13 px-4 max-w-screen-xl mx-auto text-xs text-gray-600 flex flex-col  md:flex-row justify-between items-center gap-2 pb-8">
            <p className="text-[1rem]">
              In case of any concern,{" "}
              <a href="#" className="text-blue-600 font-semibold">
                Contact Us
              </a>
            </p>
            <p className="text-[1rem]">
              © 2025 www.mynstars.com. All rights reserved.
            </p>
            <p className="text-right text-[1rem]">A Mynstars company</p>
          </div>
        </footer>

        {/* mobile */}

        {/* only mobile Banner Carousel */}
        <div className="w-full max-w-2xl mx-auto px-4 lg:hidden">
          <div
            ref={sliderRef}
            className="keen-slider rounded-lg overflow-hidden shadow-lg aspect-[16/9]"
          >
            {banners.map((banner, idx) => (
              <div
                key={idx}
                className="keen-slider__slide flex items-center justify-center transition-transform duration-500 ease-out scale-100 hover:scale-95"
              >
                <img
                  src={banner}
                  alt={`Banner ${idx + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-3 space-x-2">
            {banners.map((_, idx) => (
              <div
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-2.5 h-2.5 rounded-full cursor-pointer ${
                  currentSlide === idx ? "bg-blue-200" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* banner2 */}

        <div className="border border-gray-50 mt-5 lg:hidden"></div>

        {/* offer banner star */}

        <div className="block lg:hidden h-auto px-2 py-2">
          <div className="w-full flex items-center justify-center">
            <img
              src={shipping}
              alt="Shipping"
              className="w-full max-w-[480px] h-auto object-contain"
            />
          </div>
        </div>

        {/* border */}

        <div className="border border-gray-50 mt-2 lg:hidden "></div>

        {/* main product */}

        <div className="mt-3 lg:hidden">
          {/* Title and Coin */}
          <div className="title flex items-center justify-between px-4 md:px-6">
            <div>
              <h1 className="text-[1.5rem] font-semibold [@media(max-width:320px)]:text-[1.2rem] md:text-[1.7rem]">
                Pocket Friendly Bargin!
              </h1>
              <p className="text-gray-500 [@media(max-width:320px)]:text-[0.9rem] md:text-[1rem]">
                Where style matches savings
              </p>
            </div>
            <div className="images w-15 h-15 [@media(max-width:320px)]:w-11 [@media(max-width:320px)]:h-11 md:w-20 md:h-20">
              <img
                src={coin}
                alt="coin"
                className="object-contain w-full h-full"
              />
            </div>
          </div>

          {/* Carousel Section */}
          <div className="overflow-hidden p-4 pt-7">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-1.5"
            >
              {categories_image.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-3 items-center">
                  {/* Men's Section (Top) */}
                  <div
                    className="h-[11rem] w-[9rem] bg-pink-200 flex items-center justify-center text-sm font-bold mb-2 cursor-pointer"
                    onClick={() => handleClick(item.menCategory)}
                  >
                    <img
                      src={item.menImage}
                      alt={`Men ${idx}`}
                      className="h-full w-full object-fill"
                    />
                  </div>

                  {/* Women's Section (Bottom) */}
                  <div className="h-[11rem] w-[9rem] bg-blue-200 flex items-center justify-center text-sm font-bold">
                    <img
                      src={item.womenImage}
                      alt={`Women ${idx}`}
                      className="h-full w-full object-fill"
                      onClick={() => handleClick(item.womenCategory)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* <div className="">hi</div> */}
      </main>

      {/* sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-30 overflow-y-auto`}
      >
        <Sidebarmobile closeMenu={() => dispatch(closeMenu())} />
      </div>

      {/* Background Overlay when menu open */}
      {isOpen && (
        <div
          className="fixed inset-0 h-full bg-black opacity-50 z-25"
          onClick={() => dispatch(closeMenu())}
        />
      )}

      {/* Fixed Bottom Nav */}
      <Footermobile />
    </div>
  );
}
