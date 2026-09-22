const escapeCell = (value) => {
  if (value === null || value === undefined) return '';
  const s = String(value);
  const shown = s.startsWith('data:') ? '[file attached]' : s;
  return /[",\n]/.test(shown) ? `"${shown.replace(/"/g, '""')}"` : shown;
};

export function rowsToCsv(columns, rows) {
  const head = columns.map(escapeCell).join(',');
  const body = rows.map((row) => columns.map((c) => escapeCell(row[c])).join(','));
  return [head, ...body].join('\n');
}

export function downloadCsv(filename, csv) {
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Flattens tenant registration rows (with registrationData answers) for CSV. */
export function registrationsToRows(registrations) {
  const answerLabels = [];
  const seen = new Set();
  registrations.forEach((r) => {
    (r.registrationData || []).forEach((d) => {
      const label = d.formField?.fieldLabel || d.formField?.fieldName;
      if (label && !seen.has(label)) {
        seen.add(label);
        answerLabels.push(label);
      }
    });
  });

  const columns = [
    'Reg ID',
    'Date',
    'Name',
    'Email',
    'Phone',
    'Event',
    'Activity',
    'Tier',
    'Qty',
    'Amount',
    'Order Ref',
    'Order Status',
    'Reg Status',
    ...answerLabels,
  ];

  const rows = registrations.map((r) => {
    const answers = {};
    (r.registrationData || []).forEach((d) => {
      const label = d.formField?.fieldLabel || d.formField?.fieldName;
      if (label) answers[label] = d.fieldValue;
    });
    return {
      'Reg ID': r.registrationRef || r.id,
      Date: r.createdAt ? new Date(r.createdAt).toLocaleString() : '',
      Name: r.customer?.name || '',
      Email: r.customer?.email || '',
      Phone: r.customer?.phone || '',
      Event: r.event?.title || '',
      Activity: r.activity?.title || '',
      Tier: r.ticketType?.name || '',
      Qty: r.quantity ?? '',
      Amount: r.order?.amount ?? '',
      'Order Ref': r.order?.orderRef || '',
      'Order Status': r.order?.status || '',
      'Reg Status': r.status || '',
      ...answers,
    };
  });

  return { columns, rows };
}
