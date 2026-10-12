import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaPlus, FaCheck } from 'react-icons/fa';
import { apiFetch } from '../config/api.js';
import { useAuth } from '../context/AuthContext';

const AddressForm = ({ addresses, selectedAddress, onSelectAddress, onAddressCreated, userId, checkoutPhone = '' }) => {
  const { isAuthenticated, startGuestCheckout } = useAuth();
  const [showForm, setShowForm] = useState(() => !addresses?.length);
  const [formData, setFormData] = useState({
    receiver_name: '',
    receiver_phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    latitude: null,
    longitude: null,
    is_default: false
  });
  const [loading, setLoading] = useState(false);
  const [houseNo, setHouseNo] = useState('');
  const [flatNo, setFlatNo] = useState('');
  const [area, setArea] = useState('');
  const [areaOptions, setAreaOptions] = useState([]);
  const [pinStatus, setPinStatus] = useState('');

  useEffect(() => {
    if (!checkoutPhone) return;
    setFormData((prev) => (
      prev.receiver_phone ? prev : { ...prev, receiver_phone: checkoutPhone }
    ));
  }, [checkoutPhone]);

  useEffect(() => {
    if (!addresses?.length) {
      setShowForm(true);
    }
  }, [addresses?.length]);

  useEffect(() => {
    const pin = String(formData.postal_code || '').replace(/\D/g, '');
    if (pin.length !== 6) {
      setAreaOptions([]);
      setPinStatus('');
      return undefined;
    }

    let cancelled = false;
    setPinStatus('loading');
    fetch(`https://api.postalpincode.in/pincode/${pin}`)
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        const row = Array.isArray(data) ? data[0] : null;
        const offices = row?.Status === 'Success' && Array.isArray(row.PostOffice) ? row.PostOffice : [];
        if (!offices.length) {
          setAreaOptions([]);
          setPinStatus('error');
          return;
        }
        const areas = [...new Set(offices.map((office) => office.Name).filter(Boolean))];
        const city = offices[0].District || offices[0].Block || offices[0].Division || '';
        const state = offices[0].State || '';
        setAreaOptions(areas);
        setArea(areas[0] || '');
        setFormData((prev) => ({
          ...prev,
          city,
          state,
          country: 'India',
        }));
        setPinStatus('found');
      })
      .catch(() => {
        if (!cancelled) {
          setAreaOptions([]);
          setPinStatus('error');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [formData.postal_code]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const phoneDigits = String(formData.receiver_phone || '').replace(/\D/g, '').slice(0, 10);
      if (phoneDigits.length !== 10) {
        alert('Enter a valid 10-digit mobile number');
        setLoading(false);
        return;
      }
      if (!String(formData.receiver_name || '').trim()) {
        alert('Enter the receiver name');
        setLoading(false);
        return;
      }
      const pin = String(formData.postal_code || '').replace(/\D/g, '');
      if (!/^\d{6}$/.test(pin)) {
        alert('Enter a valid 6-digit PIN code');
        setLoading(false);
        return;
      }
      const house = houseNo.trim();
      const flat = flatNo.trim();
      const locality = area.trim();
      if (!house) {
        alert('Enter the house number');
        setLoading(false);
        return;
      }
      if (!locality || !formData.city || !formData.state) {
        alert('Enter the area, city, and state');
        setLoading(false);
        return;
      }
      const addressLine = [house, flat, locality].filter(Boolean).join(', ');

      if (!isAuthenticated) {
        const { error: guestError } = await startGuestCheckout(
          phoneDigits,
          String(formData.receiver_name).trim(),
        );
        if (guestError) {
          alert(guestError.message || 'Could not start checkout. Please try again.');
          setLoading(false);
          return;
        }
      }

      const response = await apiFetch('/api/addresses', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          receiver_phone: phoneDigits,
          postal_code: pin,
          address_line1: addressLine,
          address_line2: '',
          latitude: null,
          longitude: null,
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        alert(errorData.message || errorData.error || `Failed to create address (Status: ${response.status})`);
        setLoading(false);
        return;
      }

      const result = await response.json();

      if (result.success) {
        onAddressCreated(result.data);
        setShowForm(false);
        setHouseNo('');
        setFlatNo('');
        setArea('');
        setAreaOptions([]);
        setPinStatus('');
        setFormData({
          receiver_name: '',
          receiver_phone: checkoutPhone || '',
          address_line1: '',
          address_line2: '',
          city: '',
          state: '',
          postal_code: '',
          country: 'India',
          latitude: null,
          longitude: null,
          is_default: false
        });
      } else {
        alert(result.message || result.error || 'Failed to create address');
      }
    } catch (error) {
      alert(`Failed to create address: ${error.message || 'Please check your connection and try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-stone-900">
          {isAuthenticated && addresses.length > 0 ? 'Saved addresses' : 'Delivery address'}
        </h3>
        {(isAuthenticated || addresses.length > 0) && (
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white"
          >
            <FaPlus className="text-[10px]" />
            {showForm ? 'Cancel' : 'Add new'}
          </button>
        )}
      </div>

      {/* Existing Addresses */}
      {!showForm && addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => onSelectAddress(address)}
              className={`cursor-pointer rounded-2xl border-2 bg-white p-3 shadow-sm transition-all ${
                selectedAddress?.id === address.id
                  ? 'border-primary'
                  : 'border-transparent hover:border-stone-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FaMapMarkerAlt className="text-primary" />
                    <span className="font-semibold text-gray-900">{address.receiver_name}</span>
                    {address.is_default && (
                      <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{address.receiver_phone}</p>
                  <p className="text-sm text-gray-700 mt-2">
                    {address.address_line1}
                    {address.address_line2 && `, ${address.address_line2}`}
                  </p>
                  <p className="text-sm text-gray-700">
                    {address.city}, {address.state} - {address.postal_code}
                  </p>
                  <p className="text-sm text-gray-600">{address.country}</p>
                </div>
                {selectedAddress?.id === address.id && (
                  <FaCheck className="text-primary text-xl" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Address Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Receiver Name *
            </label>
            <input
              type="text"
              name="receiver_name"
              value={formData.receiver_name}
              onChange={handleInputChange}
              required
              className="w-full rounded-xl border border-stone-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              type="tel"
              name="receiver_phone"
              value={formData.receiver_phone}
              onChange={handleInputChange}
              required
              pattern="[0-9]{10}"
              className="w-full rounded-xl border border-stone-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="address-pin" className="mb-1 block text-sm font-medium text-gray-700">
              PIN code *
            </label>
            <input
              id="address-pin"
              type="text"
              inputMode="numeric"
              name="postal_code"
              value={formData.postal_code}
              onChange={(e) => {
                const pin = e.target.value.replace(/\D/g, '').slice(0, 6);
                setFormData((prev) => ({ ...prev, postal_code: pin }));
              }}
              required
              maxLength={6}
              placeholder="6-digit PIN"
              className="w-full rounded-xl border border-stone-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {pinStatus === 'loading' && (
              <p className="mt-1 text-xs text-stone-500">Finding area for this PIN...</p>
            )}
            {pinStatus === 'found' && (
              <p className="mt-1 text-xs text-primary">
                {formData.city}{formData.state ? `, ${formData.state}` : ''}
              </p>
            )}
            {pinStatus === 'error' && (
              <p className="mt-1 text-xs text-red-600">We could not find this PIN. Enter the area yourself.</p>
            )}
          </div>

          {(pinStatus === 'found' || pinStatus === 'error') && (
            <>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  House no. *
                </label>
                <input
                  type="text"
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  required
                  placeholder="House / building number"
                  className="w-full rounded-xl border border-stone-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Flat no.
                </label>
                <input
                  type="text"
                  value={flatNo}
                  onChange={(e) => setFlatNo(e.target.value)}
                  placeholder="Flat, floor, or apartment"
                  className="w-full rounded-xl border border-stone-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="address-area" className="mb-1 block text-sm font-medium text-gray-700">
                  Area *
                </label>
                <input
                  id="address-area"
                  type="text"
                  list="pin-areas"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  required
                  placeholder="Locality"
                  className="w-full rounded-xl border border-stone-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <datalist id="pin-areas">
                  {areaOptions.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-stone-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-stone-200 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_default"
              id="is_default"
              checked={formData.is_default}
              onChange={handleInputChange}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="is_default" className="text-sm text-gray-700">
              Set as default address
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-primary px-4 py-2.5 font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Address'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-stone-200 px-4 py-2.5 text-stone-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {!showForm && addresses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FaMapMarkerAlt className="text-4xl mx-auto mb-3 text-gray-300" />
          <p>No addresses found. Please add an address to continue.</p>
        </div>
      )}
    </div>
  );
};

export default AddressForm;

