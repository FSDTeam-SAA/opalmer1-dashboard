type CsvTemplateExampleProps = {
  columns: string[];
  example: Record<string, string>;
  requiredColumns: string[];
};

export default function CsvTemplateExample({
  columns,
  example,
  requiredColumns,
}: CsvTemplateExampleProps) {
  return (
    <section className="min-w-0 space-y-2 text-sm">
      <h3 className="font-semibold">Example CSV format</h3>
      <p className="text-muted-foreground">
        Keep the column names exactly as shown in the first row. Add one record
        per row below it. This is sample data; replace it with your own. Columns
        marked * are required. Optional values can be left blank.
      </p>
      <div
        role="region"
        aria-label="Example CSV format"
        tabIndex={0}
        className="max-w-full overflow-x-auto rounded-lg border focus-visible:outline-2 focus-visible:outline-[#871dad]"
      >
        <table className="w-full whitespace-nowrap text-left text-sm">
          <caption className="sr-only">
            CSV column names and example data
          </caption>
          <thead className="bg-[#871dad]/5">
            <tr>
              {columns.map((column) => (
                <th key={column} scope="col" className="px-3 py-2 font-medium">
                  {column}
                  {requiredColumns.includes(column) && (
                    <span className="ml-1 text-[#871dad]" aria-label="required">
                      *
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              {columns.map((column) => (
                <td key={column} className="px-3 py-2">
                  {example[column] ?? ""}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Scroll sideways to see all columns. Save your file as CSV (.csv) before
        uploading.
      </p>
    </section>
  );
}
