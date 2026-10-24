import { useEffect } from "react";
import { useTalk } from "@/lib/store";

export function Boot() {
  const text = useTalk((state) => state.settings.text);
  const contrast = useTalk((state) => state.settings.contrast);

  useEffect(() => {
    void Promise.resolve(useTalk.persist.rehydrate()).finally(() => {
      useTalk.setState({ hydrated: true });
    });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.contrast = contrast ? "high" : "normal";
    root.style.fontSize = text === "xl" ? "125%" : text === "lg" ? "112.5%" : "100%";
  }, [text, contrast]);

  return null;
}
