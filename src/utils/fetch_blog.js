export async function fetch_blog(file_name) {
    try {
        const req = await fetch(`/posts/${file_name}.md`);
        if (!req.ok) throw new Erro('Fetch failed...');

        const text = await req.text();
        if (
            text.trim().startsWith('<!DOCTYPE html>') ||
            text.trim().startsWith('<!doctype html>') ||
            text.trim().startsWith('<html')
        ) {
            throw new Error('File not found');
        }

        return text;
    } catch (err) {
        throw err;
    }
}
