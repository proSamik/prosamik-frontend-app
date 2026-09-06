import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveMediaOrder } from '../src/lib/media-order.ts';

const video = { id: 11, type: 'video' };
const image = { id: 12, type: 'image' };
const upload = { type: 'video', url: 'new-video.mp4' };

test('keeps the original mixed-media order when no edit order is supplied', () => {
    assert.deepEqual(resolveMediaOrder([video, image], [upload]), [
        { existing: video }, { existing: image }, { added: upload },
    ]);
});

test('can move new uploads before saved attachments and reverse saved attachments', () => {
    assert.deepEqual(resolveMediaOrder([video, image], [upload], ['new:0', 'existing:12', 'existing:11']), [
        { added: upload }, { existing: image }, { existing: video },
    ]);
});

test('supports removal and an empty attachment list', () => {
    assert.deepEqual(resolveMediaOrder([image], [], ['existing:12']), [{ existing: image }]);
    assert.deepEqual(resolveMediaOrder([], [], []), []);
});

test('rejects duplicate, omitted, removed, foreign and invalid new references', () => {
    for (const order of [
        ['existing:11', 'existing:11', 'new:0'],
        ['existing:11', 'new:0'],
        ['existing:11', 'existing:999', 'new:0'],
        ['existing:11', 'existing:12', 'new:1'],
    ]) {
        assert.throws(() => resolveMediaOrder([video, image], [upload], order), /Invalid media order/);
    }
    assert.throws(() => resolveMediaOrder([image], [], ['existing:11']), /Invalid media order/);
});
