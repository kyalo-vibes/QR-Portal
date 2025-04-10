"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy, Download, EyeIcon, QrCode } from "lucide-react"
import type { GenerateQRCodeResponse } from "@/types/template" // Assuming this defines the interface correctly
import { useToast } from "@/hooks/use-toast"
import QrTlvViewer from "./QrTlvViewer"

interface QrCodeResultProps {
  generateResponse: GenerateQRCodeResponse | null
}

const QrCodeResult: React.FC<QrCodeResultProps> = ({ generateResponse }) => {
  const [copySuccess, setCopySuccess] = useState<boolean>(false)
  const [showTlvView, setShowTlvView] = useState<boolean>(false)
  const { toast } = useToast()

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
        toast({
          title: "Copied!",
          description: "QR string copied to clipboard.",
        })
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err)
        toast({
          title: "Copy Failed",
          description: "Could not copy text to clipboard.",
          variant: "destructive",
        })
      })
  }

  const downloadQrCode = () => {
    if (!generateResponse?.qrCodeImage) return

    // Determine the MIME type based on the format
    // Default to png if format is missing or unexpected for image types
    const formatLower = generateResponse.format?.toLowerCase()
    let mimeType = "image/png" // Default
    let fileExtension = "png"

    if (formatLower === "pdf") {
      mimeType = "application/pdf"
      fileExtension = "pdf"
    } else if (formatLower === "jpeg" || formatLower === "jpg") {
      mimeType = "image/jpeg"
      fileExtension = "jpg"
    } else if (formatLower === "gif") {
      mimeType = "image/gif"
      fileExtension = "gif"
    } else if (formatLower === "svg" || formatLower === "svg+xml") {
      mimeType = "image/svg+xml"
      fileExtension = "svg"
    }
    // Add other formats if needed

    const link = document.createElement("a")
    // Construct the correct Data URL prefix
    link.href = `data:${mimeType};base64,${generateResponse.qrCodeImage}`
    link.download = `qrcode-${generateResponse.referenceNumber || "download"}.${fileExtension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Downloaded!",
      description: `QR code ${generateResponse.format || "file"} downloaded successfully.`,
    })
  }

  if (!generateResponse) {
    return (
      <div className="text-center py-12 text-gray-500 border border-dashed rounded-lg">
        <QrCode className="h-10 w-10 opacity-30 mx-auto mb-3" />
        Generate a QR code to see the result here
      </div>
    )
  }

  // Construct the data URL for the image source
  // Defaulting to png, but ideally use generateResponse.format
  const imageFormat = generateResponse.format?.toLowerCase() || "png"
  // Handle potential different image formats if the API supports them
  const imageMimeType =
    imageFormat === "jpeg" || imageFormat === "jpg" ? "image/jpeg" : imageFormat === "gif" ? "image/gif" : "image/png" // default to png
  const imageSrc = generateResponse.qrCodeImage
    ? `data:${imageMimeType};base64,${generateResponse.qrCodeImage}`
    : undefined

  return (
    <div className="space-y-4">
      {/* Response Code and Message Display */}
      {generateResponse.responseCode && (
        <div>
          <p className="text-sm font-medium text-gray-500">Response Code</p>
          <p
            className={`text-lg font-semibold ${generateResponse.responseCode === "200" ? "text-green-600" : "text-red-600"}`}
          >
            {generateResponse.responseCode}
          </p>
        </div>
      )}
      {generateResponse.responseMessage && (
        <div>
          <p className="text-sm font-medium text-gray-500">Message</p>
          <p>{generateResponse.responseMessage}</p>
        </div>
      )}

      {/* Reference Number Display */}
      {generateResponse.referenceNumber && (
        <div>
          <p className="text-sm font-medium text-gray-500">Reference Number</p>
          <p className="font-mono bg-gray-100 p-2 rounded border text-sm">{generateResponse.referenceNumber}</p>
        </div>
      )}

      {/* QR String Display and Actions */}
      {generateResponse.qrString && (
        <>
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-500">QR String</p>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTlvView(!showTlvView)}
                  className="text-brand-primary hover:text-brand-primary/80 border-brand-primary/30"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  {showTlvView ? "Hide TLV" : "Show TLV"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(generateResponse.qrString!)}
                  className="text-brand-primary hover:text-brand-primary/80 border-brand-primary/30"
                  disabled={copySuccess}
                >
                  {copySuccess ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <p className="font-mono text-xs break-all bg-gray-100 p-2 rounded border mt-1">
              {generateResponse.qrString}
            </p>
          </div>

          {showTlvView && <QrTlvViewer qrString={generateResponse.qrString} className="mt-4" />}
        </>
      )}

      {/* QR Image/PDF Display and Download */}
      {generateResponse.qrCodeImage && (
        <div className="text-center pt-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-500">
              QR {generateResponse.format === "pdf" ? "PDF Preview" : "Image"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadQrCode}
              className="text-brand-primary hover:text-brand-primary/80 border-brand-primary/30"
            >
              <Download className="h-4 w-4 mr-1" />
              Download {generateResponse.format || ""}
            </Button>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 bg-white inline-block shadow-sm">
            {generateResponse.format?.toLowerCase() === "pdf" ? (
              <div className="flex flex-col items-center justify-center h-[150px] w-[150px] bg-gray-50 rounded">
                <QrCode className="h-16 w-16 text-red-600 mb-2" /> {/* PDF icon */}
                <p className="text-sm text-gray-600">PDF QR Code</p>
                <p className="text-xs text-gray-400">(Click Download)</p>
              </div>
            ) : imageSrc ? (
              <img
                src={imageSrc} // Use the correctly formatted data URL
                alt="Generated QR Code"
                className="max-w-full h-auto mx-auto block"
                style={{ maxHeight: "200px", maxWidth: "200px" }} // Constrain size
              />
            ) : (
              <p className="text-red-500">Error displaying image</p>
            )}
          </div>
          {generateResponse.size && (
            <p className="text-xs text-gray-400 mt-1">
              Size: {generateResponse.size}x{generateResponse.size}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default QrCodeResult
//
// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Check, Copy, Download, EyeIcon, QrCode } from "lucide-react";
// import { GenerateQRCodeResponse } from "@/types/template";
// import { useToast } from "@/hooks/use-toast";
// import QrTlvViewer from "./QrTlvViewer";
//
// interface QrCodeResultProps {
//   generateResponse: GenerateQRCodeResponse | null;
// }
//
// const QrCodeResult: React.FC<QrCodeResultProps> = ({ generateResponse }) => {
//   const [copySuccess, setCopySuccess] = useState<boolean>(false);
//   const [showTlvView, setShowTlvView] = useState<boolean>(false);
//   const { toast } = useToast();
//
//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text).then(() => {
//       setCopySuccess(true);
//       setTimeout(() => setCopySuccess(false), 2000);
//       toast({
//         title: "Copied!",
//         description: "QR string copied to clipboard."
//       });
//     });
//   };
//
//   const downloadQrCode = () => {
//     if (!generateResponse?.qrCodeImage) return;
//
//     // For image format
//     if (generateResponse.format === "image") {
//       const link = document.createElement('a');
//       link.href = generateResponse.qrCodeImage;
//       link.download = `qrcode-${generateResponse.referenceNumber || 'download'}.png`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//
//       toast({
//         title: "Downloaded!",
//         description: "QR code image downloaded successfully."
//       });
//     }
//     // For PDF format - typically would be a direct download from a URL
//     else if (generateResponse.format === "pdf") {
//       // In a real app, this might be a direct URL to the PDF
//       // For this demo, we'll simulate it with a base64 data URL
//       const link = document.createElement('a');
//       link.href = generateResponse.qrCodeImage; // In reality, this would be a PDF data URL or direct link
//       link.download = `qrcode-${generateResponse.referenceNumber || 'download'}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//
//       toast({
//         title: "Downloaded!",
//         description: "QR code PDF downloaded successfully."
//       });
//     }
//   };
//
//   if (!generateResponse) {
//     return (
//       <div className="text-center py-12 text-gray-500 border border-dashed rounded-lg">
//         <QrCode className="h-10 w-10 opacity-30 mx-auto mb-3" />
//         Generate a QR code to see the result here
//       </div>
//     );
//   }
//
//   return (
//     <div className="space-y-4">
//       <div>
//         <p className="text-sm font-medium text-gray-500">Response Code</p>
//         <p className={`text-lg ${generateResponse.responseCode === "200" ? "text-green-600" : "text-red-600"}`}>
//           {generateResponse.responseCode}
//         </p>
//       </div>
//
//       <div>
//         <p className="text-sm font-medium text-gray-500">Message</p>
//         <p>{generateResponse.responseMessage}</p>
//       </div>
//
//       {generateResponse.referenceNumber && (
//         <div>
//           <p className="text-sm font-medium text-gray-500">Reference Number</p>
//           <p className="font-mono bg-gray-50 p-2 rounded border">{generateResponse.referenceNumber}</p>
//         </div>
//       )}
//
//       {generateResponse.qrString && (
//         <>
//           <div>
//             <div className="flex justify-between items-center">
//               <p className="text-sm font-medium text-gray-500">QR String</p>
//               <div className="space-x-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setShowTlvView(!showTlvView)}
//                   className="text-brand-primary hover:text-brand-primary/80"
//                 >
//                   <EyeIcon className="h-4 w-4 mr-1" />
//                   {showTlvView ? 'Hide TLV' : 'Show TLV'}
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => copyToClipboard(generateResponse.qrString!)}
//                   className="text-brand-primary hover:text-brand-primary/80"
//                 >
//                   {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//                 </Button>
//               </div>
//             </div>
//             <p className="font-mono text-sm break-all bg-gray-50 p-2 rounded border mt-1">
//               {generateResponse.qrString}
//             </p>
//           </div>
//
//           {showTlvView && (
//             <QrTlvViewer qrString={generateResponse.qrString} className="mt-4" />
//           )}
//         </>
//       )}
//
//       {generateResponse.qrCodeImage && (
//         <div className="text-center">
//           <div className="flex justify-between items-center mb-2">
//             <p className="text-sm font-medium text-gray-500">
//               QR {generateResponse.format === "pdf" ? "PDF" : "Image"}
//             </p>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={downloadQrCode}
//               className="text-brand-primary hover:text-brand-primary/80"
//             >
//               <Download className="h-4 w-4 mr-1" />
//               Download
//             </Button>
//           </div>
//           <div className="border border-gray-200 rounded-lg p-4 bg-white inline-block">
//             {generateResponse.format === "pdf" ? (
//               <div className="flex flex-col items-center">
//                 <QrCode className="h-16 w-16 text-brand-primary mb-2" />
//                 <p className="text-sm text-gray-500">PDF QR Code</p>
//                 <p className="text-xs text-gray-400">Click download to save</p>
//               </div>
//             ) : (
//               <img
//                 src={generateResponse.qrCodeImage}
//                 alt="Generated QR Code"
//                 className="max-w-full h-auto mx-auto"
//                 style={{ maxHeight: "200px" }}
//               />
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default QrCodeResult;
