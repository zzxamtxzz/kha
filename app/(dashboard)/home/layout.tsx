import Image from "next/image";
import React from "react";

function HomeRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Image
        src={"/starlink2.jpg"}
        fill
        alt="background"
        className="object-cover z-[-10]"
      />
      {children}
    </>
  );
}

export default HomeRootLayout;
