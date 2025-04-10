import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { parseTlvString, type TlvDisplayItem } from "@/utils/qrUtils"

interface QrTlvViewerProps {
  qrString: string
  className?: string
}

const QrTlvViewer: React.FC<QrTlvViewerProps> = ({ qrString, className = "" }) => {
  // Parse the QR string into TLV format
  const tlvItems = parseTlvString(qrString)

  const renderTlvItems = (items: TlvDisplayItem[], level = 0) => {
    return (
      <div className={`${level > 0 ? "pl-6 border-l-2 border-[#68AB00]/30 ml-2" : ""}`}>
        {items.map((item, index) => (
          <div key={`${item.tag}-${index}-${level}`} className="mb-2">
            <div className="flex items-center">
              <div className="flex items-center bg-white rounded-md shadow-sm border p-1 overflow-hidden">
                <span className="w-12 px-2 py-1 bg-[#00513B] text-white text-xs font-mono rounded-l-sm">
                  {item.tag}
                </span>
                <span className="w-12 px-2 py-1 bg-[#68AB00] text-white text-xs font-mono">{item.length}</span>
                <span
                  className="px-2 py-1 bg-gray-100 text-xs font-mono rounded-r-sm truncate max-w-[120px]"
                  title={item.value}
                >
                  {item.value || "(empty)"}
                </span>
              </div>

              {item.children.length > 0 && (
                <span className="text-xs ml-2 text-gray-500">
                  ({item.children.length} {item.children.length === 1 ? "child" : "children"})
                </span>
              )}
            </div>

            {item.children.length > 0 && <div className="mt-2">{renderTlvItems(item.children, level + 1)}</div>}
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3 text-[#00513B]">QR TLV Structure</h3>
        <div className="bg-gray-50 rounded-md p-3 overflow-auto max-h-[400px]">{renderTlvItems(tlvItems)}</div>
      </CardContent>
    </Card>
  )
}

export default QrTlvViewer
