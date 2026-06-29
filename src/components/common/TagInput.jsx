import { useState } from "react";

export default function TagInput({
  label,
  tags,
  onChange,
  placeholder,
  suggestions,
}) {
  const [val, setVal] = useState("");

  const add = (v) => {
    const t = v.trim();
    if (!t || tags.includes(t)) return;
    onChange([...tags, t]);
    setVal("");
  };

  return (
    <div className="f-form-group">
      {label && <label>{label}</label>}
      <div
        className="med-tag-wrap"
        onClick={(e) => e.currentTarget.querySelector(".med-tag-inp").focus()}
      >
        <div className="med-tags-list">
          {tags.map((t) => (
            <span key={t} className="med-tag">
              {t}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(tags.filter((x) => x !== t));
                }}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <input
          className="med-tag-inp"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(val);
            }
          }}
          placeholder={
            tags.length === 0
              ? placeholder || "Digitar e pressionar Enter..."
              : ""
          }
        />
      </div>
      {suggestions && (
        <div className="med-tag-sugs">
          {suggestions
            .filter((s) => !tags.includes(s))
            .map((s) => (
              <span key={s} onClick={() => add(s)}>
                {s}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}
