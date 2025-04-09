import React, { useState } from "react";
import { FaCreditCard } from "react-icons/fa";
import { RiBankCardFill } from "react-icons/ri";
import { SiMomo, SiZalo, SiVisa } from "react-icons/si";
import { MdOutlineQrCodeScanner } from "react-icons/md";

const paymentMethods = [

  { id: "cash", label: "Thanh toán tiền mặt", icon: <RiBankCardFill /> },
  { id: "viettel", label: "Viettel Money", icon: <img src="viettel-icon.png" alt="Viettel" className="w-5 h-5" /> },
  { id: "zalopay", label: "Ví ZaloPay", icon: <SiZalo className="text-blue-500" /> },
  { id: "vnpay", label: "VNPAY", icon: <MdOutlineQrCodeScanner /> },
  { id: "credit", label: "Thẻ tín dụng/ Ghi nợ", icon: <SiVisa className="text-blue-700" /> },
  { id: "atm", label: "Thẻ ATM", icon: <FaCreditCard /> },
];

const discounts = [
  { id: 1, label: "Freeship", details: "Thẻ Shinhan Platinum", amount: "Không giới hạn" },
  { id: 2, label: "Freeship", details: "Thẻ Shinhan Classic", amount: "Không giới hạn" },
  { id: 3, label: "Giảm 30k", details: "Đơn từ 200k", amount: "Không giới hạn" },
  { id: 4, label: "Giảm 50k", details: "Đơn từ 300k", amount: "Không giới hạn" },
  { id: 5, label: "Giảm 100k", details: "Đơn từ 700k", amount: "Không giới hạn" },
  { id: 6, label: "Giảm 150k", details: "Đơn từ 1 triệu", amount: "Không giới hạn" },
  { id: 7, label: "Giảm 70k", details: "Đơn từ 500k", amount: "Không giới hạn" },
  { id: 8, label: "Freeship", details: "TikiCARD", amount: "Không giới hạn" },
];

const Payment = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  return (
    <div className="p-5 bg-white rounded-lg shadow-md">
      <h3 className="font-bold text-lg mb-3">Chọn hình thức thanh toán</h3>
      <div className="space-y-2">
        {paymentMethods.map((method) => (
          <label key={method.id} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => setSelectedMethod(method.id)}
              className="hidden"
            />
            <div className={`p-2 border rounded-md flex items-center space-x-2 ${selectedMethod === method.id ? 'border-blue-500' : 'border-gray-300'}`}>
              {method.icon}
              <span>{method.label}</span>
            </div>
          </label>
        ))}
      </div>

      {selectedMethod === "credit" && (
        <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md">+ Thêm thẻ mới</button>
      )}

      <div className="mt-5">
        <h3 className="font-bold text-lg mb-3">Ưu đãi thanh toán thẻ</h3>
        <div className="grid grid-cols-3 gap-3">
          {discounts.map((discount) => (
            <div key={discount.id} className="p-3 border rounded-md shadow-sm bg-gray-100">
              <h4 className="font-bold text-blue-600">{discount.label}</h4>
              <p className="text-sm">{discount.details}</p>
              <p className="text-xs text-orange-500">{discount.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Payment;
