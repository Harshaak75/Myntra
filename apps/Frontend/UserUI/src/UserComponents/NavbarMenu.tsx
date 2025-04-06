const menu = ["Menu", "Women", "Kids", "Trends", "Genz", "Offers"];

export function NavbarMenu() {
  return (
    <div className="h-[2.8rem] bg-[#4f3267d1] pl-7 md:pl-7">
      <div className="flex flex-wrap md:flex-nowrap md:gap-6 h-full gap-6 items-center font-semibold text-[1rem] text-white">
        {menu.map((item) => (
          <div
            key={item}
            className="relative h-full flex items-center px-2 group cursor-pointer"
          >
            {item}
            <span className="absolute bottom-0 left-0 right-0 h-[5px] bg-purple-700 delay-75 opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
          </div>
        ))}
      </div>
    </div>
  );
}
