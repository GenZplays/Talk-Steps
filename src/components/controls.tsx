import { useTalk, rateLabel, volumeLabel, type TextSize } from "@/lib/store";

const SIZES: { id: TextSize; label: string }[] = [
  { id: "md", label: "A" },
  { id: "lg", label: "A" },
  { id: "xl", label: "A" },
];

export function LookAndSound({ compact = false }: { compact?: boolean }) {
  const settings = useTalk((state) => state.settings);
  const patch = useTalk((state) => state.patchSettings);

  return (
    <div className={compact ? "grid gap-4" : "panel grid gap-5"}>
      {!compact && (
        <div>
          <h2 className="text-lg font-bold">Look and sound</h2>
          <p className="text-sm text-muted">These stay on this device. Captions can be on while you listen.</p>
        </div>
      )}
      <fieldset className="grid gap-2">
        <legend className="text-sm font-bold">Text size</legend>
        <div className="seg" role="radiogroup" aria-label="Text size">
          {SIZES.map((size) => (
            <button
              key={size.id}
              type="button"
              role="radio"
              aria-checked={settings.text === size.id}
              aria-label={size.id === "md" ? "Comfortable text" : size.id === "lg" ? "Large text" : "Larger text"}
              className={size.id === "lg" ? "text-lg" : size.id === "xl" ? "text-2xl" : "text-sm"}
              onClick={() => patch({ text: size.id })}
            >
              {size.label}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="grid gap-1">
        <span className="flex items-baseline justify-between gap-3 text-sm font-bold">
          Speed
          <span className="font-normal text-muted">{rateLabel(settings.rate)}</span>
        </span>
        <input
          type="range"
          min={0.7}
          max={1}
          step={0.15}
          value={settings.rate}
          aria-valuetext={rateLabel(settings.rate)}
          onChange={(event) => patch({ rate: Number(event.target.value) })}
        />
      </label>
      <label className="grid gap-1">
        <span className="flex items-baseline justify-between gap-3 text-sm font-bold">
          Volume
          <span className="font-normal text-muted">{volumeLabel(settings.volume)}</span>
        </span>
        <input
          type="range"
          min={0.3}
          max={1}
          step={0.35}
          value={settings.volume}
          aria-valuetext={volumeLabel(settings.volume)}
          onChange={(event) => patch({ volume: Number(event.target.value) })}
        />
      </label>
      <div className="grid gap-3">
        <Check
          checked={settings.captions}
          onChange={(captions) => patch({ captions })}
          label="Captions"
          hint="Show the words on screen. Screen readers still hear button names if this is off."
        />
        <Check
          checked={settings.contrast}
          onChange={(contrast) => patch({ contrast })}
          label="High contrast"
          hint="Stronger borders and darker text."
        />
        <Check
          checked={settings.autoHear}
          onChange={(autoHear) => patch({ autoHear })}
          label="Play the next sound"
          hint="After you press Next, the new word plays. The first word waits for Hear it."
        />
      </div>
    </div>
  );
}

function Check({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  hint: string;
}) {
  return (
    <label className="flex items-start gap-3">
      <input
        className="mt-1"
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>
        <span className="block font-bold">{label}</span>
        <span className="block text-sm text-muted">{hint}</span>
      </span>
    </label>
  );
}
