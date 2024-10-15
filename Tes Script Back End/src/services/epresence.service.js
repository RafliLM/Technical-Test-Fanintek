import { AuthorizationError } from "../errors/authorization.error.js"
import { BadRequestError } from "../errors/badrequest.error.js"
import prisma from "../utils/prisma.js"

export default {
    getEpresence: async (user) => {
        const epresences = await prisma.epresence.findMany({
            where: {
                user: {
                    OR: [
                        {
                            id: user.id
                        },
                        {
                            npp_supervisor: user.npp
                        }
                    ]
                }
            },
            include: {
              user: true,
            },
            orderBy: {
              waktu: 'desc'
            }
        })
        const result = []

        const formatTime = (dateStr) => new Date(dateStr).toLocaleTimeString('en-GB', { hour12: false })

        const formatDate = (dateStr) => new Date(dateStr).toISOString().split('T')[0]

        const recordsMap = {}

        epresences.forEach(entry => {
            const userId = entry.id_users;
            const nameUser = entry.user.name;
            const date = formatDate(entry.waktu);
            const time = formatTime(entry.waktu);
            const status = entry.is_approve ? 'APPROVE' : 'NOT APPROVE';

            if (!recordsMap[userId]) {
                recordsMap[userId] = {};
            }
            if (!recordsMap[userId][date]) {
                recordsMap[userId][date] = {
                id_user: userId,
                name_user: nameUser,
                tanggal: date,
                waktu_masuk: null,
                waktu_pulang: null,
                status_masuk: null,
                status_pulang: null
                };
            }

            if (entry.type === 'IN') {
                recordsMap[userId][date].waktu_masuk = time;
                recordsMap[userId][date].status_masuk = status;
            } else if (entry.type === 'OUT') {
                recordsMap[userId][date].waktu_pulang = time;
                recordsMap[userId][date].status_pulang = status;
            }
        })

        for (const userId in recordsMap) {
            for (const date in recordsMap[userId]) {
                result.push(recordsMap[userId][date]);
            }
        }
    
        return result
    },
    epresence: async (data, user) => {
        const start = new Date(data.waktu)
        start.setHours(0, 0, 0, 0)
        const end = new Date(data.waktu)
        end.setHours(23, 59, 59, 999)
        const epresence = await prisma.epresence.findFirst({
            where : {
                user: {
                    id: user.id
                },
                type: data.type,
                waktu: {
                    gte: start,
                    lte: end
                }
            }
        })
        if (epresence)
            throw new BadRequestError("Sudah melakukan epresence sebelumnnya!")
        await prisma.epresence.create({
            data: {
                id_users: user.id,
                type: data.type,
                is_approve: false,
                waktu: new Date(data.waktu)
            }
        })
        return "Berhasil melakukan epresence!"
    },
    approveEpresence : async (epresenceId, user) => {
        const epresence = await prisma.epresence.findUniqueOrThrow({
            where: {
                id: epresenceId
            },
            include: {
                user: true
            }
        })
        if (epresence.user.npp_supervisor != user.npp && epresence.user.npp_supervisor != null)
            throw new AuthorizationError("Epresence hanya dapat di approve oleh supervisor!")
        if (epresence.is_approve)
            throw new BadRequestError("Epresence sudah di approve sebelumnya!")
        await prisma.epresence.update({
            where: {
                id: epresenceId
            },
            data: {
                is_approve: true
            }
        })
        return "Berhasil melakukan approve epresence!"
    }
}