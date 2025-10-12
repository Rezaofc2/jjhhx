import { format } from 'util';
let axios = require('axios')
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
  app.get("/nsfw/nekopoi", async (req, res) => {
    try {
      let nekopoi = [
"https://www.mediafire.com/file/tdew3fnqvvvzlgz/[NekoPoi]_Modaete_yo,Adam-kun-_01_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/fn12ucbhoe7za0z/[NekoPoi]_Modaete_yo,Adam-kun-_02_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/hfxurgwdle19quz/[NekoPoi]_Ikumonogakari_The_Animation_-_01_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/1rpts098hw5u0c2/[NekoPoi]_Ikumonogakari_The_Animation_-_02_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/a3bfu78t00faaou/[NekoPoi]_Yamitsuki_Mura_Melty_Limit_The_Animation_-_01_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/9g7kasnpf17wk3p/[NekoPoi]_Yamitsuki_Mura_Melty_Limit_The_Animation_-_02_[360P][nekopoi.care].mp4/filedisini",
"https://www.mediafire.com/file/5qytj8rygfro54a/[NekoPoi]+Fuufu+Koukan+Modorenai+Yoru+-+01+[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/n3bbcx9citrkki0/[NekoPoi]+Fuufu+Koukan+Modorenai+Yoru+-+02+[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/6nltqcwdffss3ax/[NekoPoi]+Fuufu+Koukan+Modorenai+Yoru+-+03+[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/yn4ch1cq5bbr116/[NekoPoi]+Fuufu+Koukan+Modorenai+Yoru+-+04+[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/8kqh0dntvz37sdc/[NekoPoi]+Fuufu+Koukan+Modorenai+Yoru+-+05+[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/c2bs72eiw7cd1ms/[NekoPoi]+Fuufu+Koukan+Modorenai+Yoru+-+06+[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/6k7ks5xzwjdqntj/[NekoPoi]+Fuufu+Koukan+Modorenai+Yoru+-+07+[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/bjk93v0u4glhb95/[NekoPoi]+Fuufu+Koukan+Modorenai+Yoru+-+08+[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/y3deqjv8ce14vh0/[NekoPoi]_Chikan_no_Licence_-_Episode_1_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/n6j8bebk6iqt5vn/[NekoPoi]_Chikan_no_Licence_-_Episode_2_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/sv2kbe6vf6onm5a/[NekoPoi]_Gishi_Wa_yan_Mama_-_01_[360P].mp4/file",
"https://www.mediafire.com/file/4fovfnzfr1lly7t/[NekoPoi]_Gishi_Wa_yan_Mama_-_02_[360P].mp4/file",
"https://www.mediafire.com/file/1dxo2nsedfdxfjv/[NekoPoi]_Shikkoku_no_Shaga_-_01_[360P]_[nekopoi.care].mp4/file",
"https://www.mediafire.com/file/f6mlbam5axfwtjq/[NekoPoi]_Shikkoku_no_Shaga_-_02_[360P]_[nekopoi.care]_[nekopoi.lol].mp4/file",
"https://www.mediafire.com/file/tfk19s0h207acpc/[NekoPoi]_Shikkoku_no_Shaga_The_Animation_-_03_Director_s_Cut_Edition_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/3ydkrqsn9lyu5jf/[NekoPoi]_Sakusei_Byoutou_The_Animation_-_01_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/3ydkrqsn9lyu5jf/[NekoPoi]_Sakusei_Byoutou_The_Animation_-_01_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/db41m80j12cifs8/[NekoPoi]_Sakusei_Byoutou_The_Animation_-_02_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/l3gsgg7xpphwzjc/[NekoPoi]_Sakusei_Byoutou_The_Animation_-_03_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/njixsiapftgqmnl/[NekoPoi]_Sakusei_Byoutou_The_Animation_-_04_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/m8jktwclgrh7c7y/[NekoPoi]_Goblin_no_Suana_-_01_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/2nv3h5493aq1x88/[NekoPoi]_Goblin_no_Suana_-_02_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/mwowkmlc567tjqi/[NekoPoi]_Goblin_no_Suana_-_03_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/mdp58ugp88wrwp0/[NekoPoi]_Goblin_no_Suana_-_04_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/mgqtdiiyzrh8ary/[NekoPoi]_Isekai_Kita_node_Sukebe_Skill_de_Zenryoku_Ouka_Shiyou_to_Omou_-_01_[360P][nekopoi.care]-muxed.mp4/file",
"https://www.mediafire.com/file/o00s5v5nhw95d0h/[NekoPoi]_Oneshota_The_Animation_-_01_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/l3ix8jl3p1hlg0n/[NekoPoi]_Maken_no_Hime_wa_Ero_Ero_Desu_-_01_[360P]_[nekopoi.care].mp4/file",
"https://www.mediafire.com/file/u39muluaej0vyec/[NekoPoi]_Isekai_Harem_Monogatari_-_01_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/in3upqax04cw72q/[NekoPoi]_BATCH_Secret_Mission_Sennyuu_[360P].rar/file",
"https://www.mediafire.com/file/kc5edmbcvv3166p/[NekoPoi]_Tsundero_-_01_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/kc5edmbcvv3166p/[NekoPoi]_Tsundero_-_01_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/472b41ruasbh73n/[NekoPoi]_Tsundero_-_02_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/9c6dar8pxmp8ckv/[NekoPoi]_Tsundero_-_04_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/bwdtplvzojduea8/[NekoPoi]_Tsundero_-_03_[360P][nekopoi.care].mp4/file",
"https://www.mediafire.com/file/sv2kbe6vf6onm5a/[NekoPoi]_Gishi_wa_yen_mama_-_01_[360p].mp4/file",
"https://www.mediafire.com/file/r4m36nj5uxeb2bc/Loli_2/file",
"https://www.mediafire.com/file/4fovfnzfr1lly7t/[NekoPoi]_Gishi_wa_yen_mama_-_02_[360p].mp4/file",
"https://www.mediafire.com/file/p00uurvok3quleh/%255BNekoHanime%255DKotowarenai_Haha_01_360P.mp4/file",
"https://www.mediafire.com/file/n0jxq5qcmyr40ej/%255BNekoHanime%255D_Baka_na_Imouto_eps_1.zip/file",
"https://www.mediafire.com/file/ovq3b4g4h9d28y9/%255BNekoHanime%255D_Baka_na_Imouto_eps_2.mp4/file",
"https://www.mediafire.com/file/po4szmxij1tp2m2/%255BNekoHanime%255D_Baka_na_Imouto_eps_3.mp4/file",
"https://www.mediafire.com/file/3s5ipicuko9ccgi/%255BNekoHanime%255D_Baka_na_Imouto_eps_4.mp4/file"
]
    let Reza = nekopoi[Math.floor(Math.random() * nekopoi.length)];
	 const data = await mediaFire(Reza); 
      const result = data.url
      /*res.status(200).json({
        status: true,
        result,
      });*/
      const imageResponse = await axios.get(
        result,
        { responseType: "arraybuffer" },
      )

      // Mengatur header response
      res.writeHead(200, {
        "Content-Type": "video/mp4",
        "Content-Length": imageResponse.data.length,
      })

      // Mengirimkan data gambar
      res.end(imageResponse.data)
    } catch (error) {
      console.error("Error in /nsfw/nekopoi:", error); // Tambahkan logging untuk kesalahan
      res.status(500).json({ status: false, error: error.message });
    }
  });
};
