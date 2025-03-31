export default function Sidebar() {
  return (
    <div className="w-full hidden lg:block lg:w-1/5 p-6 lg:pb-44">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Account</h2>
      <hr className="w-screen border-t border-gray-300" />
      <p className="text-sm text-gray-600 mb-6">Myntra User</p>
      <ul className="space-y-4 text-gray-800">
        <li className="font-semibold">Overview</li>
        <hr className="border-t border-gray-300" />
        <li className="text-gray-500 text-xs">ORDERS</li>
        <li>Orders & Returns</li>
        <hr className="border-t border-gray-300" />
        <li className="text-gray-500 text-xs">CREDITS</li>
        <li>Coupons</li>
        <li>Myntra Credit</li>
        <li>MynCash</li>
        <hr className="border-t border-gray-300" />
        <li className="text-gray-500 text-xs">ACCOUNT</li>
        <li className="text-teal-500 font-bold">Profile</li>
        <li>Saved Cards</li>
        <li>Saved UPI</li>
        <li>Saved Wallets/BNPL</li>
        <li>Addresses</li>
        <li>Myntra Insider</li>
        <li className="text-red-500">Delete Account</li>
      </ul>
    </div>
  );
}
