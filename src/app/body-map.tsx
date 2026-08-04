"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import type { App } from "vue";
import "vue-muscle-group-selector/dist/style.css";
import { captureMuscleMapPng } from "@/lib/intake/capture-body-map";
import {
  isKnownRegionId,
  muscleTranslations,
  type BodyIntent,
  type BodyRegionSelection,
} from "@/lib/intake/regions";
import { useLocale } from "@/lib/i18n/locale-provider";

export type BodyMapHandle = {
  capturePng: () => Promise<string | null>;
};

type BodyMapProps = {
  value: BodyRegionSelection[];
  onChange: (next: BodyRegionSelection[]) => void;
  frontLabel: string;
  backLabel: string;
  legendFocus: string;
  legendAvoid: string;
  legendHint: string;
};

const BodyMap = forwardRef<BodyMapHandle, BodyMapProps>(function BodyMap(
  { value, onChange, legendFocus, legendAvoid, legendHint },
  ref,
) {
  const { locale } = useLocale();
  const hostRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);
  const [mode, setMode] = useState<BodyIntent>("focus");
  const modeRef = useRef(mode);

  onChangeRef.current = onChange;
  valueRef.current = value;
  modeRef.current = mode;

  useImperativeHandle(ref, () => ({
    capturePng: async () => {
      if (!hostRef.current) return null;
      return captureMuscleMapPng(hostRef.current, valueRef.current);
    },
  }));

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let app: App | undefined;
    let cancelled = false;

    async function mount() {
      const { createApp, h } = await import("vue");
      const { default: MuscleGroupSelector } = await import(
        "vue-muscle-group-selector"
      );
      if (cancelled || !hostRef.current) return;

      const initialValues = valueRef.current
        .filter((region) => region.intent === modeRef.current)
        .map((region) => region.regionId);

      app = createApp({
        render() {
          return h(MuscleGroupSelector, {
            allowMultiple: true,
            showMusclesListHelper: false,
            showFrontMuscles: true,
            showBackMuscles: true,
            primaryColor: modeRef.current === "focus" ? "#f59e0b" : "#0ea5e9",
            muscleColor: "#ffffff",
            strokeColor: "#4a6b72",
            initialValues,
            translations: muscleTranslations(locale),
            onOnSelect: (selection: string[]) => {
              const intent = modeRef.current;
              const selected = selection.filter((id) => isKnownRegionId(id));
              const remaining = valueRef.current.filter(
                (region) =>
                  region.intent !== intent &&
                  !selected.includes(region.regionId),
              );
              onChangeRef.current([
                ...remaining,
                ...selected.map((regionId) => ({ regionId, intent })),
              ]);
            },
          });
        },
      });

      const el = hostRef.current;
      if (!el) return;
      el.innerHTML = "";
      app.mount(el);
    }

    void mount();

    return () => {
      cancelled = true;
      app?.unmount();
      if (hostRef.current) hostRef.current.innerHTML = "";
    };
  }, [mode, locale]);

  const focusLabels = value
    .filter((region) => region.intent === "focus")
    .map((region) => region.regionId);
  const avoidLabels = value
    .filter((region) => region.intent === "avoid")
    .map((region) => region.regionId);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setMode("focus")}
          className={`rounded-md border px-4 py-2 text-sm transition ${
            mode === "focus"
              ? "border-amber-600 bg-amber-500 text-white"
              : "border-stone bg-white/80 text-foreground hover:border-accent"
          }`}
        >
          {legendFocus}
        </button>
        <button
          type="button"
          onClick={() => setMode("avoid")}
          className={`rounded-md border px-4 py-2 text-sm transition ${
            mode === "avoid"
              ? "border-sky-600 bg-sky-500 text-white"
              : "border-stone bg-white/80 text-foreground hover:border-accent"
          }`}
        >
          {legendAvoid}
        </button>
      </div>

      <p className="text-center text-sm text-muted">{legendHint}</p>

      <div
        ref={hostRef}
        className="muscle-selector-host mx-auto w-full max-w-3xl overflow-x-auto"
      />

      {(focusLabels.length > 0 || avoidLabels.length > 0) && (
        <div className="flex flex-col gap-1 text-center text-sm text-muted">
          {focusLabels.length > 0 ? (
            <p>
              <span className="font-medium text-foreground">{legendFocus}:</span>{" "}
              {focusLabels.join(", ")}
            </p>
          ) : null}
          {avoidLabels.length > 0 ? (
            <p>
              <span className="font-medium text-foreground">{legendAvoid}:</span>{" "}
              {avoidLabels.join(", ")}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
});

export default BodyMap;
