import { signOut, useSession } from 'next-auth/react';
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Cookies from 'js-cookie';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import CartScreen from '../pages/cart';
import { ShoppingCartIcon } from '@heroicons/react/outline';
import { Store } from '../utils/Store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Menu } from '@headlessui/react';
import DropdownLink from './DropdownLink';

export default function Layout({ title, children }) {
  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };

  const [close, setClose] = useState({
    top: false,
    bottom: false,
    left: false,
    right: false,
  });
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setClose({ ...close, [anchor]: open });
  };

  return (
    <>
      <Head>
        <title>{title ? title + ' - Ecommerce' : 'Ecommerce'}</title>
        <meta name="description" content="Ecommerce Website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ToastContainer
        pauseOnHover={false}
        position="top-center"
        autoClose={500}
        limit={3}
      />

      <div className="flex min-h-screen flex-col justify-between ">
        <header>
          <nav className="flex h-12 items-center px-4 justify-between shadow-md">
            <Link href="/">
              <a className="text-lg font-bold">Ecommerce.</a>
            </Link>
            <div className="flex flex-row place-items-center">
              {cartItemsCount > 0 && (
                <span className="rounded-full py-1 px-2 bg-red-500 text-xs font-bold text-white">
                  {cartItemsCount}
                </span>
              )}
              <ShoppingCartIcon
                className="w-6 h-6 mr-2 z-30 hover:cursor-pointer"
                onClick={toggleDrawer('bottom', true)}
              />
              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-blue-600">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="z-10 absolute right-0 w-56 origin-top-right bg-white  shadow-lg ">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/order-history"
                      >
                        Order History
                      </DropdownLink>
                    </Menu.Item>
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink
                          className="dropdown-link"
                          href="/admin/dashboard"
                        >
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <a
                        className="dropdown-link"
                        href="#"
                        onClick={logoutClickHandler}
                      >
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login">
                  <a className="p-2">Login</a>
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex h-10 justify-center items-center shadow-inner">
          <p>Copyright © 2022 Ecommerce</p>
        </footer>
      </div>
      <SwipeableDrawer
        anchor={'bottom'}
        open={close['bottom']}
        onClose={toggleDrawer('bottom', false)}
        onOpen={toggleDrawer('bottom', true)}
      >
        <CartScreen />
      </SwipeableDrawer>
    </>
  );
}
