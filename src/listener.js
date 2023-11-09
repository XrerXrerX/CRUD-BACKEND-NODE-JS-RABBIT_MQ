class Listener {
    constructor(playlistservice, mailSender) {
        this._playlistservice = playlistservice;
        this._mailSender = mailSender;
        this.listen = this.listen.bind(this);
    }

    async listen(message) {
        try {
            const { playlistid, userId, targetEmail } = JSON.parse(message.content.toString());
            const getplaylist = await this._playlistservice.getPlaylist(playlistid, userId);
            const songIds = getplaylist.songss;
            const songs = [];
            for (const songId of songIds) {
                const song = await this._playlistservice.getSongByIdplaylist(songId);
                if (song) {
                    songs.push((song));
                }
            }
            getplaylist.songss = songs; // Replace playlists[0].songs with the updated songs array
            // const playlist = getplaylist;
            // const playlistJSON = JSON.stringify(playlist);
            // const result = await this._mailSender.sendEmail(targetEmail, playlistJSON);

            const playlist = getplaylist; // Pastikan Anda memanggil fungsi getplaylist dengan parameter yang sesuai
            // Membuat objek baru dengan format yang Anda inginkan
            const newData = {
                playlist: {
                    id: playlist.id,
                    name: playlist.title,
                    songs: playlist.songss.map(songArray => {
                        return {
                            id: songArray[0].id,
                            title: songArray[0].title,
                            performer: songArray[0].performer
                        };
                    })
                }
            };

            // Mengonversi objek newData ke dalam string JSON
            const playlistJSON = JSON.stringify(newData);
            console.log(playlist);
            const result = await this._mailSender.sendEmail(targetEmail, playlistJSON);

            // const result = await this._mailSender.sendEmail(targetEmail, playlist);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = Listener;