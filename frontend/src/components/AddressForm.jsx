import React, { useState } from "react";

export const AddressForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    costalCode: "",
    country: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Address */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Address
        </label>

        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your full address"
          rows={3}
          required
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400"
        />
      </div>

      {/* City + Postal Code */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            City
          </label>

          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Salem"
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Postal Code
          </label>

          <input
            type="text"
            name="costalCode"
            value={formData.costalCode}
            onChange={handleChange}
            placeholder="636001"
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400"
          />
        </div>
      </div>

      {/* Country */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Country
        </label>

        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="India"
          required
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none transition focus:border-gray-400"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        Continue to Order
      </button>
    </form>
  );
};
