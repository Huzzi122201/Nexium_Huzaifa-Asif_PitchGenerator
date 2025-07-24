'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const STAR_COUNT = 60;
const STAR_COLORS = ['#fff', '#e0e7ff', '#fef9c3'];

function randomBetween(a: number, b: number) {
  return Math.random() * (b - a) + a;
}

interface Star {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

export default function BackgroundAnimation() {
  const [stars, setStars] = useState<Star[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const generated = Array.from({ length: STAR_COUNT }).map((_, i) => {
      const x = randomBetween(0, 100); // vw
      const size = randomBetween(1, 2.5); // px
      const duration = randomBetween(8, 18); // seconds
      const delay = randomBetween(0, 10); // seconds
      const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
      return { id: i, x, size, duration, delay, color };
    });
    setStars(generated);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {stars.map(star => (
        <motion.div
          key={star.id}
          initial={{ y: '-5vh' }}
          animate={{ y: '105vh' }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            left: `${star.x}vw`,
            width: star.size,
            height: star.size,
            borderRadius: '50%',
            background: star.color,
            boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
} 