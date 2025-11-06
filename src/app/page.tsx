import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-base-100 text-neutral transition-colors duration-300">

      {/* Logo */}
      <div className="mb-6">
        <Image
          src="/logo/NN_logo_green_light.png"
          alt="NagarNirman Logo"
          width={150}
          height={80}
          className="rounded-xl shadow-md w-full h-40 object-contain"
          priority
        />
      </div>

      {/* Heading */}
      <h1 className="text-5xl font-bold text-info mb-4 montserrat text-center">
        Welcome to NagarNirman 🌆
      </h1>

      {/* Subtext */}
      <p className="text-lg sm:text-xl text-neutral text-center max-w-2xl">
        Smarter, Cleaner, and More Transparent Cities — powered by your reports 💪
      </p>

      {/* Primary Button */}
      <button className="bg-primary text-neutral-900 hover:bg-secondary transition-colors font-semibold px-6 py-3 rounded-2xl shadow-md">
        Report an Issue
      </button>

      {/* Secondary Button */}
      <button className="bg-secondary text-neutral-900 hover:bg-primary transition-colors font-semibold px-6 py-3 rounded-2xl shadow-md">
        Join as Problem Solver
      </button>

      {/* Accent Tag */}
      <span className="text-accent font-semibold border border-accent rounded-2xl px-6 py-2 mt-4">
        🌟 New Feature Released!
      </span>

      {/* Info Card */}
      <div className="bg-base-200 border border-base-300 p-6 rounded-2xl mt-6 max-w-lg text-center">
        <h2 className="text-2xl font-semibold text-info mb-2">Live Progress</h2>
        <p className="text-neutral">
          Track reported issues across all 64 districts with real-time updates.
        </p>
      </div>
    </main>
  );
}