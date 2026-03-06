import { isSupabaseEnabled, supabase } from './supabaseClient';

const LOCAL_ORDERS_KEY = 'shopii_orders';

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatDate = (value) => {
  if (!value) return new Date().toLocaleDateString('th-TH');
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('th-TH');
};

const getLocalOrders = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

const setLocalOrders = (orders) => {
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
};

const sortOrders = (orders) =>
  [...orders].sort((a, b) => {
    const da = new Date(a?.payment?.timestamp || a?.date || 0).getTime();
    const db = new Date(b?.payment?.timestamp || b?.date || 0).getTime();
    return db - da;
  });

const mapDbToOrder = (orderRow, customerRow, addressRow, paymentRow, itemRows) => {
  const addressText =
    addressRow?.full_address ||
    [
      addressRow?.address_line,
      [addressRow?.subdistrict, addressRow?.district].filter(Boolean).join(' '),
      [addressRow?.province, addressRow?.zipcode].filter(Boolean).join(' ')
    ]
      .filter(Boolean)
      .join('\n');

  return {
    _dbId: orderRow.id,
    id: orderRow.order_no,
    date: formatDate(orderRow.created_at || orderRow.order_date),
    customer: {
      name: customerRow?.full_name || '',
      phone: customerRow?.phone || '',
      email: customerRow?.email || '',
      address: addressText || ''
    },
    items: (itemRows || []).map((item) => ({
      id: item.product_id || '',
      name: item.product_name || '',
      image: item.product_image || '',
      price: toNumber(item.unit_price),
      quantity: toNumber(item.quantity)
    })),
    totals: {
      subtotal: toNumber(orderRow.subtotal),
      shipping: toNumber(orderRow.shipping),
      total: toNumber(orderRow.total)
    },
    payment: {
      method: paymentRow?.method || '',
      timestamp: paymentRow?.paid_at || paymentRow?.created_at || null,
      referenceNo: paymentRow?.reference_no || ''
    },
    status: orderRow.status || 'Pending',
    admin: {
      note: orderRow.admin_note || '',
      trackingNo: orderRow.tracking_no || ''
    }
  };
};

const loadFullOrdersFromSupabase = async () => {
  const { data: orders, error: ordersError } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (ordersError) throw ordersError;

  if (!orders || orders.length === 0) return [];

  const customerIds = [...new Set(orders.map((order) => order.customer_id).filter(Boolean))];
  const addressIds = [...new Set(orders.map((order) => order.address_id).filter(Boolean))];
  const orderIds = orders.map((order) => order.id);

  const [customersRes, addressesRes, paymentsRes, itemsRes] = await Promise.all([
    customerIds.length > 0 ? supabase.from('customers').select('*').in('id', customerIds) : Promise.resolve({ data: [], error: null }),
    addressIds.length > 0 ? supabase.from('addresses').select('*').in('id', addressIds) : Promise.resolve({ data: [], error: null }),
    orderIds.length > 0 ? supabase.from('payments').select('*').in('order_id', orderIds) : Promise.resolve({ data: [], error: null }),
    orderIds.length > 0
      ? supabase.from('order_items').select('*').in('order_id', orderIds).order('id', { ascending: true })
      : Promise.resolve({ data: [], error: null })
  ]);

  if (customersRes.error) throw customersRes.error;
  if (addressesRes.error) throw addressesRes.error;
  if (paymentsRes.error) throw paymentsRes.error;
  if (itemsRes.error) throw itemsRes.error;

  const customerMap = new Map((customersRes.data || []).map((row) => [row.id, row]));
  const addressMap = new Map((addressesRes.data || []).map((row) => [row.id, row]));
  const paymentMap = new Map((paymentsRes.data || []).map((row) => [row.order_id, row]));

  const itemsByOrder = (itemsRes.data || []).reduce((acc, row) => {
    if (!acc[row.order_id]) acc[row.order_id] = [];
    acc[row.order_id].push(row);
    return acc;
  }, {});

  return orders.map((order) =>
    mapDbToOrder(order, customerMap.get(order.customer_id), addressMap.get(order.address_id), paymentMap.get(order.id), itemsByOrder[order.id] || [])
  );
};

export const listOrders = async () => {
  if (!isSupabaseEnabled || !supabase) {
    return sortOrders(getLocalOrders());
  }

  return loadFullOrdersFromSupabase();
};

export const getOrderById = async (appOrderId) => {
  if (!appOrderId) return null;

  if (!isSupabaseEnabled || !supabase) {
    return getLocalOrders().find((order) => order.id === appOrderId) || null;
  }

  const rows = await loadFullOrdersFromSupabase();
  return rows.find((order) => order.id === appOrderId) || null;
};

const parseAddressParts = (fullAddress = '') => {
  const lines = String(fullAddress)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const [line1 = '', line2 = '', line3 = ''] = lines;
  const [subdistrict = '', district = ''] = line2.split(/\s+/).filter(Boolean);
  const line3Parts = line3.split(/\s+/).filter(Boolean);
  const zipcode = line3Parts.pop() || '';
  const province = line3Parts.join(' ');

  return {
    address_line: line1,
    subdistrict,
    district,
    province,
    zipcode,
    full_address: fullAddress
  };
};

export const createOrder = async (order) => {
  if (!order?.id) throw new Error('Invalid order payload');

  if (!isSupabaseEnabled || !supabase) {
    const next = sortOrders([order, ...getLocalOrders().filter((x) => x.id !== order.id)]);
    setLocalOrders(next);
    return order;
  }

  const customerPayload = {
    full_name: order.customer?.name || '',
    phone: order.customer?.phone || '',
    email: order.customer?.email || ''
  };

  const { data: customer, error: customerError } = await supabase.from('customers').insert(customerPayload).select('*').single();
  if (customerError) throw customerError;

  const addressPayload = {
    customer_id: customer.id,
    ...parseAddressParts(order.customer?.address || '')
  };

  const { data: address, error: addressError } = await supabase.from('addresses').insert(addressPayload).select('*').single();
  if (addressError) throw addressError;

  const orderPayload = {
    order_no: order.id,
    customer_id: customer.id,
    address_id: address.id,
    status: order.status || 'Pending',
    subtotal: toNumber(order.totals?.subtotal),
    shipping: toNumber(order.totals?.shipping),
    total: toNumber(order.totals?.total),
    admin_note: order.admin?.note || '',
    tracking_no: order.admin?.trackingNo || ''
  };

  const { data: createdOrder, error: createOrderError } = await supabase
    .from('orders')
    .upsert(orderPayload, { onConflict: 'order_no' })
    .select('*')
    .single();
  if (createOrderError) throw createOrderError;

  const paymentPayload = {
    order_id: createdOrder.id,
    method: order.payment?.method || order.paymentMethod || '',
    status: order.status === 'Completed' ? 'paid' : 'pending',
    reference_no: order.payment?.referenceNo || null,
    paid_at: order.payment?.timestamp || new Date().toISOString(),
    payload: order.payment || null
  };

  const { error: paymentError } = await supabase.from('payments').insert(paymentPayload);
  if (paymentError) throw paymentError;

  const itemsPayload = (order.items || []).map((item) => ({
    order_id: createdOrder.id,
    product_id: item.id || '',
    product_name: item.name || '',
    product_image: item.image || '',
    unit_price: toNumber(item.price),
    quantity: toNumber(item.quantity),
    line_total: toNumber(item.price) * toNumber(item.quantity)
  }));

  if (itemsPayload.length > 0) {
    const { error: itemsError } = await supabase.from('order_items').insert(itemsPayload);
    if (itemsError) throw itemsError;
  }

  return getOrderById(order.id);
};

export const updateOrderById = async (appOrderId, patch) => {
  if (!appOrderId) throw new Error('Missing appOrderId');

  if (!isSupabaseEnabled || !supabase) {
    const orders = getLocalOrders();
    const next = orders.map((order) => (order.id === appOrderId ? { ...order, ...patch } : order));
    setLocalOrders(next);
    return next.find((order) => order.id === appOrderId) || null;
  }

  const { data: orderRow, error: orderFetchError } = await supabase
    .from('orders')
    .select('*')
    .eq('order_no', appOrderId)
    .maybeSingle();

  if (orderFetchError) throw orderFetchError;
  if (!orderRow) return null;

  const orderPatch = {};
  if (patch.status !== undefined) orderPatch.status = patch.status;
  if (patch.admin?.note !== undefined) orderPatch.admin_note = patch.admin.note;
  if (patch.admin?.trackingNo !== undefined) orderPatch.tracking_no = patch.admin.trackingNo;

  if (Object.keys(orderPatch).length > 0) {
    const { error: orderUpdateError } = await supabase.from('orders').update(orderPatch).eq('id', orderRow.id);
    if (orderUpdateError) throw orderUpdateError;
  }

  if (patch.customer) {
    const customerPatch = {};
    if (patch.customer.name !== undefined) customerPatch.full_name = patch.customer.name;
    if (patch.customer.phone !== undefined) customerPatch.phone = patch.customer.phone;
    if (patch.customer.email !== undefined) customerPatch.email = patch.customer.email;

    if (Object.keys(customerPatch).length > 0 && orderRow.customer_id) {
      const { error: customerUpdateError } = await supabase.from('customers').update(customerPatch).eq('id', orderRow.customer_id);
      if (customerUpdateError) throw customerUpdateError;
    }

    if (patch.customer.address !== undefined && orderRow.address_id) {
      const nextAddress = parseAddressParts(patch.customer.address || '');
      const { error: addressUpdateError } = await supabase
        .from('addresses')
        .update(nextAddress)
        .eq('id', orderRow.address_id);
      if (addressUpdateError) throw addressUpdateError;
    }
  }

  return getOrderById(appOrderId);
};

export const deleteOrderById = async (appOrderId) => {
  if (!appOrderId) return;

  if (!isSupabaseEnabled || !supabase) {
    const next = getLocalOrders().filter((order) => order.id !== appOrderId);
    setLocalOrders(next);
    return;
  }

  const { data: orderRow, error: orderFetchError } = await supabase
    .from('orders')
    .select('id, customer_id, address_id')
    .eq('order_no', appOrderId)
    .maybeSingle();

  if (orderFetchError) throw orderFetchError;
  if (!orderRow) return;

  await supabase.from('order_items').delete().eq('order_id', orderRow.id);
  await supabase.from('payments').delete().eq('order_id', orderRow.id);

  const { error: orderDeleteError } = await supabase.from('orders').delete().eq('id', orderRow.id);
  if (orderDeleteError) throw orderDeleteError;

  // Best effort clean-up for orphan records.
  if (orderRow.address_id) {
    await supabase.from('addresses').delete().eq('id', orderRow.address_id);
  }
  if (orderRow.customer_id) {
    await supabase.from('customers').delete().eq('id', orderRow.customer_id);
  }
};

export const clearOrders = async () => {
  if (!isSupabaseEnabled || !supabase) {
    setLocalOrders([]);
    return;
  }

  const { data: orderRows, error: orderRowsError } = await supabase.from('orders').select('id, customer_id, address_id');
  if (orderRowsError) throw orderRowsError;

  const orderIds = (orderRows || []).map((row) => row.id);
  const customerIds = [...new Set((orderRows || []).map((row) => row.customer_id).filter(Boolean))];
  const addressIds = [...new Set((orderRows || []).map((row) => row.address_id).filter(Boolean))];

  if (orderIds.length > 0) {
    await supabase.from('order_items').delete().in('order_id', orderIds);
    await supabase.from('payments').delete().in('order_id', orderIds);
  }

  await supabase.from('orders').delete().not('id', 'is', null);

  if (addressIds.length > 0) {
    await supabase.from('addresses').delete().in('id', addressIds);
  }
  if (customerIds.length > 0) {
    await supabase.from('customers').delete().in('id', customerIds);
  }
};
