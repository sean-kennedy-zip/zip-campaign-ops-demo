export function JsonViewer({ data }: { data: unknown }) {
  const json = JSON.stringify(data, null, 2);

  return (
    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs font-mono overflow-x-auto leading-relaxed">
      {json.split('\n').map((line, i) => {
        const colored = line
          .replace(/"([^"]+)":/g, '<key>"$1"</key>:')
          .replace(/: "([^"]*)"(,?)$/g, ': <str>"$1"</str>$2')
          .replace(/: (\d+\.?\d*)(,?)$/g, ': <num>$1</num>$2')
          .replace(/: (true|false)(,?)$/g, ': <bool>$1</bool>$2')
          .replace(/: (null)(,?)$/g, ': <nil>$1</nil>$2');

        return (
          <div key={i} className="flex">
            <span className="text-gray-600 select-none w-6 text-right mr-3 shrink-0">
              {i + 1}
            </span>
            <span
              dangerouslySetInnerHTML={{
                __html: colored
                  .replace(/<key>/g, '<span class="text-purple-400">')
                  .replace(/<\/key>/g, '</span>')
                  .replace(/<str>/g, '<span class="text-emerald-400">')
                  .replace(/<\/str>/g, '</span>')
                  .replace(/<num>/g, '<span class="text-amber-400">')
                  .replace(/<\/num>/g, '</span>')
                  .replace(/<bool>/g, '<span class="text-sky-400">')
                  .replace(/<\/bool>/g, '</span>')
                  .replace(/<nil>/g, '<span class="text-gray-500">')
                  .replace(/<\/nil>/g, '</span>'),
              }}
            />
          </div>
        );
      })}
    </pre>
  );
}
