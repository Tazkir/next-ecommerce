import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';
import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import Product from '../../models/Product';
import db from '../../utils/db';
import { Store } from '../../utils/Store';
import { Rating } from '@mui/material';
import { motion } from 'framer-motion';

export default function ProductScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);

  if (!product) {
    return <Layout title="Produt Not Found">Produt Not Found</Layout>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    toast.success('Product added in the cart');
  };

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">Back</Link>
      </div>
      <div className="grid md:grid-cols-3 md:gap-5">
        <motion.div
          className="md:col-span-2 pb-10"
          animate={{
            opacity: [0, 1],
          }}
          transition={{ duration: 1, type: 'tween' }}
        >
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
            quality="100"
          ></Image>
        </motion.div>
        <div className="card p-5">
          <ul className="flex flex-col place-items-center">
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li className="text-sm">Category: {product.category}</li>
            <li className="text-sm">Brand: {product.brand}</li>
            <li>
              <Rating value={product.rating} readOnly></Rating>
            </li>
            <li className="text-sm">Description: {product.description}</li>
          </ul>
          <div className="pt-10">
            <div className="p-5 max-w-sm rounded overflow-hidden shadow-lg">
              <div className="mb-2 flex justify-between">
                <div>Price</div>
                <div>RM {product.price}</div>
              </div>
              <div className="mb-2 flex justify-between">
                <div>Status</div>
                <div>
                  {product.countInStock > 0 ? 'In stock' : 'Out of stock'}
                </div>
              </div>
              <button
                className="primary-button w-full"
                onClick={addToCartHandler}
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
