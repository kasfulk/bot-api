import pool from "../helpers/db.js";
import { parseISO, format } from 'date-fns';
import { id } from 'date-fns/locale/index.js';
import { sendMessage } from "../helpers/bot-wa.js";
import { shiftFunction } from "../utils/util.js";

const getPiket = async (req, res) => {
    const { tanggal, shift } = req.query;
    const whereTanggal = tanggal ? tanggal : "DATE(NOW())";
    const sql = `SELECT * FROM piketnaru WHERE tanggal = ? AND shift = ?`;
    const param = [whereTanggal, shift];
    try {
        const [rows] = await pool.query(sql, param);
        res.send(rows);
    }
    catch (err) {
        console.log(err);
        res.send(err);
    }
};

// for broadcasting
const sendPiket = async (req, res) => {
    const { tanggal, shift } = req.query;
    const whereTanggal = tanggal ? tanggal : "DATE(NOW())";
    const sql = `SELECT nama,divisi,nik,nomor FROM piketnaru WHERE tanggal = ? AND shift = ?`;
    const param = [whereTanggal, shift];

    const tanggalShow = format(new Date(tanggal), "cccc, dd MMMM yyyy", { locale: id });
    
    try {
        const [rows] = await pool.query(sql, param);
        const dataShow = rows.map(row => {
            return `*${row.divisi}:*\n_${row.nama}_ (+62${row.nomor})\n`;
        });
        const message = `*Piket Naru 2021*\n\n${tanggalShow}\n${shiftFunction(shift)} \n\n${dataShow.join("\n")}\n\n*Dashboard HQ:*\nhttp://10.54.36.55:50000/dessy\n- user: admin\n- pass: ADMportal#2021\nLink per fitur:\n1. Subscribers Movement: \nhttp://10.54.36.55/dessy-movement/public/\n2. POI Monitoring (dilakukan share screen oleh Co-leader Posko): \nhttp://10.54.36.55:50000/dessy-naru\n3. Network Performance: \nhttp://10.54.36.55:3006/naru/home\n\n*Dashboard Regional:*\nhttps://kalimantan.telkomsel.co.id/grafana/d/nobYOFOnk/dashboard-naru-kalimantan-2021?orgId=1\n\n*Absen logbook NARU HQ*\nhttp://10.54.36.55:9004/dessy-tracking/login\n- user: all_activity\n- pass: all_activity#2021\n\n*Link Vicon HQ*\nhttp://tsel.me/PoskoNARU2021\n*Link Vicon HQ Backup*\nhttp://bit.ly/BackupRoomNaru2021\n*Link Vicon Telkom Group*\nhttps://bit.ly/PoskoNARU2021Telkom\n- passcode naru21222\n*Link Vicon Regional-NS*\nhttps://us02web.zoom.us/j/5673105992?pwd=S1lFYUpHUldvU2UxTFV2a2RqbmdnUT09\nMeeting ID: 567 310 5992 \nPasscode: SbN24V\n*Link gdocs Posko Regional NS untuk update MSI/Ticket/POI down*\nhttps://docs.google.com/spreadsheets/d/1_IEZWUCArXQH2vcYzH7dHY1_azFgUlnevoRcoBKsw88/edit#gid=0`;
        
        if (rows.length > 0) {
            const listGroup = [
                '62811545857-1633499054', // power ranger
                '62811179706-1632703035', // Panitia NARU Kalimantan
                '62811540097-1600921144', // NARU KALIMANTAN
            ];

            const sendTo = listGroup.map(group => {
                return sendMessage(group, message);
            });

            const result = await Promise.all(sendTo);
            console.log(result.map(r => r.data));
        }

        res.send(rows);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};

export default {
    getPiket,
    sendPiket
};