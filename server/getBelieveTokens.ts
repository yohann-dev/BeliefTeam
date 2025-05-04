const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
const BELIEVE_PROGRAM_ID = 'FhVo3mqL8PW5pH5U2CN4XE33DokiyZnUwuGpH2hmHLuM';

export async function fetchAllBelieveMints(): Promise<string[]> {
    let before: string | undefined;
    const allMints: string[] = [];

    while (true) {
        const params = new URLSearchParams({
            "api-key": HELIUS_API_KEY,
            limit: "100",
        });
        if (before) params.append("before", before);

        const res = await fetch(
            `https://api.helius.xyz/v0/addresses/${BELIEVE_PROGRAM_ID}/transactions?${params}`
        );
        const batch: any[] = await res.json();
        if (!batch.length) break;
        console.log(1, batch);
        batch.forEach(tx => {
            if (tx.type === "TOKEN_MINT" && tx.tokenTransfers?.[0]?.mint) {
                allMints.push(tx.tokenTransfers[0].mint);
                console.log(2, tx.tokenTransfers[0].mint);
            }
        });
        before = batch[batch.length - 1].signature;
    }

    // Deduplicate
    return Array.from(new Set(allMints));
}

// Batch-fetch metadata for up to 100 mints per call
export async function fetchMetadataForMints(mints: string[]): Promise<any[]> {
    console.log(3, mints); 
    const chunks: any[] = [];
    for (let i = 0; i < mints.length; i += 100) {
        const slice = mints.slice(i, i + 100);
        const res = await fetch(
            `https://api.helius.xyz/v0/tokens/metadata?api-key=${HELIUS_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mints: slice }),
            }
        );
        const data = await res.json();
        console.log(4, data);
        // chunks.push(...data);
    }
    return chunks;
}
