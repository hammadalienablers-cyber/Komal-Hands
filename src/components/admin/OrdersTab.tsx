import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Clock, 
  CheckCircle2, 
  Truck, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Printer, 
  Trash2, 
  Eye, 
  X, 
  SlidersHorizontal,
  FileText
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Order, OrderStatus } from '../../types';

export const OrdersTab: React.FC = () => {
  const { orders, updateOrderStatus, cancelOrder, deleteOrder } = useShop();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Dispatch modal state
  const [dispatchModalOrder, setDispatchModalOrder] = useState<Order | null>(null);
  const [courierInput, setCourierInput] = useState('Trax Express Logistics');
  const [waybillInput, setWaybillInput] = useState('');

  // Filtering
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch = 
      !q || 
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      o.city.toLowerCase().includes(q) ||
      o.trackingNumber.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleOpenDispatch = (order: Order) => {
    setDispatchModalOrder(order);
    setCourierInput(order.courierName || 'Trax Express Logistics');
    setWaybillInput(order.trackingNumber || `TRX-${Math.floor(100000000 + Math.random() * 900000000)}PK`);
  };

  const handleConfirmDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (dispatchModalOrder) {
      updateOrderStatus(
        dispatchModalOrder.id, 
        'dispatched', 
        courierInput, 
        waybillInput
      );
      setDispatchModalOrder(null);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return <span className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-full text-[11px] font-medium">Placed (Needs Packing)</span>;
      case 'packed':
        return <span className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-full text-[11px] font-medium">Packed (Ready for Courier)</span>;
      case 'dispatched':
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full text-[11px] font-medium">Dispatched / In Transit</span>;
      case 'out_for_delivery':
        return <span className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-[11px] font-medium">Out for Delivery</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-medium">Delivered & Paid</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 bg-rose-100 text-rose-800 border border-rose-300 rounded-full text-[11px] font-medium">Cancelled (Stock Restored)</span>;
      default:
        return null;
    }
  };

  // WhatsApp quick contact
  const getWhatsAppLink = (order: Order) => {
    const cleanPhone = order.phone.replace(/[^0-9]/g, '');
    const standardPhone = cleanPhone.startsWith('0') ? '92' + cleanPhone.slice(1) : cleanPhone;
    const text = encodeURIComponent(
      `Assalam-o-Alaikum ${order.customerName}! This is Komal Accessories regarding your order ${order.id}. Current status is: ${order.orderStatus.toUpperCase()}. Track here: ${order.trackingNumber}`
    );
    return `https://wa.me/${standardPhone}?text=${text}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs">
        <div>
          <h2 className="font-serif text-xl font-medium text-stone-900">
            Customer Orders & Fulfillment
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            View orders, dispatch packages with courier tracking numbers, and advance timeline stages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs bg-stone-100 text-stone-800 px-3 py-1.5 rounded-xl font-semibold">
            {orders.length} Total Orders
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, customer name, phone, or city..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-stone-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['all', 'placed', 'packed', 'dispatched', 'out_for_delivery', 'delivered'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                statusFilter === st
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
              }`}
            >
              {st === 'all' ? 'All Orders' : st === 'out_for_delivery' ? 'Out for Delivery' : st.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF9F6] border-b border-stone-200 text-stone-500 uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Order Details</th>
                <th className="py-3.5 px-4 font-semibold">Customer & City</th>
                <th className="py-3.5 px-4 font-semibold">Items</th>
                <th className="py-3.5 px-4 font-semibold">Total & Payment</th>
                <th className="py-3.5 px-4 font-semibold">Current Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Advance & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Order Details */}
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-stone-900 text-sm">{o.id}</p>
                      <p className="text-[11px] text-stone-400">{o.createdAt}</p>
                      <p className="text-[11px] font-mono text-stone-500 mt-0.5">
                        Track: {o.trackingNumber}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-stone-900">{o.customerName}</p>
                      <p className="text-[11px] text-stone-500">{o.phone}</p>
                      <div className="flex items-center gap-1 text-[11px] text-stone-600 mt-0.5">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span className="truncate max-w-[160px]">{o.address}, {o.city}</span>
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-stone-900 block">
                        {o.items.length} {o.items.length === 1 ? 'item' : 'items'}
                      </span>
                      <p className="text-[11px] text-stone-500 truncate max-w-[150px]">
                        {o.items[0]?.product.name} {o.items.length > 1 && `+${o.items.length - 1} more`}
                      </p>
                    </td>

                    {/* Total & Payment */}
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-stone-900 text-sm tabular-nums">
                        Rs. {o.total.toLocaleString()}
                      </p>
                      <span className="text-[11px] uppercase text-stone-500 font-medium">
                        {o.paymentMethod === 'cod' ? 'Cash on Delivery' : o.paymentMethod}
                      </span>
                      <span className={`block text-[10px] font-semibold ${
                        o.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {o.paymentStatus.toUpperCase()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {getStatusBadge(o.orderStatus)}
                      <p className="text-[10px] text-stone-400 mt-1">{o.courierName}</p>
                    </td>

                    {/* Actions & Next Stage Stepper */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {/* 1-Click Status Stepper */}
                        {o.orderStatus === 'placed' && (
                          <button
                            onClick={() => updateOrderStatus(o.id, 'packed')}
                            className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Mark Packed
                          </button>
                        )}

                        {o.orderStatus === 'packed' && (
                          <button
                            onClick={() => handleOpenDispatch(o)}
                            className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Truck className="w-3 h-3" />
                            <span>Dispatch</span>
                          </button>
                        )}

                        {o.orderStatus === 'dispatched' && (
                          <button
                            onClick={() => updateOrderStatus(o.id, 'out_for_delivery')}
                            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Out for Delivery
                          </button>
                        )}

                        {o.orderStatus === 'out_for_delivery' && (
                          <button
                            onClick={() => updateOrderStatus(o.id, 'delivered')}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Delivered
                          </button>
                        )}

                        {/* Admin Cancel & Stock Restoration */}
                        {o.orderStatus !== 'cancelled' && o.orderStatus !== 'delivered' && (
                          <button
                            onClick={async () => {
                              const reason = window.prompt(`Cancel order ${o.id} and restore inventory stock?\nEnter cancellation reason (optional):`);
                              if (reason !== null) {
                                const res = await cancelOrder(o.id, reason.trim() || undefined);
                                if (!res.success) {
                                  alert(res.error || 'Failed to cancel order.');
                                }
                              }
                            }}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                            title="Cancel order and restore stock"
                          >
                            Cancel
                          </button>
                        )}

                        {/* WhatsApp Customer */}
                        <a
                          href={getWhatsAppLink(o)}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                          title="Message customer on WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>

                        {/* View full slip */}
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                          title="View order slip"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete order */}
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete order ${o.id}?`)) {
                              deleteOrder(o.id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Parcel Modal */}
      {dispatchModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setDispatchModalOrder(null)}
          />

          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-700" />
                <div>
                  <h3 className="font-serif text-base font-semibold text-stone-900">
                    Handover to Courier Partner
                  </h3>
                  <p className="text-[11px] text-stone-500">Order: {dispatchModalOrder.id}</p>
                </div>
              </div>
              <button
                onClick={() => setDispatchModalOrder(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmDispatch} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Courier Company *
                </label>
                <select
                  value={courierInput}
                  onChange={(e) => setCourierInput(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none"
                >
                  <option value="Trax Express Logistics">Trax Express Logistics</option>
                  <option value="Leopards Courier Service">Leopards Courier Service</option>
                  <option value="TCS Express">TCS Express</option>
                  <option value="M&P Express">M&P Express</option>
                  <option value="Call Courier">Call Courier</option>
                  <option value="Komal Express Delivery Rider">Komal Express Delivery Rider (Lahore)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Waybill / Tracking Number *
                </label>
                <input
                  type="text"
                  required
                  value={waybillInput}
                  onChange={(e) => setWaybillInput(e.target.value)}
                  placeholder="e.g. TRX-94827104PK"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl outline-none font-mono"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Customer will see this tracking number live on the tracking page.
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDispatchModalOrder(null)}
                  className="px-3 py-2 text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-medium transition-colors cursor-pointer"
                >
                  Confirm & Notify Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice / Packing Slip Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div 
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-10 my-8">
            <div className="px-6 py-4 bg-[#FAF9F6] border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-800" />
                <h3 className="font-serif text-base font-semibold text-stone-900">
                  Packing Slip & Customer Invoice
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-1.5 bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 rounded-lg text-xs flex items-center gap-1.5"
                  title="Print Packing Slip"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5 text-xs text-stone-700">
              <div className="flex justify-between border-b border-stone-200 pb-4">
                <div>
                  <h2 className="font-serif text-lg font-bold text-stone-900">Komal Accessories</h2>
                  <p className="text-stone-500">MM Alam Road, Gulberg III, Lahore</p>
                  <p className="text-stone-500">WhatsApp: +92 300 1234567</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-stone-900 text-base">{selectedOrder.id}</p>
                  <p className="text-stone-400">{selectedOrder.createdAt}</p>
                  <p className="font-mono text-stone-600 mt-1">Waybill: {selectedOrder.trackingNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Deliver To:</span>
                  <p className="font-bold text-stone-900">{selectedOrder.customerName}</p>
                  <p>{selectedOrder.phone}</p>
                  <p>{selectedOrder.address}, {selectedOrder.city}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Logistics & Payment:</span>
                  <p><strong>Courier:</strong> {selectedOrder.courierName}</p>
                  <p><strong>Payment:</strong> {selectedOrder.paymentMethod.toUpperCase()}</p>
                  <p><strong>Payable:</strong> Rs. {selectedOrder.total.toLocaleString()}</p>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="p-2.5 bg-rose-50 rounded-lg text-rose-900">
                  <strong>Customer Note:</strong> {selectedOrder.notes}
                </div>
              )}

              {/* Items Table */}
              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase text-[10px]">
                    <tr>
                      <th className="py-2 px-3">Item Description</th>
                      <th className="py-2 px-3">Color</th>
                      <th className="py-2 px-3 text-center">Qty</th>
                      <th className="py-2 px-3 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3 font-medium text-stone-900">{item.product.name}</td>
                        <td className="py-2.5 px-3 text-stone-500">{item.selectedColor}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                          Rs. {(item.product.price * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-1 text-right pt-2 border-t border-stone-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Subtotal:</span>
                  <span className="font-mono">Rs. {selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Shipping:</span>
                  <span className="font-mono">Rs. {selectedOrder.shipping.toLocaleString()}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-rose-700">
                    <span>Discount:</span>
                    <span className="font-mono">-Rs. {selectedOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-stone-900 pt-1 border-t border-stone-200">
                  <span>Grand Total Due:</span>
                  <span className="font-mono">Rs. {selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
