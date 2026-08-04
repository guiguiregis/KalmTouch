import { BODY_REGIONS, type BodyRegionSelection } from "./regions";

const FOCUS_COLOR = "#f59e0b";
const AVOID_COLOR = "#0ea5e9";
const IDLE_COLOR = "#cbd5e1";

function toSvgGroupId(regionId: string): string {
  return regionId.charAt(0).toUpperCase() + regionId.slice(1);
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not rasterize muscle map."));
    image.src = url;
  });
}

/**
 * Clone the live muscle-selector SVG, paint focus/avoid selections, and
 * return a PNG data URL for embedding in the intake PDF.
 */
export async function captureMuscleMapPng(
  host: HTMLElement,
  regions: BodyRegionSelection[],
): Promise<string | null> {
  const svg = host.querySelector("svg");
  if (!svg) return null;

  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("viewBox", svg.getAttribute("viewBox") || "0 0 176 207");
  clone.removeAttribute("style");
  clone.setAttribute("width", "704");
  clone.setAttribute("height", "828");

  for (const region of BODY_REGIONS) {
    const group = clone.querySelector(`#${toSvgGroupId(region.id)}`);
    group?.querySelectorAll("path").forEach((path) => {
      path.setAttribute("fill", IDLE_COLOR);
      path.setAttribute("opacity", "0.35");
      path.removeAttribute("style");
    });
  }

  for (const region of regions) {
    const group = clone.querySelector(`#${toSvgGroupId(region.regionId)}`);
    const color = region.intent === "focus" ? FOCUS_COLOR : AVOID_COLOR;
    group?.querySelectorAll("path").forEach((path) => {
      path.setAttribute("fill", color);
      path.setAttribute("opacity", "0.92");
      path.removeAttribute("style");
    });
  }

  // Keep body outlines visible.
  clone.querySelectorAll("path#Front, path#Back").forEach((path) => {
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#4a6b72");
    path.setAttribute("stroke-width", "1");
    path.setAttribute("opacity", "1");
  });

  const svgString = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);

  try {
    const image = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = 704;
    canvas.height = 828;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}
