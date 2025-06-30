import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
}

const checkmarkVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
};

const circleVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  description,
}: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white text-center overflow-visible">
        <DialogHeader className="flex flex-col items-center">
          <div className="relative w-16 mb-2 flex-shrink-0">
            <motion.svg
              viewBox="0 0 50 50"
              className="w-full h-full"
              initial="hidden"
              animate="visible"
              style={{ display: "block" }}
            >
              <motion.circle
                cx="25"
                cy="25"
                r="20"
                stroke="#22c55e"
                strokeWidth="2"
                fill="none"
                variants={circleVariants}
              />
              <motion.path
                d="M15 25l8 8 12-16"
                fill="transparent"
                stroke="#22c55e"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={checkmarkVariants}
              />
            </motion.svg>
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 mt-2">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <p className="text-gray-600">{description}</p>
        </div>
        <Button
          onClick={onClose}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
}
