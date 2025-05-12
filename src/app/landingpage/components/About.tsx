'use client';

import React from "react";
import { motion } from 'framer-motion';
import Image from "next/image";

const About = () => (
  <motion.section
    id="about"
    className="w-full py-6 md:py-12 lg:py-16" // mas maliit na padding
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="container px-4 md:px-6">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <motion.div
          className="space-y-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <section
            id="about"
            className="flex flex-col md:flex-row items-center justify-center p-0 my-4 max-w-7xl mx-auto bg-transparent shadow-none rounded-none" // mas maliit na margin-y
          >
            {/* Logo with white background and circular shape */}
            <div className="flex-shrink-0 mb-8 md:mb-0 md:mr-20 flex justify-center items-center bg-white p-6 rounded-full"> {/* Adjusted margin-bottom */}
              <Image
                src="https://ueagmtscbdirqgbjxaqb.supabase.co/storage/v1/object/public/elathala-logo//logo.png"
                alt="E-Lathala Logo"
                className="w-80 h-80 object-contain"
              />
            </div>
            {/* About Us text */}
            <div className="text-center md:text-center flex-1 flex flex-col justify-center items-center md:items-center">
              <h2 className="text-5xl font-extrabold mb-6 text-sky-950 drop-shadow">
                About Us
              </h2>
              <p className="text-black text-xl max-w-2xl leading-relaxed">
                <span className="font-semibold text-[#0074B7]">iWrite</span> is a web-based writing platform that helps you build consistent writing habits through gamification. Earn experience points, unlock badges, and track your progress as you complete writing challenges and prompts.
                <br /><br />
                Whether you're a student, writer, or professional, <span className="font-semibold text-[#0074B7]">iWrite</span> makes writing fun, interactive, and rewarding.
              </p>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  </motion.section>
);

export default About;
