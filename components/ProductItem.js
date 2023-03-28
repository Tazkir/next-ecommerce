import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className="card card-pro z-1">
      <Link href={`/product/${product.slug}`}>
        <motion.a
          animate={{
            opacity: [0, 1],
          }}
          transition={{ duration: 1, type: 'tween' }}
          style={{ cursor: 'pointer' }}
        >
          <Image
            width="100%"
            height="100%"
            layout="responsive"
            quality="100"
            src={product.image}
            alt={product.name}
            className="rounded shadow"
          />
        </motion.a>
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.slug}`}>
          <a>
            <h2 className="text-lg">{product.name}</h2>
          </a>
        </Link>
        <p className="mb-2">{product.brand}</p>
        <p>RM {product.price}</p>
        <button
          className="primary-button md:h-10 w-2/2 text-sm"
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
