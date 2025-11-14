'use screen'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export default function AboutPage() {
  return (
    <>
     <Navbar />
    <div className="min-h-screen bg-[#111638] text-white py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            About <span className="text-orange-500">Us</span>
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Building a modern marketplace where buyers and sellers connect with trust,
            transparency, and innovation.  
          </p>
        </div>

        {/* Mission Section */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 classmain="text-3xl font-semibold mb-4 text-orange-500">
              Our Mission
            </h2>
            <p className="text-gray-300 leading-relaxed">
              At DigiTail, our mission is to empower individuals and businesses by
              providing a simple, secure, and highly efficient platform for selling
              and purchasing products.  
              <br /><br />
              We believe in creating opportunities, supporting small businesses, and 
              offering buyers access to quality goods at fair prices.
            </p>
          </div>

          <div className="bg-white/5 p-6 rounded-xl shadow-lg">
            <img
              src="/team.jpg"
              alt="Our Team"
              className="rounded-xl object-cover w-full h-72 shadow-md"
            />
          </div>
        </section>

        {/* Values Section */}
        <section className="space-y-12">
          <h2 className="text-3xl font-semibold text-orange-500 text-center">
            Our Core Values
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Value Card */}
            <div className="bg-white/5 p-6 rounded-xl shadow-lg hover:bg-white/10 transition">
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-300">
                We continuously evolve to bring modern solutions
                that enhance online shopping and selling.
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-xl shadow-lg hover:bg-white/10 transition">
              <h3 className="text-xl font-semibold mb-3">Trust</h3>
              <p className="text-gray-300">
                Every order, transaction, and interaction is secure,
                transparent, and protected.
              </p>
            </div>

            <div className="bg-white/5 p-6 rounded-xl shadow-lg hover:bg-white/10 transition">
              <h3 className="text-xl font-semibold mb-3">Community</h3>
              <p className="text-gray-300">
                We support both small sellers and buyers,
                building a strong, inclusive marketplace.
              </p>
            </div>
          </div>
        </section>

        {/* Promise Section */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-semibold text-orange-500">
            Our Promise to You
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Whether you are buying your first product or selling your hundredth item,
            DigiTail guarantees a seamless experience.  
            We remain committed to excellence, customer satisfaction,
            and continuous improvement.
          </p>
        </section>

      </div>
    </div>
    <Footer />
    </>
  );
}
