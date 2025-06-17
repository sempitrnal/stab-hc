import { useCartStore } from "@/stores/useCartStore";
import { useHasHydrated } from "@/stores/useHasHydrated";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const {
    isOpen,
    closeCart,
    items,
    totalPrice,
    removeFromCart,
    updateQuantity,
  } = useCartStore();
  console.log(isOpen);
  const total = useCartStore((s) => s.totalPrice());
  const hasHydrated = useHasHydrated();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const handleFile = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setProofFile(files[0]); // Only allow 1 file
  };
  console.log(items);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    deliveryMethod: "pickup",
    paymentMethod: "gcash",
    address: {
      street: "",
      barangay: "",
      city: "",
      province: "",
      zip: "",
    },
  });
  const handleSubmit = async () => {
    // if (!proofFile) {
    //   toast.error("Please upload proof of payment");
    //   return;
    // }
    const {
      firstName,
      lastName,
      email,
      contactNumber,
      deliveryMethod,
      address: { street, barangay, city, province, zip },
      paymentMethod,
    } = form;
    try {
      setLoading(true);
      // const formData = new FormData();
      // formData.append("proof", proofFile); // can be File or Blob

      // const uploadRes = await axios.post("/api/upload", formData);
      // const uploadedFile = uploadRes.data[0]; // Get uploaded file ref

      // 2. Submit order to Strapi
      const orderPayload = {
        data: {
          firstName,
          lastName,
          email,
          contactNumber,
          deliveryMethod,
          address:
            deliveryMethod === "ship"
              ? {
                  street,
                  barangay,
                  city,
                  province,
                  zip,
                }
              : null,
          paymentMethod,
          total: total,
          items: items.map((i) => ({
            name: i.name,
            size: i.size,
            quantity: i.quantity,
            price: i.price,
            image: i.image,
            color: i.color,
          })),
          // proof: uploadedFile.id,
        },
      };
      console.log(JSON.stringify(orderPayload, null, 2));
      const res = await axios.post("/api/orders", orderPayload);

      // 3. Clear cart and redirect/confirm
      toast.success("Order placed successfully!");
      router.push(`/order-success?ref=${res.data.data.orderId}`, undefined, {
        scroll: false,
      });
      console.log(res.data);
      // await axios.post("/api/send-order-email", {
      //   order: {
      //     ...res.data.data,
      //     items: items.map((i) => ({
      //       name: i.name,
      //       size: i.size,
      //       quantity: i.quantity,
      //       price: i.price,
      //       image: i.image,
      //       color: i.color,
      //     })),
      //   },
      // });
      // useCartStore.getState().clearCart();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };
  return (
    <div
      className={`${
        items.length === 0
          ? "flex flex-row justify-center mt-20"
          : "flex flex-col-reverse lg:grid lg:grid-cols-3 lg:gap-10 lg:max-w-5xl"
      } p-4 lg:px-0 mx-auto lowercase`}
    >
      <Head>
        <title className="lowecase">checkout | stab.cult</title>
      </Head>
      {items.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center w-full ">
          <h1 className="text-2xl font-bold text-center">Your cart is empty</h1>
          <p className="mt-2 text-gray-500">
            Add items to your cart to proceed with checkout.
          </p>
          <button
            onClick={() => {
              router.push("/", undefined, { scroll: false });
            }}
            className="px-5 py-2 my-5 text-white transition duration-300 rounded bg-stone-700 hover:bg-stone-600"
          >
            Continue shopping
          </button>
        </div>
      ) : (
        <>
          {/* Left: Form */}
          {items.length === 0 ? null : (
            <form
              className="space-y-8 lg:col-span-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <h1 className="mb-2 text-4xl font-light">Checkout</h1>

              {/* Customer Info */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* First Name */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    disabled={loading}
                    type="text"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    id="firstName"
                    placeholder="Enter your first name"
                    className="px-4 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>

                {/* Last Name */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    disabled={loading}
                    type="text"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    id="lastName"
                    placeholder="Enter your last name"
                    className="px-4 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    disabled={loading}
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    type="email"
                    id="email"
                    placeholder="you@email.com"
                    className="px-4 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>

                {/* Contact Number */}
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label
                    htmlFor="contact"
                    className="text-sm font-medium text-gray-700"
                  >
                    Contact Number
                  </label>
                  <input
                    disabled={loading}
                    value={form.contactNumber}
                    onChange={(e) =>
                      setForm({ ...form, contactNumber: e.target.value })
                    }
                    type="tel"
                    pattern="[0-9]{11}"
                    id="contact"
                    placeholder="09XXXXXXXXX"
                    className="px-4 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="mb-2 font-">Payment Method</h2>
                <div className="flex gap-4">
                  {["gcash", "bank"].map((method) => (
                    <label key={method} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="payment"
                        disabled={loading}
                        value={form.paymentMethod}
                        checked={form.paymentMethod === method}
                        onChange={() =>
                          setForm({ ...form, paymentMethod: method })
                        }
                      />
                      {method === "gcash" ? "GCash" : "Bank Transfer"}
                    </label>
                  ))}
                </div>
              </div>

              {/* Proof of Payment */}
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  handleFile(e.dataTransfer.files);
                }}
                onDragOver={(e) => e.preventDefault()}
                className={`w-full p-4 text-sm text-center text-gray-500 transition border-2 border-gray-300 border-dashed rounded-md ${loading ? "cursor-not-allowed" : "cursor-pointer hover:border-black"}`}
                onClick={() => document.getElementById("proofInput")?.click()}
              >
                {proofFile ? (
                  <p className="text-gray-700">{proofFile.name}</p>
                ) : (
                  <>
                    <p className="mb-1">Drag & drop or click to upload</p>
                    <p className="text-xs text-gray-400">
                      Accepted: JPG, PNG, PDF
                    </p>
                  </>
                )}
                <input
                  id="proofInput"
                  type="file"
                  name="proof"
                  disabled={loading}
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFile(e.target.files)}
                  className="hidden"
                />
              </div>

              {/* Delivery Method */}
              <div>
                <h2 className="mb-2 font-semibld">Delivery Option</h2>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      disabled={loading}
                      type="radio"
                      name="delivery"
                      value="pickup"
                      checked={form.deliveryMethod === "pickup"}
                      onChange={() =>
                        setForm({ ...form, deliveryMethod: "pickup" })
                      }
                    />
                    Pick up at show
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="delivery"
                      value="ship"
                      checked={form.deliveryMethod === "ship"}
                      onChange={() =>
                        setForm({ ...form, deliveryMethod: "ship" })
                      }
                    />
                    Ship to address
                  </label>
                </div>
              </div>

              {form.deliveryMethod === "ship" && (
                <div className="space-y-4">
                  <h2 className="font-semibold text-md">Shipping Address</h2>

                  {/* Street */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="street"
                      className="text-sm font-medium text-gray-700"
                    >
                      Street Address
                    </label>
                    <input
                      disabled={loading}
                      value={form.address.street}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          address: { ...form.address, street: e.target.value },
                        })
                      }
                      id="street"
                      type="text"
                      placeholder="e.g. 123 Rizal Street"
                      className="px-4 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>

                  {/* Barangay */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="barangay"
                      className="text-sm font-medium text-gray-700"
                    >
                      Barangay
                    </label>
                    <input
                      disabled={loading}
                      value={form.address.barangay}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          address: {
                            ...form.address,
                            barangay: e.target.value,
                          },
                        })
                      }
                      id="barangay"
                      type="text"
                      placeholder="e.g. Brgy. Mabolo"
                      className="px-4 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>

                  {/* City & Province */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="city"
                        className="text-sm font-medium text-gray-700"
                      >
                        City / Municipality
                      </label>
                      <input
                        disabled={loading}
                        value={form.address.city}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            address: { ...form.address, city: e.target.value },
                          })
                        }
                        id="city"
                        type="text"
                        placeholder="e.g. Cebu City"
                        className="px-4 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor="province"
                        className="text-sm font-medium text-gray-700"
                      >
                        Province
                      </label>
                      <input
                        disabled={loading}
                        value={form.address.province}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            address: {
                              ...form.address,
                              province: e.target.value,
                            },
                          })
                        }
                        id="province"
                        type="text"
                        placeholder="e.g. Cebu"
                        className="px-4 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                        required
                      />
                    </div>
                  </div>

                  {/* ZIP Code */}
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="zip"
                      className="text-sm font-medium text-gray-700"
                    >
                      ZIP Code
                    </label>
                    <input
                      disabled={loading}
                      value={form.address.zip}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          address: { ...form.address, zip: e.target.value },
                        })
                      }
                      id="zip"
                      type="text"
                      placeholder="e.g. 6000"
                      className="px-4 py-2 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full px-6 py-3 mt-6 rounded md:w-auto transition ${
                  loading
                    ? "bg-stone-400 text-white cursor-not-allowed"
                    : "bg-black hover:bg-gray-800 text-white"
                }`}
              >
                {loading ? "Processing..." : "Confirm Order"}
              </button>
            </form>
          )}

          {/* Right: Summary */}
          {items.length > 0 && (
            <div className="px-4 py-2 mb-10 bg-white border rounded md:p-6 h-fit">
              <h2 className="mb-4 text-lg font-light">Order Summary</h2>

              <div className="space-y-4 overflow-y-auto max-h-96">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex items-center gap-4 text-sm"
                  >
                    {/* Image */}
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-20 h-20 rounded shadow"
                      width={80}
                      height={80}
                    />

                    {/* Info and quantity */}
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500 uppercase">
                        {item.color}
                      </p>
                      <p className="text-xs text-gray-400">Size: {item.size}</p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-sm font-light whitespace-nowrap">
                      ₱
                      {new Intl.NumberFormat("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-4 mt-4 text-base border-t font-">
                <span>Total</span>
                <span>
                  ₱
                  {hasHydrated
                    ? `${new Intl.NumberFormat("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(total)}`
                    : "0.00"}
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
