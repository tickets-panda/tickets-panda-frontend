export default function Table({
  columns,
  children,
  className = '',
  striped = false,
}) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-100 bg-zinc-50/75 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            {columns.map((column) => (
              <th
                key={column.key || column}
                className={`px-4 py-3 font-semibold ${column.className || ''}`}
              >
                {column.label ?? column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody
          className={`divide-y divide-zinc-100/90 text-zinc-800 ${
            striped ? '[&>tr:nth-child(even)]:bg-zinc-50/50' : ''
          }`}
        >
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function Td({ children, className = '', align = 'left' }) {
  return (
    <td
      className={`px-4 py-3.5 text-xs text-zinc-700 font-medium align-middle ${
        align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
      } ${className}`}
    >
      {children}
    </td>
  );
}
