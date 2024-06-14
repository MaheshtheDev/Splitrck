import { Drawer } from "vaul";
import { format, set } from "date-fns";
import { STTransaction, Transaction } from "./STTransaction";
import { useState } from "react";
import { Dialog } from "@headlessui/react";

interface Props {
  currencyCode: "USD" | "INR";
  transaction: Transaction;
}

export default function STConfigure({ transaction, currencyCode }: Props) {
  const [date, setDate] = useState<string | null>(null);
  return (
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 bg-black/40" />
      <Drawer.Content
        onCloseAutoFocus={() => {
          setDate(null);
        }}
        className="bg-zinc-100 flex flex-col rounded-t-[10px] h-[49%] mt-24 fixed bottom-0 left-0 right-0"
      >
        <div className="p-4 bg-white rounded-t-[10px] flex-1 flex flex-col">
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-2" />
          <STTransaction
            transaction={transaction}
            currencyCode={currencyCode}
          />
          <div className="max-w-md my-4">
            <Drawer.Title className="font-medium mb-2 opacity-45">
              Expense Settings
            </Drawer.Title>
            <div className="flex justify-between align-middle items-center">
              <p className="text-sm">
                Set Payment Due Date
                <p className="opacity-30 text-xs">
                  we will notify all to repay →
                </p>
              </p>
              <div>
                <input
                  type="date"
                  name="date"
                  id="date"
                  placeholder="mm/dd/yyyy"
                  min={format(new Date(), "yyyy-MM-dd")}
                  onChangeCapture={(e) => {
                    setDate((e.target as HTMLInputElement).value);
                  }}
                  className="py-1 px-2 border border-zinc-300 rounded-md w-[95%] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>
          <footer className="mt-auto">
            <Drawer.Close
              className={`w-full bg-[#4cb799] text-white rounded-md py-2 mt-4 ${
                date ? "font-semibold" : "opacity-50 pointer-events-none"
              }`}
              disabled={!date}
              onClick={() => {
                console.log("Save");
                setDate(null);
              }}
            >
              Save
            </Drawer.Close>
          </footer>
        </div>
      </Drawer.Content>
    </Drawer.Portal>
  );
}
