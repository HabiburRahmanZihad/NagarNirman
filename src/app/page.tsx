export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-bg2 p-8">

      <h1 className="text-5xl font-bold text-heading mb-6 montserrat">
        Welcome to Nagar Nirman
      </h1>

      <p className="text-body text-[40px] mb-6">
        Smarter, Cleaner, Transparent Cities powered by ok team 😁.
      </p>

      <button className="bg-lighter text-black px-6 py-3 rounded-2xl
       ">
        Report an Issue
      </button>

      <span className="mt-4 text-accent  pt-10 font-semibold">New Feature!</span>

    </main>
  );
}