import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import config from 'config';

const s3Client = new S3Client({
    endpoint: config.get('s3.endpoint'),
    region: config.get('s3.region'),
    credentials: {
        accessKeyId: config.get('s3.accessKeyId'),
        secretAccessKey: config.get('s3.secretAccessKey')
    },
    forcePathStyle: true // Required for LocalStack
});

const BUCKET_NAME: string = config.get('s3.bucket');

export async function uploadImage(filename: string, buffer: Buffer, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: buffer,
        ContentType: contentType
    });

    await s3Client.send(command);
    return filename;
}

export async function getImageUrl(filename: string): Promise<string> {
    const endpoint: string = config.get('s3.endpoint');
    return `${endpoint}/${BUCKET_NAME}/${filename}`;
}

export async function getSignedImageUrl(filename: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename
    });

    return getSignedUrl(s3Client, command, { expiresIn });
}

export async function getImageStream(filename: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string | undefined }> {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename
    });

    const response = await s3Client.send(command);
    return {
        stream: response.Body as NodeJS.ReadableStream,
        contentType: response.ContentType
    };
}

export async function deleteImage(filename: string): Promise<void> {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filename
    });

    await s3Client.send(command);
}

export { s3Client, BUCKET_NAME };
