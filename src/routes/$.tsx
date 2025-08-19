export function loader() {
  throw new Response('Not found', { status: 404 });
}

export function action() {
  throw new Response('Not found', { status: 404 });
}

/** This component will never be rendered, as the loader and action functions will throw a 404 error. */
export default function NotFoundPage() {
  return (
    <div className="container mx-auto p-4 pt-16">
      <h1 className="text-2xl font-bold">Not Found</h1>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="container mx-auto p-4 pt-16">
      <h1 className="text-2xl font-bold">Not Found</h1>
    </div>
  );
}
