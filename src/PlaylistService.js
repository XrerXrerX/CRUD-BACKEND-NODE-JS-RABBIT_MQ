const { Pool } = require('pg');

class PlaylistService {
    constructor() {
        this._pool = new Pool();
    }

    async getPlaylist(playlistid, userId) {
        const query = {
            text: 'SELECT * FROM playlist_songs WHERE playlist_id = $1',
            values: [playlistid],
        };
        const result = await this._pool.query(query);
        const songss = result.rows.map(row => row.song_id);

        const querycheckplaylist = {
            text: 'SELECT * FROM playlist WHERE id = $1 AND user_id = $2',
            values: [playlistid, userId],
        };
        const resultcheclplaylist = await this._pool.query(querycheckplaylist);

        const id = resultcheclplaylist.rows[0].id;
        const title = resultcheclplaylist.rows[0].name;


        const playlist = {
            id,
            title,
            songss, // Ini akan diisi nanti
        };

        return playlist;
    }

    async getSongByIdplaylist(id) {

        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);


        if (result.rows.length === 0) {
            return null; // Lagu tidak ditemukan
        }

        return result.rows.map((row) => ({
            id: row.id,
            title: row.title,
            performer: row.performer
        }));
    }
}

module.exports = PlaylistService;