/** Resolve an exact permutation of saved IDs and new-upload indexes. */
export function resolveMediaOrder<T extends { id: number }, U>(
    existing: T[],
    added: U[],
    order?: string[],
): Array<{ existing: T } | { added: U }> {
    const entries: Array<[string, { existing: T } | { added: U }]> = [
        ...existing.map((item): [string, { existing: T }] => [`existing:${item.id}`, { existing: item }]),
        ...added.map((item, index): [string, { added: U }] => [`new:${index}`, { added: item }]),
    ];
    if (order === undefined) return entries.map(([, value]) => value);
    const byKey = new Map(entries);
    if (order.length !== entries.length || new Set(order).size !== order.length || order.some((key) => !byKey.has(key))) {
        throw new Error('Invalid media order. Reload the post and try again.');
    }
    return order.map((key) => byKey.get(key)!);
}
