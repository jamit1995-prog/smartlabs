import axios from 'axios';
import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import ClientDashboard from './ClientDashboard';

export default function SmartLabPortal() {
  
  const [email, setEmail] = useState('');   //CLIENT LOGIN UI
  const [password, setPassword] = useState('');   //CLIENT LOGIN UI
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

  const testBackend = async () => {
  const res = await axios.get('http://localhost:5000');
  alert(res.data);
};
const loginUser = async () => {
  console.log('Login payload:', { email, password });

  if (!email || !password) {
    alert('Please enter both email and password');
    return;
  }

  try {
    const res = await axios.post(
      'http://localhost:5000/api/auth/login',
      {
        email,
        password,
      }
    );

    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
    const user = res.data.user;
    setUser(user);

    if (user && user.role === 'admin') {
      alert('Admin Login Successful');
      setIsAdmin(true);
    } else {
      alert('Client Login Successful');
    }
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    alert(error.response?.data?.message || 'Login Failed');
  }
};

const handleLogout = () => {
  localStorage.removeItem('token');
  setUser(null);
  setToken('');
  setIsAdmin(false);
  setEmail('');
  setPassword('');
};

const addMaterial = async () => {   //Add Material UI
  await axios.post(
    'http://localhost:5000/api/materials/add',
    {
      name: 'PLA+',
      color: 'White',
      stock: 5,
      pricePerKg: 1200,
    }
  );

  alert('Material Added');
};
const bookSlot = async () => {
  await axios.post(
    'http://localhost:5000/api/bookings/create',
    {
      user: 'Amit',
      printer: 'Bambu Lab X1 Carbon',
      material: selectedMaterial,
      slot: selectedSlot,
      date: '2026-05-28',
    }
  );

  alert('Slot Booked Successfully');
};

const uploadFile = async (e) => { //File Upload Function
  const formData = new FormData();

  formData.append('file', e.target.files[0]);

  await axios.post(
    'http://localhost:5000/api/upload',
    formData
  );

  alert('File Uploaded');
};

  const [selectedSlot, setSelectedSlot] = useState('12:00 PM - 02:00 PM');
  const [selectedMaterial, setSelectedMaterial] = useState('PLA+');
  const [selectedColor, setSelectedColor] = useState('White');
  const [quote, setQuote] = useState(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const printers = [
    {
      name: 'Bambu Lab X1 Carbon',
      status: 'Printing',
      progress: 72,
      eta: '1h 18m',
      nozzle: '220°C',
      bed: '60°C',
      user: 'Medical Robotics Team',
    },
    {
      name: 'Bambu Lab P1S',
      status: 'Available',
      progress: 0,
      eta: '-',
      nozzle: '32°C',
      bed: '30°C',
      user: '-',
    },
    {
      name: 'Bambu Lab A1',
      status: 'Maintenance',
      progress: 0,
      eta: '-',
      nozzle: '0°C',
      bed: '0°C',
      user: 'Admin',
    },
  ];

  const materials = [
    {
      name: 'PLA+',
      colors: ['White', 'Black', 'Red', 'Grey'],
      stock: '2.4 KG',
      status: 'Available',
    },
    {
      name: 'PETG',
      colors: ['Black', 'Blue'],
      stock: '0.8 KG',
      status: 'Low Stock',
    },
    {
      name: 'TPU',
      colors: ['Red'],
      stock: '0 KG',
      status: 'Out of Stock',
    },
  ];

  const slots = [
    { time: '09:00 AM - 11:00 AM', status: 'Booked' },
    { time: '11:00 AM - 12:00 PM', status: 'Pending' },
    { time: '12:00 PM - 02:00 PM', status: 'Available' },
    { time: '02:00 PM - 04:00 PM', status: 'Available' },
    { time: '04:00 PM - 06:00 PM', status: 'Booked' },
    { time: '06:00 PM - 08:00 PM', status: 'Available' },
  ];

  const [uploadedFile, setUploadedFile] = useState(null);

  const generateQuote = () => {
    const amount = Math.floor(Math.random() * 5000) + 2500;
    setQuote(amount);
  };
if (user) {
  return user.role === 'admin' ? (
    <AdminDashboard user={user} onLogout={handleLogout} />
  ) : (
    <ClientDashboard user={user} token={token} onLogout={handleLogout} />
  );
}

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">LabSpace Smart Portal</h1>
            <p className="text-sm text-slate-400">Local Server Based Lab Infrastructure</p>
          </div>

          <nav className="hidden lg:flex gap-8 text-sm font-medium">
            <a href="#dashboard" className="hover:text-cyan-400">Dashboard</a>
            <a href="#printers" className="hover:text-cyan-400">Printers</a>
            <a href="#booking" className="hover:text-cyan-400">Booking</a>
            <a href="#quotation" className="hover:text-cyan-400">Quotation</a>
            <a href="#analytics" className="hover:text-cyan-400">Analytics</a>
          </nav>

          <button
            onClick={() => setShowAdminLogin(true)}
            className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-xl font-medium"
          >
            Admin Login
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full text-sm mb-6">
              Real-Time Bambu Lab Monitoring Enabled
            </div>

            <h2 className="text-5xl font-bold leading-tight">
              Smart Lab & Fabrication Management System
            </h2>

            <p className="mt-6 text-slate-300 text-lg leading-8">
              Manage equipment booking, Bambu Lab printer monitoring, fabrication quotations,
              slot scheduling, and digital manufacturing workflows from a centralized platform.
            </p>
            
            <div className="bg-slate-900 p-6 rounded-2xl text-white">

              <h2 className="text-2xl font-bold mb-5">
              Client Login
              </h2>

              <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl text-black mb-4"
              />

              <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl text-black mb-4"
              />

              <button
              onClick={loginUser}
              className="bg-cyan-500 px-5 py-3 rounded-xl"
             >
              Login
              </button>

            </div>

            <div className="mt-8 flex gap-4 flex-wrap">
              <button className="bg-cyan-500 hover:bg-cyan-600 px-6 py-3 rounded-xl font-medium">
                Book Equipment
              </button>

              <button className="border border-slate-600 hover:border-cyan-400 px-6 py-3 rounded-xl font-medium">
                Upload CAD File
              </button>
            </div>
          </div>

          <div className="bg-slate-950 rounded-3xl p-6 border border-slate-700 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Live Printer Status</h3>
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">
                Server Online
              </span>
            </div>

            <div className="space-y-5">
              {printers.map((printer, index) => (
                <div key={index} className="bg-slate-900 rounded-2xl border border-slate-700 p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lg">{printer.name}</h4>
                      <p className="text-slate-400 text-sm mt-1">Current User: {printer.user}</p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      printer.status === 'Available'
                        ? 'bg-green-500/20 text-green-400'
                        : printer.status === 'Printing'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {printer.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Progress</p>
                      <p>{printer.progress}%</p>
                    </div>

                    <div>
                      <p className="text-slate-400">ETA</p>
                      <p>{printer.eta}</p>
                    </div>

                    <div>
                      <p className="text-slate-400">Nozzle Temp</p>
                      <p>{printer.nozzle}</p>
                    </div>

                    <div>
                      <p className="text-slate-400">Bed Temp</p>
                      <p>{printer.bed}</p>
                    </div>
                  </div>

                  <div className="mt-4 w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400"
                      style={{ width: `${printer.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <section id="dashboard" className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-4 gap-6">
          {[
            ['42', 'Active Machines'],
            ['128', 'Registered Users'],
            ['24', 'Today Bookings'],
            ['312', 'Completed Prints'],
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-4xl font-bold text-cyan-600">{item[0]}</h3>
              <p className="mt-2 text-slate-500">{item[1]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Slot Availability */}
      <section id="booking" className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold">Slot Availability</h2>
                <p className="text-slate-500 mt-2">Real-time equipment scheduling</p>
              </div>

              <input
                type="date"
                className="border border-slate-300 rounded-xl px-4 py-3"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {slots.map((slot, index) => (
                <button
                  key={index}
                  disabled={slot.status === 'Booked'}
                  onClick={() => setSelectedSlot(slot.time)}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    slot.status === 'Booked'
                      ? 'bg-red-50 border-red-200 cursor-not-allowed'
                      : slot.status === 'Pending'
                      ? 'bg-amber-50 border-amber-200'
                      : selectedSlot === slot.time
                      ? 'bg-cyan-50 border-cyan-500'
                      : 'bg-green-50 border-green-200 hover:border-cyan-500'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{slot.time}</h4>
                      <p className="text-sm text-slate-500 mt-1">Bambu Lab X1 Carbon</p>
                    </div>

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        slot.status === 'Booked'
                          ? 'bg-red-100 text-red-700'
                          : slot.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {slot.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold mb-6">Material Selection</h3>

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Select Material
                  </label>

                  <select
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="mt-2 w-full border border-slate-300 rounded-xl px-4 py-3"
                  >
                    {materials.map((material, index) => (
                      <option key={index}>{material.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Select Color
                  </label>

                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="mt-2 w-full border border-slate-300 rounded-xl px-4 py-3"
                  >
                    {materials
                      .find((m) => m.name === selectedMaterial)
                      ?.colors.map((color, index) => (
                        <option key={index}>{color}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <h4 className="font-semibold mb-4">Live Material Inventory</h4>

                <div className="space-y-4 text-sm">
                  {materials.map((material, index) => (
                    <div
                      key={index}
                      className="border-b border-slate-200 pb-3 last:border-none"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{material.name}</span>

                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            material.status === 'Available'
                              ? 'bg-green-100 text-green-700'
                              : material.status === 'Low Stock'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {material.status}
                        </span>
                      </div>

                      <p className="text-slate-500 mt-1">
                        Stock: {material.stock}
                      </p>

                      <p className="text-slate-500 mt-1">
                        Colors: {material.colors.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold mb-6">Booking Summary</h3>

              <div className="space-y-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Equipment</span>
                  <span className="font-medium">Bambu Lab X1C</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Slot</span>
                  <span className="font-medium">{selectedSlot}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Material</span>
                  <span className="font-medium">{selectedMaterial}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Color</span>
                  <span className="font-medium">{selectedColor}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Cost</span>
                  <span className="font-medium">₹450</span>
                </div>
              </div>

              <button className="mt-8 w-full bg-cyan-500 hover:bg-cyan-600 text-white py-4 rounded-2xl font-medium">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="quotation" className="max-w-7xl mx-auto px-6 py-14">
        <div className="bg-white rounded-3xl border border-slate-200 p-10 shadow-sm">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold">Fabrication Quotation System</h2>

              <p className="mt-5 text-slate-600 leading-8">
                Upload STL, STEP, or 3MF files to automatically slice models using
                Bambu Studio CLI and generate real-time fabrication quotations,
                print time estimation, filament usage, and machine costing.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <p>Supports Bambu Studio exported files</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                  <p>Automatic slicing using Bambu Studio CLI</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <p>Automatic machine & material cost estimation</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <p>Admin approval workflow</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-10 text-center">
              <div className="w-20 h-20 bg-cyan-100 text-cyan-700 rounded-2xl mx-auto flex items-center justify-center text-3xl mb-6">
                ⬆
              </div>

              <h3 className="text-xl font-semibold">Upload Fabrication File</h3>

              <p className="text-slate-500 mt-3">
                Drag & drop STL / STEP / GCODE files.
              </p>

              <input
                type="file"
                accept=".stl,.3mf,.step"
                onChange={(e) => setUploadedFile(e.target.files[0])}
                className="mt-6 block w-full text-sm"
              />

              {uploadedFile && (
                <div className="mt-5 bg-white border border-slate-200 rounded-2xl p-5 text-left">
                  <h4 className="font-semibold text-slate-800 mb-3">
                    Uploaded File Analysis
                  </h4>

                  <div className="space-y-2 text-sm text-slate-600">
                    <p><strong>File:</strong> {uploadedFile.name}</p>
                    <p><strong>Slicer:</strong> Bambu Studio CLI</p>
                    <p><strong>Estimated Print Time:</strong> 6h 42m</p>
                    <p><strong>Material Usage:</strong> 182g</p>
                    <p><strong>Support Material:</strong> 24g</p>
                    <p><strong>Recommended Printer:</strong> Bambu Lab X1 Carbon</p>
                  </div>
                </div>
              )}

              <button
                onClick={generateQuote}
                className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-medium"
              >
                Generate Quote
              </button>

              {quote && (
                <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6 text-left">
                  <h4 className="font-semibold text-lg mb-4">Quotation Summary</h4>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Material Cost</span>
                      <span>₹1200</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Machine Runtime</span>
                      <span>₹850</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Operator Charges</span>
                      <span>₹500</span>
                    </div>

                    <div className="flex justify-between">
                      <span>GST</span>
                      <span>₹450</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-200 flex justify-between text-lg font-bold text-cyan-700">
                    <span>Total</span>
                    <span>₹{quote}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Analytics */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Admin Material Management</h2>
              <p className="text-slate-500 mt-2">
                Manage filament inventory, colors, pricing, and AMS allocation.
              </p>
            </div>

            <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-3 rounded-2xl font-medium">
              Add New Material
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="p-4">Material</th>
                  <th className="p-4">Available Colors</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Price/KG</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-4">PLA+</td>
                  <td className="p-4">White, Black, Red, Grey</td>
                  <td className="p-4">2.4 KG</td>
                  <td className="p-4">₹1200</td>
                  <td className="p-4 text-green-600 font-medium">Available</td>
                  <td className="p-4">
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm">
                      Update
                    </button>
                  </td>
                </tr>

                <tr className="border-b border-slate-200">
                  <td className="p-4">PETG</td>
                  <td className="p-4">Black, Blue</td>
                  <td className="p-4">0.8 KG</td>
                  <td className="p-4">₹1800</td>
                  <td className="p-4 text-amber-600 font-medium">Low Stock</td>
                  <td className="p-4">
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm">
                      Update
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="analytics" className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-bold mb-6">Machine Utilization</h3>

            <div className="space-y-5">
              {[
                ['Bambu Lab X1C', '92%'],
                ['Bambu Lab P1S', '68%'],
                ['Laser Cutter', '81%'],
                ['PCB CNC Machine', '54%'],
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2 text-sm">
                    <span>{item[0]}</span>
                    <span>{item[1]}</span>
                  </div>

                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500"
                      style={{ width: item[1] }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-bold mb-6">AMS Filament Status</h3>

            <div className="space-y-4">
              {[
                ['PLA+ White', '78%'],
                ['PETG Black', '46%'],
                ['ABS Grey', '29%'],
                ['TPU Flexible', '88%'],
              ].map((item, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-2xl p-5"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">{item[0]}</h4>
                    <span className="text-sm text-slate-500">{item[1]}</span>
                  </div>

                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: item[1] }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Admin Login Modal */}
{showAdminLogin && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-3xl w-96">
      <h2 className="text-2xl font-bold mb-5">
        Admin Login
      </h2>

      <input
        type="email"
        placeholder="Admin Email"
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-3 rounded-xl mb-4"
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-3 rounded-xl mb-4"
      />

      <div className="flex gap-3">
        <button
          onClick={loginUser}
          className="bg-cyan-500 text-white px-5 py-3 rounded-xl"
        >
          Login
        </button>

        <button
          onClick={() => setShowAdminLogin(false)}
          className="bg-slate-300 px-5 py-3 rounded-xl"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 mt-16">

        <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-white text-xl font-bold">LabSpace Smart Portal</h3>
            <p className="mt-4 text-sm leading-7">
              Advanced local-server-based smart lab management platform with
              Bambu Lab integration, equipment scheduling, quotation engine,
              and fabrication workflow management.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Modules</h4>
            <ul className="space-y-3 text-sm">
              <li>Equipment Booking</li>
              <li>Live Printer Monitoring</li>
              <li>Quotation System</li>
              <li>IoT Dashboard</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Technology Stack</h4>
            <ul className="space-y-3 text-sm">
              <li>React + Tailwind CSS</li>
              <li>Node.js Backend + Express API</li>
              <li>PostgreSQL Database</li>
              <li>Bambu Studio CLI Integration</li>
              <li>MQTT Printer Integration</li>
              <li>Bambu Studio CLI Auto Slicing</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 py-5 text-center text-sm text-slate-500">
          © 2026 LabSpace Smart Infrastructure System
        </div>
      </footer>
    </div>
  );
}
