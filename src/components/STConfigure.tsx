import { Drawer } from "vaul";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { STTransaction, Transaction } from "./STTransaction";
import { DatePickerDemo } from "./ui/date-picker";

interface Props {
  currencyCode: "USD" | "INR";
  transaction: Transaction;
}

export default function STConfigure({ transaction, currencyCode }: Props) {
  return (
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 bg-black/40" />
      <Drawer.Content className="bg-zinc-100 flex flex-col rounded-t-[10px] h-[49%] mt-24 fixed bottom-0 left-0 right-0">
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
                <p className="opacity-30 text-xs">we will notify all to repay</p>
              </p>
              <div className="text-xs flex justify-end">
                <DatePickerDemo />
              </div>
            </div>
          </div>
          <footer className="mt-auto">
            <button className="w-full bg-[#4cb799] text-white rounded-md py-2 mt-4 opacity-50">
              Save
            </button>
          </footer>
        </div>
      </Drawer.Content>
    </Drawer.Portal>
  );
}
