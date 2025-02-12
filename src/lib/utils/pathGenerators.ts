export const generateMediaPaths = (
  workspaceId: string,
  transcriptionId: string,
  fileName: string
) => {
  console.log(
    "Generating media paths for:",
    "workspaceid: ",
    workspaceId,
    "transcriptionid: ",
    transcriptionId,
    "filename: ",
    fileName
  );

  const baseFolder = `workspaces/${workspaceId}/transcriptions/${transcriptionId}`;
  return {
    mediaPath: `${baseFolder}/${fileName}`, // For the media file
    contentPath: `${baseFolder}/content.json`, // For the transcription content
    baseFolder, // In case we need the folder path
  };
};
