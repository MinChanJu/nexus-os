"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

import { motion } from "motion/react";

const ICON_SIZE = 24;

interface OAuthButtonProps {
  name: string;
  title?: string;
  backgroundColor?: string;
  color?: string;
}

const OAuthButton = ({ name, title, backgroundColor, color }: OAuthButtonProps) => {
  const handleOAuthLogin = async () => {
    await signIn(name, { callbackUrl: "/" });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleOAuthLogin}
      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-white transition-all duration-300 hover:brightness-75"
      style={{ backgroundColor, color }}
      title={`${title || name}로 로그인`}
    >
      <Image src={`/logos/${name}.svg`} alt={`${name} icon`} width={ICON_SIZE} height={ICON_SIZE} />
      {title || name}
    </motion.button>
  );
};

export default OAuthButton;
