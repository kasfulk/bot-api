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
            return `*${row.divisi}:*\n_${row.nama}_ (+62${row.nomor})\n`;
        });
        const message = `*Piket Naru 2021*\n\n${tanggalShow}\n${shiftFunction(shift)} \n\n${dataShow.join("\n")}`;
        
        if (rows.length > 0) {
            const listGroup = [
                '62811545857-1633499054', // power ranger
                '62811179706-1632703035', // Panitia NARU Kalimantan
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