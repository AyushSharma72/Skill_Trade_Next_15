"use client";
import React, { useState } from "react";
import { FaGithub, FaEnvelope, FaLinkedin } from "react-icons/fa";
import dynamic from "next/dynamic";
import {Button} from "../../components/ui/button"
import toast, {Toaster} from "react-hot-toast"
import Image from "next/image"

const Footer = dynamic(() => import("../_components/Footer"), { ssr: false });


const ContactForm = () => {
  const [Name, SetName] = useState("");
  const [Email, SetEmail] = useState("");
  const [Message, SetMessage] = useState("");
  const [loading, Setloading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      Setloading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/SubmitUserQueryForm`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ Name, Email, Message }),
        }
      );
      if (response.status === 200) {
        toast.success("We received your query");
        SetName("");
        SetEmail("");
        SetMessage("");
      } else {
        toast.error("Please try after some time");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      Setloading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      {" "}
      <h1 className="text-4xl font-bold text-gray-800 mt-8 text-center">
        Get in Touch
      </h1>
      <p className="text-gray-600 text-lg mb-6 text-center">
        We are here for you. How can we help?
      </p>
      <form onSubmit={handleSubmit} className=" rounded-lg p-6 w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium">
            Name
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="name"
            required
            placeholder="Enter your name"
            value={Name}
            onChange={(e) => SetName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium">
            Email
          </label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="email"
            required
            placeholder="Enter your email"
            value={Email}
            onChange={(e) => SetEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-700 font-medium">
            Message
          </label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none "
            id="message"
            rows="4"
            required
            placeholder="Go ahead! We are listening..."
            value={Message}
            onChange={(e) => SetMessage(e.target.value)}
          ></textarea>
        </div>
        <Button
          type="submit"
          className="w-full  font-bold py-2 rounded-lg"
          disabled={loading}
        >
          {loading ? "Sending..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

const Contact = () => {
  return (
    <>
      <div className="flex flex-col items-center w-full px-4 mt-8 mb-4">
        <Toaster />
        <div className="flex flex-wrap justify-center gap-8 sm:w-3/4 p-3 bg-white shadow-lg mt-3">
          <ContactForm />
          <div className="flex flex-col p-3 rounded-lg">
            <Image
              src="/contacus.jpg"
              className="w-80 rounded-lg shadow-lg"
              alt="Contact Us"
              width={400}
              height={200}
            />
            <p className="text-xl font-semibold mt-4 mb-2 text-center">
              Contact us
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:asharma7588@gmail.com"
                className=" text-lg flex items-center mt-2"
              >
                <FaEnvelope className="text-xl mr-2" /> asharma7588@gmail.com
              </a>

              <a
                href="mailto:Mohitsinghtadhiyal8@gmail.com"
                className=" text-lg flex items-center mt-2"
              >
                <FaEnvelope className="text-xl mr-2" />{" "}
                Mohitsinghtadhiyal8@gmail.com
              </a>

              <div className=" text-lg flex items-center mt-2">
                <a
                  href="https://www.linkedin.com/in/ayush-sharma-a155a8267"
                  target="blank"
                  className="flex"
                >
                  <FaLinkedin className="text-2xl mr-2" /> Ayush Sharma
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* developed by  */}

        <p className="text-2xl font-bold text-gray-800 mt-10">Developed By</p>
        <div className="flex flex-col items-center mt-4">
          <Image
            src="/Ayush2.jpg"
            alt="Ayush Sharma"
            className="w-32 h-32 rounded-full object-cover shadow-lg mb-4"
            width={200}
            height={200}
          />
          <p className="text-lg font-semibold">Ayush Sharma</p>
          <p className="text-gray-600">Developer and Project Manager</p>
          <div className="flex mt-4 space-x-4">
            <a
              href="https://github.com/AyushSharma72"
              target="_blank"
              className="bg-gray-800 text-white p-3 rounded-full"
            >
              <FaGithub className="text-2xl" />
            </a>
            <a
              href="mailto:asharma7588@gmail.com"
              className="bg-red-500 text-white p-3 rounded-full"
            >
              <FaEnvelope className="text-2xl" />
            </a>
            <a
              href="https://www.linkedin.com/in/ayush-sharma-a155a8267"
              target="_blank"
              className="bg-blue-700 text-white p-3 rounded-full"
            >
              <FaLinkedin className="text-2xl" />
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
