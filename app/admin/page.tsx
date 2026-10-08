
'use client'

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faTrash,
  faPencil,
  faPlus,
  faXmark,
  faShieldHalved,
  faBoxOpen,
  faUsers,
  faReceipt
} from "@fortawesome/free-solid-svg-icons";

const API_BASE_URL = "https://electro-backend-2dx5.onrender.com"

type AdminProduct = {
  id: number;
  name: string;
  price: number;
  con: number;
  stat: boolean;
  imgs: string[];
}

type AdminUser = {
  id: number;
  name: string;
  emil: string;
  is_admin: boolean;
}

type OrderStatus = 'Delivered' | 'Shipped' | 'Pending'

type AdminOrder = {
  id: number;
  customer: string;
  product: string;
  qty: number;
  status: OrderStatus;
}

export default function AdminDashboard() {
  const router = useRouter()
  const [dark, setDark] = useState(false)
  const [checking, setChecking] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [tab, setTab] = useState<'products' | 'users' | 'orders'>('products')

  const [products, setProducts] = useState<AdminProduct[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [orders, setOrders] = useState<AdminOrder[]>([])

  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [creatingProduct, setCreatingProduct] = useState(false)

  // ---- Auth gate ----
  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setChecking(false)
      setAuthorized(false)
      return
    }

    fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAuthorized(true)
          setUsers(data)
        } else {
          setAuthorized(false)
        }

        setChecking(false)
      })
      .catch(() => {
        setAuthorized(false)
        setChecking(false)
      })
  }, [])

  useEffect(() => {
    if (!authorized) return
    loadProducts()
  }, [authorized])

  async function getData() {
    const result = await fetch(`${API_BASE_URL}/admin/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.log('Error'))
  }

  function loadProducts() {
    const token = localStorage.getItem('token')

    fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data)
      })
  }

  function loadUsers() {
    const token = localStorage.getItem('token')

    fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setUsers(data)
      })
  }

  // ---- Users actions ----

  async function toggleAdmin(user: AdminUser) {
    const token = localStorage.getItem('token')

    await fetch(`${API_BASE_URL}/admin/users/update`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        user_id: user.id,
        is_admin: !user.is_admin
      })
    })

    loadUsers()
  }

  async function deleteUser(id: number) {
    const token = localStorage.getItem('token')

    await fetch(`${API_BASE_URL}/admin/users/delete`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        user_id: id
      })
    })

    loadUsers()
  }

  // ---- Products actions ----

  async function deleteProduct(id: number) {
    const token = localStorage.getItem('token')

    await fetch(`${API_BASE_URL}/admin/products/delete`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        pro_id: id
      })
    })

    loadProducts()
  }

  async function saveProduct(
    p: {
      id?: number;
      name: string;
      price: number;
      con: number;
      stat: boolean
    }
  ) {
    const token = localStorage.getItem('token')

    if (p.id) {
      await fetch(`${API_BASE_URL}/admin/products/update`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          pro_id: p.id,
          name: p.name,
          price: p.price,
          contity: p.con,
          stats: p.stat
        })
      })
    } else {
      await fetch(`${API_BASE_URL}/admin/products/create`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          name: p.name,
          price: p.price,
          contity: p.con,
          stats: p.stat
        })
      })
    }

    setEditingProduct(null)
    setCreatingProduct(false)
    loadProducts()
  }

  function statusClass(s: OrderStatus) {
    if (s === 'Delivered') {
      return dark
        ? "bg-green-500/15 text-green-400"
        : "bg-green-500/10 text-green-600"
    }

    if (s === 'Shipped') {
      return dark
        ? "bg-blue-500/15 text-blue-400"
        : "bg-blue-500/10 text-blue-600"
    }

    return dark
      ? "bg-amber-500/15 text-amber-400"
      : "bg-amber-500/10 text-amber-600"
  }

  const tabBtn = (active: boolean) =>
    `flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
      active
        ? (dark
          ? 'bg-white text-black font-medium'
          : 'bg-black text-white font-medium')
        : (dark
          ? 'text-white/50'
          : 'text-black/50')
    }`

  // ---- Loading / unauthorized states ----

  if (checking) {
    return (
      <div className="min-h-screen w-full bg-black flex items-center justify-center text-white">
        Checking access…
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center text-white gap-4">
        <FontAwesomeIcon
          icon={faShieldHalved}
          className="text-5xl text-white/20"
        />

        <p className="text-lg font-semibold">
          Access denied
        </p>

        <p className="text-sm text-white/50">
          You don't have permission to view this page.
        </p>

        <button
          onClick={() => router.push('/prodacts')}
          className="mt-2 bg-white text-black text-sm font-medium rounded-xl px-5 py-2.5"
        >
          Back to store
        </button>
      </div>
    )
  }

  return (
    <div
      className={`${
        dark
          ? "bg-neutral-950 text-white"
          : "bg-slate-50 text-black"
      } w-full min-h-screen transition-colors duration-300`}
    >

      <header
        className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
          dark
            ? "bg-black/80 backdrop-blur-md border-white/10"
            : "bg-white/80 backdrop-blur-md border-black/10"
        }`}
      >
        <div className="flex flex-row justify-between items-center px-5 h-16">

          <div className="flex items-center gap-3">

            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                dark ? "bg-white" : "bg-black"
              }`}
            >
              <FontAwesomeIcon
                icon={faShieldHalved}
                className={
                  dark
                    ? "text-black text-sm"
                    : "text-white text-sm"
                }
              />
            </div>

            <span className="font-extrabold text-xl tracking-tight">
              Admin
            </span>

          </div>

          <button
            onClick={() => setDark(!dark)}
            className={`transition-colors cursor-pointer ${
              dark
                ? "text-white/70 hover:text-white"
                : "text-black/60 hover:text-black"
            }`}
          >
            <FontAwesomeIcon icon={dark ? faSun : faMoon} />
          </button>

        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-10">

        <div className="flex gap-1 mb-8 bg-black/5 dark:bg-white/5 rounded-xl p-1 w-fit">

          <button
            onClick={() => setTab('products')}
            className={tabBtn(tab === 'products')}
          >
            <FontAwesomeIcon icon={faBoxOpen} />
            Products
          </button>

          <button
            onClick={() => setTab('users')}
            className={tabBtn(tab === 'users')}
          >
            <FontAwesomeIcon icon={faUsers} />
            Users
          </button>

          <button
            onClick={() => {
              setTab('orders')
              getData()
            }}
            className={tabBtn(tab === 'orders')}
          >
            <FontAwesomeIcon icon={faReceipt} />
            Orders
          </button>

        </div>

        {tab === 'products' && (
          <div>

            <div className="flex justify-between items-center mb-4">

              <h1 className="text-2xl font-bold">
                Products
              </h1>

              <button
                onClick={() => setCreatingProduct(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer ${
                  dark
                    ? "bg-white text-black hover:bg-slate-200"
                    : "bg-black text-white hover:bg-slate-800"
                }`}
              >
                <FontAwesomeIcon icon={faPlus} />
                New product
              </button>

            </div>

            <div
              className={`rounded-2xl overflow-hidden ${
                dark ? "bg-neutral-900" : "bg-white"
              }`}
            >

              <table className="w-full text-sm">

                <thead>
                  <tr
                    className={`text-left ${
                      dark
                        ? "text-white/40 border-b border-white/10"
                        : "text-black/40 border-b border-black/10"
                    }`}
                  >
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Price</th>
                    <th className="px-5 py-3 font-medium">Stock</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {products.map((p) => (
                    <tr
                      key={p.id}
                      className={
                        dark
                          ? "border-b border-white/5"
                          : "border-b border-black/5"
                      }
                    >

                      <td className="px-5 py-3">
                        {p.name}
                      </td>

                      <td className="px-5 py-3">
                        {p.price.toLocaleString()} EGP
                      </td>

                      <td className="px-5 py-3">
                        {p.con}
                      </td>

                      <td className="px-5 py-3">

                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            p.stat
                              ? (
                                dark
                                  ? "bg-white/10 text-white"
                                  : "bg-black/5 text-black"
                              )
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {p.stat ? "Active" : "Hidden"}
                        </span>

                      </td>

                      <td className="px-5 py-3 text-right">

                        <button
                          onClick={() => setEditingProduct(p)}
                          className={`mr-3 transition-colors cursor-pointer ${
                            dark
                              ? "text-white/50 hover:text-white"
                              : "text-black/40 hover:text-black"
                          }`}
                        >
                          <FontAwesomeIcon icon={faPencil} />
                        </button>

                        <button
                          onClick={() => deleteProduct(p.id)}
                          className={`transition-colors cursor-pointer ${
                            dark
                              ? "text-white/50 hover:text-red-400"
                              : "text-black/40 hover:text-red-500"
                          }`}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}

        {tab === 'users' && (
          <div>

            <h1 className="text-2xl font-bold mb-4">
              Users
            </h1>

            <div
              className={`rounded-2xl overflow-hidden ${
                dark ? "bg-neutral-900" : "bg-white"
              }`}
            >

              <table className="w-full text-sm">

                <thead>
                  <tr
                    className={`text-left ${
                      dark
                        ? "text-white/40 border-b border-white/10"
                        : "text-black/40 border-b border-black/10"
                    }`}
                  >
                    <th className="px-5 py-3 font-medium">
                      Name
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Email
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Role
                    </th>

                    <th className="px-5 py-3 font-medium text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className={
                        dark
                          ? "border-b border-white/5"
                          : "border-b border-black/5"
                      }
                    >

                      <td className="px-5 py-3">
                        {u.name}
                      </td>

                      <td className="px-5 py-3">
                        {u.emil}
                      </td>

                      <td className="px-5 py-3">

                        <button
                          onClick={() => toggleAdmin(u)}
                          className={`text-xs px-2 py-1 rounded-full cursor-pointer transition-colors ${
                            u.is_admin
                              ? (
                                dark
                                  ? "bg-white text-black"
                                  : "bg-black text-white"
                              )
                              : (
                                dark
                                  ? "bg-white/10 text-white/60 hover:bg-white/20"
                                  : "bg-black/5 text-black/50 hover:bg-black/10"
                              )
                          }`}
                        >
                          {u.is_admin ? "Admin" : "Customer"}
                        </button>

                      </td>

                      <td className="px-5 py-3 text-right">

                        <button
                          onClick={() => deleteUser(u.id)}
                          className={`transition-colors cursor-pointer ${
                            dark
                              ? "text-white/50 hover:text-red-400"
                              : "text-black/40 hover:text-red-500"
                          }`}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}

        {tab === 'orders' && (
          <div>

            <h1 className="text-2xl font-bold mb-4">
              Orders
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">

              {[
                {
                  label: "Total orders",
                  value: orders.length
                },
                {
                  label: "Pending",
                  value: orders.filter(
                    o => o.status === 'Pending'
                  ).length
                },
                {
                  label: "Delivered",
                  value: orders.filter(
                    o => o.status === 'Delivered'
                  ).length
                },
              ].map((s) => (

                <div
                  key={s.label}
                  className={`rounded-2xl p-5 ${
                    dark
                      ? "bg-neutral-900"
                      : "bg-white"
                  }`}
                >

                  <div
                    className={`text-sm ${
                      dark
                        ? "text-white/40"
                        : "text-black/40"
                    }`}
                  >
                    {s.label}
                  </div>

                  <div className="text-3xl font-bold mt-1">
                    {s.value}
                  </div>

                </div>

              ))}

            </div>

            <div
              className={`rounded-2xl overflow-x-auto ${
                dark
                  ? "bg-neutral-900"
                  : "bg-white"
              }`}
            >

              <table className="w-full text-sm">

                <thead>

                  <tr
                    className={`text-left ${
                      dark
                        ? "text-white/40 border-b border-white/10"
                        : "text-black/40 border-b border-black/10"
                    }`}
                  >

                    <th className="px-5 py-3 font-medium">
                      Order
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Customer
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Product
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Qty
                    </th>

                    <th className="px-5 py-3 font-medium">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {orders.map((o) => (

                    <tr
                      key={o.id}
                      className={
                        dark
                          ? "border-b border-white/5"
                          : "border-b border-black/5"
                      }
                    >

                      <td className="px-5 py-3 font-medium">
                        #{o.id}
                      </td>

                      <td className="px-5 py-3">
                        {o.customer}
                      </td>

                      <td className="px-5 py-3">
                        {o.product}
                      </td>

                      <td className="px-5 py-3">
                        {o.qty}
                      </td>

                      <td className="px-5 py-3">

                        <span
                          className={`text-xs px-2 py-1 rounded-full ${statusClass(
                            o.status
                          )}`}
                        >
                          {o.status}
                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}

      </div>

      {(editingProduct || creatingProduct) && (
        <ProductModal
          dark={dark}
          product={editingProduct}
          onClose={() => {
            setEditingProduct(null)
            setCreatingProduct(false)
          }}
          onSave={saveProduct}
        />
      )}

    </div>
  )
}

function ProductModal({
  dark,
  product,
  onClose,
  onSave
}: {
  dark: boolean;
  product: AdminProduct | null;
  onClose: () => void;
  onSave: (
    p: {
      id?: number;
      name: string;
      price: number;
      con: number;
      stat: boolean
    }
  ) => void;
}) {

  const [name, setName] = useState(product?.name ?? '')
  const [price, setPrice] = useState(product?.price?.toString() ?? '')
  const [con, setCon] = useState(product?.con?.toString() ?? '')
  const [stat, setStat] = useState(product?.stat ?? true)

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">

      <div
        className={`w-full max-w-md rounded-2xl p-6 ${
          dark
            ? "bg-neutral-900 text-white"
            : "bg-white text-black"
        }`}
      >

        <div className="flex justify-between items-center mb-5">

          <h2 className="font-bold text-lg">
            {product ? "Edit product" : "New product"}
          </h2>

          <button
            onClick={onClose}
            className="cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>

        </div>

        <div className="flex flex-col gap-3">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product name"
            className={`rounded-xl p-3 outline-none border text-sm ${
              dark
                ? "bg-white/5 border-white/10 focus:border-white/60"
                : "border-black/10 focus:border-black"
            }`}
          />

          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            type="number"
            className={`rounded-xl p-3 outline-none border text-sm ${
              dark
                ? "bg-white/5 border-white/10 focus:border-white/60"
                : "border-black/10 focus:border-black"
            }`}
          />

          <input
            value={con}
            onChange={(e) => setCon(e.target.value)}
            placeholder="Stock quantity"
            type="number"
            className={`rounded-xl p-3 outline-none border text-sm ${
              dark
                ? "bg-white/5 border-white/10 focus:border-white/60"
                : "border-black/10 focus:border-black"
            }`}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={stat}
              onChange={(e) => setStat(e.target.checked)}
            />
            Active (visible in store)
          </label>

          <button
            onClick={() =>
              onSave({
                id: product?.id,
                name,
                price: Number(price),
                con: Number(con),
                stat
              })
            }
            className={`mt-2 py-3 rounded-xl font-medium text-sm cursor-pointer ${
              dark
                ? "bg-white text-black hover:bg-slate-200"
                : "bg-black text-white hover:bg-slate-800"
            }`}
          >
            {product ? "Save changes" : "Create product"}
          </button>

        </div>

      </div>

    </div>
  )
}
