import { Drawer } from "vaul";

export default function STConfigure() {
  return (
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 bg-black/40" />
      <Drawer.Content className="bg-zinc-100 flex flex-col rounded-t-[10px] h-[49%] mt-24 fixed bottom-0 left-0 right-0">
        <div className="p-4 bg-white rounded-t-[10px] flex-1">
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
          <div className="max-w-md mx-auto">
            <Drawer.Title className="font-medium mb-4">
              Unstyled drawer for React.
            </Drawer.Title>
            <p className="text-zinc-600 mb-2">
              This component can be used as a replacement for a Dialog on mobile
              and tablet devices.
            </p>
            <p className="text-zinc-600 mb-8">
              It uses{" "}
              <a
                href="https://www.radix-ui.com/docs/primitives/components/dialog"
                className="underline"
                target="_blank"
              >
                Radix&apos;s Dialog primitive
              </a>{" "}
              under the hood and is inspired by{" "}
              <a
                href="https://twitter.com/devongovett/status/1674470185783402496"
                className="underline"
                target="_blank"
              >
                this tweet.
              </a>
            </p>
          </div>
        </div>
      </Drawer.Content>
    </Drawer.Portal>
  );
}
