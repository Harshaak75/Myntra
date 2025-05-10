import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function MainFooter() {
    return (
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
    )
}