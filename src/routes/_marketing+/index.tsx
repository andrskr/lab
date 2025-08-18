import { href, Link } from 'react-router';

export default function Index() {
  return (
    <main className="py-layout-block container">
      <h1 className="text-2xl font-bold">Lab Index</h1>
      <p>
        Select an example from the navigation below to explore different UI components and
        experiments.
      </p>
      <nav className="py-4">
        <h2 className="text-lg font-semibold">Scrollers</h2>
        <ul className="list-disc pl-5">
          <li>
            <Link
              to={href('/components/scroller/example')}
              className="text-blue-600 hover:underline"
            >
              Example
            </Link>
          </li>
          <li>
            <Link to={href('/components/scroller/apple')} className="text-blue-600 hover:underline">
              Apple
            </Link>
          </li>
          <li>
            <Link to={href('/components/scroller/links')} className="text-blue-600 hover:underline">
              Links
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
