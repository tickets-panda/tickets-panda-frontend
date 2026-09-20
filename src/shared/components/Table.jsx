export default function Table({ columns, children, className = '' }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wide text-zinc-500">
            {columns.map((column) => (
              <th key={column.key || column} className={`px-3 py-2 font-medium ${column.className || ''}`}>
                {column.label ?? column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, className = '' }) {
  return <td className={`px-3 py-3 text-zinc-700 ${className}`}>{children}</td>;
}
