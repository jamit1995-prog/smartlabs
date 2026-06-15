import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <div className="bg-slate-900 text-white px-8 py-5 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-cyan-400">
            Smart Lab Admin Dashboard
          </h1>
          <p className="text-slate-400">
            Lab Management & Monitoring System
          </p>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.reload();
          }}
          className="bg-red-500 px-5 py-2 rounded-xl"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 p-8">

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-3xl font-bold text-cyan-600">128</h3>
          <p>Total Users</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-3xl font-bold text-green-600">24</h3>
          <p>Bookings Today</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-3xl font-bold text-orange-600">12</h3>
          <p>Pending Quotes</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-3xl font-bold text-blue-600">3</h3>
          <p>Active Printers</p>
        </div>

      </div>

      {/* Material Management */}
      <div className="px-8">

        <div className="bg-white rounded-3xl p-8 shadow">

          <div className="flex justify-between mb-6">

            <h2 className="text-2xl font-bold">
              Material Management
            </h2>

            <button className="bg-cyan-500 text-white px-5 py-3 rounded-xl">
              Add Material
            </button>

          </div>

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="p-3 text-left">Material</th>
                <th className="p-3 text-left">Colors</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Price/KG</th>
                <th className="p-3 text-left">Action</th>

              </tr>

            </thead>

            <tbody>

              <tr className="border-b">

                <td className="p-3">PLA+</td>
                <td className="p-3">White, Black</td>
                <td className="p-3">2.4 KG</td>
                <td className="p-3">₹1200</td>

                <td className="p-3">
                  <button className="bg-slate-900 text-white px-4 py-2 rounded-xl">
                    Update
                  </button>
                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}