import { HTMLAttributes } from "react";

export interface Transaction {
  description: string;
  amount: string;
  date: any;
  paidBy: {
    user: {
      first_name: string;
    };
  };
}

export function STTransaction({
  transaction,
  currencyCode,
}: {
  transaction: Transaction;
  currencyCode: "USD" | "INR";
}) {
  return (
    <div className="flex justify-between bg-white py-1 items-center  border-gray-100 hover:bg-gray-100 transition duration-300 ease-in-out pr-2 rounded-sm">
      <div className="flex justify-start items-center">
        <div className="bg-[#35335b] rounded-sm mr-2 px-2 py-1 text-white">
          <div className="text-xs text-center">
            {new Date(transaction.date).toLocaleDateString("en-US", {
              month: "short",
            })}
          </div>
          <div className="text-md text-center">
            {new Date(transaction.date).toLocaleDateString("en-US", {
              day: "numeric",
            })}
          </div>
        </div>
        <div className="items-center">
          <p className="text-sm">{transaction.description}</p>
          <p className="text-[10px] text-[#cbaeae]">
            Paid by{" "}
            <span className="font-semibold capitalize">
              {transaction.paidBy.user.first_name}
            </span>{" "}
          </p>
        </div>
      </div>
      <p className="font-semibold text-[#008000] text-sm">
        {Number(transaction.amount).toFixed(2)} {currencyCode}
      </p>
    </div>
  );
}
