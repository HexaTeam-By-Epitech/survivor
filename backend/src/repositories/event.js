const prisma = require('@config/prisma');

class Event {
    static countAll() {
        return prisma.events.count();
    }

    static getAllPaginated({ skip, take }) {
        return prisma.events.findMany({
            skip: skip || 0,
            take: take || 10,
            orderBy: {
                id: 'desc'
            },
            include: {
                EventDates: true,
                EventsCategories: true,
                TargetAudiences: true
            }
        });
    }

    static async getById(id) {
        return prisma.events.findUnique({
            where: { id },
            include: {
                EventDates: true,
                EventsCategories: true,
                TargetAudiences: true
            }
        });
    }

    static async create(data) {
        return prisma.events.create({
            data,
            include: {
                EventDates: true,
                EventsCategories: true,
                TargetAudiences: true
            }
        });
    }

    static async createWithDate(eventData, eventDate) {
        return prisma.$transaction(async (tx) => {
            // Create the event first
            const event = await tx.events.create({
                data: eventData,
                include: {
                    EventDates: true,
                    EventsCategories: true,
                    TargetAudiences: true
                }
            });

            // Then create the event date
            if (eventDate) {
                await tx.EventDates.create({
                    data: {
                        date: new Date(eventDate),
                        event_id: event.id
                    }
                });
            }

            // Return the event with its dates
            return tx.events.findUnique({
                where: { id: event.id },
                include: {
                    EventDates: true,
                    EventsCategories: true,
                    TargetAudiences: true
                }
            });
        });
    }

    static async update(id, data) {
        return prisma.events.update({
            where: { id },
            data
        });
    }

    static async delete(id) {
        return prisma.events.delete({
            where: { id }
        });
    }
}

module.exports = Event;
