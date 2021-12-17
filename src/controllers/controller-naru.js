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

const sendPiket = async (req, res) => {
    const { tanggal, shift } = req.query;
    const whereTanggal = tanggal ? tanggal : "DATE(NOW())";
    const sql = `SELECT nama,divisi,nik,nomor FROM piketnaru WHERE tanggal = ? AND shift = ?`;
    const param = [whereTanggal, shift];

    const tanggalShow = format(new Date(tanggal), "cccc, dd MMMM yyyy", { locale: id });
    
    try {
        const [rows] = await pool.query(sql, param);
        const dataShow = rows.map(row => {
            return `*${row.divisi}:*\n${row.nama} _(+62${row.nomor})_\n`;
        });
        const message = `*Piket Naru 2021*\n\n${tanggalShow}\n${shiftFunction(shift)} \n\n${dataShow.join("\n")}`;
        
        if (rows.length > 0) {
            const { data } = await sendMessage('62811545857-1633499054', message);
            const sendToAll = rows.map(row => {
                return sendMessage(`62${row.nomor}`, message);
            });
            sendToAll.push(sendMessage('628115420582', message));
            sendToAll.push(sendMessage('62811590030', message));
            Promise.all(sendToAll);
            console.log(data);
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