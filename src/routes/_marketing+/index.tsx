import { Scroller } from '~/common/ui/scroller';

const items = Array.from({ length: 20 }, (_, index) => index);

export default function Index() {
  return (
    <Scroller.Root>
      <Scroller.Track>
        {items.map((current) => (
          <Scroller.Item key={current}>{current}</Scroller.Item>
        ))}
      </Scroller.Track>

      <div className="flex justify-center gap-4 py-2">
        <Scroller.Previous
          options={{ align: 'start', sibling: -1 }}
          className="rounded-md bg-blue-500 px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          -1
        </Scroller.Previous>
        <Scroller.Previous className="rounded-md bg-blue-500 px-3 py-2 text-sm text-white disabled:opacity-50">
          Go To Previous
        </Scroller.Previous>

        <Scroller.Next className="rounded-md bg-blue-500 px-3 py-2 text-sm text-white disabled:opacity-50">
          Go To Next
        </Scroller.Next>

        <Scroller.Next
          target="start"
          options={{ align: 'start', sibling: 1 }}
          className="rounded-md bg-blue-500 px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          +1
        </Scroller.Next>
      </div>
    </Scroller.Root>
  );
}
