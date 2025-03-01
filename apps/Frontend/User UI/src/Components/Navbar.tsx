export default function Navbar() {
  return (
    <div>
      <div className="navbar w-full h-16 bg-gray-100 justify-between ">
        <div className="h-full">
          <div className="desktop-menus flex justify-between bg-white h-full items-center pt-4">
            <div className="desktop-logo">
              {/* <div className="w-36 h-36"></div> */}
            </div>
            <div className="desktop-navbar">
              <div className="navbarList flex gap-10">
                <div className="navLink-list">
                  <a href="">MEN</a>
                </div>
                <div className="navLink-list">
                  <a href="">WOMEN</a>
                </div>
                <div className="navLink-list">
                  <a href="">KIDS</a>
                </div>
                <div className="navLink-list">
                  <a href="">HOME & LIVING</a>
                </div>
                <div className="navLink-list">
                  <a href="">BEAUTY</a>
                </div>
              </div>
            </div>
            <div className="desktop-actions">
              <div className="relative">
                <input
                  type="text"
                  className="bg-[#F5F5F6] w-[30rem] p-2 pl-16 rounded border focus:bg-white outline-none border-none"
                  placeholder="Search for Products, brands and more"
                />

                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  🔍{" "}
                  {/* Replace with an actual icon, like FontAwesome or Lucide */}
                </span>
              </div>
            </div>
            <div className="desktop-query">
              <div className="action=query flex gap-5 p-10">
                <div className="navLink-list">
                  <a href="">Profile</a>
                </div>
                <div className="navLink-list">
                  <a href="">Wishlist</a>
                </div>
                <div className="navLink-list">
                  <a href="">Bag</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
