"use client"

import { motion,Variants } from "framer-motion"

export const getFadeInRotateVariants = (delay: number): Variants => ({
    initial: {
      opacity: 0,
      y: 110,
      rotate: 13,
    },
    animate: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        delay: delay,
        duration: 0.8,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  });


const GlideUpSpan = ({ children, delay, className }: { children: React.ReactNode, delay: number, className?: string }) => {
    return (
        <motion.span
            initial="initial"
            whileInView="animate"
            variants={getFadeInRotateVariants(delay)}
            viewport={{ once: true }}
            className={`origin-left ${className}`}
        >
            {children}
        </motion.span>
    )
}

const GlideUpSpan2 = ({ children, delay, className }: { children: React.ReactNode, delay: number, className?: string }) => {
    return (
        <motion.span
            initial="initial"
            whileInView="animate"
            variants={getFadeInRotateVariants(delay)}
            viewport={{ once: true }}
            className={`origin-left ${className}`}
        >
            {children}
        </motion.span>
    )
}



export { GlideUpSpan, GlideUpSpan2 }