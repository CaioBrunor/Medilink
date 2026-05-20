export default function RadioGroup({ name, options, value, onChange }) {
  return (
    <div className="med-radio-grp">
      {options.map(o => (
        <label key={o} className="med-radio">
          <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} />
          {' '}{o}
        </label>
      ))}
    </div>
  );
}
