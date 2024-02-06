import Navigation from './Navigation';

export default function Layout({ children }) {
  return (
    <>
      <Navigation />
      <main className="mt-6">
        <div>{children}</div>
      </main>
    </>
  );
}
