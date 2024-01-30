export default function Layout({ children }) {
  return (
    <>
      <div>
        {/* Static sidebar for desktop */}
        <div className="lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-80 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 p-6">
            <h1 className="text-white font-semibold text-xl">
              Conversational Search Demo
            </h1>
          </div>
        </div>

        <main className="lg:pl-72">
          <div className="lg:pl-8">{children}</div>
        </main>
      </div>
    </>
  );
}
