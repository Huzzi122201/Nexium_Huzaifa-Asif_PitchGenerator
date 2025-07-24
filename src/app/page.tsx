'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Target, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <p className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI-Powered Pitch Writer
          </p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative flex place-items-center">
        <h1 className="text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
          Craft Perfect Pitches<br />with AI Magic
        </h1>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold flex items-center gap-2">
            <Zap className="h-6 w-6" />
            Lightning Fast
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Generate compelling pitches in seconds with our AI-powered platform.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <h2 className="mb-3 text-2xl font-semibold flex items-center gap-2">
            <Target className="h-6 w-6" />
            Targeted Content
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Customized pitches that resonate with your specific audience.
          </p>
        </div>

        <Link
          href="/create"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold flex items-center gap-2">
            Create Pitch{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              <ArrowRight className="h-6 w-6" />
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Start crafting your perfect pitch now.
          </p>
        </Link>
      </motion.div>
    </main>
  );
}
