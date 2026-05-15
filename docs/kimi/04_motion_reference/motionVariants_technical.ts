/**
 * Variantes de motion para Framer Motion (opcional).
 *
 * Embora o KRATOS evite dependências externas quando possível,
 * estas definições podem ser usadas se a biblioteca `framer-motion` já
 * estiver instalada.  Se não estiver, ignore estas variantes ou
 * recrie as animações via CSS.
 */
export const motionVariants = {
  floatSlow: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 6, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" } },
  },
  floatMedium: {
    initial: { y: 10, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" } },
  },
  spinSlow: {
    initial: { rotate: 0 },
    animate: { rotate: 360, transition: { duration: 10, ease: "linear", repeat: Infinity } },
  },
};