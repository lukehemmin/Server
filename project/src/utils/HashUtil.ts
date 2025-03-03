import crypto from "node:crypto";
import fs from "node:fs";
import crc32 from "buffer-crc32";
import { inject, injectable } from "tsyringe";

import { TimeUtil } from "@spt-aki/utils/TimeUtil";

@injectable()
export class HashUtil
{
    constructor(@inject("TimeUtil") protected timeUtil: TimeUtil)
    {}

    /**
     * Create a 24 character id using the sha256 algorithm + current timestamp
     * @returns 24 character hash
     */
    public generate(): string
    {
        const shasum = crypto.createHash("sha256");
        const time = Math.random() * this.timeUtil.getTimestamp();

        shasum.update(time.toString());
        return shasum.digest("hex").substring(0, 24);
    }

    public generateMd5ForData(data: string): string
    {
        return this.generateHashForData("md5", data);
    }

    public generateSha1ForData(data: string): string
    {
        return this.generateHashForData("sha1", data);
    }

    public generateCRC32ForFile(filePath: fs.PathLike): number
    {
        return crc32.unsigned(fs.readFileSync(filePath));
    }

    /**
     * Create a hash for the data parameter
     * @param algorithm algorithm to use to hash
     * @param data data to be hashed
     * @returns hash value
     */
    public generateHashForData(algorithm: string, data: crypto.BinaryLike): string
    {
        const hashSum = crypto.createHash(algorithm);
        hashSum.update(data);
        return hashSum.digest("hex");
    }

    public generateAccountId(): number
    {
        const min = 1000000;
        const max = 1999999;
        return (max > min) ? Math.floor(Math.random() * (max - min + 1) + min) : min;
    }
}
