import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import { getError } from '../../utils/error';
import moment from 'moment';
import Sidebar from './components/sidebar';
import Loading from './components/Loading';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

export default function AdminOrderScreen() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/admin/orders`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title="Admin Order">
      <Sidebar />
      <div className="grid md:grid-cols-2 md:gap-5">
        <div className="overflow-x-auto md:col-span-3">
          <h1 className="pl-20 mb-4 text-xl">Orders</h1>

          {loading ? (
            <Loading />
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-center">ID</th>
                    <th className="p-5 text-center">USER</th>
                    <th className="p-5 text-center">DATE</th>
                    <th className="p-5 text-center">TOTAL</th>
                    <th className="p-5 text-center">PAID</th>
                    <th className="p-5 text-center">DELIVERED</th>
                    <th className="p-5 text-center">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b">
                      <td className="p-5 text-center">
                        {order._id.substring(20, 24)}
                      </td>
                      <td className="p-5 text-center">
                        {order.user ? order.user.name : 'DELETED USER'}
                      </td>
                      <td className="p-5 text-center">
                        {moment(order.createdAt).calendar()}
                      </td>
                      <td className="p-5 text-center">RM{order.totalPrice}</td>
                      <td className="p-5 text-center">
                        {order.isPaid
                          ? `${moment(order.paidAt).calendar()}`
                          : 'Not paid'}
                      </td>
                      <td className="p-5 text-center">
                        {order.isDelivered
                          ? `${moment(order.deliveredAt).calendar()}`
                          : 'Not delivered'}
                      </td>
                      <td className="p-5 text-center">
                        <Link href={`/order/${order._id}`} passHref>
                          <a>Details</a>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
