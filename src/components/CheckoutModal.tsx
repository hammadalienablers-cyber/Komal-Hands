import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  Smartphone, 
  Lock, 
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    discountAmount, 
    appliedCoupon,
    placeOrder,
    openOrderTrackerWithId,
    storeSettings
  } = useShop();

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Lahore');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'jazzcash_easypaisa'>('cod');
  
  // Card Details state (for simulated secure payment gateway)
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [txId, setTxId] = useState('');

  // Processing state & Placed Order state
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const FREE_SHIPPING_THRESHOLD = storeSettings.freeShippingThreshold;
  const isFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD || appliedCoupon === 'FREESHIP';
  const shippingFee = isFreeShipping ? 0 : storeSettings.standardShippingFee;
  const grandTotal = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  // Form validation
  const isFormValid = customerName.trim().length >= 2 && phone.trim().length >= 10 && address.trim().length >= 5;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 2) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setCardExpiry(val);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsProcessing(true);

    // Simulate secure SSL gateway processing
    setTimeout(async () => {
      try {
        const order = await placeOrder({
          customerName,
          email: email || `${customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
          phone,
          city,
          address,
          postalCode,
          notes: notes + (paymentMethod === 'jazzcash_easypaisa' && txId ? ` (TxID: ${txId})` : ''),
          paymentMethod,
          paymentReference: txId.trim() || undefined,
        });

        setIsProcessing(false);
        setConfirmedOrder(order);
      } catch (err: any) {
        setIsProcessing(false);
        console.error('Order placement failed:', err);
        // Show fallback or alert
        alert(err.message || 'Failed to place order. Please try again.');
      }
    }, 1200);
  };

  const handleTrackNewOrder = () => {
    if (confirmedOrder) {
      const id = confirmedOrder.id;
      setConfirmedOrder(null);
      setIsCheckoutOpen(false);
      openOrderTrackerWithId(id);
    }
  };

  const handleClose = () => {
    setConfirmedOrder(null);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Confirmed Order State (Success Screen) */}
        {confirmedOrder ? (
          <div className="p-8 sm:p-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-rose-800">
                Order Confirmed · Komal Accessories
              </span>
              <h2 className="font-serif text-3xl font-medium text-stone-900">
                Shukriya, {confirmedOrder.customerName}!
              </h2>
              <p className="text-sm text-stone-600 max-w-md mx-auto">
                Your order has been safely placed. We are carefully inspecting and gift-wrapping your items.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="bg-[#FAF9F6] border border-stone-200 rounded-xl p-5 max-w-md mx-auto text-left space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-stone-200">
                <span className="text-stone-500">Order Number</span>
                <span className="font-mono font-bold text-stone-900 text-sm">
                  {confirmedOrder.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Tracking Number</span>
                <span className="font-mono text-stone-800">{confirmedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Delivery Address</span>
                <span className="text-stone-800 font-medium text-right max-w-[220px]">
                  {confirmedOrder.address}, {confirmedOrder.city}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment Mode</span>
                <span className="text-stone-800 uppercase font-medium">
                  {confirmedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : confirmedOrder.paymentMethod.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-semibold">
                <span className="text-stone-900">Amount Payable</span>
                <span className="font-mono text-stone-900">Rs. {confirmedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleTrackNewOrder}
                className="w-full sm:w-auto px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <PackageCheck className="w-4 h-4 text-rose-300" />
                <span>Track Live Order Status</span>
              </button>

              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Streamlined 1-Page Checkout Form */
          <div>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-[#FAF9F6]">
              <div>
                <span className="text-xs uppercase tracking-wider text-rose-800 font-semibold">
                  Express Checkout
                </span>
                <h3 className="font-serif text-lg font-medium text-stone-900">
                  Complete Your Order
                </h3>
              </div>

              <button
                onClick={handleClose}
                className="p-1.5 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Left Column: Customer Shipping Details */}
                <div className="md:col-span-7 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500 pb-1">
                    <Truck className="w-4 h-4 text-rose-700" />
                    <span>1. Shipping Information</span>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ayesha Khan"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg outline-none focus:border-stone-500 focus:ring-1 focus:ring-stone-500"
                    />
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Phone (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0300-1234567"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg outline-none focus:border-stone-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ayesha@example.com"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg outline-none focus:border-stone-500"
                      />
                    </div>
                  </div>

                  {/* City Selector & Postal Code */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        City *
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg outline-none focus:border-stone-500 cursor-pointer"
                      >
                        <option value="Lahore">Lahore (Same/Next Day)</option>
                        <option value="Karachi">Karachi (2-3 Days)</option>
                        <option value="Islamabad">Islamabad (1-2 Days)</option>
                        <option value="Rawalpindi">Rawalpindi (1-2 Days)</option>
                        <option value="Faisalabad">Faisalabad (2 Days)</option>
                        <option value="Multan">Multan (2 Days)</option>
                        <option value="Peshawar">Peshawar (2-3 Days)</option>
                        <option value="Sialkot">Sialkot (2 Days)</option>
                        <option value="Gujranwala">Gujranwala (2 Days)</option>
                        <option value="Quetta">Quetta (3-4 Days)</option>
                        <option value="Other City">Other City in Pakistan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Postal Code (Optional)
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g. 54000"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg outline-none focus:border-stone-500"
                      />
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Complete Street Address / House # *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House/Apartment #, Street, Sector, Landmark"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg outline-none focus:border-stone-500 resize-none"
                    />
                  </div>

                  {/* Delivery Note */}
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Special Note / Gift Instructions
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Please add birthday card note, ring bell"
                      className="w-full px-3.5 py-2 text-xs bg-white border border-stone-200 rounded-lg outline-none focus:border-stone-500"
                    />
                  </div>

                  {/* Payment Gateway Options */}
                  <div className="pt-4 border-t border-stone-200 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
                      <Lock className="w-4 h-4 text-emerald-600" />
                      <span>2. Select Secure Payment Gateway</span>
                    </div>

                    {/* Radio Options */}
                    <div className="space-y-2">
                      {/* COD Option */}
                      <label 
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === 'cod' 
                            ? 'border-stone-900 bg-stone-50/80 shadow-2xs' 
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="mt-0.5"
                        />
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-stone-900">
                              Cash on Delivery (COD)
                            </span>
                            <span className="text-[11px] text-emerald-700 font-medium">Most Popular</span>
                          </div>
                          <p className="text-stone-500 mt-0.5">
                            Pay in cash to courier rider upon parcel delivery. 100% safe & risk-free.
                          </p>
                        </div>
                      </label>

                      {/* Card Option (Simulated 3D Secure) */}
                      <label 
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === 'card' 
                            ? 'border-stone-900 bg-stone-50/80 shadow-2xs' 
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="mt-0.5"
                        />
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                              <CreditCard className="w-3.5 h-3.5 text-rose-700" />
                              <span>Credit / Debit Card (Visa, Mastercard, PayPak)</span>
                            </span>
                            <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded font-mono">
                              3D Secure
                            </span>
                          </div>
                          <p className="text-stone-500 mt-0.5">
                            Instant online checkout with 256-bit bank grade encryption.
                          </p>
                        </div>
                      </label>

                      {/* JazzCash / EasyPaisa Option */}
                      <label 
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          paymentMethod === 'jazzcash_easypaisa'} 
                            ? 'border-stone-900 bg-stone-50/80 shadow-2xs' 
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'jazzcash_easypaisa'}
                          onChange={() => setPaymentMethod('jazzcash_easypaisa')}
                          className="mt-0.5"
                        />
                        <div className="flex-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                              <span>JazzCash / EasyPaisa / Raast Instant Transfer</span>
                            </span>
                          </div>
                          <p className="text-stone-500 mt-0.5">
                            Transfer directly to official Komal Accessories business account.
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Card fields if Card selected */}
                    {paymentMethod === 'card' && (
                      <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-3 text-xs animate-in fade-in duration-200">
                        <div className="flex items-center justify-between text-stone-500 pb-1">
                          <span className="font-medium text-stone-700">Encrypted Card Entry</span>
                          <span className="text-[10px] text-emerald-700 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> TLS 1.3 Active
                          </span>
                        </div>

                        <div>
                          <label className="block text-[11px] text-stone-600 mb-1">Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="4000 1234 5678 9010"
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-xs outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-stone-600 mb-1">Expiry MM/YY</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={handleExpiryChange}
                              placeholder="12/28"
                              className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-xs outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-stone-600 mb-1">CVV / CVC</label>
                            <input
                              type="password"
                              maxLength={4}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                              placeholder="•••"
                              className="w-full px-3 py-2 border border-stone-300 rounded-lg font-mono text-xs outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-stone-600 mb-1">Name on Card</label>
                          <input
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            placeholder="Ayesha Khan"
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs outline-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* JazzCash / EasyPaisa account details if selected */}
                    {paymentMethod === 'jazzcash_easypaisa' && (
                      <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs animate-in fade-in duration-200">
                        <p className="font-semibold text-emerald-950">Official Account Details:</p>
                        <div className="space-y-1 text-emerald-900">
                          <p>• <strong>JazzCash / EasyPaisa:</strong> 0300-1234567 (Title: Komal Accessories)</p>
                          <p>• <strong>Raast ID:</strong> 03001234567</p>
                          <p>• <strong>Bank Alfalah:</strong> 0124-1008472910</p>
                        </div>
                        <div className="pt-2">
                          <label className="block text-[11px] text-emerald-900 mb-1">
                            Transaction ID / Reference (or enter after transfer):
                          </label>
                          <input
                            type="text"
                            value={txId}
                            onChange={(e) => setTxId(e.target.value)}
                            placeholder="e.g. 984728190"
                            className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Right Column: Order Summary & Placement */}
                <div className="md:col-span-5 bg-[#FAF9F6] p-5 rounded-xl border border-stone-200 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                      Order Summary ({cart.length} items)
                    </h4>

                    {/* Item list preview */}
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs bg-white p-2 rounded-lg border border-stone-100">
                          <img 
                            src={item.product.images[0]} 
                            alt="" 
                            className="w-10 h-10 object-cover rounded shrink-0" 
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-stone-900 truncate">{item.product.name}</p>
                            <p className="text-[11px] text-stone-500">
                              {item.selectedColor} · Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="font-mono tabular-nums text-stone-800 font-medium">
                            Rs. {(item.product.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Calculations */}
                    <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
                      <div className="flex justify-between">
                        <span>Items Subtotal</span>
                        <span className="font-mono tabular-nums text-stone-900">
                          Rs. {cartSubtotal.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Courier Delivery</span>
                        <span className="font-mono tabular-nums text-stone-900">
                          {shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `Rs. ${shippingFee}`}
                        </span>
                      </div>

                      {discountAmount > 0 && (
                        <div className="flex justify-between text-rose-700 font-medium">
                          <span>Discount ({appliedCoupon})</span>
                          <span className="font-mono tabular-nums">-Rs. {discountAmount.toLocaleString()}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                        <span>Total Payable</span>
                        <span className="font-mono tabular-nums">
                          Rs. {grandTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Assurance badges */}
                    <div className="p-3 bg-white rounded-lg border border-stone-200/80 space-y-1 text-[11px] text-stone-500">
                      <div className="flex items-center gap-1.5 text-stone-800 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Komal Buyer Protection</span>
                      </div>
                      <p>Open parcel check upon delivery available via Trax courier.</p>
                    </div>
                  </div>

                  {/* Submit Order Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!isFormValid || isProcessing}
                      className={`w-full py-3.5 px-4 rounded-xl text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                        isFormValid && !isProcessing
                          ? 'bg-rose-800 hover:bg-rose-900 text-white active:scale-98'
                          : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      {isProcessing ? (
                        <span>Securing Order...</span>
                      ) : (
                        <>
                          <span>Confirm Order · Rs. {grandTotal.toLocaleString()}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    {!isFormValid && (
                      <p className="text-[11px] text-rose-600 text-center mt-2">
                        * Please enter your name, phone number, and street address.
                      </p>
                    )}
                  </div>

                </div>

              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
