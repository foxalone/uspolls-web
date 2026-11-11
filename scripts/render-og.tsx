import { readFile, writeFile } from "node:fs/promises";
import React from "react";
import { ImageResponse } from "next/og";

const regular = await readFile("/System/Library/Fonts/Supplemental/Arial.ttf");
const bold = await readFile("/System/Library/Fonts/Supplemental/Arial Bold.ttf");

const image = new ImageResponse(
  (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(120deg, #142e4d 0%, #0b1d35 55%, #122b48 100%)",
        color: "#f7f3eb",
        padding: "76px 84px",
        fontFamily: "Arial",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: 112,
            height: 112,
            borderRadius: 28,
            background: "linear-gradient(140deg, #e55850, #315e9d)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: 42,
            fontWeight: 700,
          }}
        >
          VP
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 32 }}>
          <div style={{ fontSize: 86, fontWeight: 700, letterSpacing: -1.5, lineHeight: 1 }}>VotePulse</div>
          <div style={{ fontSize: 36, color: "#f6be73", marginTop: 16 }}>America's Political Pulse</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ width: 168, height: 6, borderRadius: 99, background: "#f6be73" }} />
        <div style={{ fontSize: 28, color: "#b3bed0", marginTop: 22 }}>2028 U.S. presidential election</div>
      </div>
    </div>
  ),
  {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Arial", data: regular, weight: 400, style: "normal" },
      { name: "Arial", data: bold, weight: 700, style: "normal" },
    ],
  },
);

await writeFile("public/og.png", Buffer.from(await image.arrayBuffer()));
