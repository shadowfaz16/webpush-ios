import React from "react"
import Image from "next/image"

export const magicBellHandle = "magicbell_io"

export default function Disclaimer() {
  return (
    <section className="flex flex-col gap-3 pb-6">
      <div
        className="flex items-center justify-center gap-2 flex-col"
      >
        <span className="text-muted text-xs">built by</span>
        <Image
          height={20}
          width={103}
          src="/logospidev.png"
          alt="spidev"
        ></Image>
      </div>
    </section>
  )
}
