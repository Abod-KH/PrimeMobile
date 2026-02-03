

const ContactPage = () => {
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <p className="mb-6 text-gray-600">
        We’d love to hear from you. Please fill out the form below and we’ll
        get back to you as soon as possible.
      </p>

      <form className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"

            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Your email"

            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shop_dark_green"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Your message..."

            rows={5}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-shop_dark_green resize-none"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-shop_dark_green hover:bg-shop_light_green text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-200"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};


export default ContactPage;