import SparkMD5 from 'spark-md5';

export interface useFileChunkOptions {
    // 分片大小，默认为5m
    size?: number;
    // 是否需要计算md5, 默认否
    md5?: boolean;
}

export interface useFileChunkResult {
    // 源文件
    file: File;
    chunks: Blob[];
    // 每个分片大小
    chunkSize: number;
    // 配置计算md5的话才返回，否则返回空字符串
    // 开启md5计算的话，会影响生成速度
    md5: string;
}

/**
 * 分割文件获取分片大小
 * @param file 需要分片的文件
 * @param options useFileChunkOptions
 */
export async function useFileChunk(file: File, options?:useFileChunkOptions): Promise<useFileChunkResult> {

    const { size =  5 * 1025 * 1024, md5 = false } = options || {}

    let startPointer = 0;
    const endPointer = file.size;
    const chunks:Blob[] = [];
    const spark = new SparkMD5.ArrayBuffer();
    let md5String = ''
    while (startPointer < endPointer) {
        const newStartPointer = startPointer + size;
        const blob = file.slice(startPointer, newStartPointer)
        chunks.push(blob);
        md5 && spark.append(await blob.arrayBuffer())
        startPointer = newStartPointer;
    }
    if(md5) {
        md5String = spark.end(false)
    }
    return {
        file,
        chunks,
        chunkSize: size,
        md5: md5String
    };
};