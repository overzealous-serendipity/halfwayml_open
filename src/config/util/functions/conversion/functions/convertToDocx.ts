import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { Document as DocumentType } from "@/types/transcriptionDocument";
import { formatTime } from "./convertToSrt";


export const convertToDocx = async (
  content: DocumentType,
  docTitle: string
): Promise<Blob> => {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: docTitle,
                bold: true,
                size: 24, // Size in half-point
              }),
            ],
            alignment: "center",
          }),
          new Paragraph(""),
          new Table({
            columnWidths: [2400, 1600, 6000], // Adjust widths as needed
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph("Speaker")],
                    width: { size: 2400, type: WidthType.DXA },
                    shading: { fill: "cccccc" },
                  }),
                  new TableCell({
                    children: [new Paragraph("Time")],
                    width: { size: 1600, type: WidthType.DXA },
                    shading: { fill: "cccccc" },
                  }),
                  new TableCell({
                    children: [new Paragraph("Text")],
                    width: { size: 6000, type: WidthType.DXA },
                    shading: { fill: "cccccc" },
                  }),
                ],
              }),
              ...content.utterances.map(
                (utterance) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph(utterance.speaker || "Unknown"),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph(
                            `${formatTime(utterance.start)} - ${formatTime(
                              utterance.end
                            )}`
                          ),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: utterance.children.map(
                              (child) =>
                                new TextRun({
                                  text: child.text + " ",
                                  size: 20, // Adjust font size as necessary
                                })
                            ),
                          }),
                        ],
                      }),
                    ],
                  })
              ),
            ],
          }),
          new Paragraph(""),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  return blob;
};
