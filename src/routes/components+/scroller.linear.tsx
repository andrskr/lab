import { Scroller } from '~/common/ui/scroller';

const items = Array.from({ length: 20 }, (_, index) => index);

export default function ScrollerLinear() {
  return (
    <Scroller.Root>
      <Scroller.Track>
        {items.map((current) => (
          <Scroller.Item key={current}>{current}</Scroller.Item>
        ))}
      </Scroller.Track>

      <div className="flex justify-center gap-4 py-2">
        <Scroller.Previous options={{ align: 'start', sibling: -1 }}>-1</Scroller.Previous>
        <Scroller.Previous>Go To Previous</Scroller.Previous>

        <Scroller.Next>Go To Next</Scroller.Next>

        <Scroller.Next target="start" options={{ align: 'start', sibling: 1 }}>
          +1
        </Scroller.Next>
      </div>
    </Scroller.Root>
  );
}
