import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const variants = {
  open: {
    y: 0,
    opacity: 1,
    display: 'block',
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    display: 'none',
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

export default function Nav() {
  return (
    <>
      <ul className="nav-ul">
        <motion.li
          variants={variants}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.1 }}
          className="nav-li"
        >
          <Link href="/admin/dashboard" exact={true}>
            <a>&#127968;Dashboard</a>
          </Link>
        </motion.li>
        <motion.li
          variants={variants}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.1 }}
          className="nav-li"
        >
          <Link href="/admin/orders">
            <a>&#128092;Orders</a>
          </Link>
        </motion.li>
        <motion.li
          variants={variants}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.1 }}
          className="nav-li"
        >
          <Link href="/admin/products">
            <a>&#128095;Product</a>
          </Link>
        </motion.li>
        <motion.li
          variants={variants}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.1 }}
          className="nav-li"
        >
          <Link href="/admin/users">
            <a>&#128100;Users</a>
          </Link>
        </motion.li>
      </ul>
    </>
  );
}
