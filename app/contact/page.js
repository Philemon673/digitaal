"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-[#111638] text-whit py-16 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
        
        {/* Left Section */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">
            Contact <span className="text-orange-500">Us</span>
          </h1>
          <p className="text-gray-300 leading-relaxed">
            Have questions about your order, selling products, or anything else?
            Our support team is here to help. Reach out anytime and we’ll get 
            back to you shortly.
          </p>

          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-orange-500" />
              <p className="text-gray-300">support@digitail.com</p>
            </div>

            <div className="flex items-center gap-4">
              <Phone className="w-6 h-6 text-orange-500" />
              <p className="text-gray-300">+1 (800) 123-4567</p>
            </div>

            <div className="flex items-center gap-4">
              <MapPin className="w-6 h-6 text-orange-500" />
              <p className="text-gray-300">Accra, Ghana</p>
            </div>
          </div>
        </div>

        {/* Right Section – Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white text-[#111638] rounded-xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold">Your Name</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full p-3 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Message</label>
              <textarea
                name="message"
                required
                value={form.message}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-orange-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-orange-600 transition"
          >
            <Send className="w-5 h-5" />
            Send Message
          </button>

          {submitted && (
            <p className="text-green-600 text-sm mt-4">
              Message sent successfully!
            </p>
          )}
        </form>
      </div>
    </div>
    <Footer />
    </>
  );
}
