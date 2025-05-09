type EmailMenuProps = {
  email: string;
  verifyOldEmail: boolean;
  setVerifyOldEmail: (value: boolean) => void;
  handleVerifyOldEmail: () => void;
  loading: boolean;
  verifyerror: string;
  setShowChangeEmailModal: (value: boolean) => void;
};

export function EmailMenu({
  email,
  verifyOldEmail,
  setVerifyOldEmail,
  handleVerifyOldEmail,
  loading,
  verifyerror,
  setShowChangeEmailModal,
}: EmailMenuProps) {
  return (
    <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-md">
        
      <h2 className="text-lg font-semibold mb-4">
        2-Step Verification Required
      </h2>

      <p className="text-[0.85rem] mb-5">
        For better security, OTP is sent to a previously used email id on your
        account.
      </p>

      <p className="mb-2 text-[0.95rem] font-semibold">Select your Email Id</p>

      {/* Step 1: Old Email with Radio Button */}
      <div className="border border-gray-300 rounded px-4 py-3 flex items-center gap-3 mb-4">
        <input
          type="radio"
          id="verify-old-email"
          name="email-verification"
          checked={verifyOldEmail}
          onChange={() => setVerifyOldEmail(true)}
          className="accent-[#ff3f6ce0] w-4 h-4"
        />
        <label htmlFor="verify-old-email" className="text-sm">
          <p className="font-semibold text-gray-600">{email}</p>
        </label>
      </div>

      <button
        disabled={!verifyOldEmail}
        onClick={handleVerifyOldEmail}
        className={`w-full py-2 text-white text-[0.9rem] rounded font-semibold ${loading} > "cursor-not-allowed" : "cursor-pointer" ${
          verifyOldEmail
            ? "bg-[#ff3f6ce0] hover:bg-[#ff3f6cc5] cursor-pointer"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        REQUEST OTP
      </button>

      <p className="mt-1 text-[0.8rem] text-red-800 font-semibold">
        {verifyerror}
      </p>

      <button
        onClick={() => {
          setShowChangeEmailModal(false);
          setVerifyOldEmail(false);
        }}
        className="mt-4 text-gray-500 text-sm underline block text-center cursor-pointer"
      >
        Cancel
      </button>
    </div>
  );
}
