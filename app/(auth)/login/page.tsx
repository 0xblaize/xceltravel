import AuthForm from "./../../components/authform";

export default function LoginPage() {
  return (
   // 'h-screen' ensures it fits the monitor exactly without extra scrolling
    <main className="h-screen flex flex-col md:flex-row bg-[#F9FAFB] overflow-hidden">
      
      {/* LEFT SIDE: Image (Takes 60% of width on PC) */}
      <div className="hidden md:flex md:w-3/5 bg-[#d9a321] relative items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828"
          alt="Travel Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-multiply"
        />
        <div className="relative z-10 text-white p-12">
          <h2 className="text-7xl font-black italic tracking-tighter uppercase leading-none">Xcel Travel</h2>
          <p className="text-xl mt-4 font-light">Elevating your journey through tech.</p>
        </div>
      </div>

      {/* RIGHT SIDE: The Form (Takes 40% of width on PC) */}
      <div className="w-full md:w-2/5 flex items-center justify-center p-8 bg-white md:bg-[#F9FAFB]">
        {/* We wrap the form in a div to "clamp" its width to a normal size */}
        <div className="w-full max-w-400px">
          <AuthForm mode="login" />
        </div>
      </div>

    </main>
  );
}
