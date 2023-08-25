export declare const redisClient: any;
export declare const redisPub: any;
export declare const redisSub: any;
export declare function InitRedisService(): void;
declare class RedisControler {
    Set(key: string, value: string): void;
    Get(key: string): Promise<{} | null>;
}
export declare const redisControler: RedisControler;
export {};
