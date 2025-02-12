import { Client } from "minio";

// Add this check at the top of the file
if (typeof window !== "undefined") {
  throw new Error("MinioService can only be used on the server side");
}

export interface MinioConfig {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucket: string;
  isExternal?: boolean;
}

export class MinioService {
  private readonly client: Client;
  private readonly bucket: string;
  private readonly ngrokUrl?: string;

  constructor(config: MinioConfig) {
    if (config.isExternal && process.env.NGROK_URL) {
      // Parse ngrok URL to extract hostname correctly
      const ngrokUrlObj = new URL(process.env.NGROK_URL);

      // Create client with exact ngrok hostname
      this.client = new Client({
        endPoint: ngrokUrlObj.hostname, // Just the hostname, no protocol
        port: 443, // Always 443 for ngrok https
        useSSL: true, // Always true for ngrok
        accessKey: config.accessKey,
        secretKey: config.secretKey,
        region: "us-east-1", // Consistent region for signature
      });

      this.ngrokUrl = process.env.NGROK_URL;
    } else {
      // Internal client remains unchanged
      this.client = new Client({
        endPoint: config.endPoint, 
        port: config.port,
        useSSL: config.useSSL,
        accessKey: config.accessKey,
        secretKey: config.secretKey,
      });
    }

    this.bucket = config.bucket;
  }

  /**
   * Create appropriate instance based on use case
   */
  public static create(config: MinioConfig): MinioService {
    return new MinioService(config);
  }

 
  /**
   * Generate a presigned URL for uploads (internal)
   */
  // Functioning version 
  public async generatePresignedUrl(
    objectName: string,
    expirySeconds: number = 300,
    contentType?: string
  ): Promise<string> {
    try {
      // Generate policy for the presigned URL
      const policy = {
        expiration: new Date(Date.now() + expirySeconds * 1000).toISOString(),
        conditions: [
          ["content-length-range", 0, 1073741824], // 1GB max size
          ["starts-with", "$Content-Type", ""],
        ],
      };

      const url = await this.client.presignedPutObject(
        this.bucket,
        objectName,
        expirySeconds
      );

      console.log("Generated presigned URL:", {
        url,
        objectName,
        contentType,
      });

      return url;
    } catch (error) {
      console.error("Error generating upload URL:", error);
      throw error;
    }
  }

  

  private normalizeObjectPath(objectName: string): string {
    // Preserve original path - don't transform special characters
    return objectName;
  }

  /**
   * Generate a presigned URL for downloads (external)
   */

  public async verifyFileAccess(objectName: string): Promise<boolean> {
    const normalizedPath = this.normalizeObjectPath(objectName);
    try {
      const stat = await this.client.statObject(this.bucket, normalizedPath);
      console.log("File verification successful:", {
        originalPath: objectName,
        normalizedPath,
        size: stat.size,
        lastModified: stat.lastModified,
      });
      return true;
    } catch (error) {
      console.error("File verification failed:", {
        originalPath: objectName,
        normalizedPath,
        error: error instanceof Error ? error.message : "Unknown error",

      });
      return false;
    }
  }

  /**
   * Generate a presigned URL for downloads
   */
  private encodeUrlPath(path: string): string {
    // Split path into segments
    return (
      path
        .split("/")
        // Encode each segment individually
        .map((segment) => encodeURIComponent(segment))
        // Rejoin with unencoded forward slashes
        .join("/")
    );
  }
  public async generateDownloadPresignedUrl(
    objectName: string,
    expirySeconds: number = 18000
  ): Promise<string> {
    try {
      // Verify file exists
      const exists = await this.verifyFileAccess(objectName);
      if (!exists) {
        throw new Error(`File does not exist: ${objectName}`);
      }

      // Encode path segments properly
      const encodedPath = this.encodeUrlPath(objectName);

      // Construct final URL with proper structure
      const url = `${this.ngrokUrl}/${this.bucket}/${encodedPath}`;

      console.log("Generated URL:", {
        original: objectName,
        encoded: encodedPath,
        final: url,
      });

      // Verify URL format
      try {
        const testUrl = new URL(url);
        if (testUrl.pathname.includes("%2F")) {
          console.warn(
            "Warning: URL contains encoded slashes, might cause issues"
          );
        }
      } catch (error) {
        console.error("Invalid URL generated:", error);
        throw error;
      }

      return url;
    } catch (error) {
      console.error("Error generating download URL:", error);
      throw error;
    }
  }

  private getContentTypeFromExtension(filename: string): string {
    const ext = filename.split(".").pop()?.toLowerCase();
    return ext === "mp4"
      ? "video/mp4"
      : ext === "mp3"
      ? "audio/mpeg"
      : ext === "wav"
      ? "audio/wav"
      : "application/octet-stream";
  }

  /**
   * Determine content type from file extension
   */

  /**
   * List objects in a directory
   */
  public async listObjects(prefix: string = ""): Promise<string[]> {
    const objects: string[] = [];
    const stream = this.client.listObjects(this.bucket, prefix, true);

    return new Promise((resolve, reject) => {
      stream.on("data", (obj) => {
        if (obj.name) objects.push(obj.name);
      });
      stream.on("end", () => resolve(objects));
      stream.on("error", reject);
    });
  }

  /**
   * Move a file within the bucket
   */
  public async moveFile(
    sourceKey: string,
    destinationKey: string
  ): Promise<void> {
    try {
      await this.client.copyObject(
        this.bucket,
        destinationKey,
        `${this.bucket}/${sourceKey}`
      );
      await this.client.removeObject(this.bucket, sourceKey);
    } catch (error) {
      console.error("Error moving file:", error);
      throw error;
    }
  }

  async getFileStream(key: string) {
    return await this.client.getObject(this.bucket, key);
  }

  async getFileStat(key: string) {
    return await this.client.statObject(this.bucket, key);
  }

  async getFileAsBuffer(key: string): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const dataStream = await this.client.getObject(this.bucket, key);
        const chunks: Uint8Array[] = [];
        dataStream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
        dataStream.on("end", () => resolve(Buffer.concat(chunks)));
        dataStream.on("error", reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  public async putObject(path: string, data: Buffer): Promise<void> {
    try {
      await this.client.putObject(this.bucket, path, data);
    } catch (error) {
      console.error("Error uploading to MinIO:", error);
      throw error;
    }
  }

  public async getObject(path: string): Promise<Buffer> {
    try {
      const dataStream = await this.client.getObject(this.bucket, path);
      return new Promise((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        dataStream.on("data", (chunk: Uint8Array) => chunks.push(chunk));
        dataStream.on("end", () => resolve(Buffer.concat(chunks)));
        dataStream.on("error", reject);
      });
    } catch (error) {
      console.error("Error downloading from MinIO:", error);
      throw error;
    }
  }
  public async objectExists(path: string): Promise<boolean> {
    try {
      await this.client.statObject(this.bucket, path);
      return true;
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "NotFound") {
        return false;
      }
      throw error;
    }
  }

  public async ensureDirectory(path: string): Promise<void> {
    try {
      // MinIO doesn't need actual directory creation, but we can add a
      // zero-byte object to mark the directory if needed
      await this.client.putObject(
        this.bucket,
        `${path}/.keep`,
        Buffer.from("")
      );
    } catch (error) {
      console.error("Error ensuring directory exists:", error);
      throw error;
    }
  }
  public async getVersionFileContent(objectPath: string): Promise<any> {
    try {
      // Get the file content as buffer
      const buffer = await this.getFileAsBuffer(objectPath);
      
      // Parse the JSON content
      const content = JSON.parse(buffer.toString());
      
      console.log("Version file content retrieved:", {
        path: objectPath,
        contentSize: buffer.length,
        hasDocument: !!content?.document
      });

      // Return the document content specifically
      return content?.document || content;
    } catch (error) {
      console.error("Error retrieving version file content:", {
        path: objectPath,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw new Error(`Failed to retrieve version content: ${error instanceof Error ? error.message : "Unknown error"}`);

    }
  }
  public async removeObject(key: string): Promise<void> {
    try {
      await this.client.removeObject(this.bucket, key);
    } catch (error) {

      console.error("Error removing object:", error);
      throw error;
    }
  }
  

}
