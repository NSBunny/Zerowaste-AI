/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Apple, Users, Truck, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="flex flex-col gap-24 py-12">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-semibold tracking-wide text-emerald-700 ring-1 ring-emerald-600/20">
              <Zap className="h-4 w-4" />
              Revolutionizing Food Redistribution
            </span>
            <h1 className="max-w-4xl font-sans text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
              Transforming Excess into <span className="text-emerald-600">Opportunity</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-600">
              ZeroWaste AI is an AI-powered platform that connects restaurants, hostels, and events with NGOs to prevent food wastage in real-time.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/login" className="flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-emerald-200/50 active:scale-95">
                Start Rescuing Food
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#how-it-works" className="rounded-full border border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-50">
                How It Works
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats/Dashboard Preview (Recipe 1: Technical Dashboard feel) */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                The Food Crisis in India
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Wasted/Year", val: "78.2M", unit: "tonnes" },
                  { label: "Wasted/Day", val: "214K", unit: "tonnes" },
                  { label: "Economic Loss", val: "₹92K", unit: "crore" },
                  { label: "Per Person", val: "55kg", unit: "/year" }
                ].map((stat, i) => (
                  <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <p className="font-mono text-xs font-semibold uppercase tracking-wider text-gray-500">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stat.val}</p>
                    <p className="text-sm font-medium text-emerald-600">{stat.unit}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl shadow-emerald-900/5 lg:p-12"
            >
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="relative h-20 w-20 rounded-2xl bg-emerald-600 p-5 text-white shadow-xl">
                  <Leaf className="h-10 w-10" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">AI-Powered Freshness Detection</h3>
                  <p className="text-gray-600">
                    Our AI module analyzes food quality, estimates shelf-life, and predicts demand in real-time to ensure the fastest delivery to those in need.
                  </p>
                </div>
                <div className="flex w-full flex-col gap-3">
                   <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "94%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-emerald-600"
                      />
                   </div>
                   <span className="font-mono text-sm font-semibold text-emerald-600">94% Demand Match Score</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stakeholders */}
      <section id="how-it-works" className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">One Platform, Three Heroes</h2>
          </div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 md:grid-cols-3"
          >
            {[
              { icon: Apple, role: "Donors", desc: "Restaurants & canteens list surplus food with AI analysis.", color: "bg-orange-50 text-orange-600" },
              { icon: ShieldCheck, role: "NGOs", desc: "Instantly claim food and manage local distribution points.", color: "bg-emerald-50 text-emerald-600" },
              { icon: Truck, role: "Volunteers", desc: "Accept nearby pickup notifications and deliver with route optimization.", color: "bg-blue-50 text-blue-600" }
            ].map((role, i) => (
              <motion.div key={i} variants={itemVariants} className="group relative rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className={cn("mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110", role.color)}>
                  <role.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{role.role}</h3>
                <p className="mt-4 text-gray-600">{role.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer Quote */}
      <section className="bg-emerald-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="space-y-8"
          >
            <p className="font-serif text-3xl italic leading-relaxed sm:text-5xl">
              "ZeroWaste AI transforms excess into opportunity—ensuring no food is wasted and no person goes hungry, powered by intelligent real-time technology."
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="h-px w-24 bg-emerald-500/50" />
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Team Idea-Igniters</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
