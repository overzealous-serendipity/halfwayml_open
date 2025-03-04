import { Document as DocumentType } from "@/types/transcriptionDocument";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { formatTime } from "./convertToSrt";
import autoTable from "jspdf-autotable";


export async function convertToPDF(
  content: DocumentType,
  documentTitle: string
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {

      const doc = new jsPDF("p", "mm", "a4"); // Set the format to A4
      doc.setFont("Helvetica");

      // Add document title as a header on each page
      doc.setFontSize(14);
      doc.text(documentTitle, 105, 20, { align: "center", maxWidth: 130 });

      // Define the columns for the table
      const tableColumn = [
        { header: "Speaker", dataKey: "speaker" },
        { header: "Time", dataKey: "time" },
        { header: "Text", dataKey: "text" },
      ];
      // Prepare the data for the table
      const tableData = content.utterances.map((utterance) => {
        // Combine text from all children into one entry
        const text = utterance.children.map((child) => child.text).join(" ");
        return {
          speaker: utterance.speaker,
          time: `${formatTime(utterance.start) || ""} - ${
            formatTime(utterance.end) || ""
          }`,
          text: text,
        };
      });

      // Create the table in the PDF
      autoTable(doc, {
        columns: tableColumn,
        body: tableData,
        startY: 30,
        margin: { horizontal: 10 },
        styles: { overflow: "linebreak", fontSize: 10 },
        bodyStyles: { valign: "top" },
        theme: "plain",
        headStyles: { fillColor: [200, 200, 200] }, // a nice greenish color
        showHead: "everyPage",
        didDrawPage: function (data) {
          doc.setFontSize(10);
          doc.text(
            "Generated by halfwayml.com",
            data.settings.margin.left,
            290,
            {
              align: "left",
            }
          );
          doc.text("Page " + doc.getNumberOfPages(), 100, 290);
          const date = new Date().toLocaleDateString("en-GB");
          doc.text(date, 190, 290, { align: "right" });
        },
      });

      const pdfOutput = doc.output("arraybuffer");
      const blob = new Blob([pdfOutput], { type: "application/pdf" });
      resolve(blob);
    } catch (error) {
      console.error("Error in convertToPDF", error);
      reject(error);
    }
  });
}
