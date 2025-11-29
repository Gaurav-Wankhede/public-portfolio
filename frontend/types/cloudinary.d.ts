declare module 'cloudinary' {
  interface ConfigOptions {
    cloud_name?: string;
    api_key?: string;
    api_secret?: string;
    secure?: boolean;
  }

  interface UploadApiOptions {
    resource_type?: string;
    public_id?: string;
    folder?: string;
    tags?: string[];
    [key: string]: any;
  }

  interface UploadResponseCallback {
    (error: any, result: any): void;
  }

  interface UploadStream {
    write(buffer: Buffer): void;
    end(buffer?: Buffer): void;
    end(): void;
  }

  interface UploaderInterface {
    upload(file: string, options: UploadApiOptions, callback: UploadResponseCallback): void;
    upload_stream(options: UploadApiOptions, callback: UploadResponseCallback): UploadStream;
  }

  interface CloudinaryInstance {
    config(options: ConfigOptions): void;
    uploader: UploaderInterface;
  }

  export const v2: CloudinaryInstance;
} 