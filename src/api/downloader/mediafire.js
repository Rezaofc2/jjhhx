import { format } from 'util';

async function mediaFire(url) {
    try {
        const response = await fetch('https://r.jina.ai/' + url);
        const text = await response.text();

        const result = {
            title: (text.match(/Title: (.+)/) || [])[1]?.trim() || '',
            link: (text.match(/URL Source: (.+)/) || [])[1]?.trim() || '',
            filename: '',
            url: '',
            size: '',
            repair: '' // Menambahkan properti repair di sini
        };

        if (result.link) {
            const fileMatch = result.link.match(/\/([^\/]+\.zip)/);
            if (fileMatch) result.filename = fileMatch[1];
        }

        const matches = [...text.matchAll(/\[(.*?)\]\((https:\/\/[^\s]+)\)/g)];
        for (const match of matches) {
            const desc = match[1].trim();
            const link = match[2].trim();

            if (desc.toLowerCase().includes('download') && desc.match(/\((\d+(\.\d+)?[KMG]B)\)/)) {
                result.url = link;
                result.size = (desc.match(/\((\d+(\.\d+)?[KMG]B)\)/) || [])[1] || '';
            }
            if (desc.toLowerCase().includes('repair')) {
                result.repair = link;
            }
        }

        return result;
    } catch (error) {
        return {
            error: error.message
        };
    }
}

module.exports = (app) => {
    app.get("/downloader/mediafire", async (req, res) => {
        try {
            const { url } = req.query;
            const data = await mediaFire(url); // Mengubah 'response' menjadi 'data'

            // Mengakses data
            if (!data.link) throw new Error("File data not found");

            res.status(200).json({
                status: true,
                result: data, // Menggunakan data di sini
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
};
